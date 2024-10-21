// src/components/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { signUp } from '../api';

export default function Signup({ setIsAuthenticated }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState(''); // New state for username
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation for password match
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    try {
      const res = await signUp({ email, password, username }); // Include username in the request
      // Save token in local storage
      localStorage.setItem('token', res.data.token);
      setIsAuthenticated(true);
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
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
  
  return (
    <div className={styles.signupContainer}>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
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
        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.signupButton}>Sign Up</button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login here</Link>.
      </p>
    </div>
  );
}
