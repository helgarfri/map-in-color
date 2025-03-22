import React, { useState, useEffect, useCallback, useContext } from 'react';
import styles from './ProfileSettings.module.css';
import { fetchUserProfile, updateUserProfile } from '../api';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';
import countries from '../data/countries';
import { FaPencilAlt, FaLock, FaHeartBroken } from 'react-icons/fa';
import { format } from 'date-fns';
import Cropper from 'react-easy-crop';
import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize';

export default function ProfileSettings() {
  const [activeTab, setActiveTab] = useState('account');
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState('');
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();

  // ----------------------------
  // Privacy states
  // ----------------------------
  const [profileVisibility, setProfileVisibility] = useState('everyone');
  const [showSavedMaps, setShowSavedMaps] = useState(true);
  const [showComments, setShowComments] = useState(true);
  const [showActivityFeed, setShowActivityFeed] = useState(true);

  // ----------------------------
  // Basic form states
  // ----------------------------
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
  const [localProfilePictureUrl, setLocalProfilePictureUrl] = useState('');
  const [profile_picture, setProfilePicture] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // For modals
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);

  const [editFields, setEditFields] = useState({
    first_name: false,
    last_name: false,
    description: false,
    date_of_birth: false,
  });

  const navigate = useNavigate();

  // ----------------------------
  // Collapse sidebar if needed
  // ----------------------------
  useEffect(() => {
    if (width < 1000 && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [width, isCollapsed, setIsCollapsed]);

  // ----------------------------
  // Fetch initial profile
  // ----------------------------
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoadingProfile(true);
        const res = await fetchUserProfile();
        const p = res.data;
        setProfile(p);

        // Basic form fields
        setFormData({
          username: p.username,
          email: p.email,
          first_name: p.first_name || '',
          last_name: p.last_name || '',
          location: p.location || '',
          description: p.description || '',
          gender: p.gender || '',
          date_of_birth: p.date_of_birth || '',
        });

        // Privacy fields
        if (p.profile_visibility) {
          setProfileVisibility(p.profile_visibility);
        }
        if (typeof p.show_saved_maps === 'boolean') setShowSavedMaps(p.show_saved_maps);
        if (typeof p.show_comments === 'boolean') setShowComments(p.show_comments);
        if (typeof p.show_activity_feed === 'boolean') setShowActivityFeed(p.show_activity_feed);

        // Profile pic
        if (p.profile_picture) {
          setLocalProfilePictureUrl(p.profile_picture);
        } else {
          setLocalProfilePictureUrl('/default-profile-pic.jpg');
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        setErrorProfile('Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfileData();
  }, []);

  // ----------------------------
  // Crop states & logic
  // ----------------------------
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

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
  // Form handling
  // ----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectCountry = (country) => {
    setFormData((prev) => ({ ...prev, location: country }));
    setShowCountryModal(false);
  };

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

      // Privacy fields
      payload.append('profile_visibility', profileVisibility);
      payload.append('show_saved_maps', showSavedMaps);
      payload.append('show_comments', showComments);
      payload.append('show_activity_feed', showActivityFeed);

      // Date of birth only if user never had one
      if (!profile?.date_of_birth && formData.date_of_birth) {
        payload.append('date_of_birth', formData.date_of_birth);
      }

      // Picture if changed
      if (profile_picture) {
        payload.append('profile_picture', profile_picture);
      }

      const res = await updateUserProfile(payload);
      const updatedProfile = res.data;

      // Update local states with what the server actually returned
      setProfile(updatedProfile);
      setFormData({
        username: updatedProfile.username,
        email: updatedProfile.email,
        first_name: updatedProfile.first_name || '',
        last_name: updatedProfile.last_name || '',
        location: updatedProfile.location || '',
        description: updatedProfile.description || '',
        gender: updatedProfile.gender || '',
        date_of_birth: updatedProfile.date_of_birth || '',
      });

      // Privacy
      if (updatedProfile.profile_visibility) {
        setProfileVisibility(updatedProfile.profile_visibility);
      }
      if (typeof updatedProfile.show_saved_maps === 'boolean') {
        setShowSavedMaps(updatedProfile.show_saved_maps);
      }
      if (typeof updatedProfile.show_comments === 'boolean') {
        setShowComments(updatedProfile.show_comments);
      }
      if (typeof updatedProfile.show_activity_feed === 'boolean') {
        setShowActivityFeed(updatedProfile.show_activity_feed);
      }

      // Picture
      if (updatedProfile.profile_picture) {
        setLocalProfilePictureUrl(updatedProfile.profile_picture);
      } else {
        setLocalProfilePictureUrl('/default-profile-pic.jpg');
      }

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

  // Delete account
  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };
  const confirmDelete = () => {
    setShowDeleteModal(false);
    navigate('/delete-account');
  };

  // Change password
  const handleChangePassword = () => {
    navigate('/change-password');
  };

  // Format date of birth
  const formattedDOB = formData.date_of_birth
    ? format(new Date(formData.date_of_birth), 'dd/MM/yyyy')
    : 'Not specified';

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className={styles.profileContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}>
        <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} title="Settings" />

        {loadingProfile ? (
          <LoadingSpinner />
        ) : errorProfile ? (
          <div className={styles.error}>{errorProfile}</div>
        ) : (
          <>
            {/* Tabs */}
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
                className={`${styles.navTab} ${activeTab === 'privacy' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                Privacy
              </button>
            </div>

            {success && <div className={styles.successBox}>{success}</div>}
            {error && <div className={styles.errorBox}>{error}</div>}

            <div className={styles.mainContent}>
              <form onSubmit={handleSubmit} className={styles.profileForm}>
                {/* ---------------- ACCOUNT TAB ---------------- */}
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
                          setFormData((prev) => ({ ...prev, gender }));
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
                            <span>{formattedDOB}</span>
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
                  </>
                )}

                {/* ---------------- PROFILE TAB ---------------- */}
                {activeTab === 'profile' && (
                  <>
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
                  </>
                )}

                {/* ---------------- PRIVACY TAB ---------------- */}
                {activeTab === 'privacy' && (
                  <>
                    <div className={styles.privacySection}>
                      <h3 className={styles.privacyHeading}>Profile Visibility</h3>

                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>Who can view your profile:</label>
                        <div className={styles.formField}>
                          <select
                            value={profileVisibility}
                            onChange={(e) => setProfileVisibility(e.target.value)}
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
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>Show comments on profile:</label>
                        <div className={styles.formField}>
                          <ToggleSwitch
                            isOn={showComments}
                            onToggle={() => setShowComments((prev) => !prev)}
                          />
                        </div>
                      </div>

                      <div className={styles.formRow}>
                        <label className={styles.formLabel}>Show activity feed on profile:</label>
                        <div className={styles.formField}>
                          <ToggleSwitch
                            isOn={showActivityFeed}
                            onToggle={() => setShowActivityFeed((prev) => !prev)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className={styles.deleteSection}>
                      <h3 className={styles.deleteHeading}>Delete Account</h3>
                      <p className={styles.deleteWarning}>
                        ⚠️ Permanently delete your account and all data
                      </p>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={handleDeleteAccount}
                      >
                        <FaHeartBroken className={styles.buttonIcon} />
                        Delete My Account
                      </button>
                    </div>
                  </>
                )}

                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
              </form>
            </div>
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
              className={styles.genderItem + ' ' + (g === selectedGender ? styles.selectedItem : '')}
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
  onCancel
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
   Toggle Switch
------------------------------ */
function ToggleSwitch({ isOn, onToggle }) {
  return (
    <button
      type="button"
      className={`${styles.toggleButton} ${isOn ? styles.toggleOn : styles.toggleOff}`}
      onClick={onToggle}
    >
      {isOn ? 'On' : 'Off'}
    </button>
  );
}
