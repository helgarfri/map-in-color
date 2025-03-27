import React from 'react';
import { Link } from 'react-router-dom';
import styles from './VerificationError.module.css';

export default function VerificationError() {
  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h1>Verification Failed</h1>
        <p>Your link may be invalid or expired. Please request a new verification link or contact support.</p>
        <Link to="/login">Go to Login</Link>
      </div>
    </div>
  );
}
