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
  // The slice of data for the current page
  const [maps, setMaps] = useState([]);

  // For the tag cloud in the sidebar
  // (fetched from /explore/tags, an array of all distinct tags)
  const [allMapsForTags, setAllMapsForTags] = useState([]);

  // search states
  const [searchInput, setSearchInput] = useState('');
  const [searchApplied, setSearchApplied] = useState('');

  // sorting & filtering
  const [sort, setSort] = useState('newest');
  const [selectedTags, setSelectedTags] = useState([]);

  // pagination
  const [page, setPage] = useState(1);
  const [totalMaps, setTotalMaps] = useState(0); // total # of matching maps (from server)
  const mapsPerPage = 24;

  // loading spinner
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // --------------------------------
  // 1) GET TAGS FOR SIDEBAR
  //    This endpoint returns all distinct tags from the DB.
  useEffect(() => {
    const fetchTags = async () => {
      try {
        // new endpoint
        const res = await axios.get('https://map-in-color.onrender.com/api/explore/tags');
        // 'res.data' is an array of distinct tags
        setAllMapsForTags(res.data);
      } catch (error) {
        console.error('Error fetching distinct tags:', error);
      }
    };
    fetchTags();
  }, []);

  // --------------------------------
  // 2) PARSE ?tags=... & ?page=... FROM THE URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    // Tags
    const urlTags = params.get('tags');
    if (urlTags) {
      const splitTags = urlTags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      setSelectedTags(splitTags);
    } else {
      setSelectedTags([]);
    }

    // Page
    const urlPage = parseInt(params.get('page'), 10);
    if (urlPage && urlPage > 0) {
      setPage(urlPage);
    } else {
      setPage(1);
    }
  }, [location.search]);

  // --------------------------------
  // 3) FETCH MAPS for current page
  const fetchMaps = async () => {
    setLoading(true);
    try {
      // Build query params for the /explore route
      const params = {
        sort,
        page,
        limit: mapsPerPage,
      };

      // apply search
      if (searchApplied.trim()) {
        params.search = searchApplied.trim();
      }
      // apply tags
      if (selectedTags.length > 0) {
        params.tags = selectedTags.join(',');
      }

      const res = await axios.get('https://map-in-color.onrender.com/api/explore', { params });
      // server returns { maps, total }
      setMaps(res.data.maps);
      setTotalMaps(res.data.total);
    } catch (err) {
      console.error('Error fetching maps:', err);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // 4) Trigger fetch when [selectedTags, sort, searchApplied, page] change
  useEffect(() => {
    fetchMaps();
    // eslint-disable-next-line
  }, [selectedTags, sort, searchApplied, page]);

  // --------------------------------
  // 5) HANDLERS
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchApplied(searchInput);

    // Reset to page 1
    const params = new URLSearchParams(location.search);
    params.delete('page'); // back to 1
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleTagChange = (tag) => {
    // Toggle the tag in selectedTags
    let newSelected = [];
    if (selectedTags.includes(tag)) {
      newSelected = selectedTags.filter(t => t !== tag);
    } else {
      newSelected = [...selectedTags, tag];
    }

    const params = new URLSearchParams(location.search);
    if (newSelected.length) {
      params.set('tags', newSelected.join(','));
    } else {
      params.delete('tags');
    }
    // Also reset page to 1
    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSortChange = (newSort) => {
    setSort(newSort);
    // Reset page to 1
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
    const newSelected = selectedTags.filter(t => t !== tagToRemove);
    const params = new URLSearchParams(location.search);
    if (newSelected.length) {
      params.set('tags', newSelected.join(','));
    } else {
      params.delete('tags');
    }
    params.delete('page');
    navigate(`?${params.toString()}`, { replace: true });
  };

  // --------------------------------
  // Pagination
  const totalPages = Math.ceil(totalMaps / mapsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage === page) return;

    // Show spinner immediately
    setLoading(true);

    // Update the page in the URL
    const params = new URLSearchParams(location.search);
    params.set('page', newPage.toString());
    navigate(`?${params.toString()}`, { replace: true });

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --------------------------------
  // TAG CLOUD
  // allMapsForTags is an array of tags if the server returns distinct tags
  // but if you want to show counts, you can do a quick pass here:
  const tagCounts = {};
  // If "allMapsForTags" is an array of strings (the distinct tags themselves),
  // you wouldn't need a forEach. But if you're storing them as objects or something,
  // adapt as needed. Suppose we do just an array of raw strings:
  allMapsForTags.forEach((t) => {
    const lower = t.toLowerCase();
    if (!tagCounts[lower]) {
      tagCounts[lower] = 0;
    }
    tagCounts[lower]++;
  });

  // Sort them by descending count
  const sortedTags = Object.keys(tagCounts).sort(
    (a, b) => tagCounts[b] - tagCounts[a]
  );

  // --------------------------------
  // RENDER
  return (
    <div className={styles.explorePageContainer}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`${styles.mainContentWrapper} ${
          isCollapsed ? styles.collapsed : ''
        }`}
      >
        <Header title="Explore" />
        <div className={styles.exploreContent}>
          {/* Top Bar: Sort & Search */}
          <div className={styles.topBar}>
            <div className={styles.sortTabs}>
              <span className={styles.sortByLabel}>Sort by:</span>
              <button
                className={`${styles.tabButton} ${
                  sort === 'newest' ? styles.activeTab : ''
                }`}
                onClick={() => handleSortChange('newest')}
              >
                Newest
              </button>
              <button
                className={`${styles.tabButton} ${
                  sort === 'starred' ? styles.activeTab : ''
                }`}
                onClick={() => handleSortChange('starred')}
              >
                Most Starred
              </button>
              <button
                className={`${styles.tabButton} ${
                  sort === 'trending' ? styles.activeTab : ''
                }`}
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
                    {maps.length === 0 ? (
                      <p>No maps found.</p>
                    ) : (
                      maps.map((map) => {
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

                  {/* Pagination buttons */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
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
                        disabled={page >= totalPages}
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
                {/* If you want to show counts: sortedTags is an array of tags 
                    we can do tagCounts[tag] as well */}
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
