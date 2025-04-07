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
  setCommentReaction,
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  incrementMapDownloadCount,
  deleteComment
} from '../api';
import countries from '../world-countries.json';
import Header from './Header'; 
import LoadingSpinner from './LoadingSpinner'; 
import { FaDownload } from 'react-icons/fa'; // icon for download
import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize';

import { reportComment } from '../api'; // import at top
import { FaLock } from 'react-icons/fa';


export default function MapDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mapData, setMapData] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [save_count, setSaveCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const [is_public, setIsPublic] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedReplies, setExpandedReplies] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [viewBox, setViewBox] = useState('0 0 2754 1398');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);


  const [download_count, setDownloadCount] = useState(0);

  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isPostingReply, setIsPostingReply] = useState(false);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();

  const [showLoginModal, setShowLoginModal] = useState(false);

// In both MapDetail and Dashboard (or better yet, in a top-level layout)
useEffect(() => {
  if (width < 1000) setIsCollapsed(true);
  else setIsCollapsed(false);
}, [width, setIsCollapsed]);



    // For reporting a comment
  const [reportTargetComment, setReportTargetComment] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // The user’s chosen reasons, e.g. ["Spam","Inappropriate"]
  const [reportReasons, setReportReasons] = useState('');
  // If the user picks "Other," they can enter details
  const [reportDetails, setReportDetails] = useState('');

  const [isReporting, setIsReporting] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);
  

  const { authToken, profile } = useContext(UserContext);

  const discussionRef = useRef(null);
  const countryListRef = useRef(null);
  const isPanning = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  // Ref for the map display container
  const mapDisplayRef = useRef(null);

  // near the top:
const [fetchError, setFetchError] = useState(false);

useEffect(() => {
  let timer;
  async function getMapData() {
    setIsLoading(true);
    try {
      timer = setTimeout(() => {
        if (isLoading) {
          setFetchError(true);
          setIsLoading(false);
        }
      }, 10000);

      const res = await fetchMapById(id);
      setMapData(res.data);
      setSaveCount(res.data.save_count || 0);
      setIsSaved(res.data.isSavedByCurrentUser || false);
      setIsOwner(res.data.isOwner || false);
      setIsPublic(res.data.is_public);
    } catch (err) {
      setFetchError(true);
    } finally {
      setIsLoading(false);
      clearTimeout(timer);
    }
  }
  getMapData();

  // Cleanup
  return () => clearTimeout(timer);
}, [id]);



  useEffect(() => {
    const updateCountryListHeight = () => {
      if (discussionRef.current && countryListRef.current) {
        const discussionHeight = discussionRef.current.offsetHeight;
        countryListRef.current.style.height = `${discussionHeight + 150}px`;
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
    if (mapData.selected_map === 'usa') {
      setViewBox('-90 -10 1238 610');   // after editing the raw US SVG
    } else if (mapData.selected_map === 'europe') {
      setViewBox('-50 0 700 520');    // after editing the raw Europe SVG
    } else {
      setViewBox('0 0 2754 1398');  // world
    }
  }, [mapData]);

  
  useEffect(() => {
    const getComments = async () => {
      try {
        console.log('Fetching comments for map ID:', id);
        const res = await fetchComments(id);
        console.log('Comments response from server:', res.data);
        console.log("Fetched comments:", res.data);

        setComments(res.data);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
      }
    };
    getComments();
  }, [id]);
  

  useEffect(() => {
    // Once mapData is loaded, set the local state for download_count
    if (mapData) {
      setDownloadCount(mapData.download_count || 0);
    }
  }, [mapData]);

  useEffect(() => {
    const getComments = async () => {
      const res = await fetchComments(id);
      setComments(res.data);
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
    if (!is_public) return;
    if (!isUserLoggedIn) {
        setShowLoginModal(true);
        return;
      }
      
    try {
      let response;
      if (isSaved) {
        response = await unsaveMap(id);
      } else {
        response = await saveMap(id);
      }
      
      // Update state only after successful API call
      setIsSaved(!isSaved);
      setSaveCount(prev => isSaved ? prev - 1 : prev + 1);
    } catch (err) {
      console.error('Save/Unsave failed:', err);
      // Optionally show error message to user
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
        setShowLoginModal(true);
        return;
      }
  
    // 1) Turn on the loading state
    setIsPostingComment(true);
  
    try {
      const res = await postComment(id, { content: newComment });
      console.log('DEBUG postComment response:', res);
  
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    } finally {
      // 2) Always turn off the loading state when done
      setIsPostingComment(false);
    }
  };
  
  

  const handleReplySubmit = async (e, parent_comment_id) => {
    e.preventDefault();
    const replyContent = replyingTo.content;
    if (!replyContent.trim()) return;
  
    if (!isUserLoggedIn) {
        setShowLoginModal(true);
        return;
      }
  
    // 1) Indicate we are posting a reply
    setIsPostingReply(true);
  
    try {
      const res = await postComment(id, { content: replyContent, parent_comment_id });
      console.log('Reply post response:', res.data);
  
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment.id === parent_comment_id) {
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
    } finally {
      // 2) End the posting state
      setIsPostingReply(false);
    }
  };
  
  

// Update handleLike and handleDislike functions

function handleLike(comment_id, currentReaction) {
    if (!isUserLoggedIn) {
        setShowLoginModal(true);
        return;
      }
  // If user currently has 'like', next click => remove reaction (null)
  const desiredReaction = currentReaction === 'like' ? null : 'like';
  
  setCommentReaction(comment_id, desiredReaction)
    .then((res) => {
      // res.data => { like_count, dislike_count, userReaction }
      if (res.data) {
        setComments((prevComments) =>
          updateCommentReaction(prevComments, comment_id, {
            like_count: res.data.like_count,
            dislike_count: res.data.dislike_count,
            userReaction: res.data.userReaction,
          })
        );
      }
    })
    .catch((err) => console.error('handleLike error:', err));
}

function handleDislike(comment_id, currentReaction) {
    if (!isUserLoggedIn) {
        setShowLoginModal(true);
        return;
      }
  // If user currently 'dislike', clicking "Dislike" => remove reaction
  const desiredReaction = currentReaction === 'dislike' ? null : 'dislike';

  setCommentReaction(comment_id, desiredReaction)
    .then((res) => {
      if (res.data) {
        setComments((prevComments) =>
          updateCommentReaction(prevComments, comment_id, {
            like_count: res.data.like_count,
            dislike_count: res.data.dislike_count,
            userReaction: res.data.userReaction,
          })
        );
      }
    })
    .catch((err) => console.error('handleDislike error:', err));
}



// Update the helper function
function updateCommentReaction(prevComments, comment_id, updatedData) {
  return prevComments.map((comment) => {
    // Check top-level comment
    if (comment.id === comment_id) {
      return {
        ...comment,
        like_count: updatedData.like_count,
        dislike_count: updatedData.dislike_count,
        userReaction: updatedData.userReaction
      };
    }
    
    // Check replies
    if (comment.Replies?.length) {
      return {
        ...comment,
        Replies: comment.Replies.map(reply => 
          reply.id === comment_id ? {
            ...reply,
            like_count: updatedData.like_count,
            dislike_count: updatedData.dislike_count,
            userReaction: updatedData.userReaction
          } : reply
        )
      };
    }
    
    return comment;
  });
}


  const toggleReplies = (comment_id) => {
    setExpandedReplies((prevState) => ({
      ...prevState,
      [comment_id]: !prevState[comment_id],
    }));
  };

    // CANCEL REPLY => setReplyingTo(null)
  const handleReplyCancel = () => {
    setReplyingTo(null);
  };

  const handleDeleteCommentWithConfirm = (comment_id) => {
    // Show a confirmation dialog
    if (window.confirm("Are you sure you want to delete this comment?")) {
      handleDeleteComment(comment_id);
    }
  };
  

  const handleDeleteComment = async (comment_id) => {
    try {
      await deleteComment(comment_id);    // call the API
      // Now remove the comment or reply in local state
      setComments((prevComments) => removeCommentOrReply(prevComments, comment_id));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };
  
  function removeCommentOrReply(comments, comment_idToRemove) {
    // This function returns a new array of comments 
    // with the specified comment/reply removed.
    return comments
      .filter((comment) => comment.id !== comment_idToRemove) // remove top-level if matches
      .map((comment) => {
        // also remove from any replies
        if (comment.Replies && comment.Replies.length > 0) {
          return {
            ...comment,
            Replies: comment.Replies.filter((r) => r.id !== comment_idToRemove),
          };
        }
        return comment;
      });
  }
  
  function handleToggleReason(e) {
    setReportReasons(e.target.value);
  }
  

  const reportedComment = findCommentById(comments, reportTargetComment);

  
  

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
        prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
      );
      navigate(`/map/${notification.map_id}`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  





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

  const timeAgo = mapData?.created_at
  ? formatDistanceToNow(new Date(mapData.created_at), { addSuffix: true })
  : null;

  const countryCodeToName = countries.reduce((acc, country) => {
    acc[country.code] = country.name;
    return acc;
  }, {});

  const entries = (mapData?.data || [])
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
  
      // 1) Clone the SVG
      const svgClone = originalSvg.cloneNode(true);
  
      // 2) Find and remove <foreignObject>, replace with <text>
      const foreignObject = svgClone.querySelector('foreignObject');
      if (foreignObject) {
        const div = foreignObject.querySelector('div');
        const titleText = div ? div.textContent.trim() : '';
  
        const x = parseFloat(foreignObject.getAttribute('x') || '170');
        const y = parseFloat(foreignObject.getAttribute('y') || '100');
        const width = parseFloat(foreignObject.getAttribute('width') || '250');
        // If the DB has no size, fallback to 28
        const dbFontSize = mapData.title_font_size || 28;
  
        foreignObject.remove();
  
        // **Use the new robust wrap function that breaks long words if needed.**
        const lines = wrapTextIntoLines(
          titleText,
          dbFontSize,
          width,
          'bold',
          mapData.font_color || '#333'
        );
  
        // Create <text>
        const textElement = document.createElementNS('http://www.w3.org/2000/svg','text');
        textElement.setAttribute('x', x.toString());
        textElement.setAttribute('y', y.toString());
        textElement.setAttribute('dominant-baseline','hanging');
        textElement.setAttribute('fill', mapData.font_color || '#333');
        textElement.setAttribute('font-weight','bold');
        textElement.setAttribute('font-size', dbFontSize.toString());
        textElement.setAttribute(
          'font-family',
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', " +
            "'Ubuntu', 'Cantarell', 'Fira Sans','Droid Sans','Helvetica Neue', sans-serif"
        );
  
        // lines => array of wrapped lines
        lines.forEach((line, index) => {
          const tspan = document.createElementNS('http://www.w3.org/2000/svg','tspan');
          tspan.setAttribute('x', x.toString());
          const lineHeight = dbFontSize * 1.2;
          const tspanY = y + index * lineHeight;
          tspan.setAttribute('y', tspanY.toString());
          tspan.textContent = line;
          textElement.appendChild(tspan);
        });
  
        svgClone.appendChild(textElement);
      }
  
      // 3) (Optional) Override viewBox for US/EU/World
      if (mapData?.selected_map === 'europe') {
        svgClone.setAttribute('viewBox', '-50 0 700 520');
      } else if (mapData?.selected_map === 'usa') {
        svgClone.setAttribute('viewBox', '-90 -10 1238 610');
      } else {
        svgClone.setAttribute('viewBox','0 0 2754 1398');
      }
  
      // 4) Remove certain elements
      const circles = svgClone.querySelectorAll('.circlexx, .subxx, .noxx, .unxx');
      circles.forEach((el) => el.remove());
  
      // 5) Inline styles
      const allElements = svgClone.querySelectorAll('*');
      allElements.forEach((el) => {
        const computed = window.getComputedStyle(el);
        if (['path','polygon','circle'].includes(el.tagName.toLowerCase())) {
          el.setAttribute('stroke', computed.stroke || '#4b4b4b');
          el.setAttribute('stroke-width', computed.strokeWidth || '0.5');
          if (computed.fill && computed.fill !== 'none') {
            el.setAttribute('fill', computed.fill);
          }
        }
        if (el.tagName.toLowerCase() === 'text') {
          el.setAttribute(
            'font-family',
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto','Oxygen'," + 
              "'Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue',sans-serif"
          );
          // Example logic to set normal/bold on legend items
          if (el.closest('#legend')) {
            el.setAttribute('font-weight', 'normal');
          } else if (
            el.parentElement &&
            el.parentElement.querySelector('circle') &&
            el.parentElement.querySelector('circle').getAttribute('cx') === '200'
          ) {
            el.setAttribute('font-weight', 'normal');
          } else {
            el.setAttribute('font-weight', 'bold');
          }
        }
      });
  
      // 6) Serialize the cloned SVG & create an <img>
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
  
      const img = new Image();
      img.onload = async function () {
        // 7) Prepare canvas with your scaleFactor
        const forcedViewBox = svgClone.getAttribute('viewBox');
        const scaleFactor = 3;
        let width, height;
  
        if (forcedViewBox) {
          const [vbX, vbY, vbWidth, vbHeight] = forcedViewBox.split(' ').map(parseFloat);
          width = vbWidth * scaleFactor;
          height = vbHeight * scaleFactor;
        } else {
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
  
        // Draw cloned <img> to canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
  
        // 8) (Optional) Add your logo
        const smallerSide = Math.min(width, height);
        const padding = 20;
  
        const logoImg = new Image();
        logoImg.onload = async function () {
          // a) Draw logo with alpha
          const logoRatio = 0.1;
          const logoWidth = smallerSide * logoRatio;
          const logoHeight = logoImg.height * (logoWidth / logoImg.width);
  
          ctx.save();
          ctx.globalAlpha = 0.5;
          ctx.drawImage(
            logoImg,
            padding,
            canvas.height - logoHeight - padding,
            logoWidth,
            logoHeight
          );
          ctx.restore();
  
          // b) Draw references in bottom-right
          const textRatio = 0.025;
          const fontSize = smallerSide * textRatio;
          const lineHeight = fontSize * 1.3;
  
          ctx.fillStyle = mapData.font_color || '#333';
          ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
  
          const sources = mapData.sources || [];
          if (sources.length > 0) {
            const refStrings = sources.map((ref) => {
              let line = ref.sourceName || 'Unknown';
              if (ref.publicationYear) line += ` (${ref.publicationYear})`;
              if (ref.publicator) line += `. ${ref.publicator}.`;
              return line;
            });
  
            let textX = canvas.width - padding;
            let textY = canvas.height - padding;
  
            for (let i = refStrings.length - 1; i >= 0; i--) {
              ctx.fillText(refStrings[i], textX, textY);
              textY -= lineHeight;
            }
          }
  
          // c) Convert canvas to Blob and prompt download
          canvas.toBlob(async (blob) => {
            try {
              const res = await incrementMapDownloadCount(mapData.id);
              if (res.data.download_count != null) {
                setDownloadCount(res.data.download_count);
              }
            } catch (err) {
              console.error('Error incrementing download:', err);
            }
  
            const link = document.createElement('a');
            link.download = `${mapData.title || 'map'}.png`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, 'image/png');
        };
  
        // If logo fails
        logoImg.onerror = async function () {
          console.error('Logo failed to load. Proceeding without logo.');
          try {
            const res = await incrementMapDownloadCount(mapData.id);
            if (res.data.download_count != null) {
              setDownloadCount(res.data.download_count);
            }
          } catch (err) {
            console.error('Error incrementing download:', err);
          }
  
          // (Optional) draw references anyway
          const textRatio = 0.025;
          const fontSize = smallerSide * textRatio;
          const lineHeight = fontSize * 1.3;
  
          ctx.fillStyle = mapData.font_color || '#333';
          ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
  
          const sources = mapData.sources || [];
          if (sources.length > 0) {
            const refStrings = sources.map((ref) => {
              let line = ref.sourceName || 'Unknown';
              if (ref.publicationYear) line += ` (${ref.publicationYear})`;
              if (ref.publicator) line += `. ${ref.publicator}.`;
              return line;
            });
  
            let textX = canvas.width - padding;
            let textY = canvas.height - padding;
  
            for (let i = refStrings.length - 1; i >= 0; i--) {
              ctx.fillText(refStrings[i], textX, textY);
              textY -= lineHeight;
            }
          }
  
          // Trigger download
          canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = `${mapData.title || 'map'}.png`;
            link.href = URL.createObjectURL(blob);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }, 'image/png');
        };
  
        // Start loading the actual logo
        logoImg.src = '/assets/map-in-color-logo.png';
      };
      img.src = url;
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  
  
  // Right before the return, handle the special cases:
  // 1) If we have an error
  if (fetchError) {
    return (
      <div className={styles.mapDetailContainer}>
        <Sidebar />
        <div className={styles.mapDetailContent}>
          <div className={styles.errorBox}>
            <h2>Map not available</h2>
            <p>We couldn’t load this map right now. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  // 2) If loading but the map is private + not owner => locked
  if (isLoading && is_public === false && !isOwner) {
    return (
      <div className={styles.mapDetailContainer}>
        <Sidebar />
        <div className={styles.mapDetailContent}>
          <div className={styles.privateMapBox}>
            <FaLock className={styles.lockIcon} />
            <h2>This map is private</h2>
            <p>You do not have permission to view this map.</p>
          </div>
        </div>
      </div>
    );
  }

  // 3) If loading => show the skeleton for everything
  if (isLoading) {
    return (
      <div className={styles.mapDetailContainer}>
        <Sidebar />
        <div className={styles.mapDetailContent}>
          {/* --- SKELETON STARTS HERE --- */}
          <div className={styles.mapDisplay}>
            {/* Large map placeholder */}
            <div className={styles.skeletonRow} style={{ height: '400px', borderRadius: '8px' }}/>
          </div>

          <div className={styles.detailsAndStats} style={{ marginTop: '20px' }}>
            {/* LEFT side: mapDetails + discussion */}
            <div className={styles.leftContent}>
              {/* MAP DETAILS SKELETON */}
              <div className={styles.mapDetails} style={{ marginBottom: '20px' }}>
                {/* Title line */}
                <div className={styles.skeletonRow}  style={{ height: '24px', width: '60%', marginBottom: '10px' }} />
                {/* A couple more lines for the description */}
                <div className={styles.skeletonRow}  style={{ height: '16px', width: '90%', marginBottom: '8px' }} />
                <div className={styles.skeletonRow}  style={{ height: '16px', width: '80%', marginBottom: '8px' }} />
                {/* A row of tags */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <div className={styles.skeletonRow}  style={{ width: '60px', height: '24px' }}/>
                  <div className={styles.skeletonRow}  style={{ width: '60px', height: '24px' }}/>
                  <div className={styles.skeletonRow}  style={{ width: '60px', height: '24px' }}/>
                </div>
              </div>

              {/* DISCUSSION SKELETON */}
              <div className={styles.discussionSection}>
                <div className={styles.skeletonSectionTitle} style={{ width: '100px', height: '18px', marginBottom: '16px' }} />
                {/* pretend we have two or three "comment" placeholders */}
                {[1,2,3].map((i) => (
                  <div className={styles.skeletonRow}  key={i} style={{ marginBottom: '20px' }}>
                    <div className={styles.skeletonThumb} style={{ width: '50px', height: '50px' }}/>
                    <div className={styles.skeletonTextBlock}>
                      <div className={styles.skeletonLine} style={{ height: '14px', marginBottom: '6px' }} />
                      <div className={styles.skeletonLine} style={{ width: '80%', height: '14px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT side: stats */}
            <div className={styles.mapStats}>
              <div className={styles.statsSummary}>
                <div className={styles.skeletonStatItem} style={{ marginBottom: '10px' }} />
                <div className={styles.skeletonStatItem} style={{ marginBottom: '10px' }} />
                <div className={styles.skeletonStatItem} style={{ marginBottom: '10px' }} />
              </div>

              <div className={styles.countryList} style={{ marginTop: '10px' }}>
                {/* A few skeleton rows for the table */}
                {[1,2,3,4].map((i) => (
                  <div className={styles.skeletonRow} key={i} style={{ height: '20px', marginBottom: '8px' }}/>
                ))}
              </div>
            </div>
          </div>
          {/* --- END SKELETON --- */}
        </div>
      </div>
    );
  }

  // 4) If no data
  if (!mapData) {
    return null;
  }

  // 5) If private & not owner => locked
  if (mapData.is_public === false && !mapData.isOwner) {
    return (
      <div className={styles.mapDetailContainer}>
        <Sidebar />
        <div className={styles.mapDetailContent}>
          <div className={styles.privateMapBox}>
            <FaLock className={styles.lockIcon} />
            <h2>This map is private</h2>
            <p>You do not have permission to view this map.</p>
          </div>
        </div>
      </div>
    );
  }



  return (
    <div className={styles.mapDetailContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
  
      <div
        className={`${styles.mapDetailContent} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        {/* <Header
          title={`${mapData?.user?.username} / ${mapData.title || 'Untitled Map'}`}
          notifications={notifications.slice(0, 6)}
          onNotificationClick={handleNotificationClick}
          onMarkAllAsRead={handleMarkAllAsRead}
          profile_picture={profile?.profile_picture}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        /> */}
  
        {/* Map Display */}
        <div
          className={styles.mapDisplay}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: 'grab', position: 'relative' }}
        >
          {mapData.selected_map === 'world' && (
            <WorldMapSVG {...mapDataProps()} viewBox={viewBox} isLargeMap={false} />
          )}
          {mapData.selected_map === 'usa' && (
            <UsSVG {...mapDataProps()} viewBox={viewBox} isLargeMap={false} />
          )}
          {mapData.selected_map === 'europe' && (
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
  
{/*
  DETAILS + STATS + DISCUSSION
  We'll have a container .detailsAndStats that has:
    1) .leftContent
         - .mapDetails (top)
         - .discussionSection (below)
    2) .mapStats
  On phone, we reorder so .mapStats comes above the .discussionSection.
*/}
<div className={styles.detailsAndStats}>
  {/* LEFT column: Map Details + Discussion */}
  <div className={styles.leftContent}>
    {/* MAP DETAILS */}
    <div className={styles.mapDetails}>
      {/* Title / Save / Download */}
      <div className={styles.titleSection}>
        <h1>
          {mapData.title || 'Untitled Map'}
          {isOwner && (
            <span className={styles.visibilityTag}>
              {is_public ? 'Public' : 'Private'}
            </span>
          )}
        </h1>

        {/* If you’re the map owner, show Edit button */}
        {isOwner && (
          <button className={styles.editButton} onClick={handleEdit}>
            Edit Map
          </button>
        )}

        {/* Show star & download if map is public or you are the owner */}
        {(is_public || isOwner) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Star/save button always visible. If not logged in => modal */}
            {is_public && (
              <button
                className={styles.saveButton}
                onClick={() => {
                  if (!isUserLoggedIn) {
                    setShowLoginModal(true);
                    return;
                  }
                  handleSave(); // if logged in, do normal logic
                }}
              >
                {isSaved ? '★' : '☆'} {save_count}
              </button>
            )}

            {/* Download is always allowed */}
            <button className={styles.saveButton} onClick={handleDownload}>
              <BiDownload /> {download_count}
            </button>
          </div>
        )}
      </div>

      {timeAgo && <p className={styles.created_at}>Created {timeAgo}</p>}

      {/* Creator Info */}
      <div className={styles.creatorInfo}>
        {/* If user is not logged in, clicking profile => show modal */}
        {isUserLoggedIn ? (
          <Link
            to={`/profile/${mapData?.user?.username || 'unknown'}`}
            className={styles.creatorProfileLink}
          >
            <img
              src={
                mapData.user?.profile_picture
                  ? mapData.user.profile_picture
                  : '/default-profile-pic.jpg'
              }
              alt={`${
                mapData.user?.first_name ||
                mapData?.user?.username ||
                'unknown'
              }'s profile`}
              className={styles.creatorProfilePicture}
            />
            <span className={styles.creatorName}>
              {mapData.user.first_name || ''} {mapData.user.last_name || ''}
            </span>
          </Link>
        ) : (
          <div
            className={styles.creatorProfileLink}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowLoginModal(true)}
          >
            <img
              src={
                mapData.user?.profile_picture
                  ? mapData.user.profile_picture
                  : '/default-profile-pic.jpg'
              }
              alt="Creator's profile"
              className={styles.creatorProfilePicture}
            />
            <span className={styles.creatorName}>
              {mapData.user.first_name || ''} {mapData.user.last_name || ''}
            </span>
          </div>
        )}
      </div>

      <p className={styles.description}>{mapData.description}</p>

      {/* Tags */}
      <div className={styles.tags}>
        {mapData.tags &&
          mapData.tags.map((tag, index) => (
            <span
              key={index}
              className={styles.mapTag}
              onClick={() =>
                navigate(`/explore?tags=${encodeURIComponent(tag.toLowerCase())}`)
              }
              title={`See all maps with the tag "${tag}"`}
            >
              {tag}
            </span>
          ))}
      </div>

      {/* References */}
      {mapData.sources && mapData.sources.length > 0 && (
        <div className={styles.sources}>
          <h3>References</h3>
          <ol className={styles.referencesList}>
            {mapData.sources.map((ref, idx) => (
              <li key={idx} className={styles.referenceItem}>
                {ref.sourceName || 'Unknown'}
                {ref.publicationYear ? ` (${ref.publicationYear})` : ''}
                {ref.publicator ? `. ${ref.publicator}` : ''}

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

    {/* DISCUSSION SECTION (below map details on desktop) */}
    <div className={styles.discussionSection} ref={discussionRef}>
      <h2>Discussion</h2>

      {/* Only show the comment form if map is public AND user is logged in. */}
      {(is_public && isUserLoggedIn) && (
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            required
            className={styles.commentTextarea}
          />
          <button
            type="submit"
            className={styles.commentButton}
            disabled={isPostingComment}
          >
            Post
          </button>
        </form>
      )}

      {/* Show existing comments if the map is public (even if user is not logged in) */}
      {is_public ? (
        <>
          {comments.length > 0 ? (
            <ul className={styles.commentsList}>
              {comments.map((comment) => {
                const areRepliesExpanded = expandedReplies[comment.id] || false;
                const repliesArray = comment.Replies || [];
                const totalReplies = repliesArray.length;
                const repliesToShow = areRepliesExpanded
                  ? repliesArray
                  : repliesArray.slice(0, 3);

                return (
                  <li key={comment.id} className={styles.commentItem}>
                    <div className={styles.commentHeader}>
                      {/* Profile link => if not logged in => show modal */}
                      {comment.user && comment.user.profile_picture ? (
                        isUserLoggedIn ? (
                          <Link
                            to={`/profile/${comment?.user?.username || 'unknown'}`}
                          >
                            <img
                              src={
                                comment.user?.profile_picture ||
                                '/default-profile-pic.jpg'
                              }
                              alt={`${comment?.user?.username || 'unknown'}'s profile`}
                              className={styles.commentProfilePicture}
                            />
                          </Link>
                        ) : (
                          <div
                            className={styles.commentProfilePicture}
                            style={{ cursor: 'pointer' }}
                            onClick={() => setShowLoginModal(true)}
                          >
                            <img
                              src={
                                comment.user?.profile_picture ||
                                '/default-profile-pic.jpg'
                              }
                              alt="Profile"
                              className={styles.commentProfilePicture}
                            />
                          </div>
                        )
                      ) : (
                        <div className={styles.commentPlaceholder}></div>
                      )}

                      <div className={styles.commentContentWrapper}>
                        <div className={styles.commentInfo}>
                          {/* Username link => if not logged in => modal */}
                          {isUserLoggedIn ? (
                            <Link
                              to={`/profile/${comment?.user?.username || 'unknown'}`}
                              className={styles.commentAuthorLink}
                            >
                              <span className={styles.commentAuthor}>
                                {comment.user.username || 'Unknown'}
                              </span>
                            </Link>
                          ) : (
                            <span
                              className={styles.commentAuthor}
                              style={{ cursor: 'pointer' }}
                              onClick={() => setShowLoginModal(true)}
                            >
                              {comment.user.username || 'Unknown'}
                            </span>
                          )}

                          <span className={styles.commentTime}>
                            {formatDistanceToNow(new Date(comment.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>

                        <p className={styles.commentContent}>{comment.content}</p>

                        <div className={styles.commentActions}>
                          {/* Like is visible. If not logged in => show modal instead of handleLike */}
                          <button
                            className={`${styles.reactionButton} ${
                              comment.userReaction === 'like' ? styles.active : ''
                            }`}
                            onClick={() => {
                              if (!isUserLoggedIn) {
                                setShowLoginModal(true);
                                return;
                              }
                              handleLike(comment.id, comment.userReaction);
                            }}
                          >
                            {/* Like icon */}
                            <svg
                              className={styles.icon}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
                            </svg>
                            <span>{comment.like_count}</span>
                          </button>

                          {/* Dislike is visible. If not logged in => show modal instead of handleDislike */}
                          <button
                            className={`${styles.reactionButton} ${
                              comment.userReaction === 'dislike' ? styles.active : ''
                            }`}
                            onClick={() => {
                              if (!isUserLoggedIn) {
                                setShowLoginModal(true);
                                return;
                              }
                              handleDislike(comment.id, comment.userReaction);
                            }}
                          >
                            {/* Dislike icon */}
                            <svg
                              className={styles.icon}
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06l1.39 1.41 6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
                            </svg>
                            <span>{comment.dislike_count}</span>
                          </button>

                          {/* Reply button => hidden if not logged in */}
                          {isUserLoggedIn && (
                            <button
                              className={styles.reactionButton}
                              onClick={() =>
                                setReplyingTo({ comment_id: comment.id, content: '' })
                              }
                            >
                              <svg
                                className={styles.icon}
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M10 9V5l-7 7 7 7v-4.1c4.55 0 7.83 1.24 10.27 3.32-.4-4.28-2.92-7.39-10.27-7.39z" />
                              </svg>
                              <span>Reply</span>
                            </button>
                          )}

                          {/* Delete => only if user is the comment owner (and presumably isUserLoggedIn) */}
                          {comment.user?.username === profile?.username && (
                            <button
                              className={styles.reactionButton}
                              onClick={() => handleDeleteCommentWithConfirm(comment.id)}
                            >
                              <svg
                                className={styles.icon}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h1v12a2 2 0 002 2h10a2 2 0 002-2V6h1a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0015 2H9zM10 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
                              </svg>
                              <span>Delete</span>
                            </button>
                          )}

                          {/* Report => hidden if not logged in */}
                          {isUserLoggedIn && comment.user?.username !== profile?.username && (
                            <button
                              className={styles.reactionButton}
                              onClick={() => {
                                setReportTargetComment(comment.id);
                                setShowReportModal(true);
                              }}
                            >
                              <svg
                                className={styles.icon}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M5 5v14h2V5H5zm2 0l10 4-10 4V5z" />
                              </svg>
                              <span>Report</span>
                            </button>
                          )}
                        </div>

                        {/* If replying */}
                        {replyingTo && replyingTo.comment_id === comment.id && (
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
                            />
                            <div className={styles.replyActions}>
                              <button
                                type="button"
                                className={styles.replyCancelButton}
                                onClick={handleReplyCancel}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className={styles.replyButtonSubmit}
                                disabled={isPostingReply}
                              >
                                Post
                              </button>
                            </div>
                          </form>
                        )}

                        {/* Replies */}
                        {repliesArray.length > 0 && (
                          <ul className={styles.repliesList}>
                            {repliesToShow.map((reply) => (
                              <li key={reply.id} className={styles.replyItem}>
                                <div className={styles.commentHeader}>
                                  {reply.user?.profile_picture ? (
                                    isUserLoggedIn ? (
                                      <Link to={`/profile/${reply.user.username}`}>
                                        <img
                                          src={
                                            reply.user?.profile_picture ||
                                            '/default-profile-pic.jpg'
                                          }
                                          alt={`${reply.user.username}'s profile`}
                                          className={styles.commentProfilePicture}
                                        />
                                      </Link>
                                    ) : (
                                      <div
                                        className={styles.commentProfilePicture}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => setShowLoginModal(true)}
                                      >
                                        <img
                                          src={
                                            reply.user?.profile_picture ||
                                            '/default-profile-pic.jpg'
                                          }
                                          alt="Profile"
                                          className={styles.commentProfilePicture}
                                        />
                                      </div>
                                    )
                                  ) : (
                                    <div className={styles.commentPlaceholder}></div>
                                  )}

                                  <div className={styles.commentContentWrapper}>
                                    <div className={styles.commentInfo}>
                                      {isUserLoggedIn ? (
                                        <Link
                                          to={`/profile/${
                                            reply.user?.username || 'unknown'
                                          }`}
                                          className={styles.commentAuthorLink}
                                        >
                                          <span className={styles.commentAuthor}>
                                            {reply.user?.username || 'Unknown'}
                                          </span>
                                        </Link>
                                      ) : (
                                        <span
                                          className={styles.commentAuthor}
                                          style={{ cursor: 'pointer' }}
                                          onClick={() => setShowLoginModal(true)}
                                        >
                                          {reply.user?.username || 'Unknown'}
                                        </span>
                                      )}

                                      <span className={styles.commentTime}>
                                        {formatDistanceToNow(
                                          new Date(reply.created_at),
                                          { addSuffix: true }
                                        )}
                                      </span>
                                    </div>

                                    <p className={styles.commentContent}>{reply.content}</p>

                                    <div className={styles.commentActions}>
                                      {/* Like/dislike => visible to all, but modal if not logged in */}
                                      <button
                                        className={`${styles.reactionButton} ${styles.reactionButtonSmall} ${
                                          reply.userReaction === 'like' ? styles.active : ''
                                        }`}
                                        onClick={() => {
                                          if (!isUserLoggedIn) {
                                            setShowLoginModal(true);
                                            return;
                                          }
                                          handleLike(reply.id, reply.userReaction);
                                        }}
                                      >
                                        <svg
                                          className={styles.iconSmall}
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
                                        </svg>
                                        <span>{reply.like_count}</span>
                                      </button>

                                      <button
                                        className={`${styles.reactionButton} ${styles.reactionButtonSmall} ${
                                          reply.userReaction === 'dislike' ? styles.active : ''
                                        }`}
                                        onClick={() => {
                                          if (!isUserLoggedIn) {
                                            setShowLoginModal(true);
                                            return;
                                          }
                                          handleDislike(reply.id, reply.userReaction);
                                        }}
                                      >
                                        <svg
                                          className={styles.iconSmall}
                                          viewBox="0 0 24 24"
                                          fill="currentColor"
                                        >
                                          <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06l1.39 1.41 6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
                                        </svg>
                                        <span>{reply.dislike_count}</span>
                                      </button>

                                      {/* Delete => only if this is your own reply */}
                                      {profile?.username === reply.user?.username && (
                                        <button
                                          className={styles.reactionButton}
                                          onClick={() =>
                                            handleDeleteCommentWithConfirm(reply.id)
                                          }
                                        >
                                          <svg
                                            className={styles.icon}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h1v12a2 2 0 002 2h10a2 2 0 002-2V6h1a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0015 2H9zM10 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
                                          </svg>
                                          <span>Delete</span>
                                        </button>
                                      )}

                                      {/* Report => only if user is logged in and not your own comment */}
                                      {isUserLoggedIn && reply.user?.username !== profile?.username && (
                                        <button
                                          className={styles.reactionButton}
                                          onClick={() => {
                                            setReportTargetComment(reply.id);
                                            setShowReportModal(true);
                                          }}
                                        >
                                          <svg
                                            className={styles.icon}
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                          >
                                            <path d="M5 5v14h2V5H5zm2 0l10 4-10 4V5z" />
                                          </svg>
                                          <span>Report</span>
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
        <p>Comments are not available for private maps.</p>
      )}
    </div>
  </div>


          {/* RIGHT column: Statistics */}
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

      {showReportModal && reportedComment && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      {isReporting ? (
        <div className={styles.loadingContainer}>
          <p>Submitting report...</p>
        </div>
      ) : showReportSuccess ? (
        <div className={styles.successContainer}>
          <p>Your report has been submitted.</p>
        </div>
      ) : (
        <>
          {/* Header with profile picture and name */}
          <div className={styles.modalHeader}>
            <img
              src={reportedComment.user?.profile_picture || '/default-profile-pic.jpg'}
              alt={`${reportedComment.user?.username}'s profile`}
              className={styles.modalProfilePicture}
            />
            <h2>{reportedComment.user?.username}</h2>
          </div>

          <h3>Report Comment</h3>
          <p>Please let us know why you are reporting this comment:</p>
          <div className={styles.reportOptions}>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Spam"
                checked={reportReasons === "Spam"}
                onChange={handleToggleReason}
              />
              Spam
            </label>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Harassment"
                checked={reportReasons === "Harassment"}
                onChange={handleToggleReason}
              />
              Harassment
            </label>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Inappropriate"
                checked={reportReasons === "Inappropriate"}
                onChange={handleToggleReason}
              />
              Inappropriate
            </label>
            <label className={styles.reportOption}>
              <input
                type="radio"
                name="reportReason"
                value="Other"
                checked={reportReasons === "Other"}
                onChange={handleToggleReason}
              />
              Other
            </label>
          </div>

          {/* Show textarea if "Other" is selected */}
          {reportReasons === "Other" && (
            <div className={styles.reportDetails}>
              <label>Please describe:</label>
              <textarea
                value={reportDetails}
                onChange={(e) => setReportDetails(e.target.value)}
                placeholder="Tell us more"
              />
            </div>
          )}

          <div className={styles.modalActions}>
            <button onClick={handleSubmitReport}>Submit</button>
            <button onClick={() => setShowReportModal(false)}>Cancel</button>
          </div>
        </>
      )}
    </div>
  </div>
)}

{showLoginModal && (
  <div className={styles.modalOverlay}>
    <div className={styles.modalContent}>
      {/* Close Button (X) */}
      <button
        className={styles.modalCloseButton}
        onClick={() => setShowLoginModal(false)}
      >
        &times;
      </button>

      {/* Left Side: Title, Subtitle, CTA */}
      <div className={styles.modalLeft}>
        <h2 className={styles.modalTitle}>
          See how people are mapping the world
        </h2>
        <p className={styles.modalSubtitle}>
        Join a worldwide community creating and exploring meaningful maps. 
        </p>
        <button
          className={styles.signupButton}
          onClick={() => navigate('/signup')}
        >
          Join for free
        </button>
        <p className={styles.loginPrompt}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} className={styles.loginLink}>
            Log In
          </span>
        </p>
      </div>

      {/* Right Side: Image */}
      <div className={styles.modalRight}>
        <img
          src="/assets/preview2.png"
          alt="Preview of the mapping features"
          className={styles.modalImage}
        />
      </div>
    </div>
  </div>
)}





    </div>
  );
  

function mapDataProps() {
  return {
    groups: mapData.groups,
    mapTitleValue: mapData.title,
    ocean_color: mapData.ocean_color,
    unassigned_color: mapData.unassigned_color,
    show_top_high_values: mapData.show_top_high_values,
    show_top_low_values: mapData.show_top_low_values,
    showNoDataLegend: mapData.show_no_data_legend,
    data: mapData.data,
    selected_map: mapData.selected_map,
    font_color: mapData.font_color,
    show_top_high_values: mapData.show_top_high_values,
    top_low_values: mapData.top_low_values,
    is_title_hidden: mapData.is_title_hidden,
    titleFontSize: mapData.title_font_size,
    legendFontSize: mapData.legend_font_size
  };
}



async function handleSubmitReport() {
  if (!reportTargetComment) return;
  
  // Start loading
  setIsReporting(true);
  
  try {
    await reportComment(reportTargetComment, {
      reasons: [reportReasons],
      details: reportDetails,
    });
    
    // Optionally update local comment state here...
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === reportTargetComment
          ? { ...comment, status: 'hidden' }
          : comment
      )
    );
    
    // Clear report fields and show success
    setReportReasons('');
    setReportDetails('');
    setShowReportSuccess(true);
    
    // Hide the modal after 3 seconds
    setTimeout(() => {
      setShowReportModal(false);
      setShowReportSuccess(false);
    }, 3000);
  } catch (err) {
    console.error('Error reporting comment:', err);
    // Optionally handle errors here (e.g., show an error message)
  } finally {
    setIsReporting(false);
  }
}

}

function findCommentById(commentsArray, targetId) {
  for (const c of commentsArray) {
    if (c.id === targetId) return c;
    if (c.Replies && c.Replies.length > 0) {
      // Look in its replies
      const found = c.Replies.find((r) => r.id === targetId);
      if (found) return found;
    }
  }
  return null;
}

/**
 * Enhanced wrapping that also breaks up super-long words 
 * if they exceed maxWidth.
 */
function wrapTextIntoLines(
  str,
  fontSize,
  maxWidth,
  fontWeight = 'normal',
  fontColor = '#333'
) {
  const words = str.trim().split(/\s+/);
  const lines = [];

  // 1) Prepare a hidden canvas to measure text widths
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, 
              'Segoe UI', 'Roboto','Oxygen','Ubuntu','Cantarell',
              'Fira Sans','Droid Sans','Helvetica Neue',sans-serif`;

  function measure(text) {
    return ctx.measureText(text).width;
  }

  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    // If adding this word to currentLine doesn't exceed maxWidth, append
    if (currentLine === '') {
      // If the word alone is bigger than maxWidth, we’ll forcibly break it up
      currentLine = breakLongWord(word, measure, maxWidth);
    } else {
      const testLine = currentLine + ' ' + word;
      if (measure(testLine) > maxWidth) {
        // Push the currentLine
        lines.push(currentLine);
        // Start a new line with 'word'—but break it if needed
        currentLine = breakLongWord(word, measure, maxWidth);
      } else {
        currentLine = testLine;
      }
    }
  }

  // push the last line
  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * If a single word is wider than maxWidth, break it into multiple parts.
 * e.g. "Supercalifragilistic..." might be chopped into segments 
 * that each fit within maxWidth.
 */
function breakLongWord(word, measureFn, maxWidth) {
  const segments = [];
  let current = '';
  for (let i = 0; i < word.length; i++) {
    const test = current + word[i];
    if (measureFn(test) > maxWidth && current !== '') {
      // current alone is as far as we can go
      segments.push(current);
      current = word[i]; // start a new segment with the current char
    } else {
      current = test;
    }
  }
  // push the remainder
  if (current) segments.push(current);

  // then join these with spaces (or newlines?), 
  // but in this scenario we just put them with hyphens or else 
  // treat each segment as separate "word" so it can re-wrap.

  // If you want each segment on a new line, you could:
  //   return segments.join('\n');
  // But we want to treat them as separate "words" for the line logic
  // so let's just combine them with spaces for now:
  return segments.join(' ');
}
