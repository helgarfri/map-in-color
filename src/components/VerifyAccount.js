import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './VerifyAccount.module.css';
import axios from 'axios'; // or import from your existing axios setup (e.g. from api.js)

export default function VerifyAccount() {
  const location = useLocation();
  // If you pass the user's email in location.state (from signup),
  // use that. Otherwise, it might be an empty string:
  const email = location.state?.email || '';

  const [resendMessage, setResendMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResendClick = async () => {
    // If we have no email, just skip
    if (!email) {
      setResendMessage('No email available to resend verification.');
      return;
    }
    try {
      setLoading(true);
      setResendMessage('');
      // Make a POST request to /resend-verification
      const res = await axios.post('/api/auth/resend-verification', { email });
      setResendMessage('Verification email resent! Please check your inbox.');
    } catch (err) {
      console.error('Error resending verification:', err);
      if (err.response && err.response.data) {
        setResendMessage(err.response.data.msg || 'Error resending verification email. Please contact support.');
      } else {
        setResendMessage('Unable to resend verification email.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box}>
        <h2>Please Verify Your Account</h2>
        <p>
          We’ve sent a verification link to <strong>{email || 'your email address'}</strong>.
          Please check your inbox (and spam folder) to verify your account.
        </p>
        <p>
          Once you verify, you can log in and start using Map in Color!
        </p>

        {/* Resend Email button */}

       <button className={styles.resendButton} onClick={handleResendClick} disabled={!email || loading}>
          {loading ? 'Resending...' : 'Resend Verification Email'}
        </button> 
        

        {/* Display any message returned from the server */}
        {resendMessage && <p>{resendMessage}</p>}
      </div>
    </div>
  );
}
