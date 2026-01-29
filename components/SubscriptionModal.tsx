import React, { useState, useEffect } from 'react';
import { Check, X, Smartphone, Loader2, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Button } from './Button';
import { submitPaymentRequest, getMyPaymentStatus, PaymentRequest } from '../services/paymentService';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<PaymentRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      checkExistingRequest();
    }
  }, [isOpen]);

  const checkExistingRequest = async () => {
    setLoading(true);
    try {
      const { requests } = await getMyPaymentStatus();
      const pending = requests.find(r => r.status === 'pending');
      setPendingRequest(pending || null);
    } catch (e) {
      // Ignore
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      setError('Please enter your UPI transaction ID');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await submitPaymentRequest(transactionId.trim());
      setSuccess(true);
      setTransactionId('');
      // Refresh status
      await checkExistingRequest();
    } catch (e: any) {
      setError(e.message || 'Failed to submit request');
    }

    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto">
      <div className="relative bg-white text-black w-full max-w-md rounded-lg p-8 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X />
        </button>

        <h2 className="text-2xl font-bold mb-2">Subscribe to MathFlix Premium</h2>
        <p className="text-gray-600 mb-6">Unlock all coding games, Rubik's cube solvers, and advanced math challenges.</p>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : pendingRequest ? (
          // Show pending request status
          <div className="mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-2">
                <Clock size={20} />
                Payment Verification Pending
              </div>
              <p className="text-sm text-yellow-600">
                Your payment request is being verified. Please message us on WhatsApp with your email for faster verification.
              </p>
              <div className="mt-3 text-xs text-gray-500">
                <p>Transaction ID: <code className="bg-gray-100 px-1 rounded">{pendingRequest.transactionId}</code></p>
                <p>Submitted: {new Date(pendingRequest.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <a
              href="https://wa.me/918002416363?text=Hi!%20I%20made%20a%20payment%20for%20MathFlix%20Premium.%20My%20transaction%20ID%20is%20"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={20} />
              Contact on WhatsApp
            </a>
          </div>
        ) : success ? (
          // Show success message
          <div className="mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                <CheckCircle size={20} />
                Payment Request Submitted!
              </div>
              <p className="text-sm text-green-600">
                Now message us on WhatsApp to complete verification.
              </p>
            </div>

            <a
              href="https://wa.me/918002416363?text=Hi!%20I%20made%20a%20payment%20for%20MathFlix%20Premium.%20My%20email%20is%20"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              <MessageCircle size={20} />
              Complete Verification on WhatsApp
            </a>
          </div>
        ) : (
          // Show payment form
          <div className="mb-6 border-t border-b border-gray-200 py-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Monthly Price</span>
              <span className="text-xl font-bold">₹500</span>
            </div>

            {/* Step 1: UPI ID */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                Pay via UPI
              </p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between bg-white p-3 rounded border border-gray-300">
                  <code className="text-lg font-mono font-bold text-blue-600 select-all">ashkam58-1@oksbi</code>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Copy the UPI ID above to pay using GPay, PhonePe, or Paytm.
                </p>
              </div>
            </div>

            {/* Step 2: Enter Transaction ID */}
            <div className="bg-gray-50 p-4 rounded-lg mt-4 border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                Enter Transaction ID
              </p>
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="e.g., 123456789012"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Find this in your UPI app payment history (12-digit reference number)
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm mt-3 bg-red-50 p-2 rounded">
                <XCircle size={16} />
                {error}
              </div>
            )}

            <ul className="space-y-2 mt-4">
              <li className="flex items-center gap-2 text-sm text-gray-700"><Check size={16} className="text-green-600" /> Unlimited Access to all Games</li>
              <li className="flex items-center gap-2 text-sm text-gray-700"><Check size={16} className="text-green-600" /> Ad-free Experience</li>
            </ul>
          </div>
        )}

        {!loading && !pendingRequest && !success && (
          <>
            <Button
              onClick={handleSubmit}
              className="w-full py-3 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  Submitting...
                </span>
              ) : (
                'Submit Payment Request'
              )}
            </Button>
            <p className="text-center text-xs text-gray-500 mt-4">
              After submitting, verify by contacting <a href="https://wa.me/918002416363" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline font-bold">+91-8002416363</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
};