import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
    type AxiosResponse
} from 'axios';
import { ApiError } from './ApiError.ts';

// 1. Define the shape of your Backend's Error Response
interface BackendErrorResponse {
    message: string;
    errors?: string[];
    success: boolean;
}

// 2. Define the Queue structure
interface FailedRequest {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}

// 3. Extend Axios config for the retry flag
// Note: We use 'interface' here which is inherently a type
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 10000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: Error | null): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<BackendErrorResponse>) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        const statusCode = error.response?.status ?? 500;
        const message = error.response?.data?.message ?? 'Something went wrong';
        const errorData = error.response?.data?.errors ?? [];

        // If it's a 401 and we haven't retried yet
        if (statusCode === 401 && !originalRequest._retry) {
            // If already refreshing, queue this request
            if (isRefreshing) {
                return new Promise<AxiosResponse>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((err: unknown) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh endpoint using base axios to avoid interceptor loop
                await axios.post(
                    'http://localhost:5000/api/v1/auth/refresh-token',
                    {},
                    { withCredentials: true }
                );

                isRefreshing = false;
                processQueue(null);

                return axiosInstance(originalRequest);
            } catch (refreshError: unknown) {
                isRefreshing = false;
                const finalError = refreshError instanceof Error ? refreshError : new Error('Refresh failed');
                processQueue(finalError);

                // Clear state or redirect if refresh fails
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(new ApiError(401, "Session expired. Please login again."));
            }
        }

        return Promise.reject(new ApiError(statusCode, message, errorData));
    }
);

export default axiosInstance;