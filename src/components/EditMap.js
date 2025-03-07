// src/components/EditMap.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DataIntegration from './DataIntergration';
import { API } from '../api'; // Named import
import LoadingSpinner from './LoadingSpinner';


export default function EditMap({ 

  isCollapsed,
  setIsCollapsed
}) {
  const { mapId } = useParams();
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState(null); // Optional: track errors

  useEffect(() => {
    // Fetch map from the server
    const fetchMap = async () => {
      try {
        const res = await API.get(`/maps/${mapId}`);
        setMapData(res.data);
      } catch (err) {
        console.error('Error fetching map:', err);
        setError('Map not found or server error');
      }
    };

    fetchMap();
  }, [mapId]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!mapData) {
    return <LoadingSpinner/>;
  }

  return (
    <DataIntegration

      existingMapData={mapData}
      isEditing={true}
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
    />
  );
}
