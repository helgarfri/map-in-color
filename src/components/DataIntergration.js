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
import HomeHeader from "./HomeHeader";
import SignupRequiredModal from "./SignupRequiredModal";
import { getPlaygroundDraft, setPlaygroundDraft, clearPlaygroundDraft } from "../utils/playgroundStorage";


// Icons, contexts, etc.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faCheckCircle,
  faCloudArrowUp,
  faPlus,
  faEraser,
} from "@fortawesome/free-solid-svg-icons";
import { SidebarContext } from "../context/SidebarContext";
import { ThemeContext } from "../context/ThemeContext";
import useWindowSize from "../hooks/useWindowSize";

// API calls
import { API, updateMap, createMap } from "../api";

// Map preview
import MapPreview from "./Map";
import MapLegendOverlay from "./MapLegendOverlay";

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

function GlobeIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm3.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  );
}

function LockIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden>
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

function CaretDownIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden>
      <path d="M7 10l5 5 5-5z" />
    </svg>
  );
}

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
// - low end: mix from a very light tint of base (never pure white) to base
// - high end: slightly deepen by mixing toward a darkened base
const LIGHT_RAMP_MIN_TINT = 0.14; // min fraction of base at light end (avoids pure white)
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

    // 0..~0.55: from light tint of base to base (never pure white)
    // ~0.55..1: from base to darkTarget
    let c;
    if (eased <= 0.55) {
      const tt = LIGHT_RAMP_MIN_TINT + (eased / 0.55) * (1 - LIGHT_RAMP_MIN_TINT);
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


function ColorCell({ color, onChange, styles, onFocus, onBlur }) {
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
        onFocus={onFocus}
        onBlur={onBlur}
        aria-label="Pick color"
        title="Pick color"
        style={{ background: swatchColor }}
      />

      <input
        type="text"
        className={styles.hexInput}
        value={draft}
        onFocus={(e) => {
          isEditingRef.current = true;
          onFocus?.(e);
        }}
        onBlur={(e) => {
          isEditingRef.current = false;
          const committed = isValidHex6(color)
            ? String(color).toLowerCase()
            : lastValidRef.current;
          lastValidRef.current = committed;
          setDraft(committed);
          onBlur?.(e);
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


export default function DataIntegration({ existingMapData = null, isEditing = false, externalLoading = false, isPlayground = false, hideHeader = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { darkMode } = useContext(ThemeContext);
  const mapPreviewTheme = isPlayground ? "light" : (darkMode ? "dark" : "light");
  const { width } = useWindowSize();
  const hasHydratedFromPlaygroundRef = useRef(false);
  const persistTimeoutRef = useRef(null);

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
  const [tagSuggestionHighlightIndex, setTagSuggestionHighlightIndex] = useState(-1);
  const [tagDropdownPosition, setTagDropdownPosition] = useState(null); /* { top, left, width } for portal */
  const [allAvailableTags, setAllAvailableTags] = useState([]);
  const tagInputWrapperRef = useRef(null);
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);

  // ranges / groups
  const [custom_ranges, setCustomRanges] = useState(
    existingMapData?.custom_ranges || [{ id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }]
  );
  const DEFAULT_GROUP = { id: Date.now(), name: "", color: "#c0c0c0" };

  const [groups, setGroups] = useState(
    (existingMapData?.groups && existingMapData.groups.length > 0)
      ? existingMapData.groups
      : []
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

  // which table row has an active input (for highlight)
  const [focusedRangeRowId, setFocusedRangeRowId] = useState(null);
  const [focusedCategoryRowId, setFocusedCategoryRowId] = useState(null);
  const postSortHighlightTimeoutRef = useRef(null);

  // legend overlay (hover/click to highlight ranges or categories on map)
  const [activeLegendKey, setActiveLegendKey] = useState(null);
  const [hoverLegendKey, setHoverLegendKey] = useState(null);

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
const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showSignupRequiredModal, setShowSignupRequiredModal] = useState(false);

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

// Fetch all tags used in the app (for tag autofill suggestions)
useEffect(() => {
  const fetchTags = async () => {
    try {
      const res = await API.get("/explore/tags");
      const tagList = Array.isArray(res.data) ? res.data.map((r) => r.tag) : [];
      setAllAvailableTags(tagList);
    } catch (err) {
      console.error("Error fetching tags for autofill:", err);
    }
  };
  fetchTags();
}, []);

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
      // Playground: don't clear here; we'll hydrate from draft in a separate effect
      if (isPlayground) return;
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

    setMapTitle(existingMapData.title || "");
    setDescription(existingMapData.description || "");
    setTags(existingMapData.tags || []);
    setIsPublic(!!existingMapData.is_public);

    setCustomRanges(
      existingMapData.custom_ranges || [{ id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }]
    );

const hydrated = (existingMapData.groups || []).map(normalizeGroup);
const groupsToSet = hydrated.length ? hydrated : [normalizeGroup(DEFAULT_GROUP)];
setGroups(groupsToSet);
// Ensure next addCategory() gets a unique id (avoid reusing group_1, group_2 from loaded map)
let maxN = nextGroupIdRef.current;
groupsToSet.forEach((g) => {
  const id = g?.id != null ? String(g.id) : "";
  const m = id.match(/^group_(\d+)$/);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= maxN) maxN = n + 1;
  }
});
nextGroupIdRef.current = maxN;
// Categorical: value is stored as group id in DB; keep id as-is, only migrate legacy names -> id
const rawData = existingMapData.data || [];
const migratedData = (existingMapData.map_data_type === "categorical" || existingMapData.mapDataType === "categorical")
  ? rawData.map((d) => {
      const v = d?.value == null ? "" : String(d.value).trim();
      if (!v) return { ...d, value: "" };
      const byId = groupsToSet.find((gr) => String(gr?.id) === v);
      if (byId) return d;
      const byName = groupsToSet.find((gr) => String(gr?.name ?? "").trim() === v);
      return { ...d, value: byName ? String(byName.id) : "" };
    })
  : rawData;
setData(migratedData);

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
  }, [existingMapData?.id, isPlayground]); // important: use .id to avoid re-running on identity noise

  // ✅ Playground / logged-in create: hydrate from localStorage draft once so user's work isn't lost
  useEffect(() => {
    if (hasHydratedFromPlaygroundRef.current) return;
    if (existingMapData) return; // editing a map, not create
    const shouldLoadDraft = isPlayground || (isUserLoggedIn && !existingMapData);
    if (!shouldLoadDraft) return;

    const stored = getPlaygroundDraft();
    if (!stored?.payload) return;

    hasHydratedFromPlaygroundRef.current = true;
    const p = stored.payload;

    setMapTitle(p.title ?? "");
    setDescription(p.description ?? "");
    setTags(Array.isArray(p.tags) ? p.tags : []);
    setIsPublic(!!p.is_public);
    setMapDataType(p.map_data_type === "categorical" ? "categorical" : "choropleth");
    setCustomRanges(
      (Array.isArray(p.custom_ranges) ? p.custom_ranges : []).map((r, i) => ({
        ...r,
        id: r?.id ?? Date.now() + i,
        color: r?.color ?? "#c0c0c0",
        name: r?.name ?? "",
        lowerBound: r?.lowerBound ?? "",
        upperBound: r?.upperBound ?? "",
      }))
    );
    const groupsHydrated = (Array.isArray(p.groups) ? p.groups : []).map((g, i) =>
      normalizeGroup({ ...g, id: g?.id ?? `group_${Date.now()}_${i}` })
    );
    const groupsToSet = groupsHydrated.length ? groupsHydrated : [];
    setGroups(groupsToSet);
    const draftData = Array.isArray(p.data) ? p.data : [];
    const migratedDraftData = p.map_data_type === "categorical"
      ? draftData.map((d) => {
          const v = d?.value == null ? "" : String(d.value).trim();
          if (!v) return { ...d, value: "" };
          const byId = groupsToSet.find((gr) => String(gr?.id) === v);
          if (byId) return d;
          const byName = groupsToSet.find((gr) => String(gr?.name ?? "").trim() === v);
          return { ...d, value: byName ? String(byName.id) : "" };
        })
      : draftData;
    setData(migratedDraftData);
    setOceanColor(p.ocean_color ?? "#ffffff");
    setUnassignedColor(p.unassigned_color ?? "#c0c0c0");
    setFontColor(p.font_color ?? "black");
    setSelectedPalette(p.selected_palette ?? "None");
    setSelectedMapTheme(p.selected_map_theme ?? "Default");
    setFileStats(p.file_stats && typeof p.file_stats === "object" ? p.file_stats : defaultFileStats);
    setIsTitleHidden(!!p.is_title_hidden);
    setShowNoDataLegend(!!p.show_no_data_legend);
    setTitleFontSize(p.titleFontSize ?? null);
    setLegendFontSize(p.legendFontSize ?? null);
    setReferences(Array.isArray(p.sources) ? p.sources : []);
    setPlaceholders(p.placeholders && typeof p.placeholders === "object" ? p.placeholders : {});
  }, [existingMapData, isPlayground, isUserLoggedIn]);

  // ✅ Playground: debounced persist to localStorage so draft isn't lost
  useEffect(() => {
    if (!isPlayground) return;
    if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    persistTimeoutRef.current = setTimeout(() => {
      persistTimeoutRef.current = null;
      setPlaygroundDraft(buildSavePayload());
    }, 1500);
    return () => {
      if (persistTimeoutRef.current) clearTimeout(persistTimeoutRef.current);
    };
  }, [
    mapTitle,
    description,
    tags,
    is_public,
    data,
    mapDataType,
    custom_ranges,
    groups,
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
    placeholders,
    isPlayground,
  ]);

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

    // don't show "unsaved changes" when leaving after delete
    suppressPromptRef.current = true;
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

function confirmClearData() {
  setData([]);
  setFileStats(defaultFileStats);
  setPlaceholders({});
  setCustomRanges([{ id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" }]);
  setGroups([normalizeGroup({ id: Date.now(), name: "", color: "#c0c0c0" })]);
  setShowClearDataModal(false);
  clearPlaygroundDraft();
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
        ...(r?.description != null && String(r.description).trim() !== "" ? { description: String(r.description).trim() } : {}),
      });
    }

    // ✅ dedupe by code (last one wins)
    const byCode = new Map();
    for (const row of cleaned) byCode.set(row.code, row);

    setData(Array.from(byCode.values()));
    setFileStats(stats || defaultFileStats);

    // ✅ apply imported descriptions to placeholders immediately so the map shows them without user having to click in/out
    setPlaceholders((prev) => {
      const next = { ...(prev && typeof prev === "object" ? prev : {}) };
      for (const row of cleaned) {
        if (row.description != null && String(row.description).trim() !== "") {
          next[cleanCode(row.code)] = String(row.description).trim();
        }
      }
      return next;
    });
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
        ...(r?.description != null && String(r.description).trim() !== "" ? { description: String(r.description).trim() } : {}),
      });
    }

    // ✅ dedupe by code (last one wins)
    const byCode = new Map();
    for (const row of cleaned) byCode.set(row.code, row);

    const next = Array.from(byCode.values());
    setFileStats(stats || defaultFileStats);

    // ✅ Build merged groups from imported category names (same logic as before)
    const importedCats = Array.from(
      new Set(next.map((x) => String(x.value ?? "").trim()).filter(Boolean))
    );
    const keyOf = (s) => String(s ?? "").trim();
    const prevArr = (Array.isArray(groups) ? groups : []).map(normalizeGroup);
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

    // ✅ Store category by group id so renaming the category later doesn't lose countries
    const nextWithIds = next.map((d) => {
      const nameVal = String(d?.value ?? "").trim();
      if (!nameVal) return { ...d, value: "" };
      const g = merged.find((gr) => keyOf(gr.name) === nameVal);
      return { ...d, value: g ? String(g.id) : nameVal };
    });
    setData(nextWithIds);
    setGroups(merged);

    // ✅ apply imported descriptions to placeholders immediately so the map shows them without user having to click in/out
    setPlaceholders((prev) => {
      const nextPlaceholders = { ...(prev && typeof prev === "object" ? prev : {}) };
      for (const row of next) {
        if (row.description != null && String(row.description).trim() !== "") {
          nextPlaceholders[cleanCode(row.code)] = String(row.description).trim();
        }
      }
      return nextPlaceholders;
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

    // ✅ Clear all data when switching: descriptions, range/category names, values, file stats
    setPlaceholders({});
    if (nextType === "categorical") {
      setCustomRanges(DEFAULT_RANGES());
      setGroups([]); // start with 0 categories; user adds via "Add category"
      // Keep existing data rows (country codes) but clear value so all are unassigned → "Assign all unassigned" works
      setData((prev) =>
        (Array.isArray(prev) ? prev : []).map((d) => ({ ...d, value: "" }))
      );
      setFileStats(defaultFileStats);
    } else {
      setCustomRanges(DEFAULT_RANGES());
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

  // Only clear focused row when focus leaves the row (not when moving between inputs in same row)
  const handleRangeRowBlur = (e) => {
    const row = e.currentTarget.closest("tr");
    const next = e.relatedTarget;
    if (next && row && row.contains(next)) return;
    setFocusedRangeRowId(null);
  };

  // After sort on blur: keep the moved row highlighted for a couple of seconds
  const POST_SORT_HIGHLIGHT_MS = 2200;
  const schedulePostSortHighlight = (rangeId) => {
    if (postSortHighlightTimeoutRef.current) clearTimeout(postSortHighlightTimeoutRef.current);
    setFocusedRangeRowId(rangeId);
    postSortHighlightTimeoutRef.current = setTimeout(() => {
      setFocusedRangeRowId((prev) => (prev === rangeId ? null : prev));
      postSortHighlightTimeoutRef.current = null;
    }, POST_SORT_HIGHLIGHT_MS);
  };
  const handleCategoryRowBlur = (e) => {
    const row = e.currentTarget.closest("tr");
    const next = e.relatedTarget;
    if (next && row && row.contains(next)) return;
    setFocusedCategoryRowId(null);
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
 * Rename category: updates the group name only.
 * Data stores group id, so countries stay in the same group when name changes.
 */
const renameCategory = (id, newNameRaw) => {
  const newName = String(newNameRaw ?? "").trim(); // ✅ trim only on blur
  setGroups((prevGroups) => {
    const arr = (Array.isArray(prevGroups) ? prevGroups : []).map(ensureGroupShape);
    const idx = arr.findIndex((g) => g.id === id);
    if (idx === -1) return arr;
    arr[idx] = { ...arr[idx], name: newName };
    return arr;
  });
};


const removeCategory = (id) => {
  const idStr = String(id);
  setGroups((prev) => (Array.isArray(prev) ? prev.filter((g) => g.id !== id) : []));
  setData((prev) =>
    (Array.isArray(prev) ? prev : []).map((d) => {
      const v = d?.value == null ? "" : String(d.value).trim();
      if (v === idStr) return { ...d, value: "" };
      return d;
    })
  );
};

/**
 * Assign all unassigned countries to the category with the given group id.
 * Uses group id so it works for categories with empty or renamed labels.
 */
const assignUnassignedToCategory = (groupId) => {
  const idStr = groupId != null ? String(groupId).trim() : "";
  if (!idStr) return;
  const groupsArr = (Array.isArray(groups) ? groups : []).map(ensureGroupShape);
  if (!groupsArr.some((g) => String(g.id) === idStr)) return;
  setData((prev) =>
    (Array.isArray(prev) ? prev : []).map((d) => {
      const resolved = resolveValueToGroupId(d?.value, groupsArr);
      if (resolved !== "") return d;
      return { ...d, value: idStr };
    })
  );
};

  // Tags: suggestions from existing app tags, add-tag helper, key handler
  const tagSuggestions = useMemo(() => {
    const q = tagInput.trim().toLowerCase();
    if (q === "") return [];
    return allAvailableTags.filter(
      (t) => t.toLowerCase().includes(q) && !tags.includes(t)
    );
  }, [tagInput, allAvailableTags, tags]);

  const displayedTagSuggestions = tagSuggestions.slice(0, 4);

  useEffect(() => {
    setTagSuggestionHighlightIndex(-1);
  }, [tagInput, tagSuggestions.length]);

  /* Position tag dropdown in portal so it can appear outside the field block */
  useEffect(() => {
    if (tagSuggestions.length === 0 || !tagInputWrapperRef.current) {
      setTagDropdownPosition(null);
      return;
    }
    const updatePosition = () => {
      if (!tagInputWrapperRef.current) return;
      const rect = tagInputWrapperRef.current.getBoundingClientRect();
      setTagDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    };
    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [tagSuggestions.length, tagInput]);

  const addTag = (tagToAdd) => {
    const normalized = String(tagToAdd).trim().toLowerCase();
    if (normalized === "") return;
    setTags((prev) => (prev.includes(normalized) ? prev : [...prev, normalized]));
    setTagInput("");
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (displayedTagSuggestions.length === 0) return;
      setTagSuggestionHighlightIndex((prev) =>
        prev < displayedTagSuggestions.length - 1 ? prev + 1 : 0
      );
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (displayedTagSuggestions.length === 0) return;
      setTagSuggestionHighlightIndex((prev) =>
        prev <= 0 ? displayedTagSuggestions.length - 1 : prev - 1
      );
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (displayedTagSuggestions.length > 0 && tagSuggestionHighlightIndex >= 0) {
        addTag(displayedTagSuggestions[tagSuggestionHighlightIndex]);
        setTagSuggestionHighlightIndex(-1);
        return;
      }
      if (tagSuggestions.length > 0) {
        addTag(tagSuggestions[0]);
        return;
      }
      if (tagInput.trim() !== "") {
        addTag(tagInput.trim());
      }
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
        const descRaw = pick(d, ["description", "Description", "desc"]);

        return {
          ...d,
          code: code ? String(code).trim().toUpperCase() : "",
          name: name ? String(name) : undefined,
          value: mapDataType === "choropleth" ? toNumber(valueRaw) : valueRaw == null ? "" : String(valueRaw),
          ...(descRaw != null && String(descRaw).trim() !== "" ? { description: String(descRaw).trim() } : {}),
        };
      })
      .filter((d) => d.code);
  }, [data, mapDataType]);

  // code -> display name for map infobox/group box (world names + user-provided overrides)
  const codeToName = useMemo(() => {
    const out = {};
    const list = Array.isArray(countryCodes) ? countryCodes : [];
    for (const c of list) {
      const code = c?.code ? String(c.code).trim().toUpperCase() : "";
      if (code) out[code] = c.name ?? code;
    }
    for (const d of mapDataNormalized || []) {
      const code = normCode(d.code);
      if (code && d.name != null && String(d.name).trim() !== "") {
        out[code] = String(d.name).trim();
      }
    }
    return out;
  }, [mapDataNormalized]);

  // ===== Category table helpers =====
  function safeTrim(v) {
    return v == null ? "" : String(v).trim();
  }
function countryLabel(d) {
  return d?.code ? String(d.code).trim().toUpperCase() : "";
}

/** Resolve data value to group id: value may be group id (current) or group name (legacy). */
function resolveValueToGroupId(value, groupsArr) {
  const v = safeTrim(value);
  if (!v) return "";
  const byId = groupsArr.find((g) => String(g?.id) === v);
  if (byId) return String(byId.id);
  const byName = groupsArr.find((g) => String(g?.name ?? "").trim() === v);
  if (byName) return String(byName.id);
  return "";
}

const categoryRows = useMemo(() => {
  if (mapDataType !== "categorical") return [];

  const groupsArr = (Array.isArray(groups) ? groups : []).map(ensureGroupShape);

  // map group id -> countries list (value in data is group id or legacy name)
  const idToCountries = new Map();
  for (const d of mapDataNormalized || []) {
    const groupId = resolveValueToGroupId(d?.value, groupsArr);
    const list = idToCountries.get(groupId) || [];
    list.push(countryLabel(d));
    idToCountries.set(groupId, list);
  }

  // 1) rows for ALL defined groups (even if empty)
  const rows = groupsArr.map((g) => {
    const gid = String(g.id);
    const countries = (idToCountries.get(gid) || []).filter(Boolean).sort((a, b) => a.localeCompare(b));
    return {
      id: g.id,
      name: g.name,
      color: g.color || "#c0c0c0",
      countries,
      count: countries.length,
      isDefined: true,
    };
  });

  return rows;
}, [mapDataType, groups, mapDataNormalized]);

/** Count of countries with no category assigned (categorical only). Resolves value so legacy names count as assigned. */
const unassignedCountryCount = useMemo(() => {
  if (mapDataType !== "categorical") return 0;
  const groupsArr = (Array.isArray(groups) ? groups : []).map(ensureGroupShape);
  return (mapDataNormalized || []).filter((d) => resolveValueToGroupId(d?.value, groupsArr) === "").length;
}, [mapDataType, groups, mapDataNormalized]);

  const categoryOptions = useMemo(() => {
  const arr = Array.isArray(groups) ? groups : [];
  return arr.map((g) => ({ id: g.id, name: String(g?.name ?? "").trim() || "(Unnamed)" }));
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
                <tr
                  key={row.id}
                  className={`${styles.rangeTableRow} ${focusedCategoryRowId === row.id ? styles.rangeTableRowActive : ""}`}
                >
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
      {canEdit && row.count === 0 && unassignedCountryCount > 0 && (
        <button
          type="button"
          className={styles.assignUnassignedLink}
          onClick={() => assignUnassignedToCategory(row.id)}
          title={
            row.name?.trim()
              ? `Assign all ${unassignedCountryCount} unassigned countries to "${row.name}"`
              : `Assign all ${unassignedCountryCount} unassigned countries to this category`
          }
        >
          Assign all unassigned
        </button>
      )}

    </>
  ) : (
    <div className={styles.emptyCountriesBlock}>
      <span className={styles.mutedText}>No countries assigned yet.</span>
      {canEdit && (
        <button
          type="button"
          className={styles.assignUnassignedLink}
          onClick={() => assignUnassignedToCategory(row.id)}
          disabled={unassignedCountryCount === 0}
          title={
            unassignedCountryCount > 0
              ? (row.name?.trim()
                  ? `Assign all ${unassignedCountryCount} unassigned countries to "${row.name}"`
                  : `Assign all ${unassignedCountryCount} unassigned countries to this category`)
              : "No unassigned countries"
          }
        >
          Assign all unassigned
        </button>
      )}
    </div>
  )}
</td>



                  <td>
                    <input
                      className={styles.tableInputText}
                      value={row.name}
                      onChange={(e) => updateCategory(row.id, "name", e.target.value)}
                      onFocus={() => setFocusedCategoryRowId(row.id)}
                      onBlur={(e) => {
                        renameCategory(row.id, e.target.value);
                        handleCategoryRowBlur(e);
                      }}
                      placeholder="Category name"
                    />
                  </td>

                  <td>
                    <ColorCell
                      styles={styles}
                      color={row.color || "#c0c0c0"}
                      onChange={(next) => updateCategory(row.id, "color", next)}
                      onFocus={() => setFocusedCategoryRowId(row.id)}
                      onBlur={handleCategoryRowBlur}
                    />
                  </td>

                  <td>
                    {canEdit && (
                      <button
                        className={styles.removeButton}
                        onClick={() => removeCategory(row.id)}
                        onFocus={() => setFocusedCategoryRowId(row.id)}
                        onBlur={handleCategoryRowBlur}
                        type="button"
                        aria-label="Remove category"
                        title="Remove"
                      >
                        &times;
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
  // Display order follows custom_ranges (sorted only on input blur via commitRangeBound)
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
            .filter((d) => typeof d.value === "number" && d.value >= r.lower && d.value <= r.upper)
            .map(rangeCountryLabel)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b))
        : [];

      return { ...r, countries, count: countries.length, isValidRange: valid };
    });

    return rows;
  }, [custom_ranges, mapDataNormalized]);

  // Legend models for MapLegendOverlay (choropleth ranges or categorical groups)
  const legendModels = useMemo(() => {
    if (mapDataType === "categorical") {
      const groupsArr = (Array.isArray(groups) ? groups : []).map((g) => ({
        id: g?.id ?? `group_${g?.name}`,
        name: String(g?.name ?? "").trim(),
        color: (g?.color ?? "#c0c0c0").toLowerCase(),
      }));
      const codeToGroupId = new Map();
      for (const d of mapDataNormalized || []) {
        const code = normCode(d.code);
        if (!code) continue;
        const groupId = resolveValueToGroupId(d?.value, groupsArr);
        codeToGroupId.set(code, groupId);
      }
      return groupsArr.map((g) => {
        const gid = String(g.id);
        const codes = new Set();
        for (const [code, resolvedId] of codeToGroupId.entries()) {
          if (resolvedId === gid) codes.add(code);
        }
        return {
          key: g.id,
          label: g.name || "(Unnamed)",
          color: g.color,
          codes,
        };
      });
    }
    // choropleth
    const toNum = (x) => {
      const n = typeof x === "number" ? x : parseFloat(String(x ?? "").replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };
    const rangesClean = (custom_ranges || []).map((r) => ({
      ...r,
      lower: toNum(r.lowerBound),
      upper: toNum(r.upperBound),
    }));
    const codeToValue = new Map();
    for (const d of mapDataNormalized || []) {
      const code = normCode(d.code);
      if (!code) continue;
      const v = typeof d.value === "number" ? d.value : toNum(d.value);
      if (v != null) codeToValue.set(code, v);
    }
    const models = rangesClean
      .filter((r) => r.lower != null && r.upper != null)
      .map((r, idx) => {
        const nameOnly = String(r.name ?? "").trim() || null;
        const label =
          nameOnly ||
          (r.lower != null && r.upper != null
            ? `${r.lower} – ${r.upper}`
            : r.lower != null
            ? `≥ ${r.lower}`
            : r.upper != null
            ? `≤ ${r.upper}`
            : "Range");
        const codes = new Set();
        for (const [code, val] of codeToValue.entries()) {
          if (val >= r.lower && val <= r.upper) codes.add(code);
        }
        return {
          key: r.id ?? `range-${idx}-${r.lower}-${r.upper}`,
          label,
          color: (r.color ?? "#c0c0c0").toLowerCase(),
          min: r.lower,
          max: r.upper,
          codes,
          sortValue: r.upper != null ? r.upper : r.lower != null ? r.lower : -Infinity,
        };
      });
    models.sort((a, b) => (b.sortValue ?? -Infinity) - (a.sortValue ?? -Infinity));
    return models;
  }, [mapDataType, groups, custom_ranges, mapDataNormalized]);

  const hoveredLegendCodes = useMemo(() => {
    if (!hoverLegendKey) return [];
    const item = legendModels.find((x) => x.key === hoverLegendKey);
    return item ? Array.from(item.codes || []) : [];
  }, [hoverLegendKey, legendModels]);

  const activeLegendCodes = useMemo(() => {
    if (!activeLegendKey) return [];
    const item = legendModels.find((x) => x.key === activeLegendKey);
    return item ? Array.from(item.codes || []) : [];
  }, [activeLegendKey, legendModels]);

  const activeLegendModel = useMemo(() => {
    if (!activeLegendKey) return null;
    return legendModels.find((x) => x.key === activeLegendKey) ?? null;
  }, [activeLegendKey, legendModels]);

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

  const buildSavePayload = () => {
    // Merge descriptions from data rows (e.g. from file import) into placeholders so they persist on save.
    // User-edited placeholders take precedence; data descriptions fill in any gaps.
    const mergedPlaceholders = { ...(placeholders && typeof placeholders === "object" ? placeholders : {}) };
    for (const d of mapDataNormalized || []) {
      const code = normCode(d?.code);
      const desc = d?.description != null ? String(d.description).trim() : "";
      if (code && desc && !mergedPlaceholders[code]) {
        mergedPlaceholders[code] = desc;
      }
    }

    return {
      title: mapTitle,
      description,
      tags,
      is_public,
      data: mapDataType === "categorical"
        ? (mapDataNormalized || []).map((d) => {
            const g = (groups || []).find((x) => String(x.id) === String(d?.value ?? ""));
            return { ...d, value: g ? String(g?.name ?? "").trim() : "" };
          })
        : mapDataNormalized,
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
      placeholders: mergedPlaceholders,
    };
  };

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
          ...(d.description != null && String(d.description).trim() !== "" ? { description: String(d.description).trim() } : {}),
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

  // Allow 0 categories in categorical mode; no longer force at least one group


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

  if (isPlayground) {
    setShowSignupRequiredModal(true);
    return;
  }

  const payload = buildSavePayload();

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
  const mapIdToUse = isEditing ? existingMapData?.id : savedMapId;
  if (mapIdToUse) {
    res = await updateMap(mapIdToUse, payload);
    setSavedMapId(mapIdToUse);
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
  clearPlaygroundDraft(); /* draft is now saved to account; don’t reload it next time */

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
  const DESKTOP_MIN_WIDTH = 1025;
  const showDesktopOnly = width > 0 && width < DESKTOP_MIN_WIDTH;
  const layoutPadding = isPlayground ? 0 : (isCollapsed ? 70 : 250);

  const desktopOnlyMessage = (
    <div className={styles.desktopOnlyContent}>
      <div className={styles.desktopOnlyIcon} aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      </div>
      <h2 className={styles.desktopOnlyTitle}>Create maps on desktop</h2>
      <p className={styles.desktopOnlyMessage}>
        For the best experience, use a desktop or laptop to create and edit maps. Open this page on a computer to get started.
      </p>
    </div>
  );

  if (showDesktopOnly) {
    if (!isPlayground) {
      return (
        <div className={styles.layoutContainer} style={{ paddingLeft: layoutPadding }}>
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} title={isEditing ? `Edit ${mapTitle}` : "Create Map"} />
          <div className={styles.desktopOnlyScreen}>
            {desktopOnlyMessage}
          </div>
        </div>
      );
    }
    return (
      <>
        {!hideHeader && <HomeHeader />}
        <div className={styles.desktopOnlyScreen}>
          {desktopOnlyMessage}
        </div>
      </>
    );
  }
  if (loading) {
    return (
      <>
        {isPlayground && !hideHeader && <HomeHeader />}
        <div className={`${styles.layoutContainer} ${isPlayground ? styles.layoutContainerPlayground : ""} ${isPlayground && loading ? styles.layoutSkeletonEnter : ""}`} style={{ paddingLeft: layoutPadding }}>
          {!isPlayground && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}
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
      </>
    );
  }

  return (
    <>
      {isPlayground && !hideHeader && <HomeHeader />}
      <div className={`${styles.layoutContainer} ${isPlayground ? styles.layoutContainerPlayground : ""}`} style={{ paddingLeft: layoutPadding }}>
        {!isPlayground && <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />}

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
              <div className={styles.mapPreviewWrap}>
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
                    onSelectCode={(code) => {
                      setSelectedCode(normCode(code));
                      setActiveLegendKey(null);
                      setHoverLegendKey(null);
                    }}
                    placeholders={placeholders}
                    strokeMode="thick"
                    groupHoveredCodes={hoveredLegendCodes}
                    groupActiveCodes={activeLegendCodes}
                    activeLegendModel={activeLegendModel}
                    suppressInfoBox={!!activeLegendKey}
                    onCloseActiveLegend={() => {
                      setActiveLegendKey(null);
                      setHoverLegendKey(null);
                    }}
                    compactUi={true}
                    compactUiShowInfoBoxes={true}
                    codeToName={codeToName}
                    theme={mapPreviewTheme}
                  />
                </div>
                <MapLegendOverlay
                  title={mapTitle || "Untitled Map"}
                  legendModels={legendModels}
                  activeLegendKey={activeLegendKey}
                  setActiveLegendKey={(k) => {
                    setSelectedCode(null);
                    setActiveLegendKey(k);
                  }}
                  setHoverLegendKey={setHoverLegendKey}
                  isEmbed={false}
                  theme={mapPreviewTheme}
                  interactive={true}
                  compact={true}
                />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className={styles.navSection}>
            {!isPlayground && (
              <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} title={isEditing ? `Edit ${mapTitle}` : "Create Map"} />
            )}

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
      <tr
        key={range.id}
        className={`${styles.rangeTableRow} ${focusedRangeRowId === range.id ? styles.rangeTableRowActive : ""}`}
      >
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
            onFocus={() => {
              if (postSortHighlightTimeoutRef.current) clearTimeout(postSortHighlightTimeoutRef.current);
              postSortHighlightTimeoutRef.current = null;
              setFocusedRangeRowId(range.id);
            }}
            onBlur={(e) => {
              commitRangeBound(range.id, "lowerBound", e.target.value);
              schedulePostSortHighlight(range.id);
            }}
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
            onFocus={() => {
              if (postSortHighlightTimeoutRef.current) clearTimeout(postSortHighlightTimeoutRef.current);
              postSortHighlightTimeoutRef.current = null;
              setFocusedRangeRowId(range.id);
            }}
            onBlur={(e) => {
              commitRangeBound(range.id, "upperBound", e.target.value);
              schedulePostSortHighlight(range.id);
            }}
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
            onFocus={() => {
              if (postSortHighlightTimeoutRef.current) clearTimeout(postSortHighlightTimeoutRef.current);
              postSortHighlightTimeoutRef.current = null;
              setFocusedRangeRowId(range.id);
            }}
            onBlur={handleRangeRowBlur}
            placeholder="Range name"
          />
        </td>

        <td>
          <ColorCell
            styles={styles}
            color={range.color}
            onChange={(next) => handleRangeChange(range.id, "color", next)}
            onFocus={() => {
              if (postSortHighlightTimeoutRef.current) clearTimeout(postSortHighlightTimeoutRef.current);
              postSortHighlightTimeoutRef.current = null;
              setFocusedRangeRowId(range.id);
            }}
            onBlur={handleRangeRowBlur}
          />
        </td>

        <td>
          <button
            className={styles.removeButton}
            onClick={() => removeRange(range.id)}
            onFocus={() => {
              if (postSortHighlightTimeoutRef.current) clearTimeout(postSortHighlightTimeoutRef.current);
              postSortHighlightTimeoutRef.current = null;
              setFocusedRangeRowId(range.id);
            }}
            onBlur={handleRangeRowBlur}
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

      {/* Visibility — fieldBlockVisibility allows dropdown to escape overflow */}
      <div className={`${styles.fieldBlock} ${styles.fieldBlockVisibility}`}>
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
          <span className={styles.visibilityIcon}>
            {is_public ? <GlobeIcon /> : <LockIcon />}
          </span>
          {is_public ? "Public" : "Private"}
          <CaretDownIcon className={styles.selectArrow} />

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
                <span className={styles.visibilityIcon}><GlobeIcon /></span>
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
                <span className={styles.visibilityIcon}><LockIcon /></span>
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

        <div className={styles.tagInputWrapper} ref={tagInputWrapperRef}>
          <input
            type="text"
            className={styles.inputBox}
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value.replace(/\s/g, ""))}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Type a tag and press Enter"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={tagSuggestions.length > 0}
            aria-controls={tagSuggestions.length > 0 ? "tag-suggestions-listbox" : undefined}
          />
          {tagSuggestions.length > 0 && tagDropdownPosition &&
            createPortal(
              <ul
                id="tag-suggestions-listbox"
                className={styles.tagSuggestionsList}
                role="listbox"
                aria-activedescendant={tagSuggestionHighlightIndex >= 0 ? `tag-suggestion-${tagSuggestionHighlightIndex}` : undefined}
                style={{
                  position: "fixed",
                  top: tagDropdownPosition.top,
                  left: tagDropdownPosition.left,
                  width: tagDropdownPosition.width,
                  margin: 0,
                  zIndex: 9999,
                }}
              >
                {displayedTagSuggestions.map((suggestion, i) => (
                  <li
                    key={suggestion}
                    id={`tag-suggestion-${i}`}
                    className={`${styles.tagSuggestionItem} ${i === tagSuggestionHighlightIndex ? styles.tagSuggestionItemHighlight : ""}`}
                    role="option"
                    aria-selected={i === tagSuggestionHighlightIndex}
                    onClick={() => addTag(suggestion)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>,
              document.body
            )}
        </div>

        <div className={styles.tagBoxLg}>
          {tags.length === 0 ? (
            <p className={styles.mutedText}>No tags yet.</p>
          ) : (
            tags.map((tag, i) => (
              <div key={i} className={styles.tagItem}>
                <span className={styles.tagItemText}>{tag}</span>
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
      onClick={() => setShowClearDataModal(true)}
      disabled={!isEditing && !savedMapId && !isPlayground && existingMapData != null}
      title="Remove all data from the map (keeps title and settings)"
    >
      <FontAwesomeIcon icon={faEraser} />
      Clear data
    </button>
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
  isOpen={showClearDataModal}
  title="Clear all data?"
  message="This will remove all data from the map. The map title and settings will be kept. This can't be undone."
  cancelText="Cancel"
  confirmText="Clear data"
  danger
  onCancel={() => setShowClearDataModal(false)}
  onConfirm={confirmClearData}
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
          clearPlaygroundDraft(); /* so next "create new map" doesn’t reload this abandoned state */
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
      {isPlayground && (
        <SignupRequiredModal
          isOpen={showSignupRequiredModal}
          onClose={() => setShowSignupRequiredModal(false)}
          onNavigateToLogin={() => {
            suppressPromptRef.current = true;
            setShowSignupRequiredModal(false);
            navigate("/login", { state: { returnTo: "/create" } });
          }}
          onNavigateToSignup={() => {
            suppressPromptRef.current = true;
            setShowSignupRequiredModal(false);
            navigate("/signup", { state: { returnTo: "/create" } });
          }}
        />
      )}
    </>
  );
}
