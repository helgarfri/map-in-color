// src/components/StarredMaps.js

import React, { useState, useEffect, useContext } from 'react';
import styles from './StarredMaps.module.css';
import { useNavigate } from 'react-router-dom';
import {
  fetchSavedMaps,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import { FaStar } from 'react-icons/fa';
import Sidebar from './Sidebar';
import Header from './Header';
import { UserContext } from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner';

export default function StarredMaps({ isCollapsed, setIsCollapsed }) {
  const [maps, setMaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);

  useEffect(() => {
    const getStarredMaps = async () => {
      try {
        const res = await fetchSavedMaps();
        // Sort maps by updated_at descending
        const sortedMaps = res.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setMaps(sortedMaps);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    const getNotifications = async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    getStarredMaps();
    getNotifications();
  }, []);

  // Notification handlers
  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      navigate(`/map/${notification.map_id}`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Render the appropriate SVG thumbnail based on map type.
  function renderMapThumbnail(map) {
    const mapTitle = map.title || 'Untitled Map';
    const sharedProps = {
      groups: map.groups,
      mapTitleValue: mapTitle,
      ocean_color: map.ocean_color,
      unassigned_color: map.unassigned_color,
      data: map.data,
      selected_map: map.selected_map,
      font_color: map.font_color,
      is_title_hidden: map.is_title_hidden,
      show_top_high_values: false,
      show_top_low_values: false,
    };

    if (map.selected_map === 'world') return <WorldMapSVG {...sharedProps} />;
    if (map.selected_map === 'usa') return <UsSVG {...sharedProps} />;
    if (map.selected_map === 'europe') return <EuropeSVG {...sharedProps} />;
    return null;
  }

  return (
    <div className={styles.starredMapsContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`${styles.starredMapsContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header
          title="Starred Maps"
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p>Error fetching starred maps. Please try again later.</p>
        ) : maps.length > 0 ? (
          <div className={styles.mapsGrid}>
            {maps.map((map) => {
              const mapTitle = map.title || 'Untitled Map';
              // Check if the joined user data is returned as an array or object
              const creatorUsername =
                map.users
                  ? Array.isArray(map.users)
                    ? map.users[0]?.username || 'Unknown'
                    : map.users.username || 'Unknown'
                  : 'Unknown';
              return (
                <div
                  key={map.id}
                  className={styles.mapCard}
                  onClick={() => navigate(`/map/${map.id}`)}
                >
                  <div className={styles.thumbnail}>
                    {renderMapThumbnail(map)}
                  </div>
                  <h3 className={styles.mapTitle}>{mapTitle}</h3>
                  <div className={styles.mapInfoRow}>
                    <span>By {creatorUsername}</span>
                    <span>
                      <FaStar className={styles.starIcon} />{' '}
                      {map.save_count || 0}
                    </span>
                  </div>
                  {map.tags && map.tags.length > 0 && (
                    <div className={styles.tags}>
                      {map.tags.slice(0, 5).map((tg, idx) => (
                        <span key={idx} className={styles.tag}>
                          {tg}
                        </span>
                      ))}
                      {map.tags.length > 5 && (
                        <span className={styles.tag}>
                          +{map.tags.length - 5}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p>You have no starred maps.</p>
        )}
      </div>
    </div>
  );
}
