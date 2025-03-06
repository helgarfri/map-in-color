// src/components/Header.js

import React, { useState, useEffect, useRef, useContext } from 'react';
import styles from './Header.module.css';
import { FaBell, FaPlus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api';
import { formatDistanceToNow } from 'date-fns';
import MapSelectionModal from './MapSelectionModal';
import { UserContext } from '../context/UserContext';

export default function Header({ title, userName }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  // For creating a new map
  const [showMapModal, setShowMapModal] = useState(false);

  // For profile menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  const navigate = useNavigate();
  const { profile, setAuthToken } = useContext(UserContext);

  // Fetch notifications on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    fetchData();
  }, []);

  // Mark single notification as read + navigate
  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      // Safely navigate if there's a map_id
      if (notification.map_id) {
        navigate(`/map/${notification.map_id}`);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // For toggling "Notifications" + "Profile Menu" and closing them on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Create map button
  const handleCreateMap = () => {
    setShowMapModal(true);
  };

  // If user selects a map in the modal
  const handleMapSelection = (selected_map) => {
    if (selected_map) {
      setShowMapModal(false);
      navigate('/create', { state: { selected_map } });
    } else {
      alert('Please select a map type.');
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setAuthToken) setAuthToken(null);
    navigate('/login');
  };

  // Build profile pic URL if user is logged in
  const profile_pictureUrl = profile?.profile_picture
  ? profile.profile_picture
  : '/default-profile-pic.jpg';

  return (
    <header className={styles.header}>
      {/* LEFT: Title */}
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>
          {title}
          {userName && `, ${userName}!`}
        </h1>
      </div>

      {/* RIGHT: Create Map, Notifications, Profile */}
      <div className={styles.headerRight}>
        {/* Create New Map Button */}
        <button className={styles.createMapButton} onClick={handleCreateMap}>
          <FaPlus className={styles.plusIcon} /> Create New Map
        </button>

        {/* Notification Bell + Popout */}
        <div className={styles.notificationWrapper} ref={notificationRef}>
          <button
            className={styles.notificationBell}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {unreadCount > 0 && (
              <span className={styles.unreadBadge}>{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notificationPopout}>
              <div className={styles.notificationHeader}>
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    className={styles.markAllAsRead}
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <ul className={styles.notificationList}>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li
                      key={notification.id}
                      className={`${styles.notificationItem} ${
                        notification.is_read ? styles.read : styles.unread
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={styles.notificationContentWrapper}>
                        {/* Sender’s profile picture (use optional chaining) */}
                        <img
                           src={
                            notification.Sender?.profile_picture
                              ? notification.Sender.profile_picture
                              : '/default-profile-pic.jpg'
                          }
                          alt={`${
                            notification.Sender?.first_name ||
                            notification.Sender?.username ||
                            'Unknown'
                          }'s profile`}
                          className={styles.profile_picture}
                        />

                        <div className={styles.notificationText}>
                          <p className={styles.notificationContent}>
                            {/* Link to Sender’s profile (if available) */}
                            <Link
                              to={`/profile/${
                                notification.Sender?.username || 'unknown'
                              }`}
                              className={styles.senderName}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.Sender?.first_name ||
                                notification.Sender?.username ||
                                'Unknown'}
                            </Link>{' '}
                            {getNotificationMessage(notification)}
                          </p>
                          <p className={styles.notificationMeta}>
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              {
                                addSuffix: true,
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className={styles.noNotifications}>
                    No new notifications.
                  </li>
                )}
              </ul>
              <div className={styles.viewAllLink}>
                <Link
                  to="/notifications"
                  onClick={() => setShowNotifications(false)}
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Picture + Dropdown */}
        <div className={styles.profileWrapper} ref={profileMenuRef}>
          <img
            src={profile_pictureUrl}
            alt="User Avatar"
            className={styles.headerProfilePicture}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <ul>
                <li>
                  <Link
                    to={`/profile/${profile?.username || 'unknown'}`}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link to="/settings" onClick={() => setShowProfileMenu(false)}>
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    className={styles.logoutButton}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Show modal for map creation */}
      {showMapModal && (
        <MapSelectionModal
          show={showMapModal}
          onClose={() => setShowMapModal(false)}
          onCreateMap={handleMapSelection}
        />
      )}
    </header>
  );
}

/**
 * Returns a small JSX snippet describing the notification event
 * We use optional chaining for safety in case notification.Map is missing
 */
function getNotificationMessage(notification) {
  const mapTitle = notification.Map?.title || 'Untitled Map';
  const mapId = notification.Map?.id;

  // If map is missing, just say "the map"
  const mapLink = mapId ? (
    <Link
      to={`/map/${mapId}`}
      className={styles.mapTitle}
      onClick={(e) => e.stopPropagation()}
    >
      {mapTitle}
    </Link>
  ) : (
    'the map'
  );

  switch (notification.type) {
    case 'star':
      return <>starred your map {mapLink}.</>;
    case 'comment':
      return <>commented on your map {mapLink}.</>;
    case 'like':
      return <>liked your comment on {mapLink}.</>;
    case 'reply':
      return <>replied to your comment on {mapLink}.</>;
    default:
      return <>performed an action on {mapLink}.</>;
  }
}
