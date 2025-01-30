import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

import { fetchUserActivity } from '../api';

// Icons
import { FaStar, FaRegComment, FaReply } from 'react-icons/fa';
import { MdCreate } from 'react-icons/md';

// Map thumbnails
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

import styles from './Dashboard.module.css';  // Reusing styling from Dashboard (or create a separate .css)

export default function ProfileActivityFeed({ username, profilePictureUrl }) {
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

  // Generate a map thumbnail for each activity’s associated map
  function renderMapThumbnail(map, mapTitle) {
    if (!map) return <div className={styles.defaultThumbnail}>Map</div>;

    const sharedProps = {
      groups: map.groups || [],
      mapTitleValue: mapTitle,
      oceanColor: map.oceanColor,
      unassignedColor: map.unassignedColor,
      data: map.data,
      fontColor: map.fontColor,
      isTitleHidden: map.isTitleHidden,
      isThumbnail: true
    };

    if (map.selectedMap === 'world') return <WorldMapSVG {...sharedProps} />;
    if (map.selectedMap === 'usa') return <UsSVG {...sharedProps} />;
    if (map.selectedMap === 'europe') return <EuropeSVG {...sharedProps} />;
    return <div className={styles.defaultThumbnail}>Map</div>;
  }

  // When user clicks on activity => go to the corresponding map
  const handleActivityItemClick = (mapId) => {
    if (mapId) {
      navigate(`/map/${mapId}`);
    }
  };

  // Basic date formatting
  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  // Here is the main difference: we always use the "profilePictureUrl" 
  // from the profile page for "commented" or "reply" items.
  function renderActivityItem(activity, index) {
    const {
      type,
      map,
      commentContent,
      createdAt,
      user,       // the actor
      commentObj, // e.g., if type=reply, includes ParentComment data
    } = activity;

    const mapTitle = map?.title || 'Untitled Map';
    const mapThumb = renderMapThumbnail(map, mapTitle);

    let mainText;
    let body = null;

    if (type === 'createdMap') {
      mainText = (
        <>
          <strong>{username}</strong> created a map "<em>{mapTitle}</em>"
        </>
      );
    } else if (type === 'starredMap') {
      mainText = (
        <>
          <strong>{username}</strong> starred "<em>{mapTitle}</em>"
        </>
      );
      body = (
        <p className={styles.starCount}>
          <FaStar style={{ marginRight: 4, color: 'black' }} />
          {map?.saveCount || 0}
        </p>
      );
    } else if (type === 'commented') {
      // Instead of user?.profilePicture, we use "profilePictureUrl" from the parent
      const text = commentContent || '(No comment text)';
      mainText = (
        <>
          <strong>{username}</strong> commented on "<em>{mapTitle}</em>"
        </>
      );
      body = (
        <div className={styles.commentBox}>
          <img
            className={styles.userAvatar}
            src={profilePictureUrl || '/default-profile-picture.png'}
            alt="Profile Owner Avatar"
          />
          <div className={styles.commentText}>{text}</div>
        </div>
      );
    } else if (type === 'reply') {
      // Similarly, for a reply we also want the page owner's avatar
      const replyText = commentContent || '(No reply text)';
      mainText = (
        <>
          <strong>{username}</strong> replied on "<em>{mapTitle}</em>"
        </>
      );

      // We could also show the parent comment if we want, 
      // but if you only want *this* user’s avatar, do so:
      body = (
        <div className={styles.commentReplyBox}>
          <img
            className={styles.userAvatar}
            src={profilePictureUrl || '/default-profile-picture.png'}
            alt="Profile Owner Avatar"
          />
          <div className={styles.commentText}>{replyText}</div>
        </div>
      );
    } else {
      mainText = (
        <>
          <strong>{username}</strong> performed an action on "<em>{mapTitle}</em>"
        </>
      );
    }

    return (
      <div
        key={`${type}-${index}-${map?.id}`}
        className={styles.activityItem}
        onClick={() => handleActivityItemClick(map?.id)}
      >
        <div className={styles.thumbContainer}>{mapThumb}</div>
        <div className={styles.activityDetails}>
          <p>{mainText}</p>
          {body}
          <span className={styles.timestamp}>{timeAgo(createdAt)}</span>
        </div>
      </div>
    );
  }

  // --- RENDER COMPONENT ---
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
