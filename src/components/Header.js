// src/components/Header.js
import React, { useState } from 'react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import MapSelectionModal from './MapSelectionModal';

// Import an arrow down icon (using an inline SVG for simplicity)
const ArrowDownIcon = () => (
  <svg
    className={styles.arrowDownIcon}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="16"
    height="16"
  >
    <path
      fill="currentColor"
      d="M7 10l5 5 5-5H7z"
    />
  </svg>
);

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Retrieve the username and avatar from localStorage or a default value
  const username = localStorage.getItem('username') || 'User';
  const avatarUrl =
    localStorage.getItem('avatarUrl') || '/assets/default-avatar.png'; // Adjust the path as needed

  const handleLogout = () => {
    // Clear authentication tokens and user info
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('avatarUrl');
    setIsAuthenticated(false);
    navigate('/login');
  };

  // Toggle dropdown on click
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest(`.${styles.userMenu}`)) {
      setShowDropdown(false);
    }
  };

  // Attach event listener to detect clicks outside the dropdown
  React.useEffect(() => {
    if (showDropdown) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showDropdown]);

  // State for MapSelectionModal
  const [showMapModal, setShowMapModal] = useState(false);
  
  const handleCreateMap = (selectedMap) => {
    setShowMapModal(false); // Close the modal
    navigate('/create', { state: { selectedMap } });
  };
  

  return (
    <header className={styles.header}>
      {/* Left Side: Logo and App Name */}
      <Link to="/" className={styles.logoContainer}>
        <img
          alt="Map in Color Logo"
          src="/assets/map-in-color-logo.png" // Adjust the path as needed
          className={styles.logo}
        />
        <h1 className={styles.appName}>Map in Color</h1>
      </Link>

      {/* Center: Navigation Links */}
      <nav className={styles.navLinks}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <Link to="/explore" className={styles.navLink}>Explore</Link>
        <button className={styles.navLinkButton} onClick={() => setShowMapModal(true)}>Create</button>
        <Link to="/tutorials" className={styles.navLink}>Tutorials</Link>
        <Link to="/documentation" className={styles.navLink}>Docs</Link>
      </nav>

      {/* Right Side: Authentication Links or User Info */}
      <div className={styles.authContainer}>
        {isAuthenticated ? (
          <div
            className={styles.userMenu}
            onClick={toggleDropdown}
          >
            {/* Display the user's avatar */}
            <img src={avatarUrl} alt="Avatar" className={styles.avatar} />
            {/* Username is a link to dashboard */}
            <Link to="/dashboard" className={styles.username}>
              {username}
            </Link>
            {/* Arrow down icon */}
            <ArrowDownIcon />
            {/* Dropdown menu */}
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <Link to="/profile" className={styles.dropdownItem}>
                  View Profile
                </Link>
                <Link to="/dashboard" className={styles.dropdownItem}>
                  Dashboard
                </Link>
                <button
                  className={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className={styles.loginLink}>
            Log In
          </Link>
        )}
      </div>

      {/* Map Selection Modal */}
      <MapSelectionModal
        show={showMapModal}
        onClose={() => setShowMapModal(false)}
        onCreateMap={handleCreateMap}
      />
    </header>
  );
}

export default Header;
