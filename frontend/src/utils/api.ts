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
    timeout: 15000, // Increased slightly for Render "cold starts"
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

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<BackendErrorResponse>) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        // Don't retry if there's no response or it's not a 401
        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        const statusCode = error.response.status;

        // 401 Unauthorized handling
        if (statusCode === 401 && !originalRequest._retry) {
            
            // Critical: If refresh itself fails, log out
            if (originalRequest.url?.includes('/auth/refresh-token')) {
                isRefreshing = false;
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
                // Use the base axios (not the instance) to avoid interceptor loops
                await axios.post(
                    `${BASE_URL}/auth/refresh-token`, 
                    {},
                    { withCredentials: true }
                );

                isRefreshing = false;
                processQueue(null);

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshError: any) {
                isRefreshing = false;
                processQueue(refreshError);

                if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                    // Consider clearing local storage here if you store user data there
                    window.location.href = '/';
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;