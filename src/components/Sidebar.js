// src/components/Sidebar.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { useState } from 'react';
import '../'

// Import icons from a library like react-icons
import { FaHome, FaMap, FaPlus, FaBell, FaUserCog,FaChevronLeft,FaChevronRight, } from 'react-icons/fa';

function Sidebar({
  isCollapsed,
  setIsCollapsed
}) {
  const username = localStorage.getItem('username') || 'User';
  const avatarUrl = localStorage.getItem('avatarUrl') || '/public/assets/default-avatar.png';


  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
    
    {/* Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className={styles.logoSection}>
      <img
          alt="Map in Color Logo"
          src="/assets/map-in-color-logo.png" // Adjust the path as needed
          className={styles.logo}
        />
        <span className={styles.appName}>Map in Color</span>

        </div>
      {/* User Profile Section */}
      
      <div className={styles.profileSection}>
        <img src={avatarUrl} alt="User Avatar" className={styles.avatar} />
        <span className={styles.username}>@{username}</span>
      </div>

      {/* Navigation Links */}
      <nav className={styles.nav}>
        <ul>
        <li>
            <NavLink to="/create" className={styles.navLink}>
              <FaPlus className={styles.icon} />
              <span>Create New Map</span>
            </NavLink>
          </li>
          <br></br>
          <li>
            <NavLink to="/dashboard" className={styles.navLink}>
              <FaHome className={styles.icon} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/my-maps" className={styles.navLink}>
              <FaMap className={styles.icon} />
              <span>My Maps</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/notifications" className={styles.navLink}>
              <FaBell className={styles.icon} />
              <span>Notifications</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile-settings" className={styles.navLink}>
              <FaUserCog className={styles.icon} />
              <span>Profile Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
