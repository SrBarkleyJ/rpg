import apiClient from './apiClient';

const getProfile = async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
};

const updateProfile = async (profileData) => {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
};

export default { getProfile, updateProfile };
