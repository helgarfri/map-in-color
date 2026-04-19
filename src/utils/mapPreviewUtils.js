/**
 * Helpers for rendering small map previews (e.g. Share modal, activity feed).
 * Normalizes API map shape so Map component gets consistent props.
 */

import { inferPresetIdFromCodes } from "../constants/regionPresets";

const CONTINENT_PRESET_IDS = new Set([
  "europe",
  "northAmerica",
  "southAmerica",
  "latinAmerica",
  "africa",
  "asia",
  "oceania",
]);

export function toArrayMaybeJson(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

const REGION_MAP_LABELS_MODES = new Set(["off", "name", "value"]);

/**
 * How region labels are shown on the map: off | name (bucket/category) | value (choropleth numbers only).
 * Falls back from legacy boolean `show_region_category_labels` and caption text.
 * Categorical maps never use `value`; stored `value` is treated as `name`.
 */
export function readRegionMapLabelsMode(mapObj) {
  if (!mapObj || typeof mapObj !== "object") return "off";
  const raw =
    mapObj.region_map_labels_mode ??
    mapObj.regionMapLabelsMode ??
    null;
  let mode = null;
  if (typeof raw === "string") {
    const m = raw.trim().toLowerCase();
    if (REGION_MAP_LABELS_MODES.has(m)) mode = m;
  }
  if (mode == null) {
    const v =
      mapObj.show_region_category_labels ?? mapObj.showRegionCategoryLabels;
    if (typeof v === "boolean") mode = v ? "name" : "off";
    else if (v === true || v === 1 || v === "1" || v === "true") mode = "name";
    else if (v === false || v === 0 || v === "0" || v === "false") mode = "off";
    else {
      const cap = String(
        mapObj.region_category_caption ?? mapObj.regionCategoryCaption ?? ""
      ).trim();
      mode = cap.length > 0 ? "name" : "off";
    }
  }
  const mapType = String(
    mapObj.map_data_type ??
      mapObj.mapDataType ??
      mapObj.map_type ??
      mapObj.type ??
      ""
  )
    .trim()
    .toLowerCase();
  if (mapType === "categorical" && mode === "value") return "name";
  return mode;
}

/** True when any on-map region labels should be drawn (non-off mode). */
export function readShowRegionCategoryLabels(mapObj) {
  return readRegionMapLabelsMode(mapObj) !== "off";
}

/** Legacy stored preference; renderers use app/embed `theme` for label fill instead. */
export function readRegionCategoryLabelColor(mapObj) {
  if (!mapObj || typeof mapObj !== "object") return "auto";
  const v = mapObj.region_category_label_color ?? mapObj.regionCategoryLabelColor;
  const s = String(v ?? "auto").trim().toLowerCase();
  if (s === "black") return "black";
  if (s === "white") return "white";
  return "auto";
}

/**
 * SVG text paint for on-map region category/range labels.
 * @param {{ mode: string, font_color?: string | null }} opts
 */
export function regionCategoryLabelPaint({ mode, font_color }) {
  const m = mode === "black" || mode === "white" ? mode : "auto";
  if (m === "black") return { fill: "#000000", stroke: "rgba(255,255,255,0.92)" };
  if (m === "white") return { fill: "#ffffff", stroke: "rgba(0,0,0,0.55)" };
  const fc = font_color ?? "black";
  const s = String(fc).trim().toLowerCase();
  const stroke =
    s === "white" || s === "#fff" || s === "#ffffff" ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.92)";
  return { fill: fc, stroke };
}

export function normalizeMapForPreview(mapObj) {
  if (!mapObj) return null;

  const title = mapObj.title || "Untitled";
  const ocean_color = mapObj.ocean_color ?? "#ffffff";
  const unassigned_color = mapObj.unassigned_color ?? "#dedede"; /* match Map.js default so preview matches MapEmbed */
  const font_color = mapObj.font_color ?? "black";
  const is_title_hidden = !!mapObj.is_title_hidden;
  const showNoDataLegend = !!mapObj.show_no_data_legend;
  const show_microstates = mapObj.show_microstates !== false;
  const microstates_custom = mapObj.microstates_custom ?? null;
  const custom_map_countries = mapObj.custom_map_countries ?? null;
  const custom_map_preset_id =
    mapObj.custom_map_preset_id ??
    mapObj.customMapPresetId ??
    inferPresetIdFromCodes(Array.isArray(custom_map_countries) ? custom_map_countries : []) ??
    null;
  const titleFontSize = mapObj.title_font_size ?? mapObj.titleFontSize ?? null;
  const legendFontSize = mapObj.legend_font_size ?? mapObj.legendFontSize ?? null;
  const showRegionCategoryLabels = readShowRegionCategoryLabels(mapObj);
  const regionMapLabelsMode = readRegionMapLabelsMode(mapObj);

  const data = toArrayMaybeJson(mapObj.data);
  const selectedMap =
    mapObj.selected_map ?? mapObj.selectedMap ?? mapObj.map ?? "world";
  let groups = toArrayMaybeJson(mapObj.groups);

  let customRanges = Array.isArray(mapObj.custom_ranges)
    ? mapObj.custom_ranges
    : Array.isArray(mapObj.customRanges)
      ? mapObj.customRanges
      : toArrayMaybeJson(mapObj.custom_ranges);

  const groupsLookLikeRanges =
    Array.isArray(groups) &&
    groups.length > 0 &&
    groups.every((g) => {
      if (!g || typeof g !== "object") return false;
      const hasLower = g.lowerBound != null || g.lower != null || g.min != null;
      const hasUpper = g.upperBound != null || g.upper != null || g.max != null;
      const hasColor = g.color != null;
      const hasCountriesArray = Array.isArray(g.countries);
      return hasLower && hasUpper && hasColor && !hasCountriesArray;
    });

  if (!customRanges.length && groupsLookLikeRanges) {
    customRanges = groups;
    groups = [];
  }

  const mapDataType =
    mapObj.map_data_type ??
    mapObj.mapDataType ??
    mapObj.map_type ??
    mapObj.type ??
    (customRanges.length ? "choropleth" : "categorical");

  return {
    title,
    ocean_color,
    unassigned_color,
    font_color,
    is_title_hidden,
    showNoDataLegend,
    show_microstates,
    microstates_custom,
    custom_map_countries,
    custom_map_preset_id,
    titleFontSize,
    legendFontSize,
    showRegionCategoryLabels,
    regionMapLabelsMode,
    groups,
    data,
    selectedMap,
    customRanges,
    mapDataType,
  };
}

/**
 * Keeps world maps slightly lower while nudging continent/custom views higher.
 * This aligns cropped continent maps better in embed/fullscreen contexts.
 */
export function getMapVerticalOffsetPx({ selectedMapType, customMapPresetId }) {
  const mapType = String(selectedMapType ?? "world").trim();
  const presetId = String(customMapPresetId ?? "").trim();

  const isContinentLike =
    mapType === "europe" ||
    mapType === "custom" ||
    (presetId && presetId !== "world" && presetId !== "usa") ||
    CONTINENT_PRESET_IDS.has(mapType) ||
    CONTINENT_PRESET_IDS.has(presetId);

  if (mapType === "usa") return -24;
  if (mapType === "world" && !isContinentLike) return 70;
  return isContinentLike ? 0 : -24;
}
