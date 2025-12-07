import apiClient from './apiClient';

const startAutoCombat = async () => {
    const response = await apiClient.post('/combat/auto');
    return response.data;
};

const initiateCombat = async () => {
    const response = await apiClient.post('/combat/initiate');
    return response.data;
};

const performAction = async (
    combatId: string,
    action: string,
    itemId?: string | null,
    options: { skillId?: string } = {}
) => {
    const payload: any = { combatId, action };

    if (action === 'use-item' && itemId) {
        payload.itemId = itemId;
    } else if (action === 'skill') {
        payload.skillId = options?.skillId || itemId;
    }

    const response = await apiClient.post('/combat/action', payload);
    return response.data;
};

const rest = async () => {
    const response = await apiClient.post('/combat/rest');
    return response.data;
};

// Nueva función para obtener enemigos
const getEnemies = async () => {
    const response = await apiClient.get('/combat/enemies');
    return response.data;
};

// Nuevas funciones para Dungeons
const getDungeons = async () => {
    const response = await apiClient.get('/combat/dungeons');
    return response.data;
};

const startDungeon = async (dungeonId: string) => {
    const response = await apiClient.post('/combat/dungeon/start', { dungeonId });
    return response.data;
};

const continueDungeon = async (dungeonId: string) => {
    const response = await apiClient.post('/combat/dungeon/continue', { dungeonId });
    return response.data;
};

const getActiveDungeonSession = async (dungeonId: string) => {
    const response = await apiClient.get(`/combat/dungeon/session/${dungeonId}`);
    return response.data;
};

export default {
    startAutoCombat,
    initiateCombat,
    performAction,
    rest,
    getEnemies,
    getDungeons,
    startDungeon,
    continueDungeon,
    getActiveDungeonSession
};