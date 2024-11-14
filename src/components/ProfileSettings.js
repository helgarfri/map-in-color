import React, { useState, useContext, useEffect } from 'react';
import styles from './ProfileSettings.module.css';
import { updateUserProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { UserContext } from '../context/UserContext';

export default function ProfileSettings({ isCollapsed, setIsCollapsed }) {
  const {
    profile,
    setProfile,
    profilePictureUrl,
    setProfilePictureUrl,
    loadingProfile,
    errorProfile,
  } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    location: '',
    description: '',
    gender: '',
    dateOfBirth: '',
  });
  

  const [localProfilePictureUrl, setLocalProfilePictureUrl] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (!loadingProfile && profile) {
      setFormData({
        username: profile.username,
        email: profile.email,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        location: profile.location || '',
        description: profile.description || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth || '',
      });
      setLocalProfilePictureUrl(profilePictureUrl);
    }
  }, [loadingProfile, profile, profilePictureUrl]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLocalProfilePictureUrl(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('gender', formData.gender);
  
      // Include dateOfBirth only if it's not set in the profile
      if (!profile.dateOfBirth && formData.dateOfBirth) {
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      }
  
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }
  
      const res = await updateUserProfile(formDataToSend);
  
      // Update the profile data in context
      setProfile({
        ...profile,
        username: res.data.username,
        email: res.data.email,
        firstName: res.data.firstName,
        lastName: res.data.lastName,
        location: res.data.location || '',
        description: res.data.description || '',
        gender: res.data.gender || '',
        dateOfBirth: res.data.dateOfBirth,
      });
  
      // Update the profile picture URL in context
      if (res.data.profilePicture) {
        setProfilePictureUrl(`http://localhost:5000${res.data.profilePicture}`);
      } else {
        setProfilePictureUrl('/images/default-profile-picture.png');
      }
  
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };
  

  if (loadingProfile) {
    return <div className={styles.loader}>Loading profile...</div>;
  }

  if (errorProfile) {
    return <div className={styles.error}>{errorProfile}</div>;
  }

  return (
    <div className={styles.profileContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={styles.profileContent}>
        <h2>Edit Profile</h2>
        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} className={styles.profileForm}>
          {/* First Name */}
<label>
  First Name:
  <input
    type="text"
    name="firstName"
    value={formData.firstName}
    onChange={handleChange}
  />
</label>

{/* Last Name */}
<label>
  Last Name:
  <input
    type="text"
    name="lastName"
    value={formData.lastName}
    onChange={handleChange}
  />
</label>

{/* Date of Birth */}
<label>
  Date of Birth:
  <input
    type="date"
    name="dateOfBirth"
    value={formData.dateOfBirth}
    onChange={handleChange}
    disabled={profile.dateOfBirth ? true : false}
  />
</label>

          {/* Username */}
          <label>
            Username:
            <input
              type="text"
              name="username"
              value={formData.username}
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
              value={formData.email}
              readOnly
            />
          </label>

          {/* Profile Picture */}
          <label>
            Profile Picture:
            {localProfilePictureUrl && (
              <img
                src={localProfilePictureUrl}
                alt="Profile"
                style={{ width: '100px', height: '100px' }}
              />
            )}
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
              value={formData.location}
              onChange={handleChange}
            />
          </label>

          {/* Description */}
          <label>
            Description:
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </label>

          {/* Gender */}
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="preferNotToSay">Prefer not to say</option>
            </select>
          </label>

          <button type="submit" className={styles.saveButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
