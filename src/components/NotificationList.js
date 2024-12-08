// src/components/NotificationList.js

import React, { useEffect, useState, useContext } from 'react';
import styles from './NotificationList.module.css';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '../api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserContext } from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner';

// Import icons
import { FaStar, FaComment, FaReply, FaThumbsUp, FaCheck, FaTrash } from 'react-icons/fa';

export default function NotificationList({ isCollapsed, setIsCollapsed }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getNotifications();
  }, []);

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

  const handleMarkAsRead = async (e, notification) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleDeleteNotification = async (e, notification) => {
    e.stopPropagation();
    try {
      await deleteNotification(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Helper function to get the appropriate icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'star':
        return <FaStar className={styles.typeIcon} />;
      case 'comment':
        return <FaComment className={styles.typeIcon} />;
      case 'like':
        return <FaThumbsUp className={styles.typeIcon} />;
      case 'reply':
        return <FaReply className={styles.typeIcon} />;
      default:
        return <FaComment className={styles.typeIcon} />;
    }
  };

  // Helper function to generate notification message
  const getNotificationMessage = (notification) => {
    const senderName = notification.Sender.firstName || notification.Sender.username;
    const mapTitle = notification.Map.title || 'Untitled Map';

    switch (notification.type) {
      case 'star':
        return `starred your map "${mapTitle}".`;
      case 'comment':
        return `commented on your map "${mapTitle}".`;
      case 'like':
        return `liked your comment on "${mapTitle}".`;
      case 'reply':
        return `replied to your comment on "${mapTitle}".`;
      default:
        return `performed an action on your map "${mapTitle}".`;
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

  return (
    <div className={styles.notificationsContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.mainContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header */}
        <Header
          title="Notifications"
          notifications={notifications.slice(0, 6)}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        {/* Notification List */}
        {isLoading ? (
          <LoadingSpinner />
        ) : notifications.length > 0 ? (
          <ul className={styles.notificationList}>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`${styles.notificationItem} ${
                  notification.isRead ? styles.read : styles.unread
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Left Actions */}
                <div className={styles.leftActions}>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => handleMarkAsRead(e, notification)}
                    title="Mark as Read"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => handleDeleteNotification(e, notification)}
                    title="Remove Notification"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Notification Content */}
                <div className={styles.notificationContentWrapper}>
                  {/* Notification Type Icon */}
                  <div className={styles.typeIconWrapper}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Profile Picture */}
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

                  {/* Notification Text */}
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
                  </div>

                  {/* Notification Time */}
                  <div className={styles.notificationTime}>
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications.</p>
        )}
      </div>
    </div>
  );
}
