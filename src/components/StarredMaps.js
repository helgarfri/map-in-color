// src/components/StarredMaps.js

import React, { useState, useEffect } from 'react';
import styles from './StarredMaps.module.css';
import { useNavigate } from 'react-router-dom';
import { fetchSavedMaps } from '../api'; // Assume this API call exists
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import { FaStar } from 'react-icons/fa'; // Import star icon
import Sidebar from './Sidebar';
import { formatDistanceToNow } from 'date-fns';

export default function StarredMaps({ isCollapsed, setIsCollapsed }) {
  const [maps, setMaps] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getStarredMaps = async () => {
      try {
        const res = await fetchSavedMaps(); // Fetch starred maps
        const sortedMaps = res.data.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        setMaps(sortedMaps);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    };
    getStarredMaps();
  }, []);

  return (
    <div className={styles.starredMapsContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.starredMapsContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Header with centered title and description */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1>Starred Maps</h1>
            <p>You have starred {maps.length} {maps.length === 1 ? 'map' : 'maps'}.</p>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading starred maps...</p>
        ) : error ? (
          <p>Error fetching starred maps. Please try again later.</p>
        ) : maps.length > 0 ? (
          <table className={styles.mapTable}>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Modified</th>
                <th>Stars</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              {maps.map((map) => {
                const mapTitle = map.title || 'Untitled Map';
                const creatorUsername = map.creator?.username || 'Unknown';
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
                    <td className={styles.starsCell}>
                      <div className={styles.starCount}>
                        <FaStar className={styles.starIcon} />
                        {map.saveCount || 0}
                      </div>
                    </td>
                    <td className={styles.createdByCell}>{map.User.username}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>You have no starred maps.</p>
        )}
      </div>
    </div>
  );
}
