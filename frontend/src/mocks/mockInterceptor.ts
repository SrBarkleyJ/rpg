import { MOCK_USER } from './userData';
import { MOCK_COMBAT, MOCK_DUNGEONS, MOCK_INVENTORY, MOCK_REWARDS, MOCK_TASKS, MOCK_FORGE, MOCK_SKILLS } from './combatData';

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

    // Stats Screen
    if (url.includes('/stats')) {
        return {
            data: {
                ...MOCK_USER,
                calculatedPhysicalDamage: MOCK_USER.stats.strength * 2,
                calculatedMagicalDamage: MOCK_USER.stats.intelligence * 2.5,
                calculatedMaxHP: MOCK_USER.combat.maxHP,
                calculatedCritChance: MOCK_USER.stats.luck * 0.5
            },
            status: 200,
            headers: {}
        };
    }

    // Shop Rewards
    if (url.includes('/rewards')) {
        if (url.includes('/buy')) {
            return {
                data: { success: true, user: MOCK_USER },
                status: 200,
                headers: {}
            };
        }
        return {
            data: MOCK_REWARDS,
            status: 200,
            headers: {}
        };
    }

    // Tasks
    if (url.includes('/tasks')) {
        if (url.includes('/complete')) {
            return {
                data: {
                    success: true,
                    user: MOCK_USER,
                    goldGained: 50,
                    xpGained: 100,
                    leveledUp: false
                },
                status: 200,
                headers: {}
            };
        }
        return {
            data: MOCK_TASKS,
            status: 200,
            headers: {}
        };
    }

    // Forge
    if (url.includes('/forge')) {
        if (url.includes('/upgrade')) {
            return {
                data: { success: true, user: { ...MOCK_USER, tetranuta: MOCK_FORGE.tetranuta - 10 } },
                status: 200,
                headers: {}
            };
        }
        return {
            data: MOCK_FORGE,
            status: 200,
            headers: {}
        };
    }

    // Skills
    if (url.includes('/skills')) {
        if (url.includes('/upgrade')) {
            return {
                data: { success: true, user: MOCK_USER },
                status: 200,
                headers: {}
            };
        }
        return {
            data: MOCK_SKILLS,
            status: 200,
            headers: {}
        };
    }

    // Inventory
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
            data: { dungeons: MOCK_DUNGEONS.dungeons },
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

    // Default fallback
    return {
        data: { message: "Mock endpoint not implemented", url },
        status: 404,
        headers: {}
    };
};
