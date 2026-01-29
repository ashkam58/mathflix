import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Verify Google Token
async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
}

// Google Login Route
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        if (!token) return res.status(400).json({ message: 'Token required' });

        const payload = await verifyGoogleToken(token);
        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user
            user = new User({
                id: googleId, // Use Google ID as user ID
                name,
                email,
                googleId,
                picture,
                isSubscribed: false // Default
            });
            await user.save();
        } else {
            // Update existing user info if needed
            user.googleId = googleId;
            user.picture = picture;
            await user.save();
        }

        // Set session
        req.session.userId = user.id;

        // Return user without sensitive info
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isSubscribed: user.isSubscribed,
            picture: user.picture,
            isAdmin: user.isAdmin
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Standard Login (for existing admin/demo users)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) { // Plain text for now as per previous implementation logic, but should be hashed in real app
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        req.session.userId = user.id;
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isSubscribed: user.isSubscribed,
            picture: user.picture,
            isAdmin: user.isAdmin
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        if (await User.findOne({ email })) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = new User({
            id: Date.now().toString(),
            name,
            email,
            password,
            isSubscribed: false
        });
        await user.save();
        req.session.userId = user.id;
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isSubscribed: user.isSubscribed,
            isAdmin: user.isAdmin
        });
    } catch (err) {
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Get Current User
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const user = await User.findOne({ id: req.session.userId }); // or findById if using _id
        // Note: User model uses 'id' string field, but findOne({id: ...}) searches that field.
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            isSubscribed: user.isSubscribed,
            picture: user.picture,
            isAdmin: user.isAdmin,
            myList: user.myList
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out' });
});

export default router;
