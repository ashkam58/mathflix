import mongoose from 'mongoose';

const paymentRequestSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    amount: { type: Number, default: 500 }, // ₹500
    transactionId: { type: String, required: true }, // User-provided UPI reference
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    rejectedAt: { type: Date },
    processedBy: { type: String }, // Admin ID who processed
    notes: { type: String } // Admin notes
});

// Index for faster lookups
paymentRequestSchema.index({ userId: 1 });
paymentRequestSchema.index({ status: 1 });
paymentRequestSchema.index({ userEmail: 1 });

const PaymentRequest = mongoose.model('PaymentRequest', paymentRequestSchema);

export default PaymentRequest;
