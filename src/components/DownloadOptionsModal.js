import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { BiDownload, BiImage, BiFile, BiCodeBlock, BiCrop } from "react-icons/bi";
import MapView from "./Map";
import MapCropModal from "./MapCropModal";
import UpgradeProModal from "./UpgradeProModal";
import styles from "./DownloadOptionsModal.module.css";
import { incrementMapDownloadCount } from "../api";
import { viewBoxFromInsets, insetsFromViewBox, VBW, VBH } from "../utils/downloadViewBoxUtils";

const FORMAT_OPTIONS = [
  { value: "jpg", label: "JPG", Icon: BiImage, description: "Smaller file size, ideal for sharing and web." },
  { value: "png", label: "PNG", Icon: BiImage, description: "Sharp edges and transparency support." },
  { value: "pdf", label: "PDF", Icon: BiFile, description: "Vector-friendly, best for printing." },
  { value: "svg", label: "SVG", Icon: BiCodeBlock, description: "Scalable vector, edit in design tools.", pro: true },
];

const LEGEND_POSITION_PRESETS = [
  { id: "upper-left", label: "Upper left", x: 0.02, y: 0.08 },
  { id: "upper-right", label: "Upper right", x: 0.98, y: 0.08 },
  { id: "left", label: "Left", x: 0.02, y: 0.5 },
  { id: "middle", label: "Middle", x: 0.5, y: 0.5 },
  { id: "right", label: "Right", x: 0.98, y: 0.5 },
  { id: "bottom-left", label: "Bottom left", x: 0.02, y: 0.92 },
  { id: "bottom-right", label: "Bottom right", x: 0.98, y: 0.92 },
];

function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);

  return debounced;
}


export default function DownloadOptionsModal({
  isOpen,
  onClose,
  mapData,
  mapDataProps,
  downloadCount,
  isPublic,

  // ✅ new props
  isUserLoggedIn,
  anonId,
  onDownloadCountUpdate,
  isPro,
  onUpgradeToPro,
}) {
  const [format, setFormat] = useState("png"); // "png" | "jpg"
  const [formatSelectOpen, setFormatSelectOpen] = useState(false);
  const formatSelectRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // raster preview state
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBlob, setPreviewBlob] = useState(null);
  const [previewFormat, setPreviewFormat] = useState(null);

  const renderStageRef = useRef(null);
const [mapTransform, setMapTransform] = useState({ x: 0, y: 0, scale: 1 });

const [legendPos, setLegendPos] = useState({ x: 0.02, y: 0.92 }); // default: bottom-left



const [legendSize, setLegendSize] = useState(1.0); // 0.8 .. 1.6 feels good

const [crop, setCrop] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
// meaning: crop.top = % of full VBH to remove from top, etc.
const [cropModalOpen, setCropModalOpen] = useState(false);
const [upgradeProModalOpen, setUpgradeProModalOpen] = useState(false);

const didInitCropRef = useRef(false);

const defaultCropRef = useRef({ top: 0, right: 0, bottom: 0, left: 0 });

const defaultLegendSizeRef = useRef(1.0);
const didInitLegendSizeRef = useRef(false);
const isLegendWidthAutoRef = useRef(true); // ✅ controls mode


const [legendWidthPx, setLegendWidthPx] = useState(null); // null = AUTO
const legendWidthDraftRef = useRef("");                   // empty = AUTO
const [legendWidthDraft, setLegendWidthDraft] = useState("");


const [legendSizeDraft, setLegendSizeDraft] = useState("100"); // percent string
const legendSizeDraftRef = useRef("100");

const [legendXDraft, setLegendXDraft] = useState(String(Math.round(legendPos.x * 100)));
const legendXDraftRef = useRef(legendXDraft);

const [legendYDraft, setLegendYDraft] = useState(String(Math.round(legendPos.y * 100)));
const legendYDraftRef = useRef(legendYDraft);

const defaultLegendWidthRef = useRef(900);
const didInitLegendWidthRef = useRef(false);

const [jpgPreset, setJpgPreset] = useState("high"); // "web" | "high" | "max"
const [transparentBg, setTransparentBg] = useState(false); // pro
const [watermarkOff, setWatermarkOff] = useState(false);   // pro

const [pdfPaper, setPdfPaper] = useState("a4"); // "a4" | "letter"
const [pdfOrientation, setPdfOrientation] = useState("landscape"); // "landscape" | "portrait"

const [legendOn, setLegendOn] = useState(true); // ✅ default ON


const renderParams = useMemo(() => {
  return {
    format,
    legendOn,                 // ✅ add
    legendPos,
    legendWidthPx,
    legendSize,
    crop,
    mapId: mapData?.id,
    title: mapData?.title,
    jpgPreset,
    transparentBg,
    watermarkOff,
    pdfPaper,
    pdfOrientation,
  };
}, [
  format,
  legendOn,                  // ✅ add
  legendPos, legendWidthPx, legendSize, crop,
  jpgPreset, transparentBg, watermarkOff,
  mapData?.id, mapData?.title, pdfPaper, pdfOrientation
]);

const debouncedRenderParams = useDebouncedValue(renderParams, 350);


const clampNum = (n, a, b) => Math.max(a, Math.min(b, n));

const renderInFlightRef = useRef(false);
const pendingRenderRef = useRef(false);

const LEGEND_MIN_W = 120;
/** Max legend width as fraction of export width; longer titles wrap within this. */
const LEGEND_MAX_WIDTH_FRAC = 0.5;
const isProRef = useRef(!!isPro);

useEffect(() => {
  isProRef.current = !!isPro;
}, [isPro]);


useEffect(() => {
  if (!isOpen) return;

    if (!mapData) return;

  // set default legend width to "no wrap"
  const scaleFactor = 3;
  const exportCanvasW = Math.round(VBW * scaleFactor);



  didInitCropRef.current = false; // ✅ IMPORTANT (fixes your bug)
  didInitLegendWidthRef.current = false;
  didInitLegendSizeRef.current = false;


  setIsDownloading(false);
  setFormat("png");

  setPreviewUrl(null);
  setPreviewBlob(null);
  setPreviewFormat(null);

  setPdfPaper("a4");
  setPdfOrientation("landscape");
  setLegendOn(true);
  setWatermarkOff(!!isPro); // Pro: default to watermark off

  setLegendPos({ x: 0.02, y: 0.92 });
  setLegendSizeDraft("100");
legendSizeDraftRef.current = "100";


  // ❌ remove this (causes full-map flash + breaks re-open if init doesn't run)
  // setCrop({ top: 0, right: 0, bottom: 0, left: 0 });

}, [isOpen, isPro]);

useEffect(() => {
  const xStr = String(Math.round(legendPos.x * 100));
  setLegendXDraft(xStr);
  legendXDraftRef.current = xStr;
}, [legendPos.x]);

useEffect(() => {
  const yStr = String(Math.round(legendPos.y * 100));
  setLegendYDraft(yStr);
  legendYDraftRef.current = yStr;
}, [legendPos.y]);

useEffect(() => {
  if (!isOpen) return;
  if (!mapData) return;
  if (didInitCropRef.current) return;

  let cancelled = false;

  const init = async () => {
    // wait for render stage to paint the SVG
    await new Promise((r) => requestAnimationFrame(() => r()));
    await new Promise((r) => requestAnimationFrame(() => r()));

    const container = renderStageRef.current;
    const svg = container?.querySelector("svg");
    if (!svg || cancelled) return;

    const activeCodes = getActiveCodesFromMapData(mapData);
    let bbox = null;
    if (activeCodes.length) bbox = getBBoxUnionForCodesInSvg(svg, activeCodes);

    // If no bbox, default to full map (no insets)
if (!bbox) {
  // ✅ "full map" should still be tight
  const fullBBox = getBBoxAllMapShapes(svg);

  if (fullBBox) {
    const fullVB = buildExportViewBoxDefault(fullBBox, 0.02); // smaller padding for full world
    const fullInsets = insetsFromViewBox(fullVB);

    defaultCropRef.current = fullInsets;
    setCrop(fullInsets);

    if (!didInitLegendWidthRef.current) {
  const scaleFactor = 3;
  const vb = viewBoxFromInsets(fullInsets);
  const exportCanvasW = Math.round(vb.w * scaleFactor);

if (!didInitLegendWidthRef.current) {
  let sizeForWidth = defaultLegendSizeRef.current ?? 1.0;

  if (!didInitLegendSizeRef.current) {
    const s0 = computeAutoLegendSizeFromCrop(fullInsets);
    defaultLegendSizeRef.current = s0;
    didInitLegendSizeRef.current = true;
    setLegendSize(s0);

    const pct = String(Math.round(s0 * 100));
    setLegendSizeDraft(pct);
    legendSizeDraftRef.current = pct;

    sizeForWidth = s0;
  }

  const vb2 = viewBoxFromInsets(fullInsets);
  const exportCanvasW = Math.round(vb2.w * 3);

  const w0 = computeLegendNoWrapWidthPx(mapData, exportCanvasW, sizeForWidth);

  defaultLegendWidthRef.current = w0;
  didInitLegendWidthRef.current = true;

  isLegendWidthAutoRef.current = true;
  setLegendWidthPx(null);
  setLegendWidthDraft(String(w0));
  legendWidthDraftRef.current = String(w0);
}


}

  } else {
    const full = { top: 0, right: 0, bottom: 0, left: 0 };
    defaultCropRef.current = full;
    setCrop(full);
  }

  didInitCropRef.current = true;
  return;
}

const baseVB = buildExportViewBoxDefault(bbox);
const insets = insetsFromViewBox(baseVB);

defaultCropRef.current = insets; // ✅ store default
setCrop(insets);

// ✅ always have a size value available for width calc
let sizeForWidth = defaultLegendSizeRef.current ?? 1.0;

if (!didInitLegendSizeRef.current) {
  const s0 = computeAutoLegendSizeFromCrop(insets);

  defaultLegendSizeRef.current = s0;
  didInitLegendSizeRef.current = true;

  setLegendSize(s0);

  const pct = String(Math.round(s0 * 100));
  setLegendSizeDraft(pct);
  legendSizeDraftRef.current = pct;

  sizeForWidth = s0; // ✅ IMPORTANT (now width can safely use it)
}

if (!didInitLegendWidthRef.current) {
  const vb2 = viewBoxFromInsets(insets);
  const exportCanvasW = Math.round(vb2.w * 3);

  const w0 = computeLegendNoWrapWidthPx(mapData, exportCanvasW, sizeForWidth);

  defaultLegendWidthRef.current = w0;
  didInitLegendWidthRef.current = true;

  // ✅ start in AUTO mode, BUT show the computed number in the input
  isLegendWidthAutoRef.current = true;
  setLegendWidthPx(null);                 // auto render
  setLegendWidthDraft(String(w0));        // show number
  legendWidthDraftRef.current = String(w0);
}


didInitCropRef.current = true;


  };

  init();

  return () => {
    cancelled = true;
  };
}, [isOpen, mapData]);

function sliderPctToValue(sliderPct, min, max, expo = 1.8) {
  const t = clampNum(Number(sliderPct) || 0, 0, 100) / 100;
  const eased = Math.pow(t, expo);
  return min + (max - min) * eased;
}

function valueToSliderPct(value, min, max, expo = 1.8) {
  const v = clampNum(Number(value) || 0, min, max);
  const t = (v - min) / (max - min || 1);
  const inv = Math.pow(clampNum(t, 0, 1), 1 / expo);
  return inv * 100;
}

const round1 = (n) => Math.round(n * 10) / 10;

function computeAutoLegendSizeFromCrop(initialInsets) {
  // We look at how much of the map is still visible after crop.
  // Use BOTH width and height (so tall/narrow crops also reduce size a bit).
  // When the map is smaller (tighter crop), default legend size goes down so the legend doesn't dominate.

  const l = Number(initialInsets?.left ?? 0);
  const r = Number(initialInsets?.right ?? 0);
  const t = Number(initialInsets?.top ?? 0);
  const b = Number(initialInsets?.bottom ?? 0);

  const visibleW = clamp01(1 - (l + r) / 100);
  const visibleH = clamp01(1 - (t + b) / 100);

  // Use the smaller dimension as the limiting factor
  const visible = Math.max(0.18, Math.min(visibleW, visibleH)); // avoid insane crops

  // Stronger curve so small maps get a smaller default legend size
  const exponent = 0.92;
  const eased = Math.pow(visible, exponent);

  // Map eased => legend size: full map => 1, tight crop => ~0.52 (so legend scales with map)
  const MIN = 0.52;
  const MAX = 1;
  const s = MIN + (MAX - MIN) * eased;

  // Allow down to 0.5 so small crops get a proportionally smaller legend
  return Math.max(0.5, Math.min(1.8, round1(s)));
}


function computeAutoLegendWidthFromCrop(initialInsets) {
  const scaleFactor = 3;

  // how wide is the EXPORT actually (after crop)?
  const vb = viewBoxFromInsets(initialInsets);
  const exportCanvasW = Math.round(vb.w * scaleFactor);

  // pick a reasonable default as a fraction of export width
  // (for tight crops this becomes smaller automatically)
  const BASE_FRAC = 0.28; // tweak 0.24..0.32
  const base = Math.round(exportCanvasW * BASE_FRAC);

  // allow much smaller widths (so Nordic crops don’t look insane)
  const MIN = 120;                    // ✅ allows ~100-ish sizes
  const MAX = Math.round(exportCanvasW - 40); // never exceed canvas width

  return Math.max(MIN, Math.min(MAX, base));
}




  // close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setFormatSelectOpen(false);
        if (!isDownloading) onClose?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isDownloading, onClose]);

  // close format dropdown on click outside
  useEffect(() => {
    if (!formatSelectOpen) return;
    const handleClick = (e) => {
      if (formatSelectRef.current && !formatSelectRef.current.contains(e.target)) {
        setFormatSelectOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [formatSelectOpen]);

  // cleanup preview url
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const title = mapData?.title || "Untitled Map";

  const formatInfo = useMemo(
    () => ({
      jpg: { title: "JPG", hint: "Best for sharing (smaller file size)." },
      png: { title: "PNG", hint: "Best for crisp details and complex visuals." },
      svg: { title: "SVG", hint: "Vector export (best for editing and infinite scaling)." },
    }),
    []
  );

  const norm = (c="") => String(c||"").trim().toUpperCase();

function getActiveCodesFromMapData(mapData) {
  const type = String(
    mapData?.mapDataType ?? mapData?.map_data_type ?? mapData?.map_type ?? mapData?.type ?? "choropleth"
  ).toLowerCase();

  // pull data array from wherever you store it
  const raw = mapData?.data ?? mapData?.map_data ?? mapData?.values ?? [];
  const dataArr = Array.isArray(raw) ? raw : (() => {
    try { return JSON.parse(raw); } catch { return []; }
  })();

  if (type === "categorical") {
    // active if it has a non-empty category value
    return dataArr
      .map(d => ({ code: norm(d.code), v: (d.value ?? "").toString().trim() }))
      .filter(x => x.code && x.v)
      .map(x => x.code);
  }

  // choropleth: only codes that actually fall into a defined range
  const ranges = parseJsonArray(mapData?.custom_ranges ?? mapData?.customRanges)
    .map(r => ({
      lo: numOrNull(r.lowerBound ?? r.min ?? r.from ?? r.start ?? r.low ?? r.lower),
      hi: numOrNull(r.upperBound ?? r.max ?? r.to ?? r.end ?? r.high ?? r.upper),
    }))
    .filter(r => r.lo != null && r.hi != null);

  if (!ranges.length) {
    // fallback: treat numeric values as active
    return dataArr
      .map(d => ({ code: norm(d.code), v: Number(String(d.value).replace(",", ".")) }))
      .filter(x => x.code && Number.isFinite(x.v))
      .map(x => x.code);
  }

  return dataArr
    .map(d => ({ code: norm(d.code), v: Number(String(d.value).replace(",", ".")) }))
    .filter(x => x.code && Number.isFinite(x.v))
    .filter(x => ranges.some(r => x.v >= r.lo && x.v < r.hi))
    .map(x => x.code);
}

function getBBoxUnionForCodesInSvg(svgEl, codes) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let found = 0;

  for (const code of codes) {
    const els = svgEl.querySelectorAll(
      `path[id='${code}'], polygon[id='${code}'], rect[id='${code}']`
    );
    els.forEach((el) => {
      try {
        const b = el.getBBox();
        minX = Math.min(minX, b.x);
        minY = Math.min(minY, b.y);
        maxX = Math.max(maxX, b.x + b.width);
        maxY = Math.max(maxY, b.y + b.height);
        found++;
      } catch {}
    });
  }

  if (!found) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}


function buildExportViewBoxDefault(bbox, padFrac = 0.035) {
  const padX = bbox.width * padFrac;
  const padY = bbox.height * padFrac;

  let x0 = bbox.x - padX;
  let y0 = bbox.y - padY;
  let x1 = bbox.x + bbox.width + padX;
  let y1 = bbox.y + bbox.height + padY;

  x0 = clamp(x0, 0, VBW);
  y0 = clamp(y0, 0, VBH);
  x1 = clamp(x1, 0, VBW);
  y1 = clamp(y1, 0, VBH);

  return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
}



  function parseJsonArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === "string") {
    try {
      const parsed = JSON.parse(x);
      return parseJsonArray(parsed);
    } catch {
      return [];
    }
  }
  if (typeof x === "object") {
    const candidates = [
      x.ranges, x.items, x.values, x.data, x.legend, x.groups, x.categories,
      x.custom_ranges, x.customRanges,
    ];
    for (const c of candidates) if (Array.isArray(c)) return c;
  }
  return [];
}

function numOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function getBBoxAllMapShapes(svgEl) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let found = 0;

  // tweak selectors if your map has other stuff
  const els = svgEl.querySelectorAll("path[id], polygon[id], rect[id]");
  els.forEach((el) => {
    try {
      const b = el.getBBox();
      minX = Math.min(minX, b.x);
      minY = Math.min(minY, b.y);
      maxX = Math.max(maxX, b.x + b.width);
      maxY = Math.max(maxY, b.y + b.height);
      found++;
    } catch {}
  });

  if (!found) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

function svgToBlobUrl(svgEl) {
  const svgData = new XMLSerializer().serializeToString(svgEl);
  const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  return { blob, url };
}

function applyWatermarkToSvg(svgEl, vb, text = "mapincolor.com") {
  const ns = "http://www.w3.org/2000/svg";

  const g = document.createElementNS(ns, "g");
  g.setAttribute("opacity", "0.22");

  const t = document.createElementNS(ns, "text");
  const pad = Math.max(10, vb.w * 0.01);

  t.setAttribute("x", String(vb.x + vb.w - pad));
  t.setAttribute("y", String(vb.y + vb.h - pad));
  t.setAttribute("text-anchor", "end");
  t.setAttribute("dominant-baseline", "ideographic");
  t.setAttribute(
    "font-family",
    `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`
  );
  t.setAttribute("font-weight", "700");

  const fontSize = Math.max(10, Math.round(vb.w * 0.015));
  t.setAttribute("font-size", String(fontSize));
  t.setAttribute("fill", "#0f172a");

  t.textContent = text;

  g.appendChild(t);
  svgEl.appendChild(g);
}


function buildLegendItemsFromMapData(mapData) {
  const type = String(
    mapData?.mapDataType ?? mapData?.map_data_type ?? mapData?.map_type ?? mapData?.type ?? "choropleth"
  ).toLowerCase();

  if (type === "categorical") {
    const groups = parseJsonArray(mapData?.groups);

    return groups
      .map((g, idx) => {
        const label =
          (typeof g.title === "string" && g.title.trim())
            ? g.title.trim()
            : (g.name ?? g.label ?? "Group");

        const color =
          g.color ?? g.fill ?? g.hex ?? g.groupColor ?? g.group_color ?? "#e5e7eb";

        return { key: g.id ?? `g-${idx}`, label: String(label), color, idx };
      })
      .filter((x) => x.label);
  }

  // choropleth
  const ranges = parseJsonArray(mapData?.custom_ranges ?? mapData?.customRanges);

  const items = ranges
    .map((r, idx) => {
      const min = numOrNull(r.lowerBound ?? r.min ?? r.from ?? r.start ?? r.low ?? r.lower ?? r.rangeMin);
      const max = numOrNull(r.upperBound ?? r.max ?? r.to ?? r.end ?? r.high ?? r.upper ?? r.rangeMax);

      const color =
        r.color ?? r.fill ?? r.hex ?? r.rangeColor ?? r.range_color ?? "#e5e7eb";

      const label =
        (typeof r.name === "string" && r.name.trim() && r.name.trim()) ||
        (typeof r.title === "string" && r.title.trim() && r.title.trim()) ||
        (typeof r.label === "string" && r.label.trim() && r.label.trim()) ||
        (min != null && max != null ? `${min} – ${max}`
          : min != null ? `≥ ${min}`
          : max != null ? `≤ ${max}`
          : "Range");

      return {
        key: r.id ?? `r-${idx}`,
        label: String(label),
        color,
        sortValue: max != null ? max : min != null ? min : -Infinity,
      };
    })
    .filter((x) => x.label);

  items.sort((a, b) => (b.sortValue ?? -Infinity) - (a.sortValue ?? -Infinity));
  return items;
}

function wrapCanvasText(ctx, text, maxWidth) {
  const raw = String(text || "").trim();
  if (!raw) return [];

  const words = raw.split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";

  const measure = (t) => ctx.measureText(t).width;

  function breakLongWord(word) {
    // break one single too-long word into chunks that fit maxWidth
    const parts = [];
    let chunk = "";

    for (const ch of word) {
      const test = chunk + ch;
      if (measure(test) <= maxWidth || !chunk) {
        chunk = test;
      } else {
        parts.push(chunk);
        chunk = ch;
      }
    }
    if (chunk) parts.push(chunk);
    return parts;
  }

  for (let w of words) {
    // if word alone is too wide, split it into multiple pseudo-words
    if (measure(w) > maxWidth) {
      const pieces = breakLongWord(w);

      for (const p of pieces) {
        const test = line ? `${line} ${p}` : p;
        if (measure(test) <= maxWidth) {
          line = test;
        } else {
          if (line) lines.push(line);
          line = p;
        }
      }
      continue;
    }

    const test = line ? `${line} ${w}` : w;
    if (measure(test) <= maxWidth) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = w;
    }
  }

  if (line) lines.push(line);
  return lines;
}


function roundRectPath(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function clamp01(x) {
  return clamp(x, 0, 1);
}

function computeLegendNoWrapWidthPx(mapData, canvasW, legendSize = 1) {
  const items = buildLegendItemsFromMapData(mapData);
  if (!items.length) return 520;

  // approximate the same sizing logic as drawLegendBoxOnCanvas
  const base0 = Math.max(12, Math.round(Math.min(canvasW, canvasW) * 0.025));
  const s = Math.max(0.5, Math.min(1.8, Number(legendSize) || 1));
  const base = Math.round(base0 * s);

  const outerPad = Math.round(base * 0.9);
  const cardPad = Math.round(base * 0.95);

  const dot = Math.max(6, Math.round(base * 0.7)); /* match drawLegendBoxOnCanvas */
  const gap = Math.round(base * 0.65);
  const rowPadX = Math.round(base * 0.75);

  const itemSize = Math.round(base * 1.05);
  const titleSize = Math.round(base * 1.05);
  const metaSize = Math.round(base * 0.85);

  // measure text
  const measCanvas = document.createElement("canvas");
  const ctx = measCanvas.getContext("2d");

  // longest row label
  ctx.font = `700 ${itemSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const maxLabelW = items.reduce((m, it) => Math.max(m, ctx.measureText(String(it.label || "")).width), 0);

  // title width (your card uses title too)
  ctx.font = `700 ${titleSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const titleW = ctx.measureText(String(mapData?.title || "Untitled Map")).width;

  // "+N more"
  ctx.font = `700 ${metaSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const hiddenCount = Math.max(0, items.length - Math.min(items.length, 10));
  const moreW = hiddenCount ? ctx.measureText(`+${hiddenCount} more`).width : 0;

  // content width required (no wrapping)
  const contentW_fromRows = maxLabelW + dot + gap + rowPadX * 2;
  const contentW = Math.max(contentW_fromRows, titleW, moreW);

  // add card padding
  const desired = Math.ceil(contentW + cardPad * 2);

  const hardMax = Math.round(canvasW - outerPad * 2);
  const hardMin = LEGEND_MIN_W;
  const maxAutoW = Math.round(canvasW * LEGEND_MAX_WIDTH_FRAC);

  return Math.max(hardMin, Math.min(hardMax, Math.min(desired, maxAutoW)));
}


async function exportPdfFromSvg(paramsArg = {}) {
  // dynamic import keeps bundles lighter + avoids SSR surprises
  const { jsPDF } = await import("jspdf");

  // We render the map to a canvas first (as PNG) using your existing pipeline.
  // NOTE: We force a white background for PDF (PDF “transparent” is annoying / inconsistent).
  const params = paramsArg || {};
  const pdfPaperLocal = params.pdfPaper ?? pdfPaper;
  const pdfOrientationLocal = params.pdfOrientation ?? pdfOrientation;

  // ✅ Render a raster canvas using your existing exportFromSvg,
  // but force format="png" and force non-transparent background.
  const out = await exportFromSvg("png", {
    ...params,
    transparentBg: false, // force white bg for PDF
  });

  // Turn blob -> image data url
  const imgUrl = out.url; // blob url
  const img = await loadImage(imgUrl);

  // Create PDF
  const doc = new jsPDF({
    orientation: pdfOrientationLocal, // "landscape" | "portrait"
    unit: "pt",
    format: pdfPaperLocal, // "a4" | "letter"
    compress: true,
  });

  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();

  // simple margins
  const margin = 28; // pt
  const maxW = pageW - margin * 2;
  const maxH = pageH - margin * 2;

  // Fit image to page (preserve aspect ratio)
  const imgW = img.width;
  const imgH = img.height;

  const scale = Math.min(maxW / imgW, maxH / imgH);
  const drawW = imgW * scale;
  const drawH = imgH * scale;

  const x = (pageW - drawW) / 2;
  const y = (pageH - drawH) / 2;

  // Put image in PDF (PNG)
  // jsPDF wants a data URL or raw image data; using the image element is fine via canvas
  const tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = imgW;
  tmpCanvas.height = imgH;
  const tmpCtx = tmpCanvas.getContext("2d");
  tmpCtx.fillStyle = "#ffffff";
  tmpCtx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  tmpCtx.drawImage(img, 0, 0);

  const dataUrl = tmpCanvas.toDataURL("image/png");
  doc.addImage(dataUrl, "PNG", x, y, drawW, drawH);

  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // cleanup raster url we created
  try { URL.revokeObjectURL(out.url); } catch {}

  return { blob: pdfBlob, url: pdfUrl, fmt: "pdf" };
}

function computeBaselineNudgePx(fontPx, userNudgePx) {
  // if user passes a number, treat it as a multiplier when small (like 0.12)
  // or absolute px when large (like 2,3,4)
  if (Number.isFinite(userNudgePx)) {
    // if they pass like 0.1..0.3 assume "ratio"
    if (Math.abs(userNudgePx) <= 0.5) return fontPx * userNudgePx;
    // else assume absolute px
    return userNudgePx;
  }

  // default tuned ratio
  const raw = fontPx * 0.14;

  // clamp so it doesn't go crazy at big sizes
  return Math.max(1, Math.min(raw, fontPx * 0.22));
}

function withHiddenSvgMounted(svgEl, fn) {
  // If it's already in DOM, just run
  if (svgEl.isConnected) return fn();

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-99999px";
  host.style.top = "-99999px";
  host.style.width = "1px";
  host.style.height = "1px";
  host.style.overflow = "hidden";
  host.style.opacity = "0";
  host.style.pointerEvents = "none";

  document.body.appendChild(host);
  host.appendChild(svgEl);

  try {
    return fn();
  } finally {
    host.remove(); // removes svgEl too
  }
}

function addExportLegendToSvg(
  svgEl,
  vb,
  {
    title,
    items,
    pos, // {x:0..1, y:0..1}
    widthPx = null, // raster px, convert via scaleFactor
    size = 1,
    scaleFactor = 3,
  }
) {
  if (!items?.length) return;

  const ns = "http://www.w3.org/2000/svg";
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const s = clamp(Number(size) || 1, 0.5, 1.8);

  // remove prior
  svgEl.querySelector("#export-legend")?.remove();
  svgEl.querySelector("#export-legend-filter")?.remove();

  // measure text via canvas
  const measCanvas = document.createElement("canvas");
  const mctx = measCanvas.getContext("2d");
  const fontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;

  const setFont = (fontPx, weight) => {
    mctx.font = `${weight} ${fontPx}px ${fontFamily}`;
  };

  const measureWidth = (fontPx, weight, text) => {
    setFont(fontPx, weight);
    return mctx.measureText(String(text || "")).width;
  };

  const measureMetrics = (fontPx, weight) => {
    setFont(fontPx, weight);
    const m = mctx.measureText("Mg"); // good tall glyph sample
    // Fallbacks if browser doesn't provide actualBoundingBox*
    const ascent =
      Number.isFinite(m.actualBoundingBoxAscent) ? m.actualBoundingBoxAscent : fontPx * 0.8;
    const descent =
      Number.isFinite(m.actualBoundingBoxDescent) ? m.actualBoundingBoxDescent : fontPx * 0.2;
    return { ascent, descent, glyphH: ascent + descent };
  };

  const wrap = (fontPx, weight, text, maxW) => {
    const raw = String(text || "").trim();
    if (!raw) return [];
    const words = raw.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    const fits = (t) => measureWidth(fontPx, weight, t) <= maxW;

    const breakLongWord = (w) => {
      const parts = [];
      let chunk = "";
      for (const ch of w) {
        const test = chunk + ch;
        if (fits(test) || !chunk) chunk = test;
        else {
          parts.push(chunk);
          chunk = ch;
        }
      }
      if (chunk) parts.push(chunk);
      return parts;
    };

    for (const w of words) {
      if (measureWidth(fontPx, weight, w) > maxW) {
        for (const p of breakLongWord(w)) {
          const test = line ? `${line} ${p}` : p;
          if (fits(test)) line = test;
          else {
            if (line) lines.push(line);
            line = p;
          }
        }
        continue;
      }

      const test = line ? `${line} ${w}` : w;
      if (fits(test)) line = test;
      else {
        if (line) lines.push(line);
        line = w;
      }
    }

    if (line) lines.push(line);
    return lines;
  };

  // tokens in VB units — scale with viewBox so legend doesn't dominate when map is small
  const minDim = Math.min(vb.w, vb.h);
  // Smaller viewBox => smaller base (factor 0.010–0.022) so legend stays proportional
  const sizeFactor = 0.010 + (minDim / 2000) * 0.012;
  const base0 = Math.max(6, Math.round(minDim * Math.min(0.022, sizeFactor)));
  const base = Math.round(base0 * s);

  const outerPad = Math.round(base * 0.9);
  const padX = Math.round(base * 0.95);
  const padY = Math.round(base * 0.6); /* tighter top like overlay header 6px */
  const radius = Math.round(base * 1.25);

  const headerPadBottom = Math.round(base * 0.5); /* same as overlay header bottom */

  const titleSize = Math.round(base * 1.05);
  const itemSize = Math.round(base * 1.05);
  const metaSize = Math.round(base * 0.9);

  const dot = Math.max(4, Math.round(base * 0.7)); /* slightly smaller dot */
  const gap = Math.round(base * 0.65); /* gap dot–text like overlay */

  const rowPadY = Math.round(base * 0.35); /* tighter row padding (4px feel) */
  const rowGap = Math.round(base * 0.2); /* less space between ranges (2px feel) */

  const titleLineH = Math.round(titleSize * 1.18);
  const itemLineH = Math.round(itemSize * 1.18);

  // Content-based width: how wide the legend needs to be for title + longest range label (one line each)
  const maxItemsForMeasure = 10;
  const shownForMeasure = items.slice(0, maxItemsForMeasure);
  const titleWidthOneLine = measureWidth(titleSize, 700, title);
  const maxLabelW = shownForMeasure.length
    ? Math.max(...shownForMeasure.map((it) => measureWidth(itemSize, 700, it.label)))
    : 0;
  const contentNaturalW = Math.ceil(
    Math.max(titleWidthOneLine, maxLabelW + dot + gap) + padX * 2
  );

  // Viewport-based max: full world → narrower legend (smaller fraction); cropped map → wider fraction so legend stays readable
  const fullArea = VBW * VBH;
  const visibleArea = vb.w * vb.h;
  const visibleAreaRatio = Math.min(1, visibleArea / fullArea);
  const maxWidthFrac = 0.14 + (1 - visibleAreaRatio) * 0.22;
  const viewBoxBasedMax = Math.round(vb.w * maxWidthFrac);
  const allowedMaxW = Math.min(viewBoxBasedMax, Math.round(contentNaturalW * 1.15));

  // widthPx comes in raster px — convert to VB units
  const forcedW_vb =
    Number.isFinite(Number(widthPx)) && Number(widthPx) > 0
      ? Math.round(Number(widthPx) / Math.max(1, scaleFactor))
      : null;

  const hardMax = Math.round(vb.w - outerPad * 2);
  const hardMin = Math.min(160, Math.round(vb.w * 0.12));
  const forcedW = forcedW_vb ? clamp(forcedW_vb, hardMin, hardMax) : null;
  const maxW = forcedW ?? Math.min(hardMax, allowedMaxW);

  const maxTitleW = maxW - padX * 2;
  const maxRowTextW = maxW - padX * 2 - (dot + gap);

  // cap items
  const maxItems = 10;
  const shown = items.slice(0, maxItems);
  const hiddenCount = Math.max(0, items.length - shown.length);

  // wrap with maxW first
  const titleLines_cap = wrap(titleSize, 700, title, maxTitleW);
  const rows_cap = shown.map((it) => ({
    ...it,
    lines: wrap(itemSize, 700, it.label, maxRowTextW),
  }));

  const titleW = titleLines_cap.reduce((m, l) => Math.max(m, measureWidth(titleSize, 700, l)), 0);
  const rowW = rows_cap.reduce(
    (m, r) =>
      Math.max(
        m,
        r.lines.reduce((mm, l) => Math.max(mm, measureWidth(itemSize, 700, l)), 0)
      ),
    0
  );
  const moreW = hiddenCount ? measureWidth(metaSize, 650, `+${hiddenCount} more`) : 0;

  const contentW = Math.max(titleW, rowW + dot + gap, moreW);
  const autoW = Math.ceil(contentW + padX * 2);

  const boxW = forcedW ? forcedW : clamp(autoW, hardMin, hardMax);

  // re-wrap to final width
  const finalTitleW = boxW - padX * 2;
  const finalRowTextW = boxW - padX * 2 - (dot + gap);

  const titleLines = wrap(titleSize, 700, title, finalTitleW);
  const rows = shown.map((it) => ({
    ...it,
    lines: wrap(itemSize, 700, it.label, finalRowTextW),
  }));

  // height
  const headerH = titleLines.length ? titleLines.length * titleLineH : 0;
  const dividerBlock = titleLines.length ? headerPadBottom + 1 + Math.round(base * 0.35) : 0;

  const rowsH = rows.reduce((sum, r) => {
    const rowTextH = r.lines.length * itemLineH;
    const rowH = Math.max(dot, rowTextH) + rowPadY * 2;
    return sum + rowH;
  }, 0);

  const rowsGaps = rows.length ? rowGap * (rows.length - 1) : 0;
  const moreH = hiddenCount ? Math.round(metaSize * 1.25) + Math.round(base * 0.35) : 0;

  const boxH = padY + headerH + dividerBlock + rowsH + rowsGaps + moreH + padY;

  // position
  const maxX = vb.x + vb.w - outerPad - boxW;
  const maxY = vb.y + vb.h - outerPad - boxH;

  let x = vb.x + outerPad;
  let y = vb.y + vb.h - outerPad - boxH;

  if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
    x = vb.x + outerPad + pos.x * Math.max(0, maxX - (vb.x + outerPad));
    y = vb.y + outerPad + pos.y * Math.max(0, maxY - (vb.y + outerPad));
    x = clamp(x, vb.x + outerPad, maxX);
    y = clamp(y, vb.y + outerPad, maxY);
  }

  // defs + filter shadow
  const defs =
    svgEl.querySelector("defs") ||
    (() => {
      const d = document.createElementNS(ns, "defs");
      svgEl.insertBefore(d, svgEl.firstChild);
      return d;
    })();

  const filter = document.createElementNS(ns, "filter");
  filter.setAttribute("id", "export-legend-filter");
  filter.setAttribute("x", "-30%");
  filter.setAttribute("y", "-30%");
  filter.setAttribute("width", "160%");
  filter.setAttribute("height", "160%");

  const fe = document.createElementNS(ns, "feDropShadow");
  fe.setAttribute("dx", "0");
  fe.setAttribute("dy", String(Math.round(base * 0.7)));
  fe.setAttribute("stdDeviation", String(Math.round(base * 0.95)));
  fe.setAttribute("flood-color", "rgba(0,0,0,0.18)");
  fe.setAttribute("flood-opacity", "1");
  filter.appendChild(fe);
  defs.appendChild(filter);

  // group
  const g = document.createElementNS(ns, "g");
  g.setAttribute("id", "export-legend");
  g.setAttribute("filter", "url(#export-legend-filter)");

  // card
  const card = document.createElementNS(ns, "rect");
  card.setAttribute("x", String(x));
  card.setAttribute("y", String(y));
  card.setAttribute("width", String(boxW));
  card.setAttribute("height", String(boxH));
  card.setAttribute("rx", String(radius));
  card.setAttribute("ry", String(radius));
  card.setAttribute("fill", "rgba(255,255,255,0.82)");
  card.setAttribute("stroke", "rgba(15,23,42,0.10)");
  card.setAttribute("stroke-width", "1");
  g.appendChild(card);

  const inner = document.createElementNS(ns, "g");
  inner.setAttribute("filter", "none");
  g.appendChild(inner);

  let cy = y + padY;

  // --- Title (metrics-based centering per line)
  if (titleLines.length) {
    const { ascent, descent } = measureMetrics(titleSize, 700);
    const t = document.createElementNS(ns, "text");
    t.setAttribute("fill", "rgba(15,23,42,0.92)");
    t.setAttribute("font-family", fontFamily);
    t.setAttribute("font-weight", "700");
    t.setAttribute("font-size", String(titleSize));
    t.setAttribute("dominant-baseline", "alphabetic");

    // center glyph box inside each title line slot
    // line slot center is (cy + i*titleLineH + titleLineH/2)
    titleLines.forEach((line, i) => {
      const lineCenterY = cy + i * titleLineH + titleLineH / 2;
      const baselineY = lineCenterY + (ascent - descent) / 2;

      const sp = document.createElementNS(ns, "tspan");
      sp.setAttribute("x", String(x + padX));
      sp.setAttribute("y", String(baselineY));
      sp.textContent = line;
      t.appendChild(sp);
    });

    inner.appendChild(t);
    cy += titleLines.length * titleLineH;

    cy += headerPadBottom;

    const div = document.createElementNS(ns, "line");
    div.setAttribute("x1", String(x + padX));
    div.setAttribute("x2", String(x + boxW - padX));
    div.setAttribute("y1", String(cy));
    div.setAttribute("y2", String(cy));
    div.setAttribute("stroke", "rgba(15,23,42,0.08)");
    div.setAttribute("stroke-width", "1");
    inner.appendChild(div);

    cy += Math.round(base * 0.35);
  }

  // --- Rows (metrics-based block centering, small nudge so text aligns with dot)
  const itemMetrics = measureMetrics(itemSize, 700);
  const textNudge = Math.max(0, Math.round(base * 0.08)); /* optical align like overlay margin-top: 1px */

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const textBlockH = r.lines.length * itemLineH;
    const rowH = Math.max(dot, textBlockH) + rowPadY * 2;
    const rowY = cy;

    const contentTop = rowY + rowPadY;
    const contentH = rowH - rowPadY * 2;

    // dot centered
    const cxDot = x + padX + dot / 2;
    const cyDot = contentTop + contentH / 2;

    const c = document.createElementNS(ns, "circle");
    c.setAttribute("cx", String(cxDot));
    c.setAttribute("cy", String(cyDot));
    c.setAttribute("r", String(dot / 2));
    c.setAttribute("fill", r.color || "#e5e7eb");
    c.setAttribute("stroke", "rgba(15,23,42,0.18)");
    c.setAttribute("stroke-width", "1");
    inner.appendChild(c);

    // text (nudge down for optical align with dot)
    const tx = x + padX + dot + gap;

    const text = document.createElementNS(ns, "text");
    text.setAttribute("fill", "rgba(15,23,42,0.90)");
    text.setAttribute("font-family", fontFamily);
    text.setAttribute("font-weight", "700");
    text.setAttribute("font-size", String(itemSize));
    text.setAttribute("dominant-baseline", "alphabetic");

    // Center the whole multi-line block around cyDot, with small nudge
    const blockTop = cyDot - textBlockH / 2 + textNudge;

    for (let j = 0; j < r.lines.length; j++) {
      const lineCenterY = blockTop + (j + 0.5) * itemLineH;
      const baselineY = lineCenterY + (itemMetrics.ascent - itemMetrics.descent) / 2;

      const sp = document.createElementNS(ns, "tspan");
      sp.setAttribute("x", String(tx));
      sp.setAttribute("y", String(baselineY));
      sp.textContent = r.lines[j];
      text.appendChild(sp);
    }

    inner.appendChild(text);

    cy += rowH;
    if (i !== rows.length - 1) cy += rowGap;
  }

  // +N more (metrics centered in its slot)
  if (hiddenCount) {
    cy += Math.round(base * 0.25);

    const { ascent, descent } = measureMetrics(metaSize, 650);
    const more = document.createElementNS(ns, "text");
    more.setAttribute("x", String(x + padX));
    more.setAttribute("fill", "rgba(15,23,42,0.55)");
    more.setAttribute("font-family", fontFamily);
    more.setAttribute("font-weight", "650");
    more.setAttribute("font-size", String(metaSize));
    more.setAttribute("dominant-baseline", "alphabetic");

    // center within one "meta line slot"
    const slotH = Math.round(metaSize * 1.25);
    const lineCenterY = cy + slotH / 2;
    const baselineY = lineCenterY + (ascent - descent) / 2;

    more.setAttribute("y", String(baselineY));
    more.textContent = `+${hiddenCount} more`;
    inner.appendChild(more);
  }

  svgEl.appendChild(g);
}

function drawLegendBoxOnCanvas(
  ctx,
  canvas,
  {
    title,
    items,
    pos, // {x:0..1, y:0..1}
    widthPx = null,
    size = 1,
  }
) {
  if (!items?.length) return;

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const s = clamp(Number(size) || 1, 0.5, 1.8);

  const base0 = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.022));
  const base = Math.round(base0 * s);

  const outerPad = Math.round(base * 0.9);
  const padX = Math.round(base * 0.95);
  const padY = Math.round(base * 0.6); /* tighter top like overlay header 6px */
  const radius = Math.round(base * 1.25);

  const headerPadBottom = Math.round(base * 0.5); /* same as overlay header bottom */
  const dividerH = 1;

  const titleSize = Math.round(base * 1.05);
  const itemSize = Math.round(base * 1.05);
  const metaSize = Math.round(base * 0.9);

  const dot = Math.max(6, Math.round(base * 0.7)); /* slightly smaller dot */
  const gap = Math.round(base * 0.65); /* gap dot–text like overlay */

  const rowPadY = Math.round(base * 0.35); /* tighter row padding (4px feel) */
  const rowGap = Math.round(base * 0.2); /* less space between ranges (2px feel) */

  const titleLineH = Math.round(titleSize * 1.18);
  const itemLineH = Math.round(itemSize * 1.18);

  const fontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;

  const setFont = (fontPx, weight) => {
    ctx.font = `${weight} ${fontPx}px ${fontFamily}`;
  };

  const measureMetrics = (fontPx, weight) => {
    setFont(fontPx, weight);
    const m = ctx.measureText("Mg");
    const ascent =
      Number.isFinite(m.actualBoundingBoxAscent) ? m.actualBoundingBoxAscent : fontPx * 0.8;
    const descent =
      Number.isFinite(m.actualBoundingBoxDescent) ? m.actualBoundingBoxDescent : fontPx * 0.2;
    return { ascent, descent, glyphH: ascent + descent };
  };

  const wrap = (text, maxW, fontPx, weight) => {
    const raw = String(text || "").trim();
    if (!raw) return [];
    const words = raw.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    const measure = (t) => {
      setFont(fontPx, weight);
      return ctx.measureText(t).width;
    };

    const breakLongWord = (w) => {
      const parts = [];
      let chunk = "";
      for (const ch of w) {
        const test = chunk + ch;
        if (measure(test) <= maxW || !chunk) chunk = test;
        else {
          parts.push(chunk);
          chunk = ch;
        }
      }
      if (chunk) parts.push(chunk);
      return parts;
    };

    for (const w of words) {
      if (measure(w) > maxW) {
        for (const p of breakLongWord(w)) {
          const test = line ? `${line} ${p}` : p;
          if (measure(test) <= maxW) line = test;
          else {
            if (line) lines.push(line);
            line = p;
          }
        }
        continue;
      }

      const test = line ? `${line} ${w}` : w;
      if (measure(test) <= maxW) line = test;
      else {
        if (line) lines.push(line);
        line = w;
      }
    }

    if (line) lines.push(line);
    return lines;
  };

  const roundRect = (x, y, w, h, r) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  };

  const maxItems = 10;
  const shown = items.slice(0, maxItems);
  const hiddenCount = Math.max(0, items.length - shown.length);

  const hardMax = Math.round(canvas.width - outerPad * 2);
  const hardMin = Math.min(160, Math.round(canvas.width * 0.2));
  const autoMaxW = Math.round(canvas.width * LEGEND_MAX_WIDTH_FRAC);

  const forcedW =
    Number.isFinite(Number(widthPx)) && Number(widthPx) > 0
      ? clamp(Math.round(Number(widthPx)), hardMin, hardMax)
      : null;

  const maxW = forcedW ?? Math.min(hardMax, autoMaxW);

  const innerW_forTitle = maxW - padX * 2;
  const innerW_forRowText = maxW - padX * 2 - (dot + gap);

  const titleLines_cap = wrap(title, innerW_forTitle, titleSize, 700);
  const rows_cap = shown.map((it) => ({
    ...it,
    lines: wrap(it.label, innerW_forRowText, itemSize, 700),
  }));

  const measureLineMax = (lines, fontPx, weight) => {
    setFont(fontPx, weight);
    return lines.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);
  };

  const titleW = measureLineMax(titleLines_cap, titleSize, 700);
  const rowW = rows_cap.reduce((m, r) => Math.max(m, measureLineMax(r.lines, itemSize, 700)), 0);
  const moreW = hiddenCount ? (() => {
    setFont(metaSize, 650);
    return ctx.measureText(`+${hiddenCount} more`).width;
  })() : 0;

  const contentW = Math.max(titleW, rowW + dot + gap, moreW);
  const autoW = Math.ceil(contentW + padX * 2);

  const boxW = forcedW ? forcedW : clamp(autoW, hardMin, hardMax);

  const innerW_title = boxW - padX * 2;
  const innerW_rowText = boxW - padX * 2 - (dot + gap);

  const titleLines = wrap(title, innerW_title, titleSize, 700);
  const rows = shown.map((it) => ({
    ...it,
    lines: wrap(it.label, innerW_rowText, itemSize, 700),
  }));

  const headerH = titleLines.length ? titleLines.length * titleLineH : 0;
  const dividerGap = titleLines.length ? headerPadBottom : 0;
  const dividerBlock = titleLines.length ? dividerGap + dividerH + Math.round(base * 0.35) : 0;

  const rowsH = rows.reduce((sum, r) => {
    const h = Math.max(dot, r.lines.length * itemLineH);
    return sum + h + rowPadY * 2;
  }, 0);

  const rowsGaps = rows.length ? rowGap * (rows.length - 1) : 0;
  const moreH = hiddenCount ? Math.round(metaSize * 1.25) + Math.round(base * 0.35) : 0;

  const boxH = padY + headerH + dividerBlock + rowsH + rowsGaps + moreH + padY;

  const maxX = canvas.width - outerPad - boxW;
  const maxY = canvas.height - outerPad - boxH;

  let x = outerPad;
  let y = canvas.height - outerPad - boxH;

  if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
    x = outerPad + pos.x * Math.max(0, maxX - outerPad);
    y = outerPad + pos.y * Math.max(0, maxY - outerPad);
    x = clamp(x, outerPad, maxX);
    y = clamp(y, outerPad, maxY);
  }

  // card
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.18)";
  ctx.shadowBlur = Math.round(base * 2.0);
  ctx.shadowOffsetY = Math.round(base * 0.7);

  roundRect(x, y, boxW, boxH, radius);
  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.fill();

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  roundRect(x, y, boxW, boxH, radius);
  ctx.strokeStyle = "rgba(15,23,42,0.10)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();

  let cy = y + padY;

  // title: center glyph box inside each title line slot
  if (titleLines.length) {
    const titleMetrics = measureMetrics(titleSize, 700);

    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.92)";
    setFont(titleSize, 700);
    ctx.textBaseline = "alphabetic";

    for (let i = 0; i < titleLines.length; i++) {
      const lineCenterY = cy + i * titleLineH + titleLineH / 2;
      const baselineY = lineCenterY + (titleMetrics.ascent - titleMetrics.descent) / 2;
      ctx.fillText(titleLines[i], x + padX, baselineY);
    }

    cy += titleLines.length * titleLineH;

    cy += headerPadBottom;

    ctx.beginPath();
    ctx.moveTo(x + padX, cy);
    ctx.lineTo(x + boxW - padX, cy);
    ctx.strokeStyle = "rgba(15,23,42,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();

    cy += Math.round(base * 0.35);
    ctx.restore();
  }

  // rows: center multi-line block around dot center (small nudge so text aligns with dot)
  const itemMetrics = measureMetrics(itemSize, 700);
  const textNudge = Math.max(0, Math.round(base * 0.08)); /* optical align like overlay margin-top: 1px */

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];

    const textBlockH = r.lines.length * itemLineH;
    const rowH = Math.max(dot, textBlockH) + rowPadY * 2;
    const rowY = cy;

    const contentTop = rowY + rowPadY;
    const contentH = rowH - rowPadY * 2;
    const centerY = contentTop + contentH / 2;

    // dot
    const dotX = x + padX;
    const dotY = contentTop + (contentH - dot) / 2;

    ctx.save();
    ctx.beginPath();
    ctx.arc(dotX + dot / 2, dotY + dot / 2, dot / 2, 0, Math.PI * 2);
    ctx.fillStyle = r.color || "#e5e7eb";
    ctx.fill();
    ctx.strokeStyle = "rgba(15,23,42,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // text (nudge down for optical align with dot)
    const tx = dotX + dot + gap;
    const blockTop = centerY - textBlockH / 2 + textNudge;

    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.90)";
    setFont(itemSize, 700);
    ctx.textBaseline = "alphabetic";

    for (let j = 0; j < r.lines.length; j++) {
      const lineCenterY = blockTop + (j + 0.5) * itemLineH;
      const baselineY = lineCenterY + (itemMetrics.ascent - itemMetrics.descent) / 2;
      ctx.fillText(r.lines[j], tx, baselineY);
    }

    ctx.restore();

    cy += rowH;
    if (i !== rows.length - 1) cy += rowGap;
  }

  // +N more
  if (hiddenCount) {
    cy += Math.round(base * 0.25);

    const metaMetrics = measureMetrics(metaSize, 650);
    const slotH = Math.round(metaSize * 1.25);
    const lineCenterY = cy + slotH / 2;
    const baselineY = lineCenterY + (metaMetrics.ascent - metaMetrics.descent) / 2;

    ctx.save();
    ctx.fillStyle = "rgba(15,23,42,0.55)";
    setFont(metaSize, 650);
    ctx.textBaseline = "alphabetic";
    ctx.fillText(`+${hiddenCount} more`, x + padX, baselineY);
    ctx.restore();
  }
}




  // ─────────────────────────────────────────────
  // Export helpers (moved from MapDetail)
  // ─────────────────────────────────────────────

  function canvasToBlob(canvas, type = "image/png", quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) reject(new Error("canvas.toBlob returned null (canvas may be tainted)."));
          else resolve(blob);
        },
        type,
        quality
      );
    });
  }

  // ✅ cache across renders
const logoDataUrlRef = { current: null };
const logoDimsRef = { current: null }; // { w, h }

async function getLogoDataUrlAndDims(src = "/assets/3-0/mic-logo-2-5-text-cropped.png") {
  if (logoDataUrlRef.current && logoDimsRef.current) {
    return { dataUrl: logoDataUrlRef.current, dims: logoDimsRef.current };
  }

  // fetch => blob => dataURL (so SVG export is self-contained)
  const res = await fetch(src);
  if (!res.ok) throw new Error(`Logo fetch failed: ${res.status}`);

  const blob = await res.blob();

  const dataUrl = await new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result);
    fr.onerror = reject;
    fr.readAsDataURL(blob);
  });

  // get intrinsic dimensions (for aspect ratio)
  const img = await new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = dataUrl;
  });

  logoDataUrlRef.current = dataUrl;
  logoDimsRef.current = { w: img.width, h: img.height };

  return { dataUrl, dims: logoDimsRef.current };
}

function applyLogoWatermarkToSvg(svgEl, vb, { dataUrl, dims, opacity = 0.22 } = {}) {
  const ns = "http://www.w3.org/2000/svg";

  // remove previous logo watermark if any
  svgEl.querySelector("#mic-logo-watermark")?.remove();

  if (!dataUrl || !dims?.w || !dims?.h) return;

  const g = document.createElementNS(ns, "g");
  g.setAttribute("id", "mic-logo-watermark");
  g.setAttribute("opacity", String(opacity));

  // sizing in viewBox units
  const pad = Math.max(8, vb.w * 0.012);

  // tweak this to taste:
  const targetW = vb.w * 0.34; // ✅ logo width as fraction of export width (try 0.28..0.40)
  const targetH = targetW * (dims.h / dims.w);

  const x = vb.x + (vb.w - targetW) / 2;
  const y = vb.y + vb.h - targetH - pad;

  const img = document.createElementNS(ns, "image");
  img.setAttribute("href", dataUrl); // modern
  img.setAttribute("x", String(x));
  img.setAttribute("y", String(y));
  img.setAttribute("width", String(targetW));
  img.setAttribute("height", String(targetH));
  img.setAttribute("preserveAspectRatio", "xMidYMid meet");

  g.appendChild(img);
  svgEl.appendChild(g);
}

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function wrapTextIntoLines(str, fontSize, maxWidth, fontWeight = "normal") {
    const words = String(str || "").trim().split(/\s+/).filter(Boolean);
    if (!words.length) return [];

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${fontWeight} ${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto','Oxygen','Ubuntu','Cantarell','Fira Sans','Droid Sans','Helvetica Neue', sans-serif`;

    const measure = (t) => ctx.measureText(t).width;

    const lines = [];
    let currentLine = "";

    for (const word of words) {
      if (!currentLine) {
        currentLine = word;
        continue;
      }
      const test = `${currentLine} ${word}`;
      if (measure(test) > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = test;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

const exportFromSvg = useCallback(
  async (formatArg, paramsArg) => {
    const fmt = formatArg || "png";
    const params = paramsArg || {};

    const container = renderStageRef.current;
    if (!container) throw new Error("Missing render stage.");

    const originalSvg = container.querySelector("svg");
    if (!originalSvg) throw new Error("Could not find SVG in modal preview.");

    const svgClone = originalSvg.cloneNode(true);

    const cropLocal = params.crop ?? crop;
    const legendPosLocal = params.legendPos ?? legendPos;
    const legendWidthPxLocal = params.legendWidthPx ?? legendWidthPx;
    const legendSizeLocal = params.legendSize ?? legendSize;

    const jpgPresetLocal = params.jpgPreset ?? jpgPreset;
    const transparentBgLocal = !!(params.transparentBg ?? transparentBg);
    const watermarkOffLocal = !!(params.watermarkOff ?? watermarkOff);

    const effectiveTransparent = isProRef.current ? transparentBgLocal : false;
    const effectiveWatermarkOff = isProRef.current ? watermarkOffLocal : false;

    const effectiveJpgPreset =
      isProRef.current ? jpgPresetLocal : (jpgPresetLocal === "max" ? "high" : jpgPresetLocal);

    const legendOnLocal = params.legendOn ?? legendOn;
    const effectiveLegendOn = !!legendOnLocal; // no pro gating


    // ✅ crop (same as you already do)
    const vb = viewBoxFromInsets(cropLocal);
    svgClone.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

    // ✅ your foreignObject => text conversion (same as you already do)
    // ... keep your existing section ...

    // ✅ remove junk labels (same as you already do)
    svgClone.querySelectorAll(".circlexx, .subxx, .noxx, .unxx").forEach((el) => el.remove());

    // ✅ inline computed styles (same as you already do)
    svgClone.querySelectorAll("*").forEach((el) => {
      const computed = window.getComputedStyle(el);
      const tag = el.tagName?.toLowerCase();

      if (["path", "polygon", "circle", "rect"].includes(tag)) {
        el.setAttribute("stroke", computed.stroke || "#4b4b4b");
        el.setAttribute("stroke-width", computed.strokeWidth || "0.5");
        if (computed.fill && computed.fill !== "none") el.setAttribute("fill", computed.fill);
      }

      if (tag === "text") {
        el.setAttribute(
          "font-family",
          `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`
        );
        if (el.closest("#legend")) el.setAttribute("font-weight", "700");
        else el.setAttribute("font-weight", "700");
      }
    });

    // ✅ transparent background for SVG export (if pro)
    if (fmt === "svg" && effectiveTransparent) {
      // remove big background rect fills (heuristic)
      svgClone.querySelectorAll("rect").forEach((r) => {
        const fill = (r.getAttribute("fill") || "").toLowerCase();
        if (fill && fill !== "none" && fill !== "transparent") {
          r.setAttribute("fill", "none");
        }
      });
    }

// ✅ Add export legend AS REAL SVG (before returning)
if (fmt === "svg") {
  if (effectiveLegendOn) {
    try {
      const legendItems = buildLegendItemsFromMapData(mapData);

      addExportLegendToSvg(svgClone, vb, {
        title: mapData?.title || "Untitled Map",
        items: legendItems,
        pos: legendPosLocal,
        widthPx: legendWidthPxLocal,
        size: legendSizeLocal,
        scaleFactor: 3,
        textNudgePx: 8
      });
    } catch (e) {
      console.warn("SVG legend render failed:", e);
    }
  }

  // ✅ logo watermark (self-contained data URL)
  if (!effectiveWatermarkOff) {
    try {
      const { dataUrl, dims } = await getLogoDataUrlAndDims(
        "/assets/3-0/mic-logo-2-5-text-cropped.png"
      );
      applyLogoWatermarkToSvg(svgClone, vb, { dataUrl, dims, opacity: 0.22 });
    } catch (e) {
      console.warn("SVG logo watermark failed:", e);
      // fallback to text if you want
      // applyWatermarkToSvg(svgClone, vb, "mapincolor.com");
    }
  }

  const out = svgToBlobUrl(svgClone);
  return { blob: out.blob, url: out.url, fmt: "svg" };
}


    svgClone.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);

    // 1) foreignObject title => real <text> (your logic)
    const foreignObject = svgClone.querySelector("foreignObject");
    if (foreignObject) {
      const div = foreignObject.querySelector("div");
      const titleText = div ? div.textContent.trim() : "";

      const x = parseFloat(foreignObject.getAttribute("x") || "170");
      const y = parseFloat(foreignObject.getAttribute("y") || "100");
      const width = parseFloat(foreignObject.getAttribute("width") || "250");
      const dbFontSize = mapData?.title_font_size || 28;

      foreignObject.remove();

      const lines = wrapTextIntoLines(titleText, dbFontSize, width, "bold");

      const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textElement.setAttribute("x", String(x));
      textElement.setAttribute("y", String(y));
      textElement.setAttribute("dominant-baseline", "hanging");
      textElement.setAttribute("fill", mapData?.font_color || "#333");
      textElement.setAttribute("font-weight", "700");
      textElement.setAttribute("font-size", String(dbFontSize));
      textElement.setAttribute(
        "font-family",
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen','Ubuntu', 'Cantarell', 'Fira Sans','Droid Sans','Helvetica Neue', sans-serif"
      );

      lines.forEach((line, index) => {
        const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        tspan.setAttribute("x", String(x));
        const lineHeight = dbFontSize * 1.2;
        tspan.setAttribute("y", String(y + index * lineHeight));
        tspan.textContent = line;
        textElement.appendChild(tspan);
      });

      svgClone.appendChild(textElement);
    }

    // 3) remove labels you don’t want
    svgClone.querySelectorAll(".circlexx, .subxx, .noxx, .unxx").forEach((el) => el.remove());

    // 4) inline computed styles so export matches what user sees
    svgClone.querySelectorAll("*").forEach((el) => {
      const computed = window.getComputedStyle(el);

      const tag = el.tagName?.toLowerCase();
      if (["path", "polygon", "circle"].includes(tag)) {
        el.setAttribute("stroke", computed.stroke || "#4b4b4b");
        el.setAttribute("stroke-width", computed.strokeWidth || "0.5");
        if (computed.fill && computed.fill !== "none") el.setAttribute("fill", computed.fill);
      }

      if (tag === "text") {
        el.setAttribute(
          "font-family",
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto','Oxygen','Ubuntu','Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
        );
        if (el.closest("#legend")) el.setAttribute("font-weight", "700");
        else el.setAttribute("font-weight", "700");
      }
    });

    if (fmt === "png" && effectiveTransparent) {
  // Try removing common background rects (adjust selectors if needed)
  svgClone.querySelectorAll("rect").forEach((r) => {
    const fill = (r.getAttribute("fill") || "").toLowerCase();
    // heuristic: remove big background fills
    if (fill && fill !== "none" && fill !== "transparent") {
      r.setAttribute("fill", "none");
    }
  });

  // Also remove any element you KNOW is your ocean/background if you have ids/classes
  // e.g. svgClone.querySelector("#ocean")?.setAttribute("fill", "none");
}


    // 5) svg -> image -> canvas
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);

    const svgImg = await loadImage(svgUrl);
    URL.revokeObjectURL(svgUrl);

    // ✅ export size follows cropped viewBox (your crop fix)
    const scaleFactor = 3;
    const width = Math.round(vb.w * scaleFactor);
    const height = Math.round(vb.h * scaleFactor);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

  // Background fill:
// - JPG must be opaque
// - PNG should be white unless "Transparent background" is enabled (pro)
if (fmt === "jpg" || (fmt === "png" && !effectiveTransparent)) {
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}


    ctx.drawImage(svgImg, 0, 0, canvas.width, canvas.height);

    // ✅ Legend box (export overlay) using params
  if (effectiveLegendOn) {
  try {
    const legendItems = buildLegendItemsFromMapData(mapData);

    drawLegendBoxOnCanvas(ctx, canvas, {
      title: mapData?.title || "Untitled Map",
      items: legendItems,
      anchor: "bottom-left",
      pos: legendPosLocal,
      widthPx: legendWidthPxLocal,
      size: legendSizeLocal,
      textNudgePx: 8,
    });
  } catch {
    // ignore
  }
}


    // watermark logo (bottom-center)
    const smallerSide = Math.min(canvas.width, canvas.height);
    const padding = 20;
    if (!effectiveWatermarkOff) {
      try {
        const logoImg = await loadImage("/assets/3-0/mic-logo-2-5-text-cropped.png");
        const logoRatio = 0.8;
        const logoWidth = smallerSide * logoRatio;
        const logoHeight = logoImg.height * (logoWidth / logoImg.width);

        const x = (canvas.width - logoWidth) / 2;
        const y = canvas.height - logoHeight - padding;

        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.drawImage(logoImg, x, y, logoWidth, logoHeight);
        ctx.restore();
      } catch {
        // ignore
      }
    }

    // output
    const mime = fmt === "jpg" ? "image/jpeg" : "image/png";
    let quality;
    if (fmt === "jpg") {
      quality =
        effectiveJpgPreset === "web" ? 0.80 :
        effectiveJpgPreset === "max" ? 0.98 :
        0.92; // high (default)
    }


    const blob = await canvasToBlob(canvas, mime, quality);
    const url = URL.createObjectURL(blob);

    return { blob, url, fmt };
  },
  // ✅ only depends on mapData (and helpers already in closure)
  [crop, legendPos, legendWidthPx, legendSize, jpgPreset, transparentBg, watermarkOff, mapData]
);

  // ✅ Build the raster preview whenever modal opens / format changes / map changes
  useEffect(() => {
    if (!isOpen) return;
    if (!mapData) return;

    

    let cancelled = false;

    const run = async () => {
      setIsRenderingPreview(true);

      // ensure MapView rendered
      await new Promise((r) => requestAnimationFrame(() => r()));

      try {
       const previewFmt = format === "pdf" ? "png" : format;
      const { blob, url, fmt } = await exportFromSvg(previewFmt, debouncedRenderParams);



        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        // swap url safely
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
        setPreviewBlob(blob);
        setPreviewFormat(fmt);
      } catch (e) {
        console.error("Preview render failed:", e);
        setPreviewUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return null;
        });
        setPreviewBlob(null);
        setPreviewFormat(null);
      } finally {
        if (!cancelled) setIsRenderingPreview(false);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [isOpen, mapData, format, exportFromSvg, debouncedRenderParams]);

  // ✅ click download: reuse the exact same blob currently previewed
const handleDownload = async () => {
  if (isDownloading) return;
  if (format === "svg" && !isPro) {
    setUpgradeProModalOpen(true);
    return;
  }
  setIsDownloading(true);

  

  try {
    const safeTitle = (mapData?.title || "map").trim() || "map";

    if (format === "pdf") {
      // ✅ Always generate a PDF on demand
      const out = await exportPdfFromSvg(debouncedRenderParams);
      downloadBlob(out.blob, `${safeTitle}.pdf`);
      try { URL.revokeObjectURL(out.url); } catch {}

    } else {
  let blob = previewBlob;
  let fmt = previewFormat;

  if (!blob || fmt !== format) {
    const out = await exportFromSvg(format, debouncedRenderParams);
    blob = out.blob;
    fmt = out.fmt;
  }

  const ext =
    fmt === "jpg" ? "jpg" :
    fmt === "svg" ? "svg" :
    "png";

  downloadBlob(blob, `${safeTitle}.${ext}`);
}


    // increment download count (unchanged)
    try {
      const payload = isUserLoggedIn ? {} : { anon_id: anonId };
      const res = await incrementMapDownloadCount(mapData.id, payload);
      if (res?.data?.download_count != null) {
        onDownloadCountUpdate?.(res.data.download_count);
      }
    } catch (err) {
      console.error("Error incrementing download:", err);
    }

    

    onClose?.();
  } finally {
    setIsDownloading(false);
  }
};


  if (!isOpen) return null;

  const renderFormatOptions = () => {
  if (format === "jpg") {
    return (
      <div className={styles.formatPanel}>
        <div className={styles.expandTitle}>JPG quality</div>

        <div className={styles.jpgQualityGrid}>
          <div className={styles.jpgQualityRow}>
            {/* Web */}
            <button
              type="button"
              className={`${styles.subRow} ${jpgPreset === "web" ? styles.subRowActive : ""}`}
              disabled={isDownloading}
              onClick={() => setJpgPreset("web")}
            >
              <div className={styles.subLeft}>
                <div className={styles.subName}>Web</div>
                <div className={styles.subDesc}>Fast export, lightweight file.</div>
              </div>
              <div className={styles.subRight}>
                <span className={styles.subMeta}>80%</span>
              </div>
            </button>

            {/* High (default) */}
            <button
              type="button"
              className={`${styles.subRow} ${jpgPreset === "high" ? styles.subRowActive : ""}`}
              disabled={isDownloading}
              title="Default"
              onClick={() => setJpgPreset("high")}
            >
              <div className={styles.subLeft}>
                <div className={styles.subName}>
                  High <span className={styles.defaultPill}>Default</span>
                </div>
                <div className={styles.subDesc}>Best balance: sharp + smaller.</div>
              </div>
              <div className={styles.subRight}>
                <span className={styles.subMeta}>92%</span>
              </div>
            </button>
          </div>

          {/* Max (pro) - full width below */}
          <button
            type="button"
            className={`${styles.subRow} ${styles.subRowPro} ${jpgPreset === "max" ? styles.subRowActive : ""}`}
            disabled={isDownloading}
            onClick={() => (isPro ? setJpgPreset("max") : setUpgradeProModalOpen(true))}
            title={!isPro ? "Pro feature" : undefined}
          >
            <div className={styles.subLeft}>
              <div className={styles.subName}>
                Max{" "}
                {!isPro && (
                  <img
                    className={styles.proBadge}
                    src="/assets/3-0/PRO-label.png"
                    alt="Pro"
                  />
                )}
              </div>
              <div className={styles.subDesc}>Highest quality, biggest file.</div>
            </div>
            <div className={styles.subRight}>
              <span className={styles.subMeta}>98%</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (format === "png") {
    return (
      <div className={styles.formatPanel}>
        <div className={styles.expandTitle}>PNG options</div>

        <div
          className={styles.toggleRow}
          onClick={(e) => {
            if (!isPro && !isDownloading) {
              e.preventDefault();
              setUpgradeProModalOpen(true);
            }
          }}
          role={!isPro ? "button" : undefined}
          aria-label={!isPro ? "Transparent background — Pro feature" : undefined}
        >
          <div className={styles.toggleLeft}>
            <div className={styles.toggleName}>
              Transparent background{" "}
              {!isPro && (
                <img
                  className={styles.proBadge}
                  src="/assets/3-0/PRO-label.png"
                  alt="Pro"
                />
              )}
            </div>
            <div className={styles.toggleDesc}>
              Export without a background fill.
            </div>
          </div>

          <label className={styles.switch} aria-label="Transparent background" onClick={(e) => !isPro && e.preventDefault()}>
            <input
              type="checkbox"
              checked={transparentBg}
              onChange={(e) => (isPro ? setTransparentBg(e.target.checked) : null)}
              disabled={!isPro || isDownloading}
            />
            <span className={styles.slider} />
          </label>
        </div>
      </div>
    );
  }

    if (format === "pdf") {
    return (
      <div className={styles.formatPanel}>
        <div className={styles.expandTitle}>PDF options</div>

        <div className={styles.subList}>
          {/* Paper size */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleLeft}>
              <div className={styles.toggleName}>Paper</div>
              <div className={styles.toggleDesc}>A4 or US Letter</div>
            </div>

            <div className={styles.selectWrap} style={{ width: 160 }}>
              <select
                className={styles.select}
                value={pdfPaper}
                onChange={(e) => setPdfPaper(e.target.value)}
                disabled={isDownloading}
                aria-label="PDF paper size"
              >
                <option value="a4">A4</option>
                <option value="letter">Letter</option>
              </select>
              <span className={styles.selectChevron} aria-hidden="true">▾</span>
            </div>
          </div>

          {/* Orientation */}
          <div className={styles.toggleRow}>
            <div className={styles.toggleLeft}>
              <div className={styles.toggleName}>Orientation</div>
              <div className={styles.toggleDesc}>Landscape or portrait</div>
            </div>

            <div className={styles.selectWrap} style={{ width: 160 }}>
              <select
                className={styles.select}
                value={pdfOrientation}
                onChange={(e) => setPdfOrientation(e.target.value)}
                disabled={isDownloading}
                aria-label="PDF orientation"
              >
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
              </select>
              <span className={styles.selectChevron} aria-hidden="true">▾</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ SVG: no format-specific settings
  if (format === "svg") return null;

  return null;
};




  
  return (
    <>
      {createPortal(
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (isDownloading) return;
            if (e.target !== e.currentTarget) return;
            onClose?.();
          }}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Top bar */}
        <div className={styles.topRow}>
          <div className={styles.titleWrap}>
            <div className={styles.title}>Download</div>
            <div className={styles.sub}>
              {title}
              <span className={styles.dot}>•</span>
              {isPublic ? `Public • ${downloadCount ?? 0} downloads` : "Private"}
            </div>
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={() => {
              if (isDownloading) return;
              onClose?.();
            }}
            aria-label="Close"
            disabled={isDownloading}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* LEFT: preview + legend + crop */}
          <div className={styles.leftColumn}>
          <div className={styles.previewCard} aria-label="Download preview">
            <div className={styles.previewTitle}>Preview</div>
            <div className={styles.previewFrame}>
              <div className={styles.previewInner}>
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    className={styles.previewImage}
                  />
                ) : (
                  <div className={styles.previewSkeleton} />
                )}

                {isRenderingPreview && (
                  <div className={styles.previewOverlay}>
                    <span className={styles.spinner} aria-hidden="true" />
                    <div className={styles.previewOverlayText}>Rendering…</div>
                  </div>
                )}

                {/* ✅ hidden render stage that produces the SVG used for export */}
                <div className={styles.renderStage} ref={renderStageRef} aria-hidden="true">
                  <MapView
                    {...mapDataProps()}
                      staticView={true}
                    isLargeMap={false}
                    hoveredCode={null}
                    selectedCode={null}
                    selectedCodeZoom={false}
                    selectedCodeNonce={0}
                    groupHoveredCodes={[]}
                    groupActiveCodes={[]}
                    suppressInfoBox={true}
                    activeLegendModel={null}
                    onCloseActiveLegend={() => {}}
                    onHoverCode={() => {}}
                    onSelectCode={() => {}}
                      onTransformChange={(t) => setMapTransform(t)}   // ✅ IMPORTANT
                  />
                </div>
              </div>
            </div>
            {/* Single row: Position | Size | Crop map (all same box style) */}
            <div className={styles.previewSettingsRow}>
              <div className={styles.previewSettingsLegendGroup}>
                <div className={`${styles.previewSettingsLegendInner} ${!legendOn ? styles.controlsCardDisabled : ""}`} aria-disabled={!legendOn}>
                  <label className={styles.previewLegendPositionLabel}>Position</label>
                  <select
                      value={(() => {
                        const dist = (p) => (p.x - legendPos.x) ** 2 + (p.y - legendPos.y) ** 2;
                        const closest = LEGEND_POSITION_PRESETS.reduce((a, b) => dist(a) <= dist(b) ? a : b);
                        return closest.id;
                      })()}
                      onChange={(e) => {
                        const preset = LEGEND_POSITION_PRESETS.find((p) => p.id === e.target.value);
                        if (preset) {
                          setLegendPos({ x: preset.x, y: preset.y });
                          setLegendXDraft(String(Math.round(preset.x * 100)));
                          setLegendYDraft(String(Math.round(preset.y * 100)));
                          legendXDraftRef.current = String(Math.round(preset.x * 100));
                          legendYDraftRef.current = String(Math.round(preset.y * 100));
                        }
                      }}
                      disabled={isDownloading || !legendOn}
                      className={styles.previewLegendPositionSelect}
                      aria-label="Legend position"
                    >
                      {LEGEND_POSITION_PRESETS.map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                </div>
                <div className={`${styles.previewSettingsLegendInner} ${!legendOn ? styles.controlsCardDisabled : ""}`} aria-disabled={!legendOn}>
                  <label className={styles.previewLegendPositionLabel}>Size</label>
                  <div className={styles.stepper}>
                      <button
                        type="button"
                        className={styles.stepperBtn}
                        disabled={isDownloading || !legendOn || Math.round(legendSize * 100) <= 50}
                        onClick={() => {
                          const n = Math.max(50, Math.min(180, Math.round(legendSize * 100) - 5));
                          setLegendSize(n / 100);
                          setLegendSizeDraft(String(n));
                          legendSizeDraftRef.current = String(n);
                        }}
                        aria-label="Decrease legend size"
                      >
                        −
                      </button>
                      <span className={styles.stepperDisplay}>{Math.round(legendSize * 100)}%</span>
                      <button
                        type="button"
                        className={styles.stepperBtn}
                        disabled={isDownloading || !legendOn || Math.round(legendSize * 100) >= 180}
                        onClick={() => {
                          const n = Math.max(50, Math.min(180, Math.round(legendSize * 100) + 5));
                          setLegendSize(n / 100);
                          setLegendSizeDraft(String(n));
                          legendSizeDraftRef.current = String(n);
                        }}
                        aria-label="Increase legend size"
                      >
                        +
                      </button>
                    </div>
                </div>
              </div>
              <div className={styles.previewSettingsDivider} aria-hidden="true" />
              <div className={styles.previewSettingsCropWrap}>
                <div className={styles.previewSettingsLegendInner}>
                  <button
                    type="button"
                    className={styles.previewSettingsCropBtn}
                    onClick={() => setCropModalOpen(true)}
                    disabled={isDownloading}
                    aria-label="Crop map"
                  >
                    <BiCrop className={styles.previewSettingsCropBtnIcon} aria-hidden="true" />
                    Crop map
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>

        {/* RIGHT: format + download */}
        <div className={styles.options}>
          <div className={styles.optionsScroll}>
  <div className={styles.sectionTitle}>Format</div>

  <div className={styles.formatSelectWrap} ref={formatSelectRef}>
    <select
      aria-label="Download format"
      value={format}
      onChange={(e) => {
        const next = e.target.value;
        if (next === "svg" && !isPro) {
          setUpgradeProModalOpen(true);
          return;
        }
        setFormat(next);
      }}
      disabled={isDownloading}
      className={styles.formatSelectNative}
      tabIndex={-1}
    >
      {FORMAT_OPTIONS.map(({ value, label }) => (
        <option key={value} value={value}>{label}</option>
      ))}
    </select>
    <button
      type="button"
      className={styles.formatSelectTrigger}
      onClick={() => !isDownloading && setFormatSelectOpen((o) => !o)}
      disabled={isDownloading}
      aria-haspopup="listbox"
      aria-expanded={formatSelectOpen}
      aria-label="Download format"
    >
      {(() => {
        const opt = FORMAT_OPTIONS.find((o) => o.value === format);
        if (!opt) return null;
        const { label, Icon, description } = opt;
        return (
          <>
            <span className={styles.formatSelectIcon} aria-hidden="true">
              <Icon />
            </span>
            <div className={styles.formatSelectTriggerText}>
              <span className={styles.formatSelectLabelRow}>
                <span className={styles.formatSelectLabel}>{label}</span>
                {opt.pro && !isPro && (
                  <img
                    className={styles.proBadge}
                    src="/assets/3-0/PRO-label.png"
                    alt="Pro"
                  />
                )}
              </span>
              <span className={styles.formatSelectDesc}>{description}</span>
            </div>
            <span className={styles.formatSelectChevron} aria-hidden="true">▾</span>
          </>
        );
      })()}
    </button>
    {formatSelectOpen && (
      <ul
        className={styles.formatSelectDropdown}
        role="listbox"
        aria-label="Download format"
      >
        {FORMAT_OPTIONS.map(({ value, label, Icon, description, pro }) => (
          <li
            key={value}
            role="option"
            aria-selected={format === value}
            className={`${styles.formatSelectOption} ${format === value ? styles.formatSelectOptionActive : ""}`}
            onClick={() => {
              if (value === "svg" && !isPro) {
                setUpgradeProModalOpen(true);
                setFormatSelectOpen(false);
                return;
              }
              setFormat(value);
              setFormatSelectOpen(false);
            }}
          >
            <span className={styles.formatSelectOptionIcon} aria-hidden="true">
              <Icon />
            </span>
            <div className={styles.formatSelectOptionText}>
              <span className={styles.formatSelectOptionLabelRow}>
                <span className={styles.formatSelectOptionLabel}>{label}</span>
                {pro && !isPro && (
                  <img
                    className={styles.proBadge}
                    src="/assets/3-0/PRO-label.png"
                    alt="Pro"
                  />
                )}
              </span>
              <span className={styles.formatSelectOptionDesc}>{description}</span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>

  {renderFormatOptions()}

 <div className={styles.proCallout}>
  <div className={styles.toggleRow}>
    <div className={styles.toggleLeft}>
      <div className={styles.toggleName}>Show legend</div>
      <div className={styles.toggleDesc}>
        Include the legend in exports.
      </div>
    </div>

    <label className={styles.switch} aria-label="Show legend">
      <input
        type="checkbox"
        checked={legendOn}
        onChange={(e) => setLegendOn(e.target.checked)}
        disabled={isDownloading}
      />
      <span className={styles.slider} />
    </label>
  </div>
</div>


  {/* Shared pro option */}
  <div
    className={styles.proCallout}
    onClick={(e) => {
      if (!isPro && !isDownloading) {
        e.preventDefault();
        setUpgradeProModalOpen(true);
      }
    }}
    role={!isPro ? "button" : undefined}
    aria-label={!isPro ? "Toggle watermark off — Pro feature" : undefined}
  >
    <div className={styles.toggleRow}>
      <div className={styles.toggleLeft}>
        <div className={styles.toggleName}>
          Toggle watermark off{" "}
          {!isPro && (
            <img
              className={styles.proBadge}
              src="/assets/3-0/PRO-label.png"
              alt="Pro"
            />
          )}
        </div>
        <div className={styles.toggleDesc}>
          Remove the Map in Color watermark.
        </div>
      </div>

   <label className={styles.switch} aria-label="Toggle watermark off" onClick={(e) => !isPro && e.preventDefault()}>
  <input
    type="checkbox"
    checked={watermarkOff}
    onChange={(e) => (isPro ? setWatermarkOff(e.target.checked) : null)}
    disabled={!isPro || isDownloading}
  />
  <span className={styles.slider} />
</label>
    </div>
  </div>

          </div>

  {/* Actions - always at bottom */}
  <div className={styles.actions}>
    <button
      type="button"
      className={`${styles.primaryBtn} ${isDownloading ? styles.primaryBtnLoading : ""}`}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      <span className={styles.primaryIcon}>
        {isDownloading ? (
          <span className={styles.spinner} aria-hidden="true" />
        ) : (
          <BiDownload />
        )}
      </span>
      <span className={styles.primaryText}>
        {isDownloading ? "Downloading…" : "Download"}
      </span>
    </button>

    <button
      type="button"
      className={styles.ghostBtn}
      onClick={() => {
        if (isDownloading) return;
        onClose?.();
      }}
      disabled={isDownloading}
    >
      Cancel
    </button>
  </div>
  </div>
</div>
  </div>
  </div>,
        document.body
      )}
      {cropModalOpen && createPortal(
        <MapCropModal
          isOpen={true}
          onClose={() => setCropModalOpen(false)}
          onSave={(insets) => {
            didInitCropRef.current = true;
            setCrop(insets);
            setCropModalOpen(false);
          }}
          initialCrop={crop}
          originalCrop={defaultCropRef.current ?? crop}
          mapData={mapData}
          mapDataProps={mapDataProps}
        />,
        document.body
      )}
      <UpgradeProModal
        isOpen={upgradeProModalOpen}
        onClose={() => setUpgradeProModalOpen(false)}
        onUpgrade={() => {
          setUpgradeProModalOpen(false);
          onUpgradeToPro?.();
        }}
      />
    </>
  );
}
