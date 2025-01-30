// src/context/MapSelectionContext.js

import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MapSelectionModal from '../components/MapSelectionModal';

export const MapSelectionContext = createContext();

export function MapSelectionProvider({ children }) {
  const [showMapModal, setShowMapModal] = useState(false);
  const navigate = useNavigate();

  const handleMapSelection = (selectedMap) => {
    if (selectedMap) {
      setShowMapModal(false);
      navigate('/create', { state: { selectedMap } });
    } else {
      alert('Please select a map type.');
    }
  };

  return (
    <MapSelectionContext.Provider value={{ showMapModal, setShowMapModal }}>
      {children}
      {showMapModal && (
        <MapSelectionModal
          show={showMapModal}
          onClose={() => setShowMapModal(false)}
          onCreateMap={handleMapSelection}
        />
      )}
    </MapSelectionContext.Provider>
  );
}
