import apiClient from './apiClient';

const getRewards = async () => {
    const response = await apiClient.get('/rewards');
    return response.data;
};

const buyReward = async (rewardId) => {
    const response = await apiClient.post('/rewards/buy', { rewardId });
    return response.data;
};

export default { getRewards, buyReward };
