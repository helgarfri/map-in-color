// PublicMapDetail.js
import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import MapDetailContent from './MapDetailContent';
// or import from your user context if needed
// but typically the user is not logged in here

import styles from './PublicMapDetail.module.css';

export default function PublicMapDetail() {
  return (
    <div className={styles.publicMapDetailContainer}>
      <HomeHeader />
      <MapDetailContent authToken={null} profile={null} />
      <HomeFooter />
    </div>
  );
}
