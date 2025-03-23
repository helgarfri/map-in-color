// src/components/ProfileActivityFeed.js
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  FaStar,
  FaPlus,
  FaComment,
  FaInfoCircle,
} from 'react-icons/fa';

import { fetchUserActivity } from '../api';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import SkeletonActivityRow from './SkeletonActivityRow';

import styles from './DashboardActivityFeed.module.css';

export default function ProfileActivityFeed({ username, profile_pictureUrl }) {
  const navigate = useNavigate();

  // Pagination states
  const [activities, setActivities] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 15;
  const [hasMore, setHasMore] = useState(true);

  // Loading states
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // Sentinel for infinite scrolling
  const sentinelRef = useRef(null);

  // Reset and load first page whenever username changes
  useEffect(() => {
    if (!username) return;
    setActivities([]);
    setOffset(0);
    setHasMore(true);
    loadFirstPage();
  }, [username]);

  // --------------------------
  // Loaders
  // --------------------------
  async function loadFirstPage() {
    try {
      setIsInitialLoading(true);
      const res = await fetchUserActivity(username, 0, limit); 
      // fetchUserActivity(username, offset = 0, limit = 15)
      const newItems = res.data;
      setActivities(newItems);
      setHasMore(newItems.length === limit);
    } catch (err) {
      console.error('Error fetching user activity:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }

  async function loadMore() {
    try {
      setIsFetchingMore(true);
      const newOffset = offset + limit;
      const res = await fetchUserActivity(username, newOffset, limit);
      const newItems = res.data;
      setActivities((prev) => [...prev, ...newItems]);
      setOffset(newOffset);
      if (newItems.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching more user activity:', err);
    } finally {
      setIsFetchingMore(false);
    }
  }

  // --------------------------
  // IntersectionObserver
  // --------------------------
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
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1, // Trigger when 10% is visible
      }
    );

    observer.observe(sentinelRef.current);
    return () => {
      if (observer && sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [sentinelRef, hasMore, isFetchingMore, isInitialLoading, offset]);

  // --------------------------
  // Utility
  // --------------------------
  function timeAgo(dateString) {
    if (!dateString) return '';
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  function getActivityIcon(type) {
    switch (type) {
      case 'createdMap': return <FaPlus />;
      case 'starredMap': return <FaStar />;
      case 'commented':  return <FaComment />;
      default:          return <FaInfoCircle />;
    }
  }

  // --------------------------
  // Rendering
  // --------------------------
  function renderMapThumbnail(map, type) {
    if (!map) {
      return <div className={styles.defaultThumbnail}>No Map</div>;
    }

    const sharedProps = {
      groups: map.groups || [],
      mapTitleValue: map.title || 'Untitled',
      ocean_color: map.ocean_color,
      unassigned_color: map.unassigned_color,
      data: map.data,
      font_color: map.font_color,
      is_title_hidden: map.is_title_hidden,
      isThumbnail: true,
      showNoDataLegend: map.show_no_data_legend,
    };

    let MapComponent = <div className={styles.defaultThumbnail}>No Map</div>;
    if (map.selected_map === 'world')   MapComponent = <WorldMapSVG {...sharedProps} />;
    if (map.selected_map === 'usa')     MapComponent = <UsSVG {...sharedProps} />;
    if (map.selected_map === 'europe')  MapComponent = <EuropeSVG {...sharedProps} />;

    return (
      <div className={styles.thumbContainer}>
        {MapComponent}
        <div className={styles.activityOverlay}>
          <img
            className={styles.activityAvatar}
            src={profile_pictureUrl || '/default-profile-picture.png'}
            alt="User"
          />
          <div className={styles.activityIcon}>
            {getActivityIcon(type)}
          </div>
        </div>
      </div>
    );
  }

  function renderMapTitle(map) {
    if (!map) return 'Untitled';
    return (
      <strong
        className={styles.mapTitleLink}
        onClick={(e) => {
          e.stopPropagation();
          if (map?.id) {
            navigate(`/map/${map.id}`);
          }
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
        <div className={styles.commentBody}>
          {act.commentContent}
        </div>
      </div>
    );
  }

  function renderActivityItem(act, idx) {
    const { type, map, commentContent, created_at } = act;
    const mapThumb = renderMapThumbnail(map, type);

    let mainText;
    if (type === 'createdMap') {
      mainText = <>{username} created map {renderMapTitle(map)}</>;
    } else if (type === 'starredMap') {
      mainText = <>{username} starred map {renderMapTitle(map)}</>;
    } else if (type === 'commented') {
      mainText = <>{username} commented on {renderMapTitle(map)}</>;
    } else {
      // fallback
      mainText = <>Activity: {type}</>;
    }

    return (
      <div
        key={idx}
        className={styles.activityItem}
        onClick={() => {
          if (map?.id) {
            navigate(`/map/${map.id}`);
          }
        }}
      >
        {mapThumb}
        <div className={styles.activityDetails}>
          <p className={styles.mainText}>{mainText}</p>
          {commentContent && renderCommentBox(act)}
          <div className={styles.timestampBox}>
            {timeAgo(created_at)}
          </div>
        </div>
      </div>
    );
  }

  // --------------------------
  // Actual return
  // --------------------------
  if (isInitialLoading && activities.length === 0) {
    // Show skeletons only for the initial load
    return (
      <div className={styles.dashActivityFeed}>
        <SkeletonActivityRow />
        <SkeletonActivityRow />
        <SkeletonActivityRow />
      </div>
    );
  }

  if (!isInitialLoading && activities.length === 0) {
    // No activity found
    return <p>No recent activity.</p>;
  }

  // Otherwise, show the activity feed
  return (
    <div className={styles.dashActivityFeed}>
      {activities.map((act, i) => renderActivityItem(act, i))}

      {/* If fetching more, show skeleton placeholders */}
      {isFetchingMore && (
        <>
          <SkeletonActivityRow />
          <SkeletonActivityRow />
        </>
      )}

      {/* Sentinel at bottom for infinite scroll */}
      {hasMore && <div ref={sentinelRef} style={{ height: '1px' }} />}
    </div>
  );
}
