import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './VerifyAccount.module.css';

export default function VerifyAccount() {
  const location = useLocation();
  // If you pass the user's email in location.state or something:
  const email = location.state?.email || 'your email address';

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Please Verify Your Account</h2>
        <p>We’ve sent a verification link to <strong>{email}</strong>. 
           Please check your inbox (and spam folder) to verify your account.</p>
        <p>Once you verify, you can log in and start using Map in Color!</p>
      </div>
    </div>
  );
}
