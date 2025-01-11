// src/components/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMaps,
  deleteMap,
  fetchNotifications,
  markNotificationAsRead,
} from '../api';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { UserContext } from '../context/UserContext';

// Icons
import {
  FaStar,
  FaMap,
  FaCalendarAlt,
  FaComment,
  FaReply,
  FaThumbsUp,
} from 'react-icons/fa';

// Components
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from './LoadingSpinner';

// Map thumbnails
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

// CSS
import styles from './Dashboard.module.css';

export default function Dashboard({ isCollapsed, setIsCollapsed }) {
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);
  const [maps, setMaps] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // For deleting a map
  const [mapToDelete, setMapToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Basic Stats
  const totalMapsCreated = maps.length;
  const totalStarsReceived = maps.reduce(
    (sum, map) => sum + (map.saveCount || 0),
    0
  );
  const profileAgeDays = profile?.createdAt
    ? differenceInDays(new Date(), new Date(profile.createdAt))
    : 0;

  // Fetch data once the profile is loaded
  useEffect(() => {
    if (!profile) return;

    const getData = async () => {
      try {
        const [mapsRes, notificationsRes] = await Promise.all([
          fetchMaps(),
          fetchNotifications(),
        ]);

        // Sort maps by updatedAt desc
        const sortedMaps = mapsRes.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setMaps(sortedMaps);

        // Sort notifications by createdAt desc, limit to 6
        const sortedNotifications = notificationsRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);

        setNotifications(sortedNotifications);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [profile]);

  // Recently modified maps (up to 10)
  const recentMaps = maps.slice(0, 10);

  // ----- Map Deletion Handlers -----
  const handleMapClick = (mapId) => {
    navigate(`/map/${mapId}`);
  };

  const handleEdit = (event, mapId) => {
    event.stopPropagation();
    navigate(`/edit/${mapId}`);
  };

  const handleDelete = (event, mapId) => {
    event.stopPropagation();
    const foundMap = maps.find((m) => m.id === mapId);
    setMapToDelete(foundMap);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!mapToDelete) return;
    try {
      await deleteMap(mapToDelete.id);
      setMaps((prev) => prev.filter((map) => map.id !== mapToDelete.id));
    } catch (err) {
      console.error('Error deleting map:', err);
    } finally {
      setShowDeleteModal(false);
      setMapToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMapToDelete(null);
  };

  // ----- Notification Handlers -----
  const handleNotificationClick = async (notif) => {
    try {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
      );

      if (notif.MapId) {
        navigate(`/map/${notif.MapId}`);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
  };

  // Handler for entire "Activity Item" click → go to map
  const handleActivityItemClick = (notif) => {
    // Mark as read or do something else, then navigate to map
    if (notif.MapId) {
      navigate(`/map/${notif.MapId}`);
    }
  };

  // Handler for user name / avatar click → go to profile
  const handleUserClick = (e, username) => {
    e.stopPropagation(); // Prevent also clicking the map
    if (username) {
      navigate(`/profile/${username}`);
    }
  };

  // ----- Render Activity Feed (Main Column) -----
  const renderActivityItem = (notif) => {
    const {
      type,
      Map: relatedMap,
      Sender: user,
      Comment: commentObj,
      createdAt,
    } = notif || {};

    const senderName = user?.firstName || user?.username || 'Someone';
    const mapTitle = relatedMap?.title || 'Untitled Map';

    // Build user avatar + handle click
    const userAvatarUrl = user?.profilePicture
      ? `http://localhost:5000${user.profilePicture}`
      : '/default-profile-pic.jpg';

    // Create a map thumbnail
    let mapThumbnail = <div className={styles.defaultThumbnail}>Map</div>;
    if (relatedMap?.selectedMap === 'world') {
      mapThumbnail = (
        <WorldMapSVG
          groups={relatedMap.groups || []}
          mapTitleValue={mapTitle}
          oceanColor={relatedMap.oceanColor}
          unassignedColor={relatedMap.unassignedColor}
          data={relatedMap.data}
          fontColor={relatedMap.fontColor}
          isTitleHidden={relatedMap.isTitleHidden}
          isThumbnail
        />
      );
    } else if (relatedMap?.selectedMap === 'usa') {
      mapThumbnail = (
        <UsSVG
          groups={relatedMap.groups || []}
          mapTitleValue={mapTitle}
          oceanColor={relatedMap.oceanColor}
          unassignedColor={relatedMap.unassignedColor}
          data={relatedMap.data}
          fontColor={relatedMap.fontColor}
          isTitleHidden={relatedMap.isTitleHidden}
          isThumbnail
        />
      );
    } else if (relatedMap?.selectedMap === 'europe') {
      mapThumbnail = (
        <EuropeSVG
          groups={relatedMap.groups || []}
          mapTitleValue={mapTitle}
          oceanColor={relatedMap.oceanColor}
          unassignedColor={relatedMap.unassignedColor}
          data={relatedMap.data}
          fontColor={relatedMap.fontColor}
          isTitleHidden={relatedMap.isTitleHidden}
          isThumbnail
        />
      );
    }

    // For convenience, define "activity text" and "body"
    let mainText = '';
    let body = null;

    if (type === 'star') {
      const totalStars = relatedMap?.saveCount || 0;
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {senderName}
          </strong>{' '}
          starred your map "<em>{mapTitle}</em>"
        </>
      );
      body = <p className={styles.starCount}>Stars: {totalStars}</p>;
    } else if (type === 'comment') {
      const commentText = commentObj?.content || 'No comment text.';
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {senderName}
          </strong>{' '}
          commented on "<em>{mapTitle}</em>"
        </>
      );
      body = (
        <div className={styles.commentBox}>
          <img
            className={styles.userAvatar}
            src={userAvatarUrl}
            alt="User"
            onClick={(e) => handleUserClick(e, user?.username)}
          />
          <div className={styles.commentText}>{commentText}</div>
        </div>
      );
    } else if (type === 'reply') {
      const replyText = commentObj?.content || 'No reply text.';
      const parentComment = commentObj?.ParentComment?.content || 'No parent comment.';
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {senderName}
          </strong>{' '}
          replied to your comment on "<em>{mapTitle}</em>"
        </>
      );
      body = (
        <div className={styles.commentReplyBox}>
          <div className={styles.originalComment}>
            <strong>Original Comment:</strong> {parentComment}
          </div>
          <div className={styles.replyBox}>
            <img
              className={styles.userAvatar}
              src={userAvatarUrl}
              alt="User"
              onClick={(e) => handleUserClick(e, user?.username)}
            />
            <div className={styles.commentText}>{replyText}</div>
          </div>
        </div>
      );
    } else {
      // fallback
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {senderName}
          </strong>{' '}
          did something with your map "<em>{mapTitle}</em>"
        </>
      );
    }

    return (
      <div
        className={styles.activityItem}
        key={notif.id}
        onClick={() => handleActivityItemClick(notif)} // entire item → go to map
      >
        <div className={styles.thumbContainer}>{mapThumbnail}</div>
        <div className={styles.activityDetails}>
          <p>{mainText}</p>
          {body}
          <span className={styles.timestamp}>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`${styles.dashboardContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header
          title="Dashboard"
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={() => {}}
          profilePicture={profile?.profilePicture}
        />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className={styles.mainWrapper}>
              {/* LEFT: Recently Modified Maps */}
              <div className={styles.leftMapsSidebar}>
                <h2>Recently Modified Maps</h2>
                {recentMaps.length === 0 ? (
                  <p>No maps found.</p>
                ) : (
                  <ul className={styles.recentMapsList}>
                    {recentMaps.map((map) => (
                      <li key={map.id} className={styles.mapListItem}>
                        <div className={styles.mapActions}>
                          <button
                            className={styles.editBtn}
                            onClick={(e) => handleEdit(e, map.id)}
                          >
                            Edit
                          </button>
                        </div>
                        <span
                          className={styles.mapTitle}
                          onClick={() => handleMapClick(map.id)}
                        >
                          {map.title || 'Untitled Map'}
                        </span>
                        <div className={styles.mapModifiedDate}>
                          {map.updatedAt
                            ? formatDistanceToNow(new Date(map.updatedAt), {
                                addSuffix: true,
                              })
                            : 'Unknown'}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* CENTER: Stats + Activity Feed */}
              <div className={styles.centerColumn}>
                {/* Stats */}
                <div className={styles.statsContainer}>
                  <div className={styles.statItem}>
                    <FaMap className={styles.statIcon} />
                    <span className={styles.statLabel}>Maps Created:</span>
                    <span className={styles.statValue}>{totalMapsCreated}</span>
                  </div>
                  <div className={styles.statItem}>
                    <FaStar className={styles.statIcon} />
                    <span className={styles.statLabel}>Stars Received:</span>
                    <span className={styles.statValue}>{totalStarsReceived}</span>
                  </div>
                  <div className={styles.statItem}>
                    <FaCalendarAlt className={styles.statIcon} />
                    <span className={styles.statLabel}>Profile Age (Days):</span>
                    <span className={styles.statValue}>{profileAgeDays}</span>
                  </div>
                </div>

                {/* Activity Feed */}
                <section className={styles.activityFeedSection}>
                  <h2>Activity Feed</h2>
                  {notifications.length === 0 ? (
                    <p>No activity yet.</p>
                  ) : (
                    <div className={styles.activityFeed}>
                      {notifications.map(renderActivityItem)}
                    </div>
                  )}
                </section>
              </div>

              {/* RIGHT: Notifications */}
              <div className={styles.rightNotifications}>
                <h2>Notifications</h2>
                <button
                  className={styles.markAllBtn}
                  onClick={handleViewAllNotifications}
                >
                  View All Notifications
                </button>
                <div className={styles.notificationsList}>
                  {notifications.length === 0 && <p>No notifications.</p>}
                  {notifications.map((notif) => {
                    const senderName =
                      notif.Sender?.firstName ||
                      notif.Sender?.username ||
                      'Someone';
                    return (
                      <div
                        key={notif.id}
                        className={`${styles.notificationItem} ${
                          notif.isRead ? styles.read : styles.unread
                        }`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <p className={styles.notificationText}>
                          <strong>{senderName}</strong>{' '}
                          {notif.type === 'star'
                            ? 'starred your map.'
                            : notif.type === 'comment'
                            ? 'commented on your map.'
                            : notif.type === 'reply'
                            ? 'replied to your comment.'
                            : 'did something.'}
                        </p>
                        <p className={styles.notificationTime}>
                          {notif.createdAt
                            ? formatDistanceToNow(new Date(notif.createdAt), {
                                addSuffix: true,
                              })
                            : ''}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}

        {/* DELETE MODAL */}
        {showDeleteModal && (
          <div
            className={styles.modalOverlay}
            onClick={cancelDelete}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Confirm Deletion</h2>
              <p>
                Are you sure you want to delete "
                <strong>{mapToDelete?.title}</strong>"?
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.confirmDelete}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  className={styles.cancelDelete}
                  onClick={cancelDelete}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
