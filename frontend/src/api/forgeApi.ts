import apiClient from './apiClient';

export const getForgeableItems = async () => {
    const response = await apiClient.get('/forge');
    return response.data;
};

export const forgeItem = async (inventoryId: string) => {
    const response = await apiClient.post('/forge/upgrade', { inventoryId });
    return response.data;
};
