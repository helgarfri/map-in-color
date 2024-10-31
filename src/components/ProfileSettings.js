// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { fetchUserProfile, updateUserProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Profile() {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updateUserProfile(profile);
      alert('Profile updated successfully!');
      navigate('/dashboard');
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
      <Sidebar />
      <div className={styles.profileContent}>
        <h2>Edit Profile</h2>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit} className={styles.profileForm}>
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
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
            />
          </label>
          {/* Add other fields as needed */}
          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
