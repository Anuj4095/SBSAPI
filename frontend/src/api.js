import axios from 'axios';

const isLocal =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname.startsWith('192.168.'));

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (isLocal
    ? `http://${window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname}:3000`
    : 'https://contacthub-api.onrender.com');


const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach JWT token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
