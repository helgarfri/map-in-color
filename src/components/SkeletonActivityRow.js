// SkeletonActivityRow.js
import React from 'react';
import styles from './DashboardActivityFeed.module.css';

export default function SkeletonActivityRow() {
  return (
    <div className={styles.skeletonRow}>
      <div className={styles.skeletonThumb} />
      <div className={styles.skeletonTextBlock}>
        <div className={styles.skeletonLine} style={{ width: '60%' }} />
        <div className={styles.skeletonLine} style={{ width: '80%' }} />
        <div className={styles.skeletonLine} style={{ width: '30%' }} />
      </div>
    </div>
  );
}
