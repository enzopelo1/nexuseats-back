import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, LoginDto } from '@/types';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: import('@/types').UserRole;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = localStorage.getItem('tokens');
    if (tokens) {
      authService
        .getProfile()
        .then((u) => {
          setUser(u);
          localStorage.setItem('user', JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem('tokens');
          localStorage.removeItem('user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (dto: LoginDto) => {
    const { user: u, tokens } = await authService.login(dto);
    localStorage.setItem('tokens', JSON.stringify(tokens));
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const register = async (dto: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: import('@/types').UserRole;
  }) => {
    const roleMap: Record<string, 'customer' | 'owner' | 'admin'> = {
      customer: 'customer',
      restaurant_owner: 'owner',
      driver: 'customer',
      admin: 'admin',
      owner: 'owner',
    };
    const { user: u, tokens } = await authService.register({
      email: dto.email,
      password: dto.password,
      role: roleMap[dto.role] ?? 'customer',
    });
    localStorage.setItem('tokens', JSON.stringify(tokens));
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
