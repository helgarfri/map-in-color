// src/components/EditMap.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DataIntegration from "./DataIntergration";
import { API } from "../api";

export default function EditMap({ isCollapsed, setIsCollapsed }) {
  const { mapId } = useParams();
  const [mapData, setMapData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await API.get(`/maps/${mapId}`);
        setMapData(res.data);
      } catch (err) {
        console.error("Error fetching map:", err);
        setError("Map not found or server error");
      }
    };

    fetchMap();
  }, [mapId]);

  useEffect(() => {
    if (mapData?.title != null) {
      const name = (mapData.title || "").trim() || "Map";
      document.title = `Edit ${name}`;
    }
  }, [mapData?.title]);

  if (error) return <p>{error}</p>;

  // ✅ Always render DataIntegration; let it show skeleton while loading
  return (
    <DataIntegration
      existingMapData={mapData}
      isEditing={true}
      externalLoading={!mapData}   // ✅ key line
      isCollapsed={isCollapsed}
      setIsCollapsed={setIsCollapsed}
    />
  );
}
