import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Signup.module.css';
import { signUp } from '../api';
import countries from '../data/countries';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const PasswordRequirement = ({ text, isValid }) => {
  return (
    <div className={styles.passwordRequirementItem}>
      <div
        className={`${styles.requirementIcon} ${
          isValid ? styles.valid : styles.invalid
        }`}
      ></div>
      <span>{text}</span>
    </div>
  );
};

export default function Signup() {
  // States for form fields
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Checkbox for Privacy Policy acceptance
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  // States for errors, sign-up/loading, success, and policy modal
  const [errors, setErrors] = useState({});
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);


  const navigate = useNavigate();

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);
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

  // Live password checks
  const isLongEnough = password.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!?.#]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== '';

  // Helper: Validate form before submit
  const validateForm = () => {
    const newErrors = {};

    if (!first_name.trim()) {
      newErrors.first_name = 'First name is required.';
    }
    if (!last_name.trim()) {
      newErrors.last_name = 'Last name is required.';
    }
    if (!year || !month || !day) {
      newErrors.date_of_birth = 'Date of birth is required.';
    } else {
      const dob = new Date(`${year}-${month}-${day}`);
      const now = new Date();
      if (dob > now) {
        newErrors.date_of_birth = 'Date of birth cannot be in the future.';
      }
    }
    if (!gender) {
      newErrors.gender = 'Gender is required.';
    }
    if (!location) {
      newErrors.location = 'Location is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Invalid email format.';
      }
    }
    if (!username.trim()) {
      newErrors.username = 'Username is required.';
    }
    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (!isLongEnough || !hasUpperCase || !hasNumber || !hasSpecial) {
      newErrors.password = 'Password does not meet the requirements.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (!passwordsMatch) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Check the privacy policy acceptance
    if (!acceptPolicy) {
      newErrors.acceptPolicy = 'You need to accept the terms.';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Run validations
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    // Construct date_of_birth string
    let date_of_birth = '';
    if (year && month && day) {
      const mm = month.toString().padStart(2, '0');
      const dd = day.toString().padStart(2, '0');
      date_of_birth = `${year}-${mm}-${dd}`;
    }

    // Show modal (loading state)
    setIsSigningUp(true);

    try {
      const res = await signUp({
        first_name,
        last_name,
        date_of_birth,
        gender,
        location,
        email,
        username,
        password,
      });
      localStorage.setItem('token', res.data.token);

      // Display success modal
      setSignupSuccess(true);
      setTimeout(() => {
        navigate('/verify-account');
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors({ general: err.response.data.msg || 'Sign up error' });
      } else {
        setErrors({ general: 'Server error. Please try again.' });
      }
      setIsSigningUp(false);
    }
  };

  return (
    <div className={styles.splitContainer}>
      {/* Modal overlay for signing up process */}
      {isSigningUp && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            {signupSuccess ? (
              <>
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className={styles.successIcon}
                />
                <p>Account successfully created!</p>
              </>
            ) : (
              <>
                <div className={styles.spinner}></div>
                <p>Creating your profile...</p>
              </>
            )}
          </div>
        </div>
      )}

    {showPolicyModal && (
      // Clicking the overlay itself will close the modal
      <div
        className={styles.modalOverlay}
        onClick={() => setShowPolicyModal(false)}
      >
        {/* Prevent the click inside modal content from closing it */}
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src="/privacy.html"
            className={styles.privacyIframe}
            title="Privacy Policy"
          ></iframe>
        </div>
      </div>
    )}

{showTermsModal && (
      // Clicking the overlay itself will close the modal
      <div
        className={styles.modalOverlay}
        onClick={() => setShowTermsModal(false)}
      >
        {/* Prevent the click inside modal content from closing it */}
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <iframe
            src="/terms.html"
            className={styles.privacyIframe}
            title="Privacy Policy"
          ></iframe>
        </div>
      </div>
    )}


      {/* Go Back Button (Top-Left Corner) */}
      <button onClick={() => navigate('/')} className={styles.goBackButton}>
        <FontAwesomeIcon icon={faHome} />
      </button>

      {/* Left side: Branding */}
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
          

          <form onSubmit={handleSubmit} className={styles.signupForm}>
            <div className={styles.formColumns}>
              {/* Left Column: Personal Details */}
              <div className={styles.leftColumn}>
                {/* First & Last Name */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="first_name">First Name</label>
                    <input
                      type="text"
                      id="first_name"
                      value={first_name}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    {errors.first_name && (
                      <div className={styles.errorMessage}>
                        {errors.first_name}
                      </div>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="last_name">Last Name</label>
                    <input
                      type="text"
                      id="last_name"
                      value={last_name}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    {errors.last_name && (
                      <div className={styles.errorMessage}>
                        {errors.last_name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className={styles.errorMessage}>{errors.email}</div>
                  )}
                </div>

                {/* Date of Birth */}
                <div className={styles.formGroup}>
                  <label>Date of Birth</label>
                  <div className={styles.dobContainer}>
                    <select value={day} onChange={(e) => setDay(e.target.value)}>
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
                    >
                      <option value="">Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.date_of_birth && (
                    <div className={styles.errorMessage}>
                      {errors.date_of_birth}
                    </div>
                  )}
                </div>

                {/* Gender */}
                <div className={styles.formGroup}>
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  {errors.gender && (
                    <div className={styles.errorMessage}>{errors.gender}</div>
                  )}
                </div>

                {/* Location */}
                <div className={styles.formGroup}>
                  <label htmlFor="location">Location</label>
                  <select
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="">Select a country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.location && (
                    <div className={styles.errorMessage}>{errors.location}</div>
                  )}
                </div>
              </div>

              {/* Right Column: Account Details */}
              <div className={styles.rightColumn}>
                {/* Username */}
                <div className={styles.formGroup}>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/\s/g, '').toLowerCase())
                    }
                    autoComplete="off"
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
                  />
                  {errors.password && (
                    <div className={styles.errorMessage}>{errors.password}</div>
                  )}
                </div>

                {/* Password Requirements */}
                <div className={styles.passwordRequirementsGrid}>
                  <PasswordRequirement
                    text="At least 6 characters"
                    isValid={isLongEnough}
                  />
                  <PasswordRequirement
                    text="At least one uppercase letter"
                    isValid={hasUpperCase}
                  />
                  <PasswordRequirement
                    text="At least one number"
                    isValid={hasNumber}
                  />
                  <PasswordRequirement
                    text="At least one special character"
                    isValid={hasSpecial}
                  />
                </div>

                {/* Confirm Password */}
                <div className={styles.formGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <div className={styles.errorMessage}>
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                {/* Password Match Indicator */}
                <div className={styles.passwordMatch}>
                  <div
                    className={`${styles.requirementIcon} ${
                      passwordsMatch ? styles.valid : styles.invalid
                    }`}
                  ></div>
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            {errors.general && (
            <p className={styles.errorMessageGeneral}>{errors.general}</p>
          )}

            <div className={styles.formGroupCheckbox}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={acceptPolicy}
                  onChange={(e) => setAcceptPolicy(e.target.checked)}
                />
                {/* Text & links in their own container */}
                <div className={styles.termsText}>
                  <span>I agree to the</span>
                  <button
                    type="button"
                    className={styles.privacyLink}
                    onClick={() => setShowTermsModal(true)}
                  >
                    Terms of Use
                  </button>
                  <span>and</span>
                  <button
                    type="button"
                    className={styles.privacyLink}
                    onClick={() => setShowPolicyModal(true)}
                  >
                    Privacy Policy
                  </button>
                  {/* Final dot as a separate element */}
                  <span className={styles.dot}>.</span>
                </div>
              </label>
              {errors.acceptPolicy && (
                <div className={styles.errorMessage}>{errors.acceptPolicy}</div>
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
