// MapDetail.js

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
import { BiDownload } from 'react-icons/bi';
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
  incrementMapDownloadCount,
  deleteComment
} from '../api';
import countries from '../countries.json';
import Header from './Header'; 
import LoadingSpinner from './LoadingSpinner'; 
import { FaDownload } from 'react-icons/fa'; // icon for download


export default function MapDetail({ isCollapsed, setIsCollapsed }) {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const [downloadCount, setDownloadCount] = useState(0);

  const { authToken, profile } = useContext(UserContext);

  const discussionRef = useRef(null);
  const countryListRef = useRef(null);
  const isPanning = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  // Ref for the map display container
  const mapDisplayRef = useRef(null);

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

  useEffect(() => {
    if (!mapData) return;
    if (mapData.selectedMap === 'usa') {
      setViewBox('-90 -10 1238 610');   // after editing the raw US SVG
    } else if (mapData.selectedMap === 'europe') {
      setViewBox('-80 0 760 510');    // after editing the raw Europe SVG
    } else {
      setViewBox('0 0 2754 1398');  // world
    }
  }, [mapData]);

  
  
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
        setIsLoading(false);
      }
    };
    getMapData();
  }, [id]);

  useEffect(() => {
    // Once mapData is loaded, set the local state for downloadCount
    if (mapData) {
      setDownloadCount(mapData.downloadCount || 0);
    }
  }, [mapData]);

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

  const handleEdit = () => {
    navigate(`/edit/${id}`);
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
          if (comment.id === commentId) {
            return { ...comment, ...res.data };
          }
          if (comment.Replies && comment.Replies.length > 0) {
            const updatedReplies = comment.Replies.map((reply) =>
              reply.id === commentId ? { ...reply, ...res.data } : reply
            );
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
          if (comment.id === commentId) {
            return { ...comment, ...res.data };
          }
          if (comment.Replies && comment.Replies.length > 0) {
            const updatedReplies = comment.Replies.map((reply) =>
              reply.id === commentId ? { ...reply, ...res.data } : reply
            );
            return { ...comment, Replies: updatedReplies };
          }
          return comment;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleReplies = (commentId) => {
    setExpandedReplies((prevState) => ({
      ...prevState,
      [commentId]: !prevState[commentId],
    }));
  };

  const handleDeleteCommentWithConfirm = (commentId) => {
    // Show a confirmation dialog
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDeleteComment(commentId);
    }
  };
  

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);    // call the API
      // Now remove the comment or reply in local state
      setComments((prevComments) => removeCommentOrReply(prevComments, commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };
  
  function removeCommentOrReply(comments, commentIdToRemove) {
    // This function returns a new array of comments 
    // with the specified comment/reply removed.
    return comments
      .filter((comment) => comment.id !== commentIdToRemove) // remove top-level if matches
      .map((comment) => {
        // also remove from any replies
        if (comment.Replies && comment.Replies.length > 0) {
          return {
            ...comment,
            Replies: comment.Replies.filter((r) => r.id !== commentIdToRemove),
          };
        }
        return comment;
      });
  }
  

  const handleZoom = (scaleFactor) => {
    let [x, y, width, height] = viewBox.split(' ').map(Number);
    const newWidth = width / scaleFactor;
    const newHeight = height / scaleFactor;
    const minWidth = 500;
    const maxWidth = 5000;
    if (newWidth < minWidth || newWidth > maxWidth) return;
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
    const rect = e.currentTarget.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
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

  const handleNotificationClick = async (notification) => {
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

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  if (isLoading || !mapData) {
    return (
      <div className={styles.mapDetailContainer}>
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <div
          className={`${styles.mapDetailContent} ${
            isCollapsed ? styles.contentCollapsed : ''
          }`}
        >
          <Header
            title=""
            notifications={notifications.slice(0, 6)}
            onNotificationClick={handleNotificationClick}
            onMarkAllAsRead={handleMarkAllAsRead}
            profilePicture={profile?.profilePicture}
          />
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  function formatValue(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return String(num);
    }
    const suffixes = [
      { value: 1e24, suffix: 'y' },
      { value: 1e21, suffix: 'z' },
      { value: 1e18, suffix: 'e' },
      { value: 1e15, suffix: 'p' },
      { value: 1e12, suffix: 't' },
      { value: 1e9, suffix: 'b' },
      { value: 1e6, suffix: 'm' },
      { value: 1e3, suffix: 'k' }
    ];
    for (let i = 0; i < suffixes.length; i++) {
      if (num >= suffixes[i].value) {
        return (num / suffixes[i].value).toFixed(2) + suffixes[i].suffix;
      }
    }
    return num.toFixed(2);
  }

  const timeAgo = formatDistanceToNow(new Date(mapData.createdAt), { addSuffix: true });

  const countryCodeToName = countries.reduce((acc, country) => {
    acc[country.code] = country.name;
    return acc;
  }, {});

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

  entries.sort((a, b) => b.value - a.value);

  const isUserLoggedIn = !!authToken && !!profile;
  
  
  
  const handleDownload = async () => {
    try {
      const originalSvg = document.querySelector(`.${styles.mapDisplay} svg`);
      if (!originalSvg) return;

      // Clone the SVG so we can manipulate it without affecting what's on screen
      const svgClone = originalSvg.cloneNode(true);

      // (Optional) Override viewBox if you want a custom bounding box
      if (mapData?.selectedMap === 'europe') {
        svgClone.setAttribute('viewBox', '-100 -6 780 530');
      } else if (mapData?.selectedMap === 'usa') {
        svgClone.setAttribute('viewBox', '-90 -10 1238 667');
      } else {
        svgClone.setAttribute('viewBox', '0 0 2754 1398');
      }

      // Remove certain elements from the cloned SVG (e.g., circles or overlays)
      const circles = svgClone.querySelectorAll('.circlexx, .subxx, .noxx, .unxx');
      circles.forEach(el => el.remove());

      // Inline all relevant styles
      const allElements = svgClone.querySelectorAll('*');
      allElements.forEach(el => {
        const computed = window.getComputedStyle(el);
        if (['path','polygon','circle'].includes(el.tagName.toLowerCase())) {
          el.setAttribute('stroke', computed.stroke || '#4b4b4b');
          el.setAttribute('stroke-width', computed.strokeWidth || '0.5');
          if (computed.fill && computed.fill !== 'none') {
            el.setAttribute('fill', computed.fill);
          }
        }
        // Make text bold inline
        if (el.tagName.toLowerCase() === 'text') {
          el.setAttribute('font-weight', 'bold');
        }
      });

      // Convert cloned SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      // Create an <img> to draw onto a <canvas>
      const img = new Image();
      img.onload = async function () {
        // Read the forced (cloned) viewBox
        const forcedViewBox = svgClone.getAttribute('viewBox');
        const scaleFactor = 3;
        let width, height;

        if (forcedViewBox) {
          const [vbX, vbY, vbWidth, vbHeight] = forcedViewBox.split(' ').map(parseFloat);
          width = vbWidth * scaleFactor;
          height = vbHeight * scaleFactor;
        } else {
          // fallback if no viewBox is set
          const rect = originalSvg.getBoundingClientRect();
          width = rect.width * scaleFactor;
          height = rect.height * scaleFactor;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);

        // Prepare watermark text
        const firstName = mapData?.User?.firstName || '';
        const lastName = mapData?.User?.lastName || '';
        const creatorText = `Created by ${firstName} ${lastName} using mapincolor.com`;

        // Add a semi-transparent logo
        const logoImg = new Image();
        logoImg.onload = function () {
          const logoWidth = 300;
          const logoHeight = logoImg.height * (logoWidth / logoImg.width);
          const padding = 20;

          const logoX = padding;
          const logoY = canvas.height - logoHeight - padding;
          ctx.save();
          ctx.globalAlpha = 0.5;
          ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
          ctx.restore();

          // Add text at bottom-right
          ctx.font = `48px 'Arial', sans-serif`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';

          const metrics = ctx.measureText(creatorText);
          const textWidth = metrics.width;
          const textHeight = 48;
          const backgroundPadding = 10;
          const textX = canvas.width - padding;
          const textY = canvas.height - padding;

          // Dark background for better contrast
          ctx.fillStyle = '#333';
          ctx.fillRect(
            textX - textWidth - backgroundPadding,
            textY - textHeight - backgroundPadding,
            textWidth + backgroundPadding * 2,
            textHeight + backgroundPadding * 2
          );

          ctx.fillStyle = '#fff';
          ctx.fillText(creatorText, textX, textY);

          // Convert canvas to Blob and trigger download
          canvas.toBlob(async (blob) => {
            // Immediately increment server-side downloadCount
            try {
              const res = await incrementMapDownloadCount(mapData.id);
              if (res.data.downloadCount != null) {
                setDownloadCount(res.data.downloadCount);
              }
            } catch (err) {
              console.error('Error incrementing download:', err);
            }

            // Trigger browser download
            const link = document.createElement('a');
            link.download = `${mapData.title || 'map'}.png`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, 'image/png');
        };

        logoImg.onerror = async function () {
          console.error("Logo failed to load. Proceeding without logo.");

          // Still increment downloads on server
          try {
            const res = await incrementMapDownloadCount(mapData.id);
            if (res.data.downloadCount != null) {
              setDownloadCount(res.data.downloadCount);
            }
          } catch (err) {
            console.error('Error incrementing download:', err);
          }

          // If logo can’t load, just show text watermark
          ctx.font = `36px 'Arial', sans-serif`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';

          const padding = 20;
          const metrics = ctx.measureText(creatorText);
          const textWidth = metrics.width;
          const textHeight = 36;
          const backgroundPadding = 10;
          const textX = canvas.width - padding;
          const textY = canvas.height - padding;

          ctx.fillStyle = '#333';
          ctx.fillRect(
            textX - textWidth - backgroundPadding,
            textY - textHeight - backgroundPadding,
            textWidth + backgroundPadding * 2,
            textHeight + backgroundPadding * 2
          );
          ctx.fillStyle = '#fff';
          ctx.fillText(creatorText, textX, textY);

          // Trigger browser download
          canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = `${mapData.title || 'map'}.png`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, 'image/png');
        };

        logoImg.src = '/assets/map-in-color-logo.png';
      };
      img.src = url;

    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };
  
  
  
  
  
  

  return (
    <div className={styles.mapDetailContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={`${styles.mapDetailContent} ${isCollapsed ? styles.contentCollapsed : ''}`}>
        <Header
          title={`${mapData.User.username} - ${mapData.title}`}
          notifications={notifications.slice(0, 6)}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          profilePicture={profile?.profilePicture}
        />

        <div
          className={styles.mapDisplay}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'grab', position: 'relative' }}
        >
          {mapData.selectedMap === 'world' && (
            <WorldMapSVG {...mapDataProps()} viewBox={viewBox} isLargeMap={false} />
          )}
          {mapData.selectedMap === 'usa' && (
            <UsSVG {...mapDataProps()} viewBox={viewBox} isLargeMap={false} />
          )}
          {mapData.selectedMap === 'europe' && (
            <EuropeSVG {...mapDataProps()} viewBox={viewBox} isLargeMap={false} />
          )}

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

          <button className={styles.viewModeButton} onClick={toggleFullScreen}>
            🖵
          </button>
        </div>

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

        <div className={styles.detailsAndStats}>
          <div className={styles.leftContent}>
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
      {/* Edit Button - only visible if the user isOwner */}
      {isOwner && (
        <button className={styles.editButton} onClick={handleEdit}>
          Edit Map
        </button>
      )}

  {isPublic && (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
     

      {/* Star (save) Button */}
      <button className={styles.saveButton} onClick={handleSave}>
        {isSaved ? '★' : '☆'} {saveCount}
      </button>

      {/* Download Button */}
      <button className={styles.saveButton} onClick={handleDownload}>
        <BiDownload /> {downloadCount}
      </button>

    
    </div>
  )}
</div>

              <p className={styles.createdAt}>
                Created {timeAgo} by{' '}
                <Link to={`/profile/${mapData.User.username}`}>
                  {mapData.User ? mapData.User.username : 'Unknown'}
                </Link>
              </p>
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
              <div className={styles.tags}>
                {mapData.tags && mapData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={styles.mapTag}
                    onClick={() => navigate(`/explore?tags=${encodeURIComponent(tag.toLowerCase())}`)}
                    title={`See all maps with the tag "${tag}"`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {mapData.sources && mapData.sources.length > 0 && (
                <div className={styles.sources}>
                  <h3>References</h3>
                  <ol className={styles.referencesList}>
                    {mapData.sources.map((ref, idx) => (
                      <li key={idx} className={styles.referenceItem}>
                        {/* Example: "United Nations (2023)" */}
                        {ref.sourceName || 'Unknown'} 
                        {ref.publicationYear ? ` (${ref.publicationYear})` : ''}

                        {/* If there's a URL, display it in brackets */}
                        {ref.url && (
                          <>
                            {' '}
                            - [
                            <a href={ref.url} target="_blank" rel="noopener noreferrer">
                              {ref.url}
                            </a>
                            ]
                          </>
                        )}

                        {/* If there's notes, display them on a new line */}
                        {ref.notes && (
                          <div className={styles.referenceNotes}>
                            Notes: {ref.notes}
                          </div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            </div>
            {/* Comments Section */}
            <div className={styles.discussionSection} ref={discussionRef}>
              <h2>Discussion</h2>
              {isPublic ? (
                <>
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
                        const areRepliesExpanded = expandedReplies[comment.id];
                        const repliesArray = comment.Replies || [];
                        const totalReplies = repliesArray.length;
                        const repliesToShow = areRepliesExpanded
                          ? repliesArray.slice(0, 10)
                          : repliesArray.slice(0, 3);

                        return (
                          <li key={index} className={styles.commentItem}>
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
                                <div className={styles.commentActions}>
                                  <button
                                    className={`${styles.reactionButton} ${
                                      comment.userReaction === 'like' ? styles.active : ''
                                    }`}
                                    onClick={() => handleLike(comment.id)}
                                  >
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
                                    <svg className={styles.icon} viewBox="0 0 24 24">
                                      <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06L9.83 22l6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
                                    </svg>
                                    <span>{comment.dislikeCount}</span>
                                  </button>
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

                                  {(isOwner || (comment.User && comment.User.username === profile?.username)) && (
                                    <button
                                      className={styles.deleteButton}
                                      onClick={() => handleDeleteCommentWithConfirm(comment.id)}
                                    >
                                      Delete
                                    </button>
                                  )}
                                </div>

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

                                {comment.Replies && comment.Replies.length > 0 && (
                                  <ul className={styles.repliesList}>
                                    {repliesToShow.map((reply, idx) => (
                                      <li key={idx} className={styles.replyItem}>
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
                                              <button
                                                className={`${styles.reactionButton} ${
                                                  reply.userReaction === 'like' ? styles.active : ''
                                                }`}
                                                onClick={() => handleLike(reply.id)}
                                              >
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
                                                <svg className={styles.icon} viewBox="0 0 24 24">
                                                  <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06L9.83 22l6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
                                                </svg>
                                                <span>{reply.dislikeCount}</span>
                                              </button>

                                              {(isOwner || (reply.User && reply.User.username === profile?.username)) && (
                                                <button
                                                  className={styles.deleteButton}
                                                  onClick={() => handleDeleteCommentWithConfirm(reply.id)}
                                                >
                                                  Delete
                                                </button>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </li>
                                    ))}

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
                </>
              ) : (
                // If map is private, comments are not available
                <p>Comments are not available for private maps.</p>
              )}
            </div>
          </div>

          {/* Right Side: Statistics */}
          <div className={styles.mapStats}>
            <div className={styles.statsSummary}>
             
            <div className={styles.statItem}>
              <span className={styles.statValue}>{formatValue(maxEntry.value)}</span>
              <span className={styles.statLabel}>Highest Value</span>
              <p>{maxEntry.countryName}</p>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statValue}>{formatValue(minEntry.value)}</span>
              <span className={styles.statLabel}>Lowest Value</span>
              <p>{minEntry.countryName}</p>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statValue}>{formatValue(avgValue)}</span>
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

function mapDataProps() {
  return {
    groups: mapData.groups,
    mapTitleValue: mapData.title,
    oceanColor: mapData.oceanColor,
    unassignedColor: mapData.unassignedColor,
    showTopHighValues: mapData.showTopHighValues,
    showTopLowValues: mapData.showTopLowValues,
    data: mapData.data,
    selectedMap: mapData.selectedMap,
    fontColor: mapData.fontColor,
    topHighValues: mapData.topHighValues,
    topLowValues: mapData.topLowValues,
    isTitleHidden: mapData.isTitleHidden
  };
}
}
