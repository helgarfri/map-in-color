// src/components/HomeFooter.js
import React from 'react';
import styles from './HomeFooter.module.css';

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        <a
          href="https://github.com/helgarfri/map-in-color"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
        <a href="/docs">Documentation</a>
      </div>
      <p className={styles.copyright}>
        &copy; {new Date().getFullYear()} Map in Color
      </p>
    </footer>
  );
}
