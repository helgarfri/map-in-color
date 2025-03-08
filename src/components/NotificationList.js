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
import { SidebarContext } from '../context/SidebarContext';

// Icons
import { FaStar, FaComment, FaReply, FaThumbsUp, FaCheck, FaTrash } from 'react-icons/fa';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        // Make the API call to your backend to get notifications
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

  // Clicking anywhere on the notification → mark as read + navigate to map
  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      // If the notification references a map, navigate to it
      if (notification.map_id) {
        navigate(`/map/${notification.map_id}`);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark a notification as read, but don’t navigate
  const handleMarkAsRead = async (e, notification) => {
    e.stopPropagation(); // avoid triggering the parent click
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (e, notification) => {
    e.stopPropagation();
    try {
      await deleteNotification(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Determine the best icon based on notification.type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'star':
        return <FaStar className={styles.typeIcon} />;
      case 'comment':
        return <FaComment className={styles.typeIcon} />;
      case 'reply':
        return <FaReply className={styles.typeIcon} />;
      case 'like':
        return <FaThumbsUp className={styles.typeIcon} />;
      default:
        return <FaComment className={styles.typeIcon} />;
    }
  };

  // Generate the main text of the notification
  // (You can customize this further if needed)
  const getNotificationMessage = (notification) => {
    // Safely read out the fields with optional chaining
    const senderName =
      notification.Sender?.first_name ||
      notification.Sender?.username ||
      'Unknown';

    const mapTitle = notification.Map?.title || 'Untitled Map';

    switch (notification.type) {
      case 'star':
        return `${senderName} starred your map "${mapTitle}".`;
      case 'comment':
        return `${senderName} commented on your map "${mapTitle}".`;
      case 'reply':
        return `${senderName} replied to your comment on "${mapTitle}".`;
      case 'like':
        return `${senderName} liked your comment on "${mapTitle}".`;
      default:
        return `${senderName} performed an action on "${mapTitle}".`;
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

  return (
    <div className={styles.notificationsContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main content area */}
      <div
        className={`${styles.mainContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header with "mark all as read" */}
        <Header
          notifications={notifications.slice(0, 6)}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          title="Notifications"
        />

        {/* If loading, show spinner; otherwise show notifications list */}
        {isLoading ? (
          <LoadingSpinner />
        ) : notifications.length > 0 ? (
          <ul className={styles.notificationList}>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`${styles.notificationItem} ${
                  notification.is_read ? styles.read : styles.unread
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                {/* Left quick actions (Mark as read, Delete) */}
                <div className={styles.leftActions}>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => handleMarkAsRead(e, notification)}
                    title="Mark as read"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={(e) => handleDeleteNotification(e, notification)}
                    title="Remove notification"
                  >
                    <FaTrash />
                  </button>
                </div>

                {/* Main notification content */}
                <div className={styles.notificationContentWrapper}>
                  <div className={styles.typeIconWrapper}>
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Sender's profile picture (if any) */}
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
                      {/* Link to the sender’s profile (if they exist) */}
                      <Link
                        to={`/profile/${notification.Sender?.username || 'unknown'}`}
                        onClick={(e) => e.stopPropagation()} // so we don't click open the map
                      >
                        {notification.Sender?.first_name ||
                          notification.Sender?.username ||
                          'Unknown'}
                      </Link>{' '}
                      {getNotificationMessage(notification)}
                    </p>
                  </div>

                  {/* Time ago */}
                  <div className={styles.notificationTime}>
                    {formatDistanceToNow(new Date(notification.created_at), {
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
