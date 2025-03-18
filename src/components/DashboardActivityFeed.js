// src/components/DashboardActivityFeed.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

// We'll assume you have an API function for your dash activity
import { fetchNotifications, markNotificationAsRead } from '../api';

// Possibly some icons
import { FaStar } from 'react-icons/fa';

// (Optional) If you want to display map thumbnails:
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

// Import the new CSS you create
import dashFeedStyles from './DashboardActivityFeed.module.css';

export default function DashboardActivityFeed({ userProfile }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Optionally, fetch up to 6 notifications or something
  useEffect(() => {
    if (!userProfile) return;

    async function loadDashboardFeed() {
      try {
        setIsLoading(true);
        // Could fetch “notifications” or some custom “dashboard feed”
        const notifsRes = await fetchNotifications();
        // Sort by created_at desc, limit to 6
        const sorted = notifsRes.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 6);
        setNotifications(sorted);
      } catch (err) {
        console.error('Error fetching dashboard activity:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardFeed();
  }, [userProfile]);

  const handleItemClick = async (notif) => {
    // Mark as read
    try {
      await markNotificationAsRead(notif.id);
      // Then navigate if there's a map_id, etc.
      if (notif.map_id) {
        navigate(`/map/${notif.map_id}`);
      }
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  function renderMapThumbnail(mapObj) {
    if (!mapObj) {
      return <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
    }
    const {
      selected_map,
      title,
      groups,
      ocean_color,
      unassigned_color,
      data,
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
    if (selected_map === 'usa') return <UsSVG {...sharedProps} />;
    if (selected_map === 'europe') return <EuropeSVG {...sharedProps} />;
    return <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
  }

  function renderNotificationItem(notif, idx) {
    const { type, map_id, map_title, created_at, Map } = notif;
    // If we fetched a Map object or partial map
    const mapThumb = renderMapThumbnail(Map);

    // Basic text
    let mainText = `Notification: ${type} on ${map_title || 'Untitled'}`;

    // e.g. if (type === 'star') { mainText = 'some star text...' }

    return (
      <div
        key={notif.id || idx}
        className={dashFeedStyles.activityItem}
        onClick={() => handleItemClick(notif)}
      >
        <div className={dashFeedStyles.thumbContainer}>{mapThumb}</div>
        <div className={dashFeedStyles.activityDetails}>
          <p className={dashFeedStyles.mainText}>{mainText}</p>
          <span className={dashFeedStyles.timestamp}>{timeAgo(created_at)}</span>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading Dashboard Activity...</p>;
  }
  if (notifications.length === 0) {
    return <p>No recent activity.</p>;
  }

  return (
    <div className={dashFeedStyles.dashActivityFeed}>
      {notifications.map((notif, idx) => renderNotificationItem(notif, idx))}
    </div>
  );
}
