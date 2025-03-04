import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/', // Adjust according to your backend
    headers: { 'Content-Type': 'application/json' }
});

export default api;
