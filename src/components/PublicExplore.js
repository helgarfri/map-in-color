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

      {/* Same ExploreContent with all the search/filter logic */}
      <ExploreContent />

      <HomeFooter />
    </div>
  );
}
