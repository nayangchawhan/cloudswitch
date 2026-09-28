// ─── Shared API response shapes ────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ─── User ──────────────────────────────────────────────────────────────────────
export type UserRole = 'admin' | 'project_manager' | 'developer' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  last_login_at: string | null;
  project_count?: number;
  active_task_count?: number;
  total_tasks?: number;
  completed_tasks?: number;
  projects?: ProjectSummary[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// ─── Project ───────────────────────────────────────────────────────────────────
export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'archived';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  owner_name: string;
  owner_avatar: string | null;
  owner_email?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  start_date: string | null;
  due_date: string | null;
  progress?: number;
  task_count?: number;
  completed_task_count?: number;
  member_count?: number;
  members?: ProjectMember[];
  taskSummary?: TaskStatusSummary[];
  created_at: string;
  updated_at: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url: string | null;
  joined_at: string;
}

export interface TaskStatusSummary {
  status: TaskStatus;
  count: string;
}

// ─── Task ──────────────────────────────────────────────────────────────────────
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  project_id: string;
  project_name?: string;
  assignee_id: string | null;
  assignee_name: string | null;
  assignee_avatar: string | null;
  assignee_email?: string;
  created_by: string | null;
  creator_name?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  labels: string[];
  created_at: string;
  updated_at: string;
}

export interface KanbanBoard {
  todo: Task[];
  in_progress: Task[];
  review: Task[];
  completed: Task[];
}

// ─── Notification ──────────────────────────────────────────────────────────────
export type NotificationType = 'info' | 'task' | 'project' | 'warning' | 'success';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  related_resource_type: string | null;
  related_resource_id: string | null;
  read_at: string | null;
  created_at: string;
}

// ─── Activity ──────────────────────────────────────────────────────────────────
export interface ActivityLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  description: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user_id: string | null;
  user_name: string | null;
  user_avatar: string | null;
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  projects: {
    total_projects: string;
    active_projects: string;
    completed_projects: string;
    on_hold_projects: string;
  };
  tasks: {
    total_tasks: string;
    todo_count: string;
    in_progress_count: string;
    review_count: string;
    completed_count: string;
  };
  recentProjects: Project[];
}

// ─── Health ────────────────────────────────────────────────────────────────────
export interface ComponentHealth {
  status: 'operational' | 'unavailable' | 'degraded';
  message: string;
}

export interface HealthStatus {
  status: 'operational' | 'degraded';
  version: string;
  environment: string;
  uptime: number;
  timestamp: string;
  components: {
    api: ComponentHealth;
    database: ComponentHealth;
    redis: ComponentHealth;
    authentication: ComponentHealth;
  };
}

// ─── Forms ─────────────────────────────────────────────────────────────────────
export interface CreateProjectForm {
  name: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: string;
  dueDate?: string;
  memberIds?: string[];
}

export interface CreateTaskForm {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string;
  labels?: string[];
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
