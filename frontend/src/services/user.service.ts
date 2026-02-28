import api from '../utils/api';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'staff';
    isActive: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface FetchUsersResponse {
    users: User[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export interface UserQueryParams {
    page?: number;
    limit?: number;
    name?: string;
    email?: string;
    role?: string;
    isActive?: string;
}

const userService = {
    getUsers: async (params: UserQueryParams) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                query.append(key, value.toString());
            }
        });
        const response = await api.get(`/user/fetch-users?${query.toString()}`);
        return response.data;
    },

    updateUser: async (id: string, updates: Partial<User>) => {
        const response = await api.put(`/user/update/${id}`, updates);
        return response.data;
    },

    deleteUser: async (id: string) => {
        const response = await api.delete(`/user/delete/${id}`);
        return response.data;
    },

    getCurrentUser: async () => {
        const response = await api.get('/user/me');
        return response.data;
    }
};

export default userService;
