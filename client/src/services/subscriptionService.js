import api from '../api/axios';

export const getSubscriptionStatus = async () => {
    const response = await api.get('/subscription/status');
    return response.data;
};
