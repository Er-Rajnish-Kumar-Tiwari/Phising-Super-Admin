import type { AxiosError, AxiosRequestConfig } from 'axios';
import axios from 'axios';

const axiosClient = axios.create();

// axiosClient.defaults.baseURL = process.env.PUBLIC_BASE_URL;
axiosClient.defaults.baseURL = "http://195.35.21.108:7001";
axiosClient.defaults.timeout = 30 * 1000; 
axiosClient.defaults.headers.Accept = 'application/json';

// Request Interceptor
axiosClient.interceptors.request.use(
  (config) => {
    if (config?.headers) {
      config.headers['authentication'] = localStorage.getItem('token')
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error?.response?.status == 401) {
      localStorage.delete('token')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  },
)

export const GET = (config: AxiosRequestConfig) => axiosClient({ method: 'GET', ...config });

export const POST = (config: AxiosRequestConfig) => axiosClient({ method: 'POST', ...config });

export const PUT = (config: AxiosRequestConfig) => axiosClient({ method: 'PUT', ...config });

export const PATCH = (config: AxiosRequestConfig) => axiosClient({ method: 'PATCH', ...config });

export const DELETE = (config: AxiosRequestConfig) => axiosClient({ method: 'DELETE', ...config });