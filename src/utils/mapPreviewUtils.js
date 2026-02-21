/**
 * Helpers for rendering small map previews (e.g. Share modal, activity feed).
 * Normalizes API map shape so Map component gets consistent props.
 */

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

export function normalizeMapForPreview(mapObj) {
  if (!mapObj) return null;

  const title = mapObj.title || "Untitled";
  const ocean_color = mapObj.ocean_color ?? "#ffffff";
  const unassigned_color = mapObj.unassigned_color ?? "#c0c0c0";
  const font_color = mapObj.font_color ?? "black";
  const is_title_hidden = !!mapObj.is_title_hidden;
  const showNoDataLegend = !!mapObj.show_no_data_legend;
  const titleFontSize = mapObj.title_font_size ?? mapObj.titleFontSize ?? null;
  const legendFontSize = mapObj.legend_font_size ?? mapObj.legendFontSize ?? null;

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
    titleFontSize,
    legendFontSize,
    groups,
    data,
    selectedMap,
    customRanges,
    mapDataType,
  };
}
