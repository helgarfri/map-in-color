import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import styles from './Explore.module.css';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaStar, FaSearch } from 'react-icons/fa';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import LoadingSpinner from './LoadingSpinner';

function Explore({ isCollapsed, setIsCollapsed }) {
  // The slice of data for the current page
  const [maps, setMaps] = useState([]);
  // For the tag cloud in the sidebar
  const [allMapsForTags, setAllMapsForTags] = useState([]);
  // Search (uncontrolled input)
  const [searchApplied, setSearchApplied] = useState('');
  const searchRef = useRef(null);
  // Sorting & filtering
  const [sort, setSort] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);
  // Pagination
  const [page, setPage] = useState(1);
  const [totalMaps, setTotalMaps] = useState(0);
  const mapsPerPage = 24;
  // Loading spinner
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Refs for measuring heights
  const mapsSectionRef = useRef(null);
  const tagsSidebarRef = useRef(null);

  // Update sidebar max-height based on maps section height
  const updateSidebarHeight = () => {
    if (mapsSectionRef.current && tagsSidebarRef.current) {
      const mapsHeight = mapsSectionRef.current.clientHeight;
      tagsSidebarRef.current.style.maxHeight = `${mapsHeight}px`;
    }
  };

  // Fetch tags for the sidebar
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get('https://map-in-color.onrender.com/api/explore/tags');
        setAllMapsForTags(res.data);
      } catch (error) {
        console.error('Error fetching distinct tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Parse URL parameters for tags and page
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
    if (urlPage && urlPage > 0) {
      setPage(urlPage);
    } else {
      setPage(1);
    }
  }, [location.search]);

  // Fetch maps for the current page
  const fetchMaps = async () => {
    setLoading(true);
    try {
      const params = { sort, page, limit: mapsPerPage };
      if (searchApplied.trim()) {
        params.search = searchApplied.trim();
      }
      if (selectedTags.length > 0) {
        // We'll pass these tags to the server, which will use .contains(...) for AND logic
        params.tags = selectedTags.join(',');
      }
      const res = await axios.get('https://map-in-color.onrender.com/api/explore', { params });
      setMaps(res.data.maps);
      setTotalMaps(res.data.total);
    } catch (err) {
      console.error('Error fetching maps:', err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch when filters change
  useEffect(() => {
    fetchMaps();
    // eslint-disable-next-line
  }, [selectedTags, sort, searchApplied, page]);

  // Update sidebar height whenever maps or loading changes
  useEffect(() => {
    updateSidebarHeight();
  }, [maps, loading]);

  // Update sidebar height on window resize
  useEffect(() => {
    window.addEventListener('resize', updateSidebarHeight);
    return () => window.removeEventListener('resize', updateSidebarHeight);
  }, []);

  // Handlers for search, tag changes, sort changes, and pagination...
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const typedValue = searchRef.current.value;
    setSearchApplied(typedValue);
    const params = new URLSearchParams(location.search);
    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleTagChange = (tag) => {
    setLoading(true);
    let newSelected = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    const params = new URLSearchParams(location.search);
    newSelected.length ? params.set('tags', newSelected.join(',')) : params.delete('tags');
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

  const handleResetTags = () => {
    const params = new URLSearchParams(location.search);
    params.delete('tags');
    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleRemoveSelectedTag = (tagToRemove) => {
    const newSelected = selectedTags.filter((t) => t !== tagToRemove);
    const params = new URLSearchParams(location.search);
    newSelected.length ? params.set('tags', newSelected.join(',')) : params.delete('tags');
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

  return (
    <div className={styles.explorePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${styles.mainContentWrapper} ${isCollapsed ? styles.collapsed : ''}`}>
        <Header title="Explore" />
        <div className={styles.exploreContent}>
          {/* Top Bar: Sort & Search */}
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
                <input type="text" placeholder="Search by map title..." ref={searchRef} />
                <button type="submit" className={styles.searchButton} title="Search">
                  <FaSearch />
                </button>
              </div>
            </form>
          </div>

          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className={styles.selectedTagsContainer}>
              <span className={styles.selectedTagsLabel}>Selected Tags:</span>
              <div className={styles.selectedTagsList}>
                {selectedTags.map((t) => (
                  <div key={t} className={styles.selectedTagBox}>
                    <span className={styles.selectedTagText}>{t}</span>
                    <button className={styles.removeTagButton} onClick={() => handleRemoveSelectedTag(t)}>
                      x
                    </button>
                  </div>
                ))}
              </div>
              <button className={styles.resetAllTagsButton} onClick={handleResetTags}>
                Reset All Tags
              </button>
            </div>
          )}

          {/* Main Content */}
          <div className={styles.mainContent}>
            {/* Maps Section */}
            <div className={styles.mapsSection} ref={mapsSectionRef}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className={styles.mapsGrid}>
                    {maps.length === 0 ? (
                      <p>No maps found.</p>
                    ) : (
                      maps.map((map) => {
                        const mapTitle = map.title || 'Untitled Map';
                        const firstName = map.user?.first_name || '';
                        const lastName = map.user?.last_name || '';
                        const usernameFallback = map.user?.username || 'Unknown';
                        const displayName =
                          firstName || lastName ? `${firstName} ${lastName}`.trim() : usernameFallback;
                        return (
                          <div
                            key={map.id}
                            className={styles.mapCard}
                            onClick={() => navigate(`/map/${map.id}`)}
                          >
                            <div className={styles.thumbnail}>
                              {map.selected_map === 'world' && (
                                <WorldMapSVG
                                  groups={map.groups}
                                  mapTitleValue={mapTitle}
                                  ocean_color={map.ocean_color}
                                  unassigned_color={map.unassigned_color}
                                  show_top_high_values={false}
                                  show_top_low_values={false}
                                  data={map.data}
                                  selected_map={map.selected_map}
                                  font_color={map.font_color}
                                  top_low_values={[]}
                                  isThumbnail
                                  is_title_hidden={map.is_title_hidden}
                                />
                              )}
                              {map.selected_map === 'usa' && (
                                <UsSVG
                                  groups={map.groups}
                                  mapTitleValue={mapTitle}
                                  ocean_color={map.ocean_color}
                                  unassigned_color={map.unassigned_color}
                                  show_top_high_values={false}
                                  show_top_low_values={false}
                                  data={map.data}
                                  selected_map={map.selected_map}
                                  font_color={map.font_color}
                                  top_low_values={[]}
                                  isThumbnail
                                  is_title_hidden={map.is_title_hidden}
                                />
                              )}
                              {map.selected_map === 'europe' && (
                                <EuropeSVG
                                  groups={map.groups}
                                  mapTitleValue={mapTitle}
                                  ocean_color={map.ocean_color}
                                  unassigned_color={map.unassigned_color}
                                  show_top_high_values={false}
                                  show_top_low_values={false}
                                  data={map.data}
                                  selected_map={map.selected_map}
                                  font_color={map.font_color}
                                  top_low_values={[]}
                                  isThumbnail
                                  is_title_hidden={map.is_title_hidden}
                                />
                              )}
                            </div>
                            <h3 className={styles.mapTitle}>{mapTitle}</h3>
                            <div className={styles.mapInfoRow}>
                              <span>{displayName}</span>
                              <span>
                                <FaStar /> {map.save_count || 0}
                              </span>
                            </div>
                            {map.tags && map.tags.length > 0 && (
                              <div className={styles.tags}>
                                {map.tags.map((tg, idx) => (
                                  <span key={idx} className={styles.tag}>
                                    {tg}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                  {totalPages > 1 && (
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
                </>
              )}
            </div>

            {/* Tag Sidebar */}
            <div className={styles.tagsSidebar} ref={tagsSidebarRef}>
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
                      <span style={{ color: '#999', fontSize: '0.9em' }}>({item.count})</span>
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
