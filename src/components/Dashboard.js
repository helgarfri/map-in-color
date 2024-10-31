// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchMaps, deleteMap } from '../api';
import Sidebar from './Sidebar';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import MapSelectionModal from './MapSelectionModal';
import { formatDistanceToNow } from 'date-fns';

export default function Dashboard({
  isAuthenticated,
  setIsAuthenticated,
  isCollapsed,
  setIsCollapsed,
}) {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mapToDelete, setMapToDelete] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => {
    // Fetch maps data
    const getMaps = async () => {
      try {
        const res = await fetchMaps();
        const sortedMaps = res.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setMaps(sortedMaps);
      } catch (err) {
        console.error(err);
      }
    };
    getMaps();
  }, []);

  // Get top 3 recently modified maps
  const recentMaps = maps.slice(0, 3);

  // Placeholder for favorite maps
  const favoriteMaps = []; // You can populate this with actual data later

  const handleEdit = (mapId) => {
    navigate(`/edit/${mapId}`);
  };

  const handleDelete = (mapId) => {
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

  const handleCreateMap = () => {
    setShowMapModal(true);
  };

  const handleMapSelection = (selectedMap) => {
    if (selectedMap) {
      setShowMapModal(false);
      navigate('/create', { state: { selectedMap } });
    } else {
      alert('Please select a map type.');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div
        className={`${styles.dashboardContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header Section */}
        <header className={styles.header}>
          <h1>Welcome Back, [User]!</h1>
          <div className={styles.quickActions}>
            <button className={styles.primaryButton} onClick={handleCreateMap}>
              Create New Map
            </button>
            <button className={styles.secondaryButton}>Import Data</button>
            {/* Add more quick action buttons as needed */}
          </div>

          {/* Statistics Panel */}
          <div className={styles.statisticsPanel}>
            <div className={styles.statistic}>
              <h3>Total Maps</h3>
              <p>{maps.length}</p>
            </div>
            {/* Add more statistics as needed */}
          </div>
        </header>

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
                    <div className={styles.mapCard} key={map.id}>
                      <div className={styles.thumbnail}>
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
                          />
                        )}
                      </div>
                      <div className={styles.cardOverlay}>
                        <h3>{mapTitle}</h3>
                        <p>
                          Modified{' '}
                          {map.updatedAt
                            ? formatDistanceToNow(new Date(map.updatedAt), {
                                addSuffix: true,
                              })
                            : 'Unknown time'}
                        </p>
                        <div className={styles.cardActions}>
                          <button
                            className={styles.editButton}
                            onClick={() => handleEdit(map.id)}
                          >
                            Edit
                          </button>
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDelete(map.id)}
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

          {/* Favorite Maps */}
          <section className={styles.favoriteMaps}>
            <h2>Favorite Maps</h2>
            {favoriteMaps.length > 0 ? (
              <div className={styles.cardsContainer}>
                {favoriteMaps.map((map) => {
                  const mapTitle = map.title || 'Untitled Map';
                  return (
                    <div className={styles.mapCard} key={map.id}>
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
                          />
                        )}
                      </div>
                      <div className={styles.cardOverlay}>
                        <h3>{mapTitle}</h3>
                        {/* Add more details if needed */}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p>You have no favorite maps.</p>
            )}
          </section>

          {/* Notifications and Recent Activity */}
          <div className={styles.bottomContent}>
            {/* Notifications */}
            <section className={styles.notifications}>
              <h2>Notifications</h2>
              <p>No new notifications.</p>
            </section>

            {/* Recent Activity */}
            <section className={styles.recentActivity}>
              <h2>Recent Activity</h2>
              <p>No recent activity.</p>
            </section>
          </div>
        </div>

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

      {/* Map Selection Modal */}
      {showMapModal && (
        <MapSelectionModal
          show={showMapModal}
          onClose={() => setShowMapModal(false)}
          onCreateMap={handleMapSelection}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modalOverlay} onClick={cancelDelete}>
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
            <button className={styles.deleteButton} onClick={confirmDelete}>
              Delete
            </button>
            <button className={styles.cancelButton} onClick={cancelDelete}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
