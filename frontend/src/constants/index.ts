// Application-wide constants

export const PROJECT_STATUSES = ['planning', 'active', 'on_hold', 'completed', 'archived'] as const;
export const PROJECT_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export const TASK_STATUSES = ['todo', 'in_progress', 'review', 'completed'] as const;
export const TASK_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export const USER_ROLES = ['admin', 'project_manager', 'developer', 'viewer'] as const;

export const STATUS_LABELS: Record<string, string> = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  archived: 'Archived',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Admin',
  project_manager: 'Project Manager',
  developer: 'Developer',
  viewer: 'Viewer',
};

export const KANBAN_COLUMNS = [
  { id: 'todo', label: 'To Do', color: '#6366f1' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'review', label: 'Review', color: '#8b5cf6' },
  { id: 'completed', label: 'Completed', color: '#10b981' },
] as const;
