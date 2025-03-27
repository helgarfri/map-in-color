import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Verified.module.css';  // your CSS Module file

export default function Verified() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <div className={styles.checkmark}>✔</div>
        <h1>Account Verified!</h1>
        <p>Your account has been successfully verified. You can now log in and start using Map in Color.</p>
        <Link to="/login" className={styles.loginLink}>Go to Login</Link>
      </div>
    </div>
  );
}
