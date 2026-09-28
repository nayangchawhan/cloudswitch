import React from 'react';
import { useApi } from '../../hooks';
import { healthApi } from '../../services/api/miscApi';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function SystemStatus() {
  const { data, isLoading } = useApi(healthApi.getHealth);
  if (isLoading) return <LoadingSpinner centered />;
  return (
    <div>
      <h2>System Status</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
