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
import {
  faGlobe,
  faLock,
  faCaretDown,
  faSave,
  faCheckCircle,
  faCloudArrowUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { SidebarContext } from "../context/SidebarContext";
import useWindowSize from "../hooks/useWindowSize";

// API calls
import { updateMap, createMap } from "../api";

// Map preview
import MapPreview from "./Map";

/** Example Color Palettes **/
const themes = [
  { name: "None", colors: Array(10).fill("#c0c0c0") },
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
  { name: "Default", ocean_color: "#c0c0c0", font_color: "black", unassigned_color: "c0c0c0" },
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

const DEFAULT_RANGES = () => [
  { id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }
];

const DEFAULT_GROUPS = () => [
  { id: Date.now() + Math.random(), name: "", color: "#c0c0c0" },
];


const DEFAULT_COLOR = "#c0c0c0";

function isValidHex6(v) {
  return /^#[0-9a-f]{6}$/i.test(String(v ?? ""));
}

function clampHexInput(raw) {
  let s = String(raw ?? "");
  s = s.replace(/^#/, "");
  s = s.replace(/[^0-9a-fA-F]/g, "");
  s = s.slice(0, 6);
  return "#" + s;
}

function ColorCell({ color, onChange, styles }) {
  const colorRef = React.useRef(null);

  const [draft, setDraft] = React.useState(
    isValidHex6(color) ? color.toLowerCase() : DEFAULT_COLOR
  );

  const lastValidRef = React.useRef(
    isValidHex6(color) ? color.toLowerCase() : DEFAULT_COLOR
  );

  const isEditingRef = React.useRef(false);

  useEffect(() => {
  document.body.classList.add("scrollLocked");
  return () => document.body.classList.remove("scrollLocked");
}, []);


  React.useEffect(() => {
    const nextValid = isValidHex6(color) ? String(color).toLowerCase() : null;
    if (nextValid) lastValidRef.current = nextValid;

    if (!isEditingRef.current) {
      setDraft(nextValid || lastValidRef.current);
    }
  }, [color]);

  

  const applyLiveFromDraft = (nextDraft) => {
    const digits = nextDraft.slice(1).toLowerCase();
    if (digits.length === 0) return;

    const base = lastValidRef.current.slice(1).toLowerCase();
    const combined = (digits + "000000").slice(0, 6);

    onChange("#" + combined);
  };

  const swatchColor = isValidHex6(color)
    ? color.toLowerCase()
    : lastValidRef.current;

  return (
    <div className={styles.colorCell}>
      <input
        ref={colorRef}
        type="color"
        value={swatchColor}
        onChange={(e) => {
          const picked = String(e.target.value).toLowerCase();
          lastValidRef.current = picked;
          onChange(picked);
          setDraft(picked);
        }}
        className={styles.hiddenColorInput}
        aria-label="Pick color"
      />

      <button
        type="button"
        className={styles.swatchButton}
        onClick={() => colorRef.current?.click()}
        aria-label="Pick color"
        title="Pick color"
        style={{ background: swatchColor }}
      />

      <input
        type="text"
        className={styles.hexInput}
        value={draft}
        onFocus={() => {
          isEditingRef.current = true;
        }}
        onBlur={() => {
          isEditingRef.current = false;
          const committed = isValidHex6(color)
            ? String(color).toLowerCase()
            : lastValidRef.current;
          lastValidRef.current = committed;
          setDraft(committed);
        }}
        onChange={(e) => {
          const nextDraft = clampHexInput(e.target.value);
          setDraft(nextDraft);
          applyLiveFromDraft(nextDraft);
        }}
        maxLength={7}
        placeholder="#RRGGBB"
        spellCheck={false}
        inputMode="text"
      />
    </div>
  );
}


export default function DataIntegration({ existingMapData = null, isEditing = false , externalLoading = false,}) {
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
  const DEFAULT_GROUP = { id: Date.now(), name: "", color: "#c0c0c0" };

  const [groups, setGroups] = useState(
    (existingMapData?.groups && existingMapData.groups.length > 0)
      ? existingMapData.groups
      : [DEFAULT_GROUP]
  );

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


  const nextGroupIdRef = useRef(1);

const [loading, setLoading] = useState(true);

  const makeGroupId = () => `group_${nextGroupIdRef.current++}`;

  const normalizeGroup = (g) => ({
    id: g?.id ?? makeGroupId(),
    name: String(g?.name ?? "").trim(),
    color: (g?.color ?? "#c0c0c0").toLowerCase(),
  });


  const normCode = (c) => (c == null ? null : String(c).trim().toUpperCase());

useEffect(() => {
  setLoading(externalLoading);
}, [externalLoading]);


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
      setGroups([normalizeGroup(DEFAULT_GROUP)]);
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

const hydrated = (existingMapData.groups || []).map(normalizeGroup);
setGroups(hydrated.length ? hydrated : [normalizeGroup(DEFAULT_GROUP)]);


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
    if (importedType && importedType !== mapDataType) {
        handleChangeDataType(importedType);
      }


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
  const prevArr = (Array.isArray(prev) ? prev : []).map(normalizeGroup);

  const byName = new Map(prevArr.map((g) => [g.name, g]));

  const merged = [...prevArr];

  for (const cat of importedCats) {
    if (!byName.has(cat)) {
      merged.push(normalizeGroup({ name: cat, color: "#c0c0c0" }));
    }
  }

  merged.sort((a, b) => a.name.localeCompare(b.name));
  return merged;
});

}

    setShowUploadModal(false);
  };


  const handleChangeDataType = (nextTypeRaw) => {
  const nextType = String(nextTypeRaw || "").toLowerCase();
  if (nextType !== "choropleth" && nextType !== "categorical") return;

  setMapDataType((prevType) => {
    if (prevType === nextType) return prevType;

    // ✅ clear the "other table" so it doesn't come back with old values
    if (nextType === "categorical") {
      setCustomRanges(DEFAULT_RANGES());
      // optional but recommended: clear numeric values (so categories start clean)
      setData((prev) =>
        (Array.isArray(prev) ? prev : []).map((d) => ({
          ...d,
          value: "", // categorical expects string
        }))
      );
    }  else {
      // ✅ don't clear groups; keep them so switching back doesn't feel destructive
      setData((prev) =>
        (Array.isArray(prev) ? prev : []).map((d) => ({ ...d, value: null }))
      );
      setFileStats(defaultFileStats);
    }


        return nextType;
      });
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

const ensureGroupShape = (g) => normalizeGroup(g);


const addCategory = () => {
  setGroups((prev) => [
    ...(Array.isArray(prev) ? prev : []),
    normalizeGroup({ name: "", color: "#c0c0c0" }),
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
  // ✅ block removing the last category
  if ((Array.isArray(groups) ? groups : []).length <= 1) return;

  const removedName = (() => {
    const g = (Array.isArray(groups) ? groups : []).find((x) => x.id === id);
    return String(g?.name ?? "").trim();
  })();

  setGroups((prev) => (Array.isArray(prev) ? prev.filter((g) => g.id !== id) : []));

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
  return n || c; // ✅ keep original form
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
    <>
      {rows.length === 0 ? (
        <p className={styles.mutedText}>No categories yet.</p>
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
              const canEdit = row.isDefined;

              return (
                <tr key={row.id}>
                  <td className={styles.countriesCell}>
                    {row.count ? (
                      <>
                        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                          {row.count} countries
                        </div>
                        <div className={styles.countriesList}>
                          {row.countries.join(", ")}
                        </div>
                      </>
                    ) : (
                      <span className={styles.mutedText}>No countries assigned yet.</span>
                    )}
                  </td>

                  <td>
                    {canEdit ? (
                      <input
                        className={styles.tableInputText}
                        value={row.name}
                        onChange={(e) => updateCategory(row.id, "name", e.target.value)}
                        onBlur={(e) => renameCategory(row.id, e.target.value)}
                        placeholder="Category name"
                      />
                    ) : (
                      <span>
                        {row.name}
                        <span style={{ marginLeft: 8, fontSize: 12, opacity: 0.7 }}>
                          (from data)
                        </span>
                      </span>
                    )}
                  </td>

                  <td>
                    {canEdit ? (
                      <ColorCell
                        styles={styles}
                        color={row.color || "#c0c0c0"}
                        onChange={(next) => updateCategory(row.id, "color", next)}
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
                      <button
                        className={styles.removeButton}
                        onClick={() => removeCategory(row.id)}
                        disabled={(Array.isArray(groups) ? groups : []).length <= 1}
                        type="button"
                        aria-label="Remove category"
                        title={
                          (Array.isArray(groups) ? groups : []).length <= 1
                            ? "At least one category is required"
                            : "Remove"
                        }
                      >
                        &times;
                      </button>
                    ) : (
                      <button
                        className={styles.addRangeButton}
                        type="button"
                        onClick={() => {
                          setGroups((prev) => [
                            ...(Array.isArray(prev) ? prev : []),
                            {
                              id: `group_${Date.now()}_${Math.random()}`,
                              name: row.name,
                              color: "#c0c0c0",
                            },
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
        <button className={styles.addRangeButton} onClick={addCategory} type="button">
                      <FontAwesomeIcon icon={faPlus} />

          Add category
        </button>
      </div>
    </>
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
  return n || c; // ✅ keep original form
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

  useEffect(() => {
  if (mapDataType !== "categorical") return;

  setGroups((prev) => {
    const arr = Array.isArray(prev) ? prev : [];
    return arr.length ? arr : [normalizeGroup({ name: "", color: "#c0c0c0" })];
  });
}, [mapDataType]);


  // reset hydration when switching maps/create-edit
useEffect(() => {
  suppressPromptRef.current = false;
  initialSnapshotRef.current = null;
  setIsHydrated(false);

  // ✅ Always start in skeleton when entering create/edit
  setLoading(true);

  // ✅ After data is ready (or immediately in create mode), end skeleton AFTER a short beat
  // so it actually shows.
  const MIN_SKELETON_MS = 150;

  const t1 = setTimeout(() => {
    setIsHydrated(true);

    // If parent is still loading (EditMap fetch), keep skeleton on.
    if (!externalLoading) setLoading(false);
  }, MIN_SKELETON_MS);

  return () => clearTimeout(t1);
}, [existingMapData?.id, externalLoading]);




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
  if (loading) {
  return (
    <div className={styles.layoutContainer} style={{ paddingLeft: isCollapsed ? "70px" : "250px" }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={styles.contentRow}>
        <div className={styles.leftSidebar}>
          <div className={styles.skelBlock} style={{ height: 18, width: 160, marginBottom: 12 }} />
          <div className={styles.skelCard}>
            <div className={styles.skelLine} style={{ width: "70%" }} />
            <div className={styles.skelLine} style={{ width: "90%" }} />
            <div className={styles.skelLine} style={{ width: "85%" }} />
            <div className={styles.skelLine} style={{ width: "60%" }} />
          </div>

          <div className={styles.skelCard} style={{ marginTop: 12 }}>
            <div className={styles.skelLine} style={{ width: "50%" }} />
            <div className={styles.skelLine} style={{ width: "88%" }} />
            <div className={styles.skelLine} style={{ width: "76%" }} />
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.mapBox}>
            <div className={styles.skelBlock} style={{ height: 16, width: 120, marginBottom: 12 }} />
            <div className={styles.skelMap} />
          </div>

          <div className={styles.section}>
            <div className={styles.skelBlock} style={{ height: 16, width: 140, marginBottom: 12 }} />
            <div className={styles.skelTableRow} />
            <div className={styles.skelTableRow} />
            <div className={styles.skelTableRow} />
          </div>

          <div className={styles.section}>
            <div className={styles.skelBlock} style={{ height: 16, width: 120, marginBottom: 12 }} />
            <div className={styles.skelLine} style={{ width: "65%" }} />
            <div className={styles.skelLine} style={{ width: "95%" }} />
            <div className={styles.skelLine} style={{ width: "85%" }} />
            <div className={styles.skelLine} style={{ width: "70%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className={styles.layoutContainer} style={{ paddingLeft: isCollapsed ? "70px" : "250px" }}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div className={styles.contentRow}>
        <div className={styles.leftSidebar}>
          <DataSidebar
            selectedMap={selected_map}
            mapDataType={mapDataType}
            onChangeDataType={handleChangeDataType}
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
                  strokeMode="thick"
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
      {/* header OUTSIDE the table box */}
      <h3 className={styles.sectionTitle}>Ranges</h3>

      {/* table box ONLY wraps table + controls */}
      <div className={styles.tableBox}>
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
            {rangesWithCountries.map((range) => (
              <tr key={range.id}>
                <td style={{ maxWidth: 380 }}>
                  {range.isValidRange ? (
                    <>
                      <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                        {range.count} countries
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: 1.3,
                          wordBreak: "break-word",
                        }}
                      >
                        {range.countries.join(", ")}
                      </div>
                    </>
                  ) : (
                    <span className={styles.mutedText}>
                      Add lower/upper to see countries.
                    </span>
                  )}
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.tableInputNumber}
                    value={range.lowerBound}
                    onChange={(e) =>
                      handleRangeChange(range.id, "lowerBound", e.target.value)
                    }
                    placeholder="Min"
                    inputMode="decimal"
                  />
                </td>

                <td>
                  <input
                    type="number"
                    className={styles.tableInputNumber}
                    value={range.upperBound}
                    onChange={(e) =>
                      handleRangeChange(range.id, "upperBound", e.target.value)
                    }
                    placeholder="Max"
                    inputMode="decimal"
                  />
                </td>

                <td>
                  <input
                    type="text"
                    className={styles.tableInputText}
                    value={range.name}
                    onChange={(e) =>
                      handleRangeChange(range.id, "name", e.target.value)
                    }
                    placeholder="Range name"
                  />
                </td>

                <td>
                  <ColorCell
                    styles={styles}
                    color={range.color}
                    onChange={(next) =>
                      handleRangeChange(range.id, "color", next)
                    }
                  />
                </td>

                <td>
                  <button
                    className={styles.removeButton}
                    onClick={() => removeRange(range.id)}
                    disabled={custom_ranges.length <= 1}
                    type="button"
                    aria-label="Remove range"
                    title={
                      custom_ranges.length <= 1
                        ? "At least one range is required"
                        : "Remove"
                    }
                  >
                    &times;
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.rangeControls}>
          <button
            className={styles.addRangeButton}
            onClick={addRange}
            type="button"
          >
            <FontAwesomeIcon icon={faPlus} />
            Add range
          </button>
        </div>
      </div>
    </>
  ) : (
    <>
      {/* header OUTSIDE the table box */}
      <h3 className={styles.sectionTitle}>Categories</h3>

      {/* table box ONLY wraps table + controls */}
      <div className={styles.tableBox}>{renderCategoriesTable()}</div>
    </>
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
      className={`${styles.actionPill} ${styles.addRefPill}`}
      onClick={handleAddReference}
      type="button"
    >
      <FontAwesomeIcon icon={faPlus} />
      Add
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

              <span className={styles.referenceMetaLine}>
                <span className={styles.referenceYear}>{ref.publicationYear}</span>
                {ref.publicator ? (
                  <>
                    <span className={styles.referenceDot}>·</span>
                    <span className={styles.referencePublisher}>{ref.publicator}</span>
                  </>
                ) : null}
              </span>
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
    className={`${styles.actionPill} ${styles.cancelPill}`}
    type="button"
    onClick={() => navigate(-1)}
  >
    Cancel
  </button>

  <button
    className={`${styles.actionPill} ${styles.savePill}`}
    type="button"
    onClick={handleSaveMap}
  >
    <FontAwesomeIcon icon={faSave} />
    Save Map
  </button>
</div>

</div>



          </div>
        </div>
      </div>

     {/* Reference Modal (redesigned) */}
{isReferenceModalOpen && (
  <div
    className={styles.refModalOverlay}
    onClick={() => setIsReferenceModalOpen(false)}
    role="presentation"
  >
    <div
      className={styles.refModalCard}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ref-modal-title"
    >
      {/* Header */}
      <div className={styles.refModalHeader}>
        <div>
          <div className={styles.refModalEyebrow}>References</div>
          <h2 id="ref-modal-title" className={styles.refModalTitle}>
            {selectedReference ? "Edit reference" : "Add reference"}
          </h2>
          <p className={styles.refModalSubtitle}>
            Add a source so people know where the data comes from.
          </p>
        </div>

        <button
          type="button"
          className={styles.refModalClose}
          onClick={() => setIsReferenceModalOpen(false)}
          aria-label="Close"
          title="Close"
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className={styles.refModalBody}>
        <div className={styles.refModalGrid}>
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Source Name</label>
            <input
              type="text"
              className={styles.inputBox}
              value={tempSourceName}
              onChange={(e) => setTempSourceName(e.target.value)}
              placeholder="e.g. World Bank"
              autoFocus
            />
          </div>

          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Publication Year</label>
            <input
              type="text"
              className={styles.inputBox}
              value={tempYear}
              onChange={(e) => setTempYear(e.target.value)}
              placeholder="e.g. 2024"
              inputMode="numeric"
            />
          </div>

          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Publisher</label>
            <input
              type="text"
              className={styles.inputBox}
              value={tempPublicator}
              onChange={(e) => setTempPublicator(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>URL</label>
            <input
              type="text"
              className={styles.inputBox}
              value={tempUrl}
              onChange={(e) => setTempUrl(e.target.value)}
              placeholder="https://..."
              onBlur={() => {
                if (tempUrl && !/^https?:\/\//i.test(tempUrl)) {
                  setTempUrl(`https://www.${tempUrl}`);
                }
              }}
            />
          </div>
        </div>

        <div className={styles.fieldBlock} style={{ marginBottom: 0 }}>
          <label className={styles.fieldLabel}>Notes</label>
          <textarea
            className={`${styles.inputBox} ${styles.refModalTextarea}`}
            rows={4}
            value={tempNotes}
            onChange={(e) => setTempNotes(e.target.value)}
            placeholder="Optional context, methodology, caveats…"
          />
        </div>
      </div>

      {/* Footer */}
      <div className={styles.refModalFooter}>
        {selectedReference ? (
          <button
            type="button"
            className={`${styles.actionPill} ${styles.dangerPill}`}
            onClick={handleDeleteReference}
          >
            Delete
          </button>
        ) : (
          <span />
        )}

        <div className={styles.refModalFooterRight}>
          <button
            type="button"
            className={`${styles.actionPill} ${styles.cancelPill}`}
            onClick={() => setIsReferenceModalOpen(false)}
          >
            Cancel
          </button>

          <button
            className={`${styles.actionPill} ${styles.primaryPill}`}
            type="button"
            onClick={handleSaveReference}
            disabled={isSaving}
          >
            <FontAwesomeIcon icon={faPlus} />
            {selectedReference ? "Save reference" : "Add reference"}
          </button>
        </div>
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
  <div className={styles.saveModalOverlay} role="presentation">
    <div
      className={styles.saveModalCard}
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-modal-title"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className={styles.saveModalHeader}>
        <div>
          <div className={styles.saveModalEyebrow}>Saving</div>
          <h2 id="save-modal-title" className={styles.saveModalTitle}>
            {saveSuccess ? "Map saved!" : "Saving your map…"}
          </h2>
          <p className={styles.saveModalSubtitle}>
            {saveSuccess ? "Redirecting to your dashboard…" : "This can take a few seconds."}
          </p>
        </div>

        {/* optional close (only if you want cancel) */}
        {/* <button type="button" className={styles.saveModalClose} onClick={() => {}} aria-label="Close">
          &times;
        </button> */}
      </div>

      {/* Body */}
      <div className={styles.saveModalBody}>
        {saveSuccess ? (
          <div className={styles.saveSuccessWrap}>
            <FontAwesomeIcon icon={faCheckCircle} className={styles.saveSuccessIcon} />
          </div>
        ) : (
          <div className={styles.saveIconWrap}>
            <FontAwesomeIcon icon={faCloudArrowUp} className={styles.saveUploadIcon} />
          </div>
        )}

        {!saveSuccess && (
          <>
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
  </div>
)}


    </div>
  );
}
