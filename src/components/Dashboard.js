// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const [ selectedMap, setSelectedMap ] = useState()
  const [ showMapModal, setShowMapModal ] = useState()

  useEffect(() => {
    // Retrieve maps from localStorage
    const savedMaps = JSON.parse(localStorage.getItem('maps')) || [];
    setMaps(savedMaps);
  }, []);

  const handleEdit = (mapId) => {
    // Navigate to the map editing page with the map ID
    navigate(`/edit/${mapId}`);
  };

  const handleDelete = (mapId) => {
    // Remove the map from localStorage
    const updatedMaps = maps.filter((map) => map.id !== mapId);
    setMaps(updatedMaps);
    localStorage.setItem('maps', JSON.stringify(updatedMaps));
  };

    // Function to handle map creation after selecting map type
    const handleCreateMap = () => {
        if (selectedMap) {
          // Navigate to DataIntegration component with the selected map
          navigate('/create', { state: { selectedMap } });
        } else {
          alert('Please select a map type.');
        }
      };

      return (
        <div className={styles.dashboard}>
          <h1>Your Dashboard</h1>
          <button onClick={() => setShowMapModal(true)}>Create Map</button>
          {/* Existing code for displaying maps */}
      
          {/* Map Selection Modal */}
          {showMapModal && (
            <div className={styles.modalOverlay} onClick={() => setShowMapModal(false)}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2>Select a Map</h2>
                <div className={styles.mapOptions}>
                  <div
                    className={`${styles.mapOption} ${
                      selectedMap === 'world' ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedMap('world')}
                  >
                    World Map
                  </div>
                  <div
                    className={`${styles.mapOption} ${
                      selectedMap === 'usa' ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedMap('usa')}
                  >
                    USA Map
                  </div>
                  <div
                    className={`${styles.mapOption} ${
                      selectedMap === 'europe' ? styles.selected : ''
                    }`}
                    onClick={() => setSelectedMap('europe')}
                  >
                    Europe Map
                  </div>
                </div>
                <button onClick={handleCreateMap}>Create</button>
                <button onClick={() => setShowMapModal(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      );
      
}
