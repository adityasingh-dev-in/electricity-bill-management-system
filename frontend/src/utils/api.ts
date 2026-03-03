/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
    type AxiosResponse
} from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

interface BackendErrorResponse {
    message: string;
    errors?: string[];
    success: boolean;
}

interface FailedRequest {
    resolve: (token?: any) => void;
    reject: (reason?: any) => void;
}

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // Increased slightly for Render "cold starts"
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null): void => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // If the response contains tokens in the standard data.data wrapper, store them
        if (response.data?.data?.accessToken) {
            localStorage.setItem('accessToken', response.data.data.accessToken);
        }
        if (response.data?.data?.refreshToken) {
            localStorage.setItem('refreshToken', response.data.data.refreshToken);
        }
        return response;
    },
    async (error: AxiosError<BackendErrorResponse>) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        const statusCode = error.response.status;

        // 401 Unauthorized handling
        if (statusCode === 401 && !originalRequest._retry) {

            // if we are already trying to refresh and it fails, logout
            if (originalRequest.url?.includes('/auth/refresh-token')) {
                isRefreshing = false;
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }

            // If a refresh is already in progress, queue this request
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Try refreshing with the token from localStorage
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(
                    `${BASE_URL}/auth/refresh-token`,
                    { refreshToken },
                    { withCredentials: true }
                );

                // Assuming the refresh-token endpoint returns { accessToken, refreshToken } directly or in .data
                const newAccessToken = response.data.accessToken || response.data.data?.accessToken;
                const newRefreshToken = response.data.refreshToken || response.data.data?.refreshToken;

                if (newAccessToken) localStorage.setItem('accessToken', newAccessToken);
                if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                isRefreshing = false;
                processQueue(null);

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError: any) {
                isRefreshing = false;
                processQueue(refreshError);

                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;