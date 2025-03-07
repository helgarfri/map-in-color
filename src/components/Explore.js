import React, { useState, useEffect } from 'react';
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
  const [maps, setMaps] = useState([]);
  const [allMapsForTags, setAllMapsForTags] = useState([]);

  // --- Search states ---
  const [searchInput, setSearchInput] = useState('');
  const [searchApplied, setSearchApplied] = useState('');

  // Sort & Tag
  const [sort, setSort] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);

  // Loading spinner
  const [loading, setLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const mapsPerPage = 24;

  const navigate = useNavigate();
  const location = useLocation();

  // ----------------------------------------------------------------------
  // 1) FETCH ALL MAPS ONCE (OPTIONAL) FOR TAG COUNTS
  useEffect(() => {
    console.log('[useEffect] fetchAllMaps (for sidebar tags) - on mount');
    const fetchAllMaps = async () => {
      try {
        console.log('  -> [fetchAllMaps] Starting axios request');
        const res = await axios.get('https://map-in-color.onrender.com/api/explore');
        console.log(`  -> [fetchAllMaps] Got response. allMapsForTags length: ${res.data.length}`);
        setAllMapsForTags(res.data);
      } catch (error) {
        console.error('Error fetching all maps for tags:', error);
      }
    };
    fetchAllMaps();
  }, []);

  // ----------------------------------------------------------------------
  // 2) PARSE ?tags=... FROM THE URL INTO selectedTags
  useEffect(() => {
    console.log('[useEffect] parsing URL for ?tags', 'location.search=', location.search);
    const params = new URLSearchParams(location.search);
    const urlTags = params.get('tags');

    if (urlTags) {
      const splitTags = urlTags
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);
      console.log('  -> Setting selectedTags from URL:', splitTags);
      setSelectedTags(splitTags);
    } else {
      console.log('  -> No ?tags in URL. Setting selectedTags = []');
      setSelectedTags([]);
    }
  }, [location.search]);

  // ----------------------------------------------------------------------
  // 3) FETCH MAPS FUNCTION
  const fetchMaps = async (currentSearchTerm) => {
    console.log('[fetchMaps] called with:', {
      sort,
      selectedTags,
      searchTerm: currentSearchTerm,
    });
    setLoading(true);

    try {
      const params = { sort };
      const trimmed = currentSearchTerm.trim();
      if (trimmed) {
        params.search = trimmed;
      }
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }

      console.log('  -> [fetchMaps] axios.get params=', params);
      const res = await axios.get('https://map-in-color.onrender.com/api/explore', { params });
      console.log(`  -> [fetchMaps] response length: ${res.data.length}`);

      setMaps(res.data);
      setPage(1); // reset to first page
    } catch (err) {
      console.error('Error fetching maps:', err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------------------
  // 4) UNIFIED EFFECT: whenever selectedTags, sort, or searchApplied changes
  useEffect(() => {
    console.log(
      '[useEffect] selectedTags/sort/searchApplied changed -> calling fetchMaps',
      {
        selectedTags,
        sort,
        searchApplied,
      }
    );
    fetchMaps(searchApplied);
    // eslint-disable-next-line
  }, [selectedTags, sort, searchApplied]);

  // ----------------------------------------------------------------------
  // 5) HANDLERS

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('[handleSearchSubmit] user pressed Search. searchInput=', searchInput);
    setSearchApplied(searchInput);
  };

  const handleTagChange = (tag) => {
    console.log('[handleTagChange]', { tag, selectedTagsBefore: selectedTags });
    const newSelected = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    const params = new URLSearchParams(location.search);
    if (newSelected.length > 0) {
      params.set('tags', newSelected.join(','));
    } else {
      params.delete('tags');
    }
    console.log('[handleTagChange] Navigate to', `?${params.toString()}`);
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSortChange = (newSort) => {
    console.log('[handleSortChange]', { newSort });
    setSort(newSort);
  };

  const handleResetTags = () => {
    console.log('[handleResetTags] removing all ?tags');
    const params = new URLSearchParams(location.search);
    params.delete('tags');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleRemoveSelectedTag = (tagToRemove) => {
    console.log('[handleRemoveSelectedTag]', { tagToRemove });
    const newSelected = selectedTags.filter((t) => t !== tagToRemove);
    const params = new URLSearchParams(location.search);
    if (newSelected.length > 0) {
      params.set('tags', newSelected.join(','));
    } else {
      params.delete('tags');
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  // Pagination
  const totalPages = Math.ceil(maps.length / mapsPerPage);
  const startIndex = (page - 1) * mapsPerPage;
  const endIndex = page * mapsPerPage;
  const mapsToShow = maps.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    console.log('[handlePageChange]', { newPage });
    setPage(newPage);
  };

  // ----------------------------------------------------------------------
  // BUILD A TAG CLOUD (IF DESIRED)
  const tagCounts = {};
  allMapsForTags.forEach((m) => {
    if (Array.isArray(m.tags)) {
      m.tags.forEach((tg) => {
        if (!tagCounts[tg]) tagCounts[tg] = 0;
        tagCounts[tg]++;
      });
    }
  });
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  // ----------------------------------------------------------------------
  // RENDER
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

            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <div className={styles.searchInputContainer}>
                <input
                  type="text"
                  placeholder="Search by map title..."
                  value={searchInput}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className={styles.searchButton}
                  title="Search"
                >
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
                    <button
                      className={styles.removeTagButton}
                      onClick={() => handleRemoveSelectedTag(t)}
                    >
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
            <div className={styles.mapsSection}>
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className={styles.mapsGrid}>
                    {mapsToShow.length === 0 ? (
                      <p>No maps found.</p>
                    ) : (
                      mapsToShow.map((map) => {
                        const mapTitle = map.title || 'Untitled Map';
                        const firstName = map.user?.first_name || '';
                        const lastName = map.user?.last_name || '';
                        const usernameFallback = map.user?.username || 'Unknown';
                        const displayName =
                          firstName || lastName
                            ? `${firstName} ${lastName}`.trim()
                            : usernameFallback;

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
                                  isThumbnail={true}
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
                                  isThumbnail={true}
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
                                  isThumbnail={true}
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
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                      >
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
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                      >
                        ›
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* TAG SIDEBAR */}
            <div className={styles.tagsSidebar}>
              <h2>Filter by Tags</h2>
              <div className={styles.tagsList}>
                {sortedTags.map((tag) => (
                  <label key={tag} className={styles.tagCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                    />
                    <span className={styles.checkboxTag}>
                      {tag}{' '}
                      <span style={{ color: '#999', fontSize: '0.9em' }}>
                        ({tagCounts[tag]})
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
