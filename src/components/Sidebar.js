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
  FaSearch
} from 'react-icons/fa';
import { UserContext } from '../context/UserContext';
import MapSelectionModal from './MapSelectionModal';

function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { profile, loadingProfile } = useContext(UserContext);
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();

  if (loadingProfile) {
    return null; // or a spinner
  }

  if (!profile) {
    return null; // or a placeholder, or redirect to login
  }

  const handleCreateMap = () => {
    setShowMapModal(true);
  };

  const handleMapSelection = (selected_map) => {
    if (selected_map) {
      setShowMapModal(false);
      navigate('/create', { state: { selected_map } });
    } else {
      alert('Please select a map type.');
    }
  };

  return (
    <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
     
      {/* Main content area */}
      <div className={styles.contentWrapper}>
    

        {/* Navigation Links */}
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
              <NavLink to="/dashboard" className={styles.navLink}>
                <FaHome className={styles.icon} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/explore" className={styles.navLink}>
                <FaSearch className={styles.icon} />
                {!isCollapsed && <span>Explore</span>}
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

      {/* Bottom section (Docs + Copyright) */}
      <div className={styles.bottomSection}>
        
        {/* Docs Link */}
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

        {/* Copyright */}
        <div className={styles.bottomCopyright}>
          {!isCollapsed ? (
            <span className={styles.copyright}>
              © 2025 Map in Color. All rights reserved.
            </span>
          ) : (
            <span className={styles.copyright}>
              © 2025
            </span>
          )}
        </div>
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
