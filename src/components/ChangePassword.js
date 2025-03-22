// src/components/ChangePassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.css';
import { changeUserPassword } from '../api';
import Header from './Header';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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

export default function ChangePassword({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();

  // Local states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error/success messages
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Password validation checks
  const isLongEnough = newPassword.length >= 6;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!?.#]/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';
  const isPasswordValid =
    isLongEnough && hasUpperCase && hasNumber && hasSpecial && passwordsMatch;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setSuccessMessage('');

    // Client-side validation
    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = 'Please enter your current password.';
    if (!newPassword) {
      newErrors.newPassword = 'Password is required.';
    } else if (!isPasswordValid) {
      newErrors.newPassword = 'Password does not meet the requirements.';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (!passwordsMatch) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsUpdating(true);
    try {
      await changeUserPassword({ oldPassword, newPassword });
      setSuccessMessage('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      if (err.response?.data?.msg) {
        setGeneralError(err.response.data.msg);
      } else {
        setGeneralError('Failed to change password. Please try again.');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${styles.changePasswordContent} ${isCollapsed ? styles.contentCollapsed : ''}`}>
        <Header title="Change Password" />
        <div className={styles.centerContainer}>
          <div className={styles.formContainer}>
            <h2>Change Password</h2>
            {generalError && <div className={styles.errorMessage}>{generalError}</div>}
            {successMessage && (
              <div className={styles.successMessage}>
                <FontAwesomeIcon icon={faCheckCircle} className={styles.successIcon} />
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="oldPassword">Current Password</label>
                <input
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                {errors.oldPassword && <div className={styles.errorText}>{errors.oldPassword}</div>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {errors.newPassword && <div className={styles.errorText}>{errors.newPassword}</div>}
              </div>

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

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <div className={styles.errorText}>{errors.confirmPassword}</div>}
              </div>

              <div className={styles.passwordMatch}>
                <div
                  className={`${styles.requirementIcon} ${
                    passwordsMatch ? styles.valid : styles.invalid
                  }`}
                ></div>
                <span>Passwords match</span>
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}