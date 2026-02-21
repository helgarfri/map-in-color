import React from 'react';
import { FaGithub, FaInstagram, FaEnvelope, FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
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
          href="https://www.facebook.com/profile.php?id=61588570286962"
          target="_blank"
          rel="noreferrer"
        >
          <FaFacebook size={24} />
        </a>
        <a
          href="https://twitter.com/map_in_color"
          target="_blank"
          rel="noreferrer"
        >
          <FaXTwitter size={24} />
        </a>
      </div>

      {/* Second row: email, terms, privacy, copyright */}
      <div className={styles.bottomRow}>
        {/* Contact (email icon + address) */}
        <div className={styles.contactInfo}>
          <FaEnvelope size={18} />
          <a href="mailto:hello@mapincolor.com">hello@mapincolor.com</a>
        </div>

        {/* Terms, Privacy, and Refund Links */}
        <div className={styles.linkGroup}>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/refund">Refund Policy</Link>
        </div>

        {/* Copyright */}
        <p>&copy; {new Date().getFullYear()} Map in Color</p>
      </div>
    </footer>
  );
}
