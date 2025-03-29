import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

import {
  FaStar,
  FaPlus,
  FaComment,
  FaReply,
  FaThumbsUp,
  FaInfoCircle,
} from 'react-icons/fa';

import {
  fetchDashboardActivity,
  markNotificationAsRead
} from '../api';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import SkeletonActivityRow from './SkeletonActivityRow';

import dashFeedStyles from './DashboardActivityFeed.module.css';

export default function DashboardActivityFeed({ userProfile }) {
  const navigate = useNavigate();

  // feed data + pagination
  const [activities, setActivities] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 15;
  const [hasMore, setHasMore] = useState(true);

  // loading states
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  // We'll place a "sentinel" div at the bottom of the feed
  const sentinelRef = useRef(null);

  // On mount/userProfile change => reset + load first page
  useEffect(() => {
    if (!userProfile) return;
    setOffset(0);
    setActivities([]);
    setHasMore(true);
    loadFirstPage();
  }, [userProfile]);

  async function loadFirstPage() {
    try {
      setIsInitialLoading(true);
      const res = await fetchDashboardActivity(0, limit);
      const newBatch = res.data;
      setActivities(newBatch);
      setHasMore(newBatch.length === limit);
    } catch (err) {
      console.error('Error loading feed:', err);
    } finally {
      setIsInitialLoading(false);
    }
  }

  async function loadMore() {
    try {
      setIsFetchingMore(true);
      const newOffset = offset + limit;
      const res = await fetchDashboardActivity(newOffset, limit);
      const newBatch = res.data;

      setActivities((prev) => [...prev, ...newBatch]);
      setOffset(newOffset);

      if (newBatch.length < limit) {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error loading more feed:', err);
    } finally {
      setIsFetchingMore(false);
    }
  }

  /**
   * IntersectionObserver to watch when the sentinel appears in viewport.
   */
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore) return; // no need to observe if there's nothing more to fetch

    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
          // the sentinel is visible => load next page
          if (!isFetchingMore && !isInitialLoading && hasMore) {
            loadMore();
          }
        }
      },
      {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1, // when 10% of sentinel is visible
      }
    );

    observer.observe(sentinelRef.current);

    // cleanup
    return () => {
      // Only unobserve if the current ref is still there
      if (observer && sentinelRef.current) {
        observer.unobserve(sentinelRef.current);
      }
    };
  }, [sentinelRef, hasMore, isFetchingMore, isInitialLoading, offset]);

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
    if (act.type.startsWith('notification_') && act.notificationData?.sender) {
      return act.notificationData.sender.profile_picture || '/default-profile-picture.png';
    }
    return userProfile?.profile_picture || '/default-profile-picture.png';
  }

  function getOverlayAvatarUsername(act) {
    if (act.type.startsWith('notification_') && act.notificationData?.sender) {
      return act.notificationData.sender.username || 'unknown';
    }
    return userProfile?.username || 'unknown';
  }

  function getActivityIcon(type) {
    switch (type) {
      case 'createdMap': return <FaPlus />;
      case 'starredMap':
      case 'notification_star': return <FaStar />;
      case 'commented':
      case 'notification_comment': return <FaComment />;
      case 'notification_reply': return <FaReply />;
      case 'notification_like': return <FaThumbsUp />;
      default: return <FaInfoCircle />;
    }
  }

  function renderMapThumbnail(mapObj, act) {
    if (!mapObj) {
      return <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
    }

    const {
      selected_map,
      title,
      groups,
      ocean_color,
      unassigned_color,
      data,
      font_color,
      is_title_hidden,
      show_no_data_legend,
      title_font_size,
      legend_font_size,
    } = mapObj;

    const sharedProps = {
      groups,
      mapTitleValue: title || 'Untitled',
      ocean_color,
      unassigned_color,
      data,
      font_color,
      is_title_hidden,
      isThumbnail: true,
      showNoDataLegend: show_no_data_legend,
      titleFontSize: title_font_size,
      legendFontSize: legend_font_size

    };

    let MapComponent = <div className={dashFeedStyles.defaultThumbnail}>No Map</div>;
    if (selected_map === 'world')   MapComponent = <WorldMapSVG {...sharedProps} />;
    if (selected_map === 'usa')     MapComponent = <UsSVG {...sharedProps} />;
    if (selected_map === 'europe')  MapComponent = <EuropeSVG {...sharedProps} />;

    const overlayUrl = getOverlayAvatarUrl(act);
    const overlayUsername = getOverlayAvatarUsername(act);
    const overlayIcon = getActivityIcon(act.type);

    return (
      <div className={dashFeedStyles.thumbContainer}>
        {MapComponent}
        <div
          className={dashFeedStyles.activityOverlay}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${overlayUsername}`);
          }}
        >
          <img
            className={dashFeedStyles.activityAvatar}
            src={overlayUrl}
            alt="User"
          />
          <div className={dashFeedStyles.activityIcon}>
            {overlayIcon}
          </div>
        </div>
      </div>
    );
  }

  function renderSenderName(act) {
    if (!act.type.startsWith('notification_')) {
      return <strong>You</strong>;
    }
    const sender = act.notificationData?.sender;
    if (!sender) return <strong>Someone</strong>;

    let displayName = '';
    if (sender.first_name || sender.last_name) {
      displayName = `${sender.first_name || ''} ${sender.last_name || ''}`.trim();
    } else if (sender.username) {
      displayName = sender.username;
    } else {
      displayName = 'Someone';
    }
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

  function getCommentAuthorAvatar(act) {
    if (act.commentAuthor?.profile_picture) {
      return act.commentAuthor.profile_picture;
    }
    if (act.type === 'commented' && userProfile?.profile_picture) {
      return userProfile.profile_picture;
    }
    return '/default-profile-picture.png';
  }

  function getCommentAuthorUsername(act) {
    if (act.commentAuthor?.username) return act.commentAuthor.username;
    if (act.type === 'commented') {
      return userProfile?.username || 'unknown';
    }
    return 'unknown';
  }

  function renderCommentBox(act) {
    const commentAvatarUrl = getCommentAuthorAvatar(act);
    const commentAuthor = getCommentAuthorUsername(act);
    return (
      <div className={dashFeedStyles.commentBox}>
        <img
          className={dashFeedStyles.commentAuthorAvatar}
          src={commentAvatarUrl}
          alt="Comment Author"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/profile/${commentAuthor}`);
          }}
        />
        <div className={dashFeedStyles.commentBody}>
          {act.commentContent}
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
      mainText = <>{renderSenderName(act)} liked your comment on {renderMapTitle(map)} </>;
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
          <p className={dashFeedStyles.mainText}>{mainText}</p>
          {shouldShowCommentBox && renderCommentBox(act)}
          <div className={dashFeedStyles.timestampBox}>
            {timeAgo(created_at)}
          </div>
        </div>
      </div>
    );
  }

  // If first load => skeleton placeholders
  if (isInitialLoading && activities.length === 0) {
    return (
      <div className={dashFeedStyles.dashActivityFeed}>
        {/* Show however many skeleton placeholders you want */}
        <SkeletonActivityRow />
        <SkeletonActivityRow />
        <SkeletonActivityRow />
        
      </div>
    );
  }

  // If done + no data
  if (!isInitialLoading && activities.length === 0) {
    return <p>No recent activity.</p>;
  }

  return (
    <div className={dashFeedStyles.dashActivityFeed}>
      {activities.map((act, i) => renderActivityItem(act, i))}

      {/* If fetching more => show skeleton placeholders */}
      {isFetchingMore && (
        <>
          <SkeletonActivityRow />
          <SkeletonActivityRow />
        </>
      )}

      {/* The "sentinel" div at the very bottom */}
      {hasMore && (
        <div ref={sentinelRef} style={{ height: '1px' }} />
      )}
    </div>
  );
}
