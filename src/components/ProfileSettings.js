import React, { useState, useEffect, useCallback } from 'react';
import styles from './ProfileSettings.module.css';
import { fetchUserProfile, updateUserProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import countries from '../data/countries';
import { FaPencilAlt, FaLock, FaHeartBroken } from 'react-icons/fa';
import { format } from 'date-fns';
import Cropper from 'react-easy-crop';

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

  // Modals for country, gender, delete, and crop
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);

  const [editFields, setEditFields] = useState({
    firstName: false,
    lastName: false,
    description: false,
    dateOfBirth: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
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
        // Show existing or default pic
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
    fetchProfileData();
  }, []);

  // Cropping states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  // Helper to create an HTMLImageElement from a URL
  function createImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); 
      image.src = url;
    });
  }

  // Convert the cropped area to a Blob
  async function getCroppedImg(imageSrc, pixelCrop) {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        blob.name = 'cropped.jpg';
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  }

  // Handle text field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // If file is above 1MB, show error and do NOTHING else
    if (file.size > 1024 * 1024) {
      setError('Please upload an image less than 1 MB.');
      return;
    }

    // File is valid size -> proceed
    setError(''); 
    setProfilePicture(file);

    // Show local preview and open Crop Modal
    const previewUrl = URL.createObjectURL(file);
    setLocalProfilePictureUrl(previewUrl);
    setShowCropModal(true);
  };

  // Called when user saves the crop
  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(localProfilePictureUrl, croppedAreaPixels);
      setProfilePicture(croppedBlob); 
      setShowCropModal(false);
      // Show cropped preview
      const newPreviewUrl = URL.createObjectURL(croppedBlob);
      setLocalProfilePictureUrl(newPreviewUrl);
    } catch (err) {
      console.error('Crop error:', err);
      setError('Failed to crop image. Please try again.');
    }
  };

  // Called if user cancels the crop
  const handleCropCancel = () => {
    setProfilePicture(null);
    // revert to existing DB pic if available, else default
    if (profile && profile.profilePicture) {
      const existingUrl = profile.profilePicture.startsWith('/uploads')
        ? `http://localhost:5000${profile.profilePicture}`
        : '/default-profile-pic.jpg';
      setLocalProfilePictureUrl(existingUrl);
    } else {
      setLocalProfilePictureUrl('/default-profile-pic.jpg');
    }
    setShowCropModal(false);
    setError('');
  };

  // For location (country) selection
  const handleSelectCountry = (country) => {
    setFormData({ ...formData, location: country });
    setShowCountryModal(false);
  };

  // Submit changes
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
      // If we have a new cropped profile picture, append it
      if (profilePicture) {
        formDataToSend.append('profilePicture', profilePicture);
      }

      const res = await updateUserProfile(formDataToSend);
      const updatedProfile = res.data;

      // Update local states
      setProfile(updatedProfile);
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

      // Update displayed picture
      const pictureUrl = updatedProfile.profilePicture
        ? `http://localhost:5000${updatedProfile.profilePicture}`
        : '/default-profile-pic.jpg';
      setLocalProfilePictureUrl(pictureUrl);

      setSuccess('Profile updated successfully!');
      // Reset edit flags
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

  // Account deletion flow
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    setShowDeleteModal(false);
    navigate('/delete-account');
  };

  const handleChangePassword = () => {
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
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}>
        <Header title="Settings" />

        {/* Tab navigation */}
        <div className={styles.navigationTabs}>
          <button
            className={`${styles.navTab} ${activeTab === 'account' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`${styles.navTab} ${activeTab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`${styles.navTab} ${activeTab === 'notifications' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            className={`${styles.navTab} ${activeTab === 'privacy' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </button>
        </div>

        {/* Success / Error messages */}
        {success && <div className={styles.successBox}>{success}</div>}
        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.mainContent}>
          <form onSubmit={handleSubmit} className={styles.profileForm}>
            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <>
                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Email:</label>
                  <div className={styles.formField}>
                    <div className={styles.editableValue}>
                      <span className={styles.staticValue}>{formData.email}</span>
                      <div className={styles.emptyIconSpace}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Username:</label>
                  <div className={styles.formField}>
                    <div className={styles.editableValue}>
                      <span className={styles.staticValue}>{formData.username}</span>
                      <div className={styles.emptyIconSpace}></div>
                    </div>
                  </div>
                </div>

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
                {showCountryModal && (
                  <CountryPickerModal
                    onSelectCountry={handleSelectCountry}
                    onClose={() => setShowCountryModal(false)}
                  />
                )}

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
                          onClick={() => setEditFields({ ...editFields, dateOfBirth: true })}
                        />
                      </div>
                    )}
                  </div>
                </div>

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

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <>
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
                          onClick={() => setEditFields({ ...editFields, firstName: true })}
                        />
                      </div>
                    )}
                  </div>
                </div>

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
                          onClick={() => setEditFields({ ...editFields, lastName: true })}
                        />
                      </div>
                    )}
                  </div>
                </div>

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
                      <label htmlFor="profilePictureInput" className={styles.profilePictureEditIcon}>
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

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Description:</label>
                  <div className={styles.formField}>
                    {editFields.description ? (
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formData.description || 'Not specified'}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() => setEditFields({ ...editFields, description: true })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <p>Notification settings are not implemented yet.</p>
            )}
            {activeTab === 'privacy' && <p>Privacy settings are not implemented yet.</p>}

            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} />
      )}

      {/* Crop Modal */}
      {showCropModal && (
        <CropModal
          imageSrc={localProfilePictureUrl}
          crop={crop}
          setCrop={setCrop}
          zoom={zoom}
          setZoom={setZoom}
          onCropComplete={onCropComplete}
          onSave={handleCropSave}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}

/* ------------------------------
   Country Picker Modal
------------------------------ */
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

/* ------------------------------
   Gender Picker Modal
------------------------------ */
function GenderPickerModal({ selectedGender, onSelectGender, onClose }) {
  const genders = ['Male', 'Female', 'Prefer not to say'];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Select Gender</h2>
        <div className={styles.genderList}>
          {genders.map((g) => (
            <div
              key={g}
              className={`${styles.genderItem} ${g === selectedGender ? styles.selectedItem : ''}`}
              onClick={() => onSelectGender(g)}
            >
              {g}
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

/* ------------------------------
   Delete Confirmation Modal
------------------------------ */
function DeleteConfirmationModal({ onClose, onConfirm }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Wait...are you sure?</h2>
        <p>If you delete your account all your data will be lost!</p>
        <div className={styles.modalButtons}>
          <button className={styles.cancelDelete} onClick={onClose}>
            I wanna keep my data
          </button>
          <button className={styles.confirmDelete} onClick={onConfirm}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------
   Crop Modal
------------------------------ */
function CropModal({
  imageSrc,
  crop,
  setCrop,
  zoom,
  setZoom,
  onCropComplete,
  onSave,
  onCancel,
}) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Crop Your Picture</h2>
        <div style={{ position: 'relative', width: '100%', height: '300px' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={false}
          />
        </div>
        <div style={{ marginTop: '20px' }}>
          <label style={{ marginRight: '10px' }}>Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
          />
        </div>
        <div className={styles.modalButtons} style={{ marginTop: '20px' }}>
          <button onClick={onCancel} className={styles.cancelDelete}>
            Cancel
          </button>
          <button onClick={onSave} className={styles.confirmDelete}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
