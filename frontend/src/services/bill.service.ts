import api from '../utils/api';
import type { Consumer } from './consumer.service';

export interface Bill {
    _id: string;
    consumerId: string | Consumer;
    meterReadingId: string;
    billMonth: string;
    billYear: number;
    unitsConsumed: number;
    energyCharge: number;
    fixedCharge: number;
    totalAmount: number;
    dueDate: string;
    status: 'pending' | 'paid' | 'overdue';
    paidAt?: string;
    generatedBy: string | { name: string };
    createdAt: string;
}

export interface BillQueryParams {
    month?: string;
    year?: number;
    status?: string;
    generatedBy?: string;
    page?: number;
    limit?: number;
}

const billService = {
    getAllBills: async (params: BillQueryParams) => {
        const response = await api.get('/bill', { params });
        return response.data;
    },

    getBillById: async (id: string) => {
        const response = await api.get(`/bill/${id}`);
        return response.data;
    },

    getBillPDF: async (id: string) => {
        const response = await api.get(`/bill/${id}/pdf`, { responseType: 'blob' });
        return response.data;
    },

    getConsumerBillHistory: async (consumerId: string) => {
        const response = await api.get(`/bill/consumer/${consumerId}`);
        return response.data;
    },

    updateBillStatus: async (id: string, status: string) => {
        const response = await api.patch(`/bill/${id}/status`, { status });
        return response.data;
    },

    deleteBill: async (id: string) => {
        const response = await api.delete(`/bill/${id}`);
        return response.data;
    },

    getMyBills: async (params: BillQueryParams) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                query.append(key, value.toString());
            }
        });
        const response = await api.get(`/bill/my-bills?${query.toString()}`);
        return response.data;
    }
};

export default billService;
