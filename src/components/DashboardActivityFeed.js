// src/components/DashboardActivityFeed.js
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fetchDashboardActivity, markNotificationAsRead, fetchMapById } from '../api';
import useWindowSize from '../hooks/useWindowSize';


import {
  FaStar,
  FaPlus,
  FaComment,
  FaReply,
  FaThumbsUp,
  FaInfoCircle,
} from 'react-icons/fa';


import Map from './Map';
import SkeletonActivityRow from './SkeletonActivityRow';
import dashFeedStyles from './DashboardActivityFeed.module.css';

/**
 * Safe parsing helper:
 * - Accepts arrays, JSON strings, or null/undefined
 * - Returns [] if not valid
 */
function toArrayMaybeJson(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeMapForPreview(mapObj) {
  if (!mapObj) return null;

  const title = mapObj.title || "Untitled";

  const ocean_color = mapObj.ocean_color ?? "#ffffff";
  const unassigned_color = mapObj.unassigned_color ?? "#c0c0c0";
  const font_color = mapObj.font_color ?? "black";

  const is_title_hidden = !!mapObj.is_title_hidden;
  const showNoDataLegend = !!mapObj.show_no_data_legend;

  const titleFontSize = mapObj.title_font_size ?? mapObj.titleFontSize ?? null;
  const legendFontSize = mapObj.legend_font_size ?? mapObj.legendFontSize ?? null;

  // ✅ these were missing in your version (caused eslint no-undef)
  const data = toArrayMaybeJson(mapObj.data);
  const selectedMap =
    mapObj.selected_map ?? mapObj.selectedMap ?? mapObj.map ?? "world";

  let groups = toArrayMaybeJson(mapObj.groups);

  // 1) normal custom_ranges (preferred)
  let customRanges =
    Array.isArray(mapObj.custom_ranges)
      ? mapObj.custom_ranges
      : Array.isArray(mapObj.customRanges)
      ? mapObj.customRanges
      : toArrayMaybeJson(mapObj.custom_ranges);

  // 2) If custom_ranges is missing BUT groups looks like ranges, treat groups as ranges
  const groupsLookLikeRanges =
    Array.isArray(groups) &&
    groups.length > 0 &&
    groups.every((g) => {
      if (!g || typeof g !== "object") return false;

      const hasLower = g.lowerBound != null || g.lower != null || g.min != null;
      const hasUpper = g.upperBound != null || g.upper != null || g.max != null;
      const hasColor = g.color != null;

      // ranges usually DON'T have countries[]
      const hasCountriesArray = Array.isArray(g.countries);

      return hasLower && hasUpper && hasColor && !hasCountriesArray;
    });

  if (!customRanges.length && groupsLookLikeRanges) {
    customRanges = groups; // 🔥 use these as custom_ranges
    groups = [];           // prevent categorical path using them
  }

  // 3) decide type
  const mapDataType =
    mapObj.map_data_type ??
    mapObj.mapDataType ??
    mapObj.map_type ??
    mapObj.type ??
    (customRanges.length ? "choropleth" : "categorical");

  return {
    title,
    ocean_color,
    unassigned_color,
    font_color,
    is_title_hidden,
    showNoDataLegend,
    titleFontSize,
    legendFontSize,
    groups,
    data,
    selectedMap,
    customRanges,
    mapDataType,
  };
}


const MOBILE_BREAKPOINT = 700;
const DESKTOP_LIMIT = 15;
const MOBILE_LIMIT = 5;

export default function DashboardActivityFeed({ userProfile }) {
  const navigate = useNavigate();
  const { width } = useWindowSize();
  const isMobile = width !== undefined && width < MOBILE_BREAKPOINT;
  const limit = isMobile ? MOBILE_LIMIT : DESKTOP_LIMIT;

  // feed data + pagination
  const [activities, setActivities] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // loading states
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [mapCache, setMapCache] = useState({});



  // sentinel for infinite scroll
  const sentinelRef = useRef(null);

  // Only show activities for maps that still exist and are public (no "No Map" / private thumbnails)
  const isMapValidForFeed = (act) => {
    const map = act?.map;
    if (!map || map.id == null) return false;
    return map.is_public !== false; // treat missing is_public as public
  };

  const loadFirstPage = useCallback(async () => {
    try {
      setIsInitialLoading(true);
      const res = await fetchDashboardActivity(0, limit);
      const raw = res.data || [];
      const newBatch = raw.filter(isMapValidForFeed);
      setActivities(newBatch);
      setHasMore(isMobile ? false : raw.length === limit);
      setOffset(0);
    } catch (err) {
      console.error('Error loading feed:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }, [limit, isMobile]);

  const loadMore = useCallback(async () => {
    if (isMobile) return; /* never load more below 700px */
    try {
      setIsFetchingMore(true);
      const newOffset = offset + limit;
      const res = await fetchDashboardActivity(newOffset, limit);
      const raw = res.data || [];
      const newBatch = raw.filter(isMapValidForFeed);

      setActivities((prev) => [...prev, ...newBatch]);
      setOffset(newOffset);

      if (raw.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more feed:', err);
    } finally {
      setIsFetchingMore(false);
    }
  }, [offset, limit, isMobile]);

  // reset + initial load (reload when limit changes e.g. crossing 700px)
  useEffect(() => {
    if (!userProfile) return;
    setActivities([]);
    setHasMore(true);
    loadFirstPage();
  }, [userProfile, loadFirstPage]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          if (!isFetchingMore && !isInitialLoading && hasMore) {
            loadMore();
          }
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);

    return () => {
      if (observer && sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [hasMore, isFetchingMore, isInitialLoading, loadMore]);

  // -----------
  // item click
  // -----------
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

  // -----------
  // utility
  // -----------
  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  function getOverlayAvatarUrl(act) {
    if (act.type?.startsWith('notification_') && act.notificationData?.sender) {
      return act.notificationData.sender.profile_picture || '/default-profile-picture.png';
    }
    return userProfile?.profile_picture || '/default-profile-picture.png';
  }

  function getOverlayAvatarUsername(act) {
    if (act.type?.startsWith('notification_') && act.notificationData?.sender) {
      return act.notificationData.sender.username || 'unknown';
    }
    return userProfile?.username || 'unknown';
  }

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



  function mapNeedsHydration(map) {
  if (!map?.id) return false;

  // thumbnail coloring needs real payload:
  // data + (custom_ranges OR groups)
  const hasData = map.data != null;
  const hasGroups = map.groups != null;
  const hasRanges = map.custom_ranges != null || map.customRanges != null;

  return !(hasData && (hasGroups || hasRanges));
}

useEffect(() => {
  const idsToFetch = [];

  for (const act of activities) {
    const m = act?.map;
    if (!m?.id) continue;
    if (mapCache[m.id]) continue;
    if (mapNeedsHydration(m)) idsToFetch.push(m.id);
  }

  if (idsToFetch.length === 0) return;

  let cancelled = false;

  (async () => {
    try {
      const results = await Promise.allSettled(
        idsToFetch.map((id) => fetchMapById(id))
      );

      if (cancelled) return;

      setMapCache((prev) => {
        const next = { ...prev };
        for (const r of results) {
          if (r.status !== 'fulfilled') continue;
          const fullMap = r.value?.data;
          if (fullMap?.id) next[fullMap.id] = fullMap;
        }
        return next;
      });
    } catch (e) {
      console.error("Hydration failed:", e);
    }
  })();

  return () => {
    cancelled = true;
  };
}, [activities, mapCache]);


  /**
   * Single-map thumbnail renderer:
   * - Always uses <Map />
   * - Fully normalized props
   */
  function renderMapThumbnail(mapObj, act) {
const mapToRender = mapObj?.id && mapCache[mapObj.id] ? mapCache[mapObj.id] : mapObj;
const normalized = normalizeMapForPreview(mapToRender);
    if (!normalized) {
      return <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
    }


return (
  <div className={dashFeedStyles.thumbContainer}>
    <div className={dashFeedStyles.thumbMapStage}>
      <Map
        groups={normalized.groups}
        data={normalized.data}
        selected_map={normalized.selectedMap}
        mapDataType={normalized.mapDataType}
        custom_ranges={normalized.customRanges}
        mapTitleValue={normalized.title}
        ocean_color={normalized.ocean_color}
        unassigned_color={normalized.unassigned_color}
        font_color={normalized.font_color}
        is_title_hidden={normalized.is_title_hidden}
        isThumbnail={true}
        showNoDataLegend={normalized.showNoDataLegend}
        titleFontSize={normalized.titleFontSize}
        legendFontSize={normalized.legendFontSize}
        strokeMode='thin'
      />
    </div>

    {/* Blocks hover/zoom/pan/tooltips; row click still works */}
    <div className={dashFeedStyles.interactionBlocker} aria-hidden="true" />
  </div>
);

  }

  function renderSenderName(act) {
    if (!act.type?.startsWith('notification_')) return <strong>You</strong>;
    const sender = act.notificationData?.sender;
    if (!sender) return <strong>Someone</strong>;

    const displayName =
      (sender.first_name || sender.last_name)
        ? `${sender.first_name || ''} ${sender.last_name || ''}`.trim()
        : (sender.username || 'Someone');

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

  function renderMapTitle(map) {
    if (!map) return 'Untitled';
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



  function getCommentAuthorUsername(act) {
    if (act.commentAuthor?.username) return act.commentAuthor.username;
    if (act.type === 'commented') return userProfile?.username || 'unknown';
    return 'unknown';
  }

  function renderCommentBox(act) {
    const commentAuthor = getCommentAuthorUsername(act);
    return (
      <div className={dashFeedStyles.commentBox}>
        
        <div className={dashFeedStyles.commentBody}>{act.commentContent}</div>
      </div>
    );
  }

  function renderMetaRow(act) {
  const avatarUrl = getOverlayAvatarUrl(act);
  const overlayUsername = getOverlayAvatarUsername(act);
  const icon = getActivityIcon(act.type);

  // label on the right (for notifications show sender, otherwise "You")
  const label = act.type?.startsWith("notification_")
    ? (act.notificationData?.sender?.username || "someone")
    : (userProfile?.username || "you");

  return (
    <div className={dashFeedStyles.metaRow}>
      <img
        className={dashFeedStyles.metaAvatar}
        src={avatarUrl}
        alt="User"
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/profile/${overlayUsername}`);
        }}
      />

      <div className={dashFeedStyles.metaMiddle}>
        <div
          className={dashFeedStyles.metaName}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${overlayUsername}`);
          }}
          title={label}
        >
          {label}
        </div>
      </div>

      <div className={dashFeedStyles.metaIconPill} aria-hidden="true">
        {icon}
      </div>
    </div>
  );
}


  function renderActivityItem(act, idx) {
    const { type, map, commentContent, created_at } = act;
    const mapThumb = renderMapThumbnail(map, act);

    let mainText;
    if (type === 'createdMap') {
      mainText = <>You created map {renderMapTitle(map)}</>;
    } else if (type === 'starredMap') {
      mainText = <>You starred map {renderMapTitle(map)}</>;
    } else if (type === 'commented') {
      mainText = <>You commented on {renderMapTitle(map)}</>;
    } else if (type === 'notification_star') {
      mainText = <>{renderSenderName(act)} starred your map {renderMapTitle(map)}</>;
    } else if (type === 'notification_reply') {
      mainText = <>{renderSenderName(act)} replied to your comment on {renderMapTitle(map)}</>;
    } else if (type === 'notification_like') {
      mainText = <>{renderSenderName(act)} liked your comment on {renderMapTitle(map)}</>;
    } else if (type === 'notification_comment') {
      mainText = <>{renderSenderName(act)} commented on your map {renderMapTitle(map)}</>;
    } else {
      mainText = <>Activity: {type}</>;
    }

    const isCommentRelated = [
      'commented',
      'notification_comment',
      'notification_reply',
      'notification_like',
    ].includes(type);

    const shouldShowCommentBox = isCommentRelated && commentContent;

    return (
      <div
        key={idx}
        className={dashFeedStyles.activityItem}
        onClick={() => handleItemClick(act)}
      >
        {mapThumb}
      <div className={dashFeedStyles.activityDetails}>
  {renderMetaRow(act)}
  <p className={dashFeedStyles.mainText}>{mainText}</p>
  {shouldShowCommentBox && renderCommentBox(act)}
  <div className={dashFeedStyles.timestampBox}>{timeAgo(created_at)}</div>
</div>

      </div>
    );
  }

  // skeleton on first load
  if (isInitialLoading && activities.length === 0) {
    return (
      <div className={dashFeedStyles.dashActivityFeed}>
        <SkeletonActivityRow />
        <SkeletonActivityRow />
        <SkeletonActivityRow />
      </div>
    );
  }

if (!isInitialLoading && activities.length === 0) {
  return <p className={dashFeedStyles.emptyText}>No recent activity.</p>;
}


  return (
    <div className={dashFeedStyles.dashActivityFeed}>
      {activities.map((act, i) => renderActivityItem(act, i))}

      {isFetchingMore && (
        <>
          <SkeletonActivityRow />
          <SkeletonActivityRow />
        </>
      )}

      {hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
    </div>
  );
}
