import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './LiveDemoSection.module.css';
import { fetchMapById, fetchComments } from '../api';
import { FaStar, FaDownload, FaComment } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

// Featured map shown in the live demo
const FEATURED_MAP_ID = 89;
// Embed token for unbranded embed (set REACT_APP_FEATURED_MAP_EMBED_TOKEN to override)
const FEATURED_MAP_EMBED_TOKEN =
  process.env.REACT_APP_FEATURED_MAP_EMBED_TOKEN ||
  'c8f7b552ffd2b53c7366fcaf8e0e6deb8afb15081675f0c18d98a5843de427aa';

function buildEmbedUrl(mapId, token) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    theme: 'light',
    branding: '0',
    legend: '1',
    interactive: '1',
  });
  if (token) params.set('token', token);
  return `${origin}/embed/${mapId}?${params.toString()}`;
}

function LiveDemoSection() {
  const [mapData, setMapData] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [loadState, setLoadState] = useState('loading'); // 'loading' | 'ready' | 'error'

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState('loading');
      try {
        const res = await fetchMapById(FEATURED_MAP_ID, {
          embedToken: FEATURED_MAP_EMBED_TOKEN || undefined,
        });
        if (cancelled) return;
        if (!res?.data) {
          setLoadState('error');
          return;
        }
        setMapData(res.data);

        const commentsRes = await fetchComments(FEATURED_MAP_ID);
        if (!cancelled && commentsRes?.data) {
          const flatCount = (arr) =>
            arr.reduce((n, c) => n + 1 + flatCount(c.Replies || []), 0);
          setCommentCount(flatCount(commentsRes.data));
        }
        setLoadState('ready');
      } catch (err) {
        if (!cancelled) {
          console.error('LiveDemoSection: failed to load featured map', err);
          setLoadState('error');
        }
      }
    }

    load();
    return () => { cancelled = true; };
  }, []);

  const embedUrl = buildEmbedUrl(FEATURED_MAP_ID, FEATURED_MAP_EMBED_TOKEN);
  const stars = mapData?.save_count ?? 0;
  const downloads = mapData?.download_count ?? 0;
  const user = mapData?.user;

  if (loadState === 'loading') {
    return (
      <section className={styles.demoSection}>
        <div className={styles.contentRow}>
          <div className={styles.mapContainer}>
            <div className={styles.loadingPlaceholder}>
              <LoadingSpinner />
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.loadingPlaceholder} />
          </div>
        </div>
      </section>
    );
  }

  if (loadState === 'error' || !mapData) {
    return (
      <section className={styles.demoSection}>
        <div className={styles.contentRow}>
          <p className={styles.errorMessage}>Featured map is temporarily unavailable.</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.demoSection}>
      <div className={styles.contentRow}>
        {/* Left: map preview (embed iframe) */}
        <div className={styles.mapContainer}>
          <div className={styles.embedWrap}>
            <iframe
              src={embedUrl}
              title={mapData.title || 'Featured map'}
              className={styles.embedIframe}
            />
          </div>
        </div>

        {/* Right: clean info card */}
        <div className={styles.infoCard}>
          <p className={styles.cardEyebrow}>Featured map</p>
          <h2 className={styles.cardTitle}>{mapData.title || 'Untitled Map'}</h2>
          <p className={styles.cardDescription}>
            {mapData.description?.trim() ||
              'Only eight countries have won the FIFA World Cup since 1930. This map highlights the nations that have reached the pinnacle of international football.'}
          </p>

          {/* Stats: stars, downloads, comments */}
          <div className={styles.statsRow}>
            <span className={styles.statItem} title="Stars">
              <FaStar className={styles.statIcon} aria-hidden />
              {stars}
            </span>
            <span className={styles.statItem} title="Downloads">
              <FaDownload className={styles.statIcon} aria-hidden />
              {downloads}
            </span>
            <span className={styles.statItem} title="Comments">
              <FaComment className={styles.statIcon} aria-hidden />
              {commentCount}
            </span>
          </div>

          {/* Tags → /explore?tags=... */}
          {mapData.tags?.length > 0 && (
            <div className={styles.tagsBlock}>
              <span className={styles.tagsLabel}>Tags</span>
              <div className={styles.tagsWrap}>
                {mapData.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/explore?tags=${encodeURIComponent(String(tag).toLowerCase())}`}
                    className={styles.tagChip}
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Creator (same pattern as MapDetailContent) */}
          {user && (
            <div className={styles.creatorBlock}>
              <span className={styles.creatorLabel}>Creator</span>
              <Link
                to={`/profile/${user.username || 'unknown'}`}
                className={styles.creatorChip}
              >
                <img
                  src={user.profile_picture || '/default-profile-pic.jpg'}
                  alt=""
                  className={styles.creatorAvatar}
                />
                <div className={styles.creatorText}>
                  <span className={styles.creatorName}>
                    {[user.first_name, user.last_name].filter(Boolean).join(' ') || user.username}
                  </span>
                  <span className={styles.creatorUsername}>@{user.username || 'unknown'}</span>
                </div>
              </Link>
            </div>
          )}

          {/* CTA: Explore this map → /map/78 */}
          <Link
            to={`/map/${FEATURED_MAP_ID}`}
            className={styles.ctaButton}
          >
            Explore this map
          </Link>
        </div>
      </div>
    </section>
  );
}

export default LiveDemoSection;
