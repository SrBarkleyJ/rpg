import { Platform } from 'react-native';

/**
 * Unified API Configuration
 * Supports both local development and production deployment
 * 
 * Priority order:
 * 1. EXPO_PUBLIC_API_URL environment variable (Production)
 * 2. EXPO_PUBLIC_API_HOST if needing dynamic construction
 * 3. Platform-specific defaults for development
 * 
 * For local development on real device/LAN:
 * Set EXPO_PUBLIC_API_URL=http://<your-machine-ip>:4000
 * Example: http://192.168.1.100:4000
 */

const getBaseURL = (): string => {
    // 1. Prioritize Environment Variable (for Production/Preview)
    if (process.env.EXPO_PUBLIC_API_URL) {
        console.log('ℹ️ Using EXPO_PUBLIC_API_URL:', process.env.EXPO_PUBLIC_API_URL);
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // 2. Use EXPO_PUBLIC_API_HOST if provided (useful for dynamic configuration)
    if (process.env.EXPO_PUBLIC_API_HOST) {
        const port = process.env.EXPO_PUBLIC_API_PORT || '4000';
        const url = `http://${process.env.EXPO_PUBLIC_API_HOST}:${port}`;
        console.log('ℹ️ Using EXPO_PUBLIC_API_HOST:', url);
        return url;
    }

    // 3. Fallback to Platform-specific Development Defaults
    // UPDATED: Android now tries emulator first, then falls back to localhost for physical device
    let defaultUrl: string;
    
    if (Platform.OS === 'web') {
        defaultUrl = 'http://localhost:4000';
    } else if (Platform.OS === 'android') {
        // Try 10.0.2.2 for Android Emulator (special IP for host machine)
        // For physical device, update EXPO_PUBLIC_API_URL to your machine's local IP
        // Example: http://192.168.1.100:4000
        defaultUrl = 'http://10.0.2.2:4000';
    } else {
        // iOS/other platforms - use localhost or update for real device
        defaultUrl = 'http://localhost:4000';
    }

    console.warn('⚠️ No API URL configured. Using platform default:', defaultUrl);
    console.warn('   For physical devices, set EXPO_PUBLIC_API_URL=http://<your-machine-ip>:4000');
    return defaultUrl;
};

export const BASE_URL = getBaseURL();
export const API_URL = `${BASE_URL}/api`;

console.log('🔗 API Configuration:', { BASE_URL, API_URL });

export default {
    API_URL,
    BASE_URL
};
