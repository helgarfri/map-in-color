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
  const notificationRef = useRef(null);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // State for Map Creation Modal
  const [showMapModal, setShowMapModal] = useState(false);

  // State for Profile Menu
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  // Get user profile and logout function
  const { profile, setAuthToken } = useContext(UserContext);

  // Fetch notifications
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

  // Handle notification click
  const handleNotificationClick = async (notification) => {
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

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Close notifications and profile menu when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate unread notifications count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Handle Create Map button click
  const handleCreateMap = () => {
    setShowMapModal(true);
  };

  // Handle Map Selection from Modal
  const handleMapSelection = (selectedMap) => {
    if (selectedMap) {
      setShowMapModal(false);
      navigate('/create', { state: { selectedMap } });
    } else {
      alert('Please select a map type.');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (setAuthToken) {
      setAuthToken(null); // Clear authToken in UserContext
    }
    navigate('/login'); // Redirect to login page
  };

  // Construct profile picture URL
  const profilePictureUrl = profile && profile.profilePicture
    ? `http://localhost:5000${profile.profilePicture}`
    : '/default-profile-pic.jpg';

  return (
    <header className={styles.header}>
      {/* Left side: Title */}
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>
          {title}
          {userName && `, ${userName}!`}
        </h1>
      </div>

      {/* Right side: Create Map Button, Notification Bell, Profile Picture */}
      <div className={styles.headerRight}>
        {/* Create New Map Button */}
        <button className={styles.createMapButton} onClick={handleCreateMap}>
          <FaPlus className={styles.plusIcon} /> Create New Map
        </button>

        {/* Notification Bell */}
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
                            notification.Sender.firstName ||
                            notification.Sender.username
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
                              {notification.Sender.firstName ||
                                notification.Sender.username}
                            </Link>{' '}
                            {getNotificationMessage(notification)}
                          </p>
                          <p className={styles.notificationMeta}>
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
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

        {/* Profile Picture and Dropdown Menu */}
        <div className={styles.profileWrapper} ref={profileMenuRef}>
          <img
            src={profilePictureUrl}
            alt="User Avatar"
            className={styles.headerProfilePicture}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          />
          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <ul>
                <li>
                  <Link
                    to={`/profile/${profile.username}`}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    View Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    onClick={() => setShowProfileMenu(false)}
                  >
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

      {/* Map Selection Modal */}
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

function getNotificationMessage(notification) {
  const mapTitle = notification.Map.title || 'Untitled Map';
  const mapLink = (
    <Link
      to={`/map/${notification.Map.id}`}
      className={styles.mapTitle}
      onClick={(e) => e.stopPropagation()}
    >
      {mapTitle}
    </Link>
  );

  switch (notification.type) {
    case 'star':
      return <>starred your map {mapLink}.</>;
    case 'comment':
      return <>commented on your map {mapLink}.</>;
    case 'like':
      return <>liked your comment on map {mapLink}.</>;
    case 'reply':
      return <>replied to your comment on map {mapLink}.</>;
    default:
      return <>performed an action on your map {mapLink}.</>;
  }
}
