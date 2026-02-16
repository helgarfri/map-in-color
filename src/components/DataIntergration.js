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

import { createPortal } from "react-dom";
import { BiDownload } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";

import DownloadOptionsModal from "./DownloadOptionsModal";
import { deleteMap } from "../api";
import { UserContext } from "../context/UserContext";
import { getAnonId } from "../utils/annonId";


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

// ============================
// ✅ Base color palette (choropleth)
// ============================

const BASE_SWATCHES = [
  { key: "cyan",    name: "Cyan",    hex: "#14a9af" },
  { key: "azure",   name: "Azure",   hex: "#28a8e1" },
  { key: "orange",  name: "Orange",  hex: "#fc861d" },
  { key: "magenta", name: "Magenta", hex: "#ce2292" },
];

// tiny color utils
function hexToRgb(hex) {
  const s = String(hex || "").replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  const r = parseInt(s.slice(0, 2), 16);
  const g = parseInt(s.slice(2, 4), 16);
  const b = parseInt(s.slice(4, 6), 16);
  return { r, g, b };
}
function rgbToHex({ r, g, b }) {
  const clamp = (x) => Math.max(0, Math.min(255, Math.round(x)));
  const to2 = (x) => clamp(x).toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`.toLowerCase();
}
function mixRgb(a, b, t) {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
  };
}

// Generate a light->deep ramp based on base color.
// - low end: mix toward white
// - high end: slightly deepen by mixing toward a darkened base
function rampFromBase(baseHex, steps, opts = {}) {
  const base = hexToRgb(baseHex);
  if (!base || steps <= 0) return Array(Math.max(steps, 0)).fill("#c0c0c0");

  const white = { r: 255, g: 255, b: 255 };

  // dark target: mix base toward black a bit (keeps hue)
  const blackish = { r: 0, g: 0, b: 0 };
  const darkTarget = mixRgb(base, blackish, 0.28); // tweak depth

  const arr = [];
  const reverse = !!opts.reverse;

  for (let i = 0; i < steps; i++) {
    const t = steps === 1 ? 1 : i / (steps - 1); // 0..1
    // lightness curve: give more resolution to lighter colors
    const eased = Math.pow(t, 1.15);

    // 0..~0.55: from white to base
    // ~0.55..1: from base to darkTarget
    let c;
    if (eased <= 0.55) {
      const tt = eased / 0.55;
      c = mixRgb(white, base, tt);
    } else {
      const tt = (eased - 0.55) / 0.45;
      c = mixRgb(base, darkTarget, tt);
    }

    arr.push(rgbToHex(c));
  }

  return reverse ? arr.slice().reverse() : arr;
}

// Apply a ramp to your current ranges (sorted low->high)
function applyColorsToRanges(ranges, colors) {
  if (!Array.isArray(ranges) || ranges.length === 0) return ranges;

  // stable low->high ordering by lowerBound (fallback keep order)
  const toNum = (x) => {
    const n = typeof x === "number" ? x : parseFloat(String(x ?? "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  const withIdx = ranges.map((r, idx) => ({
    r,
    idx,
    lo: toNum(r.lowerBound),
  }));

  withIdx.sort((a, b) => {
    const al = a.lo ?? Number.POSITIVE_INFINITY;
    const bl = b.lo ?? Number.POSITIVE_INFINITY;
    if (al !== bl) return al - bl;
    return a.idx - b.idx;
  });

  const out = ranges.map((r) => ({ ...r }));
  const n = withIdx.length;

  for (let i = 0; i < n; i++) {
    const targetIndex = withIdx[i].idx;
    out[targetIndex].color = colors[i] || out[targetIndex].color || "#c0c0c0";
  }

  return out;
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
  const [showGenerateRangesModal, setShowGenerateRangesModal] = useState(false);
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

const { authToken, profile, isPro } = useContext(UserContext);
const isUserLoggedIn = !!authToken && !!profile;

// download modal
const [showDownloadModal, setShowDownloadModal] = useState(false);

// delete modal
const [showDeleteMapModal, setShowDeleteMapModal] = useState(false);
const [isDeletingMap, setIsDeletingMap] = useState(false);
const [deleteMapError, setDeleteMapError] = useState(null);

const [showDeleteReferenceModal, setShowDeleteReferenceModal] = useState(false);

// custom base-color modal
const [isBasePaletteModalOpen, setIsBasePaletteModalOpen] = useState(false);
const [customBaseColor, setCustomBaseColor] = useState("#14a9af");
const [customReverse, setCustomReverse] = useState(false);

const [savedMapId, setSavedMapId] = useState(existingMapData?.id ?? null);

const [uploadSession, setUploadSession] = useState({
  fileName: "",
  terminalLines: [],
  fileIsValid: null,
  isParsing: false,
  errors: [],
  mapDataType: null,
  parsedData: [],
  universalRows: [],
  canManualSwitch: false,
  numericStats: null,
  categoricalStats: null,
});

const [lastSavedAt, setLastSavedAt] = useState(existingMapData?.updated_at ?? null);


  const makeGroupId = () => `group_${nextGroupIdRef.current++}`;

const normalizeGroup = (g) => ({
  id: g?.id ?? makeGroupId(),
  // ✅ DO NOT trim while editing (controlled input needs raw text)
  name: String(g?.name ?? ""),
  color: (g?.color ?? "#c0c0c0").toLowerCase(),
});


  const hasExistingUserRanges = useMemo(() => {
  const arr = Array.isArray(custom_ranges) ? custom_ranges : [];
  return arr.some((r) => {
    const lo = String(r?.lowerBound ?? "").trim();
    const hi = String(r?.upperBound ?? "").trim();
    return lo !== "" || hi !== "";
  });
}, [custom_ranges]);

  const normCode = (c) => (c == null ? null : String(c).trim().toUpperCase());

useEffect(() => {
  setLoading(externalLoading);
}, [externalLoading]);

useEffect(() => {
  setLastSavedAt(existingMapData?.updated_at ?? null);
}, [existingMapData?.id]);

const [timeTick, setTimeTick] = useState(0);
useEffect(() => {
  const t = setInterval(() => setTimeTick((x) => x + 1), 30000);
  return () => clearInterval(t);
}, []);




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



async function confirmDeleteMap() {
  if (isDeletingMap) return;

  const mapId = existingMapData?.id ?? savedMapId;
  if (!mapId) {
    setDeleteMapError("Missing map id. Save the map first, then try deleting.");
    return;
  }

  setIsDeletingMap(true);
  setDeleteMapError(null);

  try {
    await deleteMap(mapId);

    // close modal
    setShowDeleteMapModal(false);

    // navigate away
    navigate("/your-maps"); // change if needed
  } catch (err) {
    console.error(err);
    setDeleteMapError(err?.response?.data?.msg || "Delete failed. Please try again.");
  } finally {
    setIsDeletingMap(false);
  }
}

function cancelDeleteMap() {
  if (isDeletingMap) return;
  setShowDeleteMapModal(false);
  setDeleteMapError(null);
}



  // Upload modal
  const handleOpenUploadModal = () => setShowUploadModal(true);

const handleImportData = (parsedData, stats, importedType) => {
  const type = String(importedType || mapDataType || "").toLowerCase();
  const nextType = type === "categorical" ? "categorical" : "choropleth";

  // switch type if needed
  if (nextType !== mapDataType) {
    handleChangeDataType(nextType);
  }

  const rows = Array.isArray(parsedData) ? parsedData : [];

  // helpers
  const cleanCode = (c) => String(c ?? "").trim().toUpperCase();
  const toNumberSafe = (x) => {
    const n = typeof x === "number" ? x : parseFloat(String(x ?? "").trim().replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  if (nextType === "choropleth") {
    // ✅ keep only rows with a code + a valid number
    const cleaned = [];
    for (const r of rows) {
      const code = cleanCode(r?.code);
      if (!code) continue;

      const value = toNumberSafe(r?.numericValue);
      if (value == null) continue; // ignore invalid numeric line

      cleaned.push({
        code,
        name: r?.name,
        value,
      });
    }

    // ✅ dedupe by code (last one wins)
    const byCode = new Map();
    for (const row of cleaned) byCode.set(row.code, row);

    setData(Array.from(byCode.values()));
    setFileStats(stats || defaultFileStats);
  } else {
    // ✅ categorical: keep rows with code; value can be "" (unassigned)
    const cleaned = [];
    for (const r of rows) {
      const code = cleanCode(r?.code);
      if (!code) continue;

      const value = String(r?.categoryValue ?? "").trim();

      cleaned.push({
        code,
        name: r?.name,
        value,
      });
    }

    // ✅ dedupe by code (last one wins)
    const byCode = new Map();
    for (const row of cleaned) byCode.set(row.code, row);

    const next = Array.from(byCode.values());
    setData(next);
    setFileStats(stats || defaultFileStats);

    // ✅ build/update groups from imported categories (non-empty only)
      const importedCats = Array.from(
        new Set(next.map((x) => String(x.value ?? "").trim()).filter(Boolean))
      );


    setGroups((prev) => {
      const prevArr = (Array.isArray(prev) ? prev : []).map(normalizeGroup);

// use trimmed keys for matching, but DO NOT reorder
const keyOf = (s) => String(s ?? "").trim();
const byName = new Map(prevArr.map((g) => [keyOf(g.name), g]));

const merged = [...prevArr];

for (const cat of importedCats) {
  const k = keyOf(cat);
  if (!k) continue;
  if (!byName.has(k)) {
    merged.push(normalizeGroup({ name: cat, color: "#c0c0c0" }));
    byName.set(k, true);
  }
}

return merged;

    });
  }

  setShowUploadModal(false);
};

const applyBaseColorPalette = (baseHex, opts = {}) => {
  if (mapDataType !== "choropleth") return;

  setCustomRanges((prev) => {
    const steps = Array.isArray(prev) ? prev.length : 0;
    const ramp = rampFromBase(baseHex, steps, opts);
    return applyColorsToRanges(prev, ramp);
  });
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


    function formatTimeAgo(iso) {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";

  const diff = Date.now() - t;
  if (diff < 0) return "just now";

  const s = Math.floor(diff / 1000);
  if (s < 5) return "just now";
  if (s < 60) return `${s}s ago`;

  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;

  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;

  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;

  // fallback for older stuff
  return new Date(t).toLocaleDateString();
}


  // ============================
// ✅ Auto-generate ranges (choropleth)
// ============================

// quantile helper (0..1)
function quantileSorted(sorted, q) {
  if (!sorted.length) return null;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  if (sorted[base + 1] == null) return sorted[base];
  return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
}

// “nice” step for human-friendly bounds
function niceStep(rawStep) {
  if (!Number.isFinite(rawStep) || rawStep <= 0) return 1;
  const exp = Math.floor(Math.log10(rawStep));
  const f = rawStep / Math.pow(10, exp); // 1..10
  let nf;
  if (f <= 1) nf = 1;
  else if (f <= 2) nf = 2;
  else if (f <= 5) nf = 5;
  else nf = 10;
  return nf * Math.pow(10, exp);
}

// nice rounding to multiples of step
function floorToStep(x, step) {
  return Math.floor(x / step) * step;
}
function ceilToStep(x, step) {
  return Math.ceil(x / step) * step;
}

// format for range labels
function fmt(n) {
  if (!Number.isFinite(n)) return "";
  // keep it readable; you can tweak if you want more/less precision
  const abs = Math.abs(n);
  if (abs >= 1000) return String(Math.round(n));
  if (abs >= 10) return String(Number(n.toFixed(1)));
  return String(Number(n.toFixed(2)));
}
const onClickGenerateRanges = () => {
  // if user already entered bounds, warn them
  if (hasExistingUserRanges) {
    setShowGenerateRangesModal(true);
    return;
  }

  // otherwise just generate
  generateRangesFromData();
};

const generateRangesFromData = () => {
  if (mapDataType !== "choropleth") return;

  // grab numeric values
  const values = (mapDataNormalized || [])
    .map((d) => (typeof d.value === "number" ? d.value : null))
    .filter((v) => Number.isFinite(v));

  if (values.length < 2) {
    alert("Not enough numeric data to generate ranges.");
    return;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const range = max - min;

  if (!Number.isFinite(range) || range <= 0) {
    // all values equal (or basically equal)
    const single = [
      {
        id: Date.now(),
        color: "#c0c0c0",
        name: `= ${fmt(min)}`,
        lowerBound: min,
        upperBound: min + 1, // arbitrary, but avoids upper==lower
      },
    ];
    setCustomRanges(single);
    setCustomRanges((prev) => applyPalette(prev, themes.find((t) => t.name === selected_palette)?.colors || []));
    return;
  }

  // Freedman–Diaconis bin count (good for “spread + amount of data”)
  const q1 = quantileSorted(sorted, 0.25);
  const q3 = quantileSorted(sorted, 0.75);
  const iqr = (q3 != null && q1 != null) ? (q3 - q1) : 0;

  // If iqr is 0 (tons of duplicates) FD breaks; we’ll fallback to quantile bins
  const fdWidth =
    iqr > 0 ? (2 * iqr) / Math.cbrt(n) : null;

  let kFD =
    fdWidth && fdWidth > 0 ? Math.ceil(range / fdWidth) : null;

  // Sturges as a sanity check baseline
  const kSturges = Math.ceil(Math.log2(n) + 1);

  // Choose k with clamps (keeps UI sane)
  // you can tweak min/max if you want
  const K_MIN = 3;
  const K_MAX = 9;

  let k = kFD && Number.isFinite(kFD) ? kFD : kSturges;
  k = Math.max(K_MIN, Math.min(K_MAX, k));

  // Decide strategy:
  // - If tons of repeated values or iqr==0 => quantile bins (balanced counts)
  // - Otherwise => equal-width "nice step" bins
  const uniqueCount = new Set(sorted.map((x) => String(x))).size;
  const useQuantiles = iqr <= 0 || uniqueCount < k * 2;

  let edges = [];

  if (useQuantiles) {
    // Quantile edges: 0, 1/k, 2/k, ..., 1
    edges = [min];
    for (let i = 1; i < k; i++) {
      const qi = quantileSorted(sorted, i / k);
      edges.push(qi);
    }
    edges.push(max);

    // Ensure edges are non-decreasing & remove tiny duplicates
    edges = edges
      .map((x) => (Number.isFinite(x) ? x : null))
      .filter((x) => x != null);

    // if quantiles collapse too much, fallback to equal width
    const distinctEdges = Array.from(new Set(edges.map((x) => x.toFixed(12)))).length;
    if (distinctEdges < 3) {
      edges = []; // force fallback below
    }
  }

  if (!edges.length) {
    // Equal width with "nice" step
    const rawStep = range / k;
    const step = niceStep(rawStep);

    const start = floorToStep(min, step);
    const end = ceilToStep(max, step);

    edges = [];
    for (let x = start; x <= end + step * 0.5; x += step) {
      edges.push(x);
      if (edges.length > 100) break; // safety
    }

    // ensure last edge covers max
    if (edges[edges.length - 1] < max) {
      edges.push(edges[edges.length - 1] + step);
    }
  }

  // build ranges: [edge[i], edge[i+1])
  const nextRanges = [];
  const EPS = range / 1e9; // tiny epsilon to ensure last upper covers max

  for (let i = 0; i < edges.length - 1; i++) {
    let lo = edges[i];
    let hi = edges[i + 1];

    if (!Number.isFinite(lo) || !Number.isFinite(hi)) continue;
    if (hi < lo) [lo, hi] = [hi, lo];

    // avoid zero-width bins
    if (hi === lo) continue;

    // last bin: push upper a hair so max falls inside (< upper)
    const isLast = i === edges.length - 2;
    const upper = isLast ? hi + EPS : hi;

    nextRanges.push({
      id: Date.now() + i,
      color: "#c0c0c0",
      name: `${fmt(lo)} – ${fmt(hi)}`,
      lowerBound: lo,
      upperBound: upper,
    });
  }

  if (!nextRanges.length) {
    alert("Could not generate ranges from this data.");
    return;
  }

  // set + apply palette
  const paletteColors =
    themes.find((t) => t.name === selected_palette)?.colors || [];

  setCustomRanges(applyPalette(nextRanges, paletteColors));
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
  setCustomRanges((prev) =>
    (Array.isArray(prev) ? prev : []).map((r) =>
      r.id === id ? { ...r, [field]: value } : r
    )
  );
};

const commitRangeBound = (id, field, value) => {
  setCustomRanges((prev) => {
    const next = (Array.isArray(prev) ? prev : []).map((r) =>
      r.id === id ? { ...r, [field]: value } : r
    );

    // ✅ sort ONLY when user leaves the input
    return sortRangesStable(next);
  });
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
  const newName = String(newNameRaw ?? "").trim(); // ✅ trim only on blur

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

    // ✅ sort ONLY when user commits (blur)
    return arr; // ✅ keep order, no sorting

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
  setShowDeleteReferenceModal(true);
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
  return d?.code ? String(d.code).trim().toUpperCase() : "";
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

  return rows;
}, [mapDataType, groups, mapDataNormalized]);




  const categoryOptions = useMemo(() => {
  const arr = Array.isArray(groups) ? groups : [];
  return arr
    .map((g) => String(g?.name ?? "").trim())
    .filter(Boolean);
}, [groups]);

function toSortableNum(v) {
  // keep raw strings in state, but sort using a "best effort" parse
  const s = String(v ?? "").trim();
  if (!s) return null;

  // allow comma decimals
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function sortRangesStable(arr) {
  const withIdx = arr.map((r, idx) => ({
    r,
    idx,
    lo: toSortableNum(r.lowerBound),
    hi: toSortableNum(r.upperBound),
  }));

  withIdx.sort((a, b) => {
    const al = a.lo ?? Number.POSITIVE_INFINITY;
    const bl = b.lo ?? Number.POSITIVE_INFINITY;
    if (al !== bl) return al - bl;

    const ah = a.hi ?? Number.POSITIVE_INFINITY;
    const bh = b.hi ?? Number.POSITIVE_INFINITY;
    if (ah !== bh) return ah - bh;

    // stable fallback (prevents jitter when equal)
    return a.idx - b.idx;
  });

  return withIdx.map((x) => x.r);
}


function sortGroupsByName(arr) {
  const clean = (x) => String(x ?? "").trim().toLowerCase();
  return [...arr].sort((a, b) => {
    const an = clean(a.name);
    const bn = clean(b.name);

    // empty names at bottom
    if (!an && !bn) return 0;
    if (!an) return 1;
    if (!bn) return -1;

    return an.localeCompare(bn);
  });
}



const renderCategoriesTable = () => {
  const rows = categoryRows;

  return (
    <>
      {rows.length === 0 ? (
        <p className={styles.mutedText}>No categories yet.</p>
      ) : (
     <table className={`${styles.rangeTable} ${styles.rangeTableCat}`}>

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

<div className={styles.countriesChips} aria-label="Countries">
  {row.countries.map((c) => {
    const code = normCode(c);
    const isHovered = hoveredCode && normCode(hoveredCode) === code;
    const isSelected = selectedCode && normCode(selectedCode) === code;

    return (
      <span
        key={code}
        className={[
          styles.countryChip,
          isHovered ? styles.countryChipHovered : "",
          isSelected ? styles.countryChipSelected : "",
        ].join(" ")}
        title={code}
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHoveredCode(code)}
        onMouseLeave={() => setHoveredCode(null)}
        onClick={() => setSelectedCode(code)}
      >
        {code}
      </span>
    );
  })}
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
const rangeCountryLabel = (d) =>
  d?.code ? String(d.code).trim().toUpperCase() : "";


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
  let res;
  if (isEditing) {
    res = await updateMap(existingMapData.id, payload);
    setSavedMapId(existingMapData.id);
  } else {
    res = await createMap(payload);
    const newId =
      res?.data?.id ||
      res?.data?.map?.id ||
      res?.data?.createdMap?.id ||
      res?.data?.mapId;

    if (newId) setSavedMapId(newId);
  }

  const serverUpdatedAt =
    res?.data?.updated_at ||
    res?.data?.map?.updated_at ||
    res?.data?.updatedAt ||
    null;

  setLastSavedAt(serverUpdatedAt || new Date().toISOString());

  clearInterval(timer);
  setSaveProgress(100);
  setSaveSuccess(true);

  initialSnapshotRef.current = currentSnapshot;

  setShowLeaveModal(false);
  pendingBlockerRef.current = null;

} catch (err) {
  clearInterval(timer);
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
       <table className={`${styles.rangeTable} ${styles.rangeTableChoro}`}>

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
    return (
      <tr key={range.id}>
        <td className={styles.countriesCell}>
          {range.isValidRange ? (
            <>
              <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                {range.count} countries
              </div>

       <div className={styles.countriesChips} aria-label="Countries">
  {range.countries.map((c) => {
    const code = normCode(c);
    const isHovered = hoveredCode && normCode(hoveredCode) === code;
    const isSelected = selectedCode && normCode(selectedCode) === code;

    return (
      <span
        key={code}
        className={[
          styles.countryChip,
          isHovered ? styles.countryChipHovered : "",
          isSelected ? styles.countryChipSelected : "",
        ].join(" ")}
        title={code}
        role="button"
        tabIndex={0}
        onMouseEnter={() => setHoveredCode(code)}
        onMouseLeave={() => setHoveredCode(null)}
        onClick={() => setSelectedCode(code)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setSelectedCode(code);
          }
        }}
      >
        {code}
      </span>
    );
  })}
</div>


            </>
          ) : (
            <span className={styles.mutedText}>Add lower/upper to see countries.</span>
          )}
        </td>

        <td>
         <input
            type="number"
            className={styles.tableInputNumber}
            value={range.lowerBound}
            onChange={(e) => handleRangeChange(range.id, "lowerBound", e.target.value)}
            onBlur={(e) => commitRangeBound(range.id, "lowerBound", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur(); // ✅ commit + sort
            }}
            placeholder="Min"
            inputMode="decimal"
          />

        </td>

        <td>
         <input
            type="number"
            className={styles.tableInputNumber}
            value={range.upperBound}
            onChange={(e) => handleRangeChange(range.id, "upperBound", e.target.value)}
            onBlur={(e) => commitRangeBound(range.id, "upperBound", e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur(); // ✅ commit + sort
            }}
            placeholder="Max"
            inputMode="decimal"
          />

        </td>

        <td>
          <input
            type="text"
            className={styles.tableInputText}
            value={range.name}
            onChange={(e) => handleRangeChange(range.id, "name", e.target.value)}
            placeholder="Range name"
          />
        </td>

        <td>
          <ColorCell
            styles={styles}
            color={range.color}
            onChange={(next) => handleRangeChange(range.id, "color", next)}
          />
        </td>

        <td>
          <button
            className={styles.removeButton}
            onClick={() => removeRange(range.id)}
            disabled={custom_ranges.length <= 1}
            type="button"
            aria-label="Remove range"
            title={custom_ranges.length <= 1 ? "At least one range is required" : "Remove"}
          >
            &times;
          </button>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>

<div className={styles.rangeControls}>
  <button className={styles.addRangeButton} onClick={addRange} type="button">
    <FontAwesomeIcon icon={faPlus} />
    Add range
  </button>

<button
  className={styles.addRangeButton}
  type="button"
  onClick={onClickGenerateRanges}
  disabled={
    mapDataType !== "choropleth" ||
    (mapDataNormalized || []).filter((d) => typeof d.value === "number").length < 2
  }
  title="Automatically create ranges based on your current values"
>
  Generate ranges
</button>


  {/* ✅ Base palette strip */}
  <div className={styles.basePaletteStrip} aria-label="Base palette">
    <span className={styles.basePaletteLabel}>Base</span>

    {BASE_SWATCHES.map((s) => (
      <button
        key={s.key}
        type="button"
        className={styles.baseSwatchBtn}
        title={`${s.name} (${s.hex})`}
        onClick={() => applyBaseColorPalette(s.hex)}
      >
        <span className={styles.baseSwatchDot} style={{ background: s.hex }} />
      </button>
    ))}

    <button
      type="button"
      className={styles.baseCustomBtn}
      onClick={() => {
        setCustomBaseColor("#14a9af");
        setCustomReverse(false);
        setIsBasePaletteModalOpen(true);
      }}
      title="Choose a custom base color"
    >
      Custom…
    </button>
  </div>
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

{/* Bottom actions */}
<div className={styles.mapInfoActionsBottom}>
  {/* LEFT */}
  <div className={styles.actionsLeft}>
    <button
      type="button"
      className={`${styles.actionPill} ${styles.dangerPill}`}
      onClick={() => setShowDeleteMapModal(true)}
      disabled={!isEditing && !savedMapId}
    >
      <FaTrash />
      Delete map
    </button>
  </div>

  {/* CENTER */}
  <div className={styles.actionsCenter}>
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
      disabled={isSaving}
    >
      <FontAwesomeIcon icon={faSave} />
      Save Map
    </button>
  </div>

  {/* RIGHT */}
  <div className={styles.actionsMeta} title={lastSavedAt ? new Date(lastSavedAt).toLocaleString() : ""}>
    <span className={styles.actionsMetaLabel}>Last saved</span>
    <span className={styles.actionsMetaDot}>·</span>
    <span className={styles.actionsMetaValue}>
      {formatTimeAgo(lastSavedAt)}
      {/* force re-render for "time ago" updates if you added the tick */}
      {timeTick ? null : null}
    </span>
  </div>
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

      <UploadDataModal
  isOpen={showUploadModal}
  onClose={() => setShowUploadModal(false)}
  selectedMap={selected_map}
  onImport={handleImportData}
  session={uploadSession}
  setSession={setUploadSession}
/>

<ConfirmModal
  isOpen={showGenerateRangesModal}
  title="Replace existing ranges?"
  message="You already have ranges with lower/upper bounds set. Generating new ranges will overwrite your current ranges."
  cancelText="Cancel"
  confirmText="Generate"
  danger
  onCancel={() => setShowGenerateRangesModal(false)}
  onConfirm={() => {
    setShowGenerateRangesModal(false);
    generateRangesFromData();
  }}
/>

<ConfirmModal
  isOpen={showDeleteMapModal}
  title="Delete map?"
  message={
    <div>
      This will permanently delete <b>{mapTitle || "this map"}</b>.
      <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
        This can’t be undone.
      </div>

      {deleteMapError ? (
        <div style={{ marginTop: 10, fontSize: 12, color: "#b00020" }}>
          {deleteMapError}
        </div>
      ) : null}
    </div>
  }
  cancelText="Cancel"
  confirmText={isDeletingMap ? "Deleting..." : "Delete"}
  danger
  onCancel={cancelDeleteMap}
  onConfirm={confirmDeleteMap}
/>


<ConfirmModal
  isOpen={showDeleteReferenceModal}
  title="Delete reference?"
  message={
    selectedReference ? (
      <div>
        This will remove <b>{selectedReference.sourceName}</b> from your map.
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.75 }}>
          This can’t be undone.
        </div>
      </div>
    ) : (
      "This can’t be undone."
    )
  }
  cancelText="Cancel"
  confirmText="Delete"
  danger
  onCancel={() => setShowDeleteReferenceModal(false)}
  onConfirm={() => {
    if (!selectedReference) return;

    setReferences((prev) => prev.filter((r) => r.id !== selectedReference.id));

    setShowDeleteReferenceModal(false);
    setIsReferenceModalOpen(false);
    setSelectedReference(null);
  }}
/>


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

{isBasePaletteModalOpen && (
  <div
    className={styles.refModalOverlay}
    onClick={() => setIsBasePaletteModalOpen(false)}
    role="presentation"
  >
    <div
      className={styles.refModalCard}
      onClick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="base-palette-title"
    >
      <div className={styles.refModalHeader}>
        <div>
          <div className={styles.refModalEyebrow}>Ranges</div>
          <h2 id="base-palette-title" className={styles.refModalTitle}>
            Base color palette
          </h2>
          <p className={styles.refModalSubtitle}>
            Pick a base color. We’ll create a light → deep ramp and apply it across your ranges (low → high).
          </p>
        </div>

        <button
          type="button"
          className={styles.refModalClose}
          onClick={() => setIsBasePaletteModalOpen(false)}
          aria-label="Close"
          title="Close"
        >
          &times;
        </button>
      </div>

      <div className={styles.refModalBody}>
        <div className={styles.baseModalGrid}>
          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Base color</label>

            <div className={styles.basePickerRow}>
              <input
                type="color"
                value={customBaseColor}
                onChange={(e) => {
                  const v = String(e.target.value || "").toLowerCase();
                  setCustomBaseColor(isValidHex6(v) ? v : customBaseColor);
                }}
                className={styles.baseColorInput}
                aria-label="Pick base color"
              />

              <input
                type="text"
                className={styles.inputBox}
                value={customBaseColor}
                onChange={(e) => setCustomBaseColor(clampHexInput(e.target.value))}
                spellCheck={false}
                maxLength={7}
                placeholder="#RRGGBB"
              />
            </div>

            <div className={styles.baseQuickRow}>
              {BASE_SWATCHES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  className={styles.baseSwatchBtn}
                  title={`${s.name} (${s.hex})`}
                  onClick={() => setCustomBaseColor(s.hex)}
                >
                  <span className={styles.baseSwatchDot} style={{ background: s.hex }} />
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldBlock}>
            <label className={styles.fieldLabel}>Preview</label>

            <div className={styles.basePreviewRamp}>
              {rampFromBase(customBaseColor, Math.max(custom_ranges?.length || 5, 5), { reverse: customReverse })
                .slice(0, 10)
                .map((c, i) => (
                  <span key={i} className={styles.basePreviewChip} style={{ background: c }} />
                ))}
            </div>

            <label className={styles.baseCheckboxRow}>
              <input
                type="checkbox"
                checked={customReverse}
                onChange={(e) => setCustomReverse(!!e.target.checked)}
              />
              Reverse (deep → light)
            </label>
          </div>
        </div>
      </div>

      <div className={styles.refModalFooter}>
        <span />

        <div className={styles.refModalFooterRight}>
          <button
            type="button"
            className={`${styles.actionPill} ${styles.cancelPill}`}
            onClick={() => setIsBasePaletteModalOpen(false)}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`${styles.actionPill} ${styles.primaryPill}`}
            onClick={() => {
              applyBaseColorPalette(customBaseColor, { reverse: customReverse });
              setIsBasePaletteModalOpen(false);
            }}
            disabled={mapDataType !== "choropleth" || (custom_ranges?.length || 0) === 0}
          >
            Apply to ranges
          </button>
        </div>
      </div>
    </div>
  </div>
)}

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
            {saveSuccess ? "Your map is saved. Choose what to do next." : "This can take a few seconds."}

          </p>
        </div>

        {/* optional close (only if you want cancel) */}
        {/* <button type="button" className={styles.saveModalClose} onClick={() => {}} aria-label="Close">
          &times;
        </button> */}
      </div>

      {/* Body */}
   {/* Body */}
<div className={styles.saveModalBody}>
  <div className={styles.saveModalSplit}>
    {/* LEFT */}
    <div className={styles.saveLeft}>
      {saveSuccess ? (
        <div className={styles.saveSuccessWrap}>
          <FontAwesomeIcon icon={faCheckCircle} className={styles.saveSuccessIcon} />
        </div>
      ) : (
        <div className={styles.saveIconWrap}>
          <FontAwesomeIcon icon={faCloudArrowUp} className={styles.saveUploadIcon} />
        </div>
      )}
    </div>

    {/* RIGHT */}
    <div className={styles.saveRight}>
      {!saveSuccess ? (
        <>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${saveProgress}%` }} />
          </div>

          <div className={styles.progressMeta}>
            <span>{saveProgress}%</span>
          </div>
        </>
      ) : (
        <div className={styles.saveActionsRight}>
          <button
            type="button"
            className={`${styles.actionPill} ${styles.primaryPill}`}
            onClick={() => {
              // close modal and keep editing
              setIsSaving(false);
              setSaveSuccess(false);
              setSaveProgress(0);

              // allow unsaved prompt again
              suppressPromptRef.current = false;
            }}
          >
            Keep editing
          </button>

          <button
            type="button"
            className={`${styles.actionPill} ${styles.cancelPill}`}
            disabled={!savedMapId}
            title={!savedMapId ? "Missing map id (backend must return it on create)" : ""}
            onClick={() => {
              suppressPromptRef.current = true;
              setIsSaving(false);
              navigate(`/map/${savedMapId}`);
            }}
          >
            Go to map
          </button>
        </div>
      )}
    </div>
  </div>
</div>

    </div>
  </div>
)}




    </div>
  );
}
