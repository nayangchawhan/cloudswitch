import React from 'react';
import Badge from './Badge';
import type { ProjectStatus, ProjectPriority, TaskStatus, TaskPriority } from '../../types';

const projectStatusVariant: Record<ProjectStatus, 'success' | 'info' | 'warning' | 'default' | 'purple'> = {
  planning: 'info',
  active: 'success',
  on_hold: 'warning',
  completed: 'purple',
  archived: 'default',
};

const projectStatusLabel: Record<ProjectStatus, string> = {
  planning: 'Planning',
  active: 'Active',
  on_hold: 'On Hold',
  completed: 'Completed',
  archived: 'Archived',
};

const taskStatusVariant: Record<TaskStatus, 'default' | 'warning' | 'purple' | 'success'> = {
  todo: 'default',
  in_progress: 'warning',
  review: 'purple',
  completed: 'success',
};

const taskStatusLabel: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'Review',
  completed: 'Completed',
};

const priorityVariant: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
  low: 'success',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
};

const priorityLabel: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge variant={projectStatusVariant[status]} dot>
      {projectStatusLabel[status]}
    </Badge>
  );
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <Badge variant={taskStatusVariant[status]} dot>
      {taskStatusLabel[status]}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: ProjectPriority | TaskPriority }) {
  return (
    <Badge variant={priorityVariant[priority]}>
      {priorityLabel[priority]}
    </Badge>
  );
}
