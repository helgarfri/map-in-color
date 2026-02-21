// src/components/Header.js
import React, { useState, useRef, useEffect, useContext } from "react";
import { FaBell, FaRegBell, FaPlus, FaBars, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api";
import { formatDistanceToNow } from "date-fns";
import { UserContext } from "../context/UserContext";
import { SidebarContext } from "../context/SidebarContext";
import styles from "./Header.module.css";

export default function Header({ title }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

    const navigate = useNavigate();

  // ✅ get context FIRST
  const { profile, setAuthToken, isPro } = useContext(UserContext);
  const { isCollapsed, toggleCollapsed } = useContext(SidebarContext);

  // ✅ then compute things that depend on it
  const isProUser = !!isPro; // uses your context logic: plan === "pro"
  const headerLogoSrc = isProUser
    ? "/assets/3-0/PRO-logo.png"
    : "/assets/3-0/mic-logo-2-5.png";

  // Only show notifications from users that still exist (have a valid Sender)
  const hasValidSender = (n) =>
    n.Sender != null && (n.Sender.id != null || n.Sender.username != null);

  // Only show notifications for maps that still exist (hide notifications for deleted maps)
  const hasValidMap = (n) => !n.map_id || n.Map != null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchNotifications();
        const list = Array.isArray(res.data) ? res.data : [];
        setNotifications(list.filter((n) => hasValidSender(n) && hasValidMap(n)));
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchData();
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      if (notification.map_id) navigate(`/map/${notification.map_id}`);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleCreateMap = () => navigate("/create");

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setAuthToken) setAuthToken(null);
    navigate("/login");
  };

  const profile_pictureUrl = profile?.profile_picture
    ? profile.profile_picture
    : "/default-profile-pic.jpg";

  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>

<button
  className={styles.hamburgerButton}
  onClick={toggleCollapsed}
  aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
>
  <span className={styles.iconWrapper}>
    <FaBars />
  </span>
</button>


        <div className={styles.logoWrapper}>
          <Link to="/dashboard" className={styles.logoLink}>
            <img
                src={headerLogoSrc}
                alt={isProUser ? "Map in Color Pro" : "Map in Color"}
                className={`${styles.logo} ${isProUser ? styles.logoPro : ""}`}
              />

          </Link>
          {title && <span className={styles.headerTitle}>{title}</span>}
        </div>
      </div>

      <div className={styles.headerRight}>
        <button className={styles.createMapButton} onClick={handleCreateMap}>
          <FaPlus className={styles.plusIcon} />
          <span>Create</span>
        </button>

        <div className={styles.notificationWrapper} ref={notificationRef}>
          <button
            className={`${styles.notificationBell} ${
              showNotifications ? styles.notificationBellActive : ""
            }`}
            onClick={() => setShowNotifications((p) => !p)}
            aria-expanded={showNotifications}
            aria-label="Notifications"
          >
            <span className={styles.bellIcon}>
              {showNotifications ? <FaBell /> : <FaRegBell />}
            </span>

            {unreadCount > 0 && (
              <span
                className={styles.unreadBadge}
                aria-label={`${unreadCount} unread notifications`}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className={styles.notificationPopout}>
              <div className={styles.notificationHeader}>
                <div>
                  <h3>Notifications</h3>
                  <p className={styles.notificationHeaderSub}>
                    {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                  </p>
                </div>

                {unreadCount > 0 && (
                  <button className={styles.markAllAsRead} onClick={handleMarkAllAsRead}>
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
                        <img
                          src={
                            notification.Sender?.profile_picture
                              ? notification.Sender.profile_picture
                              : "/default-profile-pic.jpg"
                          }
                          alt="Sender"
                          className={styles.profile_picture}
                        />

                        <div className={styles.notificationText}>
                          <p className={styles.notificationContent}>
                            <Link
                              to={`/profile/${notification.Sender?.username || "unknown"}`}
                              className={styles.senderName}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {notification.Sender?.first_name ||
                                notification.Sender?.username ||
                                "Unknown"}
                            </Link>{" "}
                            {getNotificationMessage(notification, styles)}
                          </p>

                          <p className={styles.notificationMeta}>
                            {formatDistanceToNow(new Date(notification.created_at), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className={styles.noNotifications}>No new notifications.</li>
                )}
              </ul>

              <div className={styles.viewAllLink}>
                <Link to="/notifications" onClick={() => setShowNotifications(false)}>
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className={styles.profileWrapper} ref={profileMenuRef}>
          <button
            type="button"
            className={`${styles.profileButton} ${
              showProfileMenu ? styles.profileButtonActive : ""
            }`}
            onClick={() => setShowProfileMenu((p) => !p)}
            aria-expanded={showProfileMenu}
            aria-label="Profile menu"
          >
            <img
              src={profile_pictureUrl}
              alt="User Avatar"
              className={styles.headerProfilePicture}
            />
          </button>

          {showProfileMenu && (
            <div className={styles.profileMenu}>
              <div className={styles.profileMenuHeader}>
                <img
                  src={profile_pictureUrl}
                  alt="User Avatar"
                  className={styles.profileMenuAvatar}
                />
                <div className={styles.profileMenuInfo}>
                  <div className={styles.profileMenuName}>
                    {profile?.first_name} {profile?.last_name}
                  </div>
                  <div className={styles.profileMenuUsername}>@{profile?.username}</div>
                </div>
              </div>

              <ul className={styles.profileMenuList}>
                <li>
                  <Link
                    to={`/profile/${profile?.username || "unknown"}`}
                    className={styles.profileMenuItem}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaUser className={styles.profileMenuIcon} />
                    <span>View Profile</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/settings"
                    className={styles.profileMenuItem}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    <FaCog className={styles.profileMenuIcon} />
                    <span>Settings</span>
                  </Link>
                </li>

                <li>
                  <button
                    type="button"
                    className={`${styles.profileMenuItem} ${styles.profileMenuItemDanger}`}
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt className={styles.profileMenuIcon} />
                    <span>Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function getNotificationMessage(notification, styles) {
  const mapTitle = notification.Map?.title || "Untitled Map";
  const mapId = notification.Map?.id;

  const mapLink = mapId ? (
    <Link
      to={`/map/${mapId}`}
      className={styles.mapTitle}
      onClick={(e) => e.stopPropagation()}
    >
      {mapTitle}
    </Link>
  ) : (
    "the map"
  );

  switch (notification.type) {
    case "star":
      return <>starred your map {mapLink}.</>;
    case "comment":
      return <>commented on your map {mapLink}.</>;
    case "like":
      return <>liked your comment on {mapLink}.</>;
    case "reply":
      return <>replied to your comment on {mapLink}.</>;
    default:
      return <>performed an action on {mapLink}.</>;
  }
}
