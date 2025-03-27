import React from 'react';
import HomeHeader from './HomeHeader';
import HomeFooter from './HomeFooter';
import HeroSection from './HeroSection';
import styles from './Home.module.css';
import StepsSection from './StepsSection';
import LiveDemoSection from './LiveDemoSection';
import FeaturedHighlightsSection from './FeaturedHighlightsSection';
import CTASection from './CTASection';

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <HomeHeader />

      <main className={styles.mainContent}>
        {/* Hero Section */}
        <HeroSection />

        <StepsSection />

        <LiveDemoSection/>

        <FeaturedHighlightsSection />

        <CTASection />
      </main>

    </div>
  );
}
