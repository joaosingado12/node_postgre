import axios from 'axios';

// Instância única exportada para todo o projeto
export const api = axios.create({
  baseURL: 'http://localhost:3000/',
  withCredentials: true 
});