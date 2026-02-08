// LoggedInMapDetail.jsx
import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MapDetailContent from "./MapDetailContent";
import { SidebarContext } from "../context/SidebarContext";
import { UserContext } from "../context/UserContext";
import useWindowSize from "../hooks/useWindowSize";
import styles from "./LoggedInMapDetail.module.css";
import { fetchNotifications } from "../api";
import { useNavigate } from "react-router-dom";

export default function LoggedInMapDetail() {
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { profile } = useContext(UserContext);
  const { width } = useWindowSize();

  const [notifications, setNotifications] = useState([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const showOverlay = !isCollapsed && width < 1000 && !isFullScreen;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    })();
  }, []);

  function handleNotificationClick(notification) {
    navigate(`/map/${notification.map_id}`);
  }

  function handleMarkAllAsRead() {}

  return (
    <div className={styles.loggedInMapDetailContainer}>
      {!isFullScreen && <Sidebar isCollapsed={isCollapsed} />}

      {showOverlay && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`${styles.mainContentWrapper}
          ${isCollapsed ? styles.collapsed : ""}
          ${isFullScreen ? styles.fullScreen : ""}`}
      >
        {!isFullScreen && (
          <Header
            title={"Map"} // optional: MapDetailContent can render its own title anyway
            notifications={notifications.slice(0, 6)}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            profile_picture={profile?.profile_picture}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}

        <MapDetailContent
          isFullScreen={isFullScreen}
          toggleFullScreen={() => setIsFullScreen((v) => !v)}
        />
      </div>
    </div>
  );
}
