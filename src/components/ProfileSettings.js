// src/components/ProfileSettings.js
import React, { useState, useEffect, useCallback, useContext, useRef } from 'react';
import styles from './ProfileSettings.module.css';
import { fetchUserProfile, updateUserProfile, getPaddlePortalUrl } from '../api';
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
import { changeUserPassword } from '../api'; // add at top
import UpgradeProModal from './UpgradeProModal';
import ComingSoonProModal from './ComingSoonProModal';
import ProBadge from './ProBadge';

export default function ProfileSettings() {
  // ----------------------------
  // Contexts for sidebar & user
  // ----------------------------
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { profile, setProfile, isPro } = useContext(UserContext);
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

  // add with your other modal states
const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showUpgradeProModal, setShowUpgradeProModal] = useState(false);
  const [showComingSoonProModal, setShowComingSoonProModal] = useState(false);

// Saving modal states (like DataIntegration)
const [isSaving, setIsSaving] = useState(false);
const [saveSuccess, setSaveSuccess] = useState(false);
const [saveProgress, setSaveProgress] = useState(0);

const progressTimerRef = React.useRef(null);

const startFakeProgress = () => {
  setSaveProgress(8);
  if (progressTimerRef.current) clearInterval(progressTimerRef.current);

  progressTimerRef.current = setInterval(() => {
    setSaveProgress((p) => {
      // creep up but never hit 100 until request finishes
      if (p >= 92) return p;
      const bump = p < 60 ? 6 : p < 80 ? 3 : 1;
      return Math.min(92, p + bump);
    });
  }, 160);
};

const stopFakeProgress = () => {
  if (progressTimerRef.current) {
    clearInterval(progressTimerRef.current);
    progressTimerRef.current = null;
  }
};

useEffect(() => {
  return () => stopFakeProgress();
}, []);



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
    if (file.size > 10 * 1024 * 1024) {
      setError('Please upload an image less than 5 MB.');
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
// Submit => call updateUserProfile => then setProfile(updatedProfile)
// Submit => call updateUserProfile => then setProfile(updatedProfile)
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  setIsSaving(true);
  setSaveSuccess(false);
  startFakeProgress();

  try {
    const payload = new FormData();

    // Basic fields
    payload.append("first_name", formData.first_name);
    payload.append("last_name", formData.last_name);
    payload.append("location", formData.location);
    payload.append("description", formData.description);
    payload.append("gender", formData.gender);

    // Date of birth (only send if user edited it and it has a value)
    if (editFields.date_of_birth && formData.date_of_birth) {
      payload.append("date_of_birth", formData.date_of_birth);
    }

    // Profile picture (IMPORTANT: actually upload it)
    if (profile_picture) {
      payload.append("profile_picture", profile_picture);
    }

    // Privacy
    payload.append("profile_visibility", profileVisibility);
    payload.append("show_saved_maps", String(showSavedMaps));
    payload.append("show_activity_feed", String(showActivityFeed));
    payload.append("star_notifications", String(starNotifications));
    payload.append("show_location", String(showLocation));
    payload.append("show_date_of_birth", String(showDateOfBirth));

    const res = await updateUserProfile(payload);

    // keep UI + context in sync; merge with existing profile so fields not returned
    // by the update API (e.g. email_verified) are preserved and don't flash incorrectly
    setProfile((prev) => (prev ? { ...prev, ...res.data } : res.data));

    stopFakeProgress();
    setSaveProgress(100);
    setSaveSuccess(true);

    // keep the message on this page
    setSuccess("Profile updated successfully!");

    // Close the saving modal after a short delay
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(false);
      setSaveProgress(0);
    }, 1800);
  } catch (err) {
    console.error(err);
    setError("Failed to update profile.");
    setIsSaving(false);
    stopFakeProgress();
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
const handleChangePassword = () => setShowPasswordModal(true);

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

  function PasswordRequirement({ text, isValid }) {
  return (
    <div className={styles.pwReqItem}>
      <span className={`${styles.pwDot} ${isValid ? styles.pwValid : styles.pwInvalid}`} />
      <span>{text}</span>
    </div>
  );
}

function ChangePasswordModal({ onClose }) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Validation
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

    const newErrors = {};
    if (!oldPassword) newErrors.oldPassword = 'Please enter your current password.';
    if (!newPassword) newErrors.newPassword = 'Password is required.';
    else if (!isPasswordValid) newErrors.newPassword = 'Password does not meet the requirements.';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (!passwordsMatch) newErrors.confirmPassword = 'Passwords do not match.';

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsUpdating(true);
    try {
      await changeUserPassword({ oldPassword, newPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
    } catch (err) {
      if (err.response?.data?.msg) setGeneralError(err.response.data.msg);
      else setGeneralError('Failed to change password. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={`${styles.modalOverlay} ${styles.modalOverlayBlur}`} onMouseDown={onClose}>
      <div className={`${styles.modalContent} ${styles.pwModal}`} onMouseDown={(e) => e.stopPropagation()}>
        <div className={styles.pwHeaderRow}>
          <h2 className={styles.pwTitle}>{success ? 'Password updated' : 'Change password'}</h2>
          <button type="button" className={styles.modalX} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {success ? (
          <div className={styles.pwSuccessWrap}>
            <div className={styles.pwSuccessIcon}>✓</div>
            <p className={styles.pwSuccessMessage}>Your password has been updated successfully.</p>
            <div className={styles.modalButtons}>
              <button type="button" className={styles.confirmDelete} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            {generalError && <div className={styles.pwGeneralError}>{generalError}</div>}
            <form onSubmit={handleSubmit} className={styles.pwForm}>
              <div className={styles.pwField}>
                <label className={styles.pwLabel} htmlFor="oldPassword">Current password</label>
                <input
                  className={styles.input}
                  type="password"
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  autoComplete="current-password"
                />
                {errors.oldPassword && <div className={styles.pwError}>{errors.oldPassword}</div>}
              </div>

              <div className={styles.pwField}>
                <label className={styles.pwLabel} htmlFor="newPassword">New password</label>
                <input
                  className={styles.input}
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {errors.newPassword && <div className={styles.pwError}>{errors.newPassword}</div>}
              </div>

              <div className={styles.pwReqGrid}>
                <PasswordRequirement text="At least 6 characters" isValid={isLongEnough} />
                <PasswordRequirement text="One uppercase letter" isValid={hasUpperCase} />
                <PasswordRequirement text="One number" isValid={hasNumber} />
                <PasswordRequirement text="One special (! ? . #)" isValid={hasSpecial} />
              </div>

              <div className={styles.pwField}>
                <label className={styles.pwLabel} htmlFor="confirmPassword">Confirm new password</label>
                <input
                  className={styles.input}
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && <div className={styles.pwError}>{errors.confirmPassword}</div>}
              </div>

              <div className={styles.pwMatchRow}>
                <span className={`${styles.pwDot} ${passwordsMatch ? styles.pwValid : styles.pwInvalid}`} />
                <span>Passwords match</span>
              </div>

              <div className={styles.modalButtons}>
                <button type="button" className={styles.cancelDelete} onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className={styles.confirmDelete} disabled={isUpdating}>
                  {isUpdating ? 'Updating…' : 'Update password'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <div className={styles.page}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`${styles.shell} ${isCollapsed ? styles.shellCollapsed : ""}`}>
        <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} title="Settings" />

        <main className={styles.main}>
          {errorProfile ? (
            <div className={styles.bannerError}>{errorProfile}</div>
          ) : loadingProfile ? (
            <ProfileSettingsSkeleton />
          ) : (
            <>
          
              {/* Top profile header card */}
              <section className={styles.heroCard}>
                <div className={styles.heroLeft}>
                  <div className={styles.avatarWrap}>
                    <img
                      src={localProfilePictureUrl || "/default-profile-pic.jpg"}
                      alt="Profile"
                      className={styles.avatar}
                    />

                    <label htmlFor="profile_pictureInput" className={styles.avatarEditBtn} title="Change photo">
                      <FaPencilAlt />
                    </label>

                    <input
                      type="file"
                      id="profile_pictureInput"
                      name="profile_picture"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className={styles.hiddenFile}
                    />
                  </div>

                  <div className={styles.heroText}>
                    <div className={styles.heroNameRow}>
                      <span className={styles.heroName}>
                        {(formData.first_name || "Your") + " " + (formData.last_name || "Name")}
                      </span>
                      <ProBadge show={isPro} />
                    </div>

                    <div className={styles.heroMetaRow}>
                      <span className={styles.chip}>@{formData.username || "username"}</span>
                      <span className={styles.chipMuted}>{formData.email || "email"}</span>
                    </div>

                    <div className={styles.heroHint}>
                      Tip: Click the pencil icons to edit fields.
                    </div>
                  </div>
                </div>

                <div className={styles.heroRight}>
                  {!isPro && (
                    <button
                      type="button"
                      className={`${styles.pillBtn} ${styles.pillPro}`}
                      onClick={() => setShowUpgradeProModal(true)}
                    >
                      Upgrade to Pro
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.pillBtn}
                    onClick={handleChangePassword}
                  >
                    <FaLock className={styles.pillIcon} />
                    Change password
                  </button>

                  <button
                    type="submit"
                    form="profileSettingsForm"
                    className={`${styles.pillBtn} ${styles.pillPrimary}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  >
                    Save changes
                  </button>
                </div>
              </section>

              <div className={styles.grid}>
                {/* Left navigation (desktop) */}
                <aside className={styles.sideNav}>
                  <div className={styles.sideNavTitle}>Sections</div>

<button
  type="button"
  className={styles.sideNavLink}
  onClick={() => {
    document.getElementById("account")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", "#account");
  }}
>
  Account
</button>
<button type="button" className={styles.sideNavLink} onClick={() => {
  document.getElementById("profile")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#profile");
}}>
  Profile
</button>

<button type="button" className={styles.sideNavLink} onClick={() => {
  document.getElementById("privacy")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#privacy");
}}>
  Privacy
</button>

<button type="button" className={styles.sideNavLink} onClick={() => {
  document.getElementById("subscription")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#subscription");
}}>
  Subscription
</button>

<button type="button" className={`${styles.sideNavLink} ${styles.sideNavDanger}`} onClick={() => {
  document.getElementById("danger")?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", "#danger");
}}>
  Danger zone
</button>

                </aside>

                {/* Main content */}
                <form id="profileSettingsForm" onSubmit={handleSubmit} className={styles.form}>
                  {/* ACCOUNT */}
                  <section id="account" className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>Account</h2>
                      <div className={styles.cardSub}>Basic account details (read-only where applicable)</div>
                    </div>

                    <div className={styles.fieldsGrid}>
                      <FieldDisplay label="Email" value={formData.email} />
                      <FieldDisplay label="Username" value={formData.username} />

                      <FieldAction
                        label="Gender"
                        value={formData.gender || "Not specified"}
                        onEdit={() => setShowGenderModal(true)}
                      />

                      <FieldAction
                        label="Location"
                        value={formData.location || "Not specified"}
                        onEdit={() => setShowCountryModal(true)}
                      />

                      <div className={styles.fieldCard}>
                        <div className={styles.fieldTop}>
                          <div className={styles.fieldLabel}>Date of birth</div>

                          {/* If already set in DB -> read-only */}
                          {profile?.date_of_birth ? (
                            <span className={styles.fieldLock}>Locked</span>
                          ) : editFields.date_of_birth ? (
                            <span className={styles.fieldBadge}>Editing</span>
                          ) : (
                            <button
                              type="button"
                              className={styles.iconBtn}
                              onClick={() =>
                                setEditFields((prev) => ({ ...prev, date_of_birth: true }))
                              }
                              title="Edit date of birth"
                            >
                              <FaPencilAlt />
                            </button>
                          )}
                        </div>

                        <div className={styles.fieldBody}>
                          {profile?.date_of_birth ? (
                            <div className={styles.valueText}>{formattedDOB}</div>
                          ) : editFields.date_of_birth ? (
                            <input
                              className={styles.input}
                              type="date"
                              name="date_of_birth"
                              value={formData.date_of_birth}
                              onChange={handleChange}
                            />
                          ) : (
                            <div className={styles.valueText}>
                              {formatDOB(formData.date_of_birth)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* PROFILE */}
                  <section id="profile" className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>Profile</h2>
                      <div className={styles.cardSub}>What others see when you share your profile</div>
                    </div>

                    <div className={styles.fieldsGrid}>
                      <FieldEdit
                        label="First name"
                        isEditing={editFields.first_name}
                        onEdit={() => setEditFields((p) => ({ ...p, first_name: true }))}
                      >
                        {editFields.first_name ? (
                          <input
                            className={styles.input}
                            type="text"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            placeholder="First name"
                          />
                        ) : (
                          <div className={styles.valueText}>{formData.first_name || "Not specified"}</div>
                        )}
                      </FieldEdit>

                      <FieldEdit
                        label="Last name"
                        isEditing={editFields.last_name}
                        onEdit={() => setEditFields((p) => ({ ...p, last_name: true }))}
                      >
                        {editFields.last_name ? (
                          <input
                            className={styles.input}
                            type="text"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            placeholder="Last name"
                          />
                        ) : (
                          <div className={styles.valueText}>{formData.last_name || "Not specified"}</div>
                        )}
                      </FieldEdit>

                      <FieldEdit
                        label="Description"
                        isEditing={editFields.description}
                        onEdit={() => setEditFields((p) => ({ ...p, description: true }))}
                      >
                        {editFields.description ? (
                          <textarea
                            className={styles.textarea}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            maxLength="150"
                            placeholder="Tell people what your maps are about…"
                          />
                        ) : (
                          <div className={styles.valueText}>
                            {formData.description || "Not specified"}
                          </div>
                        )}
                        <div className={styles.helper}>
                          Max 150 characters.
                        </div>
                      </FieldEdit>
                    </div>
                  </section>

                  {/* PRIVACY */}
                  <section id="privacy" className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>Privacy</h2>
                      <div className={styles.cardSub}>Control what appears on your public profile</div>
                    </div>

                    <div className={styles.privacyGrid}>
                      <div className={styles.fieldCard}>
                        <div className={styles.fieldTop}>
                          <div className={styles.fieldLabel}>Who can view your profile</div>
                        </div>
                        <div className={styles.fieldBody}>
                          <select
                            value={profileVisibility}
                            onChange={handleProfileVisibilityChange}
                            className={styles.select}
                          >
                            <option value="everyone">Everyone</option>
                            <option value="onlyMe">Only Me</option>
                          </select>

                          <div className={styles.helper}>
                            Setting to <b>Only Me</b> disables profile display toggles.
                          </div>
                        </div>
                      </div>

                      <ToggleCard
                        label="Show saved maps"
                        desc="Let people see your saved maps on your profile."
                        isOn={showSavedMaps}
                        onToggle={() => setShowSavedMaps((p) => !p)}
                        disabled={profileVisibility === "onlyMe"}
                      />

                      <ToggleCard
                        label="Show activity feed"
                        desc="Show your latest activity to other users."
                        isOn={showActivityFeed}
                        onToggle={() => setShowActivityFeed((p) => !p)}
                        disabled={profileVisibility === "onlyMe"}
                      />

                      <ToggleCard
                        label="Show location"
                        desc="Display your location on your profile."
                        isOn={showLocation}
                        onToggle={() => setShowLocation((p) => !p)}
                        disabled={profileVisibility === "onlyMe"}
                      />

                      <ToggleCard
                        label="Show date of birth"
                        desc="Display your date of birth on your profile."
                        isOn={showDateOfBirth}
                        onToggle={() => setShowDateOfBirth((p) => !p)}
                        disabled={profileVisibility === "onlyMe"}
                      />

                      <ToggleCard
                        label="Star notifications"
                        desc="Notify others when you star a map."
                        isOn={starNotifications}
                        onToggle={() => setStarNotifications((p) => !p)}
                        disabled={false}
                      />
                    </div>
                  </section>

                  {/* SUBSCRIPTION */}
                  <section id="subscription" className={styles.card}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>Subscription</h2>
                      <div className={styles.cardSub}>
                        {isPro
                          ? "Manage your Pro plan and billing"
                          : "Upgrade to Pro for watermark-free exports and more"}
                      </div>
                    </div>

                    <div className={styles.subscriptionBlock}>
                      <div className={styles.subscriptionPlanRow}>
                        <span className={styles.subscriptionPlanLabel}>Current plan</span>
                        <span className={`${styles.subscriptionPlanBadge} ${isPro ? styles.subscriptionPlanPro : ""}`}>
                          {isPro ? "Pro" : "Free"}
                        </span>
                      </div>
                      {isPro ? (
                        <>
                          <p className={styles.subscriptionDesc}>
                            You have access to all Pro features: no watermark, high-quality exports, SVG, transparent PNG, and unbranded embeds.
                          </p>
                          <button
                            type="button"
                            className={styles.subscriptionManageBtn}
                            onClick={async () => {
                              try {
                                const res = await getPaddlePortalUrl();
                                if (res.data?.url) {
                                  // Same-tab navigation so mobile browsers don't block (window.open after async is often blocked)
                                  window.location.href = res.data.url;
                                } else {
                                  setShowComingSoonProModal(true);
                                }
                              } catch {
                                setShowComingSoonProModal(true);
                              }
                            }}
                          >
                            Manage subscription
                          </button>
                        </>
                      ) : (
                        <>
                          <p className={styles.subscriptionDesc}>
                            Unlock watermark-free exports, SVG and transparent PNG, and unbranded embeds. Less than a coffee per month.
                          </p>
                          <button
                            type="button"
                            className={`${styles.pillBtn} ${styles.pillPrimary} ${styles.subscriptionUpgradeBtn}`}
                            onClick={() => setShowUpgradeProModal(true)}
                          >
                            Upgrade to Pro
                          </button>
                        </>
                      )}
                    </div>
                  </section>

                  {/* DANGER ZONE */}
                  <section id="danger" className={`${styles.card} ${styles.cardDanger}`}>
                    <div className={styles.cardHeader}>
                      <h2 className={styles.cardTitle}>Danger zone</h2>
                      <div className={styles.cardSub}>Permanent actions</div>
                    </div>

                    <div className={styles.dangerRow}>
                      <div>
                        <div className={styles.dangerTitle}>Delete account</div>
                        <div className={styles.dangerText}>
                          Permanently delete your account and all data.
                        </div>
                      </div>

                      <button
                        type="button"
                        className={styles.dangerBtn}
                        onClick={handleDeleteAccount}
                      >
                        <FaHeartBroken className={styles.pillIcon} />
                        Delete account
                      </button>
                    </div>
                  </section>

                  {/* Bottom save bar */}
                  <div className={styles.bottomBar}>
                    <button
                      type="submit"
                      className={`${styles.pillBtn} ${styles.pillPrimary}`}
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                      Save changes
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </main>
      </div>

{/* Saving modal */}
{isSaving && (
  <div className={styles.saveModalOverlay} role="presentation">
    <div
      className={styles.saveModalCard}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-modal-title"
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.saveModalHeader}>
        <div>
          <div className={styles.saveModalEyebrow}>Saving</div>
          <h2 id="save-modal-title" className={styles.saveModalTitle}>
            {saveSuccess ? "Profile saved!" : "Saving your profile…"}
          </h2>
          <p className={styles.saveModalSubtitle}>
            {saveSuccess ? "All changes have been saved." : "This can take a few seconds."}
          </p>
        </div>
      </div>

      <div className={styles.saveModalBody}>
        {saveSuccess ? (
          <div className={styles.saveSuccessWrap}>
            <div className={styles.saveCheckMark}>✓</div>
          </div>
        ) : (
          <div className={styles.saveIconWrap}>
            <div className={styles.saveCloudIcon}>☁</div>
          </div>
        )}

        {!saveSuccess && (
          <>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${saveProgress}%` }} />
            </div>

            <div className={styles.progressMeta}>
              <span>{saveProgress}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}



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

      {/* Change Password Modal */}
{showPasswordModal && (
  <ChangePasswordModal
    onClose={() => setShowPasswordModal(false)}
  />
)}

      {/* Upgrade to Pro Modal */}
      <UpgradeProModal
        isOpen={showUpgradeProModal}
        onClose={() => setShowUpgradeProModal(false)}
        onUpgrade={() => setShowUpgradeProModal(false)}
        passthroughUserId={profile?.id}
        passthroughEmail={profile?.email}
        onProfileRefresh={async () => {
          const res = await fetchUserProfile();
          setProfile(res.data);
        }}
      />

      {/* Coming soon (manage subscription) Modal */}
      <ComingSoonProModal
        isOpen={showComingSoonProModal}
        onClose={() => setShowComingSoonProModal(false)}
      />

    </div>
  );

}

/* ------------------------------
   SKELETON COMPONENT
------------------------------ */
function ProfileSettingsSkeleton() {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonCard}>
        <div className={styles.skeletonBlock} style={{ width: 260, height: 22 }} />
        <div className={styles.skeletonBlock} style={{ width: 340, marginTop: 10 }} />
      </div>

      <div className={styles.skeletonCard}>
        <div className={styles.skeletonBlock} style={{ width: 160 }} />
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonBlock} style={{ height: 90 }} />
          <div className={styles.skeletonBlock} style={{ height: 90 }} />
          <div className={styles.skeletonBlock} style={{ height: 90 }} />
          <div className={styles.skeletonBlock} style={{ height: 90 }} />
        </div>
      </div>

      <div className={styles.skeletonCard}>
        <div className={styles.skeletonBlock} style={{ width: 160 }} />
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonBlock} style={{ height: 90 }} />
          <div className={styles.skeletonBlock} style={{ height: 90 }} />
        </div>
      </div>
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

        <div className={styles.cropArea}>
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

        <div className={styles.cropControls}>
          <label>Zoom</label>
          <input
            className={styles.cropRange}
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
        </div>

        <div className={styles.modalButtons} style={{ marginTop: 14 }}>
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
    aria-pressed={isOn}
  />

  );
}


function FieldDisplay({ label, value }) {
  return (
    <div className={styles.fieldCard}>
      <div className={styles.fieldTop}>
        <div className={styles.fieldLabel}>{label}</div>
        <span className={styles.fieldLock}>Read only</span>
      </div>
      <div className={styles.fieldBody}>
        <div className={styles.valueText}>{value || "Not specified"}</div>
      </div>
    </div>
  );
}

function FieldAction({ label, value, onEdit }) {
  return (
    <div className={styles.fieldCard}>
      <div className={styles.fieldTop}>
        <div className={styles.fieldLabel}>{label}</div>
        <button type="button" className={styles.iconBtn} onClick={onEdit} title={`Edit ${label}`}>
          <FaPencilAlt />
        </button>
      </div>
      <div className={styles.fieldBody}>
        <div className={styles.valueText}>{value}</div>
      </div>
    </div>
  );
}

function FieldEdit({ label, isEditing, onEdit, children }) {
  return (
    <div className={styles.fieldCard}>
      <div className={styles.fieldTop}>
        <div className={styles.fieldLabel}>{label}</div>
        {isEditing ? (
          <span className={styles.fieldBadge}>Editing</span>
        ) : (
          <button type="button" className={styles.iconBtn} onClick={onEdit} title={`Edit ${label}`}>
            <FaPencilAlt />
          </button>
        )}
      </div>
      <div className={styles.fieldBody}>{children}</div>
    </div>
  );
}

function ToggleCard({ label, desc, isOn, onToggle, disabled }) {
  return (
    <div className={styles.toggleCard}>
      <div className={styles.toggleLeft}>
        <div className={styles.toggleTitle}>{label}</div>
        <div className={styles.toggleDesc}>{desc}</div>
      </div>
      <div className={styles.toggleRight}>
        <ToggleSwitch isOn={isOn} onToggle={onToggle} disabled={disabled} />
      </div>
    </div>
  );
}

