/**
 * US States map component. Uses us.svg (loaded from public/us.svg).
 * Same prop interface as Map.js for data, groups, ranges, hover, and selection.
 */
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import cls from "./Map.module.css";
import { getUsStateFlagUrl } from "../utils/usStateFlags";
import {
  readRegionMapLabelsMode,
  regionCategoryLabelPaint,
} from "../utils/mapPreviewUtils";

const JSMap = window.Map;
const US_VIEWBOX = "0 0 1000 589";

const norm = (c = "") => String(c || "").trim().toUpperCase();

function rangeHidesMapLabels(r) {
  if (!r || typeof r !== "object") return false;
  return !!(r.hideMapLabels ?? r.hide_map_labels);
}

/** simplemaps us.svg paths ship inline stroke-width; it overrides CSS and looks heavy when scaled down. */
const ORIG_STROKE_WIDTH_ATTR = "data-mic-orig-stroke-w";

function applyUsSvgCssStrokes(svg, preferCssStrokes) {
  if (!svg) return;
  svg.querySelectorAll("path[id]").forEach((el) => {
    if (!el.hasAttribute(ORIG_STROKE_WIDTH_ATTR)) {
      const w = el.style.getPropertyValue("stroke-width").trim();
      if (w) el.setAttribute(ORIG_STROKE_WIDTH_ATTR, w);
    }
    const orig = el.getAttribute(ORIG_STROKE_WIDTH_ATTR);
    if (preferCssStrokes) el.style.removeProperty("stroke-width");
    else if (orig) el.style.setProperty("stroke-width", orig);
  });
}
const formatValue = (value) => {
  if (value == null || (typeof value === "string" && !value.trim())) return "No data";
  if (typeof value !== "number" || !Number.isFinite(value)) return String(value);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 5,
  });
};

function getStateEls(svg, code) {
  if (!svg || !code) return [];
  const C = norm(code);
  return Array.from(svg.querySelectorAll(`path[id="${C}"]`));
}

function getBBoxUnion(svg, code) {
  const els = getStateEls(svg, code);
  if (!els.length) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  els.forEach((el) => {
    try {
      const b = el.getBBox();
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
    } catch (_) {}
  });
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export default function MapUS({
  groups: rawGroups = [],
  custom_ranges = [],
  ocean_color,
  unassigned_color = "#dedede",
  font_color = "black",
  mapDataType,
  data: rawData = [],
  mapTitleValue,
  is_title_hidden = false,
  titleFontSize = 30,
  legendFontSize = 16,
  hoveredCode = null,
  selectedCode: externalSelectedCode = null,
  groupHoveredCodes = [],
  groupActiveCodes = [],
  onHoverCode,
  onSelectCode,
  placeholders = {},
  strokeMode = "thin",
  /** When true (e.g. StaticMapThumbnail), match Map.js: let Map.module.css control path strokes and center in small frames. */
  isThumbnail = false,
  staticView = false,
  theme = "light",
  compactUi = false,
  compactUiShowInfoBoxes = false,
  activeLegendModel = null,
  onCloseActiveLegend,
  codeToName = {},
  suppressInfoBox = false,
  /** When set (non-empty array), only these state codes are shown. When null/empty, all states are shown. */
  custom_map_countries = null,
  verticalOffsetPx = null,
  horizontalOffsetPx = 0,
  show_region_category_labels = null,
  showRegionCategoryLabels = null,
  region_map_labels_mode = null,
  regionMapLabelsMode: regionMapLabelsModeProp = null,
  region_category_caption = null,
  regionCategoryCaption = null,
  /** @deprecated Ignored: label fill follows `theme`. */
  region_category_label_color = null,
  /** @deprecated Ignored: label fill follows `theme`. */
  regionCategoryLabelColor = null,
}) {
  const wrapperRef = useRef(null);
  const svgRef = useRef(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  const [selected, setSelected] = useState(null);
  const selectedCodeRef = useRef(null);
  const groupHoverRef = useRef(new Set());
  const groupActiveRef = useRef(new Set());
  const isDarkTheme = theme === "dark";

  const applyGroupClass = useCallback((codes, className, prevRef) => {
    const svg = svgRef.current;
    if (!svg) return;
    for (const code of prevRef.current) {
      getStateEls(svg, code).forEach((el) => el.classList.remove(className));
    }
    const next = new Set((codes || []).map(norm).filter(Boolean));
    for (const code of next) {
      getStateEls(svg, code).forEach((el) => el.classList.add(className));
    }
    prevRef.current = next;
  }, []);
  const contentOffsetY = typeof verticalOffsetPx === "number" ? verticalOffsetPx : 0;
  const contentOffsetX = typeof horizontalOffsetPx === "number" ? horizontalOffsetPx : 0;
  const contentTransform =
    contentOffsetX || contentOffsetY
      ? `translate(${contentOffsetX}px, ${contentOffsetY}px)`
      : undefined;

  const regionMapLabelsMode = readRegionMapLabelsMode({
    show_region_category_labels,
    showRegionCategoryLabels,
    region_category_caption,
    regionCategoryCaption,
    region_map_labels_mode,
    regionMapLabelsMode: regionMapLabelsModeProp,
    map_data_type: mapDataType,
    mapDataType,
  });
  const regionCategoryLabelColorMode = isDarkTheme ? "white" : "black";
  const effectiveStaticView = staticView || isThumbnail;

  // Load US SVG from public
  useEffect(() => {
    const base = process.env.PUBLIC_URL || "";
    fetch(`${base}/us.svg`)
      .then((r) => r.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        if (!svgEl || !wrapperRef.current) return;
        // Clone into our DOM (avoid doc fragment issues)
        const clone = svgEl.cloneNode(true);
        clone.setAttribute("viewBox", US_VIEWBOX);
        clone.setAttribute("preserveAspectRatio", "xMidYMid meet");
        clone.setAttribute("class", cls.mapCanvas);
        clone.setAttribute("data-map", "us");
        clone.setAttribute("data-stroke", strokeMode);
        wrapperRef.current.innerHTML = "";
        wrapperRef.current.appendChild(clone);
        applyUsSvgCssStrokes(clone, isThumbnail);
        svgRef.current = clone;
        setSvgLoaded(true);
      })
      .catch(() => setSvgLoaded(false));
    /* isThumbnail applied in useLayoutEffect to avoid refetch when it toggles */
  }, [strokeMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg || !svgLoaded) return;
    applyUsSvgCssStrokes(svg, isThumbnail);
  }, [isThumbnail, svgLoaded]);

  // Parse props
  const parsedRanges = useMemo(() => {
    if (!custom_ranges) return [];
    if (Array.isArray(custom_ranges)) return custom_ranges;
    if (typeof custom_ranges === "string") {
      try {
        const p = JSON.parse(custom_ranges);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [custom_ranges]);

  const parsedGroups = useMemo(() => {
    if (!rawGroups) return [];
    if (Array.isArray(rawGroups)) return rawGroups;
    if (typeof rawGroups === "string") {
      try {
        const p = JSON.parse(rawGroups);
        return Array.isArray(p) ? p : [];
      } catch {
        return [];
      }
    }
    return [];
  }, [rawGroups]);

  const effectiveMapType = useMemo(() => {
    if (mapDataType) return mapDataType;
    const hasGroups =
      Array.isArray(parsedGroups) &&
      parsedGroups.some((g) => typeof g?.name === "string" && g.name.trim().length > 0);
    return hasGroups ? "categorical" : "choropleth";
  }, [mapDataType, parsedGroups]);

  const data = useMemo(() => {
    const pick = (obj, keys) => {
      if (!obj || typeof obj !== "object") return undefined;
      for (const k of keys) {
        if (obj[k] !== undefined && obj[k] !== null) return obj[k];
      }
      return undefined;
    };
    const toNumber = (x) => {
      const n = typeof x === "number" ? x : parseFloat(String(x).replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };
    return (rawData || []).map((d) => {
      const codeRaw = pick(d, ["code", "countryCode", "iso2", "stateCode"]);
      const code = norm(codeRaw ?? d?.code ?? "");
      const valueRaw = pick(d, ["value", "Value", "val"]);
      if (effectiveMapType === "choropleth") {
        return { ...d, code, value: toNumber(valueRaw ?? d?.value) };
      }
      const v = valueRaw ?? d?.value;
      return { ...d, code, value: v == null ? "" : String(v) };
    });
  }, [rawData, effectiveMapType]);

  const normalizeGroups = useCallback((groups = []) => {
    return (groups || [])
      .filter(Boolean)
      .map((g) => ({
        ...g,
        countries: (g.countries || [])
          .map((c) => ({
            code: norm(typeof c === "string" ? c : (c?.code ?? c?.countryCode ?? c?.id ?? "")),
          }))
          .filter((c) => c.code),
      }))
      .filter((g) => g.countries.length > 0);
  }, []);

  const derivedGroups = useMemo(() => {
    const hasRanges = Array.isArray(parsedRanges) && parsedRanges.length > 0;
    const hasOldGroups =
      Array.isArray(parsedGroups) &&
      parsedGroups.some((g) => Array.isArray(g?.countries) && g.countries.length > 0);

    if (effectiveMapType === "choropleth") {
      if (hasRanges) {
        const toNum = (x) => {
          const n = typeof x === "number" ? x : parseFloat(String(x).replace(",", "."));
          return Number.isFinite(n) ? n : null;
        };
        const ranges = parsedRanges
          .map((r) => ({ ...r, lower: toNum(r.lowerBound), upper: toNum(r.upperBound) }))
          .filter((r) => r.lower != null && r.upper != null);
        return ranges.map((r) => ({
          label: (r.label ?? r.name ?? `${r.lower}–${r.upper}`).toString(),
          color: r.color,
          hideMapLabels: rangeHidesMapLabels(r),
          countries: data
            .filter((d) => typeof d.value === "number" && d.value >= r.lower && d.value <= r.upper)
            .map((d) => ({ code: d.code })),
        }));
      }
      if (hasOldGroups) return normalizeGroups(parsedGroups);
      return [];
    }

    if (hasOldGroups) return normalizeGroups(parsedGroups);
    const idToGroup = (() => {
      const m = new JSMap();
      (parsedGroups || []).forEach((g) => {
        if (g?.id) m.set(String(g.id), g);
      });
      return m;
    })();
    const nameToGroup = (() => {
      const m = new JSMap();
      (parsedGroups || []).forEach((g) => {
        const name = String(g?.name ?? g?.category ?? g?.label ?? "").trim();
        if (name) m.set(name, g);
      });
      return m;
    })();
    const resolveGroup = (val) =>
      idToGroup.get(String(val ?? "").trim()) ?? nameToGroup.get(String(val ?? "").trim());
    const categoryIds = Array.from(
      new Set(data.map((d) => (d.value == null ? "" : String(d.value).trim())).filter(Boolean))
    );
    return categoryIds.map((catId) => {
      const g = resolveGroup(catId);
      const name = (g?.name ?? g?.category ?? g?.label ?? catId).toString().trim() || "(Unnamed)";
      const color = (g?.color ?? g?.hex ?? "#c0c0c0").toString().trim();
      return {
        name,
        color: color || "#c0c0c0",
        hideMapLabels: rangeHidesMapLabels(g),
        countries: data
          .filter((d) => String(d.value).trim() === catId)
          .map((d) => ({ code: d.code })),
      };
    });
  }, [effectiveMapType, parsedRanges, parsedGroups, data, normalizeGroups]);

  const choroplethMapLabelHiddenCodes = useMemo(() => {
    if (effectiveMapType !== "choropleth") return null;
    const hidden = new Set();
    for (const d of data) {
      const code = norm(d?.code);
      if (!code) continue;
      for (const g of derivedGroups) {
        if (!g.countries?.some((c) => norm(c?.code ?? c) === code)) continue;
        if (g.hideMapLabels) hidden.add(code);
        break;
      }
    }
    return hidden;
  }, [effectiveMapType, derivedGroups, data]);

  const isChoropleth = effectiveMapType === "choropleth";

  const activeLegendCodes = useMemo(() => {
    if (!activeLegendModel) return [];
    const direct = Array.from(activeLegendModel.codes || []).map(norm).filter(Boolean);
    if (direct.length > 0) return direct;
    if (Number.isInteger(activeLegendModel.groupIndex)) {
      const g = derivedGroups[activeLegendModel.groupIndex];
      if (g?.countries?.length) return g.countries.map((c) => norm(c.code)).filter(Boolean);
    }
    const label = (activeLegendModel.label ?? activeLegendModel.name ?? "").toString().trim();
    if (!label) return [];
    const match = (derivedGroups || []).find(
      (g) => String(g?.name ?? g?.label ?? "").trim() === label
    );
    return match?.countries?.map((c) => norm(c.code)).filter(Boolean) ?? [];
  }, [activeLegendModel, derivedGroups]);

  const findValue = useCallback(
    (code) => {
      const d = data.find((x) => norm(x.code) === norm(code));
      const v = d?.value;
      if (v == null || (typeof v === "string" && !v.trim())) return "No data";
      if (effectiveMapType === "categorical" && parsedGroups?.length) {
        const g = parsedGroups.find((x) => String(x?.id) === String(v));
        if (g) return (g.name ?? g.category ?? g.label ?? "").toString().trim() || "(Unnamed)";
      }
      return v;
    },
    [data, effectiveMapType, parsedGroups]
  );

  const findColor = useCallback(
    (code) => {
      for (const g of derivedGroups) {
        if (g.countries?.some((c) => norm(c.code) === norm(code))) return g.color;
      }
      return unassigned_color;
    },
    [derivedGroups, unassigned_color]
  );

  const normalizedPlaceholders = useMemo(() => {
    const out = {};
    const src = placeholders && typeof placeholders === "object" ? placeholders : {};
    for (const [k, v] of Object.entries(src)) {
      out[norm(k)] = v == null ? "" : String(v);
    }
    return out;
  }, [placeholders]);

  const findPlaceholder = useCallback(
    (code) => normalizedPlaceholders[norm(code)] ?? "",
    [normalizedPlaceholders]
  );

  const groupRows = useMemo(() => {
    const rows = (activeLegendCodes || []).map((c) => {
      const code = norm(c);
      const fromData = data.find((d) => norm(d?.code) === code);
      const name =
        (fromData?.name != null && String(fromData.name).trim()) ||
        codeToName?.[code] ||
        code;
      const value = findValue(code);
      return { code, name, value };
    });

    if (!isChoropleth) {
      return rows.sort((a, b) => String(a.name).localeCompare(String(b.name)));
    }

    const toSortable = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
    return rows.sort((a, b) => {
      const av = toSortable(a.value);
      const bv = toSortable(b.value);
      const aNo = av == null;
      const bNo = bv == null;
      if (aNo && bNo) return String(a.name).localeCompare(String(b.name));
      if (aNo) return 1;
      if (bNo) return -1;
      if (av !== bv) return bv - av;
      return String(a.name).localeCompare(String(b.name));
    });
  }, [activeLegendCodes, codeToName, data, findValue, isChoropleth]);

  // Paint
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !svgLoaded) return;
    svg.querySelectorAll("path[id]").forEach((el) => {
      el.style.fill = unassigned_color;
    });
    derivedGroups.forEach(({ countries = [], color }) => {
      countries.forEach(({ code }) => {
        getStateEls(svg, code).forEach((el) => (el.style.fill = color));
      });
    });
  }, [svgLoaded, derivedGroups, unassigned_color]);

  // When custom_map_countries is set, hide states not in the list
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !svgLoaded) return;
    const allowedSet =
      Array.isArray(custom_map_countries) && custom_map_countries.length > 0
        ? new Set(custom_map_countries.map((c) => norm(c)))
        : null;
    svg.querySelectorAll("path[id]").forEach((el) => {
      const code = el.id ? norm(el.id) : "";
      el.style.display = allowedSet ? (code && allowedSet.has(code) ? "" : "none") : "";
    });
  }, [svgLoaded, custom_map_countries]);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const old = svg.querySelector("#mic-region-category-layer");
    if (old) old.remove();
    if (regionMapLabelsMode === "off") return;

    const NS = "http://www.w3.org/2000/svg";
    const layer = document.createElementNS(NS, "g");
    layer.setAttribute("id", "mic-region-category-layer");
    layer.setAttribute("class", cls.regionCategoryLabelLayer);
    layer.setAttribute("pointer-events", "none");

    const codeToLabel = new Map();
    if (regionMapLabelsMode === "value" && effectiveMapType === "choropleth") {
      for (const d of data) {
        const code = norm(d?.code);
        if (!code) continue;
        if (choroplethMapLabelHiddenCodes?.has(code)) continue;
        if (typeof d.value !== "number" || !Number.isFinite(d.value)) continue;
        const lab = formatValue(d.value);
        if (lab && lab !== "No data") codeToLabel.set(code, lab);
      }
    } else {
      for (const grp of derivedGroups) {
        if (grp.hideMapLabels) continue;
        const lab = String(grp?.label ?? grp?.name ?? "").trim();
        if (!lab) continue;
        for (const c of grp.countries || []) {
          const code = norm(c?.code ?? c);
          if (code) codeToLabel.set(code, lab);
        }
      }
    }

    const { fill: labelFill, stroke: strokeCol } = regionCategoryLabelPaint({
      mode: regionCategoryLabelColorMode,
      font_color,
    });
    const customMapAllowed =
      Array.isArray(custom_map_countries) && custom_map_countries.length > 0
        ? new Set(custom_map_countries.map((c) => norm(c)))
        : null;

    for (const [code, text] of codeToLabel) {
      if (customMapAllowed && !customMapAllowed.has(code)) continue;
      const els = getStateEls(svg, code);
      if (!els.length) continue;
      if (Array.from(els).every((el) => el.style.display === "none")) continue;
      const bbox = getBBoxUnion(svg, code);
      if (!bbox || bbox.width < 1 || bbox.height < 1) continue;
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;
      let fs = Math.sqrt(bbox.width * bbox.height) / 8;
      fs = Math.max(8, Math.min(24, fs));
      const fitDiv = code === "HI" ? 2.15 : 3.2;
      fs = Math.min(fs, bbox.width / fitDiv, bbox.height / fitDiv);
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", String(cx));
      t.setAttribute("y", String(cy));
      t.setAttribute("text-anchor", "middle");
      t.setAttribute("dominant-baseline", "middle");
      t.setAttribute("font-size", String(Math.max(6, fs)));
      t.setAttribute("fill", labelFill);
      t.setAttribute("stroke", strokeCol);
      t.setAttribute("stroke-width", String(Math.max(0.2, fs / 22)));
      t.setAttribute("paint-order", "stroke fill");
      let display = text;
      if (display.length > 18) display = `${display.slice(0, 16)}…`;
      t.textContent = display;
      layer.appendChild(t);
    }

    svg.appendChild(layer);
  }, [
    derivedGroups,
    choroplethMapLabelHiddenCodes,
    regionMapLabelsMode,
    effectiveMapType,
    data,
    regionCategoryLabelColorMode,
    font_color,
    svgLoaded,
    custom_map_countries,
  ]);

  const resetView = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    if (selectedCodeRef.current) {
      getStateEls(svg, selectedCodeRef.current).forEach((el) => {
        el.classList.remove(cls.active);
        el.classList.remove(cls.hovered);
      });
    }
    selectedCodeRef.current = null;
    setSelected(null);
    onSelectCode?.(null);
    onHoverCode?.(null);
  }, [onSelectCode, onHoverCode]);

  const clearAll = useCallback(() => {
    resetView();
  }, [resetView]);

  const selectStateByCode = useCallback(
    (code, { zoom = true } = {}) => {
      const svg = svgRef.current;
      if (!svg) return;
      const C = norm(code);
      if (!C) return;
      const els = getStateEls(svg, C);
      const el = els[0];
      if (!el) return;
      const name = el.getAttribute("data-name") || el.getAttribute("name") || C;
      const value = findValue(C);
      const bbox = getBBoxUnion(svg, C) || el.getBBox();
      const color = findColor(C);
      const placeholder = findPlaceholder(C);

      if (selectedCodeRef.current) {
        getStateEls(svg, selectedCodeRef.current).forEach((x) => {
          x.classList.remove(cls.active);
          x.classList.remove(cls.hovered);
        });
      }
      selectedCodeRef.current = C;
      getStateEls(svg, C).forEach((x) => x.classList.add(cls.active));
      setSelected({ code: C, name, value, bbox, color, placeholder });

      if (effectiveStaticView || !zoom) return;
      // Zoom to state: optional, same pattern as Map.js – could wire to TransformWrapper
      // For static preview we skip zoom; full implementation would use wrapperRef.current?.setTransform
    },
    [findValue, findColor, findPlaceholder, effectiveStaticView]
  );

  useEffect(() => {
    if (!selected?.code) return;
    const next = findPlaceholder(selected.code);
    if ((selected.placeholder ?? "") === next) return;
    setSelected((prev) => (prev ? { ...prev, placeholder: next } : prev));
  }, [findPlaceholder, selected?.code, selected?.placeholder]);

  // Sync external selectedCode
  useEffect(() => {
    if (!externalSelectedCode) {
      if (selectedCodeRef.current) resetView();
      return;
    }
    const C = norm(externalSelectedCode);
    if (selectedCodeRef.current === C) return;
    selectStateByCode(C, { zoom: false });
  }, [externalSelectedCode, selectStateByCode, resetView]);

  // Sync hoveredCode
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.querySelectorAll("path[id]").forEach((el) => el.classList.remove(cls.hovered));
    const C = norm(hoveredCode || "");
    if (!C) return;
    getStateEls(svg, C).forEach((el) => el.classList.add(cls.hovered));
  }, [hoveredCode]);

  useEffect(() => {
    applyGroupClass(groupHoveredCodes, cls.groupHovered, groupHoverRef);
  }, [groupHoveredCodes, applyGroupClass, svgLoaded]);

  useEffect(() => {
    applyGroupClass(groupActiveCodes, cls.groupActive, groupActiveRef);
  }, [groupActiveCodes, applyGroupClass, svgLoaded]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const has = (groupActiveCodes || []).length > 0;
    svg.classList.toggle(cls.hasGroupActive, has);
  }, [groupActiveCodes, svgLoaded]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.classList.toggle(cls.hasCountrySelected, !!selected?.code);
  }, [selected?.code, svgLoaded]);

  const handlePathClick = useCallback(
    (e) => {
      const target = e.target;
      if (!target || !target.id) return;
      const code = norm(target.id);
      if (code) {
        onSelectCode?.(code);
        selectStateByCode(code, { zoom: false });
      }
    },
    [onSelectCode, selectStateByCode]
  );

  const handlePathMouseEnter = useCallback(
    (e) => {
      const id = e.target?.id;
      if (id) onHoverCode?.(norm(id));
    },
    [onHoverCode]
  );

  const handlePathMouseLeave = useCallback(() => {
    onHoverCode?.(null);
  }, [onHoverCode]);

  // Attach pointer events to paths after SVG is loaded
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !svgLoaded) return;
    const paths = svg.querySelectorAll("path[id]");
    paths.forEach((path) => {
      path.style.cursor = effectiveStaticView ? "default" : "pointer";
      path.addEventListener("click", handlePathClick);
      path.addEventListener("mouseenter", handlePathMouseEnter);
      path.addEventListener("mouseleave", handlePathMouseLeave);
    });
    return () => {
      paths.forEach((path) => {
        path.removeEventListener("click", handlePathClick);
        path.removeEventListener("mouseenter", handlePathMouseEnter);
        path.removeEventListener("mouseleave", handlePathMouseLeave);
      });
    };
  }, [svgLoaded, effectiveStaticView, handlePathClick, handlePathMouseEnter, handlePathMouseLeave]);

  const handleWrapperClick = useCallback(
    (e) => {
      if (e.target?.closest?.("path[id]")) return;
      clearAll();
    },
    [clearAll]
  );

  const handleGroupRowClick = useCallback(
    (code) => {
      const C = norm(code);
      if (!C) return;
      onCloseActiveLegend?.();
      onSelectCode?.(C);
      selectStateByCode(C, { zoom: false });
    },
    [onCloseActiveLegend, onSelectCode, selectStateByCode]
  );

  const renderGroupInfoBox = () => {
    if ((compactUi && !compactUiShowInfoBoxes) || !activeLegendModel) return null;
    const items = groupRows;
    return (
      <aside className={`${cls.groupBox} ${cls.frostCard}`}>
        <header className={`${cls.groupBoxHeader} ${cls.frostHeader}`}>
          <span
            className={cls.groupDot}
            style={{ background: activeLegendModel.color }}
            aria-hidden="true"
          />
          <div className={cls.groupHeaderText}>
            <h2 className={cls.frostTitle} title={activeLegendModel.label}>
              {activeLegendModel.label}
            </h2>
            <div className={cls.frostSub}>
              {items.length} {items.length === 1 ? "state" : "states"}
            </div>
          </div>
          <button
            onClick={() => onCloseActiveLegend?.()}
            className={cls.closeBtn}
            aria-label="Close group info box"
            type="button"
          >
            ×
          </button>
        </header>

        <div className={`${cls.groupBoxBody} ${cls.frostBody}`}>
          <div className={cls.groupList}>
            {items.map((it) => (
              <button
                key={it.code}
                type="button"
                className={[cls.groupRow, isChoropleth ? cls.groupRow3 : cls.groupRow2].join(" ")}
                onClick={() => handleGroupRowClick(it.code)}
                title="Select state"
              >
                <span className={cls.groupItemCode}>{it.code}</span>
                <span className={cls.groupItemName}>{it.name}</span>
                {isChoropleth ? (
                  <span className={cls.groupItemValue} title={String(it.value ?? "")}>
                    {formatValue(it.value)}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </aside>
    );
  };

  return (
    <div
      className={cls.mapRoot}
      data-theme={isDarkTheme ? "dark" : "light"}
      data-compact-ui={compactUi ? "1" : "0"}
      data-thumbnail={isThumbnail ? "1" : "0"}
    >
      {!suppressInfoBox && selected && (
        <aside className={`${cls.infoBox} ${cls.frostCard}`}>
          <header className={`${cls.infoBoxHeader} ${cls.frostHeader}`}>
            <img
              src={getUsStateFlagUrl(selected.code, 40)}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <h2 className={cls.frostTitle} title={selected.name}>{selected.name}</h2>
            <button
              onClick={resetView}
              className={cls.closeBtn}
              aria-label="Close info box"
              type="button"
            >
              ×
            </button>
          </header>

          <div className={`${cls.infoBoxBody} ${cls.frostBody}`}>
            <div className={cls.valueBlock}>
              <div
                className={[
                  cls.valueRow,
                  selected.placeholder ? cls.valueRowConnected : "",
                ].join(" ")}
                title={String(selected.value ?? "")}
              >
                <span
                  className={cls.swatch}
                  style={{ background: selected.color }}
                  aria-hidden="true"
                />
                <span className={cls.valueText}>{formatValue(selected.value)}</span>
              </div>

              {selected.placeholder ? (
                <div className={cls.valueDescWrap}>
                  <div className={cls.valueDescLine} aria-hidden="true" />
                  <p className={cls.valueDesc}>{selected.placeholder}</p>
                </div>
              ) : null}
            </div>
          </div>
        </aside>
      )}
      {renderGroupInfoBox()}
      <div style={{ position: "relative", width: "100%", minHeight: 360 }}>
        <TransformWrapper
          initialScale={1}
          minScale={0.5}
          maxScale={8}
          centerOnInit
          disabled={effectiveStaticView}
          doubleClick={{ disabled: true }}
        >
          <TransformComponent
            wrapperStyle={{ width: "100%", height: "100%" }}
            contentStyle={{
              width: "100%",
              height: isThumbnail ? "100%" : "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              ref={wrapperRef}
              className={cls.mapWrapper}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: contentTransform,
              }}
              onClick={handleWrapperClick}
              onKeyDown={(e) => e.key === "Escape" && clearAll()}
              role="img"
              aria-label="US States map"
            />
          </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
}
