import { MOCK_USER } from './userData';
import { MOCK_COMBAT, MOCK_DUNGEONS, MOCK_INVENTORY } from './combatData';

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

    // User Profile
    if (url.includes('/user/profile')) {
        return {
            data: MOCK_USER,
            status: 200,
            headers: {}
        };
    }

    // Generic Stats (sometimes requested separately)
    if (url.includes('/stats')) {
        return {
            data: MOCK_USER.stats,
            status: 200,
            headers: {}
        };
    }

    // Inventory - IMPORTANT: Frontend expects response.data.data.inventory
    if (url.includes('/inventory')) {
        return {
            data: {
                success: true,
                data: {
                    inventory: MOCK_INVENTORY,
                    equipped: MOCK_INVENTORY.filter(i => i.equipped),
                    equipmentBonuses: {},
                    user: {
                        gold: MOCK_USER.gold,
                        stats: MOCK_USER.stats,
                        combat: MOCK_USER.combat
                    }
                }
            },
            status: 200,
            headers: {}
        };
    }

    // Combat Dungeons
    if (url.includes('/combat/dungeons')) {
        return {
            data: MOCK_DUNGEONS,
            status: 200,
            headers: {}
        };
    }

    // Combat Initiation
    if (url.includes('/combat/initiate') || url.includes('/combat/auto')) {
        return {
            data: MOCK_COMBAT,
            status: 200,
            headers: {}
        };
    }

    // Combat Actions
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
