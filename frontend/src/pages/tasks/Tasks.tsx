import React from 'react';
import { useApi } from '../../hooks';
import { taskApi } from '../../services/api/taskApi';
import Card, { CardTitle, CardHeader } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { TaskStatusBadge, PriorityBadge } from '../../components/common/StatusBadge';

export default function Tasks() {
  const { data, isLoading } = useApi(() => taskApi.getAll({ limit: 50 }));

  if (isLoading) return <LoadingSpinner centered size="lg" />;
  
  const tasks = data?.data || [];

  if (tasks.length === 0) {
    return <EmptyState title="No tasks found" description="Create a task to get started." />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Tasks</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {tasks.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle>{t.title}</CardTitle>
            </CardHeader>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <TaskStatusBadge status={t.status} />
              <PriorityBadge priority={t.priority} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
