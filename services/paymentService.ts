// Payment service for handling UPI payment requests

export interface PaymentRequest {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    amount: number;
    transactionId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    approvedAt?: string;
    rejectedAt?: string;
    processedBy?: string;
    notes?: string;
}

const API_URL = process.env.VITE_API_URL || '';

export const submitPaymentRequest = async (transactionId: string): Promise<{ message: string; requestId: string; status: string }> => {
    const res = await fetch(`${API_URL}/api/payment/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ transactionId })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to submit payment request');
    }

    return await res.json();
};

export const getMyPaymentStatus = async (): Promise<{ requests: PaymentRequest[] }> => {
    const res = await fetch(`${API_URL}/api/payment/my-status`, {
        credentials: 'include'
    });

    if (!res.ok) {
        return { requests: [] };
    }

    return await res.json();
};

// Admin functions
export const getPendingPayments = async (): Promise<{ requests: PaymentRequest[] }> => {
    const res = await fetch(`${API_URL}/api/payment/pending`, {
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch pending payments');
    }

    return await res.json();
};

export const getAllPayments = async (status?: string): Promise<{ requests: PaymentRequest[] }> => {
    const url = status ? `${API_URL}/api/payment/all?status=${status}` : `${API_URL}/api/payment/all`;
    const res = await fetch(url, {
        credentials: 'include'
    });

    if (!res.ok) {
        throw new Error('Failed to fetch payments');
    }

    return await res.json();
};

export const approvePayment = async (id: string): Promise<{ message: string; paymentRequest: PaymentRequest }> => {
    const res = await fetch(`${API_URL}/api/payment/approve/${id}`, {
        method: 'POST',
        credentials: 'include'
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to approve payment');
    }

    return await res.json();
};

export const rejectPayment = async (id: string, notes?: string): Promise<{ message: string; paymentRequest: PaymentRequest }> => {
    const res = await fetch(`${API_URL}/api/payment/reject/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to reject payment');
    }

    return await res.json();
};
