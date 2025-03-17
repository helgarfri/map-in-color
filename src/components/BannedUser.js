// BannedUser.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './BannedUser.module.css';

export default function BannedUser() {
  return (
    <div className={styles.bannedContainer}>
      <h1>Your account is banned</h1>
      <p>
        If you believe this is an error, please contact{' '}
        <a href="mailto:hello@mapincolor.com">hello@mapincolor.com</a>.
      </p>
      <Link to="/">Return to Home</Link>
    </div>
  );
}
