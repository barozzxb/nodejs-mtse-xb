import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8900",
});


instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;
