import React from 'react';
import styles from './ErrorState.module.css';

interface Props {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button id="error-retry-btn" className={styles.btn} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
