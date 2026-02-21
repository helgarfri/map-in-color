import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./CTASection.module.css";
import HomeFooter from "./HomeFooter";

const SMALL_SCREEN_BREAKPOINT_PX = 1024;

function CTASection() {
  const [isSmallScreen, setIsSmallScreen] = useState(
    () => typeof window !== "undefined" && window.innerWidth < SMALL_SCREEN_BREAKPOINT_PX
  );

  useEffect(() => {
    const onResize = () =>
      setIsSmallScreen(window.innerWidth < SMALL_SCREEN_BREAKPOINT_PX);
    window.addEventListener("resize", onResize);
    onResize();
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <section className={styles.ctaSection} aria-labelledby="cta-title">
      <div className={styles.ctaInner}>
        <h2 id="cta-title" className={styles.ctaTitle}>
          Turn your data into interactive maps.
        </h2>
        <Link
          to={isSmallScreen ? "/signup" : "/playground"}
          className={styles.ctaButton}
        >
          Create your first map
        </Link>
        <p className={styles.ctaTrust}>
          Free to start. Save your map when you&rsquo;re ready.
        </p>
      </div>

      <HomeFooter />
    </section>
  );
}

export default CTASection;
