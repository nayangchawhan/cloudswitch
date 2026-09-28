import apiClient from './client';
import type { ApiResponse, AuthUser, LoginForm, RegisterForm } from '../../types';

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authApi = {
  login: (data: LoginForm) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data).then((r) => r.data),

  register: (data: RegisterForm) =>
    apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data).then((r) => r.data),

  me: () =>
    apiClient.get<ApiResponse<AuthUser>>('/auth/me').then((r) => r.data),
};
