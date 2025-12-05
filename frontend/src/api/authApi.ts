import apiClient from './apiClient';

const login = async (emailOrUsername, password) => {
    const response = await apiClient.post('/auth/login', { emailOrUsername, password });
    return response.data;
};

const register = async (username, email, password, userClass, avatar) => {
    const response = await apiClient.post('/auth/register', {
        username,
        email,
        password,
        class: userClass,
        avatar
    });
    return response.data;
};

export default { login, register };
