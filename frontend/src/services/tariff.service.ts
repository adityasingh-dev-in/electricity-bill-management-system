import api from '../utils/api';

export interface TariffData {
    _id?: string;
    ratePerUnit: number;
    fixedCharge: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface TariffHistoryResponse {
    tariff: TariffData[];
    totalTariff: number;
}

const tariffService = {
    getActiveTariff: async () => {
        const response = await api.get('/tariff/');
        return response.data.data;
    },

    getTariffHistory: async (page = 1, limit = 5) => {
        const response = await api.get(`/tariff/history?page=${page}&limit=${limit}`);
        return response.data.data as TariffHistoryResponse;
    },

    createTariff: async (data: Omit<TariffData, '_id' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
        const response = await api.post('/tariff/', data);
        return response.data;
    },

    updateTariff: async (id: string, data: Partial<Pick<TariffData, 'ratePerUnit' | 'fixedCharge'>>) => {
        const response = await api.put(`/tariff/${id}`, data);
        return response.data;
    },

    activateTariff: async (id: string) => {
        const response = await api.patch(`/tariff/${id}/activate`);
        return response.data;
    }
};

export default tariffService;
