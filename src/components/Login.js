import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { logIn } from '../api';
import { UserContext } from '../context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
export default function Login() {
  const { setAuthToken, authToken, loadingProfile } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await logIn({ email, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setAuthToken(token);
    } catch (err) {
      console.error('Login Error:', err);
      if (err.response) {
        alert(err.response.data.msg);
      } else if (err.request) {
        alert('No response from server. Please try again.');
      } else {
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };

  useEffect(() => {
    if (authToken && !loadingProfile) {
      navigate('/dashboard');
    }
  }, [authToken, loadingProfile, navigate]);

  return (
    <div className={styles.splitContainer}>

      {/* --- Go Back Button (Top-Left Corner) --- */}
      <button onClick={() => navigate("/")} className={styles.goBackButton}>
        <FontAwesomeIcon icon={faHome} />
      </button>

      {/* Left side: Logo + "Map in Color" text */}
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
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit" className={styles.loginButton}>Login</button>
          </form>
          <p>
            Don&rsquo;t have an account? <Link to="/signup">Sign up here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
