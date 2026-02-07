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
import useWindowSize from '../hooks/useWindowSize';

// Icons
import {
  FaStar,
  FaComment,
  FaReply,
  FaThumbsUp,
  FaCheck,
  FaTrash,
} from 'react-icons/fa';

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();


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

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  // Clicking on a notification marks it as read and navigates (if map_id exists)
  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      if (notification.map_id) {
        navigate(`/map/${notification.map_id}`);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark a notification as read without navigating
  const handleMarkAsRead = async (e, notification) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Delete a notification
  const handleDeleteNotification = async (e, notification) => {
    e.stopPropagation();
    try {
      await deleteNotification(notification.id);
      setNotifications((prev) =>
        prev.filter((n) => n.id !== notification.id)
      );
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  // Choose an icon based on notification type
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

  // Create the notification message
  const getNotificationMessage = (notification) => {
    const senderName =
      notification.Sender?.first_name ||
      notification.Sender?.username ||
      'Unknown';
    const mapTitle = notification.Map?.title || 'Untitled Map';
    switch (notification.type) {
      case 'star':
        return (
          <>
            starred your map <strong>{mapTitle}</strong>.
          </>
        );
      case 'comment':
        return (
          <>
            commented on your map <strong>{mapTitle}</strong>.
          </>
        );
      case 'reply':
        return (
          <>
            replied to your comment on <strong>{mapTitle}</strong>.
          </>
        );
      case 'like':
        return (
          <>
            liked your comment on <strong>{mapTitle}</strong>.
          </>
        );
      default:
        return (
          <>
            performed an action on <strong>{mapTitle}</strong>.
          </>
        );
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
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`${styles.mainContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header
          notifications={notifications.slice(0, 6)}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          title="Notifications"
        />

        {/* Stat box showing unread notifications */}
        <div className={styles.statsBar}>
          <div className={styles.statBox}>
            <span className={styles.statValue}>{unreadCount}</span>
            <div className={styles.statLabel}>Unread Notifications</div>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.skeletonContainer}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.skeletonNotification}>
                <div className={styles.skeletonAvatar}></div>
                <div className={styles.skeletonTextWrapper}>
                  <div
                    className={styles.skeletonLine}
                    style={{ width: '80%', marginBottom: '6px' }}
                  ></div>
                  <div
                    className={styles.skeletonLine}
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <div className={styles.skeletonActions}></div>
              </div>
            ))}
          </div>
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
                <div className={styles.notificationContentWrapper}>
                  <div className={styles.mainInfo}>
                    <div className={styles.typeIconWrapper}>
                      {getNotificationIcon(notification.type)}
                    </div>
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
                        <Link
                          to={`/profile/${
                            notification.Sender?.username || 'unknown'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                          className={styles.senderLink}
                        >
                          {notification.Sender?.first_name ||
                            notification.Sender?.username ||
                            'Unknown'}
                        </Link>{' '}
                        {getNotificationMessage(notification)}
                      </p>
                      <div className={styles.notificationTime}>
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleMarkAsRead(e, notification)}
                      title={notification.is_read ? "Already read" : "Mark as read"}
                      disabled={notification.is_read}
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
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noNotifications}>No notifications.</p>
        )}
      </div>
    </div>
  );
}
