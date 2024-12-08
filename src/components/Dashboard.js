// src/components/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import {
  fetchMaps,
  deleteMap,
  fetchSavedMaps,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api';
import Sidebar from './Sidebar';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import Header from './Header';
import { formatDistanceToNow, formatDistance } from 'date-fns';
import { UserContext } from '../context/UserContext';
import { FaStar, FaPlus, FaMap, FaCalendarAlt } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';
import { Link } from 'react-router-dom';

export default function Dashboard({ isCollapsed, setIsCollapsed }) {
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useContext(UserContext);
  const [maps, setMaps] = useState([]);
  const [favoriteMaps, setFavoriteMaps] = useState([]);
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mapToDelete, setMapToDelete] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const totalStarsReceived = maps.reduce(
    (total, map) => total + (map.saveCount || 0),
    0
  );

  const profileAge = profile
    ? formatDistance(new Date(profile.createdAt), new Date(), {
        addSuffix: false,
      })
    : '';

  // Ensure profile is loaded before fetching maps
  useEffect(() => {
    if (!profile) return;

    const getData = async () => {
      try {
        const [mapsRes, savedMapsRes, notificationsRes] = await Promise.all([
          fetchMaps(),
          fetchSavedMaps(),
          fetchNotifications(),
        ]);

        const sortedMaps = mapsRes.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setMaps(sortedMaps);
        setFavoriteMaps(savedMapsRes.data);
        setNotifications(notificationsRes.data.slice(0, 6));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [profile]);

  // Get top 3 recently modified maps
  const recentMaps = maps.slice(0, 3);

  const displayedFavoriteMaps = favoriteMaps.slice(0, 4);

  const handleEdit = (event, mapId) => {
    event.stopPropagation();
    navigate(`/edit/${mapId}`);
  };

  const handleDelete = (event, mapId) => {
    event.stopPropagation();
    const map = maps.find((m) => m.id === mapId);
    setMapToDelete(map);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (mapToDelete) {
      try {
        await deleteMap(mapToDelete.id);
        setMaps(maps.filter((map) => map.id !== mapToDelete.id));
        setShowDeleteModal(false);
        setMapToDelete(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMapToDelete(null);
  };




  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read and navigate to the map
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, isRead: true } : n
        )
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
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.dashboardContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header Section */}
        <Header
            title="Welcome Back"
            userName={profile?.firstName}
            notifications={notifications.slice(0, 6)}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            profilePicture={profile?.profilePicture}
          />

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className={styles.statisticsPanel}>
              <div className={styles.statistic}>
                <FaMap className={styles.statIcon} />
                <h3>Maps Created</h3>
                <p>{maps.length}</p>
              </div>
              <div className={styles.statistic}>
                <FaStar className={styles.statIcon} />
                <h3>Stars Received</h3>
                <p>{totalStarsReceived}</p>
              </div>
              <div className={styles.statistic}>
                <FaCalendarAlt className={styles.statIcon} />
                <h3>Profile Age</h3>
                <p>{profileAge}</p>
              </div>
            </div>

            {/* Main Content Area */}
            <div className={styles.mainContent}>
              {/* Recently Modified Maps */}
              <section className={styles.recentMaps}>
                <h2>Recently Modified Maps</h2>
                {recentMaps.length > 0 ? (
                  <div className={styles.cardsContainer}>
                    {recentMaps.map((map) => {
                      const mapTitle = map.title || 'Untitled Map';
                      return (
                        <div
                          className={styles.mapCard}
                          key={map.id}
                          onClick={() => navigate(`/map/${map.id}`)}
                        >
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
                          <div className={styles.cardOverlay}>
                            <h3>{mapTitle}</h3>
                            <p>
                              Modified{' '}
                              {map.updatedAt
                                ? formatDistanceToNow(
                                    new Date(map.updatedAt),
                                    {
                                      addSuffix: true,
                                    }
                                  )
                                : 'Unknown time'}
                            </p>
                            <div className={styles.cardActions}>
                              <button
                                className={styles.editButton}
                                onClick={(event) =>
                                  handleEdit(event, map.id)
                                }
                              >
                                Edit
                              </button>
                              <button
                                className={styles.deleteButton}
                                onClick={(event) =>
                                  handleDelete(event, map.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>No recent maps.</p>
                )}
              </section>

              {/* Starred Maps */}
              <section className={styles.favoriteMaps}>
                <h2>Starred Maps</h2>
                {favoriteMaps.length > 0 ? (
                  <div className={styles.starredMapsContainer}>
                    {displayedFavoriteMaps.map((map) => {
                      const mapTitle = map.title || 'Untitled Map';
                      return (
                        <div
                          className={styles.starredMapCard}
                          key={map.id}
                          onClick={() => navigate(`/map/${map.id}`)}
                        >
                          <div className={styles.starredThumbnail}>
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
                          <div className={styles.starredMapInfo}>
                            <h3>{mapTitle}</h3>
                            <p>Created by {map.User.username}</p>
                            <div className={styles.starCount}>
                              <FaStar className={styles.starIcon} />
                              {map.saveCount || 0}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p>You have no saved maps.</p>
                )}
                {/* View All Starred Maps Link */}
                {favoriteMaps.length > 4 && (
                  <div className={styles.viewAllLink}>
                    <a href="/starred-maps">View All Starred Maps</a>
                  </div>
                )}
              </section>

              {/* Help and Support */}
              <footer className={styles.helpSupport}>
                <h2>Help and Support</h2>
                <p>
                  Need assistance? Visit our{' '}
                  <a href="/help">Help Center</a> or{' '}
                  <a href="/contact">Contact Support</a>.
                </p>
              </footer>
            </div>
          </>
        )}

    
        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div
            className={styles.modalOverlay}
            onClick={cancelDelete}
          >
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Confirm Delete</h2>
              <p>
                Are you sure you want to delete the map titled "
                <strong>{mapToDelete?.title || 'Untitled Map'}</strong>"? This
                action cannot be undone.
              </p>
              <button
                className={styles.deleteButton}
                onClick={confirmDelete}
              >
                Delete
              </button>
              <button
                className={styles.cancelButton}
                onClick={cancelDelete}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
