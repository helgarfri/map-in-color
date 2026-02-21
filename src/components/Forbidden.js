import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Forbidden.module.css';

export default function Forbidden() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.code}>403</span>
        <h1 className={styles.title}>Access denied</h1>
        <p className={styles.subtitle}>
          You don’t have permission to view this page. If you believe this is an error, please contact support.
        </p>
        <Link to="/" className={styles.homeButton}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
