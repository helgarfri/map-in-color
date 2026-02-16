// src/components/Dashboard.js
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  fetchMaps,
  deleteMap,
  fetchNotifications,
  markNotificationAsRead,
  fetchSavedMaps,
} from "../api";
import { differenceInDays, formatDistanceToNow } from "date-fns";
import { UserContext } from "../context/UserContext";
import { FaStar, FaMap, FaCalendarAlt, FaEdit } from "react-icons/fa";

import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardActivityFeed from "./DashboardActivityFeed";
import StaticMapThumbnail from "./StaticMapThumbnail";

import { SidebarContext } from "../context/SidebarContext";
import useWindowSize from "../hooks/useWindowSize";

import styles from "./Dashboard.module.css";

// Daily welcome messages (rotate at 6 AM local time each day)
const DAILY_WELCOME_MESSAGES = [
  "🌍 Here's what's mapping today.",
  "Let's color the world.",
  "Your maps are waiting.",
  "What will you visualize today?",
  "The world is blank. Ready to fill it?",
  "Let's turn data into geography.",
  "Time to map something meaningful.",
  "Your cartography lab is open.",
  "Ready to paint the planet?",
  "The globe is your canvas.",
  "Let's make the invisible visible.",
  "Another day, another map.",
  "Data deserves borders.",
  "What story will your map tell?",
  "Let's give your data a home.",
  "Your world-building tools are ready.",
  "Today's forecast: 100% chance of mapping.",
  "Build something worth exploring.",
  "Ready to shape the world?",
  "Make every country count.",
  "Let's put things on the map.",
  "Start mapping your next insight.",
  "The atlas awaits.",
  "Let's chart new territory.",
  "Your dashboard. Your world.",
  "Where will your data take us?",
  "Time to zoom in on something great.",
  "The map is yours.",
  "Create something worth clicking.",
  "Let's map what matters.",
];

/** Returns the message index for "today" using a 6 AM daily boundary (local time). */
function getDailyMessageIndex() {
  const now = new Date();
  const hour = now.getHours();
  const date = new Date(now);
  // Before 6 AM counts as previous calendar day for message selection
  if (hour < 6) date.setDate(date.getDate() - 1);
  const dayKey = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const dayIndex = Math.floor(dayKey / (24 * 60 * 60 * 1000));
  return dayIndex % DAILY_WELCOME_MESSAGES.length;
}

function getDailyWelcomeMessage() {
  return DAILY_WELCOME_MESSAGES[getDailyMessageIndex()];
}

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

  // Overlay only matters on small screens
  const isMobile = width < 1000;
  const showOverlay = isMobile && !isCollapsed;

  // ✅ IMPORTANT: remove this effect entirely
  // It was overwriting your global state on every route change.
  // useEffect(() => {
  //   if (width < 1000) setIsCollapsed(true);
  //   else setIsCollapsed(false);
  // }, [width, setIsCollapsed]);

  // Basic Stats
  const totalMapsCreated = maps.length;
  const totalStarsReceived = maps.reduce((sum, map) => sum + (map.save_count || 0), 0);
  const profileAgeDays = profile?.created_at
    ? differenceInDays(new Date(), new Date(profile.created_at))
    : 0;

  // Fetch Data on Mount
  useEffect(() => {
    if (!profile) return;

    const getData = async () => {
      try {
        const [mapsRes, notificationsRes, savedMapsRes] = await Promise.all([
          fetchMaps(),
          fetchNotifications(),
          fetchSavedMaps(),
        ]);

        // Sort maps by updated_at desc
        const sortedMaps = (mapsRes.data || []).sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setMaps(sortedMaps);

        // Notifications sorted desc, only keep first few
        const sortedNotifications = (notificationsRes.data || [])
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6);
        setNotifications(sortedNotifications);

        // Saved (starred) maps
        setSavedMaps(savedMapsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    getData();
  }, [profile]);

  // Recently modified maps
  const recentMaps = maps.slice(0, 2);
  const recentStarred = savedMaps.slice(0, 3);

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
      console.error("Error deleting map:", err);
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
      if (notif.map_id) navigate(`/map/${notif.map_id}`);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // -----------------------
  // SKELETON
  // -----------------------
  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        {/* ✅ Sidebar reads collapse state from context internally now */}
        <Sidebar />

        {showOverlay && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setIsCollapsed(true)}
          />
        )}

        <div
          className={`${styles.dashboardContent} ${
            isCollapsed ? styles.contentCollapsed : ""
          }`}
        >
          {/* ✅ Header reads collapse state from context internally now */}
          <Header title="Dashboard" />

          <div className={styles.mainWrapper}>
            <div className={styles.centerColumn}>
              <div className={styles.topRow}>
                <div className={styles.welcomeBlock}>
                  <div className={styles.welcomeLeft}>
                    <div className={styles.skeletonWelcomeKicker} />
                    <div className={styles.skeletonWelcomeName} />
                    <div className={styles.skeletonWelcomeSub} />
                  </div>

                  <div className={styles.welcomeStats}>
                    <div className={styles.skeletonChip} />
                    <div className={styles.skeletonChip} />
                    <div className={styles.skeletonChip} />
                  </div>
                </div>
              </div>

              <section className={styles.activityFeedSection}>
                <div className={styles.skeletonSectionTitle} />

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
  }

  // -----------------------
  // REAL DASHBOARD
  // -----------------------
  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />

      {showOverlay && (
        <div
          className={styles.sidebarOverlay}
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <div
        className={`${styles.dashboardContent} ${
          isCollapsed ? styles.contentCollapsed : ""
        }`}
      >
        <Header title="Dashboard" />

        <div className={styles.mainWrapper}>
          {/* CENTER COLUMN */}
          <div className={styles.centerColumn}>
            <div className={styles.topRow}>
              <div className={styles.welcomeBlock}>
                <div className={styles.welcomeLeft}>
                  <div className={styles.welcomeKicker}>
                    {profileAgeDays <= 2 ? "Welcome to Map in Color" : "Welcome back"}
                  </div>

                  <div className={styles.welcomeName}>
                    {profile?.first_name || profile?.username || "there"} 👋
                  </div>

                  <div className={styles.welcomeSub}>
                    {profileAgeDays <= 2
                      ? "Create your first map and make it yours."
                      : getDailyWelcomeMessage()}
                  </div>
                </div>

                <div className={styles.welcomeStats}>
                  <div className={styles.statChip}>
                    <div className={styles.chipTop}>
                      <FaMap className={styles.chipIcon} />
                      <div className={styles.chipNum}>{totalMapsCreated}</div>
                    </div>
                    <div className={styles.chipLabel}>Maps</div>
                  </div>

                  <div className={styles.statChip}>
                    <div className={styles.chipTop}>
                      <FaStar className={styles.chipIcon} />
                      <div className={styles.chipNum}>{totalStarsReceived}</div>
                    </div>
                    <div className={styles.chipLabel}>Stars</div>
                  </div>

                  <div className={styles.statChip}>
                    <div className={styles.chipTop}>
                      <FaCalendarAlt className={styles.chipIcon} />
                      <div className={styles.chipNum}>{profileAgeDays}</div>
                    </div>
                    <div className={styles.chipLabel}>Days</div>
                  </div>
                </div>
              </div>
            </div>

            <section className={styles.sectionCard}>
              <div className={styles.cardHeaderRow}>
                <h2 className={styles.cardTitle}>
                  <FaCalendarAlt className={styles.cardTitleIcon} />
                  Activity
                </h2>
              </div>

              <div className={styles.activityScroll}>
                <DashboardActivityFeed userProfile={profile} />
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN (sticky) */}
          <div className={styles.sideColumn}>
            <div className={styles.sideScroll}>
              {/* Recently Modified */}
              <div className={styles.sectionCard}>
                <div className={styles.cardHeaderRow}>
                  <h2 className={styles.cardTitle}>
                    <FaMap className={styles.cardTitleIcon} />
                    Recently Modified
                  </h2>

                  <button
                    className={styles.seeAllLink}
                    onClick={() => navigate("/your-maps")}
                    type="button"
                  >
                    See all
                  </button>
                </div>

                {recentMaps.length === 0 ? (
                  <p className={styles.emptyText}>No maps yet.</p>
                ) : (
                  <div className={styles.mapCardsList}>
                    {recentMaps.map((map) => (
                      <div
                        key={map.id}
                        className={styles.mapCard}
                        onClick={() => handleMapClick(map.id)}
                      >
                        <div className={styles.mapCardThumb}>
                          <StaticMapThumbnail map={map} background="#dddddd" />
                        </div>

                        <div className={styles.mapCardDetails}>
                          <h3 className={styles.mapCardTitle}>
                            {map.title || "Untitled Map"}
                          </h3>

                          <p className={styles.mapCardTimestamp}>
                            {map.updated_at
                              ? `Modified ${formatDistanceToNow(new Date(map.updated_at), {
                                  addSuffix: true,
                                })}`
                              : "Modified unknown"}
                          </p>

                          <div className={styles.mapCardMetaRow}>
                            <span className={styles.metaPill}>
                              <FaStar className={styles.metaIcon} />
                              {map.save_count || 0}
                            </span>

                            <button
                              className={styles.quickAction}
                              onClick={(e) => handleEdit(e, map.id)}
                              type="button"
                            >
                              <FaEdit />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  className={styles.primaryMiniBtn}
                  onClick={() => navigate("/your-maps")}
                  type="button"
                >
                  See all your maps
                </button>
              </div>

              {/* Starred Maps */}
              <div className={styles.sectionCard}>
                <div className={styles.cardHeaderRow}>
                  <h2 className={styles.cardTitle}>
                    <FaStar className={styles.cardTitleIcon} />
                    Starred
                  </h2>

                  <button
                    className={styles.seeAllLink}
                    onClick={() => navigate("/starred-maps")}
                    type="button"
                  >
                    See all
                  </button>
                </div>

                {savedMaps.length === 0 ? (
                  <p className={styles.emptyText}>No starred maps yet.</p>
                ) : (
                  <div className={styles.mapCardsList}>
                    {recentStarred.map((map) => {
                      const userObj = map.user;
                      const displayName = userObj?.username || "Unknown";

                      return (
                        <div
                          key={map.id}
                          className={styles.mapCard}
                          onClick={() => navigate(`/map/${map.id}`)}
                        >
                          <div className={styles.mapCardThumb}>
                            <StaticMapThumbnail map={map} background="#dddddd" />
                          </div>

                          <div className={styles.mapCardDetails}>
                            <h3 className={styles.mapCardTitle}>
                              {map.title || "Untitled Map"}
                            </h3>

                            <p className={styles.mapCardTimestamp}>by {displayName}</p>

                            <div className={styles.mapCardMetaRow}>
                              <span className={styles.metaPill}>
                                <FaStar className={styles.metaIcon} />
                                {map.save_count || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  className={styles.primaryMiniBtn}
                  onClick={() => navigate("/starred-maps")}
                  type="button"
                >
                  See all your starred maps
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DELETE MAP MODAL */}
        {showDeleteModal && (
          <div className={styles.modalOverlay} onClick={cancelDelete}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>Confirm Deletion</h2>
              <p>
                Are you sure you want to delete "<strong>{mapToDelete?.title}</strong>"?
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
