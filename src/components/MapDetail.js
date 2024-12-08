// MapDetail.js

//may lord have mercy on my soul for this giant mess

import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import styles from './MapDetail.module.css';
import { formatDistanceToNow } from 'date-fns';
import { UserContext } from '../context/UserContext';
import FullScreenMap from './FullScreenMap';
import {
  fetchMapById,
  saveMap,
  unsaveMap,
  fetchComments,
  postComment,
  likeComment,
  dislikeComment,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../api';
import countries from '../countries.json';
import Header from './Header'; // Import Header component
import LoadingSpinner from './LoadingSpinner'; // Import LoadingSpinner component

export default function MapDetail({ isCollapsed, setIsCollapsed }) {
  const { id } = useParams();
  const navigate = useNavigate();

  // --------------------- Hook Calls ---------------------

  // State Hooks
  const [mapData, setMapData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [saveCount, setSaveCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewBox, setViewBox] = useState('0 0 2754 1398');
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [notifications, setNotifications] = useState([]);

  // Context Hook
  const { authToken, profile } = useContext(UserContext);

  // Ref Hooks
  const discussionRef = useRef(null);
  const countryListRef = useRef(null);
  const isPanning = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  // --------------------- Effect Hooks ---------------------

  // Adjust country list height
  useEffect(() => {
    const updateCountryListHeight = () => {
      if (discussionRef.current && countryListRef.current) {
        const discussionHeight = discussionRef.current.offsetHeight;
        countryListRef.current.style.height = `${discussionHeight}px`;
      }
    };

    updateCountryListHeight();

    window.addEventListener('resize', updateCountryListHeight);

    return () => {
      window.removeEventListener('resize', updateCountryListHeight);
    };
  }, [comments]);

  // Fetch Map Data
  useEffect(() => {
    const getMapData = async () => {
      try {
        const res = await fetchMapById(id);
        setMapData(res.data);
        setSaveCount(res.data.saveCount || 0);
        setIsSaved(res.data.isSavedByCurrentUser || false);
        setIsOwner(res.data.isOwner || false);
        setIsPublic(res.data.isPublic);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };
    getMapData();
  }, [id]);

  // Fetch Comments
  useEffect(() => {
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

  // Fetch Notifications
  useEffect(() => {
    const getNotifications = async () => {
      try {
        const res = await fetchNotifications();
        setNotifications(res.data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };

    getNotifications();
  }, []);

  // --------------------- Event Handlers ---------------------

  const handleSave = async () => {
    if (!isPublic) {
      return;
    } else if (!isUserLoggedIn) {
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

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const res = await postComment(id, { content: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  // Handle submitting a reply
  const handleReplySubmit = async (e, ParentCommentId) => {
    e.preventDefault();
    const replyContent = replyingTo.content;
    if (!replyContent.trim()) return;

    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      const res = await postComment(id, { content: replyContent, ParentCommentId });
      // Update the comments state
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === ParentCommentId) {
            return {
              ...comment,
              Replies: [...(comment.Replies || []), res.data],
            };
          }
          return comment;
        })
      );
      setReplyingTo(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (commentId) => {
    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      const res = await likeComment(commentId);
      setComments((prevComments) =>
        prevComments.map((comment) => {
          // Update the comment if it matches
          if (comment.id === commentId) {
            return { ...comment, ...res.data };
          }
          // Otherwise, check if the comment has replies and update them
          if (comment.Replies && comment.Replies.length > 0) {
            const updatedReplies = comment.Replies.map((reply) => {
              if (reply.id === commentId) {
                return { ...reply, ...res.data };
              }
              return reply;
            });
            return { ...comment, Replies: updatedReplies };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDislike = async (commentId) => {
    if (!isUserLoggedIn) {
      navigate('/login');
      return;
    }
    try {
      const res = await dislikeComment(commentId);
      setComments((prevComments) =>
        prevComments.map((comment) => {
          // Update the comment if it matches
          if (comment.id === commentId) {
            return { ...comment, ...res.data };
          }
          // Otherwise, check if the comment has replies and update them
          if (comment.Replies && comment.Replies.length > 0) {
            const updatedReplies = comment.Replies.map((reply) => {
              if (reply.id === commentId) {
                return { ...reply, ...res.data };
              }
              return reply;
            });
            return { ...comment, Replies: updatedReplies };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Handle toggling of replies display
  const toggleReplies = (commentId) => {
    setExpandedReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
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

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    // Mark as read and navigate to the map
    try {
      await markNotificationAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
      );
      navigate(`/map/${notification.MapId}`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Handle marking all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  // --------------------- Early Return ---------------------

  if (isLoading || !mapData) {
    return (
      <div className={styles.mapDetailContainer}>
        {/* Sidebar */}
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

        {/* Main Content */}
        <div
          className={`${styles.mapDetailContent} ${
            isCollapsed ? styles.contentCollapsed : ''
          }`}
        >
   {/* Header Section */}
   <Header
            title="Map View"
            notifications={notifications.slice(0, 6)}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            profilePicture={profile?.profilePicture}
          />

          {/* Loading Spinner */}
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  // --------------------- Computed Variables ---------------------

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

  const isUserLoggedIn = !!authToken && !!profile;

  // --------------------- Render ---------------------

  return (
    <div className={styles.mapDetailContainer}>
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content */}
      <div
        className={`${styles.mapDetailContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
      {/* Header Section */}
      <Header
            title="Map View"
            notifications={notifications.slice(0, 6)}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            profilePicture={profile?.profilePicture}
          />

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
              isTitleHidden={mapData.isTitleHidden}
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
              viewBox={viewBox}
              isTitleHidden={mapData.isTitleHidden}
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
              viewBox={viewBox}
              isTitleHidden={mapData.isTitleHidden}
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

          {/* View Mode Button */}
          <button className={styles.viewModeButton} onClick={toggleFullScreen}>
            🖵
          </button>
        </div>

        {/* Full-Screen Map */}
        {isFullScreen && (
          <FullScreenMap
            mapData={mapData}
            handleZoom={handleZoom}
            viewBox={viewBox}
            setViewBox={setViewBox}
            handleMouseDown={handleMouseDown}
            handleMouseMove={handleMouseMove}
            handleMouseUp={handleMouseUp}
            handleMouseLeave={handleMouseLeave}
            toggleFullScreen={toggleFullScreen}
          />
        )}

        {/* Map Details and Statistics */}
        <div className={styles.detailsAndStats}>
          {/* Left Content: Map Details and Comments */}
          <div className={styles.leftContent}>
            {/* Map Details */}
            <div className={styles.mapDetails}>
              <div className={styles.titleSection}>
                <h1>
                  {mapData.title || 'Untitled Map'}
                  {isOwner && (
                    <span className={styles.visibilityTag}>
                      {isPublic ? 'Public' : 'Private'}
                    </span>
                  )}
                </h1>
                {/* Save Button */}
                {isPublic && (
                  <button className={styles.saveButton} onClick={handleSave}>
                    {isSaved ? '★' : '☆'} {saveCount}
                  </button>
                )}
              </div>
              <p className={styles.createdAt}>
                Created {timeAgo} by{' '}
                <Link to={`/profile/${mapData.User.username}`}>
                  {mapData.User ? mapData.User.username : 'Unknown'}
                </Link>
              </p>
              {/* Creator Info */}
              <div className={styles.creatorInfo}>
                <Link
                  to={`/profile/${mapData.User.username}`}
                  className={styles.creatorProfileLink}
                >
                  <img
                    src={
                      mapData.User && mapData.User.profilePicture
                        ? `http://localhost:5000${mapData.User.profilePicture}`
                        : '/default-profile-pic.jpg'
                    }
                    alt={`${mapData.User.firstName || mapData.User.username}'s profile`}
                    className={styles.creatorProfilePicture}
                  />
                  <span className={styles.creatorName}>
                    {mapData.User.firstName || ''} {mapData.User.lastName || ''}
                  </span>
                </Link>
              </div>

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
            </div>


            {/* Comments Section */}
            <div className={styles.discussionSection} ref={discussionRef}>
              <h2>Discussion</h2>
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  required
                  className={styles.commentTextarea}
                ></textarea>
                <button type="submit" className={styles.commentButton}>
                  Post Comment
                </button>
              </form>
              {comments.length > 0 ? (
                <ul className={styles.commentsList}>
                  {comments.map((comment, index) => {
                    // Determine if replies are expanded for this comment
                    const areRepliesExpanded = expandedReplies[comment.id];

                    // Ensure comment.Replies is always an array
                    const repliesArray = comment.Replies || [];

                    // Determine how many replies to display
                    const totalReplies = repliesArray.length;
                    const repliesToShow = areRepliesExpanded
                      ? repliesArray.slice(0, 10)
                      : repliesArray.slice(0, 3);

                      

                    return (
                      <li key={index} className={styles.commentItem}>
                        {/* Comment Content */}
                        <div className={styles.commentHeader}>
                          {comment.User && comment.User.profilePicture ? (
                            <Link to={`/profile/${comment.User.username}`}>
                              <img
                                src={`http://localhost:5000${comment.User.profilePicture}`}
                                alt={`${comment.User.username}'s profile`}
                                className={styles.commentProfilePicture}
                              />
                            </Link>
                          ) : (
                            <div className={styles.commentPlaceholder}></div>
                          )}
                          <div className={styles.commentContentWrapper}>
                            <div className={styles.commentInfo}>
                              <Link
                                to={`/profile/${comment.User.username}`}
                                className={styles.commentAuthorLink}
                              >
                                <span className={styles.commentAuthor}>
                                  {comment.User ? comment.User.username : 'Anonymous'}
                                </span>
                              </Link>
                              <span className={styles.commentTime}>
                                {formatDistanceToNow(new Date(comment.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                            <p className={styles.commentContent}>{comment.content}</p>
                            {/* Like and Dislike Buttons */}
                            <div className={styles.commentActions}>
                              <button
                                className={`${styles.reactionButton} ${
                                  comment.userReaction === 'like' ? styles.active : ''
                                }`}
                                onClick={() => handleLike(comment.id)}
                              >
                                {/* Like icon */}
                                <svg className={styles.icon} viewBox="0 0 24 24">
                                  <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
                                </svg>
                                <span>{comment.likeCount}</span>
                              </button>
                              <button
                                className={`${styles.reactionButton} ${
                                  comment.userReaction === 'dislike' ? styles.active : ''
                                }`}
                                onClick={() => handleDislike(comment.id)}
                              >
                                {/* Dislike icon */}
                                <svg className={styles.icon} viewBox="0 0 24 24">
                                  <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06L9.83 22l6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
                                </svg>
                                <span>{comment.dislikeCount}</span>
                              </button>
                              {/* Reply Button */}
                              <button
                                className={styles.replyButton}
                                onClick={() =>
                                  setReplyingTo({
                                    commentId: comment.id,
                                    content: '',
                                  })
                                }
                              >
                                Reply
                              </button>
                            </div>

                            {/* Show reply form if this comment is being replied to */}
                            {replyingTo && replyingTo.commentId === comment.id && (
                              <form
                                onSubmit={(e) => handleReplySubmit(e, comment.id)}
                                className={styles.replyForm}
                              >
                                <textarea
                                  value={replyingTo.content}
                                  onChange={(e) =>
                                    setReplyingTo({
                                      ...replyingTo,
                                      content: e.target.value,
                                    })
                                  }
                                  placeholder="Write a reply..."
                                  required
                                  className={styles.replyTextarea}
                                ></textarea>
                                <button type="submit" className={styles.replyButtonSubmit}>
                                  Post Reply
                                </button>
                              </form>
                            )}

                            {/* Render Replies */}
                            {comment.Replies && comment.Replies.length > 0 && (
                              <ul className={styles.repliesList}>
                                {repliesToShow.map((reply, idx) => (
                                  <li key={idx} className={styles.replyItem}>
                                    {/* Reply Content */}
                                    <div className={styles.commentHeader}>
                                      {reply.User && reply.User.profilePicture ? (
                                        <Link to={`/profile/${reply.User.username}`}>
                                          <img
                                            src={`http://localhost:5000${reply.User.profilePicture}`}
                                            alt={`${reply.User.username}'s profile`}
                                            className={styles.commentProfilePicture}
                                          />
                                        </Link>
                                      ) : (
                                        <div className={styles.commentPlaceholder}></div>
                                      )}
                                      <div className={styles.commentContentWrapper}>
                                        <div className={styles.commentInfo}>
                                          <Link
                                            to={`/profile/${reply.User.username}`}
                                            className={styles.commentAuthorLink}
                                          >
                                            <span className={styles.commentAuthor}>
                                              {reply.User ? reply.User.username : 'Anonymous'}
                                            </span>
                                          </Link>
                                          <span className={styles.commentTime}>
                                            {formatDistanceToNow(new Date(reply.createdAt), {
                                              addSuffix: true,
                                            })}
                                          </span>
                                        </div>
                                        <p className={styles.commentContent}>{reply.content}</p>
                                        <div className={styles.commentActions}>
                                          {/* Like and Dislike Buttons for Replies */}
                                          <button
                                            className={`${styles.reactionButton} ${
                                              reply.userReaction === 'like' ? styles.active : ''
                                            }`}
                                            onClick={() => handleLike(reply.id)}
                                          >
                                            {/* Like icon */}
                                            <svg className={styles.icon} viewBox="0 0 24 24">
                                              <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
                                            </svg>
                                            <span>{reply.likeCount}</span>
                                          </button>
                                          <button
                                            className={`${styles.reactionButton} ${
                                              reply.userReaction === 'dislike' ? styles.active : ''
                                            }`}
                                            onClick={() => handleDislike(reply.id)}
                                          >
                                            {/* Dislike icon */}
                                            <svg className={styles.icon} viewBox="0 0 24 24">
                                              <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06L9.83 22l6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
                                            </svg>
                                            <span>{reply.dislikeCount}</span>
                                          </button>
                                          {/* No Reply button for replies */}
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                ))}

                                {/* Show 'View more replies' or 'Show less replies' button */}
                                {totalReplies > 3 && (
                                  <button
                                    className={styles.toggleRepliesButton}
                                    onClick={() => toggleReplies(comment.id)}
                                  >
                                    {areRepliesExpanded
                                      ? 'Show less replies'
                                      : `View more replies (${totalReplies - 3})`}
                                  </button>
                                )}
                              </ul>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>

          {/* Right Side: Statistics */}
          <div className={styles.mapStats}>
            <div className={styles.statsSummary}>
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
            </div>
            {/* Country List Table */}
            <div className={styles.countryList} ref={countryListRef}>
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
