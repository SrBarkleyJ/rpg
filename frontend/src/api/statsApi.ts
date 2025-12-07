import apiClient from './apiClient';

const getStats = async () => {
    const response = await apiClient.get('/stats');
    return response.data;
};

const assignSkillPoint = async (statName) => {
    const response = await apiClient.post('/stats/assign', { statName });
    return response.data;
};

export default { getStats, assignSkillPoint };
