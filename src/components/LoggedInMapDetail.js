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
  const { id } = useParams();
  const navigate = useNavigate();

  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { authToken, profile } = useContext(UserContext);

  const { width } = useWindowSize();
  const showOverlay = !isCollapsed && width < 1000;

  const [notifications, setNotifications] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Collapse logic
  useEffect(() => {
    if (width < 1000) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [width, setIsCollapsed]);

  // Fetch notifications
  useEffect(() => {
    async function getNotifs() {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data || []);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    }
    getNotifs();
  }, []);

  // Fetch the map data
  useEffect(() => {
    async function getMap() {
      try {
        setIsLoading(true);
        const response = await fetchMapById(id);
        setMapData(response.data);
      } catch (err) {
        console.error('Error fetching map:', err);
        setErrorMessage('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    }
    getMap();
  }, [id]);

  // Handle errors up front
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }

  // Derive a title, even if mapData is still null
  const titleForHeader = mapData
    ? `${mapData.user?.username || 'Unknown'} / ${mapData.title || 'Untitled Map'}`
    : 'Loading...'; // fallback if still loading

  function handleNotificationClick(notification) {
    console.log('Clicked notification', notification);
    // ...
  }
  function handleMarkAllAsRead() {
    console.log('Mark all as read...');
  }

  return (
    <div className={styles.loggedInMapDetailContainer}>
      {/* Sidebar visible even while loading */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Overlay on small screens */}
      {showOverlay && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`${styles.mainContentWrapper} ${
          isCollapsed ? styles.collapsed : ''
        }`}
      >
        {/* Header visible even while loading */}
        <Header
          title={titleForHeader}
          notifications={notifications.slice(0, 6)}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          profile_picture={profile?.profile_picture}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Pass isLoading and mapData to child */}
        <MapDetailContent
          authToken={authToken}
          profile={profile}
          mapData={mapData}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
