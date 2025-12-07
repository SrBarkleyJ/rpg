import apiClient from './apiClient';

const skillApi = {
    getSkills: () => apiClient.get('/skills'),
    upgradeSkill: (skillId: string) => apiClient.post('/skills/upgrade', { skillId }),
};

export default skillApi;
