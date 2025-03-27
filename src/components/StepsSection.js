import React from 'react';
import styles from './StepsSection.module.css';
import WorldMapSVG from './WorldMapSVG';

function StepsSection() {
  return (
    <div className={styles.stepsContainer}>
      <h2 className={styles.sectionTitle}>How It Works</h2>

      <div className={styles.stepsWrapper}>
        {/* Step 1 */}
        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>🗺️</div>
          <h3 className={styles.stepTitle}>Create Your Map</h3>
          <p className={styles.stepText}>
          Upload your CSV and instantly map your data.          </p>
        </div>

        {/* Step 2 */}
        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>🌐</div>
          <h3 className={styles.stepTitle}>Publish & Share</h3>
          <p className={styles.stepText}>
          Customize your map’s details and choose who gets to see it.
          </p>
        </div>

        {/* Step 3 */}
        <div className={styles.stepCard}>
          <div className={styles.stepIcon}>🔎</div>
          <h3 className={styles.stepTitle}>Explore & Connect</h3>
          <p className={styles.stepText}>
          Explore what others are mapping — and join the conversation.
          </p>
        </div>
      </div>

    
    </div>
  );
}

export default StepsSection;
