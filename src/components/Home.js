import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import styles from './Home.module.css';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <HomeHeader />

      <main className={styles.mainContent}>
        <h2 className={styles.betaNotice}>
          Map in Color v2.0 beta version will be out very soon!
        </h2>
        <p className={styles.description}>
        A new platform to create and visualize data through maps. Be one of the first to join the community in its early development. 
        </p>
      </main>

      <HomeFooter />
    </div>
  );
}
