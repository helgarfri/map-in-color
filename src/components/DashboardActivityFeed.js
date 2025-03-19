// src/components/DashboardActivityFeed.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// 1) Import your new function for the dashboard feed:
import { fetchDashboardActivity, markNotificationAsRead } from '../api';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import dashFeedStyles from './DashboardActivityFeed.module.css';

export default function DashboardActivityFeed({ userProfile }) {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userProfile) return;

    async function loadDashboardFeed() {
      try {
        setIsLoading(true);
        
        // 2) Use fetchDashboardActivity() to get the merged feed:
        const res = await fetchDashboardActivity();
        
        // The server returns an array of "activity" objects: 
        // some are user-based ("createdMap", "starredMap", "commented"), 
        // some are notifications ("notification_star", etc.)
        setActivities(res.data);
      } catch (err) {
        console.error('Error fetching dashboard activity:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardFeed();
  }, [userProfile]);

  // Optional helper to show "X hours ago"
  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  // Render a small map thumbnail if an activity object has .map
  function renderMapThumbnail(mapObj) {
    if (!mapObj) {
      return <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
    }

    const {
      selected_map,
      title,
      groups = [],
      ocean_color,
      unassigned_color,
      data = [],
      font_color,
      is_title_hidden,
    } = mapObj;

    const sharedProps = {
      groups,
      mapTitleValue: title || 'Untitled',
      ocean_color,
      unassigned_color,
      data,
      font_color,
      is_title_hidden,
      isThumbnail: true,
    };

    if (selected_map === 'world') return <WorldMapSVG {...sharedProps} />;
    if (selected_map === 'usa')   return <UsSVG {...sharedProps} />;
    if (selected_map === 'europe')return <EuropeSVG {...sharedProps} />;
    return <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
  }

  // If this activity item is from "notifications", we mark it read
  async function handleItemClick(act) {
    if (act.notificationData) {
      try {
        await markNotificationAsRead(act.notificationData.id);
      } catch (err) {
        console.error('Error marking notification read:', err);
      }
    }
    // If there's a map => navigate to /map/:id
    if (act.map?.id) {
      navigate(`/map/${act.map.id}`);
    }
  }

  // Convert each activity object into display text & render
  function renderActivityItem(act, idx) {
    // "type" can be: 
    // 'createdMap', 'starredMap', 'commented'
    // 'notification_star', 'notification_reply', etc.
    const { type, map, commentContent, created_at } = act;
    const mapThumb = renderMapThumbnail(map);

    let mainText = '';
    if (type === 'createdMap') {
      mainText = `You created map "${map?.title || 'Untitled'}"`;
    } else if (type === 'starredMap') {
      mainText = `You starred map "${map?.title || 'Untitled'}"`;
    } else if (type === 'commented') {
      mainText = `You commented on "${map?.title || 'Untitled'}"`;
    } else if (type === 'notification_star') {
      mainText = `Someone starred your map "${map?.title || 'Untitled'}"`;
    } else if (type === 'notification_reply') {
      mainText = `Someone replied to your comment on "${map?.title || 'Untitled'}"`;
    } else {
      // fallback
      mainText = `Activity: ${type}`;
    }

    return (
      <div
        key={idx}
        className={dashFeedStyles.activityItem}
        onClick={() => handleItemClick(act)}
      >
        <div className={dashFeedStyles.thumbContainer}>{mapThumb}</div>
        <div className={dashFeedStyles.activityDetails}>
          <p className={dashFeedStyles.mainText}>{mainText}</p>

          {/* Show comment content if present */}
          {commentContent && (
            <div className={dashFeedStyles.commentText}>{commentContent}</div>
          )}

          <span className={dashFeedStyles.timestamp}>
            {timeAgo(created_at)}
          </span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading Dashboard Activity...</p>;
  }
  if (activities.length === 0) {
    return <p>No recent activity.</p>;
  }

  return (
    <div className={dashFeedStyles.dashActivityFeed}>
      {activities.map((act, i) => renderActivityItem(act, i))}
    </div>
  );
}
