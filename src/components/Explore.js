import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import styles from './Explore.module.css';
import Header from './Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaStar, FaComment } from 'react-icons/fa';

import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';
import LoadingSpinner from './LoadingSpinner';

function Explore({ isCollapsed, setIsCollapsed }) {
  const [maps, setMaps] = useState([]);
  const [allMapsForTags, setAllMapsForTags] = useState([]);
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [tagData, setTagData] = useState({});
  const [initialFetched, setInitialFetched] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const typingTimeoutRef = useRef(null);

  const [page, setPage] = useState(1);
  const mapsPerPage = 24;

  useEffect(() => {
    const fetchAllMaps = async () => {
      try {
        const res = await axios.get('https://map-in-color.onrender.com/api/explore');
        setAllMapsForTags(res.data);
      } catch (err) {
        console.error('Error fetching all maps for tags:', err);
      }
    };
    fetchAllMaps();
  }, []);

  useEffect(() => {
    const newTagData = {};
    allMapsForTags.forEach((map) => {
      if (map.tags && Array.isArray(map.tags)) {
        map.tags.forEach((tag) => {
          const lowered = tag.toLowerCase();
          if (!newTagData[lowered]) {
            newTagData[lowered] = { original: tag, count: 0 };
          }
          newTagData[lowered].count += 1;
        });
      }
    });
    setTagData(newTagData);
  }, [allMapsForTags]);

  // Parse tags from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagsFromUrl = params.get('tags');
    if (tagsFromUrl) {
      const splitTags = tagsFromUrl.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      setSelectedTags(splitTags);
    }
  }, [location.search]);

  const allTagsSorted = Object.entries(tagData)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([lowered, info]) => ({ tag: lowered, original: info.original, count: info.count }));

  const buildTagsQuery = () => {
    if (selectedTags.length === 0) return '';
    return selectedTags.map(lowered => tagData[lowered]?.original || lowered).join(',');
  };

  const fetchMaps = async () => {
    setLoading(true);
    setIsTyping(false);
    try {
      const params = { sort };
      const trimmedSearch = search.trim();
      if (trimmedSearch) params.search = trimmedSearch;
      const tagsQuery = buildTagsQuery();
      if (tagsQuery) params.tags = tagsQuery;

      const res = await axios.get('https://map-in-color.onrender.com/api/explore', { params });
      setMaps(res.data);
      setPage(1); 
    } catch (err) {
      console.error('Error fetching maps:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMapsImmediate = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Immediately show spinner and clear maps (to avoid showing stale data)
    setLoading(true);
    setMaps([]);
    fetchMaps();
  };

  const scheduleFetch = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    // Show spinner immediately (to avoid showing stale maps)
    setMaps([]);
    setLoading(true);
    setIsTyping(true);
    typingTimeoutRef.current = setTimeout(() => {
      fetchMaps();
    }, 3000);
  };

  useEffect(() => {
    if (allMapsForTags.length === 0) return;

    const trimmedSearch = search.trim();
    const tagsSelected = selectedTags.length > 0;

    if (!trimmedSearch && !tagsSelected && !initialFetched) {
      // If no filters, fetch immediately
      fetchMapsImmediate();
      setInitialFetched(true);
      return;
    }

    // If there's any filter (search or tags)
    if (trimmedSearch || tagsSelected) {
      scheduleFetch();
    } else {
      // If cleared all filters
      fetchMapsImmediate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, selectedTags, sort, allMapsForTags]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim()) {
      // User typed something: schedule a fetch
      scheduleFetch();
    } else {
      // User cleared search: fetch immediately (show spinner)
      fetchMapsImmediate();
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    fetchMapsImmediate();
  };

  const handleTagChange = (tag) => {
    const newSelected = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newSelected);

    // After changing tags, just like search, schedule or immediate fetch
    const trimmedSearch = search.trim();
    if (!trimmedSearch && newSelected.length === 0) {
      // No tags and no search: immediate fetch
      fetchMapsImmediate();
    } else if (!trimmedSearch && newSelected.length > 0) {
      // Only tags
      fetchMapsImmediate();
    } else {
      // Has search or tags
      scheduleFetch();
    }

    const newQuery = newSelected.join(',');
    const params = new URLSearchParams(location.search);
    if (newQuery) {
      params.set('tags', newQuery);
    } else {
      params.delete('tags');
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    // Changing sort also requires refetch
    const trimmedSearch = search.trim();
    if (!trimmedSearch && selectedTags.length === 0) {
      fetchMapsImmediate();
    } else {
      scheduleFetch();
    }
  };

  const handleResetTags = () => {
    setSelectedTags([]);
    const trimmedSearch = search.trim();
    if (!trimmedSearch) {
      fetchMapsImmediate();
    } else {
      scheduleFetch();
    }
    const params = new URLSearchParams(location.search);
    params.delete('tags');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const totalPages = Math.ceil(maps.length / mapsPerPage);
  const startIndex = (page - 1) * mapsPerPage;
  const endIndex = page * mapsPerPage;
  const mapsToShow = maps.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRemoveSelectedTag = (tagToRemove) => {
    const newSelected = selectedTags.filter(t => t !== tagToRemove);
    setSelectedTags(newSelected);
    const trimmedSearch = search.trim();
    if (!trimmedSearch && newSelected.length === 0) {
      fetchMapsImmediate();
    } else {
      scheduleFetch();
    }

    const newQuery = newSelected.join(',');
    const params = new URLSearchParams(location.search);
    if (newQuery) {
      params.set('tags', newQuery);
    } else {
      params.delete('tags');
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  const showSpinner = loading; // Now we rely on loading state to show spinner
  return (
    <div className={styles.explorePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className={`${styles.mainContentWrapper} ${isCollapsed ? styles.collapsed : ''}`}>
        <Header title="Explore" />
        <div className={styles.exploreContent}>

          <div className={styles.topBar}>
            <div className={styles.sortTabs}>
              <button
                className={`${styles.tabButton} ${sort === 'newest' && styles.activeTab}`}
                onClick={() => handleSortChange('newest')}
              >
                Newest
              </button>
              <button
                className={`${styles.tabButton} ${sort === 'starred' && styles.activeTab}`}
                onClick={() => handleSortChange('starred')}
              >
                Most Starred
              </button>
              <button
                className={`${styles.tabButton} ${sort === 'trending' && styles.activeTab}`}
                onClick={() => handleSortChange('trending')}
              >
                Trending
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
              <input
                type="text"
                placeholder="Search by map title..."
                value={search}
                onChange={handleSearchChange}
              />
            </form>
          </div>

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
                      title="Remove this tag"
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

          <div className={styles.mainContent}>
            <div className={styles.mapsSection}>
              {showSpinner ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className={styles.mapsGrid}>
                    {mapsToShow.length === 0 ? (
                      <p>No maps found.</p>
                    ) : (
                      mapsToShow.map((map) => {
                        const mapTitle = map.title || 'Untitled Map';
                        const first_name = map.user?.first_name || '';
                        const last_name = map.user?.last_name || '';
                        const userNameFallback = map.user?.username || 'Unknown';
                        const displayName = (first_name || last_name) ? `${first_name} ${last_name}`.trim() : userNameFallback;
                       
                        const creatorImg = map.user?.profile_picture
                          ? `https://map-in-color.onrender.com${map.user.profile_picture}`
                          : '/default-profile-pic.jpg';
                        
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
                              <span><FaStar /> {map.save_count || 0}</span>
                              {/* If commentCount is implemented, you can display it as:
                                  <span><FaComment /> {map.commentCount || 0}</span>
                              */}
                            </div>
                            {map.tags && map.tags.length > 0 && (
                              <div className={styles.tags}>
                                {map.tags.map((tag, idx) => (
                                  <span key={idx} className={styles.tag}>{tag}</span>
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

            <div className={styles.tagsSidebar}>
              <h2>Filter by Tags</h2>
              <div className={styles.tagsList}>
                {allTagsSorted.map(({ tag, count }) => (
                  <label key={tag} className={styles.tagCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagChange(tag)}
                    />
                    <span className={styles.checkboxTag}>
                      {tag} <span style={{color: '#999', fontSize: '0.9em'}}>({count})</span>
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
