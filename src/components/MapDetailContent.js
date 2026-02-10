// MapDetail.js

import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import styles from './MapDetail.module.css';
import { formatDistanceToNow } from 'date-fns';
import { UserContext } from '../context/UserContext';
import FullScreenMap from './FullScreenMap';
import { BiDownload, BiSend } from 'react-icons/bi';
import { createPortal } from "react-dom";
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
import { getAnonId } from "../utils/annonId"; // add at top
import DownloadOptionsModal from "./DownloadOptionsModal";


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
  const [expandedThreads, setExpandedThreads] = useState({});   
  
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);


  const [download_count, setDownloadCount] = useState(0);

  const [isPostingComment, setIsPostingComment] = useState(false);
  const [isPostingReply, setIsPostingReply] = useState(false);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();

  const [showLoginModal, setShowLoginModal] = useState(false);

// In both MapDetail and Dashboard (or better yet, in a top-level layout)

const [loadState, setLoadState] = useState("loading"); 
// "loading" | "ready" | "error"

  const isMobileComments = width <= 750;


    // For reporting a comment
  const [reportTargetComment, setReportTargetComment] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const [deleteTargetId, setDeleteTargetId] = useState(null);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [isDeleting, setIsDeleting] = useState(false);


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


  const { authToken, profile, isPro } = useContext(UserContext);

  const [isSaving, setIsSaving] = useState(false);

const [reactionLoadingById, setReactionLoadingById] = useState({}); 

const [showDownloadModal, setShowDownloadModal] = useState(false);

  const toggleThread = (commentId) => {
  setExpandedThreads((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
};

  const discussionRef = useRef(null);
  const countryListRef = useRef(null);
  const isPanning = useRef(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  
  // Ref for the map display container
  const mapDisplayRef = useRef(null);

  // near the top:
const [fetchError, setFetchError] = useState(null);
// { kind: "unavailable" | "temporary", title: string, message: string }

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

const nameOnly =
  typeof r.name === "string" && r.name.trim() ? r.name.trim() : null;

const titleOnly =
  typeof r.title === "string" && r.title.trim() ? r.title.trim() : null;

const labelOnly =
  typeof r.label === "string" && r.label.trim() ? r.label.trim() : null;

// ✅ Prefer DB "name" first
const label =
  nameOnly ??
  titleOnly ??
  labelOnly ??
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
  let cancelled = false;

  

async function getMapData() {
  setLoadState("loading");
setIsLoading(true);
// DO NOT clear fetchError here


  try {
    const res = await fetchMapById(id);

    if (!res?.data) {
      setFetchError({
        kind: "unavailable",
        title: "Map not available",
        message: "This map is no longer available.",
      });
      setLoadState("error");
      return;
    }

    setMapData(res.data);
    setSaveCount(res.data.save_count || 0);
    setIsSaved(res.data.isSavedByCurrentUser || false);
    setIsOwner(res.data.isOwner || false);
    setIsPublic(res.data.is_public);
    setFetchError(null);  

    setLoadState("ready");
  } catch (err) {
    const status = err?.response?.status;
    const apiMsg =
      err?.response?.data?.message ||
      err?.response?.data?.msg ||
      err?.response?.data?.error ||
      err?.message ||
      "";

    const lower = String(apiMsg).toLowerCase();
    const code = err?.response?.data?.code;
    const reason = err?.response?.data?.reason;

    // choose error UI
    if (status === 410 && code === "MAP_UNAVAILABLE" && reason === "OWNER_BANNED") {
      setFetchError({
        kind: "unavailable",
        title: "Map not available",
        message: "This map is no longer available.",
      });
    } else {
      const isUnavailableStatus = [404, 410, 403, 451].includes(status);
      const smellsLikeUnavailable =
        lower.includes("map not found") ||
        lower.includes("not found") ||
        lower.includes("private") ||
        lower.includes("banned") ||
        lower.includes("suspended") ||
        lower.includes("deleted") ||
        lower.includes("no longer available");

      setFetchError(
        isUnavailableStatus || smellsLikeUnavailable
          ? {
              kind: "unavailable",
              title: "Map not available",
              message: "This map is no longer available.",
            }
          : {
              kind: "temporary",
              title: "Couldn’t load map",
              message: "Something went wrong. Please try again in a moment.",
            }
      );
    }

    setLoadState("error");
  } finally {
    setIsLoading(false);
  }
}


  getMapData();

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };
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

  useEffect(() => {
  if (loadState !== "ready") return;
  // fetchComments...
}, [id, loadState]);

function setReactionLoading(commentId, kind) {
  setReactionLoadingById((prev) => ({ ...prev, [commentId]: kind }));
}
function clearReactionLoading(commentId) {
  setReactionLoadingById((prev) => {
    const next = { ...prev };
    delete next[commentId];
    return next;
  });
}

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
  
  
  const MAX_DEPTH = 6;          // allow replying down to depth 6
const PREVIEW_COUNT = 3;      // show 3 replies by default
const MAX_SHOWN_REPLIES = 6;  // when expanded, show up to 6 replies


const handleReplySubmit = async (e) => {
  e.preventDefault();

  if (!replyingTo?.content?.trim()) return;
  if (!isUserLoggedIn) return setShowLoginModal(true);

  const parentId = replyingTo.parentId; // ✅ define FIRST

  const parentDepth = findDepth(comments, parentId, 1);
  if (parentDepth != null && parentDepth >= MAX_DEPTH) {
    return;
  }

  setIsPostingReply(true);
  try {
    const res = await postComment(id, {
      content: replyingTo.content,
      parent_comment_id: parentId,
    });

    setComments((prev) => insertReplyIntoTree(prev, parentId, res.data));
    setReplyingTo(null);
  } catch (err) {
    console.error(err);
  } finally {
    setIsPostingReply(false);
  }
};

function insertReplyIntoTree(nodes, parentId, newReply) {
  return nodes.map((n) => {
    if (n.id === parentId) {
      return { ...n, Replies: [...(n.Replies || []), { ...newReply, Replies: [] }] };
    }
    if (n.Replies?.length) {
      return { ...n, Replies: insertReplyIntoTree(n.Replies, parentId, newReply) };
    }
    return n;
  });
}


// Update handleLike and handleDislike functions

async function handleLike(comment_id, currentReaction) {
  if (!isUserLoggedIn) {
    setShowLoginModal(true);
    return;
  }

  // prevent double taps while loading
  if (reactionLoadingById[comment_id]) return;

  const desiredReaction = currentReaction === "like" ? null : "like";

  try {
    setReactionLoading(comment_id, "like");

    const res = await setCommentReaction(comment_id, desiredReaction);

    if (res?.data) {
      setComments((prevComments) =>
        updateCommentReaction(prevComments, comment_id, {
          like_count: res.data.like_count,
          dislike_count: res.data.dislike_count,
          userReaction: res.data.userReaction,
        })
      );
    }
  } catch (err) {
    console.error("handleLike error:", err);
  } finally {
    clearReactionLoading(comment_id);
  }
}

async function handleDislike(comment_id, currentReaction) {
  if (!isUserLoggedIn) {
    setShowLoginModal(true);
    return;
  }

  if (reactionLoadingById[comment_id]) return;

  const desiredReaction = currentReaction === "dislike" ? null : "dislike";

  try {
    setReactionLoading(comment_id, "dislike");

    const res = await setCommentReaction(comment_id, desiredReaction);

    if (res?.data) {
      setComments((prevComments) =>
        updateCommentReaction(prevComments, comment_id, {
          like_count: res.data.like_count,
          dislike_count: res.data.dislike_count,
          userReaction: res.data.userReaction,
        })
      );
    }
  } catch (err) {
    console.error("handleDislike error:", err);
  } finally {
    clearReactionLoading(comment_id);
  }
}

function findDepth(nodes, targetId, depth = 1) {
  for (const n of nodes) {
    if (n.id === targetId) return depth;
    if (n.Replies?.length) {
      const d = findDepth(n.Replies, targetId, depth + 1);
      if (d) return d;
    }
  }
  return null;
}


// Update the helper function
function updateCommentReaction(nodes, comment_id, updatedData) {
  return nodes.map((n) => {
    const isTarget = n.id === comment_id;

    return {
      ...n,
      ...(isTarget
        ? {
            like_count: updatedData.like_count,
            dislike_count: updatedData.dislike_count,
            userReaction: updatedData.userReaction,
          }
        : {}),
      Replies: n.Replies?.length
        ? updateCommentReaction(n.Replies, comment_id, updatedData)
        : n.Replies,
    };
  });
}



    // CANCEL REPLY => setReplyingTo(null)
  const handleReplyCancel = () => {
    setReplyingTo(null);
  };

const handleDeleteCommentWithConfirm = (comment_id) => {
  setDeleteTargetId(comment_id);
  setShowDeleteModal(true);
};

const confirmDelete = async () => {
  if (!deleteTargetId || isDeleting) return;

  try {
    setIsDeleting(true);
    await deleteComment(deleteTargetId);
    setComments((prev) => removeCommentOrReply(prev, deleteTargetId));
    setShowDeleteModal(false);
    setDeleteTargetId(null);
  } catch (err) {
    console.error("Error deleting comment:", err);
  } finally {
    setIsDeleting(false);
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
  
function removeCommentOrReply(nodes, idToRemove) {
  return nodes
    .filter((n) => n.id !== idToRemove)
    .map((n) => ({
      ...n,
      Replies: n.Replies?.length ? removeCommentOrReply(n.Replies, idToRemove) : n.Replies,
    }));
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

  





function formatLocaleNumber(n, maxDecimals = 5, locale = "en-US") {
  if (typeof n !== "number" || !Number.isFinite(n)) return "No data";
  return n.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxDecimals,
  });
}

function formatValue(num) {
  // same safety rules
  if (num == null) return "No data";
  if (typeof num !== "number") return String(num);
  if (!Number.isFinite(num)) return "No data";

  const abs = Math.abs(num);

  // same threshold as Map.js
  const ABBREV_FROM = 1e15;

  // under 1e15 => full number with commas + up to 5 decimals
  if (abs < ABBREV_FROM) {
    return formatLocaleNumber(num, 5, "en-US");
  }

  // huge => word-units like Map.js
  const units = [
    { value: 1e24, label: "septillion" },
    { value: 1e21, label: "sextillion" },
    { value: 1e18, label: "quintillion" },
    { value: 1e15, label: "quadrillion" },
    { value: 1e12, label: "trillion" },
    { value: 1e9, label: "billion" },
    { value: 1e6, label: "million" },
    { value: 1e3, label: "thousand" },
  ];

  const u = units.find((x) => abs >= x.value) || units[units.length - 1];
  const scaled = num / u.value;

  // abbreviated: up to 2 decimals, with commas
  return `${formatLocaleNumber(scaled, 2, "en-US")} ${u.label}`;
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

const legendHeaderTitle = useMemo(() => {
  // If a legend item is active, show its label (name if exists, else "min – max")
  if (activeLegendModel?.label) return activeLegendModel.label;

  // Otherwise show the map title
  return mapData?.title || "Untitled Map";
}, [activeLegendModel, mapData?.title]);


const suppressInfoBox = !!activeLegendKey;




  
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






// ─────────────────────────────────────────────
// HARD render gates (NO OTHER UI ABOVE THIS)
// ─────────────────────────────────────────────

// 1) While loading: render ONLY skeleton (prevents 1-frame "Failed to load map")
if (loadState === "loading") {
  return (
    <div className={styles.mapDetailContainer}>
      <Sidebar isCollapsed={isFullScreen || isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={styles.mapDetailContent}>
        <div className={styles.mapDisplay}>
          <div
            className={styles.skeletonRow}
            style={{ height: "400px", borderRadius: "8px" }}
          />
        </div>
      </div>
    </div>
  );
}

// 2) If we decided it's an error: render ONLY the nice error UI
if (loadState === "error") {
  // If for some reason fetchError is missing, show a safe fallback
  const safe = fetchError ?? {
    kind: "temporary",
    title: "Couldn’t load map",
    message: "Something went wrong. Please try again.",
  };

  return (
    <div className={styles.mapDetailContainer}>
      <Sidebar isCollapsed={isFullScreen || isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={styles.mapDetailContent}>
        <div className={styles.unavailableBox}>
          <div className={styles.unavailableIcon} aria-hidden="true">⛔</div>
          <h2 className={styles.unavailableTitle}>{safe.title}</h2>
          <p className={styles.unavailableMsg}>{safe.message}</p>

          <div className={styles.unavailableActions}>
            <button
              type="button"
              className={styles.unavailableSecondary}
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
            <button
              type="button"
              className={styles.unavailablePrimary}
              onClick={() => navigate("/explore")}
            >
              Explore maps
            </button>
          </div>

          {safe.kind === "temporary" && (
            <button
              type="button"
              className={styles.unavailableLink}
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 3) Safety: if ready but mapData missing, treat as unavailable
if (!mapData) {
  return (
    <div className={styles.mapDetailContainer}>
      <Sidebar isCollapsed={isFullScreen || isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={styles.mapDetailContent}>
        <div className={styles.unavailableBox}>
          <div className={styles.unavailableIcon} aria-hidden="true">🗺️</div>
          <h2 className={styles.unavailableTitle}>Map not available</h2>
          <p className={styles.unavailableMsg}>This map is no longer available.</p>

          <div className={styles.unavailableActions}>
            <button
              type="button"
              className={styles.unavailableSecondary}
              onClick={() => navigate(-1)}
            >
              Go back
            </button>
            <button
              type="button"
              className={styles.unavailablePrimary}
              onClick={() => navigate("/explore")}
            >
              Explore maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );
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
  <div className={styles.mapLegendHeaderRow}>
    <div className={styles.mapLegendTitle}>
      {mapData?.title || "Untitled Map"}
    </div>
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
  className={[styles.statActionBtn, styles.downloadBtn].join(" ")}
  onClick={() => setShowDownloadModal(true)}
  type="button"
  title="Download map"
>
  <span className={styles.statActionIcon}><BiDownload /></span>

  <span className={styles.statActionLabel}>
    {is_public ? "Downloads" : "Download"}
  </span>

  {is_public && (
    <span className={styles.statActionValue}>{download_count}</span>
  )}
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
  {comments.map((comment) => (
    <CommentNode
      key={comment.id}
      node={comment}
      depth={1}
      isMobileComments={isMobileComments}
      {...{
        isUserLoggedIn,
        profile,
        expandedThreads,
        toggleThread,
        MAX_DEPTH,
        PREVIEW_COUNT,
        MAX_SHOWN_REPLIES,
        replyingTo,
        setReplyingTo,
        isPostingReply,
        handleReplySubmit,
        handleReplyCancel,
        handleLike,
        handleDislike,
        handleDeleteCommentWithConfirm,
        setShowLoginModal,
        setReportTargetComment,
        setShowReportModal,
        styles,
        reactionLoadingById
      }}
    />
  ))}
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
{showDeleteModal &&
  createPortal(
    <div
      className={`${styles.micModalOverlay} ${styles.micOverlayBlur}`}
      role="dialog"
      aria-modal="true"
      onClick={() => !isDeleting && setShowDeleteModal(false)}
    >
      <div
        className={styles.micModal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.micModalTopRow}>
          <div className={styles.micModalTitleWrap}>
            <div className={styles.micModalTitle}>Delete comment?</div>
            <div className={styles.micModalSub}>This can’t be undone.</div>
          </div>

          <button
            type="button"
            className={styles.micModalX}
            onClick={() => {
              if (isDeleting) return;
              setShowDeleteModal(false);
              setDeleteTargetId(null);
            }}
            aria-label="Close"
            disabled={isDeleting}
          >
            ×
          </button>
        </div>

        <div className={styles.micModalActions}>
          <button
            type="button"
            onClick={confirmDelete}
            disabled={isDeleting}
            className={`${styles.micBtn} ${styles.micBtnDanger}`}
          >
            {isDeleting ? (
              <span className={styles.micBtnRow}>
                <span className={styles.micSpinner} aria-hidden="true" />
                Deleting…
              </span>
            ) : (
              "Delete"
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              if (isDeleting) return;
              setShowDeleteModal(false);
              setDeleteTargetId(null);
            }}
            disabled={isDeleting}
            className={`${styles.micBtn} ${styles.micBtnGhost}`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  )}


{showReportModal && reportedComment &&
  createPortal(
    <div
      className={`${styles.micModalOverlay} ${styles.micOverlayBlur}`}
      role="dialog"
      aria-modal="true"
      onClick={() => !isReporting && setShowReportModal(false)}
    >
      <div className={styles.micModal} onClick={(e) => e.stopPropagation()}>

        {/* Top row (user chip + close) */}
        <div className={styles.micModalTopRow}>
          <div className={styles.micUserHeader}>
            <img
              src={reportedComment.user?.profile_picture || "/default-profile-pic.jpg"}
              alt={`${reportedComment.user?.username}'s profile`}
              className={styles.micUserAvatar}
            />
            <div className={styles.micUserText}>
              <div className={styles.micUserName}>@{reportedComment.user?.username || "unknown"}</div>
              <div className={styles.micUserHint}>Report comment</div>
            </div>
          </div>

          <button
            type="button"
            className={styles.micModalX}
            onClick={() => !isReporting && setShowReportModal(false)}
            aria-label="Close"
            disabled={isReporting}
          >
            ×
          </button>
        </div>

        {/* Body states */}
        {isReporting ? (
          <div className={styles.micStateBox}>
            <div className={styles.micStateRow}>
              <span className={styles.micSpinnerLg} aria-hidden="true" />
              <div>
                <div className={styles.micStateTitle}>Submitting…</div>
                <div className={styles.micStateSub}>Thanks for helping keep MIC clean.</div>
              </div>
            </div>
          </div>
        ) : showReportSuccess ? (
          <div className={`${styles.micStateBox} ${styles.micStateSuccess}`}>
            <div className={styles.micStateTitle}>Report submitted</div>
            <div className={styles.micStateSub}>We’ll review it as soon as possible.</div>

            <div className={styles.micModalActions}>
              <button
                type="button"
                className={`${styles.micBtn} ${styles.micBtnPrimary}`}
                onClick={() => setShowReportModal(false)}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.micModalSectionTitle}>Why are you reporting this?</div>
            <div className={styles.micModalSectionSub}>Choose one reason.</div>

            <div className={styles.micRadioGrid}>
              {["Spam", "Harassment", "Inappropriate", "Other"].map((r) => (
                <label key={r} className={styles.micRadioCard}>
                  <input
                    type="radio"
                    name="reportReason"
                    value={r}
                    checked={reportReasons === r}
                    onChange={handleToggleReason}
                  />
                  <span className={styles.micRadioLabel}>{r}</span>
                </label>
              ))}
            </div>

            {reportReasons === "Other" && (
              <div className={styles.micTextareaBlock}>
                <label className={styles.micFieldLabel}>Describe</label>
                <textarea
                  className={styles.micTextarea}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Tell us more (optional, but helpful)"
                />
              </div>
            )}

            <div className={styles.micModalActions}>
              <button
                type="button"
                className={`${styles.micBtn} ${styles.micBtnPrimary}`}
                onClick={handleSubmitReport}
              >
                Submit
              </button>

              <button
                type="button"
                className={`${styles.micBtn} ${styles.micBtnGhost}`}
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  )
}

<DownloadOptionsModal
  isOpen={showDownloadModal}
  onClose={() => setShowDownloadModal(false)}
  mapData={mapData}
  mapDataProps={mapDataProps}
  downloadCount={download_count}
  isPublic={is_public}
  // ✅ pass auth info so modal can increment properly
  isUserLoggedIn={isUserLoggedIn}
  anonId={getAnonId()}
  // ✅ let modal tell MapDetail the new count
  onDownloadCountUpdate={(nextCount) => setDownloadCount(nextCount)}
  isPro={isPro}
/>

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



function findCommentById(nodes, targetId) {
  for (const n of nodes) {
    if (n.id === targetId) return n;
    if (n.Replies?.length) {
      const found = findCommentById(n.Replies, targetId);
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

function flattenReplies(root) {
  // Returns a flat array of all descendants in DFS order:
  // each item: { node, depth }
  const out = [];
  const stack = (root.Replies || []).map((n) => ({ node: n, depth: 2 }));

  while (stack.length) {
    const { node, depth } = stack.shift();
    out.push({ node, depth });

    const kids = node.Replies || [];
    if (kids.length) {
      // keep visual order: append children after their parent
      const next = kids.map((k) => ({ node: k, depth: depth + 1 }));
      stack.unshift(...next); // DFS-ish; use push(...next) for BFS
    }
  }

  return out;
}
function CommentRow({
  node,
  depth,

  // state + context
  isUserLoggedIn,
  profile,

  // limits
  MAX_DEPTH,

  // reply composer
  replyingTo,
  setReplyingTo,
  isPostingReply,
  handleReplySubmit,
  handleReplyCancel,

  // reactions + actions
  handleLike,
  handleDislike,
  handleDeleteCommentWithConfirm,

  // modals
  setShowLoginModal,
  setReportTargetComment,
  setShowReportModal,

  // styles + loading
  styles,
  reactionLoadingById,
  isMobileComments
}) {
  const isMine = isUserLoggedIn && node.user?.username === profile?.username;
  const canReply = isUserLoggedIn && depth < MAX_DEPTH;

  const reactionLoading = reactionLoadingById?.[node.id]; // "like" | "dislike" | undefined
  const likeBusy = reactionLoading === "like";
  const dislikeBusy = reactionLoading === "dislike";
  const anyBusy = !!reactionLoading;

  return (
    <li
      className={[
        styles.commentItem,
        depth > 1 ? styles.replyItem : "",
        isMobileComments ? styles.commentMobile : "",
        isMobileComments && depth > 1 ? styles.replyItemMobile : "",
      ].join(" ")}
    >
      <div className={styles.commentHeader}>
        {/* avatar */}
        {node.user?.profile_picture ? (
          isUserLoggedIn ? (
            <Link to={`/profile/${node.user.username}`}>
              <img
                src={node.user.profile_picture || "/default-profile-pic.jpg"}
                alt={`${node.user.username}'s profile`}
                className={styles.commentProfilePicture}
              />
            </Link>
          ) : (
            <button
              type="button"
              className={styles.avatarButton}
              onClick={() => setShowLoginModal(true)}
            >
              <img
                src={node.user.profile_picture || "/default-profile-pic.jpg"}
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
                to={`/profile/${node.user?.username || "unknown"}`}
                className={styles.commentAuthorLink}
              >
                <span className={styles.commentAuthor}>
                  {node.user?.username || "Unknown"}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                className={styles.commentAuthorBtn}
                onClick={() => setShowLoginModal(true)}
              >
                {node.user?.username || "Unknown"}
              </button>
            )}

            <span className={styles.dotSep}>•</span>

            <span className={styles.commentTime}>
              {formatDistanceToNow(new Date(node.created_at), { addSuffix: true })}
            </span>
          </div>

          <p className={styles.commentContent}>{node.content}</p>

          <div className={styles.commentActions}>
            <button
              type="button"
              className={`${styles.reactionButton} ${
                node.userReaction === "like" ? styles.reactionButtonActive : ""
              }`}
              disabled={anyBusy}
              onClick={() => {
                if (!isUserLoggedIn) return setShowLoginModal(true);
                handleLike(node.id, node.userReaction);
              }}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
              </svg>
              <span>{node.like_count}</span>
              {likeBusy && <span className={styles.tinySpinner} aria-hidden="true" />}
            </button>

            <button
              type="button"
              className={`${styles.reactionButton} ${
                node.userReaction === "dislike" ? styles.reactionButtonActive : ""
              }`}
              disabled={anyBusy}
              onClick={() => {
                if (!isUserLoggedIn) return setShowLoginModal(true);
                handleDislike(node.id, node.userReaction);
              }}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06l1.39 1.41 6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
              </svg>
              <span>{node.dislike_count}</span>
              {dislikeBusy && <span className={styles.tinySpinner} aria-hidden="true" />}
            </button>

            {canReply && (
              <button
                type="button"
                className={`${styles.reactionButton} ${styles.reactionButtonSmall}`}
                onClick={() => {
                  if (!isUserLoggedIn) return setShowLoginModal(true);
                  setReplyingTo({ parentId: node.id, content: "" });
                }}
                title="Reply"
              >
                <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 9V5l-7 7 7 7v-4.1c4.55 0 7.83 1.24 10.27 3.32-.4-4.28-2.92-7.39-10.27-7.39z" />
                </svg>
                <span>Reply</span>
              </button>
            )}

            {isMine ? (
              <button
                type="button"
                className={`${styles.reactionButton} ${styles.dangerButton}`}
                onClick={() => handleDeleteCommentWithConfirm(node.id)}
              >
                <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h1v12a2 2 0 002 2h10a2 2 0 002-2V6h1a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0015 2H9zM10 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
                </svg>
              </button>
            ) : (
              isUserLoggedIn && (
                <button
                  type="button"
                  className={`${styles.reactionButton} ${styles.reactionButtonSmall}`}
                  onClick={() => {
                    setReportTargetComment(node.id);
                    setShowReportModal(true);
                  }}
                >
                  <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 5v14h2V5H5zm2 0l10 4-10 4V5z" />
                  </svg>
                  <span>Report</span>
                </button>
              )
            )}
          </div>

          {canReply && replyingTo && replyingTo.parentId === node.id && (
            <form onSubmit={handleReplySubmit} className={styles.replyForm}>
              <textarea
                value={replyingTo.content}
                onChange={(e) =>
                  setReplyingTo((prev) => ({ ...prev, content: e.target.value }))
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
                  className={`${styles.replyButtonSubmit} ${
                    isPostingReply ? styles.replyButtonSubmitLoading : ""
                  }`}
                  disabled={isPostingReply}
                  title={isPostingReply ? "Posting…" : "Post reply"}
                >
                  {isPostingReply ? (
                    <span className={styles.tinySpinner} aria-hidden="true" />
                  ) : (
                    <BiSend />
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </li>
  );
}



function CommentNode({
  node,
  depth = 1,

  // state + context
  isUserLoggedIn,
  profile,

  // threading UI
  expandedThreads,
  toggleThread,
  MAX_DEPTH,
  PREVIEW_COUNT,
  MAX_SHOWN_REPLIES,

  // reply composer
  replyingTo,
  setReplyingTo,
  isPostingReply,
  handleReplySubmit,
  handleReplyCancel,

  // reactions + actions
  handleLike,
  handleDislike,
  handleDeleteCommentWithConfirm,

  // modals
  setShowLoginModal,
  setReportTargetComment,
  setShowReportModal,

  // styles
  styles,
  reactionLoadingById,
  isMobileComments
}) {
  const isMine = isUserLoggedIn && node.user?.username === profile?.username;

  const replies = node.Replies || [];
  const total = replies.length;

  // collapse logic per node
  const expanded = !!expandedThreads?.[node.id];
  const limit = expanded ? MAX_SHOWN_REPLIES : PREVIEW_COUNT;
  const shownReplies = replies.slice(0, limit);

  const canReply = isUserLoggedIn && depth < MAX_DEPTH;

  const reactionLoading = reactionLoadingById?.[node.id]; // "like" | "dislike" | undefined
  const likeBusy = reactionLoading === "like";
  const dislikeBusy = reactionLoading === "dislike";
  const anyBusy = !!reactionLoading;




  return (
  <li
  className={[
    styles.commentItem,
    depth > 1 ? styles.replyItem : "",
    isMobileComments ? styles.commentMobile : "",
    isMobileComments && depth > 1 ? styles.replyItemMobile : "",
  ].join(" ")}
>

      <div className={styles.commentHeader}>
        {/* avatar */}
        {node.user?.profile_picture ? (
          isUserLoggedIn ? (
            <Link to={`/profile/${node.user.username}`}>
              <img
                src={node.user.profile_picture || "/default-profile-pic.jpg"}
                alt={`${node.user.username}'s profile`}
                className={styles.commentProfilePicture}
              />
            </Link>
          ) : (
            <button
              type="button"
              className={styles.avatarButton}
              onClick={() => setShowLoginModal(true)}
            >
              <img
                src={node.user.profile_picture || "/default-profile-pic.jpg"}
                alt="Profile"
                className={styles.commentProfilePicture}
              />
            </button>
          )
        ) : (
          <div className={styles.commentPlaceholder} />
        )}

        <div className={styles.commentContentWrapper}>
          {/* author + time */}
          <div className={styles.commentInfo}>
            {isUserLoggedIn ? (
              <Link
                to={`/profile/${node.user?.username || "unknown"}`}
                className={styles.commentAuthorLink}
              >
                <span className={styles.commentAuthor}>
                  {node.user?.username || "Unknown"}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                className={styles.commentAuthorBtn}
                onClick={() => setShowLoginModal(true)}
              >
                {node.user?.username || "Unknown"}
              </button>
            )}

            <span className={styles.dotSep}>•</span>

            <span className={styles.commentTime}>
              {formatDistanceToNow(new Date(node.created_at), { addSuffix: true })}
            </span>
          </div>

          {/* content */}
          <p className={styles.commentContent}>{node.content}</p>

          {/* actions (works at any depth) */}
          <div className={styles.commentActions}>
           <button
              type="button"
              className={`${styles.reactionButton} ${
                node.userReaction === "like" ? styles.reactionButtonActive : ""
              }`}
              disabled={anyBusy}
              onClick={() => {
                if (!isUserLoggedIn) return setShowLoginModal(true);
                handleLike(node.id, node.userReaction);
              }}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 21h4V9H1v12zM23 10c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 2 7.59 8.59C7.22 8.95 7 9.45 7 10v9c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.85-1.22L23 12.41V10z" />
              </svg>

              <span>{node.like_count}</span>

              {likeBusy && <span className={styles.tinySpinner} aria-hidden="true" />}
            </button>

            <button
              type="button"
              className={`${styles.reactionButton} ${
                node.userReaction === "dislike" ? styles.reactionButtonActive : ""
              }`}
              disabled={anyBusy}
              onClick={() => {
                if (!isUserLoggedIn) return setShowLoginModal(true);
                handleDislike(node.id, node.userReaction);
              }}
            >
              <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 3H6c-.83 0-1.54.5-1.85 1.22L1 11.59V14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17 .79 .44 1.06l1.39 1.41 6.58 -6.59c .36 -.36 .59 -.86 .59 -1.41V5c0 -1.1 -.9 -2 -2 -2zm4 0v12h4V3h-4z" />
              </svg>

              <span>{node.dislike_count}</span>

              {dislikeBusy && <span className={styles.tinySpinner} aria-hidden="true" />}
            </button>


            {canReply && (
              <button
                type="button"
                className={`${styles.reactionButton} ${styles.reactionButtonSmall}`}
                onClick={() => {
                  if (!isUserLoggedIn) return setShowLoginModal(true);
                  setReplyingTo({ parentId: node.id, content: "" });
                }}
                title="Reply"
              >
                <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 9V5l-7 7 7 7v-4.1c4.55 0 7.83 1.24 10.27 3.32-.4-4.28-2.92-7.39-10.27-7.39z" />
                </svg>
                <span>Reply</span>
              </button>
            )}

            {isMine ? (
              <button
                type="button"
                className={`${styles.reactionButton} ${styles.dangerButton}`}
                onClick={() => handleDeleteCommentWithConfirm(node.id)}
              >
                <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2h1v12a2 2 0 002 2h10a2 2 0 002-2V6h1a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0015 2H9zM10 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
                </svg>
              </button>
            ) : (
              isUserLoggedIn && (
                <button
                  type="button"
                  className={`${styles.reactionButton} ${styles.reactionButtonSmall}`}

                  onClick={() => {
                    setReportTargetComment(node.id);
                    setShowReportModal(true);
                  }}
                >
                  <svg className={styles.iconSmall} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5 5v14h2V5H5zm2 0l10 4-10 4V5z" />
                  </svg>
                  <span>Report</span>
                </button>
              )
            )}
          </div>

          {/* reply form */}
          {canReply && replyingTo && replyingTo.parentId === node.id && (
            <form onSubmit={handleReplySubmit} className={styles.replyForm}>
              <textarea
                value={replyingTo.content}
                onChange={(e) =>
                  setReplyingTo((prev) => ({ ...prev, content: e.target.value }))
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
                  className={`${styles.replyButtonSubmit} ${
                    isPostingReply ? styles.replyButtonSubmitLoading : ""
                  }`}
                  disabled={isPostingReply}
                  title={isPostingReply ? "Posting…" : "Post reply"}
                >
                  {isPostingReply ? (
                    <span className={styles.tinySpinner} aria-hidden="true" />
                  ) : (
                    <BiSend />
                  )}
                </button>

              </div>
            </form>
          )}

        {/* children */}
{total > 0 && (
  <>
    {isMobileComments ? (
      // MOBILE: flat list of all descendants (no nesting)
      <ul className={styles.repliesListMobile}>
        {flattenReplies(node)
          .slice(0, expanded ? MAX_SHOWN_REPLIES : PREVIEW_COUNT)
          .map(({ node: flatNode, depth: flatDepth }) => (
            <CommentRow
              key={flatNode.id}
              node={flatNode}
              depth={flatDepth}
              reactionLoadingById={reactionLoadingById}
              isMobileComments={isMobileComments}
              {...{
                isUserLoggedIn,
                profile,
                MAX_DEPTH,
                replyingTo,
                setReplyingTo,
                isPostingReply,
                handleReplySubmit,
                handleReplyCancel,
                handleLike,
                handleDislike,
                handleDeleteCommentWithConfirm,
                setShowLoginModal,
                setReportTargetComment,
                setShowReportModal,
                styles,
              }}
            />

          ))}
      </ul>
    ) : (
      // DESKTOP: normal nested tree
      <ul className={styles.repliesList}>
        {shownReplies.map((child) => (
          <CommentNode
            key={child.id}
            node={child}
            depth={depth + 1}
            reactionLoadingById={reactionLoadingById}
            isMobileComments={isMobileComments}
            {...{
              isUserLoggedIn,
              profile,
              expandedThreads,
              toggleThread,
              MAX_DEPTH,
              PREVIEW_COUNT,
              MAX_SHOWN_REPLIES,
              replyingTo,
              setReplyingTo,
              isPostingReply,
              handleReplySubmit,
              handleReplyCancel,
              handleLike,
              handleDislike,
              handleDeleteCommentWithConfirm,
              setShowLoginModal,
              setReportTargetComment,
              setShowReportModal,
              styles,
            }}
          />
        ))}
      </ul>
    )}

    {/* toggle buttons stay */}
    {total > PREVIEW_COUNT && !expanded && (
      <button
        type="button"
        className={styles.toggleRepliesButton}
        onClick={() => toggleThread(node.id)}
      >
        Show rest of thread ({Math.min(total, MAX_SHOWN_REPLIES) - PREVIEW_COUNT})
      </button>
    )}

    {expanded && (
      <button
        type="button"
        className={styles.toggleRepliesButton}
        onClick={() => toggleThread(node.id)}
      >
        Show less
      </button>
    )}

    {expanded && total > MAX_SHOWN_REPLIES && (
      <div className={styles.threadHintMuted}>
        Showing {MAX_SHOWN_REPLIES} of {total} replies
      </div>
    )}
  </>
)}

        </div>
      </div>
    </li>
  );
}
