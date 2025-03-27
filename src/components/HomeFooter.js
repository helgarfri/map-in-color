import React from 'react';
import { FaGithub, FaInstagram, FaTwitter, FaEnvelope } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styles from './HomeFooter.module.css';

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      {/* First row: social links */}
      <div className={styles.topRow}>
        <a
          href="https://github.com/helgarfri/map-in-color"
          target="_blank"
          rel="noreferrer"
        >
          <FaGithub size={24} />
        </a>
        <a
          href="https://instagram.com/mapincolor"
          target="_blank"
          rel="noreferrer"
        >
          <FaInstagram size={24} />
        </a>
        <a
          href="https://twitter.com/map_in_color"
          target="_blank"
          rel="noreferrer"
        >
          <FaTwitter size={24} />
        </a>
      </div>

      {/* Second row: email, terms, privacy, copyright */}
      <div className={styles.bottomRow}>
        {/* Contact (email icon + address) */}
        <div className={styles.contactInfo}>
          <FaEnvelope size={18} />
          <a href="mailto:hello@mapincolor.com">hello@mapincolor.com</a>
        </div>

        {/* Terms and Privacy Links */}
        <div className={styles.linkGroup}>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/privacy">Privacy Policy</Link>
        </div>

        {/* Copyright */}
        <p>&copy; {new Date().getFullYear()} Map in Color</p>
      </div>
    </footer>
  );
}
