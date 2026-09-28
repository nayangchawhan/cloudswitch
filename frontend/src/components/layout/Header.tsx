import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import styles from './Header.module.css';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/team': 'Team',
  '/activity': 'Activity',
  '/notifications': 'Notifications',
  '/system': 'System Status',
  '/settings': 'Settings',
  '/profile': 'Profile',
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const pathSegment = '/' + location.pathname.split('/')[1];
  const title = PAGE_TITLES[pathSegment] || 'CloudSwitch';

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </div>

      <div className={styles.right}>
        <Link
          id="header-notifications-btn"
          to="/notifications"
          className={styles.iconBtn}
          aria-label="Notifications"
          title="Notifications"
        >
          🔔
        </Link>
        <Link
          id="header-system-btn"
          to="/system"
          className={styles.iconBtn}
          aria-label="System status"
          title="System Status"
        >
          🖥
        </Link>
        {user && (
          <Link
            id="header-profile-btn"
            to="/profile"
            className={styles.userBtn}
            aria-label="Profile"
          >
            <Avatar name={user.name} size="sm" />
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userRole}>{user.role.replace(/_/g, ' ')}</span>
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}
