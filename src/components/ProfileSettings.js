// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import styles from './ProfileSettings.module.css';
import { fetchUserProfile, updateUserProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function ProfileSettings({ isCollapsed, setIsCollapsed }) {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    location: '',
    description: '',
    gender: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchUserProfile();
        setProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile.');
        setLoading(false);
      }
    };
    getProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    // Validate new password and confirm password match
    if (
      passwords.newPassword &&
      passwords.newPassword !== passwords.confirmNewPassword
    ) {
      setError('New passwords do not match.');
      return;
    }
  
    try {
      // Prepare JSON data
      const updatedProfile = {
        username: profile.username,
        location: profile.location,
        description: profile.description,
        gender: profile.gender,
      };
  
      if (passwords.currentPassword && passwords.newPassword) {
        updatedProfile.currentPassword = passwords.currentPassword;
        updatedProfile.newPassword = passwords.newPassword;
      }
  
      await updateUserProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
      // Optionally refresh the profile data
      // setProfile(updatedProfile);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };
  

  if (loading) {
    return <div className={styles.loader}>Loading profile...</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={styles.profileContent}>
        <h2>Edit Profile</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          {/* Username */}
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              required
            />
          </label>

          {/* Email (non-editable) */}
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={profile.email}
              readOnly
            />
          </label>

          {/* Profile Picture */}
          <label>
            Profile Picture:
            <input
              type="file"
              name="profilePicture"
              accept="image/*"
              onChange={handleProfilePictureChange}
            />
          </label>

          {/* Location */}
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
            />
          </label>

          {/* Description */}
          <label>
            Description:
            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
            ></textarea>
          </label>

          {/* Gender */}
          <label>
            Gender:
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="nonbinary">Non-binary</option>
              <option value="other">Other</option>
              <option value="preferNotToSay">Prefer not to say</option>
            </select>
          </label>

          {/* Password Change */}
          <h3>Change Password</h3>
          <label>
            Current Password:
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            New Password:
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
            />
          </label>
          <label>
            Confirm New Password:
            <input
              type="password"
              name="confirmNewPassword"
              value={passwords.confirmNewPassword}
              onChange={handlePasswordChange}
            />
          </label>

          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
