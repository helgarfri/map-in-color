import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styles from "./HomeHeader.module.css";

const SCROLL_THRESHOLD = 60;

export default function HomeHeader() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    handleScroll(); // run once in case we're already scrolled
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") setMobileMenuOpen(false);
    }
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  const navLinks = (
    <>
      <NavLink className={styles.navLink} to="/" onClick={closeMobileMenu}>
        Home
      </NavLink>
      <NavLink className={styles.navLink} to="/playground" onClick={closeMobileMenu}>
        Create
      </NavLink>
      <NavLink className={styles.navLink} to="/explore" onClick={closeMobileMenu}>
        Explore
      </NavLink>
      <NavLink className={styles.navLink} to="/docs" onClick={closeMobileMenu}>
        Docs
      </NavLink>
      <NavLink className={styles.navLink} to="/pro" onClick={closeMobileMenu}>
        Pro
      </NavLink>
    </>
  );

  const ctaButtons = (
    <>
      <div className={styles.navDivider} aria-hidden="true" />
      <button
        className={`${styles.ctaBtn} ${styles.ctaSecondary}`}
        onClick={() => {
          closeMobileMenu();
          navigate("/login");
        }}
        type="button"
      >
        Login
      </button>
      <button
        className={`${styles.ctaBtn} ${styles.ctaPrimary}`}
        onClick={() => {
          closeMobileMenu();
          navigate("/signup");
        }}
        type="button"
      >
        Get started
      </button>
    </>
  );

  return (
    <header
      className={`${styles.headerWrap} ${isScrolled ? styles.headerWrapScrolled : ""} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}
    >
      <div className={styles.header}>
        {/* Desktop: logo left; Mobile: hamburger left, logo centered */}
        <button
          type="button"
          className={styles.hamburger}
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-controls="mobile-nav"
        >
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
          <span className={styles.hamburgerBar} />
        </button>

        <Link className={styles.logoBtn} to="/" aria-label="Go to home">
          <img
            src="/assets/3-0/mic-logo-2-5-text-cropped.png"
            alt="Map in Color"
            className={`${styles.logo} ${styles.logoDesktop}`}
            draggable="false"
          />
          <img
            src="/assets/3-0/MIC-logo-transparent.png"
            alt="Map in Color"
            className={`${styles.logo} ${styles.logoMobile}`}
            draggable="false"
          />
        </Link>

        {/* Mobile-only: Login button on the right; keeps logo centered in 1fr auto 1fr grid */}
        <div className={styles.mobileHeaderRight}>
          <button
            type="button"
            className={styles.mobileLoginBtn}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <nav id="mobile-nav" className={styles.nav} aria-label="Primary navigation">
          {navLinks}
          {ctaButtons}
        </nav>
      </div>

      {/* Mobile dropdown menu */}
      <div
        className={`${styles.mobileMenu} ${mobileMenuOpen ? styles.mobileMenuOpen : ""}`}
        id="mobile-nav-panel"
        aria-hidden={!mobileMenuOpen}
      >
        <nav className={styles.mobileNav} aria-label="Mobile navigation">
          <NavLink className={styles.mobileNavLink} to="/" onClick={closeMobileMenu}>
            Home
          </NavLink>
          <NavLink className={styles.mobileNavLink} to="/playground" onClick={closeMobileMenu}>
            Create
          </NavLink>
          <NavLink className={styles.mobileNavLink} to="/explore" onClick={closeMobileMenu}>
            Explore
          </NavLink>
          <NavLink className={styles.mobileNavLink} to="/docs" onClick={closeMobileMenu}>
            Docs
          </NavLink>
          <NavLink className={styles.mobileNavLink} to="/pro" onClick={closeMobileMenu}>
            Pro
          </NavLink>
          <div className={styles.mobileMenuDivider} />
          <button
            className={styles.mobileCtaSecondary}
            onClick={() => {
              closeMobileMenu();
              navigate("/login");
            }}
            type="button"
          >
            Login
          </button>
          <button
            className={styles.mobileCtaPrimary}
            onClick={() => {
              closeMobileMenu();
              navigate("/signup");
            }}
            type="button"
          >
            Get started
          </button>
        </nav>
      </div>
    </header>
  );
}
