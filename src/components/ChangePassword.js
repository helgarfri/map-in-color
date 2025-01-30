// src/components/ChangePassword.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ChangePassword.module.css';
import { changeUserPassword } from '../api'; // We'll define changeUserPassword in api.js
import Header from './Header';
import Sidebar from './Sidebar';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setSuccessMessage('');

    // Client-side checks
    const newErrors = {};
    if (!oldPassword) {
      newErrors.oldPassword = 'Please enter your current password.';
    }
    if (!newPassword) {
      newErrors.newPassword = 'Please enter a new password.';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters.';
    }
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'New passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Call the API endpoint
      await changeUserPassword({
        oldPassword,
        newPassword,
      });
      setSuccessMessage('Password updated successfully!');
      // Optionally reset fields
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      // If the server responded with something like: { msg: "Old password incorrect" }
      if (err.response && err.response.data && err.response.data.msg) {
        setGeneralError(err.response.data.msg);
      } else {
        setGeneralError('Failed to change password. Please try again.');
      }
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`${styles.changePasswordContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header title="Change Password" />

        <div className={styles.formContainer}>
          <h2>Change Password</h2>

          {generalError && <div className={styles.errorMessage}>{generalError}</div>}
          {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

          <form onSubmit={handleSubmit}>
            {/* Old Password */}
            <div className={styles.formGroup}>
              <label htmlFor="oldPassword">Current Password</label>
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              {errors.oldPassword && (
                <div className={styles.errorText}>{errors.oldPassword}</div>
              )}
            </div>

            {/* New Password */}
            <div className={styles.formGroup}>
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && (
                <div className={styles.errorText}>{errors.newPassword}</div>
              )}
            </div>

            {/* Confirm New Password */}
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <div className={styles.errorText}>{errors.confirmPassword}</div>
              )}
            </div>

            <button type="submit" className={styles.submitButton}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
