import React from 'react';
import styles from './LoadingSpinner.module.css';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  centered?: boolean;
}

export default function LoadingSpinner({ size = 'md', centered = false }: Props) {
  return (
    <div className={`${styles.wrapper} ${centered ? styles.centered : ''}`}>
      <div className={`${styles.spinner} ${styles[size]}`} role="status" aria-label="Loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}
