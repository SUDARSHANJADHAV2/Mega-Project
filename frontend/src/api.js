import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

// Request interceptor for API calls
api.interceptors.request.use(
    async config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                ...config.headers
            }
        } else {
            config.headers = {
                'Accept': 'application/json',
                ...config.headers
            }
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor for API calls
api.interceptors.response.use((response) => {
    return response
}, async function (error) {
    const originalRequest = error.config;
    // Handle 401 Unauthorized
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/'; // Simple redirect on auth failure
        return Promise.reject(error);
    }
    return Promise.reject(error);
});

export default api;
