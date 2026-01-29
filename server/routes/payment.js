import express from 'express';
import PaymentRequest from '../models/PaymentRequest.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    next();
};

// Middleware to check if user is admin
const requireAdmin = async (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    const user = await User.findOne({ id: req.session.userId });
    if (!user || !user.isAdmin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    req.adminUser = user;
    next();
};

// User submits a payment request
router.post('/request', requireAuth, async (req, res) => {
    const { transactionId } = req.body;

    if (!transactionId || transactionId.trim().length < 4) {
        return res.status(400).json({ message: 'Valid transaction ID required' });
    }

    try {
        const user = await User.findOne({ id: req.session.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for existing pending request
        const existingRequest = await PaymentRequest.findOne({
            userId: user.id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                message: 'You already have a pending payment request',
                requestId: existingRequest.id
            });
        }

        const paymentRequest = new PaymentRequest({
            id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId: user.id,
            userEmail: user.email,
            userName: user.name,
            transactionId: transactionId.trim(),
            amount: 500
        });

        await paymentRequest.save();

        res.json({
            message: 'Payment request submitted successfully! Please message us on WhatsApp for verification.',
            requestId: paymentRequest.id,
            status: paymentRequest.status
        });

    } catch (error) {
        console.error('Payment request error:', error);
        res.status(500).json({ message: 'Failed to submit payment request' });
    }
});

// User checks their payment request status
router.get('/my-status', requireAuth, async (req, res) => {
    try {
        const requests = await PaymentRequest.find({ userId: req.session.userId })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all pending payment requests
router.get('/pending', requireAdmin, async (req, res) => {
    try {
        const requests = await PaymentRequest.find({ status: 'pending' })
            .sort({ createdAt: 1 }); // Oldest first

        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all payment requests (with optional status filter)
router.get('/all', requireAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { status } : {};

        const requests = await PaymentRequest.find(query)
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Approve a payment request
router.post('/approve/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        const paymentRequest = await PaymentRequest.findOne({ id });

        if (!paymentRequest) {
            return res.status(404).json({ message: 'Payment request not found' });
        }

        if (paymentRequest.status !== 'pending') {
            return res.status(400).json({ message: `Request already ${paymentRequest.status}` });
        }

        // Update payment request
        paymentRequest.status = 'approved';
        paymentRequest.approvedAt = new Date();
        paymentRequest.processedBy = req.adminUser.id;
        await paymentRequest.save();

        // Update user subscription
        const now = new Date();
        const endDate = new Date(now);
        endDate.setMonth(endDate.getMonth() + 1); // 1 month subscription

        await User.updateOne(
            { id: paymentRequest.userId },
            {
                isSubscribed: true,
                subscriptionStartDate: now,
                subscriptionEndDate: endDate
            }
        );

        res.json({
            message: 'Payment approved! User now has access.',
            paymentRequest
        });

    } catch (error) {
        console.error('Approve error:', error);
        res.status(500).json({ message: 'Failed to approve payment' });
    }
});

// Admin: Reject a payment request
router.post('/reject/:id', requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    try {
        const paymentRequest = await PaymentRequest.findOne({ id });

        if (!paymentRequest) {
            return res.status(404).json({ message: 'Payment request not found' });
        }

        if (paymentRequest.status !== 'pending') {
            return res.status(400).json({ message: `Request already ${paymentRequest.status}` });
        }

        paymentRequest.status = 'rejected';
        paymentRequest.rejectedAt = new Date();
        paymentRequest.processedBy = req.adminUser.id;
        paymentRequest.notes = notes || '';
        await paymentRequest.save();

        res.json({
            message: 'Payment request rejected',
            paymentRequest
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to reject payment' });
    }
});

export default router;
