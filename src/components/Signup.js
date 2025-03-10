import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { signUp } from '../api';
import countries from '../data/countries'; // <-- Import countries array
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
export default function Signup() {
  // States for all form fields
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');

  // We will combine these three into date_of_birth before sending
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const [gender, setGender] = useState('');
  const [location, setLocation] = useState(''); // Will use a select for countries
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Object to hold error messages (field-specific or general)
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Helper arrays for date
  const days = Array.from({ length: 31 }, (_, i) => i + 1); // 1 to 31
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i); // e.g., 2025 down to 1926
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  // Basic client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Check password requirements
    if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter.';
    }
    if (!/[!?.#]/.test(password)) {
      newErrors.password = newErrors.password
        ? `${newErrors.password} Also needs at least one special character (!?.#).`
        : 'Password must contain at least one special character (!?.#).';
    }

    // Check password match
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // More checks as needed (e.g., email format, etc.)

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // 1) Run client-side checks
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // 2) Create a single date_of_birth field (YYYY-MM-DD)
    let date_of_birth = '';
    if (year && month && day) {
      const mm = month.toString().padStart(2, '0'); // zero-pad month
      const dd = day.toString().padStart(2, '0');   // zero-pad day
      date_of_birth = `${year}-${mm}-${dd}`;
    }

    try {
      // Prepare data exactly how your server expects (matching ProfileSettings)
      const res = await signUp({
        first_name,
        last_name,
        date_of_birth, // single string
        gender,
        location,    // selected country
        email,
        username,
        password,
      });

      // If successful, store token and redirect
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      // 1) Check if we have `err.response.data.errors` from express-validator
      if (err.response && err.response.data && err.response.data.errors) {
        const validationErrors = err.response.data.errors; // This is the array
        const newErrors = {};
    
        // Each error might look like:
        // { msg: "Password must contain at least one uppercase letter.", param: "password", ...}
        validationErrors.forEach((errorObj) => {
          // If it's about the "password" field:
          if (errorObj.param === 'password') {
            // Append multiple messages if needed
            if (newErrors.password) {
              newErrors.password += ' ' + errorObj.msg;
            } else {
              newErrors.password = errorObj.msg;
            }
          }
          // If it's about "email":
          if (errorObj.param === 'email') {
            newErrors.email = errorObj.msg;
          }
          // similarly for any other field checks you might add
        });
    
        setErrors(newErrors);
      }
    
      // 2) Otherwise, fall back to checking for `err.response.data.msg`
      else if (err.response && err.response.data && err.response.data.msg) {
        const msg = err.response.data.msg.toLowerCase();
        const newErrors = {};
    
        if (msg.includes('username')) {
          newErrors.username = 'Username is already taken.';
        }
        if (msg.includes('email')) {
          newErrors.email = 'An account already exists with this email.';
        }
    
        if (Object.keys(newErrors).length === 0) {
          newErrors.general = err.response.data.msg;
        }
    
        setErrors(newErrors);
      }
    
      // 3) If there's no `err.response`, then it might be a network error:
      else if (err.request) {
        setErrors({ general: 'No response from server. Please try again.' });
      }
    
      // 4) Some other unexpected error:
      else {
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      }
    }
    
  };

  return (
    <div className={styles.splitContainer}>

          {/* --- Go Back Button (Top-Left Corner) --- */}
          <button onClick={() => navigate('/')} className={styles.goBackButton}>
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

      {/* Right side: Sign Up Form */}
      <div className={styles.rightSide}>
        <div className={styles.signupBox}>
          <h2 className={styles.signupTitle}>Sign Up</h2>

          {/* Top-level error */}
          {errors.general && (
            <div className={styles.errorMessage}>{errors.general}</div>
          )}

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            {/* First & Last Name */}
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  value={first_name}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  value={last_name}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div className={styles.formGroup}>
              <label>Date of Birth</label>
              <div className={styles.dobContainer}>
                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                >
                  <option value="">Day</option>
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  required
                >
                  <option value="">Month</option>
                  {months.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Gender */}
            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="preferNotSay">Prefer not to say</option>
              </select>
            </div>

            {/* Location (Select Country) */}
            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <select
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {errors.email && (
                <div className={styles.errorMessage}>{errors.email}</div>
              )}
            </div>

            {/* Username */}
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              {errors.username && (
                <div className={styles.errorMessage}>{errors.username}</div>
              )}
            </div>

            {/* Password */}
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {errors.password && (
                <div className={styles.errorMessage}>{errors.password}</div>
              )}
            </div>

            {/* Confirm Password */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {errors.confirmPassword && (
                <div className={styles.errorMessage}>
                  {errors.confirmPassword}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button type="submit" className={styles.signupButton}>
              Sign Up
            </button>
          </form>

          <p>
            Already have an account? <Link to="/login">Login here</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
