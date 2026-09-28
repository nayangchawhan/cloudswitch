import React from 'react';
import { useApi } from '../../hooks';
import { projectApi } from '../../services/api/projectApi';
import Card, { CardTitle, CardHeader } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { ProjectStatusBadge, PriorityBadge } from '../../components/common/StatusBadge';

export default function Projects() {
  const { data, isLoading } = useApi(() => projectApi.getAll({ limit: 50 }));

  if (isLoading) return <LoadingSpinner centered size="lg" />;
  
  const projects = data?.data || [];

  if (projects.length === 0) {
    return <EmptyState title="No projects found" description="Create a project to get started." />;
  }

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Projects</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {projects.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <ProjectStatusBadge status={p.status} />
              <PriorityBadge priority={p.priority} />
            </div>
            <p style={{ marginTop: 'var(--space-2)' }}>{p.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
