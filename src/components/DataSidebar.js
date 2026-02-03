import React, { useState, useEffect } from 'react';
import { FaUpload } from 'react-icons/fa';

// Data sources
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

// Import your CSS module
import styles from './DataSidebar.module.css';

/**
 * DataSidebar
 *
 * Props:
 *   selectedMap: 'world' | 'usa' | 'europe'
 *   mapDataType: 'choropleth' | 'categorical'
 *   onChangeDataType: function(newType)
 *   dataEntries: Array<{ code, name, value }>
 *   setDataEntries: function(...)
 *   onOpenUploadModal: function()
 */
export default function DataSidebar({
  selectedMap = 'world',
  mapDataType = 'choropleth',
  onChangeDataType,
  dataEntries = [],
  setDataEntries,
  onOpenUploadModal,
}) {
  // This is our local copy of the data (one row per country/state)
  const [localData, setLocalData] = useState([]);

  // A list of categories the user can assign in “categorical” mode
  const [categories, setCategories] = useState([]);

  // For controlling the “Switch Data Type?” warning modal
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingType, setPendingType] = useState(null);

  // For adding new categories
  const [newCategory, setNewCategory] = useState('');

  // Decide which source to use
  const dataSource = (selectedMap === 'usa')
    ? usStatesCodes
    : (selectedMap === 'europe')
      ? euCodes
      : countryCodes;

  /**
   * Merge parent's data with dataSource on mount / map change
   * Also gather any distinct categories from the parent's data if we are in categorical mode
   */
  useEffect(() => {
    const merged = dataSource.map((item) => {
      const existing = dataEntries.find(d => d.code === item.code);
      return {
        code: item.code,
        name: item.name,
        value: existing ? existing.value : ''
      };
    });

    setLocalData(merged);

    // If we’re in categorical mode, build category list from parent's data
    if (mapDataType === 'categorical') {
      const uniqueCats = new Set();
      for (const row of dataEntries) {
        if (row.value.trim()) {
          uniqueCats.add(row.value.trim());
        }
      }
      setCategories(Array.from(uniqueCats));
    } else {
      // If we're in choropleth, reset categories
      setCategories([]);
    }
  }, [selectedMap, dataEntries, dataSource, mapDataType]);

  /**
   * Switching tabs between 'choropleth'/'categorical' => show a warning if there's data
   */
  const handleTabClick = (newType) => {
    if (newType === mapDataType) return;

    const hasExistingData = localData.some(item => item.value.trim() !== '');
    if (hasExistingData) {
      // Show the “Are you sure?” modal
      setPendingType(newType);
      setShowWarningModal(true);
    } else {
      // No data => just switch
      if (onChangeDataType) onChangeDataType(newType);
    }
  };

  /**
   * Confirm switching => wipe data, switch type
   */
  const handleConfirmSwitch = () => {
    // Wipe local data
    const cleared = dataSource.map(item => ({
      code: item.code,
      name: item.name,
      value: '',
    }));
    setLocalData(cleared);
    setDataEntries(cleared);

    // Switch type
    if (onChangeDataType && pendingType) {
      onChangeDataType(pendingType);
    }

    // Clear categories
    setCategories([]);

    // Hide modal
    setPendingType(null);
    setShowWarningModal(false);
  };

  /**
   * Cancel switching
   */
  const handleCancelSwitch = () => {
    setPendingType(null);
    setShowWarningModal(false);
  };

  /**
   * onChange => only update local
   * (If numeric => only allow digits/decimals)
   */
  const handleValueChange = (idx, newVal) => {
    if (mapDataType === 'choropleth') {
      const numericRegex = /^-?\d*(\.\d*)?$/;
      if (!numericRegex.test(newVal)) {
        return;
      }
    }
    setLocalData(prev => {
      const clone = [...prev];
      clone[idx] = { ...clone[idx], value: newVal };
      return clone;
    });
  };

  /**
   * onBlur => push to parent
   */
  const handleBlur = () => {
    setDataEntries(localData);
  };

  /**
   * Add category
   */
  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories([...categories, cat]);
    }
    setNewCategory('');
  };

  /**
   * Remove category => also remove from any row that used it
   */
  const handleRemoveCategory = (catToRemove) => {
    // Filter out the category
    const updatedCats = categories.filter(c => c !== catToRemove);
    setCategories(updatedCats);

    // For every row in localData that used catToRemove, set value=''
    setLocalData(prev => {
      return prev.map(row => {
        if (row.value === catToRemove) {
          return { ...row, value: '' };
        }
        return row;
      });
    });
    // Also push changes up
    setDataEntries(localData);
  };

  /**
   * The “Upload Data” button => open parent’s modal
   */
  const handleOpenUploadClick = () => {
    if (onOpenUploadModal) {
      onOpenUploadModal();
    }
  };

  return (
    <div className={styles.sidebarContainer}>
      {/* TAB ROW */}
      <div className={styles.tabRow}>
        <div
          className={`${styles.tabItem} ${mapDataType === 'choropleth' ? styles.activeTab : ''}`}
          onClick={() => handleTabClick('choropleth')}
        >
          Choropleth
        </div>
        <div
          className={`${styles.tabItem} ${mapDataType === 'categorical' ? styles.activeTab : ''}`}
          onClick={() => handleTabClick('categorical')}
        >
          Categorical
        </div>
      </div>

      {/* UPLOAD BUTTON */}
      <button className={styles.uploadButtonAlt} onClick={handleOpenUploadClick}>
        <FaUpload className={styles.uploadIcon} />
        <span>Upload Data</span>
      </button>

      {/* If in "categorical" => show category manager */}
      {mapDataType === 'categorical' && (
        <div className={styles.categoryManager}>
          <h4>Categories</h4>
          <div className={styles.addCategoryRow}>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category..."
            />
            <button onClick={handleAddCategory}>Add</button>
          </div>

          {categories.length === 0 ? (
            <p style={{ fontStyle: 'italic', fontSize: '13px' }}>No categories added yet.</p>
          ) : (
            <ul className={styles.categoryList}>
              {categories.map(cat => (
                <li key={cat}>
                  {cat}
                  <button
                    className={styles.removeCatBtn}
                    onClick={() => handleRemoveCategory(cat)}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* MAIN SCROLLABLE LIST */}
      <div className={styles.scrollableList}>
        {localData.map((region, idx) => (
          <div key={region.code} className={styles.countryRow}>
            <div className={styles.countryLabel}>{region.name}</div>

            {/* If choropleth => numeric input; else => category dropdown */}
            {mapDataType === 'choropleth' ? (
              <input
                className={styles.countryInput}
                value={region.value}
                placeholder="Enter number..."
                onChange={(e) => handleValueChange(idx, e.target.value)}
                onBlur={handleBlur}
              />
            ) : (
              // Show a dropdown of categories
              <select
                className={styles.countrySelect}
                value={region.value}
                onChange={(e) => {
                  handleValueChange(idx, e.target.value);
                  // push to parent immediately or do it onBlur
                  setDataEntries(
                    localData.map((item, i) => i === idx 
                      ? { ...item, value: e.target.value }
                      : item
                    )
                  );
                }}
              >
                <option value="">(None)</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* WARNING MODAL */}
      {showWarningModal && (
        <div className={styles.typeWarningOverlay} onClick={handleCancelSwitch}>
          <div
            className={styles.typeWarningModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.typeWarningCloseBtn} onClick={handleCancelSwitch}>
              &times;
            </button>
            <div className={styles.typeWarningContent}>
              <h2>Switch Data Type?</h2>
              <p>
                Are you sure you want to switch to <strong>{pendingType}</strong>? <br />
                This will erase all your current data.
              </p>
              <div className={styles.typeWarningActions}>
                <button onClick={handleCancelSwitch}>Cancel</button>
                <button onClick={handleConfirmSwitch}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
