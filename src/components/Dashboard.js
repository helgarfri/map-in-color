import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  fetchMaps,
  deleteMap,
  fetchNotifications,
  markNotificationAsRead,
  fetchSavedMaps
} from '../api';
import { differenceInDays, formatDistanceToNow } from 'date-fns';
import { UserContext } from '../context/UserContext';

// Icons
import {
  FaStar,
  FaMap,
  FaCalendarAlt,
  FaEdit
} from 'react-icons/fa';

import Sidebar from './Sidebar';
import Header from './Header';

// We keep your existing Activity Feed (which has its own skeleton logic)
import DashboardActivityFeed from './DashboardActivityFeed';

// Thumbnails
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize';

import styles from './Dashboard.module.css';


export default function Dashboard() {
  const navigate = useNavigate();
  const { profile } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(true);

  const [maps, setMaps] = useState([]);
  const [savedMaps, setSavedMaps] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // For deleting a map
  const [mapToDelete, setMapToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { width } = useWindowSize();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const showOverlay = !isCollapsed && width < 1000;

  // Basic Stats
  const totalMapsCreated = maps.length;
  const totalStarsReceived = maps.reduce(
    (sum, map) => sum + (map.save_count || 0),
    0
  );
  const profileAgeDays = profile?.created_at
    ? differenceInDays(new Date(), new Date(profile.created_at))
    : 0;

  useEffect(() => {
    // Auto-collapse sidebar if < 1000px wide
    if (width < 1000 && !isCollapsed) {
      setIsCollapsed(true);
    }
  }, [width, isCollapsed, setIsCollapsed]);

  // Fetch Data on Mount
  useEffect(() => {
    if (!profile) return;

    const getData = async () => {
      try {
        const [mapsRes, notificationsRes, savedMapsRes] = await Promise.all([
          fetchMaps(),
          fetchNotifications(),
          fetchSavedMaps()
        ]);

        // Sort maps by updated_at desc
        const sortedMaps = mapsRes.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setMaps(sortedMaps);

        // notifications sorted desc, only keep first few
        const sortedNotifications = notificationsRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6);
        setNotifications(sortedNotifications);

        // saved (starred) maps
        setSavedMaps(savedMapsRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [profile]);

  // Recently modified maps
  const recentMaps = maps.slice(0, 4);

  // Handlers
  const handleMapClick = (mapId) => {
    navigate(`/map/${mapId}`);
  };

  const handleEdit = (event, mapId) => {
    event.stopPropagation();
    navigate(`/edit/${mapId}`);
  };

  const handleDelete = (event, mapId) => {
    event.stopPropagation();
    const foundMap = maps.find((m) => m.id === mapId);
    setMapToDelete(foundMap);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!mapToDelete) return;
    try {
      await deleteMap(mapToDelete.id);
      setMaps((prev) => prev.filter((m) => m.id !== mapToDelete.id));
    } catch (err) {
      console.error('Error deleting map:', err);
    } finally {
      setShowDeleteModal(false);
      setMapToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMapToDelete(null);
  };

  const handleNotificationClick = async (notif) => {
    try {
      await markNotificationAsRead(notif.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
      );
      if (notif.map_id) {
        navigate(`/map/${notif.map_id}`);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // If we are still loading => SKELETON placeholders
  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {showOverlay && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setIsCollapsed(true)}
          />
        )}

        <div
          className={`${styles.dashboardContent} ${
            isCollapsed ? styles.contentCollapsed : ''
          }`}
        >
          {/* Header with skeleton fallback */}
          <Header
            title="Dashboard"
            notifications={[]} // no data yet
            onNotificationClick={() => {}}
            onMarkAllAsRead={() => {}}
            profile_picture={''}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />

          {/* Now the "skeleton" version of main layout */}
          <div className={styles.mainWrapper}>
            {/* LEFT/CENTER: stats + feed placeholders */}
            <div className={styles.centerColumn}>
              {/* Stats row skeleton */}
              <div className={styles.statsContainer}>
                <div className={styles.skeletonStatItem} />
                <div className={styles.skeletonStatItem} />
                <div className={styles.skeletonStatItem} />
              </div>

              {/* Activity feed skeleton – or let the feed handle it 
                  but here we can do a top title bar skeleton + rows */}
              <section className={styles.activityFeedSection}>
                <div className={styles.skeletonSectionTitle} />
                {/* If you want the same skeleton rows from the feed: */}
                <div className={styles.skeletonRow}>
                  <div className={styles.skeletonThumb} />
                  <div className={styles.skeletonTextBlock}>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                  </div>
                </div>
                <div className={styles.skeletonRow}>
                  <div className={styles.skeletonThumb} />
                  <div className={styles.skeletonTextBlock}>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                  </div>
                </div>
                <div className={styles.skeletonRow}>
                  <div className={styles.skeletonThumb} />
                  <div className={styles.skeletonTextBlock}>
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT side: recently modified + starred skeleton */}
            <div className={styles.sideColumn}>
              <div className={styles.sectionCard}>
                <div className={styles.skeletonSectionTitle} />
                <div className={styles.skeletonMapCard} />
                <div className={styles.skeletonMapCard} />
              </div>
              <div className={styles.sectionCard}>
                <div className={styles.skeletonSectionTitle} />
                <div className={styles.skeletonMapCard} />
                <div className={styles.skeletonMapCard} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } // end if (isLoading)

  // --------------------------------------------------
  // If *not* loading, render the REAL dashboard
  // --------------------------------------------------
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {showOverlay && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`${styles.dashboardContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header
          title="Dashboard"
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={() => {}}
          profile_picture={profile?.profile_picture}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />

        <div className={styles.mainWrapper}>
          {/* CENTER COLUMN: Stats + Activity Feed */}
          <div className={styles.centerColumn}>
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <FaMap className={styles.statIcon} />
                <span className={styles.statLabel}>Maps Created:</span>
                <span className={styles.statValue}>{totalMapsCreated}</span>
              </div>
              <div className={styles.statItem}>
                <FaStar className={styles.statIcon} />
                <span className={styles.statLabel}>Stars Received:</span>
                <span className={styles.statValue}>{totalStarsReceived}</span>
              </div>
              <div className={styles.statItem}>
                <FaCalendarAlt className={styles.statIcon} />
                <span className={styles.statLabel}>Profile Age:</span>
                <span className={styles.statValue}>{profileAgeDays} days</span>
              </div>
            </div>

            <section className={styles.activityFeedSection}>
              <DashboardActivityFeed userProfile={profile} />
            </section>
          </div>

          {/* RIGHT SIDE: Recently Modified + Starred Maps */}
          <div className={styles.sideColumn}>
            {/* Recently Modified */}
            <div className={styles.sectionCard}>
              <h2>Recently Modified Maps</h2>
              {recentMaps.length === 0 ? (
                <p>No maps found.</p>
              ) : (
                <div className={styles.mapCardsList}>
                  {recentMaps.map((map) => {
                    let Thumbnail = (
                      <div className={styles.defaultThumbnail}>No preview</div>
                    );
                    if (map.selected_map === 'world') {
                      Thumbnail = (
                        <WorldMapSVG
                          groups={map.groups}
                          mapTitleValue={map.title}
                          ocean_color={map.ocean_color}
                          unassigned_color={map.unassigned_color}
                          data={map.data}
                          font_color={map.font_color}
                          is_title_hidden={map.is_title_hidden}
                          isThumbnail
                          showNoDataLegend={map.show_no_data_legend}
                        />
                      );
                    } else if (map.selected_map === 'usa') {
                      Thumbnail = (
                        <UsSVG
                          groups={map.groups}
                          mapTitleValue={map.title}
                          ocean_color={map.ocean_color}
                          unassigned_color={map.unassigned_color}
                          data={map.data}
                          font_color={map.font_color}
                          is_title_hidden={map.is_title_hidden}
                          isThumbnail
                          showNoDataLegend={map.show_no_data_legend}

                          
                        />
                      );
                    } else if (map.selected_map === 'europe') {
                      Thumbnail = (
                        <EuropeSVG
                          groups={map.groups}
                          mapTitleValue={map.title}
                          ocean_color={map.ocean_color}
                          unassigned_color={map.unassigned_color}
                          data={map.data}
                          font_color={map.font_color}
                          is_title_hidden={map.is_title_hidden}
                          isThumbnail
                          showNoDataLegend={map.show_no_data_legend}

                        />
                      );
                    }

                    return (
                      <div
                        key={map.id}
                        className={styles.mapCard}
                        onClick={() => handleMapClick(map.id)}
                      >
                        <div className={styles.mapCardThumb}>{Thumbnail}</div>
                        <div className={styles.mapCardDetails}>
                          <h3 className={styles.mapCardTitle}>
                            {map.title || 'Untitled Map'}
                          </h3>
                          <p className={styles.mapCardTimestamp}>
                            Last modified{' '}
                            {map.updated_at
                              ? formatDistanceToNow(
                                  new Date(map.updated_at),
                                  { addSuffix: true }
                                )
                              : 'Unknown'}
                          </p>

                          <div className={styles.editContainer}>
                            <FaEdit
                              onClick={(e) => handleEdit(e, map.id)}
                              className={styles.editIcon}
                            />
                            <button
                              className={styles.editBtn}
                              onClick={(e) => handleEdit(e, map.id)}
                            >
                              Edit Map
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Starred Maps */}
            <div className={styles.sectionCard}>
              <h2>Starred Maps</h2>
              {savedMaps.length === 0 ? (
                <p>You haven't saved any maps yet.</p>
              ) : (
                <div className={styles.mapCardsList}>
                  {savedMaps.slice(0, 4).map((map) => {
                    const userObj = map.user;
                    const displayName = userObj?.username || 'Unknown';
                    const mapTitle = map.title || 'Untitled Map';

                    let Thumbnail = (
                      <div className={styles.defaultThumbnail}>No preview</div>
                    );
                    if (map.selected_map === 'world') {
                      Thumbnail = (
                        <WorldMapSVG
                          groups={map.groups}
                          mapTitleValue={mapTitle}
                          ocean_color={map.ocean_color}
                          unassigned_color={map.unassigned_color}
                          data={map.data}
                          font_color={map.font_color}
                          is_title_hidden={map.is_title_hidden}
                          isThumbnail
                          showNoDataLegend={map.show_no_data_legend}
                        />
                      );
                    } else if (map.selected_map === 'usa') {
                      Thumbnail = (
                        <UsSVG
                          groups={map.groups}
                          mapTitleValue={mapTitle}
                          ocean_color={map.ocean_color}
                          unassigned_color={map.unassigned_color}
                          data={map.data}
                          font_color={map.font_color}
                          is_title_hidden={map.is_title_hidden}
                          isThumbnail
                          showNoDataLegend={map.show_no_data_legend}

                        />
                      );
                    } else if (map.selected_map === 'europe') {
                      Thumbnail = (
                        <EuropeSVG
                          groups={map.groups}
                          mapTitleValue={mapTitle}
                          ocean_color={map.ocean_color}
                          unassigned_color={map.unassigned_color}
                          data={map.data}
                          font_color={map.font_color}
                          is_title_hidden={map.is_title_hidden}
                          isThumbnail
                          showNoDataLegend={map.show_no_data_legend}

                        />
                      );
                    }

                    return (
                      <div
                        key={map.id}
                        className={styles.mapCard}
                        onClick={() => navigate(`/map/${map.id}`)}
                      >
                        <div className={styles.mapCardThumb}>{Thumbnail}</div>
                        <div className={styles.mapCardDetails}>
                          <h3 className={styles.mapCardTitle}>{mapTitle}</h3>
                          <p className={styles.mapCardTimestamp}>
                            by {displayName}
                          </p>
                          <p className={styles.starCount}>
                            <FaStar /> {map.save_count || 0}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {savedMaps.length > 4 && (
                <button
                  className={styles.viewAllSavedBtn}
                  onClick={() => navigate('/starred-maps')}
                >
                  View All Starred Maps
                </button>
              )}
            </div>
          </div>
        </div>

        {/* DELETE MAP MODAL */}
        {showDeleteModal && (
          <div className={styles.modalOverlay} onClick={cancelDelete}>
            <div
              className={styles.modalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Confirm Deletion</h2>
              <p>
                Are you sure you want to delete "
                <strong>{mapToDelete?.title}</strong>"?
              </p>
              <div className={styles.modalButtons}>
                <button className={styles.confirmDelete} onClick={confirmDelete}>
                  Delete
                </button>
                <button className={styles.cancelDelete} onClick={cancelDelete}>
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
