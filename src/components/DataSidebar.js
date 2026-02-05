import React, { useState, useEffect, useMemo } from 'react';
import { FaUpload } from 'react-icons/fa';

// Data sources
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

// CSS
import styles from './DataSidebar.module.css';

/**
 * Normalize any "value" to a safe trimmed string for comparisons.
 * - numbers => "123"
 * - null/undefined => ""
 * - strings => trimmed string
 */
function safeTrim(value) {
  if (value === null || value === undefined) return '';
  return String(value).trim();
}

function toNumOrNull(x) {
  const s = safeTrim(x);
  if (!s) return null;
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}


/**
 * Determine if a row has "meaningful" value (works for numeric + categorical).
 */
function hasMeaningfulValue(value) {
  return safeTrim(value) !== '';
}

export default function DataSidebar({
  selectedMap = 'world',
  mapDataType = 'choropleth',
  onChangeDataType,
  dataEntries = [],
  setDataEntries,
  onOpenUploadModal,
}) {
  const [localData, setLocalData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingType, setPendingType] = useState(null);

  const [newCategory, setNewCategory] = useState('');

const SORT_MODES = {
  NAME_AZ: "name_az",
  NAME_ZA: "name_za",
  VALUE_HIGH_LOW: "value_high_low",   // choropleth only
  VALUE_LOW_HIGH: "value_low_high",   // choropleth only
  CAT_AZ: "cat_az",                   // categorical: value A→Z
  CAT_ZA: "cat_za",                   // categorical: value Z→A
};


const [sortMode, setSortMode] = useState(SORT_MODES.NAME_AZ);


const [editingCode, setEditingCode] = useState(null);
const [frozenCodes, setFrozenCodes] = useState(null); // array of codes or null
const snapshotOrder = (rows) => rows.map((r) => r.code);


  // Decide which source to use
  const dataSource = useMemo(() => {
    return selectedMap === 'usa'
      ? usStatesCodes
      : selectedMap === 'europe'
      ? euCodes
      : countryCodes;
  }, [selectedMap]);

  /**
   * Merge parent's data with dataSource on mount / map change
   * Also gather any distinct categories from the parent's data if we are in categorical mode
   */
  useEffect(() => {
    const merged = dataSource.map((item) => {
      const existing = dataEntries.find((d) => d.code === item.code);
      return {
        code: item.code,
        name: item.name,
        value: existing ? existing.value : '',
      };
    });

    setLocalData(merged);

    if (mapDataType === 'categorical') {
      const uniqueCats = new Set();
      for (const row of dataEntries) {
        const v = safeTrim(row?.value);
        if (v) uniqueCats.add(v);
      }
      setCategories(Array.from(uniqueCats));
    } else {
      setCategories([]);
    }
  }, [dataSource, dataEntries, mapDataType]);


  useEffect(() => {
  if (mapDataType === "categorical") {
    if (sortMode === SORT_MODES.VALUE_HIGH_LOW || sortMode === SORT_MODES.VALUE_LOW_HIGH) {
      setSortMode(SORT_MODES.CAT_AZ);
    }
  } else {
    if (sortMode === SORT_MODES.CAT_AZ || sortMode === SORT_MODES.CAT_ZA) {
      setSortMode(SORT_MODES.NAME_AZ);
    }
  }
}, [mapDataType]); // eslint-disable-line react-hooks/exhaustive-deps


  /**
   * Switching tabs between 'choropleth'/'categorical' => show a warning if there's data
   */
  const handleTabClick = (newType) => {
    if (newType === mapDataType) return;

    // ✅ FIX: supports numeric values too
    const hasExistingData = localData.some((item) =>
      hasMeaningfulValue(item?.value)
    );

    if (hasExistingData) {
      setPendingType(newType);
      setShowWarningModal(true);
    } else {
      if (onChangeDataType) onChangeDataType(newType);
    }
  };

  /**
   * Confirm switching => wipe data, switch type
   */
  const handleConfirmSwitch = () => {
    const cleared = dataSource.map((item) => ({
      code: item.code,
      name: item.name,
      value: '',
    }));

    setLocalData(cleared);
    setDataEntries(cleared);

    if (onChangeDataType && pendingType) {
      onChangeDataType(pendingType);
    }

    setCategories([]);
    setPendingType(null);
    setShowWarningModal(false);
  };

  const handleCancelSwitch = () => {
    setPendingType(null);
    setShowWarningModal(false);
  };

  /**
   * onChange => only update local
   * (If numeric => only allow digits/decimals)
   */
const handleValueChange = (code, newVal) => {
  if (mapDataType === "choropleth") {
    const numericRegex = /^-?\d*(\.\d*)?$/;
    if (!numericRegex.test(newVal)) return;
  }

  setLocalData((prev) =>
    prev.map((row) => (row.code === code ? { ...row, value: newVal } : row))
  );
};


  /**
   * onBlur => push to parent
   */
const handleBlur = () => setDataEntries((_) => localData);

  /**
   * Add category
   */
  const handleAddCategory = () => {
    const cat = safeTrim(newCategory);
    if (cat && !categories.includes(cat)) {
      setCategories((prev) => [...prev, cat]);
    }
    setNewCategory('');
  };

  /**
   * Remove category => also remove from any row that used it
   */
  const handleRemoveCategory = (catToRemove) => {
    setCategories((prev) => prev.filter((c) => c !== catToRemove));

    setLocalData((prev) => {
      const updated = prev.map((row) => {
        if (safeTrim(row.value) === catToRemove) {
          return { ...row, value: '' };
        }
        return row;
      });

      // ✅ FIX: push the UPDATED rows, not stale localData
      setDataEntries(updated);
      return updated;
    });
  };

  const handleOpenUploadClick = () => {
    if (onOpenUploadModal) onOpenUploadModal();
  };

const displayData = useMemo(() => {
  const collator = new Intl.Collator(undefined, { sensitivity: "base" });

  const compareNameAZ = (a, b) => collator.compare(a?.name ?? "", b?.name ?? "");
  const compareNameZA = (a, b) => collator.compare(b?.name ?? "", a?.name ?? "");

  const compareCatAZ = (a, b) => collator.compare(safeTrim(a?.value), safeTrim(b?.value));
  const compareCatZA = (a, b) => collator.compare(safeTrim(b?.value), safeTrim(a?.value));

  const numOrNull = (row) => toNumOrNull(row?.value);

  const compareNum = (a, b, dir) => {
    const av = numOrNull(a);
    const bv = numOrNull(b);
    if (av == null && bv == null) return compareNameAZ(a, b);
    if (av == null) return 1;
    if (bv == null) return -1;
    return dir === "asc" ? av - bv : bv - av;
  };

  // 1) If we are frozen, render using frozen order (no jumping)
  if (Array.isArray(frozenCodes) && frozenCodes.length) {
    const byCode = new Map(localData.map((r) => [r.code, r]));
    return frozenCodes.map((c) => byCode.get(c)).filter(Boolean);
  }

  // 2) Otherwise compute sorted list based on rules
  const rows = [...localData];

  // Name sorts: IGNORE values
  if (sortMode === SORT_MODES.NAME_AZ) return rows.sort(compareNameAZ);
  if (sortMode === SORT_MODES.NAME_ZA) return rows.sort(compareNameZA);

  // Categorical sorts: sort by category value text (then name), IGNORE “has value”
  if (mapDataType === "categorical") {
    if (sortMode === SORT_MODES.CAT_AZ) {
      return rows.sort((a, b) => {
        const av = safeTrim(a?.value);
        const bv = safeTrim(b?.value);
        if (!av && !bv) return compareNameAZ(a, b);
        if (!av) return 1;
        if (!bv) return -1;
        const c = compareCatAZ(a, b);
        return c !== 0 ? c : compareNameAZ(a, b);
      });
    }
    if (sortMode === SORT_MODES.CAT_ZA) {
      return rows.sort((a, b) => {
        const av = safeTrim(a?.value);
        const bv = safeTrim(b?.value);
        if (!av && !bv) return compareNameAZ(a, b);
        if (!av) return 1;
        if (!bv) return -1;
        const c = compareCatZA(a, b);
        return c !== 0 ? c : compareNameAZ(a, b);
      });
    }

    // fallback
    return rows.sort(compareNameAZ);
  }

  // Choropleth value sorts: ONLY here do we put valued rows first
  if (sortMode === SORT_MODES.VALUE_HIGH_LOW) {
    return rows.sort((a, b) => compareNum(a, b, "desc"));
  }
  if (sortMode === SORT_MODES.VALUE_LOW_HIGH) {
    return rows.sort((a, b) => compareNum(a, b, "asc"));
  }

  return rows.sort(compareNameAZ);
}, [localData, mapDataType, sortMode, frozenCodes]);






  return (
    <div className={styles.sidebarContainer}>
      {/* TAB ROW */}
      <div className={styles.tabRow}>
        <div
          className={`${styles.tabItem} ${
            mapDataType === 'choropleth' ? styles.activeTab : ''
          }`}
          onClick={() => handleTabClick('choropleth')}
        >
          Choropleth
        </div>
        <div
          className={`${styles.tabItem} ${
            mapDataType === 'categorical' ? styles.activeTab : ''
          }`}
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

      <div className={styles.sortRow}>
  <label className={styles.sortLabel}>Sort:</label>
<select
  className={styles.sortSelect}
  value={sortMode}
  onChange={(e) => setSortMode(e.target.value)}
  disabled={!!editingCode}
>
  <option value={SORT_MODES.NAME_AZ}>Name: A → Z</option>
  <option value={SORT_MODES.NAME_ZA}>Name: Z → A</option>

  {mapDataType === "choropleth" ? (
    <>
      <option value={SORT_MODES.VALUE_HIGH_LOW}>Value: high → low</option>
      <option value={SORT_MODES.VALUE_LOW_HIGH}>Value: low → high</option>
    </>
  ) : (
    <>
      <option value={SORT_MODES.CAT_AZ}>Category: A → Z</option>
      <option value={SORT_MODES.CAT_ZA}>Category: Z → A</option>
    </>
  )}
</select>

</div>


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
            <p style={{ fontStyle: 'italic', fontSize: '13px' }}>
              No categories added yet.
            </p>
          ) : (
            <ul className={styles.categoryList}>
              {categories.map((cat) => (
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
        {displayData.map((region, idx) => (
          <div key={region.code} className={styles.countryRow}>
            <div className={styles.countryLabel}>{region.name}</div>

            {mapDataType === 'choropleth' ? (
         <input
            className={styles.countryInput}
            value={region.value}
            placeholder="Enter number..."
            onFocus={() => {
              setEditingCode(region.code);
              if (!frozenCodes) setFrozenCodes(displayData.map((r) => r.code));
            }}
            onChange={(e) => handleValueChange(region.code, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
            }}
            onBlur={() => {
              setDataEntries(localData);
              setEditingCode(null);
              setFrozenCodes(null); // ✅ unfreeze immediately
            }}
          />




            ) : (
      <select
  className={styles.countrySelect}
  value={safeTrim(region.value)}
  onFocus={() => {
    setEditingCode(region.code);
    if (!frozenCodes) setFrozenCodes(displayData.map((r) => r.code));
  }}
  onChange={(e) => {
    const v = e.target.value;
    setLocalData((prev) => {
      const next = prev.map((row) =>
        row.code === region.code ? { ...row, value: v } : row
      );
      setDataEntries(next);
      return next;
    });
  }}
  onBlur={() => {
    setEditingCode(null);
    setFrozenCodes(null);
  }}
>



                <option value="">(None)</option>
                {categories.map((cat) => (
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
            <button
              className={styles.typeWarningCloseBtn}
              onClick={handleCancelSwitch}
            >
              &times;
            </button>
            <div className={styles.typeWarningContent}>
              <h2>Switch Data Type?</h2>
              <p>
                Are you sure you want to switch to <strong>{pendingType}</strong>?
                <br />
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
