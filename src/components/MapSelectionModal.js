// MapSelectionModal.js

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './MapSelectionModal.module.css';

// Your map components
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

function MapSelectionModal({ show, onClose, onCreateMap }) {
  const [selectedMap, setSelectedMap] = useState(null);

  if (!show) return null;

  const handleCreateMap = () => {
    if (selectedMap) {
      onCreateMap(selectedMap);
    } else {
      alert('Please select a map type.');
    }
  };

  // Some minimal default preview props
  const previewProps = {
    // Minimal or “default” values, just so something appears:
    ocean_color: '#ffffff',
    unassigned_color: '#c0c0c0',
    data: [],            // If your SVG needs data
    selected_map: null,  // This might or might not be used
    isLargeMap: false,
    is_title_hidden: true,
    show_top_high_values: false,
    show_top_low_values: false,
    topHighValues: [],
    top_low_values: [],
    showNoDataLegend: false,
    font_color: '#000',  // or whatever color
    mapTitleValue: '',
    groups: []           // or some minimal default
  };

  // Return a “preview” version of each map, with any props it needs
  const getMapPreview = (mapType) => {
    switch (mapType) {
      case 'world':
        return (
          <WorldMapSVG
            {...previewProps}
            // If you want to note which map is selected:
            selected_map="world"
          />
        );
      case 'usa':
        return (
          <UsSVG
            {...previewProps}
            selected_map="usa"
          />
        );
      case 'europe':
        return (
          <EuropeSVG
            {...previewProps}
            selected_map="europe"
          />
        );
      default:
        return null;
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>Select a Map</h2>

        <div className={styles.mapOptions}>
          {/* WORLD */}
          <div
            className={`${styles.mapOption} ${
              selectedMap === 'world' ? styles.selected : ''
            }`}
            onClick={() => setSelectedMap('world')}
          >
            <div className={styles.mapPreview}>
              {getMapPreview('world')}
            </div>
            <div className={styles.mapOverlay}>
              <span className={styles.mapLabel}>World</span>
            </div>
          </div>

          {/* UNITED STATES */}
          <div
            className={`${styles.mapOption} ${
              selectedMap === 'usa' ? styles.selected : ''
            }`}
            onClick={() => setSelectedMap('usa')}
          >
            <div className={styles.mapPreview}>
              {getMapPreview('usa')}
            </div>
            <div className={styles.mapOverlay}>
              <span className={styles.mapLabel}>United States</span>
            </div>
          </div>

          {/* EUROPE */}
          <div
            className={`${styles.mapOption} ${
              selectedMap === 'europe' ? styles.selected : ''
            }`}
            onClick={() => setSelectedMap('europe')}
          >
            <div className={styles.mapPreview}>
              {getMapPreview('europe')}
            </div>
            <div className={styles.mapOverlay}>
              <span className={styles.mapLabel}>Europe</span>
            </div>
          </div>
        </div>

        <button className={styles.viewButton} onClick={handleCreateMap}>
          Create
        </button>
        <button className={styles.cancelButton} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}

export default MapSelectionModal;
