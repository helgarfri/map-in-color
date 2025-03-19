import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from './LoadingSpinner';

import {
  FaStar,
  FaPlus,
  FaComment,
  FaReply,
  FaThumbsUp,
  FaInfoCircle,
} from 'react-icons/fa';

import {
  fetchDashboardActivity,
  markNotificationAsRead
} from '../api';

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
        const res = await fetchDashboardActivity();
        setActivities(res.data);
      } catch (err) {
        console.error('Error fetching dashboard activity:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardFeed();
  }, [userProfile]);

  // Format "X hours ago"
  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  // Decide which user’s avatar to show
  function getAvatarUrl(act) {
    if (act.type.startsWith('notification_') && act.notificationData?.sender) {
      return act.notificationData.sender.profile_picture || '/default-profile-picture.png';
    }
    return userProfile?.profile_picture || '/default-profile-picture.png';
  }

  // Determine which username to link to
  function getAvatarUsername(act) {
    if (act.type.startsWith('notification_') && act.notificationData?.sender) {
      return act.notificationData.sender.username || 'unknown';
    }
    return userProfile?.username || 'unknown';
  }

  // Pick the correct icon
  function getActivityIcon(type) {
    switch (type) {
      case 'createdMap':
        return <FaPlus />;
      case 'starredMap':
      case 'notification_star':
        return <FaStar />;
      case 'commented':
      case 'notification_comment':
        return <FaComment />;
      case 'notification_reply':
        return <FaReply />;
      case 'notification_like':
        return <FaThumbsUp />;
      default:
        return <FaInfoCircle />;
    }
  }

  // Renders a map thumbnail with overlay for avatar + icon
  function renderMapThumbnail(mapObj, act) {
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

    let MapComponent = <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
    if (selected_map === 'world')   MapComponent = <WorldMapSVG {...sharedProps} />;
    if (selected_map === 'usa')     MapComponent = <UsSVG {...sharedProps} />;
    if (selected_map === 'europe')  MapComponent = <EuropeSVG {...sharedProps} />;

    const avatarUrl = getAvatarUrl(act);
    const avatarUsername = getAvatarUsername(act);
    const icon = getActivityIcon(act.type);

    return (
      <div className={dashFeedStyles.thumbContainer}>
        {MapComponent}
        {/* Bottom-right overlay (avatar + icon), clickable => user profile */}
        <div
          className={dashFeedStyles.activityOverlay}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${avatarUsername}`);
          }}
        >
          <img
            className={dashFeedStyles.activityAvatar}
            src={avatarUrl}
            alt="User"
          />
          <div className={dashFeedStyles.activityIcon}>{icon}</div>
        </div>
      </div>
    );
  }

  // If it's a notification, mark read on click; if there's a map, go to /map/:id
  async function handleItemClick(act) {
    if (act.notificationData) {
      try {
        await markNotificationAsRead(act.notificationData.id);
      } catch (err) {
        console.error('Error marking notification read:', err);
      }
    }
    if (act.map?.id) {
      navigate(`/map/${act.map.id}`);
    }
  }

  // Renders the clickable name for "sender"
  function renderSenderName(act) {
    // For the user's own activity => "You"
    if (!act.type.startsWith('notification_')) {
      return <strong>You</strong>;
    }

    // Otherwise => external user’s name/username
    const sender = act.notificationData?.sender;
    if (!sender) {
      return <strong>Someone</strong>;
    }

    let displayName = 'Someone';
    if (sender.first_name || sender.last_name) {
      displayName = `${sender.first_name || ''} ${sender.last_name || ''}`.trim();
    } else if (sender.username) {
      displayName = sender.username;
    }

    return (
      <strong
        className={dashFeedStyles.senderName}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${sender.username}`);
        }}
      >
        {displayName}
      </strong>
    );
  }

  // Renders a bold, clickable map title => goes to /map/:id
  function renderMapTitle(map) {
    if (!map) return 'Untitled'; // fallback

    return (
      <strong
        className={dashFeedStyles.mapTitleLink}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/map/${map.id}`);
        }}
      >
        {map.title || 'Untitled'}
      </strong>
    );
  }

  // Renders a single activity row
  function renderActivityItem(act, idx) {
    const { type, map, commentContent, created_at } = act;
    const mapThumb = renderMapThumbnail(map, act);

    // Build the main text, substituting clickable sender name and clickable map title
    let mainText;
    if (type === 'createdMap') {
      mainText = <>You created map {renderMapTitle(map)}</>;
    } else if (type === 'starredMap') {
      mainText = <>You starred map {renderMapTitle(map)}</>;
    } else if (type === 'commented') {
      mainText = <>You commented on {renderMapTitle(map)}</>;
    } else if (type === 'notification_star') {
      mainText = (
        <>
          {renderSenderName(act)} starred your map {renderMapTitle(map)}
        </>
      );
    } else if (type === 'notification_reply') {
      mainText = (
        <>
          {renderSenderName(act)} replied to your comment on {renderMapTitle(map)}
        </>
      );
    } else if (type === 'notification_like') {
      mainText = (
        <>
          {renderSenderName(act)} liked your comment: {commentContent}
        </>
      );
    } else if (type === 'notification_comment') {
      mainText = (
        <>
          {renderSenderName(act)} commented on your map {renderMapTitle(map)}
        </>
      );
    } else {
      // fallback
      mainText = <>Activity: {type}</>;
    }

    // Decide whether to show the comment box
    const shouldShowCommentBox = (
      (type === 'commented') ||
      (type === 'notification_comment') ||
      (type === 'notification_reply')
    ) && commentContent;

    return (
      <div
        key={idx}
        className={dashFeedStyles.activityItem}
        onClick={() => handleItemClick(act)}
      >
        {mapThumb}

        <div className={dashFeedStyles.activityDetails}>
          <p className={dashFeedStyles.mainText}>{mainText}</p>
          {shouldShowCommentBox && (
            <div className={dashFeedStyles.commentText}>
              {commentContent}
            </div>
          )}
          {/* The dedicated timestamp box in the bottom-right corner */}
          <div className={dashFeedStyles.timestampBox}>
            {timeAgo(created_at)}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
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
