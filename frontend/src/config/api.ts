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
        return 'https://rpg-backend-hq1r.onrender.com';
    } else if (Platform.OS === 'android') {
        // Production Backend
        return 'https://rpg-backend-hq1r.onrender.com';
    } else {
        // iOS/Web fallback
        return 'https://rpg-backend-hq1r.onrender.com';
    }
};

export const BASE_URL = getBaseURL();
export const API_URL = `${BASE_URL}/api`;

export default {
    API_URL,
    BASE_URL
};
