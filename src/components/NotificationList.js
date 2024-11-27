import React, { useEffect, useState } from 'react';
import styles from './NotificationList.module.css';
import { fetchNotifications, markNotificationAsRead } from '../api';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function NotificationList({ isCollapsed, setIsCollapsed }) {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetchNotifications();
        console.log('Notifications Data:', res.data);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
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
    <div className={styles.notificationsContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.mainContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
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
                    src={`http://localhost:5000${notification.Sender.profilePicture}`}
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
          <p>No notifications.</p>
        )}
      </div>
    </div>
  );
}
