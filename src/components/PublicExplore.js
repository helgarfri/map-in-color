// PublicExplore.js
import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import ExploreContent from './ExploreContent'; // <--- import the new file

import styles from './PublicExplore.module.css';

export default function PublicExplore() {
  return (
    <div className={styles.publicExploreContainer}>
      <HomeHeader />

      {/* Content width matches HomeHeader horizontal padding */}
      <div className={styles.exploreContentWrap}>
        <ExploreContent />
      </div>

      <HomeFooter />
    </div>
  );
}
