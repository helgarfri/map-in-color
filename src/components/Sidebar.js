// src/components/Sidebar.js
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import {
  FaHome,
  FaMap,
  FaStar,
  FaPlus,
  FaBell,
  FaUserCog,
  FaSearch
} from 'react-icons/fa';
import { UserContext } from '../context/UserContext';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { profile, loadingProfile } = useContext(UserContext);
  const navigate = useNavigate();

  if (loadingProfile) return null;
  if (!profile) return null;

  const handleCreateMap = () => {
    // No selection step anymore
    navigate('/create');
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.contentWrapper}>
        <nav className={styles.nav}>
          <ul>
            <li>
              <button className={styles.navLink} onClick={handleCreateMap}>
                <FaPlus className={styles.icon} />
                {!isCollapsed && <span>Create New Map</span>}
              </button>
            </li>

            <br />

            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaHome className={styles.icon} />
                <span>Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaSearch className={styles.icon} />
                {!isCollapsed && <span>Explore</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/your-maps"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaMap className={styles.icon} />
                <span>Your Maps</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/starred-maps"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaStar className={styles.icon} />
                {!isCollapsed && <span>Starred Maps</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/notifications"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaBell className={styles.icon} />
                {!isCollapsed && <span>Notifications</span>}
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
              >
                <FaUserCog className={styles.icon} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.bottomDocsLink}>
          {!isCollapsed ? (
            <span className={styles.docsSentence}>
              Visit the{' '}
              <NavLink to="/docs" target="_blank" className={styles.docsLink}>
                docs
              </NavLink>{' '}
              for more info
            </span>
          ) : (
            <NavLink to="/docs" target="_blank" className={styles.navLink}>
              docs
            </NavLink>
          )}
        </div>

        <div className={styles.bottomCopyright}>
          {!isCollapsed ? (
            <span className={styles.copyright}>
              © 2026 Map in Color. All rights reserved.
            </span>
          ) : (
            <span className={styles.copyright}>© 2025</span>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
