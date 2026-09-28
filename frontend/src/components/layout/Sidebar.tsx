import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';
import styles from './Sidebar.module.css';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊡', end: true },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/tasks', label: 'Tasks', icon: '✓' },
  { to: '/team', label: 'Team', icon: '👥' },
  { to: '/activity', label: 'Activity', icon: '⚡' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/system', label: 'System', icon: '🖥' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { to: '/settings', label: 'Settings', icon: '⚙' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ''}`}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>
          <span>☁</span>
        </div>
        {!collapsed && (
          <div className={styles.logoText}>
            <span className={styles.logoName}>CloudSwitch</span>
            <span className={styles.logoTagline}>Ops Platform</span>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        id="sidebar-collapse-btn"
        className={styles.collapseBtn}
        onClick={() => setCollapsed(!collapsed)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={collapsed ? 'Expand' : 'Collapse'}
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Main navigation">
        {!collapsed && <span className={styles.sectionLabel}>Main</span>}
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        {!collapsed && <span className={styles.sectionLabel}>Account</span>}
        <ul className={styles.navList} role="list">
          {BOTTOM_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
                title={collapsed ? item.label : undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                {!collapsed && <span className={styles.navLabel}>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User footer */}
      <div className={styles.userSection}>
        {user && (
          <div className={styles.userInfo}>
            <Avatar name={user.name} size="sm" />
            {!collapsed && (
              <div className={styles.userMeta}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{user.role.replace('_', ' ')}</span>
              </div>
            )}
          </div>
        )}
        <button
          id="logout-btn"
          className={styles.logoutBtn}
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          ⏏
        </button>
      </div>
    </aside>
  );
}
