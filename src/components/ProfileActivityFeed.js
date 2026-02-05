// src/components/ProfileActivityFeed.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaStar, FaPlus, FaComment, FaInfoCircle } from 'react-icons/fa';

import { fetchUserActivity } from '../api';
import Map from './Map';
import SkeletonActivityRow from './SkeletonActivityRow';

// ✅ Use the SAME CSS as DashboardActivityFeed
import styles from './DashboardActivityFeed.module.css';

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

function looksLikeRanges(arr) {
  return (
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every((g) => {
      if (!g || typeof g !== 'object') return false;

      const hasLower = g.lowerBound != null || g.lower != null || g.min != null;
      const hasUpper = g.upperBound != null || g.upper != null || g.max != null;
      const hasColor = g.color != null;

      const hasCountriesArray = Array.isArray(g.countries);
      return hasLower && hasUpper && hasColor && !hasCountriesArray;
    })
  );
}

/**
 * Normalize map object coming from profile activity endpoint:
 * - Supports snake_case + camelCase
 * - Supports choropleth properly via: custom_ranges + map_data_type
 * - Legacy fallback: if groups "look like ranges", treat them as custom_ranges
 */
function normalizeMapForPreview(mapObj) {
  if (!mapObj) return null;

  const title = mapObj.title || 'Untitled';

  const ocean_color = mapObj.ocean_color ?? '#ffffff';
  const unassigned_color = mapObj.unassigned_color ?? '#c0c0c0';
  const font_color = mapObj.font_color ?? 'black';

  const is_title_hidden = !!mapObj.is_title_hidden;
  const showNoDataLegend = !!mapObj.show_no_data_legend;

  const titleFontSize = mapObj.title_font_size ?? mapObj.titleFontSize ?? null;
  const legendFontSize = mapObj.legend_font_size ?? mapObj.legendFontSize ?? null;

  const data = toArrayMaybeJson(mapObj.data);

  const selectedMap =
    mapObj.selected_map ?? mapObj.selectedMap ?? mapObj.map ?? 'world';

  let groups = toArrayMaybeJson(mapObj.groups);

  // ✅ choropleth ranges (backend now sends this)
  let customRanges =
    Array.isArray(mapObj.custom_ranges)
      ? mapObj.custom_ranges
      : Array.isArray(mapObj.customRanges)
      ? mapObj.customRanges
      : toArrayMaybeJson(mapObj.custom_ranges);

  // ✅ legacy: if custom_ranges missing but groups look like ranges
  if (!customRanges.length && looksLikeRanges(groups)) {
    customRanges = groups;
    groups = [];
  }

  // ✅ map type (backend now sends map_data_type)
  const mapDataType =
    mapObj.map_data_type ??
    mapObj.mapDataType ??
    mapObj.map_type ??
    mapObj.type ??
    (customRanges.length ? 'choropleth' : 'categorical');

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

export default function ProfileActivityFeed({ username, profile_pictureUrl }) {
  const navigate = useNavigate();

  // Pagination
  const [activities, setActivities] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 15;
  const [hasMore, setHasMore] = useState(true);

  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Sentinel for infinite scrolling
  const sentinelRef = useRef(null);

  const loadFirstPage = useCallback(async () => {
    if (!username) return;

    try {
      setIsInitialLoading(true);
      const res = await fetchUserActivity(username, 0, limit);
      const newItems = res.data || [];
      setActivities(newItems);
      setOffset(0);
      setHasMore(newItems.length === limit);
    } catch (err) {
      console.error('Error fetching user activity:', err);
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
    }
  }, [username]);

  const loadMore = useCallback(async () => {
    if (!username) return;
    if (isFetchingMore || isInitialLoading || !hasMore) return;

    try {
      setIsFetchingMore(true);
      const newOffset = offset + limit;
      const res = await fetchUserActivity(username, newOffset, limit);
      const newItems = res.data || [];

      setActivities((prev) => [...prev, ...newItems]);
      setOffset(newOffset);

      if (newItems.length < limit) setHasMore(false);
    } catch (err) {
      console.error('Error fetching more user activity:', err);
      setHasMore(false);
    } finally {
      setIsFetchingMore(false);
    }
  }, [username, offset, hasMore, isFetchingMore, isInitialLoading]);

  // Reset + load first page when username changes
  useEffect(() => {
    if (!username) return;
    setActivities([]);
    setOffset(0);
    setHasMore(true);
    loadFirstPage();
  }, [username, loadFirstPage]);

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          loadMore();
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [hasMore, loadMore]);

  // Utils
  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  function getActivityIcon(type) {
    switch (type) {
      case 'createdMap':
        return <FaPlus />;
      case 'starredMap':
        return <FaStar />;
      case 'commented':
        return <FaComment />;
      default:
        return <FaInfoCircle />;
    }
  }

  function renderMapTitle(map) {
    if (!map) return 'Untitled';
    return (
      <strong
        className={styles.mapTitleLink}
        onClick={(e) => {
          e.stopPropagation();
          if (map?.id) navigate(`/map/${map.id}`);
        }}
      >
        {map.title || 'Untitled'}
      </strong>
    );
  }

  function renderCommentBox(act) {
    const commentAvatarUrl =
      act.commentAuthor?.profile_picture || '/default-profile-picture.png';

    return (
      <div className={styles.commentBox}>
        <img
          className={styles.commentAuthorAvatar}
          src={commentAvatarUrl}
          alt="Comment Author"
          onClick={(e) => {
            e.stopPropagation();
            if (act.commentAuthor?.username) {
              navigate(`/profile/${act.commentAuthor.username}`);
            }
          }}
        />
        <div className={styles.commentBody}>{act.commentContent}</div>
      </div>
    );
  }

  /**
   * Thumbnail renderer (matches dashboard behavior)
   */
  function renderMapThumbnail(mapObj, actType) {
    const normalized = normalizeMapForPreview(mapObj);

    if (!normalized) {
      return <div className={styles.defaultThumbnail}>No Map</div>;
    }

    return (
      <div className={styles.thumbContainer}>
        <div className={styles.thumbMapStage}>
          <Map
            groups={normalized.groups}
            data={normalized.data}
            selected_map={normalized.selectedMap}
            mapDataType={normalized.mapDataType}
            customRanges={normalized.customRanges}   // ✅ camelCase
            custom_ranges={normalized.customRanges}  // ✅ snake_case fallback
            mapTitleValue={normalized.title}
            ocean_color={normalized.ocean_color}
            unassigned_color={normalized.unassigned_color}
            font_color={normalized.font_color}
            is_title_hidden={normalized.is_title_hidden}
            isThumbnail={true}
            showNoDataLegend={normalized.showNoDataLegend}
            titleFontSize={normalized.titleFontSize}
            legendFontSize={normalized.legendFontSize}
          />
        </div>

        <div className={styles.interactionBlocker} aria-hidden="true" />

        <div className={styles.activityOverlay} aria-hidden="true">
          <img
            className={styles.activityAvatar}
            src={profile_pictureUrl || '/default-profile-picture.png'}
            alt="User"
          />
          <div className={styles.activityIcon}>{getActivityIcon(actType)}</div>
        </div>
      </div>
    );
  }

  function renderActivityItem(act, idx) {
    const { type, map, commentContent, created_at } = act;
    const mapThumb = renderMapThumbnail(map, type);

    let mainText;
    if (type === 'createdMap') {
      mainText = (
        <>
          {username} created map {renderMapTitle(map)}
        </>
      );
    } else if (type === 'starredMap') {
      mainText = (
        <>
          {username} starred map {renderMapTitle(map)}
        </>
      );
    } else if (type === 'commented') {
      mainText = (
        <>
          {username} commented on {renderMapTitle(map)}
        </>
      );
    } else {
      mainText = <>Activity: {type}</>;
    }

    return (
      <div
        key={idx}
        className={styles.activityItem}
        onClick={() => {
          if (map?.id) navigate(`/map/${map.id}`);
        }}
      >
        {mapThumb}

        <div className={styles.activityDetails}>
          <p className={styles.mainText}>{mainText}</p>
          {commentContent && renderCommentBox(act)}
          <div className={styles.timestampBox}>{timeAgo(created_at)}</div>
        </div>
      </div>
    );
  }

  // Initial load skeletons
  if (isInitialLoading && activities.length === 0) {
    return (
      <div className={styles.dashActivityFeed}>
        <SkeletonActivityRow />
        <SkeletonActivityRow />
        <SkeletonActivityRow />
      </div>
    );
  }

  if (!isInitialLoading && activities.length === 0) {
    return <p>No recent activity.</p>;
  }

  return (
    <div className={styles.dashActivityFeed}>
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
