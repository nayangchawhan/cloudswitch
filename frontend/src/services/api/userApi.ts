import apiClient from './client';
import type { ApiResponse, PaginatedResponse, User } from '../../types';
import { buildQueryString } from '../../utils';

export const userApi = {
  getAll: (params: { search?: string; role?: string; page?: number; limit?: number } = {}) =>
    apiClient
      .get<PaginatedResponse<User>>(`/users${buildQueryString(params)}`)
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<User>>(`/users/${id}`).then((r) => r.data),
};
