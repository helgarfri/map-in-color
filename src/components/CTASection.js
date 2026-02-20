import React from "react";
import { Link } from "react-router-dom";
import styles from "./CTASection.module.css";
import HomeFooter from "./HomeFooter";

function CTASection() {
  return (
    <section className={styles.ctaSection} aria-labelledby="cta-title">
      <div className={styles.ctaInner}>
        <h2 id="cta-title" className={styles.ctaTitle}>
          Turn your data into interactive maps.
        </h2>
        <Link to="/playground" className={styles.ctaButton}>
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
