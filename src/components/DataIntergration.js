// src/components/DataIntergration.js
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./DataIntergration.module.css";

// JSON data (keep if you use them elsewhere)
import countryCodes from "../world-countries.json";
import usStatesCodes from "../united-states.json";
import euCodes from "../european-countries.json";

// Components
import Sidebar from "./Sidebar";
import Header from "./Header";
import DataSidebar from "./DataSidebar";
import UploadDataModal from "./UploadDataModal";
import ConfirmModal from "./ConfirmModal";
import useUnsavedChangesPrompt from "../hooks/useUnsavedChangesPrompt";

// Icons, contexts, etc.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faLock, faCaretDown, faSave, faCheckCircle, faCloudArrowUp, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { SidebarContext } from "../context/SidebarContext";
import useWindowSize from "../hooks/useWindowSize";

// API calls
import { updateMap, createMap } from "../api";

// Map preview
import MapPreview from "./Map";

/** Example Color Palettes **/
const themes = [
  { name: "None", colors: Array(10).fill("#c3c3c3") },
  {
    name: "Mic Blues",
    colors: [
      "#d2e9ef",
      "#b9dbe4",
      "#a0cdd8",
      "#89bfcb",
      "#78b0bd",
      "#7aa7b7",
      "#6993a3",
      "#5b7f8d",
      "#4a6b78",
      "#385561",
    ],
  },
  {
    name: "Mic Reds",
    colors: [
      "#f9d3cf",
      "#f5a8a4",
      "#f0807c",
      "#ea5b58",
      "#e14a48",
      "#d24b4c",
      "#b94443",
      "#9f3a39",
      "#86302f",
      "#6c2625",
    ],
  },
];

/** Example Map Themes **/
const map_themes = [
  { name: "Default", ocean_color: "#ffffff", font_color: "black", unassigned_color: "#c0c0c0" },
  { name: "Muted Twilight", ocean_color: "#3D3846", font_color: "white", unassigned_color: "#5E5C64" },
];

const defaultFileStats = {
  lowestValue: null,
  lowestCountry: "",
  highestValue: null,
  highestCountry: "",
  averageValue: null,
  medianValue: null,
  standardDeviation: null,
  numberOfValues: 0,
  totalCountries: 0,
};

export default function DataIntegration({ existingMapData = null, isEditing = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();

  // Map selection (world only)
  const [selected_map] = useState("world");

  // choropleth | categorical
  const [mapDataType, setMapDataType] = useState("choropleth");

  // raw data entries
  const [data, setData] = useState([]);

  // info fields
  const [file_stats, setFileStats] = useState(existingMapData?.file_stats || defaultFileStats);
  const [description, setDescription] = useState(existingMapData?.description || "");
  const [mapTitle, setMapTitle] = useState(existingMapData?.title || "");
  const [is_public, setIsPublic] = useState(!!existingMapData?.is_public);
  const [tags, setTags] = useState(existingMapData?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);

  // ranges / groups
  const [custom_ranges, setCustomRanges] = useState(
    existingMapData?.custom_ranges || [{ id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }]
  );
  const [groups, setGroups] = useState(existingMapData?.groups || []);

  // theme/colors
  const [ocean_color, setOceanColor] = useState(existingMapData?.ocean_color || "#ffffff");
  const [unassigned_color, setUnassignedColor] = useState(existingMapData?.unassigned_color || "#c0c0c0");
  const [font_color, setFontColor] = useState(existingMapData?.font_color || "black");
  const [selected_palette, setSelectedPalette] = useState(existingMapData?.selected_palette || "None");
  const [selected_map_theme, setSelectedMapTheme] = useState(existingMapData?.selected_map_theme || "Default");

  // title & legend
  const [is_title_hidden, setIsTitleHidden] = useState(!!existingMapData?.is_title_hidden);
  const [showNoDataLegend, setShowNoDataLegend] = useState(!!existingMapData?.show_no_data_legend);
  const [titleFontSize, setTitleFontSize] = useState(existingMapData?.title_font_size ?? null);
  const [legendFontSize, setLegendFontSize] = useState(existingMapData?.legend_font_size ?? null);

  // references
  const [references, setReferences] = useState(existingMapData?.sources || []);
  const [selectedReference, setSelectedReference] = useState(null);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [tempSourceName, setTempSourceName] = useState("");
  const [tempPublicator, setTempPublicator] = useState("");
  const [tempYear, setTempYear] = useState("");
  const [tempUrl, setTempUrl] = useState("");
  const [tempNotes, setTempNotes] = useState("");

  // upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  // UI
  const [editingRangeId, setEditingRangeId] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  // leave confirm modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const pendingBlockerRef = useRef(null);
  const suppressPromptRef = useRef(false);

  // shared map <-> sidebar interaction
  const [hoveredCode, setHoveredCode] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);

  const [placeholders, setPlaceholders] = useState(existingMapData?.placeholders || {});

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);




  const normCode = (c) => (c == null ? null : String(c).trim().toUpperCase());



  // Collapse the main sidebar for small screens
  useEffect(() => {
    if (width < 1000) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [width, setIsCollapsed]);

  // If editing existing: sync map type
  useEffect(() => {
    if (!existingMapData) return;
    setMapDataType(existingMapData.map_data_type || existingMapData.mapDataType || "choropleth");
  }, [existingMapData]);

  // ✅ SINGLE source of truth: hydrate state from existingMapData (ONE effect)
  useEffect(() => {
    if (!existingMapData) {
      // create mode: keep defaults, but clear any previous edit state
      setData([]);
      setMapTitle("");
      setDescription("");
      setTags([]);
      setIsPublic(true);
      setCustomRanges([{ id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }]);
      setGroups([]);
      setOceanColor("#ffffff");
      setUnassignedColor("#c0c0c0");
      setFontColor("black");
      setSelectedPalette("None");
      setSelectedMapTheme("Default");
      setIsTitleHidden(false);
      setShowNoDataLegend(false);
      setTitleFontSize(null);
      setLegendFontSize(null);
      setReferences([]);
      setFileStats(defaultFileStats);
      setPlaceholders({});
      return;
    }

    setData(existingMapData.data || []);
    setMapTitle(existingMapData.title || "");
    setDescription(existingMapData.description || "");
    setTags(existingMapData.tags || []);
    setIsPublic(!!existingMapData.is_public);

    setCustomRanges(
      existingMapData.custom_ranges || [{ id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }]
    );

    setGroups(existingMapData.groups || []);
    setOceanColor(existingMapData.ocean_color || "#ffffff");
    setUnassignedColor(existingMapData.unassigned_color || "#c0c0c0");
    setFontColor(existingMapData.font_color || "black");
    setSelectedPalette(existingMapData.selected_palette || "None");
    setSelectedMapTheme(existingMapData.selected_map_theme || "Default");

    setIsTitleHidden(!!existingMapData.is_title_hidden);
    setShowNoDataLegend(!!existingMapData.show_no_data_legend);
    setTitleFontSize(existingMapData.title_font_size ?? null);
    setLegendFontSize(existingMapData.legend_font_size ?? null);

    setReferences(existingMapData.sources || []);
    setFileStats(existingMapData.file_stats || defaultFileStats);
    setPlaceholders(existingMapData.placeholders || {});
  }, [existingMapData?.id]); // important: use .id to avoid re-running on identity noise

  // Upload modal
  const handleOpenUploadModal = () => setShowUploadModal(true);

  const handleImportData = (parsedData, stats, importedType) => {
    if (importedType && importedType !== mapDataType) setMapDataType(importedType);

    if (importedType === "choropleth") {
      const next = parsedData.map((r) => ({
        code: String(r.code).trim().toUpperCase(),
        name: r.name,
        value: r.numericValue,
      }));
      setData(next);
      setFileStats(stats);
    }  else {
  const next = parsedData.map((r) => ({
    code: String(r.code).trim().toUpperCase(),
    name: r.name,
    value: String(r.categoryValue ?? "").trim(),
  }));

  setData(next);
  setFileStats(stats);

  // ✅ NEW: build/update groups from imported categories
  const importedCats = Array.from(
    new Set(next.map((x) => String(x.value ?? "").trim()).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  setGroups((prev) => {
    const prevArr = Array.isArray(prev) ? prev : [];
    const byName = new Map(
      prevArr.map((g) => [String(g?.name ?? "").trim(), ensureGroupShape(g)])
    );

    const merged = [...prevArr.map(ensureGroupShape)];

    for (const cat of importedCats) {
      if (!byName.has(cat)) {
        merged.push({ id: Date.now() + Math.random(), name: cat, color: "#c0c0c0" });
      }
    }

    // optional: keep table stable alphabetical
    merged.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    return merged;
  });
}

    setShowUploadModal(false);
  };

  // Palette helpers
  function applyPalette(ranges, paletteColors) {
    if (!ranges.length || !paletteColors.length) return ranges;
    const numRangesLocal = ranges.length;
    const numColors = paletteColors.length;
    const indices = [];
    if (numRangesLocal === 1) {
      indices.push(Math.floor((numColors - 1) / 2));
    } else {
      const step = (numColors - 1) / (numRangesLocal - 1);
      for (let i = 0; i < numRangesLocal; i++) indices.push(Math.round(i * step));
    }
    return ranges.map((r, i) => ({ ...r, color: paletteColors[indices[i]] || "#c0c0c0" }));
  }

  const handlePaletteChange = (e) => {
    const newPalette = e.target.value;
    setSelectedPalette(newPalette);
    const paletteColors = themes.find((t) => t.name === newPalette)?.colors || [];
    setCustomRanges((prev) => applyPalette(prev, paletteColors));
  };



  const handleThemeChange = (e) => {
    const themeName = e.target.value;
    setSelectedMapTheme(themeName);
    const found = map_themes.find((t) => t.name === themeName);
    if (found) {
      setOceanColor(found.ocean_color);
      setFontColor(found.font_color);
      setUnassignedColor(found.unassigned_color);
    }
  };

  const handleChangePlaceholder = (code, text) => {
  const C = normCode(code);
  if (!C) return;

  const nextText = String(text ?? "");

  setPlaceholders((prev) => {
    const base = prev && typeof prev === "object" ? { ...prev } : {};
    if (!nextText.trim()) delete base[C];
    else base[C] = nextText;
    return base;
  });
};


  // Ranges logic
  const handleRangeChange = (id, field, value) => {
    setCustomRanges((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const addRange = () => {
    setCustomRanges((prev) => [...prev, { id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }]);
  };

  const removeRange = (id) => {
    setCustomRanges((prev) => (prev.length > 1 ? prev.filter((r) => r.id !== id) : prev));
  };

  // ============================
// Categories (categorical)
// Source of truth: `groups`
// each group: { id, name, color }
// ============================

const ensureGroupShape = (g) => ({
  id: g?.id ?? Date.now(),
  name: String(g?.name ?? "").trim(),
  color: (g?.color ?? "#c0c0c0").toLowerCase(),
});

const addCategory = () => {
  setGroups((prev) => [
    ...(Array.isArray(prev) ? prev : []),
    { id: Date.now(), name: "", color: "#c0c0c0" },
  ]);
};

const updateCategory = (id, field, value) => {
  setGroups((prev) =>
    (Array.isArray(prev) ? prev : []).map((g) =>
      g.id === id ? { ...g, [field]: value } : g
    )
  );
};

/**
 * Rename category:
 * - updates the group name
 * - updates all data values that used the old name => new name
 */
const renameCategory = (id, newNameRaw) => {
  const newName = String(newNameRaw ?? "").trim();

  setGroups((prevGroups) => {
    const arr = (Array.isArray(prevGroups) ? prevGroups : []).map(ensureGroupShape);
    const idx = arr.findIndex((g) => g.id === id);
    if (idx === -1) return arr;

    const oldName = String(arr[idx].name ?? "").trim();
    arr[idx] = { ...arr[idx], name: newName };

    // update data values old -> new
    if (oldName && newName && oldName !== newName) {
      setData((prevData) =>
        (Array.isArray(prevData) ? prevData : []).map((d) => {
          const v = d?.value == null ? "" : String(d.value).trim();
          if (v !== oldName) return d;
          return { ...d, value: newName };
        })
      );
    }

    return arr;
  });
};


const removeCategory = (id) => {
  const removedName = (() => {
    const g = (Array.isArray(groups) ? groups : []).find((x) => x.id === id);
    return String(g?.name ?? "").trim();
  })();

  // remove from groups
  setGroups((prev) => (Array.isArray(prev) ? prev.filter((g) => g.id !== id) : []));

  // optional (recommended): clear any countries that used that category
  if (removedName) {
    setData((prev) =>
      (Array.isArray(prev) ? prev : []).map((d) => {
        const v = d?.value == null ? "" : String(d.value).trim();
        if (v !== removedName) return d;
        return { ...d, value: "" };
      })
    );
  }
};


  // Tags
  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      setTags((prev) => (prev.includes(newTag) ? prev : [...prev, newTag]));
      setTagInput("");
    }
  };
  const removeTag = (idx) => setTags((prev) => prev.filter((_, i) => i !== idx));

  // References
  const handleAddReference = () => {
    setSelectedReference(null);
    setTempSourceName("");
    setTempPublicator("");
    setTempYear("");
    setTempUrl("");
    setTempNotes("");
    setIsReferenceModalOpen(true);
  };

  const handleEditReference = (ref) => {
    setSelectedReference(ref);
    setTempSourceName(ref.sourceName);
    setTempPublicator(ref.publicator || "");
    setTempYear(ref.publicationYear);
    setTempUrl(ref.url);
    setTempNotes(ref.notes || "");
    setIsReferenceModalOpen(true);
  };

  const handleDeleteReference = () => {
    if (!selectedReference) return;
    if (window.confirm("Are you sure you want to delete this reference?")) {
      setReferences((prev) => prev.filter((x) => x !== selectedReference));
      setIsReferenceModalOpen(false);
    }
  };

  const handleSaveReference = () => {
    if (!tempSourceName.trim() || !tempYear.trim()) {
      alert("Source Name and Publication Year are required.");
      return;
    }
    if (selectedReference) {
      setReferences((prev) =>
        prev.map((ref) =>
          ref === selectedReference
            ? { ...ref, sourceName: tempSourceName, publicationYear: tempYear, publicator: tempPublicator, url: tempUrl, notes: tempNotes }
            : ref
        )
      );
    } else {
      setReferences((prev) => [
        ...prev,
        { id: Date.now(), sourceName: tempSourceName, publicationYear: tempYear, publicator: tempPublicator, url: tempUrl, notes: tempNotes },
      ]);
    }
    setIsReferenceModalOpen(false);
  };

  // ===== Data normalization =====
  function pick(obj, keys) {
    for (const k of keys) {
      if (obj && obj[k] != null && String(obj[k]).trim() !== "") return obj[k];
    }
    return null;
  }

  function toNumber(x) {
    const n = typeof x === "number" ? x : parseFloat(String(x).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  const mapDataNormalized = useMemo(() => {
    return (data || [])
      .map((d) => {
        const code = pick(d, ["code", "countryCode", "iso2", "ISO2", "Country Code", "country_code"]);
        const name = pick(d, ["name", "countryName", "Country", "country_name"]);
        const valueRaw = pick(d, ["value", "Value", "val"]);

        return {
          ...d,
          code: code ? String(code).trim().toUpperCase() : "",
          name: name ? String(name) : undefined,
          value: mapDataType === "choropleth" ? toNumber(valueRaw) : valueRaw == null ? "" : String(valueRaw),
        };
      })
      .filter((d) => d.code);
  }, [data, mapDataType]);

  // ===== Category table helpers =====
  function safeTrim(v) {
    return v == null ? "" : String(v).trim();
  }
  function countryLabel(d) {
    const n = d.name ? String(d.name).trim() : "";
    const c = d.code ? String(d.code).trim() : "";
    return (n || c).toLowerCase();
  }

const categoryRows = useMemo(() => {
  if (mapDataType !== "categorical") return [];

  const groupsArr = (Array.isArray(groups) ? groups : []).map(ensureGroupShape);

  // map category -> group metadata
  const groupByName = new Map(groupsArr.map((g) => [String(g.name).trim(), g]));

  // map category -> countries list
  const catToCountries = new Map();
  for (const d of mapDataNormalized || []) {
    const cat = safeTrim(d.value);
    if (!cat) continue;
    const list = catToCountries.get(cat) || [];
    list.push(countryLabel(d));
    catToCountries.set(cat, list);
  }

  // 1) rows for ALL defined groups (even if empty)
  const rows = groupsArr.map((g) => {
    const countries = (catToCountries.get(g.name) || []).filter(Boolean).sort((a, b) => a.localeCompare(b));
    return {
      id: g.id,
      name: g.name,
      color: g.color || "#c0c0c0",
      countries,
      count: countries.length,
      isDefined: true,
    };
  });

  // 2) also show categories that exist in data but not defined in groups (optional but helpful)
  for (const [cat, countriesRaw] of catToCountries.entries()) {
    if (groupByName.has(cat)) continue;
    const countries = countriesRaw.filter(Boolean).sort((a, b) => a.localeCompare(b));
    rows.push({
      id: `unknown:${cat}`,
      name: cat,
      color: "#c0c0c0",
      countries,
      count: countries.length,
      isDefined: false,
    });
  }

  rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  return rows;
}, [mapDataType, groups, mapDataNormalized]);


  const categoryOptions = useMemo(() => {
  const arr = Array.isArray(groups) ? groups : [];
  return arr
    .map((g) => String(g?.name ?? "").trim())
    .filter(Boolean);
}, [groups]);


 const renderCategoriesTable = () => {
  const rows = categoryRows;

  return (
    <div className={styles.section}>
      <h3>Categories</h3>

      {rows.length === 0 ? (
        <p style={{ fontStyle: "italic" }}>No categories defined or assigned yet.</p>
      ) : (
        <table className={styles.rangeTable}>
          <thead>
            <tr>
              <th>Countries</th>
              <th>Name</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => {
              const isEditingRow = String(editingCategoryId) === String(row.id);
              const canEdit = row.isDefined; // only editable if it’s an actual group

              return (
                <tr key={row.id}>
                  <td style={{ maxWidth: 380 }}>
                    {row.count ? (
                      <>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                          {row.count} countries
                        </div>
                        <div style={{ fontSize: 12, lineHeight: 1.3, wordBreak: "break-word" }}>
                          {row.countries.join(", ")}
                        </div>
                      </>
                    ) : (
                      <span style={{ fontStyle: "italic", opacity: 0.7 }}>No countries assigned</span>
                    )}
                  </td>

                  <td>
                    {isEditingRow && canEdit ? (
                      <input
                        className={styles.inputBox}
                        value={row.name}
                        onChange={(e) => updateCategory(row.id, "name", e.target.value)}
                        placeholder="Category name"
                      />
                    ) : (
                      <span>
                        {row.name}
                        {!row.isDefined && (
                          <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
                            (from data)
                          </span>
                        )}
                      </span>
                    )}
                  </td>

                  <td>
                    {isEditingRow && canEdit ? (
                      <input
                        type="color"
                        className={styles.inputBox}
                        value={row.color || "#c0c0c0"}
                        onChange={(e) => updateCategory(row.id, "color", e.target.value)}
                      />
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            background: row.color,
                            border: "1px solid rgba(0,0,0,0.2)",
                          }}
                        />
                        <span style={{ fontSize: 12, opacity: 0.8 }}>{row.color}</span>
                      </div>
                    )}
                  </td>

                  <td>
                    {canEdit ? (
                      isEditingRow ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className={styles.secondaryButton}
                            onClick={() => {
                              renameCategory(row.id, row.name);
                              setEditingCategoryId(null);
                            }}
                          >
                            Done
                          </button>
                          <button
                            className={styles.removeButton}
                            onClick={() => {
                              setEditingCategoryId(null);
                              removeCategory(row.id);
                            }}
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className={styles.secondaryButton} onClick={() => setEditingCategoryId(row.id)}>
                            Edit
                          </button>
                          <button className={styles.removeButton} onClick={() => removeCategory(row.id)}>
                            &times;
                          </button>
                        </div>
                      )
                    ) : (
                      <button
                        className={styles.secondaryButton}
                        onClick={() => {
                          // convert “from data” category into a real group
                          setGroups((prev) => [
                            ...(Array.isArray(prev) ? prev : []),
                            { id: Date.now() + Math.random(), name: row.name, color: "#c0c0c0" },
                          ]);
                        }}
                      >
                        Add to groups
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className={styles.rangeControls}>
        <button className={styles.secondaryButton} onClick={addCategory}>
          Add Category
        </button>
      </div>
    </div>
  );
};


  // ===== Ranges with countries (choropleth) =====
  const rangesWithCountries = useMemo(() => {
    const toNumLocal = (x) => {
      const n = typeof x === "number" ? x : parseFloat(String(x).replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };

    const rangesClean = (custom_ranges || []).map((r) => ({
      ...r,
      lower: toNumLocal(r.lowerBound),
      upper: toNumLocal(r.upperBound),
    }));

    const rangeCountryLabel = (d) => {
      const n = d.name ? String(d.name).trim() : "";
      const c = d.code ? String(d.code).trim() : "";
      return (n || c).toLowerCase();
    };

    const rows = rangesClean.map((r) => {
      const valid = r.lower != null && r.upper != null;
      const countries = valid
        ? (mapDataNormalized || [])
            .filter((d) => typeof d.value === "number" && d.value >= r.lower && d.value < r.upper)
            .map(rangeCountryLabel)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
        : [];

      return { ...r, countries, count: countries.length, isValidRange: valid };
    });

    rows.sort((a, b) => {
      if (a.lower == null && b.lower == null) return 0;
      if (a.lower == null) return 1;
      if (b.lower == null) return -1;
      return a.lower - b.lower;
    });

    return rows;
  }, [custom_ranges, mapDataNormalized]);

  // ============================
  // ✅ SMART Unsaved changes
  // ============================
  const initialSnapshotRef = useRef(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // stable stringify with sorted keys (prevents key-order noise)
  function stableStringify(obj) {
    const seen = new WeakSet();
    return JSON.stringify(obj, function (key, value) {
      if (value && typeof value === "object") {
        if (seen.has(value)) return;
        seen.add(value);
        if (!Array.isArray(value)) {
          return Object.keys(value)
            .sort()
            .reduce((acc, k) => {
              acc[k] = value[k];
              return acc;
            }, {});
        }
      }
      return value;
    });
  }

  function normStr(v) {
    return v == null ? "" : String(v).trim();
  }
  function normNum(v) {
    if (v === "" || v == null) return null;
    const n = typeof v === "number" ? v : parseFloat(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  }

  const buildSavePayload = () => ({
    title: mapTitle,
    description,
    tags,
    is_public,
    data: mapDataNormalized,
    map_data_type: mapDataType,
    custom_ranges,
    groups,
    selected_map,
    ocean_color,
    unassigned_color,
    font_color,
    selected_palette,
    selected_map_theme,
    file_stats,
    is_title_hidden,
    show_no_data_legend: showNoDataLegend,
    sources: references,
    titleFontSize: titleFontSize ?? null,
    legendFontSize: legendFontSize ?? null,
    placeholders
  });

  const buildComparablePayload = () => {
    const p = buildSavePayload();

    return {
      ...p,

      tags: [...(p.tags || [])].map(normStr).filter(Boolean).sort(),

      data: [...(p.data || [])]
        .map((d) => ({
          code: normStr(d.code).toUpperCase(),
          name: d.name == null ? "" : String(d.name),
          value: p.map_data_type === "choropleth" ? normNum(d.value) : normStr(d.value),
        }))
        .filter((d) => d.code)
        .sort((a, b) => a.code.localeCompare(b.code)),

      custom_ranges: [...(p.custom_ranges || [])]
        .map((r) => ({
          name: normStr(r.name),
          color: normStr(r.color).toLowerCase(),
          lowerBound: normNum(r.lowerBound),
          upperBound: normNum(r.upperBound),
        }))
        .sort((a, b) => {
          const al = a.lowerBound ?? Number.POSITIVE_INFINITY;
          const bl = b.lowerBound ?? Number.POSITIVE_INFINITY;
          if (al !== bl) return al - bl;
          const au = a.upperBound ?? Number.POSITIVE_INFINITY;
          const bu = b.upperBound ?? Number.POSITIVE_INFINITY;
          if (au !== bu) return au - bu;
          return a.name.localeCompare(b.name);
        }),

      groups: [...(p.groups || [])]
        .map((g) => ({
          name: normStr(g?.name ?? g?.category ?? g?.label),
          color: (normStr(g?.color ?? g?.hex ?? g?.fill) || "#c0c0c0").toLowerCase(),
        }))
        .filter((g) => g.name)
        .sort((a, b) => a.name.localeCompare(b.name)),

      sources: [...(p.sources || [])]
        .map((s) => ({
          sourceName: normStr(s.sourceName),
          publicationYear: normStr(s.publicationYear),
          publicator: normStr(s.publicator),
          url: normStr(s.url),
          notes: normStr(s.notes),
        }))
        .sort((a, b) => {
          const k1 = `${a.sourceName}|${a.publicationYear}|${a.url}`;
          const k2 = `${b.sourceName}|${b.publicationYear}|${b.url}`;
          return k1.localeCompare(k2);
        }),
      placeholders: Object.fromEntries(
      Object.entries(p.placeholders || {})
      .map(([k, v]) => [normStr(k).toUpperCase(), normStr(v)])
      .filter(([k, v]) => k && v) // keep only meaningful entries
),

    };
  };

  // current snapshot (AFTER buildComparablePayload exists)
  const currentSnapshot = useMemo(() => {
    return stableStringify(buildComparablePayload());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapTitle,
    description,
    tags,
    is_public,
    mapDataNormalized,
    mapDataType,
    custom_ranges,
    groups,
    selected_map,
    ocean_color,
    unassigned_color,
    font_color,
    selected_palette,
    selected_map_theme,
    file_stats,
    is_title_hidden,
    showNoDataLegend,
    references,
    titleFontSize,
    legendFontSize,
    placeholders
  ]);

  // reset hydration when switching maps/create-edit
useEffect(() => {
  suppressPromptRef.current = false;   // ✅ reset suppression on entry
  initialSnapshotRef.current = null;
  setIsHydrated(false);
  const t = setTimeout(() => setIsHydrated(true), 0);
  return () => clearTimeout(t);
}, [existingMapData?.id]);


  // set baseline once hydrated
  useEffect(() => {
    if (!isHydrated) return;
    if (initialSnapshotRef.current == null) initialSnapshotRef.current = currentSnapshot;
  }, [isHydrated, currentSnapshot]);

  const isDirty =
    isHydrated &&
    initialSnapshotRef.current != null &&
    currentSnapshot !== initialSnapshotRef.current;

  // ✅ only block if dirty AND not currently saving
  const shouldBlock = isDirty && !suppressPromptRef.current;

useUnsavedChangesPrompt(isDirty, (blocker) => {
  // ✅ If we're navigating because of a successful save, DO NOT prompt.
  if (suppressPromptRef.current) {
    blocker.proceed?.();
    return;
  }

  pendingBlockerRef.current = blocker;
  setShowLeaveModal(true);
});


useEffect(() => {
  const handler = (e) => {
    if (!isDirty) return;
    if (suppressPromptRef.current) return; // ✅ don't block during save-navigation
    e.preventDefault();
    e.returnValue = "";
  };
  window.addEventListener("beforeunload", handler);
  return () => window.removeEventListener("beforeunload", handler);
}, [isDirty]);



// ============================
// Save map (with saving modal + progress + success)
// ============================
const handleSaveMap = async () => {
  if (isSaving) return;

  const payload = {
    title: mapTitle,
    description,
    tags,
    is_public,
    data: mapDataNormalized,
    map_data_type: mapDataType,
    custom_ranges,
    groups,
    selected_map,
    ocean_color,
    unassigned_color,
    font_color,
    selected_palette,
    selected_map_theme,
    file_stats,
    is_title_hidden,
    show_no_data_legend: showNoDataLegend,
    sources: references,
    titleFontSize: titleFontSize ?? null,
    legendFontSize: legendFontSize ?? null,
    placeholders,
  };

  // open modal
  setIsSaving(true);
  setSaveSuccess(false);
  setSaveProgress(10);

  // fake progress while request is running
  let p = 10;
  const timer = setInterval(() => {
    p = Math.min(p + Math.random() * 12, 90);
    setSaveProgress(Math.round(p));
  }, 200);

  try {
    if (isEditing) await updateMap(existingMapData.id, payload);
    else await createMap(payload);

    clearInterval(timer);
    setSaveProgress(100);
    setSaveSuccess(true);

    // ✅ allow navigation without prompt
    suppressPromptRef.current = true;

    // ✅ mark as saved (baseline)
    initialSnapshotRef.current = currentSnapshot;

    // cleanup any modal/blocker
    setShowLeaveModal(false);
    pendingBlockerRef.current = null;

    // show success state briefly, then navigate
    setTimeout(() => {
      setIsSaving(false);
      navigate("/dashboard");
    }, 1200);
  } catch (err) {
    clearInterval(timer);

    // if save failed, keep protection on
    suppressPromptRef.current = false;

    setIsSaving(false);
    setSaveSuccess(false);
    setSaveProgress(0);

    console.error("❌ Save map failed:", err?.response?.data || err);
    alert(err?.response?.data?.msg || "Failed to save map (check console).");
  }
};


  // ============================
  // Render
  // ============================
  return (
    <div className={styles.layoutContainer} style={{ paddingLeft: isCollapsed ? "70px" : "250px" }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={styles.contentRow}>
        <div className={styles.leftSidebar}>
          <DataSidebar
            selectedMap={selected_map}
            mapDataType={mapDataType}
            onChangeDataType={setMapDataType}
            dataEntries={data}
            setDataEntries={setData}
            onOpenUploadModal={handleOpenUploadModal}
            hoveredCode={hoveredCode}
            selectedCode={selectedCode}
            onHoverCode={(code) => setHoveredCode(normCode(code))}
            onSelectCode={(code) => setSelectedCode(normCode(code))}
            categoryOptions={categoryOptions}
            placeholders={placeholders}
            onChangePlaceholder={handleChangePlaceholder}
          />
        </div>

        <div className={styles.rightPanel}>
          {/* Map preview */}
          <div className={styles.mapSection}>
            <div className={styles.mapBox}>
              <h4>Map Preview</h4>
              <div className={styles.mapPreview}>
                <MapPreview
                  groups={groups}
                  mapTitleValue={mapTitle}
                  custom_ranges={custom_ranges}
                  mapDataType={mapDataType}
                  ocean_color={ocean_color}
                  unassigned_color={unassigned_color}
                  data={mapDataNormalized}
                  selected_map="world"
                  font_color={font_color}
                  showNoDataLegend={showNoDataLegend}
                  is_title_hidden={is_title_hidden}
                  titleFontSize={titleFontSize}
                  legendFontSize={legendFontSize}
                  hoveredCode={hoveredCode}
                  selectedCode={selectedCode}
                  onHoverCode={(code) => setHoveredCode(normCode(code))}
                  onSelectCode={(code) => setSelectedCode(normCode(code))}
                  placeholders={placeholders}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className={styles.navSection}>
            <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} title={isEditing ? `Edit ${mapTitle}` : "Create Map"} />

            {/* Data & Ranges */}
            <div className={styles.section}>

              {mapDataType === "choropleth" ? (
                <>
                  <h3 className={styles.sectionTitle}>Ranges</h3>

                  <table className={styles.rangeTable}>
                    <thead>
                      <tr>
                        <th>Countries</th>
                        <th>Lower</th>
                        <th>Upper</th>
                        <th>Name</th>
                        <th>Color</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {rangesWithCountries.map((range) => {
                        const isEditingRow = editingRangeId === range.id;

                        return (
                          <tr key={range.id}>
                            <td style={{ maxWidth: 380 }}>
                              {range.isValidRange ? (
                                <>
                                  <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{range.count} countries</div>
                                  <div style={{ fontSize: 12, lineHeight: 1.3, wordBreak: "break-word" }}>{range.countries.join(", ")}</div>
                                </>
                              ) : (
                                <span style={{ fontStyle: "italic", opacity: 0.7 }}>Add lower/upper to see countries</span>
                              )}
                            </td>

                            <td>
                              {isEditingRow ? (
                                <input
                                  type="number"
                                  className={styles.inputBox}
                                  value={range.lowerBound}
                                  onChange={(e) => handleRangeChange(range.id, "lowerBound", e.target.value)}
                                  placeholder="Min"
                                />
                              ) : (
                                <span>{range.lower ?? ""}</span>
                              )}
                            </td>

                            <td>
                              {isEditingRow ? (
                                <input
                                  type="number"
                                  className={styles.inputBox}
                                  value={range.upperBound}
                                  onChange={(e) => handleRangeChange(range.id, "upperBound", e.target.value)}
                                  placeholder="Max"
                                />
                              ) : (
                                <span>{range.upper ?? ""}</span>
                              )}
                            </td>

                            <td>
                              {isEditingRow ? (
                                <input
                                  type="text"
                                  className={styles.inputBox}
                                  value={range.name}
                                  onChange={(e) => handleRangeChange(range.id, "name", e.target.value)}
                                  placeholder="Range Name"
                                />
                              ) : (
                                <span>{range.name || <span style={{ opacity: 0.6 }}>(unnamed)</span>}</span>
                              )}
                            </td>

                            <td>
                              {isEditingRow ? (
                                <input
                                  type="color"
                                  className={styles.inputBox}
                                  value={range.color}
                                  onChange={(e) => handleRangeChange(range.id, "color", e.target.value)}
                                />
                              ) : (
                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                  <span style={{ width: 18, height: 18, borderRadius: 4, background: range.color, border: "1px solid rgba(0,0,0,0.2)" }} />
                                  <span style={{ fontSize: 12, opacity: 0.8 }}>{range.color}</span>
                                </div>
                              )}
                            </td>

                            <td>
                              {isEditingRow ? (
                                <div style={{ display: "flex", gap: 8 }}>
                                  <button className={styles.secondaryButton} onClick={() => setEditingRangeId(null)}>
                                    Done
                                  </button>
                                  <button
                                    className={styles.removeButton}
                                    onClick={() => {
                                      setEditingRangeId(null);
                                      removeRange(range.id);
                                    }}
                                    disabled={custom_ranges.length <= 1}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ) : (
                                <div style={{ display: "flex", gap: 8 }}>
                                  <button className={styles.secondaryButton} onClick={() => setEditingRangeId(range.id)}>
                                    Edit
                                  </button>
                                  <button className={styles.removeButton} onClick={() => removeRange(range.id)} disabled={custom_ranges.length <= 1}>
                                    &times;
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  <div className={styles.rangeControls}>
                    <button className={styles.secondaryButton} onClick={addRange}>
                      Add Range
                    </button>
                  </div>
                </>
              ) : (
                renderCategoriesTable()
              )}
            </div>

{/* Map Info */}
<div className={styles.section}>
  <div className={styles.sectionHeader}>
    <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
      Map Info
    </h2>
  </div>

  <div className={styles.mapInfoGrid}>
    {/* LEFT: title + description + visibility */}
    <div className={styles.mapInfoLeft}>
      {/* Title */}
      <div className={styles.fieldBlock}>
        <label className={styles.fieldLabel}>Map Title</label>
        <input
          type="text"
          className={styles.inputBox}
          value={mapTitle}
          onChange={(e) => setMapTitle(e.target.value)}
          placeholder="Enter map title"
        />
      </div>

      {/* Description (label on top, full width, not resizable) */}
      <div className={styles.fieldBlock}>
        <label className={styles.fieldLabel}>Description</label>
        <textarea
          className={`${styles.inputBox} ${styles.descriptionFixed}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this map about?"
        />
      </div>

      {/* Visibility */}
      <div className={styles.fieldBlock}>
        <label className={styles.fieldLabel}>Visibility</label>

        <div
          className={styles.customSelectWide}
          onClick={() => setShowVisibilityOptions((v) => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setShowVisibilityOptions((v) => !v);
            }
          }}
        >
          <FontAwesomeIcon
            icon={is_public ? faGlobe : faLock}
            className={styles.visibilityIcon}
          />
          {is_public ? "Public" : "Private"}
          <FontAwesomeIcon icon={faCaretDown} className={styles.selectArrow} />

          {showVisibilityOptions && (
            <div
              className={styles.selectOptions}
              onClick={(e) => e.stopPropagation()} // ✅ prevents parent toggle from re-firing
            >
              <button
                type="button"
                className={styles.selectOption}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPublic(true);
                  setShowVisibilityOptions(false); // ✅ close on select
                }}
              >
                <FontAwesomeIcon icon={faGlobe} className={styles.visibilityIcon} />
                Public
              </button>

              <button
                type="button"
                className={styles.selectOption}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPublic(false);
                  setShowVisibilityOptions(false); // ✅ close on select
                }}
              >
                <FontAwesomeIcon icon={faLock} className={styles.visibilityIcon} />
                Private
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* RIGHT: tags + references */}
    <div className={styles.mapInfoRight}>
      {/* Tags */}
      <div className={styles.fieldBlock}>
        <label className={styles.fieldLabel}>Tags</label>

        <input
          type="text"
          className={styles.inputBox}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value.replace(/\s/g, ""))}
          onKeyDown={handleTagInputKeyDown}
          placeholder="Type a tag and press Enter"
        />

        <div className={styles.tagBoxLg}>
          {tags.length === 0 ? (
            <p className={styles.mutedText}>No tags yet.</p>
          ) : (
            tags.map((tag, i) => (
              <div key={i} className={styles.tagItem}>
                {tag}
                <button
                  className={styles.removeTagButton}
                  onClick={() => removeTag(i)}
                  type="button"
                  aria-label={`Remove tag ${tag}`}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* References */}
      <div className={styles.fieldBlock}>
        <div className={styles.rowBetween}>
          <label className={styles.fieldLabel}>References</label>
          <button
            className={styles.secondaryButton}
            onClick={handleAddReference}
            type="button"
          >
            + Add
          </button>
        </div>

        <div className={styles.referencesListLg}>
          {references.length === 0 ? (
            <p className={styles.mutedText}>No references added.</p>
          ) : (
            references.map((ref) => (
              <button
                key={ref.id}
                className={styles.referenceRowBtn}
                onClick={() => handleEditReference(ref)}
                type="button"
                title="Click to edit"
              >
                <span className={styles.referenceTitle}>{ref.sourceName}</span>
                <span className={styles.referenceMeta}>{ref.publicationYear}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Bottom actions (centered + save icon) */}
  <div className={styles.mapInfoActionsBottomCentered}>
    <button
      className={styles.cancelButton}
      type="button"
      onClick={() => navigate(-1)}
    >
      Cancel
    </button>

    <button
      className={styles.primaryButtonBig}
      type="button"
      onClick={handleSaveMap}
    >
      <FontAwesomeIcon icon={faSave} className={styles.saveIcon} />
      Save Map
    </button>
  </div>
</div>



          </div>
        </div>
      </div>

      {/* Reference Modal */}
      {isReferenceModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsReferenceModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsReferenceModalOpen(false)}>
              &times;
            </button>

            <h2>{selectedReference ? "Edit Reference" : "Add Reference"}</h2>

            <div className={styles.modalFormRow}>
              <label>Source Name:</label>
              <input type="text" value={tempSourceName} onChange={(e) => setTempSourceName(e.target.value)} />
            </div>

            <div className={styles.modalFormRow}>
              <label>Publication Year:</label>
              <input type="text" value={tempYear} onChange={(e) => setTempYear(e.target.value)} />
            </div>

            <div className={styles.modalFormRow}>
              <label>Publisher:</label>
              <input type="text" value={tempPublicator} onChange={(e) => setTempPublicator(e.target.value)} />
            </div>

            <div className={styles.modalFormRow}>
              <label>URL or Link:</label>
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                onBlur={() => {
                  if (tempUrl && !/^https?:\/\//i.test(tempUrl)) setTempUrl(`https://www.${tempUrl}`);
                }}
              />
            </div>

            <div className={styles.modalFormRow}>
              <label>Description/Notes:</label>
              <textarea rows={3} value={tempNotes} onChange={(e) => setTempNotes(e.target.value)} />
            </div>

            <div className={styles.modalBottomRow}>
              {selectedReference && (
                <span className={styles.deleteRefLink} onClick={handleDeleteReference}>
                  Delete Reference
                </span>
              )}
             <button
                className={`${styles.primaryButton} ${styles.savePrimary}`}
                type="button"
                onClick={handleSaveReference}
                disabled={isSaving}
              >
                Add reference 
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Upload Data Modal */}
      <UploadDataModal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} selectedMap={selected_map} onImport={handleImportData} />

      {/* Leave without saving */}
      <ConfirmModal
        isOpen={showLeaveModal}
        title="Leave without saving?"
        message="You have unsaved changes. If you leave now, your changes will be lost."
        cancelText="Stay"
        confirmText="Leave"
        danger
        onCancel={() => {
          setShowLeaveModal(false);
          pendingBlockerRef.current?.reset?.();
          pendingBlockerRef.current = null;
        }}
        onConfirm={() => {
          setShowLeaveModal(false);
          pendingBlockerRef.current?.proceed?.();
          pendingBlockerRef.current = null;
        }}
      />

      {/* Saving modal */}
{isSaving && (
  <div className={styles.saveModalOverlay}>
    <div className={styles.saveModalContent} onClick={(e) => e.stopPropagation()}>
      {saveSuccess ? (
        <>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.saveSuccessIcon} />
          <h3 className={styles.saveModalTitle}>Map saved!</h3>
          <p className={styles.saveModalText}>Redirecting to your dashboard…</p>
        </>
      ) : (
        <>
          <div className={styles.saveIconWrap}>
            <FontAwesomeIcon icon={faCloudArrowUp} className={styles.saveUploadIcon} />
          </div>

          <h3 className={styles.saveModalTitle}>Saving your map…</h3>
          <p className={styles.saveModalText}>This can take a few seconds.</p>

          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${saveProgress}%` }}
            />
          </div>

          <div className={styles.progressMeta}>
            <span>{saveProgress}%</span>
          </div>
        </>
      )}
    </div>
  </div>
)}

    </div>
  );
}
