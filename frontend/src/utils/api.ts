import axios from 'axios';
import { ApiError } from './ApiError.ts'; // We will create a frontend version or just handle plain objects

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Unified error handling
        const message = error.response?.data?.message || 'Something went wrong';
        const statusCode = error.response?.status || 500;
        const errors = error.response?.data?.errors || [];

        // Return a rejected promise with our custom ApiError
        return Promise.reject(new ApiError(statusCode, message, errors));
    }
);

export default axiosInstance;