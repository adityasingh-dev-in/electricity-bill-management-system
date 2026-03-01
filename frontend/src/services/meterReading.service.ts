import api from '../utils/api';
import type { Consumer } from './consumer.service';

export interface MeterReading {
    _id: string;
    consumerId: string | Consumer;
    readingMonth: string;
    readingYear: number;
    previousReading: number;
    currentReading: number;
    unitsConsumed: number;
    recordedBy: string | { name: string };
    recordedAt: string;
}

export interface CreateMeterReadingData {
    meterNumber: string;
    currentReading: number;
    month: string;
    year: number;
}

const meterReadingService = {
    createMeterReading: async (data: CreateMeterReadingData) => {
        const response = await api.post('/meter-reading', data);
        return response.data;
    },

    getAllMeterReadings: async () => {
        const response = await api.get('/meter-reading');
        return response.data;
    },

    getConsumerDetailsByMeter: async (meterNumber: string) => {
        const response = await api.get(`/meter-reading/consumer/${meterNumber}`);
        return response.data;
    },

    getMeterReadingById: async (id: string) => {
        const response = await api.get(`/meter-reading/${id}`);
        return response.data;
    },

    deleteMeterReading: async (id: string) => {
        const response = await api.delete(`/meter-reading/${id}`);
        return response.data;
    }
};

export default meterReadingService;
