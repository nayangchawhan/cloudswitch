import React from 'react';
import { useApi } from '../../hooks';
import { projectApi } from '../../services/api/projectApi';
import Card, { CardTitle, CardHeader } from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';

export default function Dashboard() {
  const { data: stats, isLoading, error } = useApi(projectApi.getDashboardStats);

  if (isLoading) return <LoadingSpinner centered size="lg" />;
  if (error) return <ErrorState message={error} />;

  return (
    <div>
      <h2 style={{ marginBottom: 'var(--space-4)' }}>Overview</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <Card>
          <CardHeader><CardTitle>Total Projects</CardTitle></CardHeader>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.data?.projects?.total_projects || 0}</p>
        </Card>
        <Card>
          <CardHeader><CardTitle>Active Projects</CardTitle></CardHeader>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.data?.projects?.active_projects || 0}</p>
        </Card>
        <Card>
          <CardHeader><CardTitle>Pending Tasks</CardTitle></CardHeader>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.data?.tasks?.todo_count || 0}</p>
        </Card>
        <Card>
          <CardHeader><CardTitle>Completed Tasks</CardTitle></CardHeader>
          <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats?.data?.tasks?.completed_count || 0}</p>
        </Card>
      </div>
    </div>
  );
}
