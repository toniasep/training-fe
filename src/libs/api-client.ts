import axios from 'axios';


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
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
    return response;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const data = error.response?.data;
      
      const errorObj = data as Record<string, unknown> | undefined;
      const errorMessage = typeof errorObj?.message === 'string'
        ? errorObj.message
        : error.message || 'Terjadi kesalahan pada request';

      // Global auth failure handler: clear session and redirect to login page
      if (status === 401) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      return Promise.reject(new ApiError(status, errorMessage, data));
    }
    
    const err = error instanceof Error ? error : new Error('Terjadi kesalahan sistem');
    return Promise.reject(new ApiError(500, err.message, err));
  }
);

export const apiClient = instance;

