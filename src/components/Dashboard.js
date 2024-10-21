// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate, Link } from 'react-router-dom';
import { fetchMaps, deleteMap } from '../api';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

import { formatDistanceToNow } from 'date-fns'; // Importing date-fns function
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Dashboard({
  isAuthenticated,
  setIsAuthenticated
}) {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const [selectedMap, setSelectedMap] = useState();
  const [showMapModal, setShowMapModal] = useState(false);

  // New state variables for delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mapToDelete, setMapToDelete] = useState(null);

  useEffect(() => {
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

  const handleEdit = (mapId) => {
    navigate(`/edit/${mapId}`);
  };

  // Updated handleDelete function
  const handleDelete = (mapId) => {
    const map = maps.find((m) => m.id === mapId);
    setMapToDelete(map);
    setShowDeleteModal(true);
  };

  // Confirm delete function
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

  // Cancel delete function
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMapToDelete(null);
  };

  const handleCreateMap = () => {
    if (selectedMap) {
      navigate('/create', { state: { selectedMap } });
    } else {
      alert('Please select a map type.');
    }
  };

  return (
    <div className={styles.dashboardContainer}>
     <Sidebar
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
     />
      {/* Main Content */}
      <div className={styles.dashboardContent}>
        <h1>Dashboard</h1>
        <button className={styles.viewButton} onClick={() => setShowMapModal(true)}>Start a new map</button>

        <h2>Your library:</h2>
        {maps.length > 0 ? (
          <table className={styles.mapTable}>
            <thead>
              <tr>
                <th>Map</th>
                <th>Title</th>
                <th>Date Modified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {maps.map((map) => (
                <tr key={map.id}>
                  <td>
                    <div className={styles.thumbnail}>
                      {map.selectedMap === 'world' && (
                        <WorldMapSVG
                          groups={map.groups}
                          mapTitleValue={map.title}
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
                      {map.selectedMap === 'usa' && <UsSVG />}
                      {map.selectedMap === 'europe' && <EuropeSVG />}
                    </div>
                  </td>
                  <td>{map.title}</td>
                  <td>{formatDistanceToNow(new Date(map.updatedAt), { addSuffix: true })}</td>
                  <td className={styles.actions}>
                    <div className={styles.actionButtons}>
                      <button className={styles.editButton} onClick={() => handleEdit(map.id)}>Edit</button>
                      <button className={styles.deleteButton} onClick={() => handleDelete(map.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You have no saved maps.</p>
        )}

        {showMapModal && (
          <div className={styles.modalOverlay} onClick={() => setShowMapModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <h2>Select a Map</h2>
              <div className={styles.mapOptions}>
                <div
                  className={`${styles.mapOption} ${selectedMap === 'world' ? styles.selected : ''}`}
                  onClick={() => setSelectedMap('world')}
                >
                  World Map
                </div>
                <div
                  className={`${styles.mapOption} ${selectedMap === 'usa' ? styles.selected : ''}`}
                  onClick={() => setSelectedMap('usa')}
                >
                  USA Map
                </div>
                <div
                  className={`${styles.mapOption} ${selectedMap === 'europe' ? styles.selected : ''}`}
                  onClick={() => setSelectedMap('europe')}
                >
                  Europe Map
                </div>
              </div>
              <button className={styles.viewButton} onClick={handleCreateMap}>Create</button>
              <button className={styles.deleteButton} onClick={() => setShowMapModal(false)}>Cancel</button>
            </div>
          </div>
        )}

      </div>
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
                <strong>{mapToDelete?.title}</strong>"? This action cannot be
                undone.
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
