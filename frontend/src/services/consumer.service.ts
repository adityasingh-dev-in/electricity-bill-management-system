import api from '../utils/api';

export interface Consumer {
    _id: string;
    name: string;
    phone: string;
    houseNumber: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    meterNumber: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Pagination {
    total: number;
    page: number;
    pages: number;
    hasNextPage: boolean;
}

export interface FetchConsumersResponse {
    consumers: Consumer[];
    pagination: Pagination;
}

export interface ConsumerQueryParams {
    page?: number;
    limit?: number;
    name?: string;
    meterNumber?: string;
    phone?: string;
    city?: string;
    sortBy?: string;
}

const consumerService = {
    getConsumers: async (params: ConsumerQueryParams) => {
        const response = await api.get('/consumer', { params });
        return response.data;
    },

    createConsumer: async (data: Omit<Consumer, '_id'>) => {
        const response = await api.post('/consumer', data);
        return response.data;
    },

    updateConsumer: async (id: string, data: Partial<Consumer>) => {
        const response = await api.put(`/consumer/${id}`, data);
        return response.data;
    },

    deleteConsumer: async (id: string) => {
        const response = await api.delete(`/consumer/${id}`);
        return response.data;
    }
};

export default consumerService;
