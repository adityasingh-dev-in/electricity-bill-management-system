/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
    type AxiosResponse
} from 'axios';

interface BackendErrorResponse {
    message: string;
    errors?: string[];
    success: boolean;
}

interface FailedRequest {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}

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
        if (error) prom.reject(error);
        else prom.resolve();
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError<BackendErrorResponse>) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;

        if (!error.response || !originalRequest) {
            return Promise.reject(error);
        }

        const statusCode = error.response.status;

        // Handle 401 errors
        if (statusCode === 401 && !originalRequest._retry) {
            
            // If the call that failed WAS the refresh token itself, 
            // it means the session is totally dead. Redirect to home/login.
            if (originalRequest.url?.includes('/auth/refresh-token')) {
                if (typeof window !== 'undefined' && window.location.pathname !== '/') {
                    window.location.href = '/';
                }
                return Promise.reject(error);
            }

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
                // Try to get a new access token
                await axios.post(
                    'http://localhost:5000/api/v1/auth/refresh-token',
                    {},
                    { withCredentials: true }
                );

                isRefreshing = false;
                processQueue(null);

                // Retry original request (e.g., /user/me)
                return axiosInstance(originalRequest);
            } catch (refreshError: any) {
                isRefreshing = false;
                processQueue(refreshError);

                // If refresh fails and we aren't home, send them home
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