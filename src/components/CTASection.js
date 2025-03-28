import React from "react";
import styles from "./CTASection.module.css";
import Footer from "./Footer";
import HomeFooter from "./HomeFooter";

function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <h2 className={styles.ctaTitle}>Map what matters</h2>
      <p className={styles.ctaSubtitle}>
        Join a platform built for creating, exploring, and sharing data through
        maps.
      </p>
      <a href="/signup" className={styles.ctaButton}>
        Join the mappers for free
      </a>
      <p className={styles.ctaNote}>
        You’re early — help shape Mic from day one.
      </p>

      <HomeFooter />
    </section>
  );
}

export default CTASection;
