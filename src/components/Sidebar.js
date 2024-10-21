// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { Link } from 'react-router-dom';


function Sidebar({
    isAuthenticated,
    setIsAuthenticated
}) {
  return (
    <div className={styles.sidebar}>
   
      <nav>
        <ul>
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              Dashboard
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/docs"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              Documentaions
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/tutorials"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              Tutorials
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.activeNavLink}` : styles.navLink
              }
            >
              Profile Settings
            </NavLink>
          </li>
     
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
