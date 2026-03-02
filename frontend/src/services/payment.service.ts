import api from '../utils/api';
import type { Consumer } from './consumer.service';
import type { Bill } from './bill.service';

export interface Payment {
    _id: string;
    billId: string | Bill;
    consumerId: string | Consumer;
    amountPaid: number;
    paymentMethod: 'cash' | 'card' | 'online' | 'other';
    paymentDate: string;
    transactionId: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: string;
}

export interface RecordPaymentData {
    billId: string;
    consumerId: string;
    amountPaid: number;
    paymentMethod: 'cash' | 'card' | 'online' | 'other';
}

export interface PaymentQueryParams {
    page?: number;
    limit?: number;
    consumerId?: string;
    paymentMethod?: string;
}

export interface PaginatedPaymentsResponse {
    payments: Payment[];
    pagination: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        hasNextPage: boolean;
    };
}

const paymentService = {
    recordPayment: async (data: RecordPaymentData) => {
        const response = await api.post('/payment', data);
        return response.data;
    },

    getAllPayments: async (params?: PaymentQueryParams) => {
        const response = await api.get('/payment', { params });
        return response.data;
    },

    getPaymentsByBill: async (billId: string) => {
        const response = await api.get(`/payment/bill/${billId}`);
        return response.data;
    },

    getPaymentHistoryByConsumer: async (consumerId: string, params?: { page?: number; limit?: number }) => {
        const response = await api.get(`/payment/consumer/${consumerId}`, { params });
        return response.data;
    },
};

export default paymentService;
