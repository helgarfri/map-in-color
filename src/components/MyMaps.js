// src/components/MyMaps.js
import React, { useState, useEffect } from 'react';
import styles from './MyMaps.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchMaps, deleteMap } from '../api';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

import { formatDistanceToNow } from 'date-fns';
import Sidebar from './Sidebar';

export default function MyMaps({
  isAuthenticated,
  setIsAuthenticated,
  isCollapsed,
  setIsCollapsed,
}) {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

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

  return (
    <div className={styles.myMapsContainer}>
      {/* Sidebar */}
      <Sidebar
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Content */}
      <div
        className={`${styles.myMapsContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <h1>My Maps</h1>
        <p>You have {maps.length} saved maps.</p>
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
                      {map.selectedMap === 'usa' && (
                        <UsSVG
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
                      {map.selectedMap === 'europe' && (
                        <EuropeSVG
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
                    </div>
                  </td>
                  <td>{map.title}</td>
                  <td>
                    {formatDistanceToNow(new Date(map.updatedAt), {
                      addSuffix: true,
                    })}
                  </td>
                  <td className={styles.actions}>
                    <div className={styles.actionButtons}>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You have no saved maps.</p>
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
    </div>
  );
}
