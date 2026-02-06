import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { FaUpload, FaPlus } from 'react-icons/fa';

// Data sources
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

import ConfirmModal from "./ConfirmModal";


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
  hoveredCode = null,
  selectedCode = null,
  onHoverCode,
  onSelectCode,
  categoryOptions = [], 
  placeholders = {},
  onChangePlaceholder,
}) {
  const [localData, setLocalData] = useState([]);

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingType, setPendingType] = useState(null);


const SORT_MODES = {

  VALUE_HIGH_LOW: "value_high_low",   // choropleth only
  VALUE_LOW_HIGH: "value_low_high",   // choropleth only

  CAT_AZ: "cat_az",                   // categorical: value A→Z
  CAT_ZA: "cat_za",                   // categorical: value Z→A

  NAME_AZ: "name_az",
  NAME_ZA: "name_za",
};


const defaultSortForType = (type) =>
  type === "choropleth" ? SORT_MODES.VALUE_HIGH_LOW : SORT_MODES.CAT_AZ;

const [sortMode, setSortMode] = useState(() => defaultSortForType(mapDataType));


const [editingCode, setEditingCode] = useState(null);
const [frozenCodes, setFrozenCodes] = useState(null); // array of codes or null
const snapshotOrder = (rows) => rows.map((r) => r.code);


const normCode = (c) => String(c || "").trim().toUpperCase();

const rowRefs = useRef(new Map());
const listRef = useRef(null);

const [isPlaceholderOpen, setIsPlaceholderOpen] = useState(false);
const [placeholderDraft, setPlaceholderDraft] = useState("");

const selectedNorm = useMemo(() => (selectedCode ? normCode(selectedCode) : null), [selectedCode]);
const selectedPlaceholderValue = selectedNorm ? (placeholders?.[selectedNorm] ?? "") : "";

// When selection changes:
// - if there is existing placeholder text -> open textarea
// - else -> show plus button (closed)
useEffect(() => {
  if (!selectedNorm) {
    setIsPlaceholderOpen(false);
    setPlaceholderDraft("");
    return;
  }

  const existing = String(placeholders?.[selectedNorm] ?? "");
  setPlaceholderDraft(existing);
  setIsPlaceholderOpen(existing.trim().length > 0);
}, [selectedNorm]); // intentionally not depending on placeholders to avoid cursor jumps while typing





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

    setPendingType(null);
    setShowWarningModal(false);
  };

  const handleCancelSwitch = () => {
    setPendingType(null);
    setShowWarningModal(false);
  };

  const commitPlaceholder = (code, text) => {
  const C = normCode(code);
  if (!C) return;
  onChangePlaceholder?.(C, text);
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


useLayoutEffect(() => {
  if (!selectedCode) return;

  // wait one paint so refs for the selected row exist (especially after sorting)
  const raf = requestAnimationFrame(() => {
    const container = listRef.current;
    if (!container) return;

    const el = rowRefs.current.get(normCode(selectedCode));
    if (!el) return;

    // center the element inside the container
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const elTopInContainer = elRect.top - containerRect.top + container.scrollTop;
    const elCenter = elTopInContainer + elRect.height / 2;

    const targetScrollTop = elCenter - container.clientHeight / 2;

    container.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "smooth",
    });
  });

  return () => cancelAnimationFrame(raf);
}, [selectedCode]);




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
<div className={styles.uploadButtonWrap}>
  <button className={styles.uploadCta} onClick={handleOpenUploadClick} type="button">
    <span className={styles.uploadCtaIcon}>
      <FaUpload />
    </span>
    <span className={styles.uploadCtaText}>Upload Data</span>
  </button>
</div>

      <div className={styles.sortRow}>
  <label className={styles.sortLabel}>Sort:</label>
<select
  className={styles.sortSelect}
  value={sortMode}
  onChange={(e) => setSortMode(e.target.value)}
  disabled={!!editingCode}
>

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
  <option value={SORT_MODES.NAME_AZ}>Name: A → Z</option>
  <option value={SORT_MODES.NAME_ZA}>Name: Z → A</option>

 
</select>

</div>


     
     {/* MAIN SCROLLABLE LIST */}
<div ref={listRef} className={styles.scrollableList}>
  {displayData.map((region) => {
    const code = normCode(region.code);
    const isHovered = hoveredCode && normCode(hoveredCode) === code;
    const isSelected = selectedCode && normCode(selectedCode) === code;

    return (
  <div key={region.code} className={styles.rowWrapper}>
    <div
      ref={(el) => {
        if (!el) rowRefs.current.delete(code);
        else rowRefs.current.set(code, el);
      }}
      className={[
        styles.countryRow,
        isHovered ? styles.rowHovered : "",
        isSelected ? styles.rowSelected : "",
      ].join(" ")}
      onMouseEnter={() => onHoverCode?.(code)}
      onMouseLeave={() => onHoverCode?.(null)}
      onClick={(e) => {
        const tag = e.target?.tagName?.toLowerCase();
        if (tag === "input" || tag === "select" || tag === "option" || tag === "textarea" || tag === "button") return;
        onSelectCode?.(code);
      }}
    >
      <div className={styles.countryLeft} onClick={() => onSelectCode?.(code)}>
        <img
          className={styles.flag}
          src={`https://flagcdn.com/w20/${region.code.toLowerCase()}.png`}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
        <div className={styles.countryLabel} title={region.name}>
          {region.name}
        </div>
      </div>

      {mapDataType === "choropleth" ? (
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
            setFrozenCodes(null);
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
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      )}
    </div>

    {/* ✅ BELOW ROW: placeholder UI only for selected row */}
    {isSelected && (
      <div className={styles.placeholderArea}>
        {isPlaceholderOpen || (placeholders?.[code] ?? "").trim() ? (
          <div className={styles.placeholderEditor}>
            <textarea
              className={styles.placeholderTextarea}
              value={placeholderDraft}
              placeholder="Explain what this value means for this country…"
              onChange={(e) => setPlaceholderDraft(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  commitPlaceholder(code, placeholderDraft);
                  e.currentTarget.blur();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  // revert draft and close (but keep stored value)
                  const existing = String(placeholders?.[code] ?? "");
                  setPlaceholderDraft(existing);
                  setIsPlaceholderOpen(existing.trim().length > 0);
                  e.currentTarget.blur();
                }
              }}
              onBlur={() => {
                commitPlaceholder(code, placeholderDraft);
                // keep it open if there's text, otherwise collapse back to plus
                const next = String(placeholderDraft ?? "");
                setIsPlaceholderOpen(next.trim().length > 0);
              }}
            />
            <div className={styles.placeholderHint}>
              Ctrl/⌘ + Enter to save • Click away to close
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={styles.addPlaceholderBtn}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaceholderOpen(true);
              // textarea will appear; user types; blur saves
            }}
          >
            <FaPlus />
            <span>Add description</span>
          </button>
        )}
      </div>
    )}
  </div>
);
  })}
</div>


     <ConfirmModal
      isOpen={showWarningModal}
      title="Switch Data Type?"
      message={
        <>
          Are you sure you want to switch to <strong>{pendingType}</strong>?
          <br />
          This will erase all your current data.
        </>
      }
      cancelText="Cancel"
      confirmText="Confirm"
      danger
      onCancel={handleCancelSwitch}
      onConfirm={handleConfirmSwitch}
    />

    </div>
  );
}
