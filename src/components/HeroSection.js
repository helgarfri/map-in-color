import React from "react";
import styles from "./HeroSection.module.css";

function HeroSection() {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.heroBody}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Turn data into maps people understand.
          </h1>
          <p className={styles.heroSubtitle}>
            Professional map creation for everyone.
          </p>
          <a href="/playground" className={styles.signupButton}>
            Start creating for free
          </a>
        </div>

        <div className={styles.heroImageWrap}>
        <img
          className={`${styles.heroImage} ${styles.heroImageBack}`}
          src="/assets/3-0/southkorea-preview.png"
          alt="South Korea map preview — Map in Color 3.0"
        />
        <img
          className={`${styles.heroImage} ${styles.heroImageFront}`}
          src="/assets/3-0/world-dark-preview.png"
          alt="Interactive world map — Map in Color 3.0"
        />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
