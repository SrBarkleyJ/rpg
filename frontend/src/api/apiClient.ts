import axios, { AxiosError, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';
import { log } from '../utils/logger';
log(`[API Client] Base URL: ${API_URL}`);

const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Retry logic for network failures
const MAX_RETRIES = 2;
let retryCount = 0;

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
        retryCount = 0; // Reset retry count on success
        return response;
    },
    async (error: AxiosError) => {
        const config = error.config as any;

        // Handle token expiration (401 Unauthorized)
        if (error.response?.status === 401) {
            console.error('[API] Token expired or invalid (401)');
            // Clear stored auth data
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');

            // Optionally navigate to login - this would need to be passed via context
            // For now, just reject the promise and let the component handle it
        }

        // Retry logic for network errors (but not for 4xx/5xx responses)
        if (error.code && !error.response && retryCount < MAX_RETRIES) {
            retryCount++;
            console.warn(`[API] Retrying request (attempt ${retryCount}/${MAX_RETRIES})...`);

            // Wait before retrying (exponential backoff: 1s, 2s)
            await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));

            return apiClient.request(config);
        }

        // Log detailed error information
        if (error.code === 'ECONNABORTED') {
            console.error('[API] Request timeout - server may not be running or network is slow');
        } else if (error.message === 'Network Error' || error.code === 'ENOTFOUND') {
            console.error(`[API] Network error - could not connect to backend at ${API_URL}`);
        } else if (error.response) {
            console.error('[API] Error:', error.response?.status, error.message);
        } else {
            console.error('[API] Unexpected error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default apiClient;
