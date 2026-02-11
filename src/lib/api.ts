/**
 * Axios Instance Configuration
 * Setup axios dengan base URL dan interceptor untuk Bearer Token
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken } from './token';

/**
 * Base URL dari environment variable
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Axios instance dengan konfigurasi default
 */
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Menambahkan Authorization Bearer token ke setiap request
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Ambil token dari localStorage
    const token = getToken();

    // Jika token ada, tambahkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle response dan error secara global
 */
api.interceptors.response.use(
  (response) => {
    // Return response data langsung
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response) {
      // Server merespon dengan status code di luar 2xx
      const status = error.response.status;

      if (status === 401) {
        // Unauthorized - Token invalid atau expired
        // Bisa redirect ke login atau clear token
        if (typeof window !== 'undefined') {
          // console.error('Unauthorized - Token invalid atau expired');
          // Optional: Clear token dan redirect
          // removeToken();
          // window.location.href = '/login';
        }
      } else if (status === 403) {
        // Forbidden - User tidak punya akses
        console.error('Forbidden - Tidak ada akses');
      } else if (status === 404) {
        // Not Found
        console.error('Resource tidak ditemukan');
      } else if (status >= 500) {
        // Server Error
        console.error('Server error');
      }
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      console.error('Tidak ada response dari server');
    } else {
      // Error lainnya
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
