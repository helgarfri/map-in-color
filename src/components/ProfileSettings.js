// src/components/ProfileSettings.js
import React, { useState, useEffect, useCallback, useContext } from 'react';
import styles from './ProfileSettings.module.css';
import { fetchUserProfile, updateUserProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import countries from '../data/countries';
import { FaPencilAlt, FaLock, FaHeartBroken } from 'react-icons/fa';
import { format } from 'date-fns';
import Cropper from 'react-easy-crop';
import { SidebarContext } from '../context/SidebarContext';
import { UserContext } from '../context/UserContext';
import useWindowSize from '../hooks/useWindowSize';

export default function ProfileSettings() {
  // ----------------------------
  // Contexts for sidebar & user
  // ----------------------------
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { profile, setProfile } = useContext(UserContext);
  const { width } = useWindowSize();
  const navigate = useNavigate();

  // ----------------------------
  // Local states
  // ----------------------------
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState('');

  // We keep local form data, but do not overshadow the global context
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    location: '',
    description: '',
    gender: '',
    date_of_birth: '',
  });

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState('everyone');
  const [showSavedMaps, setShowSavedMaps] = useState(true);
  const [starNotifications, setStarNotifications] = useState(true);
  const [showActivityFeed, setShowActivityFeed] = useState(true);
  const [showLocation, setShowLocation] = useState(true);
  const [showDateOfBirth, setShowDateOfBirth] = useState(true);

  // Profile pic states
  const [localProfilePictureUrl, setLocalProfilePictureUrl] = useState('/default-profile-pic.jpg');
  const [profile_picture, setProfilePicture] = useState(null);

  // For status messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // For in-line editing
  const [editFields, setEditFields] = useState({
    first_name: false,
    last_name: false,
    description: false,
    date_of_birth: false,
  });

  // Modals
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);

  // Crop states
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // ----------------------------
  // Auto-collapse sidebar on small screens
  // ----------------------------
  useEffect(() => {
    if (width < 1000) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [width, setIsCollapsed]);

  // ----------------------------
  // Fetch profile from server (or context)
  // ----------------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingProfile(true);
        // If we have no user info in context, fetch from server
        if (!profile) {
          const res = await fetchUserProfile();
          setProfile(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setErrorProfile('Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchData();
  }, [profile, setProfile]);

  // ----------------------------
  // Sync context profile -> local form states
  // ----------------------------
  useEffect(() => {
    if (!profile) return;
    setFormData((prev) => ({
      ...prev,
      username: profile.username || '',
      email: profile.email || '',
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      location: profile.location || '',
      description: profile.description || '',
      gender: profile.gender || '',
      date_of_birth: profile.date_of_birth || '',
    }));

    // Privacy
    if (profile.profile_visibility) {
      setProfileVisibility(profile.profile_visibility);
    }
    if (typeof profile.show_saved_maps === 'boolean') {
      setShowSavedMaps(profile.show_saved_maps);
    }
    if (typeof profile.show_activity_feed === 'boolean') {
      setShowActivityFeed(profile.show_activity_feed);
    }
    if (typeof profile.star_notifications === 'boolean') {
      setStarNotifications(profile.star_notifications);
    }
    if (typeof profile.show_location === 'boolean') {
      setShowLocation(profile.show_location);
    }
    if (typeof profile.show_date_of_birth === 'boolean') {
      setShowDateOfBirth(profile.show_date_of_birth);
    }

    // Profile pic
    if (profile.profile_picture) {
      setLocalProfilePictureUrl(profile.profile_picture);
    } else {
      setLocalProfilePictureUrl('/default-profile-pic.jpg');
    }
  }, [profile]);

  // ----------------------------
  // Crop logic
  // ----------------------------
  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  function createImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', reject);
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });
  }

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

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setError('Please upload an image less than 1 MB.');
      return;
    }
    setError('');
    setProfilePicture(file);
    const previewUrl = URL.createObjectURL(file);
    setLocalProfilePictureUrl(previewUrl);
    setShowCropModal(true);
  };

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(localProfilePictureUrl, croppedAreaPixels);
      setProfilePicture(croppedBlob);
      setShowCropModal(false);

      const newPreviewUrl = URL.createObjectURL(croppedBlob);
      setLocalProfilePictureUrl(newPreviewUrl);
    } catch (err) {
      console.error('Crop error:', err);
      setError('Failed to crop image. Please try again.');
    }
  };

  const handleCropCancel = () => {
    setProfilePicture(null);
    if (profile?.profile_picture) {
      setLocalProfilePictureUrl(profile.profile_picture);
    } else {
      setLocalProfilePictureUrl('/default-profile-pic.jpg');
    }
    setShowCropModal(false);
    setError('');
  };

  // ----------------------------
  // Privacy
  // ----------------------------
  const handleProfileVisibilityChange = (e) => {
    const newVal = e.target.value;
    setProfileVisibility(newVal);

    if (newVal === 'onlyMe') {
      setShowSavedMaps(false);
      setShowActivityFeed(false);
      setShowLocation(false);
      setShowDateOfBirth(false);

    } else if (newVal === 'everyone') {
      setShowSavedMaps(true);
      setShowActivityFeed(true);
      setShowLocation(true)
      setShowDateOfBirth(true)
    }
  };

  // ----------------------------
  // Form
  // ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCountry = (country) => {
    setFormData((prev) => ({ ...prev, location: country }));
    setShowCountryModal(false);
  };

  // Submit => call updateUserProfile => then setProfile(updatedProfile)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const payload = new FormData();
      // Basic fields
      payload.append('first_name', formData.first_name);
      payload.append('last_name', formData.last_name);
      payload.append('location', formData.location);
      payload.append('description', formData.description);
      payload.append('gender', formData.gender);

      // Privacy
      payload.append('profile_visibility', profileVisibility);
      payload.append('show_saved_maps', showSavedMaps);
      payload.append('show_activity_feed', showActivityFeed);
      payload.append('star_notifications', starNotifications);
      payload.append('show_location', showLocation);
      payload.append('show_date_of_birth', showDateOfBirth);

      // date_of_birth only if user had none
      if (!profile?.date_of_birth && formData.date_of_birth) {
        payload.append('date_of_birth', formData.date_of_birth);
      }

      // If changed, append the new picture
      if (profile_picture) {
        payload.append('profile_picture', profile_picture);
      }

      const res = await updateUserProfile(payload);
      const updatedProfile = res.data;
      setProfile(updatedProfile);

      // Success
      setSuccess('Profile updated successfully!');
      setEditFields({
        first_name: false,
        last_name: false,
        description: false,
        date_of_birth: false,
      });
    } catch (err) {
      console.error('Update profile error:', err);
      setError('Failed to update profile.');
    }
  };

  // ----------------------------
  // Delete & Password
  // ----------------------------
  const handleDeleteAccount = () => setShowDeleteModal(true);
  const confirmDelete = () => {
    setShowDeleteModal(false);
    navigate('/delete-account');
  };
  const handleChangePassword = () => navigate('/change-password');

  // Format date of birth
  const formatDOB = (rawDOB) => {
    if (!rawDOB) return 'Not specified';
    try {
      return format(new Date(rawDOB), 'dd/MM/yyyy');
    } catch {
      return rawDOB;
    }
  };
  const formattedDOB = formatDOB(profile?.date_of_birth);

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className={styles.profileContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`${styles.profileContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} title="Settings" />

        {errorProfile ? (
          <div className={styles.errorBox}>{errorProfile}</div>
        ) : loadingProfile ? (
          // RENDER THE SKELETON HERE:
          <ProfileSettingsSkeleton />
        ) : (
          <>
            {success && <div className={styles.successBox}>{success}</div>}
            {error && <div className={styles.errorBox}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.profileForm}>
              {/* ACCOUNT SETTINGS */}
              <section className={styles.settingsSection}>
                <h2 className={styles.sectionTitle}>Account</h2>

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

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Date of Birth:</label>
                  <div className={styles.formField}>
                    {profile?.date_of_birth ? (
                      <div className={styles.editableValue}>
                        <span className={styles.staticValue}>{formattedDOB}</span>
                        <div className={styles.emptyIconSpace}></div>
                      </div>
                    ) : editFields.date_of_birth ? (
                      <input
                        type="date"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formatDOB(formData.date_of_birth)}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields((prev) => ({ ...prev, date_of_birth: true }))
                          }
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
              </section>

              {/* PROFILE SETTINGS */}
              <section className={styles.settingsSection}>
                <h2 className={styles.sectionTitle}>Profile</h2>

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>First Name:</label>
                  <div className={styles.formField}>
                    {editFields.first_name ? (
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formData.first_name || 'Not specified'}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields((prev) => ({ ...prev, first_name: true }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Last Name:</label>
                  <div className={styles.formField}>
                    {editFields.last_name ? (
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formData.last_name || 'Not specified'}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields((prev) => ({ ...prev, last_name: true }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.formLabel}>Profile Picture:</label>
                  <div className={styles.formField}>
                    <div className={styles.profile_pictureContainer}>
                      {localProfilePictureUrl && (
                        <img
                          src={localProfilePictureUrl}
                          alt="Profile"
                          className={styles.profile_picturePreview}
                        />
                      )}
                      <label
                        htmlFor="profile_pictureInput"
                        className={styles.profile_pictureEditIcon}
                      >
                        <FaPencilAlt />
                      </label>
                      <input
                        type="file"
                        id="profile_pictureInput"
                        name="profile_picture"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className={styles.profile_pictureInput}
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
                        maxLength="150"
                      />
                    ) : (
                      <div className={styles.editableValue}>
                        <span>{formData.description || 'Not specified'}</span>
                        <FaPencilAlt
                          className={styles.editIcon}
                          onClick={() =>
                            setEditFields((prev) => ({ ...prev, description: true }))
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* PRIVACY SETTINGS */}
              <section className={styles.settingsSection}>
                <h2 className={styles.sectionTitle}>Privacy</h2>
                <div className={styles.privacySection}>
                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Who can view your profile:</label>
                    <div className={styles.formField}>
                      <select
                        value={profileVisibility}
                        onChange={handleProfileVisibilityChange}
                        className={styles.privacySelect}
                      >
                        <option value="everyone">Everyone</option>
                        <option value="onlyMe">Only Me</option>
                      </select>
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Show saved maps on profile:</label>
                    <div className={styles.formField}>
                      <ToggleSwitch
                        isOn={showSavedMaps}
                        onToggle={() => setShowSavedMaps((prev) => !prev)}
                        disabled={profileVisibility === 'onlyMe'}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Show activity feed on profile:</label>
                    <div className={styles.formField}>
                      <ToggleSwitch
                        isOn={showActivityFeed}
                        onToggle={() => setShowActivityFeed((prev) => !prev)}
                        disabled={profileVisibility === 'onlyMe'}
                      />
                    </div>
                  </div>

                      {/* New Toggle #1: Show Location on Profile */}
                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Show location on profile:</label>
                    <div className={styles.formField}>
                      <ToggleSwitch
                        isOn={showLocation}
                        onToggle={() => setShowLocation((prev) => !prev)}
                        disabled={profileVisibility === 'onlyMe'}
                      />
                    </div>
                  </div>

                  {/* New Toggle #2: Show Date of Birth on Profile */}
                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Show date of birth on profile:</label>
                    <div className={styles.formField}>
                      <ToggleSwitch
                        isOn={showDateOfBirth}
                        onToggle={() => setShowDateOfBirth((prev) => !prev)}
                        disabled={profileVisibility === 'onlyMe'}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <label className={styles.formLabel}>Notify others when you star a map:</label>
                    <div className={styles.formField}>
                      <ToggleSwitch
                        isOn={starNotifications}
                        onToggle={() => setStarNotifications((prev) => !prev)}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.deleteSection}>
                  <div className={styles.deleteInfo}>
                    <h3 className={styles.deleteHeading}>Delete Account</h3>
                    <p className={styles.deleteWarning}>
                      ⚠️ Permanently delete your account and all data
                    </p>
                  </div>
                  <button
                    type="button"
                    className={styles.deleteButton}
                    onClick={handleDeleteAccount}
                  >
                    <FaHeartBroken className={styles.buttonIcon} />
                    Delete My Account
                  </button>
                </div>
              </section>

              <button
                type="submit"
                className={styles.saveButton}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Save Changes
              </button>
            </form>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}

      {/* Country Picker Modal */}
      {showCountryModal && (
        <CountryPickerModal
          onSelectCountry={handleSelectCountry}
          onClose={() => setShowCountryModal(false)}
        />
      )}

      {/* Gender Picker Modal */}
      {showGenderModal && (
        <GenderPickerModal
          selectedGender={formData.gender}
          onSelectGender={(g) => {
            setFormData((prev) => ({ ...prev, gender: g }));
            setShowGenderModal(false);
          }}
          onClose={() => setShowGenderModal(false)}
        />
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
   SKELETON COMPONENT
------------------------------ */
function ProfileSettingsSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      {/* We can mimic the "sections" shape here */}
      {/* Section 1 (Account Settings) */}
      <div className={styles.skeletonSection}>
        <div className={`${styles.skeletonLine} ${styles.skeletonSectionTitle}`} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={styles.skeletonLabel} />
            <div className={styles.skeletonField} />
          </div>
        ))}
      </div>

      {/* Section 2 (Profile Settings) */}
      <div className={styles.skeletonSection}>
        <div className={`${styles.skeletonLine} ${styles.skeletonSectionTitle}`} />
        {/* first_name row */}
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonField} />
        </div>
        {/* last_name row */}
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonField} />
        </div>
        {/* profile picture row */}
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonPic} />
        </div>
        {/* description row */}
        <div className={styles.skeletonRow}>
          <div className={styles.skeletonLabel} />
          <div className={styles.skeletonField} style={{ height: '40px' }} />
        </div>
      </div>

      {/* Section 3 (Privacy Settings) */}
      <div className={styles.skeletonSection}>
        <div className={`${styles.skeletonLine} ${styles.skeletonSectionTitle}`} />
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeletonRow}>
            <div className={styles.skeletonLabel} />
            <div className={styles.skeletonField} />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className={styles.skeletonSaveButton} />
    </div>
  );
}

/* ------------------------------
   DeleteConfirmationModal
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
   CountryPickerModal
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
   GenderPickerModal
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
              className={
                styles.genderItem + ' ' + (g === selectedGender ? styles.selectedItem : '')
              }
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
   CropModal
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

/* ------------------------------
   ToggleSwitch
------------------------------ */
function ToggleSwitch({ isOn, onToggle, disabled }) {
  return (
    <button
      type="button"
      className={`${styles.toggleButton} ${isOn ? styles.toggleOn : styles.toggleOff}`}
      onClick={disabled ? undefined : onToggle}
      disabled={disabled}
    >
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
