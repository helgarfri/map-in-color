// src/components/Header.js
import React, { useState } from 'react';
import styles from './Header.module.css';
import { Link, useNavigate } from 'react-router-dom';

function Header({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Retrieve the username correctly
  const username = localStorage.getItem('username') || 'User';

  console.log(username)

  const handleLogout = () => {
    // Clear authentication tokens and user info
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsAuthenticated(false);
    navigate('/login');
  };
  

  return (
    <header className={styles.header}>

      {/* Left Side: Logo and App Name */}
      <Link to="/dashboard" className={styles.logoContainer}>
        <img
          alt="logo"
          src="../assets/map-in-color-logo.png"
          className={styles.logo}
        />
        <h1>Map in Color</h1>
      </Link>

      {/* Right Side: Authentication Links or User Info */}
      <div className={styles.authContainer}>
        {isAuthenticated ? (
          <div
            className={styles.userMenu}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          > <span>Logged in as </span> 
            <span className={styles.username}>{username}</span>
            {showDropdown && (
              <div className={styles.dropdownMenu}>
                <Link to="/profile" className={styles.dropdownItem}>
                  Edit Profile
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
    </header>
  );
}

export default Header;
