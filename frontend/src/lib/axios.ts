import axios from 'axios';

export const ApiRequest = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});