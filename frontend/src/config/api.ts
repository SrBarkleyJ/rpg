import { Platform } from 'react-native';

// Unified API Configuration
// Supports both local development and production deployment

const getBaseURL = (): string => {
    // 1. Prioritize Environment Variable (for Production/Preview)
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // 2. Fallback to Local Development
    if (Platform.OS === 'web') {
        return 'http://localhost:4000';
    } else if (Platform.OS === 'android') {
        // Use local IP for physical Android device testing (Expo Go)
        return 'http://192.168.31.223:4000';
    } else {
        // iOS/Web fallback
        return 'http://192.168.31.223:4000';
    }
};

export const BASE_URL = getBaseURL();
export const API_URL = `${BASE_URL}/api`;

export default {
    API_URL,
    BASE_URL
};
