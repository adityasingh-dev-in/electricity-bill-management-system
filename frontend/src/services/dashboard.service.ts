import api from '../utils/api';
import type { Bill } from './bill.service';
import type { Consumer } from './consumer.service';

export interface MonthlySummary {
    month: string;
    year: number;
    totalBilled: number;
    totalCollected: number;
    billCount: number;
    pendingBills: number;
    overdueBills: number;
    totalConsumers: number;
}

export interface TrendData {
    month: string;
    billed: number;
    collected: number;
}

export interface OutstandingBill extends Bill {
    consumer: {
        name: string;
        meterNumber: string;
        area: string;
    };
    agingDays: number;
}

export interface ConsumerSummary {
    consumer: Consumer;
    recentBills: Bill[];
    recentPayments: any[];
    stats: {
        totalUnits: number;
        totalBilled: number;
        avgMonthlyUnits: number;
    };
}

const dashboardService = {
    getMonthlySummary: async (): Promise<MonthlySummary> => {
        const response = await api.get('/dashboard/monthly-summary');
        return response.data.data;
    },

    getTrends: async (): Promise<TrendData[]> => {
        const response = await api.get('/dashboard/trends');
        return response.data.data;
    },

    getOutstanding: async (): Promise<OutstandingBill[]> => {
        const response = await api.get('/dashboard/outstanding');
        return response.data.data;
    },

    getConsumerSummary: async (id: string): Promise<ConsumerSummary> => {
        const response = await api.get(`/dashboard/consumer-summary/${id}`);
        return response.data.data;
    }
};

export default dashboardService;
