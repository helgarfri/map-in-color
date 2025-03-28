import React from "react";
import styles from "./HeroSection.module.css";

function HeroSection() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Create. Explore. Share Data.</h1>
        <p className={styles.heroSubtitle}>
          Turn data into beautiful, interactive maps — no code required.
        </p>
        <a href="/signup" className={styles.signupButton}>
          Join the mappers for free
        </a>
      </div>

      <div className={styles.heroImages}>
        {/* Replace .imagePlaceholder with actual images later */}
        <img
          className={`${styles.imagePlaceholder} ${styles.imageOne}`}
          src="assets/preview4.png"
          alt="Map Preview"
        />

        <img
          className={`${styles.imagePlaceholder} ${styles.imageTwo}`}
          src="assets/preview2.png"
          alt="Map Preview"
        />
      </div>
    </div>
  );
}

export default HeroSection;
