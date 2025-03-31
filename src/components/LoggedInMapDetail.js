// LoggedInMapDetail.js
import React, { useContext, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MapDetailContent from './MapDetailContent';
import { SidebarContext } from '../context/SidebarContext';
import { UserContext } from '../context/UserContext';
import useWindowSize from '../hooks/useWindowSize';
import styles from './LoggedInMapDetail.module.css';
import { fetchNotifications, fetchMapById } from '../api'; // or your fetch calls
import { useParams, useNavigate } from 'react-router-dom';

export default function LoggedInMapDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { authToken, profile } = useContext(UserContext);

  const { width } = useWindowSize();
  const showOverlay = !isCollapsed && width < 1000;

  // We store everything in the parent:
  const [notifications, setNotifications] = useState([]);
  const [mapData, setMapData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Possibly we keep `is_public`, `isOwner`, etc. in local state
  // but we can also derive them from mapData if the backend includes them
  // For example:  const isOwner = mapData?.isOwner;

  // Collapsing logic
  useEffect(() => {
    if (width < 1000) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [width, setIsCollapsed]);

  // 1) Fetch notifications
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

  // 2) Fetch the map data
  useEffect(() => {
    async function getMap() {
      try {
        setIsLoading(true);
        const response = await fetchMapById(id);
        setMapData(response.data); // store entire map data
      } catch (err) {
        console.error('Error fetching map:', err);
        setErrorMessage('Failed to load map');
      } finally {
        setIsLoading(false);
      }
    }
    getMap();
  }, [id]);

  // Handlers for the header
  function handleNotificationClick(notification) {
    console.log('Clicked notification', notification);
    // e.g. mark read or navigate:
    // navigate(`/map/${notification.map_id}`);
  }
  function handleMarkAllAsRead() {
    console.log('Mark all as read...');
  }

  // If there's an error or if it's loading, handle it:
  if (isLoading) {
    return <div>Loading map details...</div>;
  }
  if (errorMessage) {
    return <div>Error: {errorMessage}</div>;
  }
  if (!mapData) {
    // fallback if null
    return <div>Map not found</div>;
  }

  // Now we can pass mapData to <Header> for the title, or "unknown" if you prefer
  const titleForHeader = `${mapData?.user?.username || 'Unknown'} / ${
    mapData?.title || 'Untitled Map'
  }`;

  return (
    <div className={styles.loggedInMapDetailContainer}>
      {/* Left: Sidebar */}
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
        <Header
          title={titleForHeader}
          notifications={notifications.slice(0, 6)}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          profile_picture={profile?.profile_picture}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        {/* Pass mapData and anything else to the child */}
        <MapDetailContent
          authToken={authToken}
          profile={profile}
          mapData={mapData}       // here's the big difference
          // if you have logic for comments, you could store in parent or let the child handle them
        />
      </div>
    </div>
  );
}
