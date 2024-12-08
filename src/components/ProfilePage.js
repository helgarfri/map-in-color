// src/components/ProfilePage.js

import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Sidebar from './Sidebar';
import styles from './ProfilePage.module.css';
import {
  fetchUserProfileByUsername,
  fetchMapsByUserId,
  fetchUserActivity,
  fetchStarredMapsByUserId,
  fetchUserMapStats,
  fetchMostStarredMapByUserId
} from '../api';

// Import icons from react-icons
import { FaMapMarkerAlt, FaBirthdayCake, FaStar, FaMap } from 'react-icons/fa';

// Import map components
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

// Import date-fns for date formatting
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';
import Header from './Header';

function ProfilePage({ isCollapsed, setIsCollapsed }) {
  const { username } = useParams(); // Get the username from the URL
  const { profile: currentUserProfile } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]); // Add activity state
  const navigate = useNavigate();

  // New state variables for map feed
  const [currentTab, setCurrentTab] = useState('allMaps'); // 'allMaps' or 'starredMaps'
  const [displayedMaps, setDisplayedMaps] = useState([]); // Maps to display in the feed
  const [page, setPage] = useState(0); // Pagination: current page
  const [hasMoreMaps, setHasMoreMaps] = useState(true); // Whether there are more maps to load
  const [isLoadingMaps, setIsLoadingMaps] = useState(false); // Whether we are loading maps

  const [totalMaps, setTotalMaps] = useState(0);
  const [totalStarsReceived, setTotalStarsReceived] = useState(0);
  const [mostStarredMap, setMostStarredMap] = useState(null);

    // Activity pagination state variables
  const [displayedActivities, setDisplayedActivities] = useState([]); // Activities to display
  const [activityPage, setActivityPage] = useState(0); // Current page for activities
  const [activityHasMore, setActivityHasMore] = useState(true); // Whether there are more activities to load
  const [isLoadingActivities, setIsLoadingActivities] = useState(false); // Loading state
  const activityPageRef = useRef(0); // Reference for activity page

  const pageRef = useRef(0);
  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        // Fetch user profile by username
        const res = await fetchUserProfileByUsername(username);
        setProfile(res.data);
  
        // Set profile picture URL
        if (res.data.profilePicture) {
          setProfilePictureUrl(`http://localhost:5000${res.data.profilePicture}`);
        } else {
          setProfilePictureUrl('/images/default-profile-picture.png');
        }
  
        // Fetch user map stats
        const statsRes = await fetchUserMapStats(res.data.id);
        setTotalMaps(statsRes.data.totalMaps);
        setTotalStarsReceived(statsRes.data.totalStars);
  
        // Fetch most starred map
        const mostStarredMapRes = await fetchMostStarredMapByUserId(res.data.id);
        setMostStarredMap(mostStarredMapRes.data);
  
        // Initialize activity state
        setDisplayedActivities([]);
        activityPageRef.current = 0;
        setActivityPage(0);
        setActivityHasMore(true);
        loadActivities(true);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        navigate('/404'); // Navigate to a 404 page or display an error message
      } finally {
        setLoading(false);
      }
    };
  
    getProfileData();
  }, [username, navigate]);


  // Load maps when the component mounts or when the currentTab changes
  useEffect(() => {
    if (profile) {
      // Reset map state
      setDisplayedMaps([]);
      pageRef.current = 0; // Reset the pageRef
      setPage(0); // Optional: If you need to update the page state
      setHasMoreMaps(true);
      loadMaps(true); // Pass true to force the loading
    }
  }, [currentTab, profile]);
  

  // Function to load maps with pagination
  const loadMaps = async (force = false) => {
    if (!profile) return; // Ensure profile is available
    if ((isLoadingMaps && !force) || !hasMoreMaps) return;
    setIsLoadingMaps(true);
    try {
      let mapsRes;
      if (currentTab === 'allMaps') {
        mapsRes = await fetchMapsByUserId(profile.id, pageRef.current * 5, 5);
      } else if (currentTab === 'starredMaps') {
        mapsRes = await fetchStarredMapsByUserId(profile.id, pageRef.current * 5, 5);
      }
      if (mapsRes.data.length > 0) {
        setDisplayedMaps((prevMaps) => {
          const newMaps = mapsRes.data.filter(
            (newMap) => !prevMaps.some((prevMap) => prevMap.id === newMap.id)
          );
          return [...prevMaps, ...newMaps];
        });
        pageRef.current += 1; // Increment the page number
        setPage(pageRef.current); // Update the state if you need to display the page number
      } else {
        setHasMoreMaps(false);
      }
    } catch (err) {
      console.error('Error fetching maps:', err);
    } finally {
      setIsLoadingMaps(false);
    }
  };
  
const loadActivities = async (force = false) => {
  if ((isLoadingActivities && !force) || !activityHasMore) return;
  setIsLoadingActivities(true);
  try {
    const offset = activityPage * 10;
    console.log(`Loading activities with offset: ${offset}, page: ${activityPage}`);
    if (offset >= 100) {
      setActivityHasMore(false);
      return;
    }
    const activityRes = await fetchUserActivity(username, offset, 10);
    if (activityRes.data.length > 0) {
      setDisplayedActivities((prevActivities) => [
        ...prevActivities,
        ...activityRes.data,
      ]);
      setActivityPage((prevPage) => prevPage + 1);
    } else {
      setActivityHasMore(false);
    }
  } catch (err) {
    console.error('Error fetching activities:', err);
  } finally {
    setIsLoadingActivities(false);
  }
};

  
  

  // Infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!profile || isLoadingMaps || !hasMoreMaps) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
        loadMaps();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [profile, isLoadingMaps, hasMoreMaps, displayedMaps]);
  
  
  useEffect(() => {
    const handleScroll = () => {
      if (isLoadingActivities || !activityHasMore) return;
  
      // Calculate the position to trigger loading more activities
      const activitySection = document.getElementById('activitySection');
      if (activitySection) {
        const rect = activitySection.getBoundingClientRect();
        if (rect.bottom <= window.innerHeight + 100) {
          loadActivities();
        }
      }
    };
  
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingActivities, activityHasMore, displayedActivities]);
  

  // Format date of birth
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', options);
  };

  const formattedDateOfBirth = formatDate(profile?.dateOfBirth);

  // Function to get the color based on activity type
  const getActivityDotColor = (type) => {
    switch (type) {
      case 'createdMap':
        return '#4caf50'; // Green
      case 'commented':
        return '#2196f3'; // Blue
      case 'starredMap':
        return '#ff9800'; // Orange
      default:
        return '#9e9e9e'; // Grey
    }
  };

  // Format how long ago a date was
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className={styles.profilePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`${styles.profileContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header Section */}
        <Header title="Profile Page" />
        {loading ? (
          <div className={styles.loadingContainer}>
            <LoadingSpinner />
          </div>
        ) : !profile ? (
          <div className={styles.error}>Profile not found.</div>
        ) : (
          <>
            {/* Main Content */}
            <div className={styles.mainContent}>
              {/* Profile Section */}
              <div className={styles.profileSection}>
                {/* Profile Picture */}
                <div className={styles.profilePictureWrapper}>
                  <img src={profilePictureUrl} alt="Profile" className={styles.profilePicture} />
                </div>

                {/* Profile Info */}
                <div className={styles.profileInfo}>
                  {/* Username */}
                  <h2 className={styles.username}>@{profile.username}</h2>
                  {/* Full Name */}
                  <h1 className={styles.fullName}>
                    {profile.firstName} {profile.lastName}
                  </h1>
                  {/* Location and Birthday */}
                  <div className={styles.infoRow}>
                    {profile.location && (
                      <div className={styles.infoItem}>
                        <FaMapMarkerAlt className={styles.icon} />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    {formattedDateOfBirth && (
                      <div className={styles.infoItem}>
                        <FaBirthdayCake className={styles.icon} />
                        <span>{formattedDateOfBirth}</span>
                      </div>
                    )}
                  </div>
                {/* Stars and Map Count */}
                <div className={styles.statsRow}>
                  <div className={styles.statsItem}>
                    <FaStar className={styles.icon} />
                    <span>{totalStarsReceived} Stars</span>
                  </div>
                  <div className={styles.statsItem}>
                    <FaMap className={styles.icon} />
                    <span>{totalMaps} Maps</span> {/* Use totalMaps instead of maps.length */}
                  </div>
                </div>

                  {/* Description */}
                  {profile.description && (
                    <div className={styles.bio}>
                      <p>{profile.description}</p>
                    </div>
                  )}
                </div>

       {/* Recent Activity */}
<div className={styles.recentActivitySection}>
  <h2>Recent Activity</h2>
  {displayedActivities.length > 0 ? (
    <div className={styles.activityTimeline} id="activitySection">
      {displayedActivities.map((item, index) => (
        <div key={index} className={styles.activityItem}>
          <div
            className={styles.timelineDot}
            style={{ backgroundColor: getActivityDotColor(item.type) }}
          ></div>
          <div className={styles.activityContent}>
            {item.type === 'createdMap' && (
              <p>
                {profile.firstName} created a map{' '}
                <strong>{item.mapTitle}</strong>
              </p>
            )}
            {item.type === 'commented' && (
              <p>
                {profile.firstName} commented on map{' '}
                <strong>{item.mapTitle}</strong>
              </p>
            )}
            {item.type === 'starredMap' && (
              <p>
                {profile.firstName} starred map{' '}
                <strong>{item.mapTitle}</strong>
              </p>
            )}
            <span className={styles.activityTime}>
              {formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      ))}
      {isLoadingActivities && (
        <div className={styles.loadingContainer}>
          <LoadingSpinner />
        </div>
      )}
      {!activityHasMore && displayedActivities.length < 100 && (
        <p>No more activities to display.</p>
      )}
    </div>
  ) : isLoadingActivities ? (
    <div className={styles.loadingContainer}>
      <LoadingSpinner />
    </div>
  ) : (
    <p>No recent activity.</p>
  )}
</div>

              </div>

              {/* Maps Section */}
              <div className={styles.mapsSection}>
                {mostStarredMap ? (
                  <div className={styles.mapCard} onClick={() => navigate(`/map/${mostStarredMap.id}`)}>
                    {/* Map Thumbnail */}
                    <div className={styles.mapThumbnail}>
                      {/* Render the SVG based on the selected map */}
                      {mostStarredMap.selectedMap === 'world' && (
                        <WorldMapSVG
                          groups={mostStarredMap.groups}
                          mapTitleValue={mostStarredMap.title}
                          oceanColor={mostStarredMap.oceanColor}
                          unassignedColor={mostStarredMap.unassignedColor}
                          showTopHighValues={false}
                          showTopLowValues={false}
                          data={mostStarredMap.data}
                          selectedMap={mostStarredMap.selectedMap}
                          fontColor={mostStarredMap.fontColor}
                          topHighValues={[]}
                          topLowValues={[]}
                          isThumbnail={false}
                          isTitleHidden={mostStarredMap.isTitleHidden}
                        />
                      )}
                      {mostStarredMap.selectedMap === 'usa' && (
                        <UsSVG
                          groups={mostStarredMap.groups}
                          mapTitleValue={mostStarredMap.title}
                          oceanColor={mostStarredMap.oceanColor}
                          unassignedColor={mostStarredMap.unassignedColor}
                          showTopHighValues={false}
                          showTopLowValues={false}
                          data={mostStarredMap.data}
                          selectedMap={mostStarredMap.selectedMap}
                          fontColor={mostStarredMap.fontColor}
                          topHighValues={[]}
                          topLowValues={[]}
                          isThumbnail={false}
                          isTitleHidden={mostStarredMap.isTitleHidden}
                        />
                      )}
                      {mostStarredMap.selectedMap === 'europe' && (
                        <EuropeSVG
                          groups={mostStarredMap.groups}
                          mapTitleValue={mostStarredMap.title}
                          oceanColor={mostStarredMap.oceanColor}
                          unassignedColor={mostStarredMap.unassignedColor}
                          showTopHighValues={false}
                          showTopLowValues={false}
                          data={mostStarredMap.data}
                          selectedMap={mostStarredMap.selectedMap}
                          fontColor={mostStarredMap.fontColor}
                          topHighValues={[]}
                          topLowValues={[]}
                          isThumbnail={false}
                          isTitleHidden={mostStarredMap.isTitleHidden}
                        />
                      )}
                    </div>
                    {/* Map Details */}
                    <div className={styles.mapDetails}>
                      <div className={styles.mostStarredLabel}>Most starred map</div>
                      <h3 className={styles.mapTitle}>{mostStarredMap.title || 'Untitled Map'}</h3>
                      <div className={styles.mapStats}>
                        <FaStar className={styles.starIcon} />
                        <span>{mostStarredMap.saveCount || 0}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p>No maps found.</p>
                )}

                {/* Navigation Tabs */}
                <div className={styles.mapsNav}>
                  <button
                    className={currentTab === 'allMaps' ? styles.activeTab : ''}
                    onClick={() => setCurrentTab('allMaps')}
                  >
                    All Maps
                  </button>
                  <button
                    className={currentTab === 'starredMaps' ? styles.activeTab : ''}
                    onClick={() => setCurrentTab('starredMaps')}
                  >
                    Starred Maps
                  </button>
                </div>

                {/* Maps List */}
                <div className={styles.mapsList}>
                  {displayedMaps.map((map) => (
                    <div
                      key={map.id}
                      className={styles.mapListItem}
                      onClick={() => navigate(`/map/${map.id}`)}
                    >
                      {/* Thumbnail */}
                      <div className={styles.mapListThumbnail}>
                        {/* Render the SVG based on the selected map */}
                        {map.selectedMap === 'world' && (
                          <WorldMapSVG
                            groups={map.groups}
                            mapTitleValue={map.title}
                            oceanColor={map.oceanColor}
                            unassignedColor={map.unassignedColor}
                            showTopHighValues={false}
                            showTopLowValues={false}
                            data={map.data}
                            selectedMap={map.selectedMap}
                            fontColor={map.fontColor}
                            topHighValues={[]}
                            topLowValues={[]}
                            isThumbnail={true}
                            isTitleHidden={map.isTitleHidden}
                          />
                        )}
                        {map.selectedMap === 'usa' && (
                          <UsSVG
                            groups={map.groups}
                            mapTitleValue={map.title}
                            oceanColor={map.oceanColor}
                            unassignedColor={map.unassignedColor}
                            showTopHighValues={false}
                            showTopLowValues={false}
                            data={map.data}
                            selectedMap={map.selectedMap}
                            fontColor={map.fontColor}
                            topHighValues={[]}
                            topLowValues={[]}
                            isThumbnail={true}
                            isTitleHidden={map.isTitleHidden}
                          />
                        )}
                        {map.selectedMap === 'europe' && (
                          <EuropeSVG
                            groups={map.groups}
                            mapTitleValue={map.title}
                            oceanColor={map.oceanColor}
                            unassignedColor={map.unassignedColor}
                            showTopHighValues={false}
                            showTopLowValues={false}
                            data={map.data}
                            selectedMap={map.selectedMap}
                            fontColor={map.fontColor}
                            topHighValues={[]}
                            topLowValues={[]}
                            isThumbnail={true}
                            isTitleHidden={map.isTitleHidden}
                          />
                        )}
                      </div>
                      {/* Map Info */}
                      <div className={styles.mapListInfo}>
                        <h3 className={styles.mapListTitle}>{map.title || 'Untitled Map'}</h3>
                        <p className={styles.mapListTime}>{formatTimeAgo(map.createdAt)}</p>
                        <div className={styles.mapListStats}>
                          <FaStar className={styles.starIcon} />
                          <span>{map.saveCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoadingMaps && <LoadingSpinner />}
                  {!hasMoreMaps && <p>No more maps to display.</p>}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
