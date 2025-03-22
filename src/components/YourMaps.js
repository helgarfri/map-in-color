import React, { useState, useEffect, useContext } from 'react';
import styles from './YourMaps.module.css';
import { useNavigate } from 'react-router-dom';
import {
  fetchMaps,
  deleteMap,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import Header from './Header';
import Sidebar from './Sidebar';
import { formatDistanceToNow } from 'date-fns';
import { FaStar, FaGlobe, FaLock, FaMap } from 'react-icons/fa';
import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize';

export default function YourMaps() {
  const [isLoading, setIsLoading] = useState(true);
  const [maps, setMaps] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mapToDelete, setMapToDelete] = useState(null);

  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const navigate = useNavigate();
  const { width } = useWindowSize();

  useEffect(() => {
    if (width < 1000 && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [width, isCollapsed, setIsCollapsed]);

  useEffect(() => {
    const getMaps = async () => {
      try {
        const res = await fetchMaps();
        // Sort maps by updated_at descending
        const sortedMaps = res.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setMaps(sortedMaps);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
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

    getMaps();
    getNotifications();
  }, []);

  // Calculate stats for maps
  const totalMaps = maps.length;
  const publicMaps = maps.filter((map) => map.is_public).length;
  const privateMaps = totalMaps - publicMaps;
  const totalStars = maps.reduce((acc, map) => acc + (map.save_count || 0), 0);

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
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // Action handlers
  const handleView = (event, mapId) => {
    event.stopPropagation();
    navigate(`/map/${mapId}`);
  };

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

  // Render the appropriate SVG thumbnail based on map type.
  const renderMapThumbnail = (map) => {
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
  };

  // --------------------------
  // SKELETON VIEW
  // --------------------------
  if (isLoading) {
    return (
      <div className={styles.myMapsContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`${styles.myMapsContent} ${
            isCollapsed ? styles.contentCollapsed : ''
          }`}
        >
          <Header
            title="Your Maps"
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          {/* Skeleton Stats Bar */}
          <div className={styles.skeletonStatsBar}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={styles.skeletonStatBox} />
            ))}
          </div>

          {/* Skeleton Maps Grid */}
          <div className={styles.skeletonMapsGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={styles.skeletonMapCard}>
                <div className={styles.skeletonThumbnail} />
                <div
                  className={styles.skeletonLine}
                  style={{ width: '70%', marginBottom: '6px' }}
                />
                <div
                  className={styles.skeletonLine}
                  style={{ width: '40%', marginBottom: '6px' }}
                />
                <div
                  className={styles.skeletonLine}
                  style={{ width: '90%' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------
  // REAL CONTENT
  // --------------------------
  return (
    <div className={styles.myMapsContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`${styles.myMapsContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          title="Your Maps"
        />

        {/* Stats Bar */}
        <div className={styles.statsBar}>
          <div className={styles.statBox}>
            <FaMap className={styles.statIcon} />
            <div className={styles.statValue}>{totalMaps}</div>
            <div className={styles.statLabel}>Total Maps</div>
          </div>
          <div className={styles.statBox}>
            <FaGlobe className={styles.statIcon} />
            <div className={styles.statValue}>{publicMaps}</div>
            <div className={styles.statLabel}>Public</div>
          </div>
          <div className={styles.statBox}>
            <FaLock className={styles.statIcon} />
            <div className={styles.statValue}>{privateMaps}</div>
            <div className={styles.statLabel}>Private</div>
          </div>
          <div className={styles.statBox}>
            <FaStar className={styles.statIcon} style={{ color: '#000' }} />
            <div className={styles.statValue}>{totalStars}</div>
            <div className={styles.statLabel}>Stars</div>
          </div>
        </div>

        {maps.length > 0 ? (
          <div className={styles.mapsGrid}>
            {maps.map((map) => {
              const mapTitle = map.title || 'Untitled Map';
              return (
                <div
                  key={map.id}
                  className={styles.mapCard}
                  onClick={() => navigate(`/map/${map.id}`)}
                >
                  <div className={styles.thumbnail}>
                    {renderMapThumbnail(map)}
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.mapTitle}>{mapTitle}</h3>
                    <div className={styles.detailsRow}>
                      <span className={styles.modified}>
                        Modified{' '}
                        {formatDistanceToNow(new Date(map.updated_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <span className={styles.visibility}>
                        {map.is_public ? (
                          <>
                            <FaGlobe className={styles.visibilityIcon} /> Public
                          </>
                        ) : (
                          <>
                            <FaLock className={styles.visibilityIcon} /> Private
                          </>
                        )}
                      </span>
                    </div>
                    <div className={styles.statsRow}>
                      <div className={styles.starCount}>
                        <FaStar className={styles.starIcon} />{' '}
                        {map.save_count || 0}
                      </div>
                    </div>
                    <div className={styles.actionsRow}>
                      <button
                        className={styles.viewButton}
                        onClick={(e) => handleView(e, map.id)}
                      >
                        View
                      </button>
                      <button
                        className={styles.editButton}
                        onClick={(e) => handleEdit(e, map.id)}
                      >
                        Edit
                      </button>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => handleDelete(e, map.id)}
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
          <p>You have no maps.</p>
        )}

        {showDeleteModal && (
          <div className={styles.modalOverlay} onClick={cancelDelete}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Confirm Delete</h2>
              <p>
                Are you sure you want to delete the map titled{' '}
                <strong>{mapToDelete?.title || 'Untitled Map'}</strong>? This
                action cannot be undone.
              </p>
              <div className={styles.modalButtons}>
                <button
                  className={styles.deleteButtonModal}
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
          </div>
        )}
      </div>
    </div>
  );
}
