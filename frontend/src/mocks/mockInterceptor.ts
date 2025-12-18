import { MOCK_USER } from './userData';
import { MOCK_COMBAT, MOCK_DUNGEONS } from './combatData';

export interface MockResponse {
    data: any;
    status: number;
    headers: any;
}

export const handleMockRequest = async (config: any): Promise<MockResponse> => {
    const { url, method } = config;

    console.log(`[Mock API] Intercepting ${method?.toUpperCase()} ${url}`);

    // Auth
    if (url.includes('/auth/login') || url.includes('/auth/register')) {
        return {
            data: { token: 'mock_token', user: MOCK_USER },
            status: 200,
            headers: {}
        };
    }

    // User / Stats
    if (url.includes('/user/profile') || url.includes('/stats')) {
        return {
            data: MOCK_USER,
            status: 200,
            headers: {}
        };
    }

    // Combat
    if (url.includes('/combat/dungeons')) {
        return {
            data: MOCK_DUNGEONS,
            status: 200,
            headers: {}
        };
    }

    if (url.includes('/combat/initiate') || url.includes('/combat/auto')) {
        return {
            data: MOCK_COMBAT,
            status: 200,
            headers: {}
        };
    }

    if (url.includes('/combat/action')) {
        return {
            data: {
                ...MOCK_COMBAT,
                log: [...MOCK_COMBAT.log, { actor: 'Player', message: 'You attack the enemy!' }]
            },
            status: 200,
            headers: {}
        };
    }

    // Default fallback
    return {
        data: { message: "Mock endpoint not implemented" },
        status: 404,
        headers: {}
    };
};
