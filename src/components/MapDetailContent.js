// MapDetail.js

import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './MapDetail.module.css';
import { formatDistanceToNow } from 'date-fns';
import { UserContext } from '../context/UserContext';
import FullScreenMap from './FullScreenMap';
import { BiDownload, BiSend } from 'react-icons/bi';
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
import { FaEye, FaEyeSlash, FaStar } from 'react-icons/fa';
import { reportComment } from '../api'; // import at top
import { FaLock } from 'react-icons/fa';
import MapView from './Map';
import MapDetailValueTable from "./MapDetailValueTable";


export default function MapDetailContent({isFullScreen, toggleFullScreen}) {
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
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);


  const [download_count, setDownloadCount] = useState(0);

  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isPostingReply, setIsPostingReply] = useState(false);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();

  const [showLoginModal, setShowLoginModal] = useState(false);

// In both MapDetail and Dashboard (or better yet, in a top-level layout)




    // For reporting a comment
  const [reportTargetComment, setReportTargetComment] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // The user’s chosen reasons, e.g. ["Spam","Inappropriate"]
  const [reportReasons, setReportReasons] = useState('');
  // If the user picks "Other," they can enter details
  const [reportDetails, setReportDetails] = useState('');

  const [isReporting, setIsReporting] = useState(false);
  const [showReportSuccess, setShowReportSuccess] = useState(false);

  const [hoveredCode, setHoveredCode] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  const [activeLegendKey, setActiveLegendKey] = useState(null);
  const [hoverLegendKey, setHoverLegendKey] = useState(null);


  // controls whether Map should zoom when syncing selection
  const [selectedCodeZoom, setSelectedCodeZoom] = useState(false);

  // force sync even if code is the same (for double click zoom)
  const [selectedCodeNonce, setSelectedCodeNonce] = useState(0);


  const { authToken, profile } = useContext(UserContext);

  const [isSaving, setIsSaving] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);


  const discussionRef = useRef(null);
  const countryListRef = useRef(null);
  const isPanning = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  // Ref for the map display container
  const mapDisplayRef = useRef(null);

  // near the top:
const [fetchError, setFetchError] = useState(false);

  // ✅ Map type (always defined, even when mapData is null)
const mapType = useMemo(() => {
  const raw =
    mapData?.mapDataType ??
    mapData?.map_data_type ??
    mapData?.map_type ??
    mapData?.type ??
    "choropleth";

  return String(raw).toLowerCase();
}, [mapData]);

// ✅ Legend items (always defined, never conditional hooks)
const legendModels = useMemo(() => {
  if (!mapData) return [];

  const type = mapType; // from your existing mapType memo

  const dataArr = parseJsonArray(mapData.data);
  const codeToValue = new Map();
  for (const d of dataArr) {
    const code = String(d.code || "").trim().toUpperCase();
    if (!code) continue;
    codeToValue.set(code, d.value);
  }

  // ------- categorical (groups from DB) -------
// ------- categorical (groups from DB) -------
if (type === "categorical") {
  const groups = parseJsonArray(mapData.groups);

  // Build code -> categoryValue from data (same normalization idea as Map.js)
  const codeToCat = new Map();
  for (const d of dataArr) {
    const code = String(d.code || "").trim().toUpperCase();
    if (!code) continue;
    const cat = d.value == null ? "" : String(d.value).trim();
    codeToCat.set(code, cat);
  }

  const models = groups
    .map((g, idx) => {
      const label =
        (typeof g.title === "string" && g.title.trim())
          ? g.title.trim()
          : (g.name ?? g.label ?? "Group");

      const color =
        g.color ?? g.fill ?? g.hex ?? g.groupColor ?? g.group_color ?? "#e5e7eb";

      // 1) Try explicit countries from DB
      let codes = new Set(
        (g.countries || [])
          .map((c) => {
            const raw =
              typeof c === "string"
                ? c
                : (c?.code ?? c?.countryCode ?? c?.country_code ?? c?.id ?? "");
            return String(raw || "").trim().toUpperCase();
          })
          .filter(Boolean)
      );

      // 2) Fallback: if group has no explicit countries, derive from data values
      if (codes.size === 0) {
        // Try matching by group label/title OR group.name if present
        const matchKeyCandidates = [
          label,
          typeof g.name === "string" ? g.name.trim() : null,
          typeof g.title === "string" ? g.title.trim() : null,
          typeof g.label === "string" ? g.label.trim() : null,
        ].filter(Boolean);

        // If any candidate matches a data value, include those codes
        for (const [code, cat] of codeToCat.entries()) {
          if (!cat) continue;
          if (matchKeyCandidates.includes(cat)) {
            codes.add(code);
          }
        }
      }

      return {
        key: g.id ?? `cat-${idx}-${label}-${color}`,
        label,
        color,
        codes,
      };
    })
    .filter((m) => m.label);

  models.sort((a, b) => a.label.localeCompare(b.label));
  return models;
}


  // ------- choropleth (ranges from DB) -------
  const ranges = parseJsonArray(mapData.custom_ranges ?? mapData.customRanges);

  const numOrNull = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const models = ranges.map((r, idx) => {
    const min = numOrNull(
      r.lowerBound ?? r.min ?? r.from ?? r.start ?? r.low ?? r.lower ?? r.rangeMin
    );
    const max = numOrNull(
      r.upperBound ?? r.max ?? r.to ?? r.end ?? r.high ?? r.upper ?? r.rangeMax
    );

    const color =
      r.color ?? r.fill ?? r.hex ?? r.rangeColor ?? r.range_color ?? "#e5e7eb";

    const titleOnly =
      typeof r.title === "string" && r.title.trim() ? r.title.trim() : null;

    const label =
      titleOnly ??
      (min != null && max != null
        ? `${min} – ${max}`
        : min != null
        ? `≥ ${min}`
        : max != null
        ? `≤ ${max}`
        : "Range");

    // Countries in this bucket
    const codes = new Set();
    for (const [code, rawVal] of codeToValue.entries()) {
      const n = Number(rawVal);
      if (!Number.isFinite(n)) continue;
      // match Map.js logic: value >= lower && value < upper
      if (min != null && max != null && n >= min && n < max) {
        codes.add(code);
      }
    }

    return {
      key: r.id ?? `range-${idx}-${min}-${max}-${color}-${label}`,
      label,
      color,
      min,
      max,
      codes,
      sortValue: max != null ? max : min != null ? min : -Infinity,
    };
  }).filter(m => m.label);

  // your choropleth sorts high -> low
  models.sort((a, b) => (b.sortValue ?? -Infinity) - (a.sortValue ?? -Infinity));
  return models;
}, [mapData, mapType]);

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
      console.log("MAPDATA legend fields:", {
  mapDataType: res.data.mapDataType ?? res.data.map_data_type ?? res.data.type,
  custom_ranges: res.data.custom_ranges,
  customRanges: res.data.customRanges,
  groups: res.data.groups,
  legend: res.data.legend,
  legend_items: res.data.legend_items,
});

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
    if (isSaving) return;
      
    try {
      setIsSaving(true);
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
    }finally {
    setIsSaving(false);
  }
  };

  const handleEdit = () => {
    navigate(`/edit/${id}`);
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


const hoveredLegendCodes = useMemo(() => {
  if (!hoverLegendKey) return [];
  const item = legendModels.find((x) => x.key === hoverLegendKey);
  return item ? Array.from(item.codes) : [];
}, [hoverLegendKey, legendModels]);

const activeLegendCodes = useMemo(() => {
  if (!activeLegendKey) return [];
  const item = legendModels.find((x) => x.key === activeLegendKey);
  return item ? Array.from(item.codes) : [];
}, [activeLegendKey, legendModels]);

const activeLegendModel = useMemo(() => {
  if (!activeLegendKey) return null;
  return legendModels.find((x) => x.key === activeLegendKey) ?? null;
}, [activeLegendKey, legendModels]);


const suppressInfoBox = !!activeLegendKey;

function canvasToBlob(canvas, type = "image/png", quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) reject(new Error("canvas.toBlob returned null (canvas may be tainted)."));
        else resolve(blob);
      },
      type,
      quality
    );
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    // If you ever embed external images in the SVG, uncomment this:
    // img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const handleDownload = async () => {
  if (isDownloading) return;

  setIsDownloading(true);

  try {
    const originalSvg = document.querySelector(`.${styles.mapDisplay} svg`);
    if (!originalSvg) throw new Error("Could not find SVG to download.");

    // 1) Clone SVG
    const svgClone = originalSvg.cloneNode(true);

    // 2) Replace foreignObject title with <text> (your existing logic)
    const foreignObject = svgClone.querySelector("foreignObject");
    if (foreignObject) {
      const div = foreignObject.querySelector("div");
      const titleText = div ? div.textContent.trim() : "";

      const x = parseFloat(foreignObject.getAttribute("x") || "170");
      const y = parseFloat(foreignObject.getAttribute("y") || "100");
      const width = parseFloat(foreignObject.getAttribute("width") || "250");
      const dbFontSize = mapData.title_font_size || 28;

      foreignObject.remove();

      const lines = wrapTextIntoLines(
        titleText,
        dbFontSize,
        width,
        "bold",
        mapData.font_color || "#333"
      );

      const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textElement.setAttribute("x", String(x));
      textElement.setAttribute("y", String(y));
      textElement.setAttribute("dominant-baseline", "hanging");
      textElement.setAttribute("fill", mapData.font_color || "#333");
      textElement.setAttribute("font-weight", "bold");
      textElement.setAttribute("font-size", String(dbFontSize));
      textElement.setAttribute(
        "font-family",
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen'," +
          "'Ubuntu', 'Cantarell', 'Fira Sans','Droid Sans','Helvetica Neue', sans-serif"
      );

      lines.forEach((line, index) => {
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("x", String(x));
        const lineHeight = dbFontSize * 1.2;
        tspan.setAttribute("y", String(y + index * lineHeight));
        tspan.textContent = line;
        textElement.appendChild(tspan);
      });

      svgClone.appendChild(textElement);
    }

    // 3) viewBox override
    if (mapData?.selected_map === "europe") {
      svgClone.setAttribute("viewBox", "-50 0 700 520");
    } else if (mapData?.selected_map === "usa") {
      svgClone.setAttribute("viewBox", "-90 -10 1238 610");
    } else {
      svgClone.setAttribute("viewBox", "0 0 2754 1398");
    }

    // 4) remove elements
    svgClone.querySelectorAll(".circlexx, .subxx, .noxx, .unxx").forEach((el) => el.remove());

    // 5) inline styles (your existing logic)
    svgClone.querySelectorAll("*").forEach((el) => {
      const computed = window.getComputedStyle(el);

      if (["path", "polygon", "circle"].includes(el.tagName.toLowerCase())) {
        el.setAttribute("stroke", computed.stroke || "#4b4b4b");
        el.setAttribute("stroke-width", computed.strokeWidth || "0.5");
        if (computed.fill && computed.fill !== "none") el.setAttribute("fill", computed.fill);
      }

      if (el.tagName.toLowerCase() === "text") {
        el.setAttribute(
          "font-family",
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto','Oxygen'," +
            "'Ubuntu','Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
        );

        if (el.closest("#legend")) {
          el.setAttribute("font-weight", "normal");
        } else if (
          el.parentElement &&
          el.parentElement.querySelector("circle") &&
          el.parentElement.querySelector("circle").getAttribute("cx") === "200"
        ) {
          el.setAttribute("font-weight", "normal");
        } else {
          el.setAttribute("font-weight", "bold");
        }
      }
    });

    // 6) Serialize to blob URL
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    // ✅ Important: await the image load instead of using img.onload callback
    const svgImg = await loadImage(svgUrl);
    URL.revokeObjectURL(svgUrl);

    // 7) Prepare canvas
    const forcedViewBox = svgClone.getAttribute("viewBox");
    const scaleFactor = 3;

    let width, height;
    if (forcedViewBox) {
      const [, , vbWidth, vbHeight] = forcedViewBox.split(" ").map(parseFloat);
      width = vbWidth * scaleFactor;
      height = vbHeight * scaleFactor;
    } else {
      const rect = originalSvg.getBoundingClientRect();
      width = rect.width * scaleFactor;
      height = rect.height * scaleFactor;
    }

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(svgImg, 0, 0, canvas.width, canvas.height);

    const smallerSide = Math.min(canvas.width, canvas.height);
    const padding = 20;

    // 8) Try logo (but don’t let it block download if it fails)
    try {
      const logoImg = await loadImage("/assets/map-in-color-logo.png");

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
    } catch (e) {
      console.error("Logo failed to load, continuing without logo.", e);
    }

    // 9) Draw references (always)
    const textRatio = 0.025;
    const fontSize = smallerSide * textRatio;
    const lineHeight = fontSize * 1.3;

    ctx.fillStyle = mapData.font_color || "#333";
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";

    const sources = mapData.sources || [];
    if (sources.length > 0) {
      const refStrings = sources.map((ref) => {
        let line = ref.sourceName || "Unknown";
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

    // 10) Convert to blob + download
    const blob = await canvasToBlob(canvas, "image/png");
    downloadBlob(blob, `${mapData.title || "map"}.png`);

    // 11) Increment download count (don’t block the download if this fails)
    try {
  const payload = isUserLoggedIn ? {} : { anon_id: getAnonId() };
  const res = await incrementMapDownloadCount(mapData.id, payload);

  if (res?.data?.download_count != null) {
    setDownloadCount(res.data.download_count);
  }
} catch (err) {
  console.error("Error incrementing download:", err);
}

  } catch (error) {
    console.error("Error downloading image:", error);
  } finally {
    // ✅ THIS is what stops “loading forever”
    setIsDownloading(false);
  }
};

  
  function isFiniteNumber(x) {
  return typeof x === "number" && Number.isFinite(x);
}


function numOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function getChoroplethLegendItems(customRanges = []) {
  const normalized = customRanges
    .map((r) => {
      const min = numOrNull(
        r.lowerBound ?? r.min ?? r.from ?? r.start ?? r.low ?? r.lower ?? r.rangeMin
      );
      const max = numOrNull(
        r.upperBound ?? r.max ?? r.to ?? r.end ?? r.high ?? r.upper ?? r.rangeMax
      );

      const color =
        r.color ??
        r.fill ??
        r.hex ??
        r.rangeColor ??
        r.range_color ??
        r.bucketColor ??
        r.bucket_color;

      // ✅ IMPORTANT: "title" ONLY (do NOT use name/label if you want title-only)
      const titleOnly =
        typeof r.title === "string" && r.title.trim() ? r.title.trim() : null;

      // ✅ If no title, then auto-generate from bounds
      const label =
        titleOnly ??
        (min != null && max != null
          ? `${min} – ${max}`
          : min != null
          ? `≥ ${min}`
          : max != null
          ? `≤ ${max}`
          : "Range");

      return {
        key: r.id ?? `${min}-${max}-${color}-${label}`,
        color: color || "#e5e7eb",
        label,
        sortValue: max != null ? max : min != null ? min : -Infinity,
      };
    })
    .filter((x) => x.label);

  normalized.sort((a, b) => (b.sortValue ?? -Infinity) - (a.sortValue ?? -Infinity));
  return normalized;
}

function getCategoricalLegendItems(groups = []) {
  const normalized = groups
    .map((g) => {
      // ✅ IMPORTANT: "title" ONLY, otherwise fallback
      const label =
        (typeof g.title === "string" && g.title.trim())
          ? g.title.trim()
          : (g.name ?? g.label ?? "Group");

      const color =
        g.color ??
        g.fill ??
        g.hex ??
        g.groupColor ??
        g.group_color ??
        "#e5e7eb";

      return {
        key: g.id ?? `${label}-${color}`,
        color,
        label,
      };
    })
    .filter((x) => x.label);

  normalized.sort((a, b) => a.label.localeCompare(b.label));
  return normalized;
}



  
  // Right before the return, handle the special cases:
  // 1) If we have an error
  if (fetchError) {
    return (
      <div className={styles.mapDetailContainer}>
      <Sidebar isCollapsed={isFullScreen || isCollapsed} setIsCollapsed={setIsCollapsed} />
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
      <Sidebar isCollapsed={isFullScreen || isCollapsed} setIsCollapsed={setIsCollapsed} />
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
      <Sidebar isCollapsed={isFullScreen || isCollapsed} setIsCollapsed={setIsCollapsed} />
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
      <Sidebar isCollapsed={isFullScreen || isCollapsed} setIsCollapsed={setIsCollapsed} />
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

      {!isFullScreen && (
        <>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </>

      )}
  
      <div
        className={`${styles.mapDetailContent} ${
          isCollapsed ? styles.contentCollapsed : '',
          isFullScreen && styles.noPadding 
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
  className={`${styles.mapDisplay} ${isFullScreen ? styles.fullScreen : ''}`}
  style={{ position: 'relative', cursor: isPanning.current ? 'grabbing' : 'grab' }}
>
  <MapView
  {...mapDataProps()}
  isLargeMap={isFullScreen}
  hoveredCode={hoveredCode}
  selectedCode={selectedCode}
  selectedCodeZoom={selectedCodeZoom}
  selectedCodeNonce={selectedCodeNonce}
  groupHoveredCodes={hoveredLegendCodes}
  groupActiveCodes={activeLegendCodes}
  suppressInfoBox={suppressInfoBox}
  // ✅ NEW
  activeLegendModel={activeLegendModel}
  codeToName={countryCodeToName}
  onCloseActiveLegend={() => {
    setActiveLegendKey(null);
    setHoverLegendKey(null);
  }}
  onHoverCode={(code) => setHoveredCode(code)}
  onSelectCode={(code) => {
  if (code) {
    setActiveLegendKey(null);
    setHoverLegendKey(null);
  }

  setSelectedCode(code);
  setSelectedCodeZoom(false);
  setSelectedCodeNonce((n) => n + 1);
}}

/>

{isFullScreen && (
  <button
    onClick={toggleFullScreen}
    aria-label="Exit view mode"
    title="Exit view mode"
    className={styles.exitViewBtn}
  >
    <FaEyeSlash />
  </button>
)}

<div className={styles.mapLegendBox} aria-label="Legend">
  <div className={styles.mapLegendHeader}>
    {/* ✅ Only show the title in fullscreen */}
    {isFullScreen && (
      <div className={styles.mapLegendTitle}>
        {mapData?.title || "Untitled Map"}
      </div>
    )}

   
  </div>

<div className={styles.mapLegendItems}>
  {legendModels.length === 0 ? (
    <div className={styles.mapLegendEmpty}>No legend data</div>
  ) : (
    legendModels.map((item) => {
      const isActive = activeLegendKey === item.key;

      return (
        <div
          key={item.key}
          className={`${styles.mapLegendRow} ${isActive ? styles.mapLegendRowActive : ""}`}


          onMouseEnter={() => setHoverLegendKey(item.key)}
          onMouseLeave={() => setHoverLegendKey(null)}

          onClick={() => {
            // toggling this group
            setSelectedCode(null);         // stop showing any country selection
            setSelectedCodeZoom(false);
            setSelectedCodeNonce((n) => n + 1);

            setActiveLegendKey(item.key); // ✅ never toggle off by clicking again
          }}
          role="button"
          tabIndex={0}
        >
          <span
            className={styles.mapLegendDot}
            style={{ backgroundColor: item.color }}
          />
          <div className={styles.mapLegendText}>
            <div className={styles.mapLegendLabel}>{item.label}</div>
            {item.meta && <div className={styles.mapLegendMeta}>{item.meta}</div>}
          </div>
          <span className={styles.mapLegendHoverHint} aria-hidden="true">↗</span>
        </div>
      );
    })
  )}
</div>

</div>



</div>


   {!isFullScreen && (
        <>
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

  {/* HERO */}
{/* HERO */}
<div className={styles.detailsHero}>
  <div className={styles.heroRow}>
    {/* LEFT: Title + meta */}
    <div className={styles.heroLeft}>
      <h1 className={styles.detailsTitle}>
        {mapData.title || "Untitled Map"}
        {isOwner && (
          <span className={styles.visibilityPill}>
            {is_public ? "Public" : "Private"}
          </span>
        )}
      </h1>

      {timeAgo && <div className={styles.detailsMetaLine}>Created {timeAgo}</div>}
    </div>

    {/* RIGHT: Actions + Profile (profile last = far right) */}
    <div className={styles.heroRight}>
      {/* Actions should flow LEFT of profile, so we put them first */}
      <div className={styles.heroActions}>
     
   

        {(is_public || isOwner) && (
          <>
           
            {is_public && (
              <button
                className={[
                  styles.statActionBtn,
                  styles.starActionBtn,
                  isSaved ? styles.starActive : "",
                  isSaving ? styles.starLoading : "",
                ].join(" ")}
                onClick={() => {
                  if (!isUserLoggedIn) {
                    setShowLoginModal(true);
                    return;
                  }
                  handleSave();
                }}
                type="button"
                disabled={isSaving}
                aria-pressed={!!isSaved}
                title={isSaved ? "Unstar" : "Star"}
              >
                <span className={styles.statActionIcon}><FaStar /></span>
                <span className={styles.statActionLabel}>
                  {isSaving ? "Starring…" : "Stars"}
                </span>
                <span className={styles.statActionValue}>{save_count}</span>
                {isSaving && <span className={styles.miniSpinner} aria-hidden="true" />}
              </button>

              
            )}

   <button
  className={[
    styles.statActionBtn,
    styles.downloadBtn,
    isDownloading ? styles.downloadLoading : ""
  ].join(" ")}
  onClick={handleDownload}
  type="button"
  title="Download map"
  disabled={isDownloading}
>
  <span className={styles.statActionIcon}><BiDownload /></span>
  <span className={styles.statActionLabel}>
    {isDownloading ? "Downloading…" : "Downloads"}
  </span>
  <span className={styles.statActionValue}>{download_count}</span>
  {isDownloading && <span className={styles.miniSpinner} aria-hidden="true" />}
</button>


                 <button
          className={styles.viewIconButton}
          onClick={toggleFullScreen}
          aria-label="Enter view mode"
          title="View mode"
          type="button"
        >
          <FaEye />
        </button>

           {isOwner && (
          <button className={styles.editButton} onClick={handleEdit} type="button">
            Edit Map
          </button>
        )}

          </>
        )}
      </div>

      {/* Profile chip MUST be far right */}
      <div className={styles.heroProfile}>
        <div className={styles.creatorChip}>
          {isUserLoggedIn ? (
            <Link
              to={`/profile/${mapData?.user?.username || "unknown"}`}
              className={styles.creatorChipLink}
            >
              <img
                src={
                  mapData.user?.profile_picture
                    ? mapData.user.profile_picture
                    : "/default-profile-pic.jpg"
                }
                alt="Creator profile"
                className={styles.creatorChipAvatar}
              />
              <div className={styles.creatorChipText}>
                <div className={styles.creatorChipName}>
                  {mapData.user.first_name || ""} {mapData.user.last_name || ""}
                </div>
                <div className={styles.creatorChipUser}>
                  @{mapData?.user?.username || "unknown"}
                </div>
              </div>
            </Link>
          ) : (
            <button
              className={styles.creatorChipLink}
              onClick={() => setShowLoginModal(true)}
              type="button"
            >
              <img
                src={
                  mapData.user?.profile_picture
                    ? mapData.user.profile_picture
                    : "/default-profile-pic.jpg"
                }
                alt="Creator profile"
                className={styles.creatorChipAvatar}
              />
              <div className={styles.creatorChipText}>
                <div className={styles.creatorChipName}>
                  {mapData.user.first_name || ""} {mapData.user.last_name || ""}
                </div>
                <div className={styles.creatorChipUser}>
                  @{mapData?.user?.username || "unknown"}
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
</div>


  {/* DESCRIPTION */}
  {mapData?.description?.trim() && (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Description</div>
      </div>
      <p className={styles.descriptionText}>{mapData.description}</p>
    </div>
  )}

  {/* TAGS */}
  {mapData?.tags?.length > 0 && (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>Tags</div>
        <div className={styles.sectionHint}>Explore similar maps</div>
      </div>

      <div className={styles.tagsWrap}>
        {mapData.tags.map((tag, index) => (
          <button
            key={index}
            className={styles.tagChip}
            onClick={() => navigate(`/explore?tags=${encodeURIComponent(tag.toLowerCase())}`)}
            type="button"
            title={`See all maps with the tag "${tag}"`}
          >
            <span className={styles.tagHash}>#</span>
            {tag}
          </button>
        ))}
      </div>
    </div>
  )}

  {/* REFERENCES */}
  {mapData?.sources?.length > 0 && (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitle}>References</div>
        <div className={styles.sectionHint}>Sources used for this map</div>
      </div>

      <ol className={styles.refsList}>
        {mapData.sources.map((ref, idx) => (
          <li key={idx} className={styles.refItem}>
            <div className={styles.refTop}>
              <span className={styles.refIndex}>{idx + 1}</span>

              <div className={styles.refMain}>
                <div className={styles.refTitleLine}>
                  <span className={styles.refName}>
                    {ref.sourceName || "Unknown source"}
                  </span>
                  {ref.publicationYear && (
                    <span className={styles.refYear}>({ref.publicationYear})</span>
                  )}
                </div>

                {ref.publicator && (
                  <div className={styles.refPublisher}>{ref.publicator}</div>
                )}

                {ref.url && (
                  <a
                    className={styles.refLink}
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {ref.url}
                  </a>
                )}

                {ref.notes && (
                  <div className={styles.refNotes}>
                    <span className={styles.refNotesLabel}>Notes:</span> {ref.notes}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )}
</div>

{/* DISCUSSION SECTION (below map details on desktop) */}
<div className={`${styles.sectionCard} ${styles.discussionCard}`} ref={discussionRef}>
  {/* Header like other section cards */}
  <div className={styles.sectionHeader}>
    <div className={styles.sectionTitle}>Discussion</div>
    <div className={styles.sectionHint}>
      {is_public ? "Share thoughts and ask questions" : "Comments disabled on private maps"}
    </div>
  </div>

  {/* Composer */}
  {is_public && (
    <div className={styles.discussionBody}>
      {(isUserLoggedIn) ? (
        <form onSubmit={handleCommentSubmit} className={styles.commentComposer}>
          <div className={styles.composerAvatarWrap} aria-hidden="true">
            <img
              className={styles.composerAvatar}
              src={profile?.profile_picture || "/default-profile-pic.jpg"}
              alt=""
            />
          </div>

          <div className={styles.composerMain}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment…"
              required
              className={styles.composerTextarea}
              rows={3}
            />

            <div className={styles.composerFooter}>
              <div className={styles.composerHint}>
                Be respectful. Keep it constructive.
              </div>

              <button
                type="submit"
                className={styles.composerSendBtn}
                disabled={isPostingComment}
                title="Post comment"
              >
                <span className={styles.composerSendIcon}><BiSend /></span>
                <span className={styles.composerSendText}>
                  {isPostingComment ? "Posting…" : "Post"}
                </span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className={styles.discussionLocked}>
          <div className={styles.discussionLockedText}>
            Log in to join the discussion.
          </div>
          <button
            type="button"
            className={styles.discussionLockedBtn}
            onClick={() => setShowLoginModal(true)}
          >
            Log in
          </button>
        </div>
      )}

      {/* Comments */}
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
                  {/* Avatar */}
                  {comment.user && comment.user.profile_picture ? (
                    isUserLoggedIn ? (
                      <Link to={`/profile/${comment?.user?.username || "unknown"}`}>
                        <img
                          src={comment.user?.profile_picture || "/default-profile-pic.jpg"}
                          alt={`${comment?.user?.username || "unknown"}'s profile`}
                          className={styles.commentProfilePicture}
                        />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={styles.avatarButton}
                        onClick={() => setShowLoginModal(true)}
                        aria-label="Log in to view profile"
                      >
                        <img
                          src={comment.user?.profile_picture || "/default-profile-pic.jpg"}
                          alt="Profile"
                          className={styles.commentProfilePicture}
                        />
                      </button>
                    )
                  ) : (
                    <div className={styles.commentPlaceholder} />
                  )}

                  <div className={styles.commentContentWrapper}>
                    <div className={styles.commentInfo}>
                      {isUserLoggedIn ? (
                        <Link
                          to={`/profile/${comment?.user?.username || "unknown"}`}
                          className={styles.commentAuthorLink}
                        >
                          <span className={styles.commentAuthor}>
                            {comment.user.username || "Unknown"}
                          </span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          className={styles.commentAuthorBtn}
                          onClick={() => setShowLoginModal(true)}
                        >
                          {comment.user.username || "Unknown"}
                        </button>
                      )}

                      <span className={styles.dotSep}>•</span>

                      <span className={styles.commentTime}>
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>

                    <p className={styles.commentContent}>{comment.content}</p>

                    {/* Actions */}
                    <div className={styles.commentActions}>
                      <button
                        type="button"
                        className={`${styles.reactionButton} ${
                          comment.userReaction === "like" ? styles.active : ""
                        }`}
                        onClick={() => {
                          if (!isUserLoggedIn) return setShowLoginModal(true);
                          handleLike(comment.id, comment.userReaction);
                        }}
                      >
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
                        </svg>
                        <span>{comment.like_count}</span>
                      </button>

                      <button
                        type="button"
                        className={`${styles.reactionButton} ${
                          comment.userReaction === "dislike" ? styles.active : ""
                        }`}
                        onClick={() => {
                          if (!isUserLoggedIn) return setShowLoginModal(true);
                          handleDislike(comment.id, comment.userReaction);
                        }}
                      >
                        <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06l1.39 1.41 6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
                        </svg>
                        <span>{comment.dislike_count}</span>
                      </button>

                      {isUserLoggedIn && (
                        <button
                          type="button"
                          className={styles.reactionButton}
                          onClick={() => setReplyingTo({ comment_id: comment.id, content: "" })}
                        >
                          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 9V5l-7 7 7 7v-4.1c4.55 0 7.83 1.24 10.27 3.32-.4-4.28-2.92-7.39-10.27-7.39z" />
                          </svg>
                          <span>Reply</span>
                        </button>
                      )}

                      {comment.user?.username === profile?.username && (
                        <button
                          type="button"
                          className={`${styles.reactionButton} ${styles.dangerButton}`}
                          onClick={() => handleDeleteCommentWithConfirm(comment.id)}
                        >
                          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h1v12a2 2 0 002 2h10a2 2 0 002-2V6h1a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0015 2H9zM10 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
                          </svg>
                          <span>Delete</span>
                        </button>
                      )}

                      {isUserLoggedIn && comment.user?.username !== profile?.username && (
                        <button
                          type="button"
                          className={styles.reactionButton}
                          onClick={() => {
                            setReportTargetComment(comment.id);
                            setShowReportModal(true);
                          }}
                        >
                          <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M5 5v14h2V5H5zm2 0l10 4-10 4V5z" />
                          </svg>
                          <span>Report</span>
                        </button>
                      )}
                    </div>

                    {/* Reply form (unchanged logic, new classes are already in your CSS) */}
                    {replyingTo && replyingTo.comment_id === comment.id && (
                      <form
                        onSubmit={(e) => handleReplySubmit(e, comment.id)}
                        className={styles.replyForm}
                      >
                        <textarea
                          value={replyingTo.content}
                          onChange={(e) =>
                            setReplyingTo({ ...replyingTo, content: e.target.value })
                          }
                          placeholder="Write a reply…"
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
                            <BiSend />
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Replies list stays same, your existing UI is already decent */}
                    {repliesArray.length > 0 && (
                      <ul className={styles.repliesList}>
                       {repliesToShow.map((reply) => (
  <li key={reply.id} className={styles.replyItem}>
    <div className={styles.commentHeader}>
      {reply.user?.profile_picture ? (
        isUserLoggedIn ? (
          <Link to={`/profile/${reply.user.username}`}>
            <img
              src={reply.user?.profile_picture || "/default-profile-pic.jpg"}
              alt={`${reply.user.username}'s profile`}
              className={styles.commentProfilePicture}
            />
          </Link>
        ) : (
          <button
            type="button"
            className={styles.avatarButton}
            onClick={() => setShowLoginModal(true)}
            aria-label="Log in to view profile"
          >
            <img
              src={reply.user?.profile_picture || "/default-profile-pic.jpg"}
              alt="Profile"
              className={styles.commentProfilePicture}
            />
          </button>
        )
      ) : (
        <div className={styles.commentPlaceholder} />
      )}

      <div className={styles.commentContentWrapper}>
        <div className={styles.commentInfo}>
          {isUserLoggedIn ? (
            <Link
              to={`/profile/${reply.user?.username || "unknown"}`}
              className={styles.commentAuthorLink}
            >
              <span className={styles.commentAuthor}>
                {reply.user?.username || "Unknown"}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              className={styles.commentAuthorBtn}
              onClick={() => setShowLoginModal(true)}
            >
              {reply.user?.username || "Unknown"}
            </button>
          )}

          <span className={styles.dotSep}>•</span>

          <span className={styles.commentTime}>
            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
          </span>
        </div>

        <p className={styles.commentContent}>{reply.content}</p>

        <div className={styles.commentActions}>
          <button
            type="button"
            className={`${styles.reactionButton} ${styles.reactionButtonSmall} ${
              reply.userReaction === "like" ? styles.active : ""
            }`}
            onClick={() => {
              if (!isUserLoggedIn) return setShowLoginModal(true);
              handleLike(reply.id, reply.userReaction);
            }}
          >
            <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
            </svg>
            <span>{reply.like_count}</span>
          </button>

          <button
            type="button"
            className={`${styles.reactionButton} ${styles.reactionButtonSmall} ${
              reply.userReaction === "dislike" ? styles.active : ""
            }`}
            onClick={() => {
              if (!isUserLoggedIn) return setShowLoginModal(true);
              handleDislike(reply.id, reply.userReaction);
            }}
          >
            <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
              <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06l1.39 1.41 6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
            </svg>
            <span>{reply.dislike_count}</span>
          </button>

          {profile?.username === reply.user?.username && (
            <button
              type="button"
              className={`${styles.reactionButton} ${styles.reactionButtonSmall} ${styles.dangerButton}`}
              onClick={() => handleDeleteCommentWithConfirm(reply.id)}
            >
              <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h1v12a2 2 0 002 2h10a2 2 0 002-2V6h1a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0015 2H9zM10 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
              </svg>
              <span>Delete</span>
            </button>
          )}

          {isUserLoggedIn && reply.user?.username !== profile?.username && (
            <button
              type="button"
              className={`${styles.reactionButton} ${styles.reactionButtonSmall}`}
              onClick={() => {
                setReportTargetComment(reply.id);
                setShowReportModal(true);
              }}
            >
              <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
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
                            type="button"
                            className={styles.toggleRepliesButton}
                            onClick={() => toggleReplies(comment.id)}
                          >
                            {areRepliesExpanded
                              ? "Show less replies"
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
        <div className={styles.discussionEmpty}>
          <div className={styles.discussionEmptyTitle}>No comments yet</div>
          <div className={styles.discussionEmptyHint}>
            {isUserLoggedIn ? "Be the first to start the conversation." : "Log in to post the first comment."}
          </div>
        </div>
      )}
    </div>
  )}
</div>

  </div>


          {/* RIGHT column: Statistics */}
          <div className={styles.mapStats}>
<MapDetailValueTable
  mapDataType={
    mapData.mapDataType ??
    mapData.map_data_type ??
    mapData.map_type ??
    mapData.type ??
    "choropleth"
  }
  dataEntries={parseJsonArray(mapData.data)}
  codeToName={countryCodeToName}
  hoveredCode={hoveredCode}
  selectedCode={selectedCode}
  onHoverCode={(code) => setHoveredCode(code)}
  onSelectCode={(code) => {
    setActiveLegendKey(null);
    setHoverLegendKey(null);

    setSelectedCode(code);
    setSelectedCodeZoom(false);
    setSelectedCodeNonce((n) => n + 1);
  }}
  formatValue={formatValue}
/>


          </div>

                  </div>
                  </>

                )}
  

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
  
function parseJsonArray(x) {
  if (!x) return [];

  // Already an array
  if (Array.isArray(x)) return x;

  // If it's a JSON string
  if (typeof x === "string") {
    try {
      const parsed = JSON.parse(x);
      return parseJsonArray(parsed); // recurse to handle object-wrapped arrays too
    } catch {
      return [];
    }
  }

  // ✅ If it's an object that CONTAINS an array (common from DB/jsonb)
  if (typeof x === "object") {
    // try common container keys
    const candidates = [
      x.ranges,
      x.items,
      x.values,
      x.data,
      x.legend,
      x.groups,
      x.categories,
      x.custom_ranges,
      x.customRanges,
    ];
    for (const c of candidates) {
      if (Array.isArray(c)) return c;
    }
  }

  return [];
}

function parseJsonObject(x) {
  if (!x) return {};
  if (typeof x === "object") return x;
  if (typeof x === "string") {
    try {
      const parsed = JSON.parse(x);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

function toBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}


function mapDataProps() {
  return {
    // modes + data
    mapDataType:
      mapData.mapDataType ??
      mapData.map_data_type ??
      mapData.map_type ??
      mapData.type ??
      null,

    data: parseJsonArray(mapData.data),

    // choropleth ranges / categorical groups
    custom_ranges: parseJsonArray(mapData.custom_ranges ?? mapData.customRanges),
    groups: parseJsonArray(mapData.groups),

    // ✅ THIS is commonly what controls “text”
    placeholders: parseJsonObject(mapData.placeholders),
    customDescriptions: parseJsonObject(mapData.placeholders), // alias in case Map expects this

    // styling
    ocean_color: mapData.ocean_color,
    unassigned_color: mapData.unassigned_color,
    font_color: mapData.font_color,

    // title
    mapTitleValue: mapData.title,
    title: mapData.title,      // alias
    mapTitle: mapData.title,   // alias

    is_title_hidden: toBool(mapData.is_title_hidden),
    titleFontSize: Number(mapData.title_font_size) || 28,
    legendFontSize: Number(mapData.legend_font_size) || 18,

    // optional flags
    show_top_high_values: toBool(mapData.show_top_high_values),
    show_top_low_values: toBool(mapData.show_top_low_values),
    showNoDataLegend: toBool(mapData.show_no_data_legend),
    top_low_values: parseJsonArray(mapData.top_low_values),

    strokeMode: "thick"
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
