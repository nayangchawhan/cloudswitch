import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Task,
  KanbanBoard,
  CreateTaskForm,
} from '../../types';
import { buildQueryString } from '../../utils';

export interface TaskFilters {
  status?: string;
  priority?: string;
  projectId?: string;
  assigneeId?: string;
  search?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  limit?: number;
}

export const taskApi = {
  getAll: (filters: TaskFilters = {}) =>
    apiClient
      .get<PaginatedResponse<Task>>(`/tasks${buildQueryString(filters)}`)
      .then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<Task>>(`/tasks/${id}`).then((r) => r.data),

  create: (data: CreateTaskForm) =>
    apiClient.post<ApiResponse<Task>>('/tasks', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateTaskForm> & { status?: string }) =>
    apiClient.put<ApiResponse<Task>>(`/tasks/${id}`, data).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(`/tasks/${id}`).then((r) => r.data),

  getKanbanBoard: (projectId: string) =>
    apiClient
      .get<ApiResponse<KanbanBoard>>(`/tasks/kanban/${projectId}`)
      .then((r) => r.data),
};
