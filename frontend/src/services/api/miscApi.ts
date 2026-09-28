import apiClient from './client';
import type { ApiResponse, PaginatedResponse, Notification, ActivityLog, HealthStatus } from '../../types';

export const notificationApi = {
  getMyNotifications: () =>
    apiClient.get<PaginatedResponse<Notification>>('/notifications').then((r) => r.data),

  markRead: (id: string) =>
    apiClient.put<ApiResponse<null>>(`/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () =>
    apiClient.put<ApiResponse<null>>('/notifications/read-all').then((r) => r.data),
};

export const activityApi = {
  getActivity: (params: { page?: number; limit?: number; userId?: string } = {}) => {
    const query = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return apiClient
      .get<PaginatedResponse<ActivityLog>>(`/activity${query ? `?${query}` : ''}`)
      .then((r) => r.data);
  },
};

export const healthApi = {
  getHealth: () =>
    apiClient.get<HealthStatus>('/health').then((r) => r.data),

  getLiveness: () =>
    apiClient.get('/health/live').then((r) => r.data),

  getReadiness: () =>
    apiClient.get('/health/ready').then((r) => r.data),
};
