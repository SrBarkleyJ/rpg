import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { log } from '../utils/logger';

log(`[API Client] Base URL: ${API_URL}`);

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000, // 10 second timeout
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token and log requests
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('[API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - log responses and handle errors
apiClient.interceptors.response.use(
    (response) => {
        log(`[API] Response from ${response.config.url}:`, response.status);
        return response;
    },
    (error) => {
        if (error.code === 'ECONNABORTED') {
            console.error('[API] Request timeout - server may not be running');
        } else if (error.message === 'Network Error') {
            console.error('[API] Network error - check if backend is running on port 4000');
        } else {
            console.error('[API] Error:', error.response?.status, error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient;
