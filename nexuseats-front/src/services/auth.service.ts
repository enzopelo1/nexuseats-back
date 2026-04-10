import api from './api';
import type { AuthTokens, LoginDto, User } from '@/types';

function mapApiUser(u: { id: number; email: string; role: string }): User {
  return {
    id: u.id,
    email: u.email,
    firstName: '',
    lastName: '',
    role: u.role as User['role'],
  };
}

export const authService = {
  async login(dto: LoginDto): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await api.post('/auth/login', dto);
    const accessToken = data.access_token as string;
    const user = mapApiUser(data.user);
    return {
      user,
      tokens: { accessToken, refreshToken: '' },
    };
  },

  async register(body: {
    email: string;
    password: string;
    role: 'customer' | 'owner' | 'admin';
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await api.post('/auth/register', body);
    const accessToken = data.access_token as string;
    const user = mapApiUser(data.user);
    return {
      user,
      tokens: { accessToken, refreshToken: '' },
    };
  },

  async logout(): Promise<void> {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
  },

  async getProfile(): Promise<User> {
    const { data } = await api.get('/auth/profile');
    return mapApiUser(data);
  },
};
