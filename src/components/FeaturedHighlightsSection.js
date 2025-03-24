import React from 'react';
import styles from './FeaturedHighlightsSection.module.css';

function FeaturedHighlightsSection() {
  return (
    <section className={styles.featuredContainer}>
      {/* Title & subtitle */}
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>More Than Just a Map Maker</h2>
        <p className={styles.subtitle}>
          Map in Color makes mapping fast, flexible, and shareable — with tools that help you 
          turn raw data into beautiful, interactive visuals.
        </p>
      </div>

      {/* Highlights grid */}
      <div className={styles.highlightGrid}>

        <div className={styles.highlightCard}>
          <div className={styles.icon}>📄</div>
          <h3 className={styles.cardTitle}>CSV-Based Mapping</h3>
          <p className={styles.cardDescription}>
            Upload a CSV to transform your data into an interactive map.
          </p>
        </div>

        <div className={styles.highlightCard}>
          <div className={styles.icon}>🌐</div>
          <h3 className={styles.cardTitle}>Multiple Map Templates</h3>
          <p className={styles.cardDescription}>
            Choose between World, USA, and Europe — with more on the way.
          </p>
        </div>

        <div className={styles.highlightCard}>
          <div className={styles.icon}>🔒</div>
          <h3 className={styles.cardTitle}>Public or Private Sharing</h3>
          <p className={styles.cardDescription}>
            Make your map public, or keep it private in your dashboard.
          </p>
        </div>

        <div className={styles.highlightCard}>
          <div className={styles.icon}>🔎</div>
          <h3 className={styles.cardTitle}>Search & Explore Maps</h3>
          <p className={styles.cardDescription}>
            Browse maps by topic, tags, or keywords using the explore page.
          </p>
        </div>

        <div className={styles.highlightCard}>
          <div className={styles.icon}>⭐</div>
          <h3 className={styles.cardTitle}>Comments, Stars & Profiles</h3>
          <p className={styles.cardDescription}>
            Engage with the community by starring, commenting, and following creators.
          </p>
        </div>

        <div className={styles.highlightCard}>
          <div className={styles.icon}>🎨</div>
          <h3 className={styles.cardTitle}>Custom Color Themes</h3>
          <p className={styles.cardDescription}>
            Define data ranges, pick color palettes, and customize how your map looks.
          </p>
        </div>

      </div>
    </section>
  );
}

export default FeaturedHighlightsSection;
