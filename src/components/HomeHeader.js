import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./HomeHeader.module.css";

export default function HomeHeader() {
  const navigate = useNavigate();

  return (
    <header className={styles.headerWrap}>
      <div className={styles.header}>
        {/* Make the logo a Link instead of window.location */}
        <Link className={styles.logoBtn} to="/" aria-label="Go to home">
          <img
            src="/assets/3-0/mic-logo-2-5-text-cropped.png"
            alt="Map in Color"
            className={styles.logo}
            draggable="false"
          />
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          {/* NavLink gives you active styling if you want it later */}
          <NavLink className={styles.navLink} to="/">
            Home
          </NavLink>
          <NavLink className={styles.navLink} to="/explore">
            Explore
          </NavLink>
          <NavLink className={styles.navLink} to="/docs">
            Docs
          </NavLink>

          <div className={styles.navDivider} aria-hidden="true" />

          <button
            className={`${styles.ctaBtn} ${styles.ctaSecondary}`}
            onClick={() => navigate("/login")}
            type="button"
          >
            Login
          </button>

          <button
            className={`${styles.ctaBtn} ${styles.ctaPrimary}`}
            onClick={() => navigate("/signup")}
            type="button"
          >
            Get started
          </button>
        </nav>
      </div>
    </header>
  );
}
