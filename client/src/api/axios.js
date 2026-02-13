import axios from 'axios';

import { toast } from 'react-hot-toast';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            // Check if it's a quota/subscription error
            const message = error.response.data?.message || '';
            if (message.toLowerCase().includes('límite') || message.toLowerCase().includes('limit') || message.toLowerCase().includes('plan')) {
                toast.error('Límite alcanzado. Actualiza tu plan para continuar.', {
                    duration: 5000,
                    icon: '🔒'
                });
            }
        }
        return Promise.reject(error);
    }
);

export default api;
