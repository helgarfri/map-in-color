import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1 className={styles.title}>This page isn’t on the map</h1>
        <p className={styles.subtitle}>
          The place you’re looking for doesn’t exist or may have moved. Let’s get you back to familiar territory.
        </p>
        <Link to="/" className={styles.homeButton}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
