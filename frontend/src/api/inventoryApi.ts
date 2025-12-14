import apiClient from './apiClient';

export default {
    getInventory: () =>
        apiClient.get('/inventory'),

    equipItem: (data) =>
        apiClient.post('/inventory/equip', data),

    unequipItem: (data) =>
        apiClient.post('/inventory/unequip', data),

    useItem: (itemId) =>
        apiClient.post('/inventory/use', { itemId })
};
