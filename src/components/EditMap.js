// src/components/EditMap.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DataIntegration from './DataIntergration';

export default function EditMap({ isAuthenticated, setIsAuthenticated }) {
  const { mapId } = useParams();
  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    const maps = JSON.parse(localStorage.getItem('maps')) || [];
    const mapToEdit = maps.find((map) => map.id === parseInt(mapId));
    if (mapToEdit) {
      setMapData(mapToEdit);
    } else {
      // Handle map not found
      console.error('Map not found');
    }
  }, [mapId]);

  if (!mapData) {
    return <p>Loading...</p>;
  }

  return (
    <DataIntegration
      isAuthenticated={isAuthenticated}
      setIsAuthenticated={setIsAuthenticated}
      existingMapData={mapData}
      isEditing={true}
    />
  );
}
