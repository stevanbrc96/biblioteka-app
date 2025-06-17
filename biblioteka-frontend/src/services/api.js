import axios from 'axios';

// Kreiramo novu instancu axios-a
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// NEMA VIŠE INTERCEPTOR-A

export default api;