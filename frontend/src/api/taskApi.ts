import apiClient from './apiClient';

const getTasks = async () => {
    const response = await apiClient.get('/tasks');
    return response.data;
};

const createTask = async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
};

const completeTask = async (taskId) => {
    const response = await apiClient.post('/tasks/complete', { taskId });
    return response.data;
};

export default { getTasks, createTask, completeTask };
