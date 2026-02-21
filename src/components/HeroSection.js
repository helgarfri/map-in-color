import React, { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";

const HEADER_OFFSET_PX = 80;
const SMALL_SCREEN_BREAKPOINT_PX = 1024;

function HeroSection() {
  const [height, setHeight] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight + HEADER_OFFSET_PX : 900
  );
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => typeof window !== "undefined" && window.innerWidth < SMALL_SCREEN_BREAKPOINT_PX
  );

  useEffect(() => {
    const onResize = () => {
      setHeight(window.innerHeight + HEADER_OFFSET_PX);
      setIsSmallScreen(window.innerWidth < SMALL_SCREEN_BREAKPOINT_PX);
    };
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div
      className={styles.heroContainer}
      style={{ height: `${height}px`, minHeight: `${height}px` }}
    >
      <div className={styles.heroBody}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Turn data into maps people understand.
          </h1>
          <p className={styles.heroSubtitle}>
            Professional map creation for everyone.
          </p>
          <a
            href={isSmallScreen ? "/signup" : "/playground"}
            className={styles.signupButton}
          >
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
