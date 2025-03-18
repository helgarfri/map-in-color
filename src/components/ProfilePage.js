import React, { useContext, useEffect, useState, useRef } from 'react';
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
import useWindowSize from '../hooks/useWindowSize';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();

  const { profile: currentUserProfile, authToken } = useContext(UserContext);
  const { width } = useWindowSize();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

  // Auto-collapse sidebar on narrow screens
  useEffect(() => {
    if (width < 1000 && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [width, isCollapsed, setIsCollapsed]);

  // Basic profile info
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Stats (maps & stars)
  const [totalMaps, setTotalMaps] = useState(0);
  const [totalStars, setTotalStars] = useState(0);

  // Tab handling: 'maps' | 'starred' | 'activity'
  const [currentTab, setCurrentTab] = useState('maps');

  // "Report Profile" modal
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReasons, setReportReasons] = useState('');
  const reportDetailsRef = useRef('');
  const [isReporting, setIsReporting] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  // Activity feed
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Are we looking at our own profile?
  const isMyProfile =
    currentUserProfile && currentUserProfile.username === profile?.username;
  const isUserLoggedIn = !!authToken && !!currentUserProfile;

  // -----------------------------------------------
  //  Pagination + Sorting (Maps)
  // -----------------------------------------------
  const [userMaps, setUserMaps] = useState([]);
  const [loadingMaps, setLoadingMaps] = useState(false);

  const [mapsPage, setMapsPage] = useState(1);
  const mapsPerPage = 12; // or 24, up to you
  const [mapsTotal, setMapsTotal] = useState(0);

  const [sortMapsBy, setSortMapsBy] = useState('newest');

  // -----------------------------------------------
  //  Pagination + Sorting (Starred)
  // -----------------------------------------------
  const [starredMaps, setStarredMaps] = useState([]);
  const [loadingStarred, setLoadingStarred] = useState(false);

  const [starredPage, setStarredPage] = useState(1);
  const starredPerPage = 24;
  const [starredTotal, setStarredTotal] = useState(0);

  const [sortStarredBy, setSortStarredBy] = useState('newest');

  // =========================================================================
  // 1) Load user profile by username
  // =========================================================================
  useEffect(() => {
    async function loadUserProfile() {
      try {
        setLoadingProfile(true);
        const res = await fetchUserProfileByUsername(username);
        setProfile(res.data);

        if (res.data?.profile_picture) {
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

  // =========================================================================
  // 2) Once profile is loaded, fetch stats
  // =========================================================================
  useEffect(() => {
    if (!profile) return;
    (async function loadStats() {
      try {
        const res = await fetchUserMapStats(profile.id);
        setTotalMaps(res.data.totalMaps);
        setTotalStars(res.data.totalStars);
      } catch (err) {
        console.error('Error fetching user stats:', err);
      }
    })();
  }, [profile]);

  // =========================================================================
  // 3) Fetch MAPS (only if currentTab === 'maps')
  // =========================================================================
  useEffect(() => {
    if (!profile) return;
    if (currentTab !== 'maps') return;

    async function fetchMaps() {
      try {
        setLoadingMaps(true);
        const response = await fetchMapsByuser_id(
          profile.id,
          mapsPage,
          mapsPerPage,
          sortMapsBy
        );
        setUserMaps(response.data.maps);
        setMapsTotal(response.data.total);
      } catch (err) {
        console.error('Error fetching user maps:', err);
      } finally {
        setLoadingMaps(false);
      }
    }
    fetchMaps();
  }, [profile, currentTab, mapsPage, mapsPerPage, sortMapsBy]);

  // =========================================================================
  // 4) Fetch STARRED (only if currentTab === 'starred')
  // =========================================================================
  useEffect(() => {
    if (!profile) return;
    if (currentTab !== 'starred') return;

    async function fetchStarredMapsFn() {
      try {
        setLoadingStarred(true);
        const response = await fetchStarredMapsByuser_id(
          profile.id,
          starredPage,
          starredPerPage,
          sortStarredBy
        );
        setStarredMaps(response.data.maps);
        setStarredTotal(response.data.total);
      } catch (err) {
        console.error('Error fetching starred maps:', err);
      } finally {
        setLoadingStarred(false);
      }
    }
    fetchStarredMapsFn();
  }, [profile, currentTab, starredPage, starredPerPage, sortStarredBy]);

  // =========================================================================
  // 5) Fetch ACTIVITY (only if currentTab === 'activity')
  // =========================================================================
  useEffect(() => {
    if (!profile) return;
    if (currentTab !== 'activity') return;

    async function fetchActivityData() {
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

    fetchActivityData();
  }, [profile, currentTab]);

  // =========================================================================
  // 6) Handle tab changes
  // =========================================================================
  function handleTabChange(tab) {
    setCurrentTab(tab);

    // reset pages if switching tabs
    if (tab === 'maps') {
      setMapsPage(1);
    } else if (tab === 'starred') {
      setStarredPage(1);
    }
  }

  // =========================================================================
  // 7) Report profile
  // =========================================================================
  function handleReportProfile() {
    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }
    setShowReportModal(true);
  }

  async function handleSubmitProfileReport() {
    if (!profile?.username) return;
    setIsReporting(true);
    try {
      await reportProfile(profile.username, {
        reasons: [reportReasons],         // still from state or ref
        details: reportDetailsRef.current // read from ref here
      });
      setShowReportSuccess(true);
      setReportReasons('');

      setTimeout(() => {
        setShowReportModal(false);
        setShowReportSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error reporting profile:', err);
    } finally {
      setIsReporting(false);
    }
  }

  // =========================================================================
  // 8) Render a single map card
  // =========================================================================
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
      <div
        key={map.id}
        className={styles.card}
        onClick={() => navigate(`/map/${map.id}`)}
      >
        <div className={styles.cardThumbnail}>{thumbnail}</div>
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{mapTitle}</h3>
          <div className={styles.detailsRow}>
            <span className={styles.modified}>
              Modified{' '}
              {formatDistanceToNow(new Date(map.updated_at), { addSuffix: true })}
            </span>
            <span className={styles.starDisplay}>
              <FaStar className={styles.starIcon} /> {map.save_count || 0}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 9) Pagination handlers
  // =========================================================================
  const handleMapsPageChange = (newPage) => {
    if (newPage === mapsPage) return;
    setMapsPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStarredPageChange = (newPage) => {
    if (newPage === starredPage) return;
    setStarredPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // -------------
  // PAGE LOADING
  // -------------
  if (loadingProfile) {
    return (
      <div className={styles.profilePageContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`${styles.profileContent} ${
            isCollapsed ? styles.contentCollapsed : ''
          }`}
        >
          <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  // -------------
  // NO PROFILE FOUND
  // -------------
  if (!profile) {
    return (
      <div className={styles.profilePageContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`${styles.profileContent} ${
            isCollapsed ? styles.contentCollapsed : ''
          }`}
        >
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

  // -------------
  // MAIN RENDER
  // -------------
  const mapsTotalPages = Math.ceil(mapsTotal / mapsPerPage);
  const starredTotalPages = Math.ceil(starredTotal / starredPerPage);

  return (
    <div className={styles.profilePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`${styles.profileContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
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
                <img
                  src={profilePictureUrl}
                  alt="Profile"
                  className={styles.profilePicture}
                />
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
                      {new Date(profile.date_of_birth).toLocaleDateString(
                        'en-US',
                        {
                          month: 'long',
                          day: '2-digit',
                          year: 'numeric',
                        }
                      )}
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
                  <svg
                    className={styles.icon}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5 5v14h2V5H5zm2 0l10 4-10 4V5z" />
                  </svg>
                  Report Profile
                </button>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Tabs */}
          <div className={styles.rightColumn}>
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
              {/* =========== MAPS TAB =========== */}
              {currentTab === 'maps' && (
                <>
                  {/* Single row: LEFT: "Sort by..."    RIGHT: "Page X of Y" */}
                  <div className={styles.topBarRow}>
                    {/* Left side: sort */}
                    <div className={styles.sortRowLeft}>
                      <label htmlFor="sortMapsSelect">Sort by:</label>
                      <select
                        id="sortMapsSelect"
                        className={styles.sortSelect}
                        value={sortMapsBy}
                        onChange={(e) => {
                          setMapsPage(1);
                          setSortMapsBy(e.target.value);
                        }}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="mostStarred">Most Starred</option>
                      </select>
                    </div>
                    {/* Right side: Page X of Y */}
                    {mapsTotal > 0 && (
                      <div className={styles.pageCountRight}>
                        {mapsTotal > 0 && (
                          <span>
                            Page {mapsPage} of {Math.ceil(mapsTotal / mapsPerPage)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Loading / No Maps / Maps */}
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

                  {/* Pagination (‹ 1 2 3 ›) */}
                  {userMaps.length > 0 && (
                    <div className={styles.pagination}>
                      {/* only show if multiple pages */}
                      {mapsTotalPages > 1 && (
                        <>
                          <button
                            onClick={() => handleMapsPageChange(mapsPage - 1)}
                            disabled={mapsPage <= 1}
                          >
                            ‹
                          </button>

                          {Array.from({ length: mapsTotalPages }, (_, i) => i + 1).map(
                            (p) => (
                              <button
                                key={p}
                                onClick={() => handleMapsPageChange(p)}
                                className={p === mapsPage ? styles.activePage : ''}
                              >
                                {p}
                              </button>
                            )
                          )}

                          <button
                            onClick={() => handleMapsPageChange(mapsPage + 1)}
                            disabled={mapsPage >= mapsTotalPages}
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* =========== STARRED TAB =========== */}
              {currentTab === 'starred' && (
                <>
                  <div className={styles.topBarRow}>
                    <div className={styles.sortRowLeft}>
                      <label htmlFor="sortStarredSelect">Sort by:</label>
                      <select
                        id="sortStarredSelect"
                        className={styles.sortSelect}
                        value={sortStarredBy}
                        onChange={(e) => {
                          setStarredPage(1);
                          setSortStarredBy(e.target.value);
                        }}
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="mostStarred">Most Starred</option>
                      </select>
                    </div>
                    {starredTotal > 0 && (
                      <div className={styles.pageCountRight}>
                        <span>
                          Page {starredPage} of {Math.ceil(starredTotal / starredPerPage)}
                        </span>
                      </div>
                    )}
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

                  {starredMaps.length > 0 && (
                    <div className={styles.pagination}>
                      {starredTotalPages > 1 && (
                        <>
                          <button
                            onClick={() => handleStarredPageChange(starredPage - 1)}
                            disabled={starredPage <= 1}
                          >
                            ‹
                          </button>

                          {Array.from({ length: starredTotalPages }, (_, i) => i + 1).map(
                            (p) => (
                              <button
                                key={p}
                                onClick={() => handleStarredPageChange(p)}
                                className={p === starredPage ? styles.activePage : ''}
                              >
                                {p}
                              </button>
                            )
                          )}

                          <button
                            onClick={() => handleStarredPageChange(starredPage + 1)}
                            disabled={starredPage >= starredTotalPages}
                          >
                            ›
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* =========== ACTIVITY TAB =========== */}
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

      {/* REPORT MODAL */}
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
                    placeholder="Share more information (optional)"
                    onChange={(e) => {
                      reportDetailsRef.current = e.target.value;
                    }}
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
