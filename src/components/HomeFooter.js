import React from 'react';
import { FaGithub, FaInstagram, FaTwitter } from 'react-icons/fa';
import styles from './HomeFooter.module.css';

export default function HomeFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
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
      <div className={styles.infoSection}>
        
        <p className={styles.contact}>
          Contact: <a href="mailto:hello@mapincolor.com">hello@mapincolor.com</a>
        </p>
      </div>
      <p className={styles.copyright}>
        &copy; {new Date().getFullYear()} Map in Color
      </p>
    </footer>
  );
}
