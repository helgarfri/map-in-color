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
  FaListUl,
  FaLock
} from 'react-icons/fa';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import { formatDistanceToNow } from 'date-fns';
import styles from './ProfilePage.module.css';
import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize';

export default function ProfilePage() {
  const { username } = useParams();
  const navigate = useNavigate();

  // Logged-in user's info
  const { profile: currentUserProfile, authToken } = useContext(UserContext);

  const { width } = useWindowSize();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

  // ------------------------------
  // Auto-collapse sidebar
  // ------------------------------
  useEffect(() => {
    if (width < 1000) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [width, setIsCollapsed]);
  // ------------------------------
  // Basic profile info
  // ------------------------------
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Are we looking at our own profile?
  const isMyProfile =
    currentUserProfile && currentUserProfile.username === profile?.username;

  // Is the user logged in at all?
  const isUserLoggedIn = !!authToken && !!currentUserProfile;

  // ------------------------------
  // Stats (maps & stars)
  // ------------------------------
  const [totalPublicMaps, setTotalPublicMaps] = useState(0);
  const [totalStars, setTotalStars] = useState(0);
  
  // ------------------------------
  // Tabs: 'maps' | 'starred' | 'activity'
  // ------------------------------
  const [currentTab, setCurrentTab] = useState('maps');

  // ------------------------------
  // "Report Profile" modal
  // ------------------------------
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReasons, setReportReasons] = useState('');
  const reportDetailsRef = useRef('');
  const [isReporting, setIsReporting] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  // ------------------------------
  // Activity feed
  // ------------------------------
  const [activity, setActivity] = useState([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // ------------------------------
  // Pagination + Sorting (Maps)
  // ------------------------------
  const [userMaps, setUserMaps] = useState([]);
  const [loadingMaps, setLoadingMaps] = useState(false);
  const [mapsPage, setMapsPage] = useState(1);
  const mapsPerPage = 12;
  const [mapsTotal, setMapsTotal] = useState(0);
  const [sortMapsBy, setSortMapsBy] = useState('newest');

  // ------------------------------
  // Pagination + Sorting (Starred)
  // ------------------------------
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
        const foundProfile = res.data;

        setProfile(foundProfile);

        if (foundProfile?.profile_picture) {
          setProfilePictureUrl(foundProfile.profile_picture);
        } else {
          setProfilePictureUrl('/images/default-profile-picture.png');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        // If profile not found, or server error => show 404
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
        // Now returns { totalMaps, totalPublicMaps, totalStars }
        setTotalPublicMaps(res.data.totalPublicMaps);
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
    // If not logged in, redirect to login
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
        reasons: [reportReasons],
        details: reportDetailsRef.current
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
      showNoDataLegend: map.show_no_data_legend,
    };

    let thumbnail = null;
    if (map.selected_map === 'world') {
      thumbnail = <WorldMapSVG {...sharedProps} />;
    } else if (map.selected_map === 'usa') {
      thumbnail = <UsSVG {...sharedProps} />;
    } else if (map.selected_map === 'europe') {
      thumbnail = <EuropeSVG {...sharedProps} />;
    }

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

  // =========================================================================
  // 10) Loading / Not Found
  // =========================================================================
  if (loadingProfile) {
    // --------------------
    // FULL-PAGE SKELETON
    // --------------------
    return (
      <div className={styles.profilePageContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`${styles.profileContent} ${
            isCollapsed ? styles.contentCollapsed : ''
          }`}
        >
          <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <div className={styles.skeletonProfileContainer}>
            {/* Left column skeleton */}
            <div className={styles.skeletonProfileLeftColumn}>
              <div className={`${styles.skeletonProfilePic} ${styles.skeletonShimmer}`} />
              <div
                className={`${styles.skeletonLine} ${styles.skeletonShimmer}`}
                style={{ width: '60%', height: '22px', margin: '0 auto' }}
              />
              <div
                className={`${styles.skeletonLine} ${styles.skeletonShimmer}`}
                style={{ width: '40%', height: '18px', margin: '10px auto' }}
              />
              <div
                className={`${styles.skeletonLine} ${styles.skeletonShimmer}`}
                style={{ width: '80%', height: '14px', margin: '10px auto' }}
              />
            </div>

            {/* Right column skeleton */}
            <div className={styles.skeletonProfileRightColumn}>
              {/* Skeleton tabs */}
              <div className={styles.skeletonTabs}>
                <div
                  className={`${styles.skeletonTab} ${styles.skeletonShimmer}`}
                  style={{ width: '80px', height: '30px' }}
                />
                <div
                  className={`${styles.skeletonTab} ${styles.skeletonShimmer}`}
                  style={{ width: '90px', height: '30px' }}
                />
                <div
                  className={`${styles.skeletonTab} ${styles.skeletonShimmer}`}
                  style={{ width: '100px', height: '30px' }}
                />
              </div>

              {/* Skeleton cards grid for maps or starred */}
              <div className={styles.skeletonCardsGrid}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={styles.skeletonCard}>
                    <div
                      className={`${styles.skeletonCardThumbnail} ${styles.skeletonShimmer}`}
                    />
                    <div
                      className={`${styles.skeletonCardText} ${styles.skeletonShimmer}`}
                    />
                    <div
                      className={`${styles.skeletonCardTextShort} ${styles.skeletonShimmer}`}
                    />
                  </div>
                ))}
              </div>
            </div>
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

  // =========================================================================
  // 11) Handle private profile
  // =========================================================================
  const isPrivate = profile.profile_visibility === 'onlyMe';
  if (isPrivate && !isMyProfile) {
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
          <div className={styles.mainContainer} style={{ marginTop: '40px' }}>
            <div className={styles.privateProfileBox}>
              <FaLock className={styles.lockIcon} />
              <h2>This profile is private.</h2>
              <p>You cannot view this user’s maps or activity.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, if it's "everyone" or it's "onlyMe" but my profile => show normal
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

              {/* Location / DOB */}
                <div className={styles.infoRow}>
                  {profile.location && profile.show_location && (
                    <div className={styles.infoItem}>
                      <FaMapMarkerAlt className={styles.icon} />
                      <span>{profile.location}</span>
                    </div>
                  )}

                  {profile.date_of_birth && profile.show_date_of_birth && (
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


              {/* Stats */}
              <div className={styles.statsRowInfo}>
              <div className={styles.statsItem}>
                <FaMap className={`${styles.icon} ${styles.mapIcon}`} />
                <span>{totalPublicMaps} Maps</span> 
              </div>
              <div className={styles.statsItem}>
                <FaStar className={styles.icon} />
                <span>{totalStars} Stars</span>
              </div>
             
            </div>


              {/* Description / Bio */}
              {profile.description && (
                <div className={styles.bio}>
                  <p>{profile.description}</p>
                </div>
              )}

              {/* Edit / Report buttons */}
              {isMyProfile && (
                <button
                  className={styles.editProfileButton}
                  onClick={() => navigate('/settings')}
                >
                  Edit Profile
                </button>
              )}

              {/* If it's our own private profile, optionally show a small note */}
              {isPrivate && isMyProfile && (
                <div className={styles.privateLabelContainer}>
                  <div className={styles.privateLabel}>
                    <FaLock className={styles.lockIconSmall} />
                    <span>Your account is private</span>
                  </div>
                  <div>
                    <small className={styles.privateNote}>
                      Users won't be able to see your profile
                    </small>
                  </div>
                </div>
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

          {/* RIGHT COLUMN: Tabs + Content */}
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
                  <div className={styles.topBarRow}>
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
                    {mapsTotal > 0 && (
                      <div className={styles.pageCountRight}>
                        <span>
                          Page {mapsPage} of {Math.ceil(mapsTotal / mapsPerPage)}
                        </span>
                      </div>
                    )}
                  </div>

                  {loadingMaps ? (
                    <div className={styles.skeletonCardsGrid}>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={styles.skeletonCard}>
                          <div
                            className={`${styles.skeletonCardThumbnail} ${styles.skeletonShimmer}`}
                          />
                          <div
                            className={`${styles.skeletonCardText} ${styles.skeletonShimmer}`}
                          />
                          <div
                            className={`${styles.skeletonCardTextShort} ${styles.skeletonShimmer}`}
                          />
                        </div>
                      ))}
                    </div>
                  ) : userMaps.length === 0 ? (
                    <p>No maps found.</p>
                  ) : (
                    <div className={styles.cardsGrid}>
                      {userMaps.map((map) => renderMapCard(map))}
                    </div>
                  )}

                  {/* Pagination for Maps */}
                  {userMaps.length > 0 && (
                    <div className={styles.pagination}>
                      {mapsTotalPages > 1 && (
                        <>
                          <button
                            onClick={() => handleMapsPageChange(mapsPage - 1)}
                            disabled={mapsPage <= 1}
                          >
                            ‹
                          </button>
                          {Array.from(
                            { length: mapsTotalPages },
                            (_, i) => i + 1
                          ).map((p) => (
                            <button
                              key={p}
                              onClick={() => handleMapsPageChange(p)}
                              className={p === mapsPage ? styles.activePage : ''}
                            >
                              {p}
                            </button>
                          ))}
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
                  {profile.show_saved_maps === false ? (
                    <div className={styles.disabledSection}>
                      <FaLock className={styles.lockIcon} />
                      {isMyProfile ? (
                        <p>You have disabled starred maps.</p>
                      ) : (
                        <p>This user has disabled starred maps.</p>
                      )}
                    </div>
                  ) : (
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
                              Page {starredPage} of{' '}
                              {Math.ceil(starredTotal / starredPerPage)}
                            </span>
                          </div>
                        )}
                      </div>

                      {loadingStarred ? (
                        <div className={styles.skeletonCardsGrid}>
                          {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className={styles.skeletonCard}>
                              <div
                                className={`${styles.skeletonCardThumbnail} ${styles.skeletonShimmer}`}
                              />
                              <div
                                className={`${styles.skeletonCardText} ${styles.skeletonShimmer}`}
                              />
                              <div
                                className={`${styles.skeletonCardTextShort} ${styles.skeletonShimmer}`}
                              />
                            </div>
                          ))}
                        </div>
                      ) : starredMaps.length === 0 ? (
                        <p>No starred maps.</p>
                      ) : (
                        <div className={styles.cardsGrid}>
                          {starredMaps.map((map) => renderMapCard(map))}
                        </div>
                      )}

                      {/* Pagination for Starred */}
                      {starredMaps.length > 0 && (
                        <div className={styles.pagination}>
                          {starredTotalPages > 1 && (
                            <>
                              <button
                                onClick={() =>
                                  handleStarredPageChange(starredPage - 1)
                                }
                                disabled={starredPage <= 1}
                              >
                                ‹
                              </button>
                              {Array.from(
                                { length: starredTotalPages },
                                (_, i) => i + 1
                              ).map((p) => (
                                <button
                                  key={p}
                                  onClick={() => handleStarredPageChange(p)}
                                  className={
                                    p === starredPage ? styles.activePage : ''
                                  }
                                >
                                  {p}
                                </button>
                              ))}
                              <button
                                onClick={() =>
                                  handleStarredPageChange(starredPage + 1)
                                }
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
                </>
              )}

              {/* =========== ACTIVITY TAB =========== */}
              {currentTab === 'activity' && (
                <>
                  {profile.show_activity_feed === false ? (
                    <div className={styles.disabledSection}>
                      <FaLock className={styles.lockIcon} />
                      {isMyProfile ? (
                        <p>You have disabled your activity feed.</p>
                      ) : (
                        <p>This user has disabled their activity feed.</p>
                      )}
                    </div>
                  ) : loadingActivity ? (
                    <div className={styles.loadingContainer}>
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
