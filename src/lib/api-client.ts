import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export interface RequestOptions {
  params?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
}

const instance = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authorization header dynamically
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to format error responses into ApiError
instance.interceptors.response.use(
  (response) => {
    // If status is 204 or data is empty, return empty object
    if (response.status === 204 || !response.data) {
      return {};
    }
    return response.data;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data;
      
      const errorObj = data as Record<string, unknown> | undefined;
      const errorMessage = typeof errorObj?.message === 'string'
        ? errorObj.message
        : error.message || 'Terjadi kesalahan pada request';

      return Promise.reject(new ApiError(status, errorMessage, data));
    }
    
    const err = error instanceof Error ? error : new Error('Terjadi kesalahan sistem');
    return Promise.reject(new ApiError(500, err.message, err));
  }
);

export interface CustomAxiosInstance extends Omit<AxiosInstance, 'get' | 'post' | 'put' | 'delete' | 'patch' | 'request'> {
  get<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  post<T = unknown, R = T, D = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig<D>): Promise<R>;
  put<T = unknown, R = T, D = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig<D>): Promise<R>;
  delete<T = unknown, R = T, D = unknown>(url: string, config?: AxiosRequestConfig<D>): Promise<R>;
  patch<T = unknown, R = T, D = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig<D>): Promise<R>;
  request<T = unknown, R = T, D = unknown>(config: AxiosRequestConfig<D>): Promise<R>;
}

export const apiClient = instance as unknown as CustomAxiosInstance;

