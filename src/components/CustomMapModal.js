import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./CustomMapModal.module.css";
import {
  REGION_PRESETS,
  CUSTOM_MAP_MODAL_PRESETS,
  ALL_COUNTRIES,
  getCountryOnlyCodesInPreset,
  getMicrostateCodesInPreset,
} from "../constants/regionPresets";
import usStatesCodes from "../united-states.json";
import StaticMapThumbnail from "./StaticMapThumbnail";

/** Build minimal map object for a preset thumbnail */
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

const US_STATES_LIST = usStatesCodes.map((s) => ({ code: s.code, name: s.name }));

export default function CustomMapModal({
  isOpen,
  /** "world" | "usa" – when "usa", show states list only */
  selectedMap = "world",
  selectedCodes = null,
  onSave,
  onCancel,
  /** Full list of all microstates; modal filters by selected countries */
  microstatesList = [],
  microstatesSelectedCodes = null,
  onMicrostatesSave,
  /** Preset id that was active when last saved (so it stays active when re-opening) */
  savedPresetId = null,
  /** When true, hide preset buttons — only show country/state + microstate lists (customize selection only) */
  customizeOnly = false,
  /** Called when selection changes (for live count). (countryCodes, microstateCodesOrNull) */
  onSelectionChange = null,
}) {
  const norm = (c) => String(c).toUpperCase().trim();
  const isUsaMode = selectedMap === "usa";

  /** Microstates appear only in the right column; exclude their codes from the Countries list */
  const microstateCodeSet = useMemo(
    () => new Set(microstatesList.map((m) => norm(m.code))),
    [microstatesList]
  );

  /** Countries only (no microstates) for the left column */
  const countriesOnlyList = useMemo(
    () => ALL_COUNTRIES.filter((c) => !microstateCodeSet.has(norm(c.code))),
    [microstateCodeSet]
  );

  const allCountryCodes = useMemo(() => countriesOnlyList.map((c) => c.code), [countriesOnlyList]);

  const [checked, setChecked] = useState(() => new Set(allCountryCodes.map(norm)));
  const [searchQuery, setSearchQuery] = useState("");
  const [microstatesChecked, setMicrostatesChecked] = useState(() => new Set());
  const [microstatesSearchQuery, setMicrostatesSearchQuery] = useState("");
  /** Preset that is "active" (stays active even when user deselects some countries) */
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [saveError, setSaveError] = useState("");
  const cancelRef = useRef(null);
  const searchInputRef = useRef(null);

  const hasMicrostates = microstatesList.length > 0;

  /** Which preset (if any) matches this set of country codes exactly (countries only, no microstates). Never returns "usa". */
  const getPresetIdForSet = (codeSet) => {
    for (const preset of REGION_PRESETS) {
      if (preset.id === "usa") continue;
      const presetCountryCodes =
        preset.codes == null ? allCountryCodes : getCountryOnlyCodesInPreset(preset.id);
      const presetSet = new Set(presetCountryCodes.map(norm));
      if (codeSet.size !== presetSet.size) continue;
      if ([...presetSet].every((c) => codeSet.has(c))) return preset.id;
    }
    return null;
  };

  const allStateCodes = useMemo(() => US_STATES_LIST.map((s) => s.code), []);

  useEffect(() => {
    if (!isOpen) return;
    setSaveError("");
    setSearchQuery("");
    setMicrostatesSearchQuery("");
    const toSet = (arr) => new Set(arr.map((c) => norm(c)));
    if (isUsaMode) {
      let nextChecked;
      if (selectedCodes == null || (Array.isArray(selectedCodes) && selectedCodes.length === 0)) {
        nextChecked = new Set(allStateCodes.map(norm));
      } else if (Array.isArray(selectedCodes)) {
        nextChecked = new Set(selectedCodes.map(norm));
      } else {
        nextChecked = new Set(allStateCodes.map(norm));
      }
      setChecked(nextChecked);
      setSelectedPresetId("usa");
      return;
    }
    let nextChecked;
    if (selectedCodes == null) {
      nextChecked = new Set(allCountryCodes.map(norm));
      setChecked(nextChecked);
    } else if (Array.isArray(selectedCodes)) {
      const countryOnly = [...toSet(selectedCodes)].filter((c) => !microstateCodeSet.has(c));
      nextChecked = new Set(countryOnly);
      setChecked(nextChecked);
    } else {
      nextChecked = new Set(allCountryCodes.map(norm));
      setChecked(nextChecked);
    }
    const inferredPresetId = getPresetIdForSet(nextChecked);
    const validSaved =
      savedPresetId && CUSTOM_MAP_MODAL_PRESETS.some((p) => p.id === savedPresetId)
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
  }, [isOpen, selectedCodes, hasMicrostates, microstatesSelectedCodes, microstatesList, savedPresetId, allCountryCodes, microstateCodeSet, isUsaMode, allStateCodes]);

  useEffect(() => {
    if (isOpen) {
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  /** Preset used for "in preset" / "outside of preset" split and for which button is active (sticky once selected) */
  const activePreset = useMemo(
    () => CUSTOM_MAP_MODAL_PRESETS.find((p) => p.id === selectedPresetId),
    [selectedPresetId]
  );

  /** Set of country/microstate codes that count as "in preset" (for ordering). World preset includes all countries + all microstates. */
  const inPresetSet = useMemo(() => {
    if (isUsaMode) return new Set(allStateCodes.map(norm));
    if (activePreset && activePreset.id === "usa") return new Set();
    if (activePreset) {
      if (activePreset.codes == null) {
        return new Set([
          ...allCountryCodes.map(norm),
          ...microstatesList.map((m) => norm(m.code)),
        ]);
      }
      const countryOnly = getCountryOnlyCodesInPreset(activePreset.id);
      const microInPreset = getMicrostateCodesInPreset(activePreset.id);
      return new Set([...countryOnly.map(norm), ...microInPreset.map(norm)]);
    }
    return checked;
  }, [activePreset, checked, allCountryCodes, isUsaMode, allStateCodes, microstatesList]);

  // Countries only (no microstates): in-preset first, then outside. USA mode: use states list.
  const listForColumn = isUsaMode ? US_STATES_LIST : countriesOnlyList;
  const countriesInPreset = useMemo(
    () => listForColumn.filter((c) => inPresetSet.has(norm(c.code))),
    [listForColumn, inPresetSet]
  );
  const countriesOutsidePreset = useMemo(
    () => listForColumn.filter((c) => !inPresetSet.has(norm(c.code))),
    [listForColumn, inPresetSet]
  );

  const query = searchQuery.trim().toLowerCase();
  const matchesQuery = (c) =>
    c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query);
  const filteredCountriesInPreset = query ? countriesInPreset.filter(matchesQuery) : countriesInPreset;
  const filteredCountriesOutsidePreset = query ? countriesOutsidePreset.filter(matchesQuery) : countriesOutsidePreset;
  const showOutsidePresetLists = !(activePreset && activePreset.id !== "world");

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
    if (!isOpen || !onSelectionChange) return;
    const countryArr = Array.from(checked);
    const microArr = hasMicrostates ? Array.from(microstatesChecked) : [];
    const microOrNull =
      !hasMicrostates ? null : microArr.length === microstatesList.length ? null : microArr;
    onSelectionChange(countryArr, microOrNull);
  }, [isOpen, onSelectionChange, checked, microstatesChecked, hasMicrostates, microstatesList.length]);

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
    setSaveError("");
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(C)) next.delete(C);
      else next.add(C);
      return next;
    });
  };

  const toggleMicrostate = (code) => {
    setSaveError("");
    setMicrostatesChecked((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  const selectAll = () => {
    setSaveError("");
    if (isUsaMode) {
      setChecked(new Set(allStateCodes.map(norm)));
      return;
    }
    if (activePreset && activePreset.id !== "world" && activePreset.id !== "usa") {
      const presetCountryCodes = getCountryOnlyCodesInPreset(activePreset.id);
      setChecked(new Set(presetCountryCodes.map(norm)));
      return;
    }
    setChecked(new Set(allCountryCodes.map(norm)));
  };
  const deselectAll = () => {
    setSaveError("");
    setChecked(new Set());
  };

  const microstatesSelectAll = () =>
    {
      setSaveError("");
      if (activePreset && activePreset.id !== "world" && activePreset.id !== "usa") {
        const presetMicrostates = getMicrostateCodesInPreset(activePreset.id);
        setMicrostatesChecked(new Set(presetMicrostates.map((c) => norm(c))));
        return;
      }
      setMicrostatesChecked(new Set(microstatesList.map((m) => norm(m.code))));
    };
  const microstatesDeselectAll = () => {
    setSaveError("");
    setMicrostatesChecked(new Set());
  };

  const applyPreset = (preset) => {
    setSaveError("");
    setSelectedPresetId(preset.id);
    if (preset.id === "usa") {
      // US States is a map type, not a country selection; leave checkboxes as-is
      return;
    }
    if (preset.codes == null) {
      setChecked(new Set(allCountryCodes.map(norm)));
      setMicrostatesChecked(new Set(microstatesList.map((m) => m.code)));
    } else {
      const presetCountryCodes = getCountryOnlyCodesInPreset(preset.id);
      setChecked(new Set(presetCountryCodes.map(norm)));
      setMicrostatesChecked(new Set());
    }
  };

  const handleSave = () => {
    if (checked.size === 0) {
      setSaveError(
        isUsaMode
          ? "Select at least one state before saving."
          : "Select at least one country before saving."
      );
      return;
    }
    if (isUsaMode) {
      const arr = Array.from(checked);
      const allSelected = arr.length === allStateCodes.length;
      onSave?.(allSelected ? null : arr, "usa", null);
      onCancel?.();
      return;
    }
    if (selectedPresetId === "usa") {
      onSave?.(null, "usa", null);
      onCancel?.();
      return;
    }
    const arr = Array.from(checked);
    const microArr = hasMicrostates ? Array.from(microstatesChecked) : [];
    // "World" = all countries (171) AND all microstates (63) selected; then pass null so parent shows full list
    const allCountriesSelected = arr.length === allCountryCodes.length;
    const allMicrostatesSelected =
      !hasMicrostates || microArr.length === microstatesList.length;
    const isWorld = allCountriesSelected && allMicrostatesSelected;
    const microstatesCodes =
      !hasMicrostates ? undefined : microArr.length === microstatesList.length ? null : microArr;
    // Keep current preset (world, europe, etc.) when user has a subset so modal always shows full preset list; only use inferred or null when no preset selected
    const presetToSave = isWorld ? "world" : (selectedPresetId && selectedPresetId !== "usa" ? selectedPresetId : (getPresetIdForSet(new Set(arr)) || null));
    onSave?.(isWorld ? null : arr, presetToSave, microstatesCodes);
    if (hasMicrostates && onMicrostatesSave) {
      onMicrostatesSave(microstatesCodes == null ? null : microstatesCodes);
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
            {isUsaMode ? "Choose which states to show" : "Custom map: choose countries & microstates"}
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
          {customizeOnly
            ? (isUsaMode
                ? "Select which US states to show on the map. Unselected states are hidden."
                : "Select which countries and microstates to show. Unselected areas are hidden on the map.")
            : (isUsaMode
                ? "Select which US states to show on the map. Unselected states are hidden."
                : "Select a preset or pick countries. Microstates in your selection appear on the right. Unselected areas are hidden on the map.")}
        </p>

        {/* Presets with thumbnails (only when not customizeOnly) */}
        {!customizeOnly && !isUsaMode && (
        <div className={styles.presets}>
          <span className={styles.presetsLabel}>Presets:</span>
          <div className={styles.presetButtons}>
            {CUSTOM_MAP_MODAL_PRESETS.map((preset) => (
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
        )}

        {/* One column (USA) or two columns: countries left, microstates right (world) */}
        <div className={styles.twoColumns}>
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>{isUsaMode ? "States" : "Countries"}</h3>
            <p className={styles.columnDescription}>
              {isUsaMode ? "Select which states to show on the map." : "Select which countries to show on the map."}
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
                placeholder={isUsaMode ? "Search states…" : "Search countries…"}
                className={styles.searchInput}
                aria-label={isUsaMode ? "Search states" : "Search countries"}
              />
            </div>
            <div className={styles.listWrap}>
              {filteredCountriesInPreset.length === 0 &&
              (showOutsidePresetLists ? filteredCountriesOutsidePreset.length === 0 : true) ? (
                <p className={styles.noResults}>
                  {query ? (isUsaMode ? "No states match your search." : "No countries match your search.") : (isUsaMode ? "No states." : "No countries.")}
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
                  {showOutsidePresetLists && filteredCountriesOutsidePreset.length > 0 && (
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

          {!isUsaMode && hasMicrostates && (
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
                {filteredMicrostatesInPreset.length === 0 &&
                (showOutsidePresetLists ? filteredMicrostatesOutsidePreset.length === 0 : true) ? (
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
                    {showOutsidePresetLists && filteredMicrostatesOutsidePreset.length > 0 && (
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
          {saveError ? (
            <div className={styles.saveError} role="alert" aria-live="polite">
              {saveError}
            </div>
          ) : null}
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
