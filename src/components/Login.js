// src/components/Login.js
import React, { useState, useContext, useEffect } from 'react'; // Import useEffect
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { logIn } from '../api';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { setAuthToken, authToken, loadingProfile } = useContext(UserContext); // Include authToken and loadingProfile
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await logIn({ email, password });
      const token = res.data.token;
      // Save token in localStorage
      localStorage.setItem('token', token);
      // Update authToken in UserContext
      setAuthToken(token);
      // Remove navigate('/dashboard') from here
    } catch (err) {
      console.error('Login Error:', err); // Log the error
      if (err.response) {
        // If there's a response from the server
        console.error('Server Error:', err.response.data.msg);
        alert(err.response.data.msg);
      } else if (err.request) {
        // If the request was made but no response was received
        console.error('No response from server:', err.request);
        alert('No response from server. Please try again.');
      } else {
        // Other errors like network issues
        console.error('Error:', err.message);
        alert('An unexpected error occurred. Please try again.');
      }
    }
  };
    // Use useEffect to navigate after authToken is set and loadingProfile is false
    useEffect(() => {
      if (authToken && !loadingProfile) {
        navigate('/dashboard');
      }
    }, [authToken, loadingProfile, navigate]);

  return (
    <div className={styles.loginContainer}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Password:</label>
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
        Don't have an account? <Link to="/signup">Sign up here</Link>.
      </p>
    </div>
  );
}
