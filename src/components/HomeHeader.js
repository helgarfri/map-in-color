// src/components/HomeHeader.js
import React from 'react';
import styles from './HomeHeader.module.css';

// If you use React Router, you can import { Link } from 'react-router-dom';
// and replace <a> tags with <Link> as needed.
export default function HomeHeader() {
return (
    <header className={styles.header}>
        <div className={styles.logoSection} onClick={() => window.location.href = '/'}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                window.location.href = '/';
            }
            }}>
            <img
                src="/assets/map-in-color-logo.png"
                alt="Map in Color Logo"
                className={styles.logo}
            />
            <h1 className={styles.brandTitle}>Map in Color</h1>
        </div>

        <nav className={styles.nav}>
            <a href="/" className={styles.navLink}>
                Home
            </a>
            <a href="/docs" className={styles.navLink}>
                Documentation
            </a>
            {/* <button
                className={styles.loginButton}
                onClick={() => window.location.href = '/login'}
            >
                Login
            </button> */}
        </nav>
    </header>
);
}
