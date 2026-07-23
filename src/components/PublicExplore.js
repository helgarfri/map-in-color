// PublicExplore.js
import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import ExploreContent from './ExploreContent'; // <--- import the new file

import styles from './PublicExplore.module.css';

export default function PublicExplore() {
  return (
    <div className={`forceLightMode ${styles.publicExploreContainer}`}>
      <HomeHeader />

      {/* Full-bleed content; inset matches HomeHeader */}
      <div className={styles.exploreContentWrap}>
        <ExploreContent />
      </div>

      <HomeFooter />
    </div>
  );
}
