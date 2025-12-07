import { Platform } from 'react-native';

// Unified API Configuration
// Supports both local development and production deployment

const getBaseURL = (): string => {
    if (Platform.OS === 'web') {
        return 'http://localhost:4000';
    } else if (Platform.OS === 'android') {
        // 10.0.2.2 is the special IP for Android emulator to access host machine's localhost
        return 'http://10.0.2.2:4000';
    } else {
        // iOS simulator can use localhost
        return 'http://localhost:4000';
    }
};

export const BASE_URL = getBaseURL();
export const API_URL = `${BASE_URL}/api`;

export default {
    API_URL,
    BASE_URL
};
