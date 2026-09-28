import React from 'react';
import styles from './Card.module.css';

interface Props {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
}: Props) {
  return (
    <div
      className={`${styles.card} ${styles[`padding-${padding}`]} ${hover ? styles.hover : ''} ${className || ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`${styles.header} ${className || ''}`}>{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className={styles.title}>{children}</h3>;
}
