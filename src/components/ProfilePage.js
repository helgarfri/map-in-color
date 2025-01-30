import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Sidebar from './Sidebar';
import styles from './ProfilePage.module.css';
import ProfileActivityFeed from './ProfileActivityFeed';
import {
  fetchUserProfileByUsername,
  fetchMapsByUserId,
  fetchStarredMapsByUserId,
  fetchUserActivity,
  fetchUserMapStats
} from '../api';

import {
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaStar,
  FaMap,
  FaBookmark,
  FaListUl,
  FaRegComment
} from 'react-icons/fa';
import { MdCreate } from 'react-icons/md';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';
import Header from './Header';

export default function ProfilePage({ isCollapsed, setIsCollapsed }) {
  const { username } = useParams();
  const navigate = useNavigate();
  const { profile: currentUserProfile } = useContext(UserContext);

  // -----------------------------
  //   Local State
  // -----------------------------
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [totalMaps, setTotalMaps] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Tabs: 'maps' | 'starred' | 'activity'
  const [currentTab, setCurrentTab] = useState('maps');

  // Data in each tab
  const [userMaps, setUserMaps] = useState([]);
  const [starredMaps, setStarredMaps] = useState([]);
  const [activity, setActivity] = useState([]);

  // Loading states
  const [loadingMaps, setLoadingMaps] = useState(false);
  const [loadingStarred, setLoadingStarred] = useState(false);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Sorting
  const [sortMapsBy, setSortMapsBy] = useState('newest');
  const [sortStarredBy, setSortStarredBy] = useState('newest');

  // “Is this my profile?”
  const isMyProfile =
    currentUserProfile && currentUserProfile.username === profile?.username;

  // ----------------------------------------------------------------
  // 1) Load the user profile data by username
  // ----------------------------------------------------------------
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoadingProfile(true);
        const res = await fetchUserProfileByUsername(username);
        setProfile(res.data);

        // If user has a custom profile picture, build the URL;
        // otherwise, use a default image
        if (res.data.profilePicture) {
          setProfilePictureUrl(`http://localhost:5000${res.data.profilePicture}`);
        } else {
          setProfilePictureUrl('/images/default-profile-picture.png');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        navigate('/404');
      } finally {
        setLoadingProfile(false);
      }
    }
    loadUserProfile();
  }, [username, navigate]);

  // ----------------------------------------------------------------
  // 2) Once we have the user profile, fetch stats + data for all tabs
  // ----------------------------------------------------------------
  useEffect(() => {
    if (!profile) return;
    loadUserStats(profile.id);
    fetchMaps();
    fetchStarred();
    fetchActivity();
  }, [profile]);

  async function loadUserStats(userId) {
    try {
      const res = await fetchUserMapStats(userId);
      setTotalMaps(res.data.totalMaps);
      setTotalStars(res.data.totalStars);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  }

  async function fetchMaps() {
    try {
      setLoadingMaps(true);
      const res = await fetchMapsByUserId(profile.id, 0, 100);
      setUserMaps(res.data);
    } catch (err) {
      console.error('Error fetching user maps:', err);
    } finally {
      setLoadingMaps(false);
    }
  }

  async function fetchStarred() {
    try {
      setLoadingStarred(true);
      const res = await fetchStarredMapsByUserId(profile.id, 0, 100);
      setStarredMaps(res.data);
    } catch (err) {
      console.error('Error fetching starred maps:', err);
    } finally {
      setLoadingStarred(false);
    }
  }

  async function fetchActivity() {
    try {
      setLoadingActivity(true);
      const res = await fetchUserActivity(profile.username, 0, 50);
      setActivity(res.data);
    } catch (err) {
      console.error('Error fetching activity:', err);
    } finally {
      setLoadingActivity(false);
    }
  }

  // ----------------------------------------------------------------
  // Tab changes => quick spinner
  // ----------------------------------------------------------------
  function handleTabChange(tab) {
    setCurrentTab(tab);
    if (tab === 'maps') setLoadingMaps(true);
    if (tab === 'starred') setLoadingStarred(true);
    if (tab === 'activity') setLoadingActivity(true);

    // Very short simulated loading
    setTimeout(() => {
      if (tab === 'maps') setLoadingMaps(false);
      if (tab === 'starred') setLoadingStarred(false);
      if (tab === 'activity') setLoadingActivity(false);
    }, 300);
  }

  // ----------------------------------------------------------------
  // Sorting
  // ----------------------------------------------------------------
  useEffect(() => {
    if (userMaps.length === 0) return;
    setLoadingMaps(true);
    const sorted = sortMaps(userMaps, sortMapsBy);
    setUserMaps(sorted);
    setLoadingMaps(false);
  }, [sortMapsBy]);

  useEffect(() => {
    if (starredMaps.length === 0) return;
    setLoadingStarred(true);
    const sorted = sortMaps(starredMaps, sortStarredBy);
    setStarredMaps(sorted);
    setLoadingStarred(false);
  }, [sortStarredBy]);

  function sortMaps(mapsArray, sortBy) {
    const copy = [...mapsArray];
    if (sortBy === 'newest') {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'mostStarred') {
      copy.sort((a, b) => (b.saveCount || 0) - (a.saveCount || 0));
    }
    return copy;
  }

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------
  function formatDate(dateString) {
    if (!dateString) return '';
    const opts = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', opts);
  }
  const dobFormatted = formatDate(profile?.dateOfBirth);

  function formatTimeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  function renderMapThumbnail(map) {
    if (!map) return null;
    const sharedProps = {
      groups: map.groups,
      mapTitleValue: map.title,
      oceanColor: map.oceanColor,
      unassignedColor: map.unassignedColor,
      data: map.data,
      selectedMap: map.selectedMap,
      fontColor: map.fontColor,
      isTitleHidden: map.isTitleHidden,
      showTopHighValues: false,
      showTopLowValues: false,
    };

    if (map.selectedMap === 'world') return <WorldMapSVG {...sharedProps} />;
    if (map.selectedMap === 'usa') return <UsSVG {...sharedProps} />;
    if (map.selectedMap === 'europe') return <EuropeSVG {...sharedProps} />;
    return null;
  }

  function handleEditProfile() {
    navigate('/settings');
  }

  function getActivityIcon(type) {
    if (type === 'commented') return <FaRegComment className={styles.activityIcon} />;
    if (type === 'starredMap') return <FaStar className={styles.activityIcon} style={{ color: 'gold' }} />;
    if (type === 'createdMap') return <MdCreate className={styles.activityIcon} />;
    return <MdCreate className={styles.activityIcon} />;
  }

  // ----------------------------------------------------------------
  // Loading states
  // ----------------------------------------------------------------
  if (loadingProfile) {
    return (
      <div className={styles.profilePageContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}
        >
          <Header title=""/>
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.profilePageContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}
        >
          <Header title={profile.username} />
          <div className={styles.error}>Profile not found.</div>
        </div>
      </div>
    );
  }

  // Prepare sorted arrays to render
  const sortedUserMaps = sortMaps(userMaps, sortMapsBy);
  const sortedStarredMaps = sortMaps(starredMaps, sortStarredBy);

  return (
    <div className={styles.profilePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}
      >
        <Header title={profile.username} />

        <div className={styles.mainContainer}>
          {/* LEFT COLUMN */}
          <div className={styles.leftColumn}>
            <div className={styles.profileInfoBox}>
              <div className={styles.profilePictureWrapper}>
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className={styles.profilePicture}
                />
              </div>
              <h2 className={styles.username}>@{profile.username}</h2>
              <h1 className={styles.fullName}>
                {profile.firstName} {profile.lastName}
              </h1>
              <div className={styles.infoRow}>
                {profile.location && (
                  <div className={styles.infoItem}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {dobFormatted && (
                  <div className={styles.infoItem}>
                    <FaBirthdayCake className={styles.icon} />
                    <span>{dobFormatted}</span>
                  </div>
                )}
              </div>
              <div className={styles.statsRow}>
                <div className={styles.statsItem}>
                  <FaStar className={styles.icon} />
                  <span>{totalStars} Stars</span>
                </div>
                <div className={styles.statsItem}>
                  <FaMap className={styles.icon} />
                  <span>{totalMaps} Maps</span>
                </div>
              </div>

              {profile.description && (
                <div className={styles.bio}>
                  <p>{profile.description}</p>
                </div>
              )}

              {isMyProfile && (
                <button
                  className={styles.editProfileButton}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className={styles.rightColumn}>
            {/* Tabs */}
            <div className={styles.tabs}>
              <button
                className={`${styles.tabButton} ${
                  currentTab === 'maps' ? styles.activeTab : ''
                }`}
                onClick={() => handleTabChange('maps')}
              >
                <FaMap className={styles.tabIcon} />
                <span>Maps</span>
              </button>

              <button
                className={`${styles.tabButton} ${
                  currentTab === 'starred' ? styles.activeTab : ''
                }`}
                onClick={() => handleTabChange('starred')}
              >
                <FaBookmark className={styles.tabIcon} />
                <span>Starred</span>
              </button>

              <button
                className={`${styles.tabButton} ${
                  currentTab === 'activity' ? styles.activeTab : ''
                }`}
                onClick={() => handleTabChange('activity')}
              >
                <FaListUl className={styles.tabIcon} />
                <span>Activity</span>
              </button>
            </div>

            <div className={styles.tabContent}>
              {/* MAPS TAB */}
              {currentTab === 'maps' && (
                <>
                  <div className={styles.sortRow}>
                    <label htmlFor="sortMapsSelect">Sort by:</label>
                    <select
                      id="sortMapsSelect"
                      className={styles.sortSelect}
                      value={sortMapsBy}
                      onChange={(e) => setSortMapsBy(e.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="mostStarred">Most Starred</option>
                    </select>
                  </div>

                  {loadingMaps ? (
                    <div className={styles.loadingContainer}>
                      <LoadingSpinner />
                    </div>
                  ) : sortedUserMaps.length === 0 ? (
                    <p>No maps found.</p>
                  ) : (
                    <div className={styles.mapsGrid}>
                      {sortedUserMaps.map((map) => (
                        <div
                          key={map.id}
                          className={styles.mapCard}
                          onClick={() => navigate(`/map/${map.id}`)}
                        >
                          <div className={styles.mapThumbnail}>
                            {renderMapThumbnail(map)}
                          </div>
                          <div className={styles.mapInfo}>
                            <h3 className={styles.mapTitle}>{map.title || 'Untitled Map'}</h3>
                            <div className={styles.mapStats}>
                              <FaStar className={styles.starIcon} />
                              <span>{map.saveCount || 0}</span>
                            </div>
                            <p className={styles.mapTime}>{formatTimeAgo(map.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* STARRED TAB */}
              {currentTab === 'starred' && (
                <>
                  <div className={styles.sortRow}>
                    <label htmlFor="sortStarredSelect">Sort by:</label>
                    <select
                      id="sortStarredSelect"
                      className={styles.sortSelect}
                      value={sortStarredBy}
                      onChange={(e) => setSortStarredBy(e.target.value)}
                    >
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="mostStarred">Most Starred</option>
                    </select>
                  </div>

                  {loadingStarred ? (
                    <div className={styles.loadingContainer}>
                      <LoadingSpinner />
                    </div>
                  ) : sortedStarredMaps.length === 0 ? (
                    <p>No starred maps.</p>
                  ) : (
                    <div className={styles.mapsGrid}>
                      {sortedStarredMaps.map((map) => (
                        <div
                          key={map.id}
                          className={styles.mapCard}
                          onClick={() => navigate(`/map/${map.id}`)}
                        >
                          <div className={styles.mapThumbnail}>
                            {renderMapThumbnail(map)}
                          </div>
                          <div className={styles.mapInfo}>
                            <h3 className={styles.mapTitle}>{map.title || 'Untitled Map'}</h3>
                            {map.User && (
                              <p className={styles.mapOwner}>By {map.User.username}</p>
                            )}
                            <div className={styles.mapStats}>
                              <FaStar className={styles.starIcon} />
                              <span>{map.saveCount || 0}</span>
                            </div>
                            <p className={styles.mapTime}>{formatTimeAgo(map.createdAt)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* ACTIVITY TAB */}
          {currentTab === 'activity' && (
            <div className={styles.activityTabContent}>
              <h2>Activity</h2>
              <ProfileActivityFeed 
                username={profile.username}
                profilePictureUrl={profilePictureUrl} 

                />
            </div>
          )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
