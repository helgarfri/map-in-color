// src/components/ProfileActivityFeed.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FaStar, FaPlus, FaComment, FaInfoCircle } from 'react-icons/fa';

import { fetchUserActivity } from '../api';
import Map from './Map';
import SkeletonActivityRow from './SkeletonActivityRow';

// ✅ Use the SAME CSS as DashboardActivityFeed
import styles from './DashboardActivityFeed.module.css';

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

  // Reset + load first page when username changes
  useEffect(() => {
    if (!username) return;
    setActivities([]);
    setOffset(0);
    setHasMore(true);
    loadFirstPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  async function loadFirstPage() {
    try {
      setIsInitialLoading(true);
      const res = await fetchUserActivity(username, 0, limit);
      const newItems = res.data || [];
      setActivities(newItems);
      setHasMore(newItems.length === limit);
    } catch (err) {
      console.error('Error fetching user activity:', err);
      setHasMore(false);
    } finally {
      setIsInitialLoading(false);
    }
  }

  async function loadMore() {
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
  }

  // IntersectionObserver for infinite scroll
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return;

    const el = sentinelRef.current;

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

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [hasMore, isFetchingMore, isInitialLoading, offset]); // offset ok

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
   * ✅ SAME thumbnail approach as DashboardActivityFeed:
   * - Always uses <Map />
   * - Blocks interactions inside the map thumbnail
   * - Keeps overlay with avatar + icon
   */
  function renderMapThumbnail(mapObj, type) {
    if (!mapObj) {
      return <div className={styles.defaultThumbnail}>No Map</div>;
    }

    const title = mapObj.title || 'Untitled';

    const ocean_color = mapObj.ocean_color ?? '#ffffff';
    const unassigned_color = mapObj.unassigned_color ?? '#c0c0c0';
    const font_color = mapObj.font_color ?? 'black';

    const is_title_hidden = !!mapObj.is_title_hidden;
    const showNoDataLegend = !!mapObj.show_no_data_legend;

    const titleFontSize =
      mapObj.title_font_size ?? mapObj.titleFontSize ?? null;
    const legendFontSize =
      mapObj.legend_font_size ?? mapObj.legendFontSize ?? null;

    const groups = Array.isArray(mapObj.groups) ? mapObj.groups : [];
    const data = Array.isArray(mapObj.data) ? mapObj.data : [];

    // IMPORTANT: use the map's selected_map (fallback to world)
    const selected_map = mapObj.selected_map || 'world';

    return (
      <div className={styles.thumbContainer}>
        <div className={styles.thumbMapStage}>
          <Map
            groups={groups}
            mapTitleValue={title}
            ocean_color={ocean_color}
            unassigned_color={unassigned_color}
            data={data}
            selected_map={selected_map}
            font_color={font_color}
            is_title_hidden={is_title_hidden}
            isThumbnail={true}
            showNoDataLegend={showNoDataLegend}
            titleFontSize={titleFontSize}
            legendFontSize={legendFontSize}
          />
        </div>

        {/* ✅ blocks hover/zoom/pan/tooltip inside thumbnail */}
        <div className={styles.interactionBlocker} aria-hidden="true" />

        {/* ✅ overlay: avatar + icon */}
        <div className={styles.activityOverlay} aria-hidden="true">
          <img
            className={styles.activityAvatar}
            src={profile_pictureUrl || '/default-profile-picture.png'}
            alt="User"
          />
          <div className={styles.activityIcon}>{getActivityIcon(type)}</div>
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
