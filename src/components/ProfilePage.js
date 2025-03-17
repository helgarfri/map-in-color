import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Sidebar from './Sidebar';
import Header from './Header';
import ProfileActivityFeed from './ProfileActivityFeed';
import {
  fetchUserProfileByUsername,
  fetchMapsByuser_id,
  fetchStarredMapsByuser_id,
  fetchUserActivity,
  fetchUserMapStats,
  reportProfile
} from '../api';
import {
  FaMapMarkerAlt,
  FaBirthdayCake,
  FaStar,
  FaMap,
  FaBookmark,
  FaListUl
} from 'react-icons/fa';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';
import styles from './ProfilePage.module.css';
import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize'; // <--- import your hook

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();
  const { profile: currentUserProfile, authToken } = useContext(UserContext);
  const { width } = useWindowSize(); // get screen width
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

  // If screen < 1000px, auto-collapse the sidebar
  useEffect(() => {
    if (width < 1000) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [width, setIsCollapsed]);

  // Local state
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [totalMaps, setTotalMaps] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Tabs: 'maps' | 'starred' | 'activity'
  const [currentTab, setCurrentTab] = useState('maps');

  // Data for each tab
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

  // For “Report Profile” modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReasons, setReportReasons] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [isReporting, setIsReporting] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);


  const isMyProfile =
    currentUserProfile && currentUserProfile.username === profile?.username;
    const isUserLoggedIn = !!authToken && !!currentUserProfile;
  // Load user profile data
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoadingProfile(true);
        const res = await fetchUserProfileByUsername(username);
        setProfile(res.data);
        if (res.data.profile_picture) {
          setProfilePictureUrl(res.data.profile_picture);
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

  // Once profile is loaded, fetch stats and tab data
  useEffect(() => {
    if (!profile) return;
    loadUserStats(profile.id);
    fetchMaps();
    fetchStarred();
    fetchActivity();
    // eslint-disable-next-line
  }, [profile]);

  async function loadUserStats(user_id) {
    try {
      const res = await fetchUserMapStats(user_id);
      setTotalMaps(res.data.totalMaps);
      setTotalStars(res.data.totalStars);
    } catch (err) {
      console.error('Error fetching user stats:', err);
    }
  }


  // “Report” button click → show the modal
  function handleReportProfile() {
    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }
    setShowReportModal(true);
  }


  // Submitting the report
  async function handleSubmitProfileReport() {
    if (!profile?.username) return;
    setIsReporting(true);
    try {
      await reportProfile(profile.username, {
        reasons: [reportReasons],
        details: reportDetails
      });

      // Optionally do something (e.g. set a “flagged” state in the UI)
      setShowReportSuccess(true);
      setReportReasons('');
      setReportDetails('');

      // Hide modal after 2 seconds, for example
      setTimeout(() => {
        setShowReportModal(false);
        setShowReportSuccess(false);
      }, 2000);

    } catch (err) {
      console.error('Error reporting profile:', err);
      // Optionally show an error to the user
    } finally {
      setIsReporting(false);
    }
  }

  async function fetchMaps() {
    try {
      setLoadingMaps(true);
      const res = await fetchMapsByuser_id(profile.id, 0, 100);
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
      const res = await fetchStarredMapsByuser_id(profile.id, 0, 100);
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

  // Handle tab change with a brief spinner simulation
  function handleTabChange(tab) {
    setCurrentTab(tab);
    if (tab === 'maps') setLoadingMaps(true);
    if (tab === 'starred') setLoadingStarred(true);
    if (tab === 'activity') setLoadingActivity(true);
    setTimeout(() => {
      if (tab === 'maps') setLoadingMaps(false);
      if (tab === 'starred') setLoadingStarred(false);
      if (tab === 'activity') setLoadingActivity(false);
    }, 300);
  }

  // Sorting functions
  function sortMaps(mapsArray, sortBy) {
    const copy = [...mapsArray];
    if (sortBy === 'newest') {
      copy.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'oldest') {
      copy.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (sortBy === 'mostStarred') {
      copy.sort((a, b) => (b.save_count || 0) - (a.save_count || 0));
    }
    return copy;
  }



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

  // Render a map card for Maps and Starred tabs
  function renderMapCard(map) {
    const mapTitle = map.title || 'Untitled Map';
    const sharedProps = {
      groups: map.groups,
      mapTitleValue: mapTitle,
      ocean_color: map.ocean_color,
      unassigned_color: map.unassigned_color,
      data: map.data,
      selected_map: map.selected_map,
      font_color: map.font_color,
      is_title_hidden: map.is_title_hidden,
      show_top_high_values: false,
      show_top_low_values: false,
    };

    let thumbnail = null;
    if (map.selected_map === 'world') thumbnail = <WorldMapSVG {...sharedProps} />;
    else if (map.selected_map === 'usa') thumbnail = <UsSVG {...sharedProps} />;
    else if (map.selected_map === 'europe') thumbnail = <EuropeSVG {...sharedProps} />;

    return (
      <div key={map.id} className={styles.card} onClick={() => navigate(`/map/${map.id}`)}>
        <div className={styles.cardThumbnail}>
          {thumbnail}
        </div>
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{mapTitle}</h3>
          <div className={styles.detailsRow}>
            <span className={styles.modified}>
              Modified {formatDistanceToNow(new Date(map.updated_at), { addSuffix: true })}
            </span>
            <span className={styles.starDisplay}>
              <FaStar className={styles.starIcon} /> {map.save_count || 0}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className={styles.profilePageContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}>
          <Header
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
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
        <div className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}>
          <Header
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            title="User Not Found"
          />
          <div className={styles.error}>Profile not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.profilePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${styles.profileContent} ${isCollapsed ? styles.contentCollapsed : ''}`}>
        <Header
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          title={profile.username}
        />

        <div className={styles.mainContainer}>
          {/* LEFT COLUMN: Profile Info */}
          <div className={styles.leftColumn}>
            <div className={styles.profileInfoBox}>
              <div className={styles.profilePictureWrapper}>
                <img src={profilePictureUrl} alt="Profile" className={styles.profilePicture} />
              </div>
              <h2 className={styles.username}>@{profile.username}</h2>
              <h1 className={styles.fullName}>
                {profile.first_name} {profile.last_name}
              </h1>

              <div className={styles.infoRow}>
                {profile.location && (
                  <div className={styles.infoItem}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <span>{profile.location}</span>
                  </div>
                )}
                {profile.date_of_birth && (
                  <div className={styles.infoItem}>
                    <FaBirthdayCake className={styles.icon} />
                    <span>
                      {new Date(profile.date_of_birth).toLocaleDateString('en-US', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.statsRowInfo}>
                <div className={styles.statsItem}>
                  <FaStar className={styles.icon} />
                  <span>{totalStars} Stars</span>
                </div>
                <div className={styles.statsItem}>
                  <FaMap className={`${styles.icon} ${styles.mapIcon}`} />
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
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </button>
              )}

              {!isMyProfile && isUserLoggedIn && (
                <button
                  className={styles.reportProfileButton}
                  onClick={handleReportProfile}
                >
                  Report Profile
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Tabs */}
          <div className={styles.rightColumn}>
            <div className={styles.tabs}>
              <button
                className={`${styles.tabButton} ${currentTab === 'maps' ? styles.activeTab : ''}`}
                onClick={() => handleTabChange('maps')}
              >
                <FaMap className={styles.tabIcon} />
                <span>Maps</span>
              </button>
              <button
                className={`${styles.tabButton} ${currentTab === 'starred' ? styles.activeTab : ''}`}
                onClick={() => handleTabChange('starred')}
              >
                <FaBookmark className={styles.tabIcon} />
                <span>Starred</span>
              </button>
              <button
                className={`${styles.tabButton} ${currentTab === 'activity' ? styles.activeTab : ''}`}
                onClick={() => handleTabChange('activity')}
              >
                <FaListUl className={styles.tabIcon} />
                <span>Activity</span>
              </button>
            </div>

            <div className={styles.tabContent}>
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
                  ) : userMaps.length === 0 ? (
                    <p>No maps found.</p>
                  ) : (
                    <div className={styles.cardsGrid}>
                      {userMaps.map((map) => renderMapCard(map))}
                    </div>
                  )}
                </>
              )}

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
                  ) : starredMaps.length === 0 ? (
                    <p>No starred maps.</p>
                  ) : (
                    <div className={styles.cardsGrid}>
                      {starredMaps.map((map) => renderMapCard(map))}
                    </div>
                  )}
                </>
              )}

              {currentTab === 'activity' && (
                <>
                  {loadingActivity ? (
                    <div className={styles.loadingContainer}>
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <div className={styles.activityTabContent}>
                      <ProfileActivityFeed 
                        username={profile.username}
                        profile_pictureUrl={profilePictureUrl}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {showReportModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      {isReporting ? (
        <div className={styles.loadingContainer}>
          <p>Submitting report...</p>
        </div>
      ) : showReportSuccess ? (
        <div className={styles.successContainer}>
          <p>Your report has been submitted.</p>
        </div>
      ) : (
        <>
          <h3>Report Profile</h3>
          <p>
            Please let us know why you are reporting{' '}
            <strong>@{profile.username}</strong>:
          </p>

          <div className={styles.reportOptions}>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Inappropriate profile picture"
                checked={reportReasons === 'Inappropriate profile picture'}
                onChange={(e) => setReportReasons(e.target.value)}
              />
              Inappropriate profile picture
            </label>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Inappropriate name or username"
                checked={reportReasons === 'Inappropriate name or username'}
                onChange={(e) => setReportReasons(e.target.value)}
              />
              Inappropriate name or username
            </label>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Inappropriate description/bio"
                checked={reportReasons === 'Inappropriate description/bio'}
                onChange={(e) => setReportReasons(e.target.value)}
              />
              Inappropriate description/bio
            </label>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Spam or fake profile"
                checked={reportReasons === 'Spam or fake profile'}
                onChange={(e) => setReportReasons(e.target.value)}
              />
              Spam or fake profile
            </label>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Harassment or bullying"
                checked={reportReasons === 'Harassment or bullying'}
                onChange={(e) => setReportReasons(e.target.value)}
              />
              Harassment or bullying
            </label>
          </div>

          <div className={styles.reportDetails}>
            <label>Optional additional details:</label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              placeholder="Share more information (optional)"
            />
          </div>

          <div className={styles.modalActions}>
            <button onClick={handleSubmitProfileReport}>Submit</button>
            <button onClick={() => setShowReportModal(false)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  </div>
)}


    </div>
  );
}
