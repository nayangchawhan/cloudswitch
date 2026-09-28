import React from 'react';
import { getInitials, stringToColor } from '../../utils';
import styles from './Avatar.module.css';

interface Props {
  name: string;
  avatarUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export default function Avatar({ name, avatarUrl, size = 'md' }: Props) {
  const initials = getInitials(name);
  const color = stringToColor(name);

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${styles.avatar} ${styles[size]}`}
        title={name}
      />
    );
  }

  return (
    <div
      className={`${styles.avatar} ${styles.initials} ${styles[size]}`}
      style={{ backgroundColor: color }}
      title={name}
      aria-label={name}
    >
      {initials}
    </div>
  );
}
