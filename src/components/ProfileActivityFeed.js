// src/components/ProfileActivityFeed.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  FaStar,
  FaPlus,
  FaComment,
  FaReply,
  FaThumbsUp,
  FaInfoCircle,
} from 'react-icons/fa';
import { fetchUserActivity } from '../api';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import SkeletonActivityRow from './SkeletonActivityRow';
import styles from './DashboardActivityFeed.module.css';

export default function ProfileActivityFeed({ username, profile_pictureUrl }) {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!username) return;

    async function loadActivity() {
      try {
        setIsLoading(true);
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

  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  function getActivityIcon(type) {
    switch (type) {
      case 'createdMap': return <FaPlus />;
      case 'starredMap': return <FaStar />;
      case 'commented': return <FaComment />;
      default: return <FaInfoCircle />;
    }
  }

  function renderMapThumbnail(map, type) {
    if (!map) {
      return <div className={styles.defaultThumbnail}>No Map</div>;
    }

    const sharedProps = {
      groups: map.groups || [],
      mapTitleValue: map.title || 'Untitled',
      ocean_color: map.ocean_color,
      unassigned_color: map.unassigned_color,
      data: map.data,
      font_color: map.font_color,
      is_title_hidden: map.is_title_hidden,
      isThumbnail: true,
    };

    let MapComponent = <div className={styles.defaultThumbnail}>No Map</div>;
    if (map.selected_map === 'world') MapComponent = <WorldMapSVG {...sharedProps} />;
    if (map.selected_map === 'usa') MapComponent = <UsSVG {...sharedProps} />;
    if (map.selected_map === 'europe') MapComponent = <EuropeSVG {...sharedProps} />;

    return (
      <div className={styles.thumbContainer}>
        {MapComponent}
        <div className={styles.activityOverlay}>
          <img
            className={styles.activityAvatar}
            src={profile_pictureUrl || '/default-profile-picture.png'}
            alt="User"
          />
          <div className={styles.activityIcon}>
            {getActivityIcon(type)}
          </div>
        </div>
      </div>
    );
  }

  function renderMapTitle(map) {
    if (!map) return 'Untitled';
    return (
      <strong
        className={styles.mapTitleLink}
        onClick={(e) => {
          e.stopPropagation();
          map?.id && navigate(`/map/${map.id}`);
        }}
      >
        {map.title || 'Untitled'}
      </strong>
    );
  }

  function renderCommentBox(act) {
    const commentAvatarUrl = act.commentAuthor?.profile_picture || '/default-profile-picture.png';
    return (
      <div className={styles.commentBox}>
        <img
          className={styles.commentAuthorAvatar}
          src={commentAvatarUrl}
          alt="Comment Author"
          onClick={(e) => {
            e.stopPropagation();
            act.commentAuthor?.username && navigate(`/profile/${act.commentAuthor.username}`);
          }}
        />
        <div className={styles.commentBody}>
          {act.commentContent}
        </div>
      </div>
    );
  }

  function renderActivityItem(act, idx) {
    const { type, map, commentContent, created_at } = act;
    const mapThumb = renderMapThumbnail(map, type);

    let mainText;
    if (type === 'createdMap') {
      mainText = <>{username} created map {renderMapTitle(map)}</>;
    } else if (type === 'starredMap') {
      mainText = <>{username} starred map {renderMapTitle(map)}</>;
    } else if (type === 'commented') {
      mainText = <>{username} commented on {renderMapTitle(map)}</>;
    } else {
      mainText = <>Activity: {type}</>;
    }

    return (
      <div
        key={idx}
        className={styles.activityItem}
        onClick={() => map?.id && navigate(`/map/${map.id}`)}
      >
        {mapThumb}
        <div className={styles.activityDetails}>
          <p className={styles.mainText}>{mainText}</p>
          {commentContent && renderCommentBox(act)}
          <div className={styles.timestampBox}>
            {timeAgo(created_at)}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.dashActivityFeed}>
        <SkeletonActivityRow />
        <SkeletonActivityRow />
        <SkeletonActivityRow />
      </div>
    );
  }

  if (!activities.length) {
    return <p>No recent activity.</p>;
  }

  return (
    <div className={styles.dashActivityFeed}>
      {activities.map((act, i) => renderActivityItem(act, i))}
    </div>
  );
}