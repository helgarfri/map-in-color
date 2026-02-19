import React from 'react';
import HomeFooter from './HomeFooter';
import HomeHeader from './HomeHeader';
import HeroSection from './HeroSection';
import styles from './Home.module.css';
import StepsSection from './StepsSection';
import LiveDemoSection from './LiveDemoSection';
import WhoIsItForSection from './WhoIsItForSection';
import CTASection from './CTASection';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <HomeHeader />
      <main className={styles.mainContent}>
        <HeroSection />

        <StepsSection />

        <LiveDemoSection/>

        <WhoIsItForSection />

        <CTASection />
      </main>

    </div>
  );
}
