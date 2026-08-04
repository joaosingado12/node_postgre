import axios from 'axios';

// Configuração da URL base da sua API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// Interceptor: Injeta o Token em todas as requisições automaticamente
api.interceptors.request.use(async config => {
  const token = sessionStorage.getItem('@AmigoPet:token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;

 