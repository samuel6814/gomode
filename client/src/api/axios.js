import axios from 'axios';
import { getApiBase } from './apiBase';

const apiClient = axios.create({
  baseURL: getApiBase(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
