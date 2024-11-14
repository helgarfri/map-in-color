// src/components/ProfilePage.js
import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Sidebar from './Sidebar';
import styles from './ProfilePage.module.css';
import { fetchUserProfileByUsername, fetchMapsByUserId } from '../api';

// Import icons from react-icons
import { FaMapMarkerAlt, FaBirthdayCake, FaStar } from 'react-icons/fa';

// Import map components
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

// Import date-fns for date formatting
import { formatDistanceToNow } from 'date-fns';

function ProfilePage({ isCollapsed, setIsCollapsed }) {
  const { username } = useParams(); // Get the username from the URL
  const { profile: currentUserProfile } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        // Fetch maps created by the user
        const mapsRes = await fetchMapsByUserId(res.data.id);
        setMaps(mapsRes.data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        navigate('/404'); // Navigate to a 404 page or display an error message
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, [username, navigate]);

  if (loading) {
    return <div className={styles.loader}>Loading profile...</div>;
  }

  if (!profile) {
    return <div className={styles.error}>Profile not found.</div>;
  }

  // Format date of birth
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateObj = new Date(dateString);
    return dateObj.toLocaleDateString('en-US', options);
  };

  const formattedDateOfBirth = formatDate(profile.dateOfBirth);

  return (
    <div className={styles.profilePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`${styles.profileContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <img src={profilePictureUrl} alt="Profile" className={styles.profilePicture} />
          <div className={styles.profileInfo}>
            <h1 className={styles.fullName}>
              {profile.firstName} {profile.lastName}
            </h1>
            <p className={styles.username}>@{profile.username}</p>
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
          </div>
        </div>
        {/* Bio */}
        {profile.description && (
          <div className={styles.bio}>
            <p>{profile.description}</p>
          </div>
        )}
        {/* User's Maps */}
        <div className={styles.userMapsSection}>
          <h2>{profile.username}'s maps</h2>
          {maps.length > 0 ? (
            <div className={styles.mapsContainer}>
              {maps.map((map) => (
                <div
                  className={styles.mapCard}
                  key={map.id}
                  onClick={() => navigate(`/map/${map.id}`)}
                >
                  <div className={styles.mapThumbnail}>
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
                      />
                    )}
                  </div>
                  <div className={styles.mapDetails}>
                    <h3 className={styles.mapTitle}>{map.title || 'Untitled Map'}</h3>
                    <p className={styles.mapCreatedAt}>
                      Created{' '}
                      {map.createdAt
                        ? formatDistanceToNow(new Date(map.createdAt), { addSuffix: true })
                        : 'Unknown time'}
                    </p>
                    {map.description && (
                      <p className={styles.mapDescription}>{map.description}</p>
                    )}
                    <div className={styles.mapStats}>
                      <FaStar className={styles.starIcon} />
                      <span>{map.saveCount || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No maps found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
