import React from 'react';
import styles from './ProgressBar.module.css';
import { clamp } from '../../utils';

interface Props {
  value: number; // 0-100
  color?: string;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

export default function ProgressBar({ value, color, size = 'sm', showLabel = false }: Props) {
  const pct = clamp(value ?? 0, 0, 100);
  const barColor = color || (pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#6366f1');

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.track} ${styles[size]}`}>
        <div
          className={styles.fill}
          style={{ width: `${pct}%`, backgroundColor: barColor }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && <span className={styles.label}>{pct}%</span>}
    </div>
  );
}
