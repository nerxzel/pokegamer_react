import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
    'Content-Type': 'application/json',
    'x-tenant-id': import.meta.env.VITE_TENANT_ID, 
    },
});

api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            const user = JSON.parse(storedUser);
        if (user?.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
        }
            return config;
    },
    (error) => Promise.reject(error)
    );

api.interceptors.response.use(
    (response) => {
        return response.data; 
    },
        (error) => {
            return Promise.reject(error);
    }
);

export default api;