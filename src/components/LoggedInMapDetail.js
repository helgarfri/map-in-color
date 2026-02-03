// LoggedInMapDetail.jsx
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MapDetailContent from './MapDetailContent';
import { SidebarContext } from '../context/SidebarContext';
import { UserContext } from '../context/UserContext';
import useWindowSize from '../hooks/useWindowSize';
import styles from './LoggedInMapDetail.module.css';
import { fetchNotifications, fetchMapById } from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function LoggedInMapDetail() {
  /* -------------------------------------------------- */
  /* hooks & context                                    */
  /* -------------------------------------------------- */
  const { id } = useParams();
  const navigate = useNavigate();

  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { authToken, profile } = useContext(UserContext);

  const { width } = useWindowSize();

  /* -------------------------------------------------- */
  /* local state                                        */
  /* -------------------------------------------------- */
  const [notifications, setNotifications] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  /* ➊ full-screen flag lives in the parent */
  const [isFullScreen, setIsFullScreen] = useState(false);

  /* -------------------------------------------------- */
  /* derived helpers                                    */
  /* -------------------------------------------------- */
  const showOverlay = !isCollapsed && width < 1000 && !isFullScreen;

  const titleForHeader = mapData
    ? `${mapData.user?.username || 'Unknown'} / ${mapData.title || 'Untitled Map'}`
    : 'Loading…';

  /* -------------------------------------------------- */
  /* effects                                            */
  /* -------------------------------------------------- */
  /* collapse sidebar automatically under 1000 px */
  useEffect(() => {
    setIsCollapsed(width < 1000);
  }, [width, setIsCollapsed]);

  /* notifications */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    })();
  }, []);

  /* map data */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetchMapById(id);
        setMapData(res.data);
      } catch (err) {
        console.error('Error fetching map:', err);
        setErrorMessage('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  /* -------------------------------------------------- */
  /* callbacks                                          */
  /* -------------------------------------------------- */
  function handleNotificationClick(notification) {
    console.log('Clicked notification', notification);
    // navigate or whatever…
  }

  function handleMarkAllAsRead() {
    console.log('Mark all as read…');
  }

  /* -------------------------------------------------- */
  /* early returns                                      */
  /* -------------------------------------------------- */
  if (errorMessage) return <div>Error: {errorMessage}</div>;

  /* -------------------------------------------------- */
  /* render                                             */
  /* -------------------------------------------------- */
  return (
    <div className={styles.loggedInMapDetailContainer}>
      {/* ➋ Sidebar disappears in full-screen */}
      {!isFullScreen && <Sidebar isCollapsed={isCollapsed} />}

      {/* ➌ Small-screen overlay (but not in full-screen) */}
      {showOverlay && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
         className={`${styles.mainContentWrapper}
             ${isCollapsed ? styles.collapsed : ''}
             ${isFullScreen ? styles.fullScreen : ''}`}
      >
        {/* ➍ Header disappears in full-screen */}
        {!isFullScreen && (
          <Header
            title={titleForHeader}
            notifications={notifications.slice(0, 6)}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            profile_picture={profile?.profile_picture}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
        )}

        {/* ➎ Pass flag + toggle down to the map component */}
        <MapDetailContent
          authToken={authToken}
          profile={profile}
          mapData={mapData}
          isLoading={isLoading}
          isFullScreen={isFullScreen}
          toggleFullScreen={() => setIsFullScreen((v) => !v)}
        />
      </div>
    </div>
  );
}
