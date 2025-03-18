// src/components/ProfileActivityFeed.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// 1) Make sure this function uses GET /api/activity/profile/:username
import { fetchUserActivity } from '../api';
import { FaStar } from 'react-icons/fa';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

import styles from './ProfileActivityFeed.module.css';

export default function ProfileActivityFeed({ username, profile_pictureUrl }) {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2) On mount, call fetchUserActivity(username)
  useEffect(() => {
    if (!username) return;

    async function loadActivity() {
      try {
        setIsLoading(true);

        // fetchUserActivity now calls: GET /api/activity/profile/:username
        const res = await fetchUserActivity(username, 0, 50);
        setActivities(res.data);

      } catch (err) {
        console.error('Error fetching user activity:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadActivity();
  }, [username]);

  // Helper to format "3 hours ago"
  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  // Renders a map thumbnail if activity.map is present
  function renderMapThumbnail(map, mapTitle) {
    if (!map) {
      return <div className={styles.defaultThumbnail}>Map</div>;
    }

    const sharedProps = {
      groups: map.groups || [],
      mapTitleValue: mapTitle || 'Untitled',
      ocean_color: map.ocean_color,
      unassigned_color: map.unassigned_color,
      data: map.data,
      font_color: map.font_color,
      is_title_hidden: map.is_title_hidden,
      isThumbnail: true,
    };

    if (map.selected_map === 'world') {
      return <WorldMapSVG {...sharedProps} />;
    } else if (map.selected_map === 'usa') {
      return <UsSVG {...sharedProps} />;
    } else if (map.selected_map === 'europe') {
      return <EuropeSVG {...sharedProps} />;
    }
    // fallback
    return <div className={styles.defaultThumbnail}>Map</div>;
  }

  // Clicking an activity => go to the map detail page
  function handleActivityItemClick(mapId) {
    if (mapId) navigate(`/map/${mapId}`);
  }

  // Render each activity row
  function renderActivityItem(activity, index) {
    const { type, map, commentContent, created_at } = activity;
    const mapTitle = map?.title || 'Untitled Map';
    const mapThumb = renderMapThumbnail(map, mapTitle);

    // main text & optional comment body
    let mainText = '';
    let body = null;

    if (type === 'createdMap') {
      mainText = `Created a map "${mapTitle}"`;
    } else if (type === 'starredMap') {
      mainText = `Starred "${mapTitle}"`;
      // You can also show the star overlay, as you do below:
    } else if (type === 'commented') {
      mainText = `Commented on "${mapTitle}"`;
      body = (
        <div className={styles.commentText}>
          {commentContent || '(no comment)'}
        </div>
      );
    } else {
      mainText = `Activity on "${mapTitle}"`;
    }

    return (
      <div
        key={index}
        className={styles.activityItem}
        onClick={() => handleActivityItemClick(map?.id)}
      >
        {/* Map thumbnail */}
        <div className={styles.thumbContainer}>
          {mapThumb}

          {/* If "starredMap", show the user’s avatar + star icon overlay */}
          {type === 'starredMap' && (
            <div className={styles.starOverlay}>
              <img
                className={styles.starAvatar}
                src={profile_pictureUrl || '/default-profile-picture.png'}
                alt="User"
              />
              <FaStar className={styles.starIcon} />
            </div>
          )}
        </div>

        {/* Activity details */}
        <div className={styles.activityDetails}>
          <p className={styles.mainText}>{mainText}</p>
          {body && <div>{body}</div>}

          <span className={styles.timestamp}>{timeAgo(created_at)}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading user activity...</p>;
  }
  if (!activities || activities.length === 0) {
    return <p>No activity yet.</p>;
  }

  return (
    <div className={styles.activityFeed}>
      {activities.map((act, idx) => renderActivityItem(act, idx))}
    </div>
  );
}
