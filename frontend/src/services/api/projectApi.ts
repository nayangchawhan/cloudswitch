import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Project,
  DashboardStats,
  CreateProjectForm,
} from '../../types';
import { buildQueryString } from '../../utils';

export interface ProjectFilters {
  status?: string;
  priority?: string;
  search?: string;
  ownerId?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  limit?: number;
}

export const projectApi = {
  getAll: (filters: ProjectFilters = {}) =>
    apiClient
      .get<PaginatedResponse<Project>>(`/projects${buildQueryString(filters)}`)
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Project>>(`/projects/${id}`).then((r) => r.data),

  create: (data: CreateProjectForm) =>
    apiClient.post<ApiResponse<Project>>('/projects', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateProjectForm>) =>
    apiClient.put<ApiResponse<Project>>(`/projects/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/projects/${id}`).then((r) => r.data),

  addMember: (projectId: string, userId: string) =>
    apiClient
      .post<ApiResponse<null>>(`/projects/${projectId}/members`, { userId })
      .then((r) => r.data),

  getDashboardStats: () =>
    apiClient.get<ApiResponse<DashboardStats>>('/projects/dashboard').then((r) => r.data),
};
