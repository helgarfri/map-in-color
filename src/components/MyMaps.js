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
import { FaStar, FaPlus, FaLock, FaLockOpen, FaGlobe } from 'react-icons/fa'; // Import star icon

import MapSelectionModal from './MapSelectionModal';


export default function MyMaps({
  isCollapsed,
  setIsCollapsed,
}) {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const [showMapModal, setShowMapModal] = useState(false)

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

  const handleView = (event, mapId) => {
    event.stopPropagation();
    navigate(`/map/${mapId}`);
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
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.myMapsContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>My Maps</h1>
            <p>
              You own {maps.length} {maps.length === 1 ? 'map' : 'maps'}.
            </p>
          </div>
          <button className={styles.createMapButton} onClick={handleCreateMap}>
            <FaPlus className={styles.plusIcon} /> Create New Map
          </button>
        </div>
        {maps.length > 0 ? (
          <table className={styles.mapTable}>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Modified</th>
                <th>Visibility</th> {/* New Column */}
                <th>Stars</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {maps.map((map) => {
                const mapTitle = map.title || 'Untitled Map';
                return (
                  <tr key={map.id} className={styles.mapRow}>
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
                    <td className={styles.visibilityCell}>
                      {map.isPublic ? (
                        <FaGlobe className={styles.visibilityIcon} title="Public" />
                      ) : (
                        <FaLock className={styles.visibilityIcon} title="Private" />
                      )}
                    </td>
                    <td className={styles.starsCell}>
                      <div className={styles.starCount}>
                        <FaStar className={styles.starIcon} />
                        {map.saveCount || 0}
                      </div>
                    </td>
                    <td className={styles.actionsCell}>
                    <div className={styles.cardActions}>
                        <button
                          className={styles.viewButton}
                          onClick={(event) => handleView(event, map.id)}
                        >
                          View
                        </button>
                        <button
                          className={styles.editButton}
                          onClick={(event) => handleEdit(event, map.id)}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={(event) => handleDelete(event, map.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>You have no saved maps.</p>
        )}

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
    </div>
  );
}