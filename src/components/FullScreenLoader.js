// src/components/FullScreenLoader.js
import React from 'react';
import styles from './FullScreenLoader.module.css';

export default function FullScreenLoader() {
  return (
    <div className={styles.loaderOverlay}>
    <div className={styles.loaderContent}>
      <div className={styles.spinner}></div>
      <p className={styles.loaderText}>Loading your profile...</p>
    </div>
  </div>
  
  );
}
