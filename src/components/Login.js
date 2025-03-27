// Login.js
import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { logIn } from '../api';  
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';

export default function Login() {
  const { setAuthToken, authToken, loadingProfile } = useContext(UserContext);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
  
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), 10000)
    );
  
    try {
      const res = await Promise.race([logIn({ identifier, password }), timeout]);
      const token = res.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
  
    } catch (err) {
      console.error('Login Error:', err);
  
      if (err.message === 'timeout') {
        alert('Server timed out after 10 seconds. Please try again later.');
      } else if (err.response) {
        // We have a server response with a status code
        const serverStatus = err.response.status;
        const serverMsg = err.response.data.msg || 'Unknown error';
  
        if (serverStatus === 403) {
          // The server uses 403 for "banned" OR "pending"
          if (serverMsg === 'Your account is banned.') {
            // Banned user
            alert('Your account is banned. You cannot log in.');
            navigate('/banned');
          } else if (serverMsg.includes('verify')) {
            // Pending / unverified user
            alert('Please verify your account before logging in.');
            navigate('/verify-account');
          } else {
            // Any other 403 scenario
            alert(`Forbidden: ${serverMsg}`);
          }
        } else {
          // Some other error, e.g. 400 or 500
          alert(`Server Error: ${serverMsg}`);
        }
      } else if (err.request) {
        // Request was made but no response was received
        alert('No response from server.');
      } else {
        // Anything else (setup errors, etc.)
        alert(`An unexpected error occurred: ${err.message}`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };
  

  useEffect(() => {
    if (authToken && !loadingProfile) {
      navigate('/dashboard');
    }
  }, [authToken, loadingProfile, navigate]);

  return (
    <div className={styles.splitContainer}>
      {isLoggingIn && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.spinner}></div>
            <p>Logging you in...</p>
          </div>
        </div>
      )}

      <button onClick={() => navigate("/")} className={styles.goBackButton}>
        <FontAwesomeIcon icon={faHome} />
      </button>

      {/* Left side */}
      <div className={styles.leftSide}>
        <div className={styles.brandContainer}>
          <img
            src="/assets/map-in-color-logo.png"
            alt="Map in Color Logo"
            className={styles.logo}
          />
          <h1 className={styles.brandText}>Map in Color</h1>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className={styles.rightSide}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Login</h2>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="identifier">Email or Username</label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Login
            </button>
          </form>
          <p>
            Don&rsquo;t have an account? <Link to="/signup">Sign up here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
