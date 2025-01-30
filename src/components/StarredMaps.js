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
import { formatDistanceToNow } from 'date-fns';
import Header from './Header';
import { UserContext } from '../context/UserContext';
import LoadingSpinner from './LoadingSpinner';

export default function StarredMaps({ isCollapsed, setIsCollapsed }) {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { profile } = useContext(UserContext);

  useEffect(() => {
    const getStarredMaps = async () => {
      try {
        const res = await fetchSavedMaps(); // Fetch starred maps
        const sortedMaps = res.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
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

  // Handle notification click
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
    <div className={styles.starredMapsContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.starredMapsContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header */}
        <Header
          title="Starred Maps"
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
        />

        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <p>Error fetching starred maps. Please try again later.</p>
        ) : maps.length > 0 ? (
          <table className={styles.mapTable}>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Modified</th>
                <th>Stars</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {maps.map((map) => {
                const mapTitle = map.title || 'Untitled Map';
                const creatorUsername = map.User?.username || 'Unknown';
                return (
                  <tr
                    key={map.id}
                    className={styles.mapRow}
                    onClick={() => navigate(`/map/${map.id}`)}
                  >
                    <td className={styles.thumbnailCell}>
                      <div className={styles.thumbnail}>
                        {/* Render SVG component based on map type */}
                        {map.selectedMap === 'world' && (
                          <WorldMapSVG
                            groups={map.groups}
                            mapTitleValue={mapTitle}
                            oceanColor={map.oceanColor}
                            unassignedColor={map.unassignedColor}
                            showTopHighValues={false}
                            showTopLowValues={false}
                            data={map.data}
                            selectedMap={map.selectedMap}
                            fontColor={map.fontColor}
                            topHighValues={[]}
                            topLowValues={[]}
                            isThumbnail={true}
                            isTitleHidden={map.isTitleHidden}
                          />
                        )}
                        {map.selectedMap === 'usa' && (
                          <UsSVG
                            groups={map.groups}
                            mapTitleValue={mapTitle}
                            oceanColor={map.oceanColor}
                            unassignedColor={map.unassignedColor}
                            showTopHighValues={false}
                            showTopLowValues={false}
                            data={map.data}
                            selectedMap={map.selectedMap}
                            fontColor={map.fontColor}
                            topHighValues={[]}
                            topLowValues={[]}
                            isThumbnail={true}
                            isTitleHidden={map.isTitleHidden}
                          />
                        )}
                        {map.selectedMap === 'europe' && (
                          <EuropeSVG
                            groups={map.groups}
                            mapTitleValue={mapTitle}
                            oceanColor={map.oceanColor}
                            unassignedColor={map.unassignedColor}
                            showTopHighValues={false}
                            showTopLowValues={false}
                            data={map.data}
                            selectedMap={map.selectedMap}
                            fontColor={map.fontColor}
                            topHighValues={[]}
                            topLowValues={[]}
                            isThumbnail={true}
                            isTitleHidden={map.isTitleHidden}
                          />
                        )}
                      </div>
                    </td>
                    <td className={styles.titleCell}>{mapTitle}</td>
                    <td className={styles.modifiedCell}>
                      {formatDistanceToNow(new Date(map.updatedAt), {
                        addSuffix: true,
                      })}
                    </td>
                    <td className={styles.starsCell}>
                      <div className={styles.starCount}>
                        <FaStar className={styles.starIcon} />
                        {map.saveCount || 0}
                      </div>
                    </td>
                    <td className={styles.createdByCell}>{creatorUsername}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>You have no starred maps.</p>
        )}
      </div>
    </div>
  );
}
