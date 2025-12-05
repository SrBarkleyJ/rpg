import apiClient from './apiClient';

const inventoryApi = {
    getInventory: () => apiClient.get('/rewards/inventory'),
    equipItem: (itemId: string) => apiClient.post('/rewards/equip', { itemId }),
    unequipItem: (itemId: string) => apiClient.post('/rewards/unequip', { itemId }),
    useItem: (itemId: string) => apiClient.post('/rewards/use', { itemId }),
};

export default inventoryApi;
