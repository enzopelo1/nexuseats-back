import axios from 'axios';
import type { AuthTokens } from '@/types';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

function unwrap(body: unknown): unknown {
  if (
    body &&
    typeof body === 'object' &&
    !(body instanceof Blob) &&
    'success' in body &&
    (body as { success: unknown }).success === true &&
    'data' in body
  ) {
    return (body as { data: unknown }).data;
  }
  return body;
}

api.interceptors.request.use((config) => {
  const tokens = localStorage.getItem('tokens');
  if (tokens) {
    const { accessToken } = JSON.parse(tokens) as AuthTokens;
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    res.data = unwrap(res.data);
    return res;
  },
  async (error) => {
    const original = error.config;
    const url = String(original?.url ?? '');
    const isAuthAttempt =
      url.includes('/auth/login') || url.includes('/auth/register');

    // Ne pas rediriger sur401 lors d’un échec de connexion / inscription : la page doit afficher le message.
    if (
      error.response?.status === 401 &&
      !original?._retry &&
      !isAuthAttempt
    ) {
      if (original) original._retry = true;
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
