import React, { useState, useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import styles from './Explore.module.css';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaStar, FaSearch, FaComment } from 'react-icons/fa';

import StaticMapThumbnail from './StaticMapThumbnail';

import { SidebarContext } from '../context/SidebarContext';
import useWindowSize from '../hooks/useWindowSize';

function Explore() {
  // Maps & tags
  const [maps, setMaps] = useState([]);
  const [allMapsForTags, setAllMapsForTags] = useState([]);

  // Tracking if we've fully loaded once
  const [initialLoad, setInitialLoad] = useState(true);

  // Search (uncontrolled)
  const [searchApplied, setSearchApplied] = useState('');
  const searchRef = useRef(null);

  // Sorting & filtering
  const [sort, setSort] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalMaps, setTotalMaps] = useState(0);
  const mapsPerPage = 40;

  // Loading
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();
const isMobile = width < 1000;
const showOverlay = isMobile && !isCollapsed;

const closeSidebarIfMobile = () => {
  if (isMobile) setIsCollapsed(true);
};

useEffect(() => {
  if (!isMobile) return;
  setIsCollapsed(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [location.search]);

  //-------------------------------------------
  // 1) Fetch top tags (on mount)
  //-------------------------------------------
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(
          'https://map-in-color.onrender.com/api/explore/tags'
        );
        setAllMapsForTags(res.data);
      } catch (error) {
        console.error('Error fetching distinct tags:', error);
      }
    };
    fetchTags();
  }, []);

  //-------------------------------------------
  // 2) Parse ?tags & ?page from URL
  //-------------------------------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlTags = params.get('tags');
    if (urlTags) {
      const splitTags = urlTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      setSelectedTags(splitTags);
    } else {
      setSelectedTags([]);
    }

    const urlPage = parseInt(params.get('page'), 10);
    setPage(urlPage && urlPage > 0 ? urlPage : 1);
  }, [location.search]);

  //-------------------------------------------
  // 3) Fetch maps for current page
  //-------------------------------------------
  const fetchMaps = async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: mapsPerPage };
      if (searchApplied.trim()) {
        params.search = searchApplied.trim();
      }
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }

      const res = await axios.get('https://map-in-color.onrender.com/api/explore', {
        params,
      });

      setMaps(res.data.maps);
      setTotalMaps(res.data.total);

      if (initialLoad) setInitialLoad(false);
    } catch (err) {
      console.error('Error fetching maps:', err);
    } finally {
      setLoading(false);
    }
  };

  //-------------------------------------------
  // 4) Trigger fetch on changes
  //-------------------------------------------
  useEffect(() => {
    fetchMaps();
    // eslint-disable-next-line
  }, [selectedTags, sort, searchApplied, page]);

  //-------------------------------------------
  // 5) Handlers
  //-------------------------------------------

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const typedValue = searchRef.current.value;
    setSearchApplied(typedValue);

    const params = new URLSearchParams(location.search);
    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleClearSearch = () => {
    if (searchRef.current) searchRef.current.value = '';
    setSearchApplied('');
    setPage(1);

    const params = new URLSearchParams(location.search);
    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleTagChange = (tag) => {
    let newSelected;
    if (selectedTags.includes(tag)) newSelected = selectedTags.filter((t) => t !== tag);
    else newSelected = [...selectedTags, tag];

    const params = new URLSearchParams(location.search);
    if (newSelected.length) params.set('tags', newSelected.join(','));
    else params.delete('tags');

    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    const params = new URLSearchParams(location.search);
    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleRemoveSelectedTag = (tagToRemove) => {
    const newSelected = selectedTags.filter((t) => t !== tagToRemove);
    const params = new URLSearchParams(location.search);

    if (newSelected.length) params.set('tags', newSelected.join(','));
    else params.delete('tags');

    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const totalPages = Math.ceil(totalMaps / mapsPerPage);
  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    setLoading(true);

    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`?${params.toString()}`, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getDisplayName = (user) => {
    if (!user) return 'Unknown';
    const { first_name, last_name, username } = user;
    return first_name || last_name
      ? `${first_name || ''} ${last_name || ''}`.trim()
      : username;
  };

  // FULL skeleton on first load
  if (initialLoad && loading) {
    return (
      <div className={styles.explorePageContainer}>
        <Sidebar  />

        {showOverlay && (
          <div
            className={styles.sidebarOverlay}
            onClick={() => setIsCollapsed(true)}
          />
        )}

        <div
          className={`${styles.mainContentWrapper} ${
            isCollapsed ? styles.collapsed : ''
          }`}
        >
          <Header  title="Explore" />

          <div className={styles.exploreContent}>
            <div className={styles.skeletonTopBar}>
              <div className={styles.skeletonSortTabs}>
                <div className={styles.skeletonSortTab} />
                <div className={styles.skeletonSortTab} />
                <div className={styles.skeletonSortTab} />
              </div>

              <div className={styles.skeletonSearchForm}>
                <div className={styles.skeletonSearchInput} />
                <div className={styles.skeletonSearchButton} />
              </div>
            </div>

            <div className={styles.skeletonResultsRow}>
              <div className={styles.skeletonResultsText} />
            </div>

            <div className={styles.skeletonMainContent}>
              <div className={styles.skeletonMapsGrid}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div className={styles.skeletonMapCard} key={i}>
                    <div className={styles.skeletonThumb} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                    <div className={styles.skeletonLine} />
                  </div>
                ))}
              </div>

              <div className={styles.skeletonTagsSidebar}>
                <div className={styles.skeletonTagTitle} />
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className={styles.skeletonTagLine} />
                ))}
              </div>
            </div>

            <div className={styles.skeletonPagination}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.skeletonPageBtn} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const showMapsSkeleton = !initialLoad && loading;

  return (
    <div className={styles.explorePageContainer}>
      <Sidebar  />

      {showOverlay && (
        <div className={styles.sidebarOverlay} onClick={() => setIsCollapsed(true)} />
      )}

      <div className={`${styles.mainContentWrapper} ${isCollapsed ? styles.collapsed : ''}`}>
        <Header  title="Explore" />

        <div className={styles.exploreContent}>
          <div className={styles.topBar}>
            <div className={styles.sortTabs}>
              <span className={styles.sortByLabel}>Sort by:</span>
              <button
                className={`${styles.tabButton} ${sort === 'newest' ? styles.activeTab : ''}`}
                onClick={() => handleSortChange('newest')}
              >
                Newest
              </button>
              <button
                className={`${styles.tabButton} ${sort === 'starred' ? styles.activeTab : ''}`}
                onClick={() => handleSortChange('starred')}
              >
                Most Starred
              </button>
              <button
                className={`${styles.tabButton} ${sort === 'trending' ? styles.activeTab : ''}`}
                onClick={() => handleSortChange('trending')}
              >
                Trending
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchInputContainer}>
                {searchApplied.trim() !== '' && (
                  <button
                    type="button"
                    className={styles.clearSearchButton}
                    onClick={handleClearSearch}
                  >
                    Clear search
                  </button>
                )}

                <input type="text" placeholder="Search by map title..." ref={searchRef} />
                <button type="submit" className={styles.searchButton} title="Search">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          <div className={styles.resultsRow}>
            <span className={styles.totalResults}>
              {totalMaps} results
              {totalPages > 1 && (
                <>
                  {' '}| Page {page} of {totalPages}
                </>
              )}
            </span>

            {selectedTags.length > 0 && (
              <div className={styles.selectedTagsRow}>
                <div className={styles.selectedTagsList}>
                  {selectedTags.map((t) => (
                    <div key={t} className={styles.selectedTagBox}>
                      <span className={styles.selectedTagText}>{t}</span>
                      <button
                        className={styles.removeTagButton}
                        onClick={() => handleRemoveSelectedTag(t)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.mainContent}>
            <div className={styles.mapsSection}>
              {showMapsSkeleton ? (
                <div className={styles.skeletonMapsGrid}>
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div className={styles.skeletonMapCard} key={i}>
                      <div className={styles.skeletonThumb} />
                      <div className={styles.skeletonLine} />
                      <div className={styles.skeletonLine} />
                      <div className={styles.skeletonLine} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.mapsGrid}>
                  {maps.length === 0 ? (
                    <p>No maps found.</p>
                  ) : (
                    maps.map((map) => {
                      const mapTitle = map.title || 'Untitled Map';
                      const displayName = getDisplayName(map.user);

                      return (
                        <div
                          key={map.id}
                          className={styles.mapCard}
                          onClick={() => {
                            closeSidebarIfMobile();
                            navigate(`/map/${map.id}`);
                          }}
                                                  >
                          <div className={styles.thumbnail}>
                            {/* ✅ STATIC preview (no hover/zoom/pan/tooltips) */}
                            <StaticMapThumbnail map={map} background="#dddddd" />
                          </div>

                          <h3 className={styles.mapTitle}>{mapTitle}</h3>

                          <div className={styles.mapInfoRow}>
                            <span>{displayName}</span>
                            <div className={styles.mapStats}>
                              <span className={styles.starCountContainer}>
                                <FaStar /> {map.save_count || 0}
                              </span>
                              <span className={styles.starCountContainer}>
                                <FaComment /> {map.comments_count ?? map.comment_count ?? 0}
                              </span>
                            </div>
                          </div>

                          {map.tags && map.tags.length > 0 && (
                            <div className={styles.tags}>
                              {map.tags.slice(0, 5).map((tg, idx) => (
                                <span key={idx} className={styles.tag}>
                                  {tg}
                                </span>
                              ))}
                              {map.tags.length > 5 && (
                                <span className={styles.tag}>+{map.tags.length - 5}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {!showMapsSkeleton && totalPages > 1 && (
                <div className={styles.pagination}>
                  <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                    ‹
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      className={p === page ? styles.activePage : ''}
                    >
                      {p}
                    </button>
                  ))}

                  <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                    ›
                  </button>
                </div>
              )}
            </div>

            <div className={styles.tagsSidebar}>
              <h2>Filter by Tags</h2>
              <div className={styles.tagsList}>
                {allMapsForTags.map((item) => (
                  <label key={item.tag} className={styles.tagCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(item.tag)}
                      onChange={() => handleTagChange(item.tag)}
                    />
                    <span className={styles.checkboxTag}>
                      {item.tag}{' '}
                      <span style={{ color: '#999', fontSize: '0.9em' }}>
                        ({item.count})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;
