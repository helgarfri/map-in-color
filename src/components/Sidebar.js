// src/components/Sidebar.js

import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';
import {
  FaHome,
  FaMap,
  FaStar,
  FaPlus,
  FaBell,
  FaUserCog,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import MapSelectionModal from './MapSelectionModal';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { profile, loadingProfile } = useContext(UserContext);
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();

  if (loadingProfile) {
    return null; // Or a loading spinner if you prefer
  }

  if (!profile) {
    return null; // Or a placeholder, or redirect to login
  }

  const handleCreateMap = () => {
    setShowMapModal(true);
  };

  const handleMapSelection = (selectedMap) => {
    if (selectedMap) {
      setShowMapModal(false);
      navigate('/create', { state: { selectedMap } });
    } else {
      alert('Please select a map type.');
    }
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      {/* Toggle Button */}
      <button
        className={styles.toggleButton}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
      </button>

      <div className={styles.contentWrapper}>
        {/* Logo Section */}
        <div className={styles.logoSection}>
          <img
            alt="Map in Color Logo"
            src="/assets/map-in-color-logo.png"
            className={styles.logo}
          />
          <span className={styles.appName}>Map in Color</span>
        </div>

        {/* Navigation Links */}
        <nav className={styles.nav}>
          <ul>
            <li>
              {/* Change NavLink to button to trigger modal */}
              <button
                className={styles.navLink} // Create a new class for button styling
                onClick={handleCreateMap}
              >
                <FaPlus className={styles.icon} />
                {!isCollapsed && <span>Create New Map</span>}
              </button>
            </li>
            <br />
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
              <NavLink to="/starred-maps" className={styles.navLink}>
                <FaStar className={styles.icon} />
                {!isCollapsed && 'Starred Maps'}
              </NavLink>
            </li>
            <li>
              <NavLink to="/notifications" className={styles.navLink}>
                <FaBell className={styles.icon} />
                {!isCollapsed && <span>Notifications</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings" className={styles.navLink}>
                <FaUserCog className={styles.icon} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* Map Selection Modal */}
      {showMapModal && (
        <MapSelectionModal
          show={showMapModal}
          onClose={() => setShowMapModal(false)}
          onCreateMap={handleMapSelection}
        />
      )}
    </div>
  );
}

export default Sidebar;
