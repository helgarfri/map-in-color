import React, { useEffect, useState, useRef } from 'react';
import styles from './FullScreenMap.module.css';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

export default function FullScreenMap({ mapData, toggleFullScreen }) {
  const [viewBox, setViewBox] = useState('0 0 2754 1398'); // Default for world map

  const isPanning = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Set the default viewBox based on the selected map once we have mapData
    if (mapData) {
      if (mapData.selected_map === 'usa') {
        setViewBox('-90 -10 1238 667'); // Default for US map
      } else if (mapData.selected_map === 'europe') {
        setViewBox('-215 0 1020 556')
      } else {
        // Default remains the world map viewBox
        setViewBox('0 0 2754 1398');
      }
    }
  }, [mapData]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSensitivity = 0.001;
    const scaleFactor = Math.exp(e.deltaY * zoomSensitivity);
    handleZoom(scaleFactor, e);
  };

  const handleZoom = (scaleFactor, event) => {
    let [x, y, width, height] = viewBox.split(' ').map(Number);
    const newWidth = width * scaleFactor;
    const newHeight = height * scaleFactor;

    const minWidth = 500;
    const maxWidth = 10000;
    if (newWidth < minWidth || newWidth > maxWidth) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const svgX = event.clientX - rect.left;
    const svgY = event.clientY - rect.top;

    const zoomCenterX = x + (svgX / rect.width) * width;
    const zoomCenterY = y + (svgY / rect.height) * height;

    x = zoomCenterX - (zoomCenterX - x) * scaleFactor;
    y = zoomCenterY - (zoomCenterY - y) * scaleFactor;

    setViewBox(`${x} ${y} ${newWidth} ${newHeight}`);
  };

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
      <button className={styles.closeButton} onClick={toggleFullScreen}>
        &times;
      </button>

      <div className={styles.mapContainer}>
        {mapData.selected_map === 'world' && (
          <WorldMapSVG
            groups={mapData.groups}
            mapTitleValue={mapData.title}
            ocean_color={mapData.ocean_color}
            unassigned_color={mapData.unassigned_color}
            show_top_high_values={mapData.show_top_high_values}
            show_top_low_values={mapData.show_top_low_values}
            data={mapData.data}
            selected_map={mapData.selected_map}
            font_color={mapData.font_color}
            top_low_values={mapData.top_low_values}
            isLargeMap={true}
            viewBox={viewBox}
            is_title_hidden={mapData.is_title_hidden}
          />
        )}
        {mapData.selected_map === 'usa' && (
          <UsSVG
            groups={mapData.groups}
            mapTitleValue={mapData.title}
            ocean_color={mapData.ocean_color}
            unassigned_color={mapData.unassigned_color}
            show_top_high_values={mapData.show_top_high_values}
            show_top_low_values={mapData.show_top_low_values}
            data={mapData.data}
            selected_map={mapData.selected_map}
            font_color={mapData.font_color}
            top_low_values={mapData.top_low_values}
            isLargeMap={true}
            viewBox={viewBox}
            is_title_hidden={mapData.is_title_hidden}
          />
        )}
        {mapData.selected_map === 'europe' && (
          <EuropeSVG
            groups={mapData.groups}
            mapTitleValue={mapData.title}
            ocean_color={mapData.ocean_color}
            unassigned_color={mapData.unassigned_color}
            show_top_high_values={mapData.show_top_high_values}
            show_top_low_values={mapData.show_top_low_values}
            data={mapData.data}
            selected_map={mapData.selected_map}
            font_color={mapData.font_color}
            top_low_values={mapData.top_low_values}
            isLargeMap={true}
            viewBox={viewBox}
            is_title_hidden={mapData.is_title_hidden}
          />
        )}
      </div>

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
