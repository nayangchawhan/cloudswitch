import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { authApi } from '../services/api/authApi';
import config from '../config';
import type { AuthUser, LoginForm, RegisterForm } from '../types';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginForm) => Promise<void>;
  register: (data: RegisterForm) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(config.tokenKey);
    const storedUser = localStorage.getItem(config.userKey);
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        authApi.me().then((res) => {
          setUser(res.data);
          localStorage.setItem(config.userKey, JSON.stringify(res.data));
        }).catch(() => {
          // Token invalid, clear
          localStorage.removeItem(config.tokenKey);
          localStorage.removeItem(config.userKey);
          setToken(null);
          setUser(null);
        }).finally(() => setIsLoading(false));
      } catch {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (data: LoginForm) => {
    const res = await authApi.login(data);
    const { user: u, token: t } = res.data;
    setUser(u);
    setToken(t);
    localStorage.setItem(config.tokenKey, t);
    localStorage.setItem(config.userKey, JSON.stringify(u));
  }, []);

  const register = useCallback(async (data: RegisterForm) => {
    const res = await authApi.register(data);
    const { user: u, token: t } = res.data;
    setUser(u);
    setToken(t);
    localStorage.setItem(config.tokenKey, t);
    localStorage.setItem(config.userKey, JSON.stringify(u));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(config.tokenKey);
    localStorage.removeItem(config.userKey);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
