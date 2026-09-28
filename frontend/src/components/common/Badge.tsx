import React from 'react';
import styles from './Badge.module.css';

type Variant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'default';

interface Props {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
}

export default function Badge({ children, variant = 'default', dot = false }: Props) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
