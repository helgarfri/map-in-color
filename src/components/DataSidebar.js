import React, { useState, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { FaUpload, FaPlus } from 'react-icons/fa';

// Data sources
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import { MICROSTATES_LIST } from '../constants/microstates';
import { CUSTOM_MAP_MODAL_PRESETS } from '../constants/regionPresets';
import { getUsStateFlagUrl } from "../utils/usStateFlags";

import ConfirmModal from "./ConfirmModal";
import StaticMapThumbnail from "./StaticMapThumbnail";
import styles from "./DataSidebar.module.css";

/** Minimal map object for a preset thumbnail (dropdown + current display) */
function minimalMapForPreset(preset) {
  const isUsa = preset.id === "usa";
  return {
    title: "",
    ocean_color: "#c0c0c0",
    unassigned_color: "#c0c0c0",
    font_color: "black",
    is_title_hidden: true,
    show_no_data_legend: false,
    show_microstates: true,
    microstates_custom: null,
    custom_map_countries: isUsa ? null : preset.codes,
    custom_map_preset_id: isUsa ? null : preset.id,
    selected_map: isUsa ? "usa" : "world",
    groups: [],
    data: [],
    custom_ranges: [],
  };
}

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
  /** When set, only these country codes are shown (custom map selection). */
  customMapCountries = null,
  /** When set (world + custom map), only these microstate codes are shown. null = all microstates, [] = none. */
  microstatesCustom = null,
  /** When set, the id of the selected region preset (e.g. 'europe') for the custom map button label. */
  customMapPresetId = null,
  /** When provided (and selectedMap === 'world'), show custom map button above Upload. Opens modal. */
  onOpenCustomMapModal,
  /** Minimal map object for the custom map button thumbnail (selected_map, custom_map_countries, etc.). */
  mapForThumbnail = null,
  /** When set, called when user selects a map preset (world, europe, northAmerica, ..., usa). */
  onSelectMapPreset = null,
  /** When provided (e.g. while custom map modal is open), use this for the region count instead of effectiveDataSource.length. */
  regionCountOverride = undefined,
}) {
  const [localData, setLocalData] = useState([]);

  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingType, setPendingType] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");



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
// - if there is existing placeholder text or imported description -> open textarea / show it
// - else -> show plus button (closed)
// Use placeholder if set, otherwise fall back to imported description from dataEntries
useEffect(() => {
  if (!selectedNorm) {
    setIsPlaceholderOpen(false);
    setPlaceholderDraft("");
    return;
  }

  const fromPlaceholder = String(placeholders?.[selectedNorm] ?? "");
  const fromData = dataEntries?.find((d) => normCode(d?.code) === selectedNorm);
  const fromDescription = fromData?.description != null && String(fromData.description).trim() !== "" ? String(fromData.description).trim() : "";
  const existing = fromPlaceholder || fromDescription;
  setPlaceholderDraft(existing);
  setIsPlaceholderOpen(existing.trim().length > 0);
}, [selectedNorm, dataEntries]); // dataEntries so imported descriptions show when selection changes





  // Decide which source to use (world = countryCodes; usa = usStatesCodes)
  const dataSource = useMemo(() => {
    return selectedMap === "usa" ? usStatesCodes : countryCodes;
  }, [selectedMap]);

  // Set of codes that exist in the main data source (world-countries); used so we never add microstates not in the list and inflate the count.
  const dataSourceCodeSet = useMemo(
    () => new Set(dataSource.map((r) => normCode(r?.code))),
    [dataSource]
  );

  // When custom map is set, only show countries/states that are in the selection (+ microstates for world)
  const effectiveDataSource = useMemo(() => {
    if (selectedMap === 'usa') {
      if (!customMapCountries?.length) return dataSource;
      const stateSet = new Set(customMapCountries.map((c) => String(c).toUpperCase().trim()));
      return dataSource.filter((item) => stateSet.has(normCode(item?.code)));
    }
    if (selectedMap !== 'world') return dataSource;
    if (!customMapCountries?.length) return dataSource;
    const countrySet = new Set(customMapCountries.map((c) => String(c).toUpperCase().trim()));
    const countriesFromSource = dataSource.filter((item) => countrySet.has(normCode(item?.code)));
    // Include selected microstates so they appear in the sidebar dataset (only those that exist in dataSource so count never exceeds 234)
    const microstatesToShow =
      microstatesCustom === null
        ? MICROSTATES_LIST
        : Array.isArray(microstatesCustom) && microstatesCustom.length > 0
          ? MICROSTATES_LIST.filter((m) =>
              microstatesCustom.some((c) => normCode(c) === normCode(m.code))
            )
          : [];
    const existingCodes = new Set(countriesFromSource.map((r) => normCode(r?.code)));
    const microstateRows = microstatesToShow
      .filter((m) => !existingCodes.has(normCode(m.code)) && dataSourceCodeSet.has(normCode(m.code)))
      .map((m) => ({ code: m.code, name: m.name }));
    return [...countriesFromSource, ...microstateRows];
  }, [dataSource, customMapCountries, selectedMap, microstatesCustom, dataSourceCodeSet]);

  /**
   * Merge parent's data with effectiveDataSource on mount / map change
   * Also gather any distinct categories from the parent's data if we are in categorical mode.
   * Includes description from dataEntries (e.g. from CSV/XLS import) so it shows in the sidebar.
   * In categorical mode, push the full merged list to parent so unassigned count is correct from the start.
   */
  useEffect(() => {
    const merged = effectiveDataSource.map((item) => {
      const existing = dataEntries.find((d) => normCode(d?.code) === normCode(item?.code));
      return {
        code: item.code,
        name: item.name,
        value: existing != null ? existing.value : '',
        description: existing?.description != null && String(existing.description).trim() !== '' ? String(existing.description).trim() : undefined,
      };
    });

    setLocalData(merged);

    if (mapDataType === 'categorical' && (dataEntries?.length ?? 0) < effectiveDataSource.length) {
      if (customMapCountries?.length) {
        setDataEntries((prev) => {
          const next = new Map(prev.map((d) => [normCode(d?.code), d]));
          merged.forEach((row) => next.set(normCode(row?.code), row));
          return Array.from(next.values());
        });
      } else {
        setDataEntries(merged);
      }
    }
  }, [effectiveDataSource, dataEntries, mapDataType, customMapCountries]);


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
    const cleared = effectiveDataSource.map((item) => ({
      code: item.code,
      name: item.name,
      value: '',
    }));

    setLocalData(cleared);
    if (customMapCountries?.length) {
      setDataEntries((prev) => {
        const next = new Map(prev.map((d) => [normCode(d?.code), d]));
        cleared.forEach((row) => next.set(normCode(row?.code), row));
        return Array.from(next.values());
      });
    } else {
      setDataEntries(cleared);
    }

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
   * Choropleth: only rows with valid numeric value.
   * Categorical: all rows (including value "" for unassigned) so unassigned count is correct.
   * When custom map is set, merge visible rows into existing data so we don't drop other countries.
   */
  const handleBlur = () => {
    const toPush = mapDataType === "choropleth"
      ? localData.filter((row) => toNumOrNull(row.value) != null)
      : localData;
    if (customMapCountries?.length) {
      setDataEntries((prev) => {
        const next = new Map(prev.map((d) => [normCode(d?.code), d]));
        toPush.forEach((row) => next.set(normCode(row?.code), row));
        return Array.from(next.values());
      });
    } else {
      setDataEntries(toPush);
    }
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

const filteredData = useMemo(() => {
  const q = safeTrim(searchQuery).toLowerCase();
  if (!q) return displayData;

  return displayData.filter((r) => {
    const name = (r?.name ?? "").toLowerCase();
    const code = normCode(r?.code).toLowerCase();
    return name.includes(q) || code.includes(q);
  });
}, [displayData, searchQuery]);


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




  /** Active preset id: usa when on US map, else customMapPresetId, or "custom" when we have a custom selection, else world */
  const activePresetId = selectedMap === "usa"
    ? "usa"
    : (customMapPresetId || (customMapCountries?.length ? "custom" : "world"));
  const activePreset = useMemo(
    () => CUSTOM_MAP_MODAL_PRESETS.find((p) => p.id === activePresetId) ?? { id: "custom", label: "Custom" },
    [activePresetId]
  );

  const [mapSelectOpen, setMapSelectOpen] = useState(false);
  const mapSelectRef = useRef(null);
  useEffect(() => {
    if (!mapSelectOpen) return;
    const onDocClick = (e) => {
      if (mapSelectRef.current && !mapSelectRef.current.contains(e.target)) setMapSelectOpen(false);
    };
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, [mapSelectOpen]);

  const regionCount = regionCountOverride !== undefined && regionCountOverride !== null ? regionCountOverride : effectiveDataSource.length;
  const regionLabel = selectedMap === "usa" ? "states" : "countries";

  return (
    <div className={styles.sidebarContainer}>
      {/* Map select: dropdown of presets (thumbnail+label) + count that opens customize modal */}
      {(onSelectMapPreset || onOpenCustomMapModal) && (
        <div className={styles.mapSelectWrap} ref={mapSelectRef}>
          <div className={styles.mapSelectRow}>
            <button
              type="button"
              className={styles.mapSelectTrigger}
              onClick={() => onSelectMapPreset && setMapSelectOpen((o) => !o)}
              aria-expanded={mapSelectOpen}
              aria-haspopup="listbox"
              aria-label="Choose map type"
            >
              <div className={styles.customMapThumb}>
                {mapForThumbnail ? (
                  <StaticMapThumbnail map={mapForThumbnail} className={styles.customMapThumbImg} />
                ) : (
                  <div className={styles.customMapThumbFallback} aria-hidden="true" />
                )}
              </div>
              <span className={styles.customMapLabel}>
                {activePreset?.label ?? "Custom"}
              </span>
              {onSelectMapPreset && (
                <span className={styles.mapSelectChevron} aria-hidden="true">
                  {mapSelectOpen ? "▴" : "▾"}
                </span>
              )}
            </button>
            {onOpenCustomMapModal && (
              <button
                type="button"
                className={styles.mapSelectCount}
                onClick={(e) => { e.stopPropagation(); onOpenCustomMapModal(); }}
                title={`${regionCount} ${regionLabel} — click to choose which to show`}
                aria-label={`${regionCount} ${regionLabel}. Click to choose which ${regionLabel} to show`}
              >
                {regionCount}
              </button>
            )}
          </div>
          {onSelectMapPreset && mapSelectOpen && (
            <div className={styles.mapSelectDropdown} role="listbox">
              {CUSTOM_MAP_MODAL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  role="option"
                  aria-selected={activePresetId === preset.id}
                  className={`${styles.mapSelectOption} ${activePresetId === preset.id ? styles.mapSelectOptionActive : ""}`}
                  onClick={() => {
                    onSelectMapPreset(preset.id);
                    setMapSelectOpen(false);
                  }}
                >
                  <span className={styles.mapSelectOptionThumb}>
                    <StaticMapThumbnail
                      map={minimalMapForPreset(preset)}
                      className={styles.presetThumbImg}
                    />
                  </span>
                  <span className={styles.mapSelectOptionLabel}>{preset.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB ROW */}
<div className={styles.tabRow}>
  <button
    type="button"
    className={`${styles.tabBtn} ${mapDataType === "choropleth" ? styles.tabActive : ""}`}
    onClick={() => handleTabClick("choropleth")}
  >
    <span className={styles.tabIcon}>▦</span>
    <span>Choropleth</span>
  </button>

  <button
    type="button"
    className={`${styles.tabBtn} ${mapDataType === "categorical" ? styles.tabActive : ""}`}
    onClick={() => handleTabClick("categorical")}
  >
    <span className={styles.tabIcon}>🏷️</span>
    <span>Categorical</span>
  </button>
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
<div className={styles.sortCard}>
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
</div>
{/* SEARCH */}
<div className={styles.searchCard}>
  <div className={styles.searchRow}>
    <span className={styles.searchIcon} aria-hidden="true">⌕</span>
    <input
      className={styles.searchInput}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder={
        selectedMap === "usa"
          ? "Search states…"
          : "Search countries…"
      }
      type="text"
      autoComplete="off"
      spellCheck={false}
    />

    {!!safeTrim(searchQuery) && (
      <button
        type="button"
        className={styles.searchClear}
        onClick={() => setSearchQuery("")}
        aria-label="Clear search"
        title="Clear"
      >
        ×
      </button>
    )}
  </div>
</div>

     
     {/* MAIN SCROLLABLE LIST */}
<div ref={listRef} className={styles.scrollableList}>
  {filteredData.map((region) => {
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
          src={
            selectedMap === "usa"
              ? getUsStateFlagUrl(region.code, 20)
              : `https://flagcdn.com/w20/${region.code.toLowerCase()}.png`
          }
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
            if (!frozenCodes) setFrozenCodes(filteredData.map((r) => r.code));
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
            if (!frozenCodes) setFrozenCodes(filteredData.map((r) => r.code));
          }}
          onChange={(e) => {
            const v = e.target.value;
            setLocalData((prev) => {
              const next = prev.map((row) =>
                row.code === region.code ? { ...row, value: v } : row
              );
              // Categorical: keep all rows (including "" for None) so parent can count unassigned
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
          {categoryOptions.map((cat) => {
            const value = typeof cat === "object" && cat != null && "id" in cat ? cat.id : cat;
            const label = typeof cat === "object" && cat != null && "name" in cat ? cat.name : String(cat);
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      )}
    </div>

    {/* ✅ BELOW ROW: placeholder / description UI only for selected row (shows imported description or user placeholder) */}
    {isSelected && (
      <div className={styles.placeholderArea}>
        {isPlaceholderOpen || (placeholders?.[code] ?? "").trim() || (region.description ?? "").trim() ? (
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
