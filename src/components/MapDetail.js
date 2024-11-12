import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import styles from './MapDetail.module.css';
import { formatDistanceToNow } from 'date-fns';
import {
  fetchMapById,
  saveMap,
  unsaveMap,
  fetchComments,
  postComment,
} from '../api';
// Import a mapping from country codes to country names
import countries from '../countries.json';

export default function MapDetail({ isAuthenticated, isCollapsed, setIsCollapsed }) {
  const { id } = useParams();
  const [mapData, setMapData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();

  // State for the SVG's viewBox
  const [viewBox, setViewBox] = useState('0 0 2754 1398'); // Use the initial viewBox dimensions of your SVG

  // Refs for panning
  const isPanning = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const getMapData = async () => {
      try {
        const res = await fetchMapById(id);
        console.log('Fetched Map Data:', res.data); // Add this line
        setMapData(res.data);
        setSaveCount(res.data.saveCount || 0);
        setIsSaved(res.data.isSavedByCurrentUser || false);
      } catch (err) {
        console.error(err);
      }
    };
    getMapData();
  }, [id]);
  

  useEffect(() => {
    // Fetch comments for the map
    const getComments = async () => {
      try {
        const res = await fetchComments(id);
        setComments(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    getComments();
  }, [id]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      // Redirect to login or show a message
      navigate('/login');
      return;
    }

    try {
      if (isSaved) {
        await unsaveMap(id);
        setIsSaved(false);
        setSaveCount(saveCount - 1);
      } else {
        await saveMap(id);
        setIsSaved(true);
        setSaveCount(saveCount + 1);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await postComment(id, { content: newComment });
      // Assuming res.data includes the new comment with User and createdAt
      setComments([...comments, res.data]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  // Zoom In and Zoom Out handler
  const handleZoom = (scaleFactor) => {
    let [x, y, width, height] = viewBox.split(' ').map(Number);

    // Calculate new width and height
    const newWidth = width / scaleFactor;
    const newHeight = height / scaleFactor;

    // Limit zoom levels
    const minWidth = 500; // Minimum zoom-in level
    const maxWidth = 5000; // Maximum zoom-out level
    if (newWidth < minWidth || newWidth > maxWidth) return;

    // Calculate new x and y to keep the zoom centered
    const dx = (width - newWidth) / 2;
    const dy = (height - newHeight) / 2;
    x += dx;
    y += dy;

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

    // Calculate the scale factors
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    // Update x and y based on the mouse movement
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



  if (!mapData) {
    return <div>Loading...</div>;
  }

  // Compute relative time ago
  const timeAgo = formatDistanceToNow(new Date(mapData.createdAt), { addSuffix: true });

  const countryCodeToName = countries.reduce((acc, country) => {
    acc[country.code] = country.name;
    return acc;
  }, {});
  

// Compute statistics
const entries = (mapData.data || [])
  .map(({ code, name, value }) => ({
    countryCode: code,
    countryName: name || countryCodeToName[code] || code,
    value: Number(value),
  }))
  .filter((entry) => !isNaN(entry.value));



  const valuesArray = entries.map((entry) => entry.value);

  const maxEntry = entries.reduce(
    (prev, current) => (current.value > prev.value ? current : prev),
    entries[0] || { countryName: 'N/A', value: 'N/A' }
  );
  const minEntry = entries.reduce(
    (prev, current) => (current.value < prev.value ? current : prev),
    entries[0] || { countryName: 'N/A', value: 'N/A' }
  );
  const avgValue =
    valuesArray.length > 0
      ? valuesArray.reduce((sum, val) => sum + val, 0) / valuesArray.length
      : 0;

  entries.sort((a, b) => b.value - a.value); // Sort descending
  return (
    <div className={styles.mapDetailContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`${styles.mapDetailContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* Map Display */}
        <div
          className={styles.mapDisplay}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'grab', position: 'relative' }}
        >
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
            />
          )}

          {/* Zoom Controls */}
          <div
            className={styles.zoomControls}
            onMouseDown={(e) => e.stopPropagation()}
            onMouseUp={(e) => e.stopPropagation()}
            onMouseMove={(e) => e.stopPropagation()}
            onMouseLeave={(e) => e.stopPropagation()}
          >
            <button onClick={() => handleZoom(1.2)}>+</button>
            <button onClick={() => handleZoom(0.8)}>-</button>
          </div>
        </div>

  {/* Map Details and Statistics */}
  <div className={styles.detailsAndStats}>
          {/* Left Half: Map Details */}
          <div className={styles.mapDetails}>
            <div className={styles.titleSection}>
              <h1>{mapData.title || 'Untitled Map'}</h1>
              <button className={styles.saveButton} onClick={handleSave}>
                {isSaved ? '★' : '☆'} {saveCount}
              </button>
            </div>
            <p className={styles.creatorInfo}>
              Made by {mapData.User ? mapData.User.username : 'Unknown'} {timeAgo}
            </p>
            <p className={styles.description}>{mapData.description}</p>
            {/* Tags */}
            <div className={styles.tags}>
              {mapData.tags &&
                mapData.tags.map((tag, index) => (
                  <span key={index} className={styles.tag}>
                    {tag}
                  </span>
                ))}
            </div>
            {/* Sources */}
            {mapData.sources && mapData.sources.length > 0 && (
              <div className={styles.sources}>
                <h3>Sources</h3>
                <ul>
                  {mapData.sources.map((source, index) => (
                    <li key={index}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.name || source.url}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              
            )}
                    {/* Discussion Section */}
        <div className={styles.discussionSection}>
          <h2>Discussion</h2>
          {comments.length > 0 ? (
            <ul className={styles.commentsList}>
              {comments.map((comment, index) => (
                <li key={index} className={styles.commentItem}>
                  <p className={styles.commentAuthor}>
                    {comment.User ? comment.User.username : 'Anonymous'}{' '}
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className={styles.commentContent}>{comment.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No comments yet.</p>
          )}

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              required
            ></textarea>
            <button type="submit">Post Comment</button>
          </form>
        </div>
          </div>
         {/* Right Side: Statistics */}
         <div className={styles.mapStats}>
            <h2>Statistics</h2>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{maxEntry.value}</span>
              <span className={styles.statLabel}>Highest Value</span>
              <p>{maxEntry.countryName}</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{minEntry.value}</span>
              <span className={styles.statLabel}>Lowest Value</span>
              <p>{minEntry.countryName}</p>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statValue}>{avgValue.toFixed(2)}</span>
              <span className={styles.statLabel}>Average Value</span>
            </div>
            {/* Country List Table */}
            <div className={styles.countryList}>
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Country</th>
                    <th>Value</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{entry.countryName}</td>
                      <td>{entry.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
