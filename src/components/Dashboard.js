// src/components/Dashboard.js
import React, { useState, useEffect, useContext } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchMaps, deleteMap, fetchSavedMaps } from '../api';
import Sidebar from './Sidebar';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import MapSelectionModal from './MapSelectionModal';
import { formatDistanceToNow } from 'date-fns';
import { formatDistance } from 'date-fns';
import { UserContext } from '../context/UserContext';
import { FaStar, FaPlus, FaMap, FaCalendarAlt } from 'react-icons/fa';
import { fetchNotifications, markNotificationAsRead } from '../api';
import { Link } from 'react-router-dom'; // Add this import


export default function Dashboard({

  isCollapsed,
  setIsCollapsed,
}) {

  const { profile } = useContext(UserContext);

  const [maps, setMaps] = useState([]);
  const [favoriteMaps, setFavoriteMaps] = useState([]);
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mapToDelete, setMapToDelete] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const [notifications, setNotifications] = useState([]);


  const totalStarsReceived = maps.reduce((total, map) => total + (map.saveCount || 0), 0);

  const profileAge = profile
  ? formatDistance(new Date(profile.createdAt), new Date(), { addSuffix: false })
  : '';


 // Ensure profile is loaded before fetching maps
 useEffect(() => {
  if (!profile) return;
  // Fetch maps data
  const getMaps = async () => {
    try {
      const res = await fetchMaps();
      const sortedMaps = res.data.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );
      setMaps(sortedMaps);
    } catch (err) {
      console.error(err);
    }
  };
   // Fetch user's saved maps
   const getSavedMaps = async () => {
    try {
      const res = await fetchSavedMaps();
      setFavoriteMaps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

    // Fetch notifications
    const getNotifications = async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data.slice(0, 6)); // Limit to 6 notifications
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

  getMaps();
  getSavedMaps();
  getNotifications();
}, [profile]);




  // Get top 3 recently modified maps
  const recentMaps = maps.slice(0, 3);

  const displayedFavoriteMaps = favoriteMaps.slice(0, 4);


  const handleEdit = (event, mapId) => {
    event.stopPropagation();
    navigate(`/edit/${mapId}`);
  };

  const handleDelete = (event, mapId) => {
    event.stopPropagation();
    const map = maps.find((m) => m.id === mapId);
    setMapToDelete(map);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (mapToDelete) {
      try {
        await deleteMap(mapToDelete.id);
        setMaps(maps.filter((map) => map.id !== mapToDelete.id));
        setShowDeleteModal(false);
        setMapToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMapToDelete(null);
  };

  const handleCreateMap = () => {
    setShowMapModal(true);
  };

  const handleMapSelection = (selectedMap) => {
    if (selectedMap) {
      setShowMapModal(false);
      navigate('/create', { state: { selectedMap } });
    } else {
      alert('Please select a map type.');
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read and navigate to the map
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      navigate(`/map/${notification.MapId}`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Helper function to generate notification message
const getNotificationMessage = (notification) => {
  const senderName = notification.Sender.firstName || notification.Sender.username;
  const mapLink = (
    <Link
      to={`/map/${notification.Map.id}`}
      className={styles.mapTitle}
      onClick={(e) => e.stopPropagation()}
    >
      {notification.Map.title}
    </Link>
  );

  switch (notification.type) {
    case 'star':
      return <>starred your map {mapLink}.</>;
    case 'comment':
      return <>commented on your map {mapLink}.</>;
    case 'like':
      return (
        <>
          liked your comment on map {mapLink}.
        </>
      );
    case 'reply':
      return (
        <>
          replied to your comment on map {mapLink}.
        </>
      );
    default:
      return <>performed an action on your map {mapLink}.</>;
  }
};



  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <Sidebar

        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div
        className={`${styles.dashboardContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header Section */}
        <header className={styles.header}>
          {/* Create New Map Button at the top right */}
          <div className={styles.headerTop}>
            <button className={styles.createMapButton} onClick={handleCreateMap}>
              <FaPlus className={styles.plusIcon} /> Create New Map
            </button>
          </div>
          {/* Centered Welcome Text */}
          <h1 className={styles.welcomeText}>
            Welcome Back{profile && `, ${profile.firstName}`}!
          </h1>
        </header>

        <div className={styles.statisticsPanel}>
  <div className={styles.statistic}>
    <FaMap className={styles.statIcon} />
    <h3>Maps Created</h3>
    <p>{maps.length}</p>
  </div>
  <div className={styles.statistic}>
    <FaStar className={styles.statIcon} />
    <h3>Stars Received</h3>
    <p>{totalStarsReceived}</p>
  </div>
  <div className={styles.statistic}>
    <FaCalendarAlt className={styles.statIcon} />
    <h3>Profile Age</h3>
    <p>{profileAge}</p>
  </div>
</div>

        {/* Main Content Area */}
        <div className={styles.mainContent}>
          {/* Recently Modified Maps */}
          <section className={styles.recentMaps}>
            <h2>Recently Modified Maps</h2>
            {recentMaps.length > 0 ? (
              <div className={styles.cardsContainer}>
                {recentMaps.map((map) => {
                  const mapTitle = map.title || 'Untitled Map';
                  console.log(map.isTitleHidden)
                  return (
                    <div className={styles.mapCard} key={map.id} onClick={() => navigate(`/map/${map.id}`)}>
                      <div className={styles.thumbnail}>
                        {map.selectedMap === 'world' && (
                          <WorldMapSVG
                            groups={map.groups}
                            mapTitleValue={mapTitle}
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
                            mapTitleValue={mapTitle}
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
                            mapTitleValue={mapTitle}
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
                      <div className={styles.cardOverlay}>
                        <h3>{mapTitle}</h3>
                        <p>
                          Modified{' '}
                          {map.updatedAt
                            ? formatDistanceToNow(new Date(map.updatedAt), {
                                addSuffix: true,
                              })
                            : 'Unknown time'}
                        </p>
                        <div className={styles.cardActions}>
                        <button
                            className={styles.editButton}
                            onClick={(event) => handleEdit(event, map.id)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={(event) => handleDelete(event, map.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>No recent maps.</p>
            )}
          </section>

      {/* Starred Maps */}
      <section className={styles.favoriteMaps}>
            <h2>Starred Maps</h2>
            {favoriteMaps.length > 0 ? (
              <div className={styles.starredMapsContainer}>
                {displayedFavoriteMaps.map((map) => {
                  const mapTitle = map.title || 'Untitled Map';
                  return (
                    <div
                      className={styles.starredMapCard}
                      key={map.id}
                      onClick={() => navigate(`/map/${map.id}`)}
                    >
                      <div className={styles.starredThumbnail}>
                        {/* Render SVG component based on map type */}
                        {map.selectedMap === 'world' && (
                          <WorldMapSVG
                            groups={map.groups}
                            mapTitleValue={mapTitle}
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
                            mapTitleValue={mapTitle}
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
                            mapTitleValue={mapTitle}
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
                      <div className={styles.starredMapInfo}>
                        <h3>{mapTitle}</h3>
                        <p>Created by {map.User.username}</p>
                        <div className={styles.starCount}>
                          <FaStar className={styles.starIcon} />
                          {map.saveCount || 0}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>You have no saved maps.</p>
            )}
            {/* View All Starred Maps Link */}
            {favoriteMaps.length > 4 && (
              <div className={styles.viewAllLink}>
                <a href="/starred-maps">View All Starred Maps</a>
              </div>
            )}
          </section>

         {/* Notifications and Recent Activity */}
<div className={styles.bottomContent}>
  {/* Notifications */}
  <section className={styles.notifications}>
    <h2>Notifications</h2>
    {notifications.length > 0 ? (
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`${styles.notificationItem} ${
              notification.isRead ? styles.read : styles.unread
            }`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className={styles.notificationContentWrapper}>
              <img
                src={
                  notification.Sender.profilePicture
                    ? `http://localhost:5000${notification.Sender.profilePicture}`
                    : '/default-profile-pic.jpg'
                }
                alt={`${
                  notification.Sender.firstName || notification.Sender.username
                }'s profile`}
                className={styles.profilePicture}
              />
              <div className={styles.notificationText}>
              <p className={styles.notificationContent}>
                <Link
                  to={`/profile/${notification.Sender.username}`}
                  className={styles.senderName}
                  onClick={(e) => e.stopPropagation()}
                >
                  {notification.Sender.firstName || notification.Sender.username}
                </Link>{' '}
                {getNotificationMessage(notification)}
              </p>


                <p className={styles.notificationMeta}>
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <p>No new notifications.</p>
    )}
    <div className={styles.viewAllLink}>
      <Link to="/notifications">View All Notifications</Link>
    </div>
  </section>



            {/* Recent Activity */}
            <section className={styles.recentActivity}>
              <h2>Recent Activity</h2>
              <p>No recent activity.</p>
            </section>
          </div>
        </div>

        {/* Help and Support */}
        <footer className={styles.helpSupport}>
          <h2>Help and Support</h2>
          <p>
            Need assistance? Visit our{' '}
            <a href="/help">Help Center</a> or{' '}
            <a href="/contact">Contact Support</a>.
          </p>
        </footer>
      </div>

      {/* Map Selection Modal */}
      {showMapModal && (
        <MapSelectionModal
          show={showMapModal}
          onClose={() => setShowMapModal(false)}
          onCreateMap={handleMapSelection}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={cancelDelete}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete the map titled "
              <strong>{mapToDelete?.title || 'Untitled Map'}</strong>"? This
              action cannot be undone.
            </p>
            <button className={styles.deleteButton} onClick={confirmDelete}>
              Delete
            </button>
            <button className={styles.cancelButton} onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
