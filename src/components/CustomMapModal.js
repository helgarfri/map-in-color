import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CustomMapModal.module.css";
import { REGION_PRESETS, ALL_COUNTRIES } from "../constants/regionPresets";
import StaticMapThumbnail from "./StaticMapThumbnail";

/** Build minimal map object for a preset thumbnail */
function minimalMapForPreset(preset) {
  return {
    title: "",
    ocean_color: "#c0c0c0",
    unassigned_color: "#c0c0c0",
    font_color: "black",
    is_title_hidden: true,
    show_no_data_legend: false,
    show_microstates: true,
    microstates_custom: null,
    custom_map_countries: preset.codes,
    selected_map: "world",
    groups: [],
    data: [],
    custom_ranges: [],
  };
}

export default function CustomMapModal({
  isOpen,
  selectedCodes = null,
  onSave,
  onCancel,
  /** Full list of all microstates; modal filters by selected countries */
  microstatesList = [],
  microstatesSelectedCodes = null,
  onMicrostatesSave,
  /** Preset id that was active when last saved (so it stays active when re-opening) */
  savedPresetId = null,
}) {
  const allCodes = ALL_COUNTRIES.map((c) => c.code);
  const norm = (c) => String(c).toUpperCase().trim();

  const [checked, setChecked] = useState(() => new Set(allCodes));
  const [searchQuery, setSearchQuery] = useState("");
  const [microstatesChecked, setMicrostatesChecked] = useState(() => new Set());
  const [microstatesSearchQuery, setMicrostatesSearchQuery] = useState("");
  /** Preset that is "active" (stays active even when user deselects some countries) */
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const cancelRef = useRef(null);
  const searchInputRef = useRef(null);

  const hasMicrostates = microstatesList.length > 0;

  /** Which preset (if any) matches this set of country codes exactly */
  const getPresetIdForSet = (codeSet) => {
    for (const preset of REGION_PRESETS) {
      if (preset.codes == null) {
        if (codeSet.size === allCodes.length) return preset.id;
      } else {
        if (codeSet.size !== preset.codes.length) continue;
        if (preset.codes.every((c) => codeSet.has(norm(c)))) return preset.id;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!isOpen) return;
    setSearchQuery("");
    setMicrostatesSearchQuery("");
    const codes = ALL_COUNTRIES.map((c) => c.code);
    const toSet = (arr) => new Set(arr.map((c) => norm(c)));
    let nextChecked;
    if (selectedCodes == null) {
      nextChecked = toSet(codes);
      setChecked(nextChecked);
    } else if (Array.isArray(selectedCodes)) {
      nextChecked = toSet(selectedCodes);
      setChecked(nextChecked);
    } else {
      nextChecked = toSet(codes);
      setChecked(nextChecked);
    }
    const inferredPresetId = getPresetIdForSet(nextChecked);
    const validSaved =
      savedPresetId && REGION_PRESETS.some((p) => p.id === savedPresetId)
        ? savedPresetId
        : null;
    setSelectedPresetId(validSaved ?? inferredPresetId);
    if (hasMicrostates) {
      const microCodes = microstatesList.map((m) => m.code);
      if (microstatesSelectedCodes == null || microstatesSelectedCodes.length === microCodes.length) {
        setMicrostatesChecked(new Set(microCodes));
      } else {
        setMicrostatesChecked(new Set(microstatesSelectedCodes.map((c) => String(c).toUpperCase().trim())));
      }
    }
  }, [isOpen, selectedCodes, hasMicrostates, microstatesSelectedCodes, microstatesList, savedPresetId]);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  /** Preset used for "in preset" / "outside of preset" split and for which button is active (sticky once selected) */
  const activePreset = useMemo(
    () => REGION_PRESETS.find((p) => p.id === selectedPresetId),
    [selectedPresetId]
  );

  /** Set of country codes that count as "in preset" (for ordering: show these first, then "outside of preset") */
  const inPresetSet = useMemo(() => {
    if (activePreset) {
      return activePreset.codes == null
        ? new Set(allCodes.map(norm))
        : new Set(activePreset.codes.map(norm));
    }
    return checked;
  }, [activePreset, checked, allCodes]);

  // Countries: in-preset first, then outside (both sections show all countries, split by preset)
  const countriesInPreset = useMemo(
    () => ALL_COUNTRIES.filter((c) => inPresetSet.has(norm(c.code))),
    [inPresetSet]
  );
  const countriesOutsidePreset = useMemo(
    () => ALL_COUNTRIES.filter((c) => !inPresetSet.has(norm(c.code))),
    [inPresetSet]
  );

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (c) =>
    c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
  const filteredCountriesInPreset = query ? countriesInPreset.filter(matchesQuery) : countriesInPreset;
  const filteredCountriesOutsidePreset = query ? countriesOutsidePreset.filter(matchesQuery) : countriesOutsidePreset;

  // Microstates: in-preset first (microstates whose country is in preset), then outside
  const microstatesInPreset = useMemo(
    () => microstatesList.filter((m) => inPresetSet.has(norm(m.code))),
    [microstatesList, inPresetSet]
  );
  const microstatesOutsidePreset = useMemo(
    () => microstatesList.filter((m) => !inPresetSet.has(norm(m.code))),
    [microstatesList, inPresetSet]
  );

  const microQuery = microstatesSearchQuery.trim().toLowerCase();
  const matchesMicroQuery = (m) =>
    m.name.toLowerCase().includes(microQuery) || m.code.toLowerCase().includes(microQuery);
  const filteredMicrostatesInPreset = microQuery ? microstatesInPreset.filter(matchesMicroQuery) : microstatesInPreset;
  const filteredMicrostatesOutsidePreset = microQuery ? microstatesOutsidePreset.filter(matchesMicroQuery) : microstatesOutsidePreset;

  useEffect(() => {
    if (!isOpen) return;
    cancelRef.current?.focus?.();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  const toggle = (code) => {
    const C = norm(code);
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(C)) next.delete(C);
      else next.add(C);
      return next;
    });
  };

  const toggleMicrostate = (code) => {
    setMicrostatesChecked((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const selectAll = () => setChecked(new Set(allCodes.map((c) => norm(c))));
  const deselectAll = () => setChecked(new Set());
  const microstatesSelectAll = () =>
    setMicrostatesChecked(new Set(microstatesList.map((m) => m.code)));
  const microstatesDeselectAll = () => setMicrostatesChecked(new Set());

  const applyPreset = (preset) => {
    setSelectedPresetId(preset.id);
    if (preset.codes == null) {
      setChecked(new Set(allCodes.map(norm)));
      setMicrostatesChecked(new Set(microstatesList.map((m) => m.code)));
    } else {
      const countrySet = new Set(preset.codes.map(norm));
      setChecked(countrySet);
      const microInPreset = microstatesList
        .filter((m) => countrySet.has(norm(m.code)))
        .map((m) => m.code);
      setMicrostatesChecked(new Set(microInPreset));
    }
  };

  const handleSave = () => {
    const arr = Array.from(checked);
    const isWorld = arr.length === allCodes.length;
    onSave?.(isWorld ? null : arr, selectedPresetId);
    if (hasMicrostates && onMicrostatesSave) {
      const microArr = Array.from(microstatesChecked);
      const allMicro = microArr.length === microstatesList.length;
      onMicrostatesSave(allMicro ? null : microArr);
    }
    onCancel?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      onClick={() => onCancel?.()}
      role="presentation"
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="custom-map-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="custom-map-modal-title" className={styles.title}>
            Custom map: choose countries & microstates
          </h2>
          <button
            type="button"
            className={styles.close}
            onClick={onCancel}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <p className={styles.description}>
          Select a preset or pick countries. Microstates in your selection appear on the right. Unselected areas are hidden on the map.
        </p>

        {/* Presets with thumbnails */}
        <div className={styles.presets}>
          <span className={styles.presetsLabel}>Presets:</span>
          <div className={styles.presetButtons}>
            {REGION_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`${styles.presetBtn} ${selectedPresetId === preset.id ? styles.presetBtnActive : ""}`}
                onClick={() => applyPreset(preset)}
                aria-pressed={selectedPresetId === preset.id}
              >
                <span className={styles.presetThumb}>
                  <StaticMapThumbnail
                    map={minimalMapForPreset(preset)}
                    className={styles.presetThumbImg}
                  />
                </span>
                <span className={styles.presetLabel}>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Two columns: countries left, microstates right */}
        <div className={styles.twoColumns}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Countries</h3>
            <p className={styles.columnDescription}>
              Select which countries to show on the map. 
            </p>
            <div className={styles.toolbar}>
              <button type="button" className={styles.linkBtn} onClick={selectAll}>
                Select all
              </button>
              <span className={styles.sep}>·</span>
              <button type="button" className={styles.linkBtn} onClick={deselectAll}>
                Deselect all
              </button>
            </div>
            <div className={styles.searchWrap}>
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries…"
                className={styles.searchInput}
                aria-label="Search countries"
              />
            </div>
            <div className={styles.listWrap}>
              {filteredCountriesInPreset.length === 0 && filteredCountriesOutsidePreset.length === 0 ? (
                <p className={styles.noResults}>
                  {query ? "No countries match your search." : "No countries."}
                </p>
              ) : (
                <>
                  <ul className={styles.list}>
                    {filteredCountriesInPreset.map(({ code, name }) => (
                      <li key={code} className={styles.row}>
                        <label className={styles.label}>
                          <input
                            type="checkbox"
                            checked={checked.has(norm(code))}
                            onChange={() => toggle(code)}
                            className={styles.checkbox}
                          />
                          <span className={styles.name}>{name}</span>
                          <span className={styles.code}>{code}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                  {filteredCountriesOutsidePreset.length > 0 && (
                    <>
                      <div className={styles.outsideDivider}>
                        <span className={styles.outsideDividerText}>Outside of preset</span>
                      </div>
                      <ul className={styles.list}>
                        {filteredCountriesOutsidePreset.map(({ code, name }) => (
                          <li key={code} className={styles.row}>
                            <label className={styles.label}>
                              <input
                                type="checkbox"
                                checked={checked.has(norm(code))}
                                onChange={() => toggle(code)}
                                className={styles.checkbox}
                              />
                              <span className={styles.name}>{name}</span>
                              <span className={styles.code}>{code}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {hasMicrostates && (
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>Microstates</h3>
              <p className={styles.columnDescription}>
                In your selected countries. Uncheck to hide on the map.
              </p>
              <div className={styles.toolbar}>
                <button type="button" className={styles.linkBtn} onClick={microstatesSelectAll}>
                  Select all
                </button>
                <span className={styles.sep}>·</span>
                <button type="button" className={styles.linkBtn} onClick={microstatesDeselectAll}>
                  Deselect all
                </button>
              </div>
              <div className={styles.searchWrap}>
                <input
                  type="search"
                  value={microstatesSearchQuery}
                  onChange={(e) => setMicrostatesSearchQuery(e.target.value)}
                  placeholder="Search microstates…"
                  className={styles.searchInput}
                  aria-label="Search microstates"
                />
              </div>
              <div className={styles.listWrap}>
                {filteredMicrostatesInPreset.length === 0 && filteredMicrostatesOutsidePreset.length === 0 ? (
                  <p className={styles.noResults}>
                    {microQuery ? "No microstates match your search." : "No microstates."}
                  </p>
                ) : (
                  <>
                    <ul className={styles.list}>
                      {filteredMicrostatesInPreset.map(({ code, name }) => (
                        <li key={code} className={styles.row}>
                          <label className={styles.label}>
                            <input
                              type="checkbox"
                              checked={microstatesChecked.has(code)}
                              onChange={() => toggleMicrostate(code)}
                              className={styles.checkbox}
                            />
                            <span className={styles.name}>{name}</span>
                            <span className={styles.code}>{code}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                    {filteredMicrostatesOutsidePreset.length > 0 && (
                      <>
                        <div className={styles.outsideDivider}>
                          <span className={styles.outsideDividerText}>Outside of preset</span>
                        </div>
                        <ul className={styles.list}>
                          {filteredMicrostatesOutsidePreset.map(({ code, name }) => (
                            <li key={code} className={styles.row}>
                              <label className={styles.label}>
                                <input
                                  type="checkbox"
                                  checked={microstatesChecked.has(code)}
                                  onChange={() => toggleMicrostate(code)}
                                  className={styles.checkbox}
                                />
                                <span className={styles.name}>{name}</span>
                                <span className={styles.code}>{code}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <button
            ref={cancelRef}
            type="button"
            className={styles.cancelPill}
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className={styles.primaryPill}
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
