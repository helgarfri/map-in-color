import React, { useEffect, useState, useRef } from 'react';
import styles from './FullScreenMap.module.css';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';


export default function FullScreenMap({ mapData, toggleFullScreen }) {
    // State for the SVG's viewBox
    const [viewBox, setViewBox] = useState('0 0 2754 1398');
  
    // Refs for panning
    const isPanning = useRef(false);
    const lastMousePosition = useRef({ x: 0, y: 0 });
  
    useEffect(() => {
      // Disable scrolling on the background
      document.body.style.overflow = 'hidden';
      return () => {
        // Re-enable scrolling when component unmounts
        document.body.style.overflow = 'auto';
      };
    }, []);
  
    // Handle Mouse Wheel for Zooming
    const handleWheel = (e) => {
      e.preventDefault();
  
      // Adjust zoom sensitivity as needed
      const zoomSensitivity = 0.001;
      const scaleFactor = Math.exp(e.deltaY * zoomSensitivity);
  
      handleZoom(scaleFactor, e);
    };
  
    // Handle Zoom Function
    const handleZoom = (scaleFactor, event) => {
      let [x, y, width, height] = viewBox.split(' ').map(Number);
  
      const newWidth = width * scaleFactor;
      const newHeight = height * scaleFactor;
  
      // Limit zoom levels
      const minWidth = 500;
      const maxWidth = 10000;
      if (newWidth < minWidth || newWidth > maxWidth) return;
  
      // Zoom towards cursor position
      const rect = event.currentTarget.getBoundingClientRect();
      const svgX = event.clientX - rect.left;
      const svgY = event.clientY - rect.top;
  
      const zoomCenterX = x + (svgX / rect.width) * width;
      const zoomCenterY = y + (svgY / rect.height) * height;
  
      x = zoomCenterX - (zoomCenterX - x) * scaleFactor;
      y = zoomCenterY - (zoomCenterY - y) * scaleFactor;
  
      setViewBox(`${x} ${y} ${newWidth} ${newHeight}`);
    };
  
    // Handle Mouse Events for Panning
    const handleMouseDown = (e) => {
      isPanning.current = true;
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
      e.currentTarget.style.cursor = 'grabbing';
    };
  
    const handleMouseMove = (e) => {
      if (!isPanning.current) return;
  
      const dx = e.clientX - lastMousePosition.current.x;
      const dy = e.clientY - lastMousePosition.current.y;
  
      let [x, y, width, height] = viewBox.split(' ').map(Number);
  
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = width / rect.width;
      const scaleY = height / rect.height;
  
      x -= dx * scaleX;
      y -= dy * scaleY;
  
      setViewBox(`${x} ${y} ${width} ${height}`);
  
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };
  
    const handleMouseUp = (e) => {
      isPanning.current = false;
      e.currentTarget.style.cursor = 'grab';
    };
  
    const handleMouseLeave = (e) => {
      isPanning.current = false;
      e.currentTarget.style.cursor = 'grab';
    };
  
    return (
      <div
        className={styles.fullScreenOverlay}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        style={{ cursor: 'grab' }}
      >
        {/* Close Button */}
        <button className={styles.closeButton} onClick={toggleFullScreen}>
          &times;
        </button>
  
        {/* Map Rendering */}
        <div className={styles.mapContainer}>
          {mapData.selectedMap === 'world' && (
            <WorldMapSVG
            groups={mapData.groups}
            mapTitleValue={mapData.title}
            oceanColor={mapData.oceanColor}
            unassignedColor={mapData.unassignedColor}
            showTopHighValues={mapData.showTopHighValues}
            showTopLowValues={mapData.showTopLowValues}
            data={mapData.data}
            selectedMap={mapData.selectedMap}
            fontColor={mapData.fontColor}
            topHighValues={mapData.topHighValues}
            topLowValues={mapData.topLowValues}
            isLargeMap={true}
            viewBox={viewBox}
            isTitleHidden={mapData.isTitleHidden}
            />
          )}
          {mapData.selectedMap === 'usa' && (
            <UsSVG
            groups={mapData.groups}
            mapTitleValue={mapData.title}
            oceanColor={mapData.oceanColor}
            unassignedColor={mapData.unassignedColor}
            showTopHighValues={mapData.showTopHighValues}
            showTopLowValues={mapData.showTopLowValues}
            data={mapData.data}
            selectedMap={mapData.selectedMap}
            fontColor={mapData.fontColor}
            topHighValues={mapData.topHighValues}
            topLowValues={mapData.topLowValues}
            isLargeMap={true}
            viewBox={viewBox}
            isTitleHidden={mapData.isTitleHidden}
            />
          )}
          {mapData.selectedMap === 'europe' && (
            <EuropeSVG
            groups={mapData.groups}
            mapTitleValue={mapData.title}
            oceanColor={mapData.oceanColor}
            unassignedColor={mapData.unassignedColor}
            showTopHighValues={mapData.showTopHighValues}
            showTopLowValues={mapData.showTopLowValues}
            data={mapData.data}
            selectedMap={mapData.selectedMap}
            fontColor={mapData.fontColor}
            topHighValues={mapData.topHighValues}
            topLowValues={mapData.topLowValues}
            isLargeMap={true}
            viewBox={viewBox}
            isTitleHidden={mapData.isTitleHidden}
            />
          )}
        </div>
  
        {/* Zoom Controls */}
        <div
          className={styles.zoomControls}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onMouseMove={(e) => e.stopPropagation()}
          onMouseLeave={(e) => e.stopPropagation()}
        >
          <button onClick={(e) => handleZoom(0.9, e)}>+</button>
          <button onClick={(e) => handleZoom(1.1, e)}>-</button>
        </div>
      </div>
    );
  }
  