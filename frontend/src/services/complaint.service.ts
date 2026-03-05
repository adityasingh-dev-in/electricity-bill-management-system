import api from '../utils/api';

export interface Complaint {
    _id: string;
    consumerId: {
        _id: string;
        name: string;
        meterNumber: string;
        phoneNumber?: string;
    };
    createdBy: {
        _id: string;
        name: string;
        email: string;
    };
    Title: string;
    description: string;
    area: string;
    city: string;
    pincode: number;
    importance: 'low' | 'medium' | 'high';
    status: 'pending' | 'resolved';
    createdAt: string;
    resolvedAt?: string;
    updatedAt?: string;
}

export interface ComplaintStats {
    total: number;
    pending: number;
    resolved: number;
}

export interface FetchComplaintsResponse {
    complaints: Complaint[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ComplaintQueryParams {
    page?: number;
    limit?: number;
    area?: string;
    city?: string;
    pincode?: number;
    importance?: string;
    status?: string;
}

const complaintService = {
    getAllComplaints: async (params: ComplaintQueryParams): Promise<FetchComplaintsResponse> => {
        const response = await api.get('/complaint', { params });
        return response.data.data;
    },

    getComplaintById: async (id: string): Promise<Complaint> => {
        const response = await api.get(`/complaint/${id}`);
        return response.data.data;
    },

    getConsumerComplaints: async (meterNumber: string): Promise<Complaint[]> => {
        const response = await api.get(`/complaint/consumer/${meterNumber}`);
        return response.data.data;
    },

    createComplaint: async (data: Partial<Complaint>) => {
        const response = await api.post('/complaint', data);
        return response.data;
    },

    updateComplaint: async (data: Partial<Complaint> & { id: string }) => {
        const response = await api.put('/complaint', data);
        return response.data;
    },

    updateStatus: async (id: string, status: 'pending' | 'resolved') => {
        const response = await api.patch('/complaint/status', { id, status });
        return response.data;
    },

    deleteComplaint: async (id: string) => {
        const response = await api.delete(`/complaint/delete/${id}`);
        return response.data;
    }
};

export default complaintService;
