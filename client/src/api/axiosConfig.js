import axios from 'axios';
import { getToken } from './auth'; // assumed to return token from localStorage

const api = axios.create({
  baseURL: 'http://localhost:8082',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
