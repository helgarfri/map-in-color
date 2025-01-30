import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

import { fetchUserActivity } from '../api';

// Icons
import { FaStar } from 'react-icons/fa';
import { MdCreate } from 'react-icons/md';
import { FaRegComment, FaReply } from 'react-icons/fa';

// Map thumbnails
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

import { UserContext } from '../context/UserContext';
import styles from './Dashboard.module.css';  // same styling as Dashboard

export default function ProfileActivityFeed({ username }) {
  const navigate = useNavigate();
  const { profile: currentUser } = useContext(UserContext);

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

  // Reuse logic to create a thumbnail
  function renderMapThumbnail(map, mapTitle) {
    if (!map) return <div className={styles.defaultThumbnail}>Map</div>;

    if (map.selectedMap === 'world') {
      return (
        <WorldMapSVG
          groups={map.groups || []}
          mapTitleValue={mapTitle}
          oceanColor={map.oceanColor}
          unassignedColor={map.unassignedColor}
          data={map.data}
          fontColor={map.fontColor}
          isTitleHidden={map.isTitleHidden}
          isThumbnail
        />
      );
    } else if (map.selectedMap === 'usa') {
      return (
        <UsSVG
          groups={map.groups || []}
          mapTitleValue={mapTitle}
          oceanColor={map.oceanColor}
          unassignedColor={map.unassignedColor}
          data={map.data}
          fontColor={map.fontColor}
          isTitleHidden={map.isTitleHidden}
          isThumbnail
        />
      );
    } else if (map.selectedMap === 'europe') {
      return (
        <EuropeSVG
          groups={map.groups || []}
          mapTitleValue={mapTitle}
          oceanColor={map.oceanColor}
          unassignedColor={map.unassignedColor}
          data={map.data}
          fontColor={map.fontColor}
          isTitleHidden={map.isTitleHidden}
          isThumbnail
        />
      );
    }
    return <div className={styles.defaultThumbnail}>Map</div>;
  }

  // Click entire activity => go to map
  const handleActivityItemClick = (mapId) => {
    if (mapId) {
      navigate(`/map/${mapId}`);
    }
  };

  // Click user => go to user’s profile
  const handleUserClick = (e, userName) => {
    e.stopPropagation();
    if (userName) {
      navigate(`/profile/${userName}`);
    }
  };

  function renderActivityItem(activity) {
    // The structure depends on your server's data
    // e.g. { type, map, commentContent, createdAt, user, commentObj: { ParentComment, etc. } }
    const {
      type,
      map,
      commentContent,
      createdAt,
      user,         // the actor who performed the activity
      commentObj,   // the entire comment object with ParentComment, etc.
    } = activity || {};

    const actorName = user?.firstName || user?.username || username || 'User';
    const userAvatarUrl = user?.profilePicture
      ? `http://localhost:5000${user.profilePicture}`
      : '/default-profile-picture.png';

    // For the map
    const mapTitle = map?.title || 'Untitled Map';
    const thumbnail = renderMapThumbnail(map, mapTitle);

    let mainText;
    let body = null;

    if (type === 'createdMap') {
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {actorName}
          </strong>{' '}
          created a map "<em>{mapTitle}</em>"
        </>
      );
    } 
    else if (type === 'starredMap') {
      const totalStars = map?.saveCount || 0;
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {actorName}
          </strong>{' '}
          starred "<em>{mapTitle}</em>"
        </>
      );
      body = (
        <p className={styles.starCount}>
          <FaStar style={{ marginRight: 4, color: 'black' }} />
          {totalStars}
        </p>
      );
    } 
    else if (type === 'commented') {
      const text = commentContent || 'No comment text.';
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {actorName}
          </strong>{' '}
          commented on "<em>{mapTitle}</em>"
        </>
      );
      body = (
        <div className={styles.commentBox}>
          <img
            className={styles.userAvatar}
            src={userAvatarUrl}
            alt="User"
            onClick={(e) => handleUserClick(e, user?.username)}
          />
          <div className={styles.commentText}>{text}</div>
        </div>
      );
    } 
    else if (type === 'reply') {
      // If the server includes commentObj.ParentComment.User => we can show that user’s avatar or name
      const replyText = commentContent || 'No reply text.';
      const parentCommentText = commentObj?.ParentComment?.content || '(no parent comment text)';
      const parentAuthor = commentObj?.ParentComment?.User;  // the original comment's author
      const parentAuthorName = parentAuthor?.username || 'someone';
      const parentAuthorAvatar = parentAuthor?.profilePicture
        ? `http://localhost:5000${parentAuthor.profilePicture}`
        : '/default-profile-picture.png';

      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {actorName}
          </strong>{' '}
          replied to 
          {parentAuthorName === currentUser?.username ? ' your ' : ` ${parentAuthorName}'s `}
          comment on "<em>{mapTitle}</em>"
        </>
      );

      // Body => show the original comment + the reply
      body = (
        <div className={styles.commentReplyBox}>
          {/* Original comment row */}
          <div className={styles.originalComment}>
            <img
              className={styles.userAvatar}
              src={parentAuthorAvatar}
              alt="Parent Author"
            />
            <div className={styles.commentText}>
              <strong>
                {parentAuthorName === currentUser?.username ? 'You' : parentAuthorName}:
              </strong>{' '}
              {parentCommentText}
            </div>
          </div>

          {/* The actual reply */}
          <div className={styles.replyBox}>
            <img
              className={styles.userAvatar}
              src={userAvatarUrl}
              alt="Reply Author"
              onClick={(e) => handleUserClick(e, user?.username)}
            />
            <div className={styles.commentText}>{replyText}</div>
          </div>
        </div>
      );
    } 
    else {
      mainText = (
        <>
          <strong
            className={styles.userNameLink}
            onClick={(e) => handleUserClick(e, user?.username)}
          >
            {actorName}
          </strong>{' '}
          did something with "<em>{mapTitle}</em>"
        </>
      );
    }

    return (
      <div
        key={`${type}-${createdAt}-${map?.id}`}
        className={styles.activityItem}
        onClick={() => handleActivityItemClick(map?.id)}
      >
        <div className={styles.thumbContainer}>{thumbnail}</div>
        <div className={styles.activityDetails}>
          <p>{mainText}</p>
          {body}
          <span className={styles.timestamp}>
            {createdAt
              ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
              : ''}
          </span>
        </div>
      </div>
    );
  }

  // Loading states
  if (isLoading) {
    return <p>Loading user activity...</p>;
  }
  if (!activities || activities.length === 0) {
    return <p>No activity yet.</p>;
  }

  return (
    <div className={styles.activityFeed}>
      {activities.map(renderActivityItem)}
    </div>
  );
}
