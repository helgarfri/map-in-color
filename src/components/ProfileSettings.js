// src/components/ProfileSettings.js

import React, { useState, useEffect } from 'react';
import styles from './ProfileSettings.module.css';
import { fetchUserProfile, updateUserProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import countries from '../data/countries';
import { FaPencilAlt, FaLock, FaHeartBroken } from 'react-icons/fa';
import { format } from 'date-fns';

export default function ProfileSettings({ isCollapsed, setIsCollapsed }) {
  const [activeTab, setActiveTab] = useState('account');

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState('');

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

  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  const [editFields, setEditFields] = useState({
    firstName: false,
    lastName: false,
    description: false,
    dateOfBirth: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetchUserProfile();
        const profileData = res.data;
        setProfile(profileData);
        setFormData({
          username: profileData.username,
          email: profileData.email,
          firstName: profileData.firstName || '',
          lastName: profileData.lastName || '',
          location: profileData.location || '',
          description: profileData.description || '',
          gender: profileData.gender || '',
          dateOfBirth: profileData.dateOfBirth || '',
        });
        const pictureUrl = profileData.profilePicture
          ? `http://localhost:5000${profileData.profilePicture}`
          : '/default-profile-pic.jpg';
        setLocalProfilePictureUrl(pictureUrl);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setErrorProfile('Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

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

  const handleSelectCountry = (country) => {
    setFormData({ ...formData, location: country });
    setShowCountryModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('gender', formData.gender);

      if (!profile.dateOfBirth && formData.dateOfBirth) {
        formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      }

      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const res = await updateUserProfile(formDataToSend);
      const updatedProfile = res.data;

      // Update the local profile state
      setProfile(updatedProfile);

      // Update formData with the latest profile data
      setFormData({
        username: updatedProfile.username,
        email: updatedProfile.email,
        firstName: updatedProfile.firstName || '',
        lastName: updatedProfile.lastName || '',
        location: updatedProfile.location || '',
        description: updatedProfile.description || '',
        gender: updatedProfile.gender || '',
        dateOfBirth: updatedProfile.dateOfBirth || '',
      });

      // Update the profile picture URL
      const pictureUrl = updatedProfile.profilePicture
        ? `http://localhost:5000${updatedProfile.profilePicture}`
        : '/default-profile-pic.jpg';
      setLocalProfilePictureUrl(pictureUrl);

      setSuccess('Profile updated successfully!');
      // Reset edit fields
      setEditFields({
        firstName: false,
        lastName: false,
        description: false,
        dateOfBirth: false,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to update profile.');
    }
  };

  const handleDeleteAccount = () => {
    // Implement account deletion logic here
    alert('Account deletion is not implemented yet.');
  };

  const handleChangePassword = () => {
    // Navigate to change password page or open modal
    navigate('/change-password');
  };

  if (loadingProfile) {
    return <div className={styles.loader}>Loading profile...</div>;
  }

  if (errorProfile) {
    return <div className={styles.error}>{errorProfile}</div>;
  }

  if (!profile) {
    return <div className={styles.error}>Profile data is not available.</div>;
  }

  // Format date of birth to dd/mm/yyyy
  const formattedDOB = formData.dateOfBirth
    ? format(new Date(formData.dateOfBirth), 'dd/MM/yyyy')
    : 'Not specified';

  return (
    <div className={styles.profileContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.profileContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header */}
        <Header title="Settings" />

        {/* Navigation Tabs */}
        <div className={styles.navigationTabs}>
          <button
            className={`${styles.navTab} ${
              activeTab === 'account' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`${styles.navTab} ${
              activeTab === 'profile' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`${styles.navTab} ${
              activeTab === 'notifications' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`${styles.navTab} ${
              activeTab === 'privacy' ? styles.activeTab : ''
            }`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </div>

        {/* Success and Error Messages */}
        {success && <div className={styles.successBox}>{success}</div>}
        {error && <div className={styles.errorBox}>{error}</div>}

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            {/* Account Section */}
            {activeTab === 'account' && (
              <>
                {/* Email (non-editable) */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Email:</label>
                  <div className={styles.formField}>
                    <div className={styles.editableValue}>
                      <span className={styles.staticValue}>{formData.email}</span>
                      <div className={styles.emptyIconSpace}></div>
                    </div>
                  </div>
                </div>

                {/* Username (non-editable) */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Username:</label>
                  <div className={styles.formField}>
                    <div className={styles.editableValue}>
                      <span className={styles.staticValue}>{formData.username}</span>
                      <div className={styles.emptyIconSpace}></div>
                    </div>
                  </div>
                </div>

                {/* Gender */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Gender:</label>
                  <div className={styles.formField}>
                    <div className={styles.editableValue}>
                      <span>{formData.gender || 'Not specified'}</span>
                      <FaPencilAlt
                        className={styles.editIcon}
                        onClick={() => setShowGenderModal(true)}
                      />
                    </div>
                  </div>
                </div>

                {showGenderModal && (
                  <GenderPickerModal
                    selectedGender={formData.gender}
                    onSelectGender={(gender) => {
                      setFormData({ ...formData, gender });
                      setShowGenderModal(false);
                    }}
                    onClose={() => setShowGenderModal(false)}
                  />
                )}

                {/* Location */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Location:</label>
                  <div className={styles.formField}>
                    <div className={styles.editableValue}>
                      <span>{formData.location || 'Not specified'}</span>
                      <FaPencilAlt
                        className={styles.editIcon}
                        onClick={() => setShowCountryModal(true)}
                      />
                    </div>
                  </div>
                </div>

                {/* Country Picker Modal */}
                {showCountryModal && (
                  <CountryPickerModal
                    onSelectCountry={handleSelectCountry}
                    onClose={() => setShowCountryModal(false)}
                  />
                )}

                {/* Date of Birth */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Date of Birth:</label>
                  <div className={styles.formField}>
                    {profile.dateOfBirth ? (
                      <div className={styles.editableValue}>
                        <span className={styles.staticValue}>{formattedDOB}</span>
                        <div className={styles.emptyIconSpace}></div>
                      </div>
                    ) : editFields.dateOfBirth ? (
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formattedDOB}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields({ ...editFields, dateOfBirth: true })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Change Password */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Password:</label>
                  <div className={styles.formField}>
                    <button
                      type="button"
                      className={styles.changeButton}
                      onClick={handleChangePassword}
                    >
                      <FaLock className={styles.buttonIcon} />
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}></label>
                  <div className={styles.formField}>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={handleDeleteAccount}
                    >
                      <FaHeartBroken className={styles.buttonIcon} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Profile Section */}
            {activeTab === 'profile' && (
              <>
                {/* First Name */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>First Name:</label>
                  <div className={styles.formField}>
                    {editFields.firstName ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formData.firstName || 'Not specified'}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields({ ...editFields, firstName: true })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Last Name */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Last Name:</label>
                  <div className={styles.formField}>
                    {editFields.lastName ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formData.lastName || 'Not specified'}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields({ ...editFields, lastName: true })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Profile Picture */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Profile Picture:</label>
                  <div className={styles.formField}>
                    <div className={styles.profilePictureContainer}>
                      {localProfilePictureUrl && (
                        <img
                          src={localProfilePictureUrl}
                          alt="Profile"
                          className={styles.profilePicturePreview}
                        />
                      )}
                      <label
                        htmlFor="profilePictureInput"
                        className={styles.profilePictureEditIcon}
                      >
                        <FaPencilAlt />
                      </label>
                      <input
                        type="file"
                        id="profilePictureInput"
                        name="profilePicture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className={styles.profilePictureInput}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Description:</label>
                  <div className={styles.formField}>
                    {editFields.description ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      ></textarea>
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formData.description || 'Not specified'}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields({ ...editFields, description: true })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Notifications Section */}
            {activeTab === 'notifications' && (
              <>
                {/* Notification settings fields */}
                <p>Notification settings are not implemented yet.</p>
              </>
            )}

            {/* Privacy Section */}
            {activeTab === 'privacy' && (
              <>
                {/* Privacy settings fields */}
                <p>Privacy settings are not implemented yet.</p>
              </>
            )}

            {/* Save Changes Button */}
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// Country Picker Modal Component
function CountryPickerModal({ onSelectCountry, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select Country</h2>
        <input
          type="text"
          placeholder="Search country"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <div className={styles.countryList}>
          {filteredCountries.map((country) => (
            <div
              key={country}
              className={styles.countryItem}
              onClick={() => onSelectCountry(country)}
            >
              {country}
            </div>
          ))}
        </div>
        <button className={styles.modalCloseButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// Gender Picker Modal Component
function GenderPickerModal({ selectedGender, onSelectGender, onClose }) {
  const genders = ['Male', 'Female', 'Prefer not to say'];
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select Gender</h2>
        <div className={styles.genderList}>
          {genders.map((gender) => (
            <div
              key={gender}
              className={`${styles.genderItem} ${
                gender === selectedGender ? styles.selectedItem : ''
              }`}
              onClick={() => onSelectGender(gender)}
            >
              {gender}
            </div>
          ))}
        </div>
        <button className={styles.modalCloseButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
