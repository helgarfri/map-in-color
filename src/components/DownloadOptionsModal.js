import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { BiDownload } from "react-icons/bi";
import MapView from "./Map";
import styles from "./DownloadOptionsModal.module.css";

// ✅ you already have these in MapDetail; move them here
import { incrementMapDownloadCount } from "../api"; // adjust path if needed

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
  isPro
}) {
  const [format, setFormat] = useState("png"); // "png" | "jpg"
  const [isDownloading, setIsDownloading] = useState(false);

  // raster preview state
  const [isRenderingPreview, setIsRenderingPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewBlob, setPreviewBlob] = useState(null);
  const [previewFormat, setPreviewFormat] = useState(null);

  const renderStageRef = useRef(null);
const [mapTransform, setMapTransform] = useState({ x: 0, y: 0, scale: 1 });

const [legendPos, setLegendPos] = useState({ x: 0.02, y: 0.78 });



const [legendSize, setLegendSize] = useState(1.0); // 0.8 .. 1.6 feels good

const [crop, setCrop] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
// meaning: crop.top = % of full VBH to remove from top, etc.

const didInitCropRef = useRef(false);

const defaultCropRef = useRef({ top: 0, right: 0, bottom: 0, left: 0 });

const defaultLegendSizeRef = useRef(1.0);
const didInitLegendSizeRef = useRef(false);


const [legendWidthPx, setLegendWidthPx] = useState(900); // placeholder, we’ll set real default on open
const legendWidthDraftRef = useRef("900");
const [legendWidthDraft, setLegendWidthDraft] = useState("900");

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


const renderParams = useMemo(() => {
  // Only include what actually changes the output
  return {
    format,
    legendPos,
    legendWidthPx,
    legendSize,
    crop,
    // If mapTransform is NOT used in export anymore, remove it from here.
    // mapTransform,
    mapId: mapData?.id,
    title: mapData?.title, 
    jpgPreset,       
    transparentBg,  
    watermarkOff,    
  };
}, [format, legendPos, legendWidthPx, legendSize, crop,
  jpgPreset, transparentBg, watermarkOff,
  mapData?.id, mapData?.title]);

const debouncedRenderParams = useDebouncedValue(renderParams, 350);


const clampNum = (n, a, b) => Math.max(a, Math.min(b, n));

const renderInFlightRef = useRef(false);
const pendingRenderRef = useRef(false);

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

  setLegendPos({ x: 0.02, y: 0.78 });
  setLegendSizeDraft("100");
legendSizeDraftRef.current = "100";


  // ❌ remove this (causes full-map flash + breaks re-open if init doesn't run)
  // setCrop({ top: 0, right: 0, bottom: 0, left: 0 });

}, [isOpen]);

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
  const w0 = computeAutoLegendWidthFromCrop(fullInsets);

  defaultLegendWidthRef.current = w0;
  didInitLegendWidthRef.current = true;

  setLegendWidthPx(w0);
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

defaultCropRef.current = insets;   // ✅ store default
setCrop(insets);

if (!didInitLegendSizeRef.current) {
  const s0 = computeAutoLegendSizeFromCrop(insets);

  defaultLegendSizeRef.current = s0;
  didInitLegendSizeRef.current = true;

  setLegendSize(s0);

  const pct = String(Math.round(s0 * 100));
  setLegendSizeDraft(pct);
  legendSizeDraftRef.current = pct;
}


if (!didInitLegendWidthRef.current) {
  const w0 = computeAutoLegendWidthFromCrop(insets);

  defaultLegendWidthRef.current = w0;
  didInitLegendWidthRef.current = true;

  setLegendWidthPx(w0);
  setLegendWidthDraft(String(w0));
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

  const l = Number(initialInsets?.left ?? 0);
  const r = Number(initialInsets?.right ?? 0);
  const t = Number(initialInsets?.top ?? 0);
  const b = Number(initialInsets?.bottom ?? 0);

  const visibleW = clamp01(1 - (l + r) / 100);
  const visibleH = clamp01(1 - (t + b) / 100);

  // Use the smaller dimension as the limiting factor
  const visible = Math.max(0.18, Math.min(visibleW, visibleH)); // avoid insane crops

  // Ease so it doesn't shrink too hard
  const exponent = 0.85;              // smaller = less shrink
  const eased = Math.pow(visible, exponent);

  // Map eased => legend size range
  const MIN = 0.78;                   // your comfort min (0.75..)
  const MAX = 1;                   // slightly bigger on full map if you want
  const s = MIN + (MAX - MIN) * eased;

  // Final clamp to your allowed range
  return Math.max(0.75, Math.min(1.8, round1(s)));
}


function computeAutoLegendWidthFromCrop(initialInsets) {
  const BASE = 900;     // your baseline for full-width map
  const MIN = 360;      // keep UI safe
  const MAX = 1200;     // optional cap so it never looks insane

  const l = Number(initialInsets?.left ?? 0);
  const r = Number(initialInsets?.right ?? 0);

  const croppedFrac = clamp01((l + r) / 100);     // 0..1
  const visibleFrac = Math.max(0.15, 1 - croppedFrac); // never go to zero

  const w = Math.round(BASE * visibleFrac);
  return Math.max(MIN, Math.min(MAX, w));
}



  // close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !isDownloading) onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, isDownloading, onClose]);

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
    }),
    []
  );

  const VBW = 2000;
const VBH = 857;

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


function buildLegendItemsFromMapData(mapData) {
  const type = String(
    mapData?.mapDataType ?? mapData?.map_data_type ?? mapData?.map_type ?? mapData?.type ?? "choropleth"
  ).toLowerCase();

  if (type === "categorical") {
    const groups = parseJsonArray(mapData?.groups);
    const items = groups
      .map((g, idx) => {
        const label =
          (typeof g.title === "string" && g.title.trim())
            ? g.title.trim()
            : (g.name ?? g.label ?? "Group");

        const color =
          g.color ?? g.fill ?? g.hex ?? g.groupColor ?? g.group_color ?? "#e5e7eb";

        return { key: g.id ?? `g-${idx}`, label: String(label), color };
      })
      .filter((x) => x.label);

    items.sort((a, b) => a.label.localeCompare(b.label));
    return items;
  }

  // choropleth
  const ranges = parseJsonArray(mapData?.custom_ranges ?? mapData?.customRanges);
  const items = ranges
    .map((r, idx) => {
      const min = numOrNull(r.lowerBound ?? r.min ?? r.from ?? r.start ?? r.low ?? r.lower ?? r.rangeMin);
      const max = numOrNull(r.upperBound ?? r.max ?? r.to ?? r.end ?? r.high ?? r.upper ?? r.rangeMax);

      const color =
        r.color ?? r.fill ?? r.hex ?? r.rangeColor ?? r.range_color ?? "#e5e7eb";

      const nameOnly = typeof r.name === "string" && r.name.trim() ? r.name.trim() : null;
      const titleOnly = typeof r.title === "string" && r.title.trim() ? r.title.trim() : null;
      const labelOnly = typeof r.label === "string" && r.label.trim() ? r.label.trim() : null;

      const label =
        nameOnly ??
        titleOnly ??
        labelOnly ??
        (min != null && max != null
          ? `${min} – ${max}`
          : min != null
          ? `≥ ${min}`
          : max != null
          ? `≤ ${max}`
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

function viewBoxFromInsets(insets) {
  const l = clamp01((insets?.left ?? 0) / 100);
  const r = clamp01((insets?.right ?? 0) / 100);
  const t = clamp01((insets?.top ?? 0) / 100);
  const b = clamp01((insets?.bottom ?? 0) / 100);

  let x = VBW * l;
  let y = VBH * t;
  let w = VBW * (1 - l - r);
  let h = VBH * (1 - t - b);

  // prevent negative/zero (avoid broken exports)
  const MIN = 1;
  if (w < MIN) w = MIN;
  if (h < MIN) h = MIN;

  // if we forced w/h, keep it in bounds
  x = clamp(x, 0, VBW - w);
  y = clamp(y, 0, VBH - h);

  return { x, y, w, h };
}

function insetsFromViewBox(vb) {
  const left   = (vb.x / VBW) * 100;
  const top    = (vb.y / VBH) * 100;
  const right  = ((VBW - (vb.x + vb.w)) / VBW) * 100;
  const bottom = ((VBH - (vb.y + vb.h)) / VBH) * 100;

  // keep them clean-looking in the UI
  const round = (n) => Math.round(n * 10) / 10;

  return {
    left: round(clamp(left, 0, 100)),
    top: round(clamp(top, 0, 100)),
    right: round(clamp(right, 0, 100)),
    bottom: round(clamp(bottom, 0, 100)),
  };
}

function computeLegendNoWrapWidthPx(mapData, canvasW, legendSize = 1) {
  const items = buildLegendItemsFromMapData(mapData);
  if (!items.length) return 520;

  // approximate the same sizing logic as drawLegendBoxOnCanvas
  const base0 = Math.max(12, Math.round(Math.min(canvasW, canvasW) * 0.025));
  const s = Math.max(0.75, Math.min(1.8, Number(legendSize) || 1));
  const base = Math.round(base0 * s);

  const outerPad = Math.round(base * 0.9);
  const cardPad = Math.round(base * 0.95);

  const dot = Math.round(base * 0.95);
  const gap = Math.round(base * 0.7);
  const rowPadX = Math.round(base * 0.75);

  const itemSize = Math.round(base * 1.05);
  const titleSize = Math.round(base * 1.05);
  const metaSize = Math.round(base * 0.85);

  // measure text
  const measCanvas = document.createElement("canvas");
  const ctx = measCanvas.getContext("2d");

  // longest row label
  ctx.font = `800 ${itemSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const maxLabelW = items.reduce((m, it) => Math.max(m, ctx.measureText(String(it.label || "")).width), 0);

  // title width (your card uses title too)
  ctx.font = `900 ${titleSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
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
  const hardMin = 240;

  return Math.max(hardMin, Math.min(hardMax, desired));
}



function drawLegendBoxOnCanvas(ctx, canvas, { title, items, anchor="bottom-left", pos, widthPx = null, size = 1 }){
  if (!items?.length) return;

  // ─────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  function wrapCanvasText(ctx, text, maxWidth) {
    const raw = String(text || "").trim();
    if (!raw) return [];

    const words = raw.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";

    const measure = (t) => ctx.measureText(t).width;

    function breakLongWord(word) {
      const parts = [];
      let chunk = "";
      for (const ch of word) {
        const test = chunk + ch;
        if (measure(test) <= maxWidth || !chunk) chunk = test;
        else {
          parts.push(chunk);
          chunk = ch;
        }
      }
      if (chunk) parts.push(chunk);
      return parts;
    }

    for (let w of words) {
      if (measure(w) > maxWidth) {
        const pieces = breakLongWord(w);
        for (const p of pieces) {
          const test = line ? `${line} ${p}` : p;
          if (measure(test) <= maxWidth) line = test;
          else {
            if (line) lines.push(line);
            line = p;
          }
        }
        continue;
      }

      const test = line ? `${line} ${w}` : w;
      if (measure(test) <= maxWidth) line = test;
      else {
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

  // ─────────────────────────────────────────────
  // Base sizing (scaled)
  // ─────────────────────────────────────────────
  const base0 = Math.max(12, Math.round(Math.min(canvas.width, canvas.height) * 0.025));
  const s = clamp(Number(size) || 1, 0.75, 1.8);
  const base = Math.round(base0 * s);

  const outerPad = Math.round(base * 0.9);

  const cardPad = Math.round(base * 0.95);
  const cardRadius = Math.round(base * 1.2);

  const titleSize = Math.round(base * 1.05);
  const itemSize = Math.round(base * 1.05);
  const metaSize = Math.round(base * 0.85);

  const dot = Math.round(base * 0.95);
  const gap = Math.round(base * 0.7);

  const rowPadY = Math.round(base * 0.55);
  const rowPadX = Math.round(base * 0.75);
  const rowRadius = Math.round(base * 1.1);
  const rowGap = Math.round(base * 0.55);

  const titleLineH = Math.round(titleSize * 1.18);
  const itemLineH = Math.round(itemSize * 1.25);

  // width controls (same behavior you had)
const hardMax = Math.round(canvas.width - outerPad * 2);
const hardMin = 240;

const forcedBoxW = clamp(Math.round(widthPx), hardMin, hardMax);


const maxBoxW = forcedBoxW ?? Math.round(canvas.width - outerPad * 2);
const minBoxW = forcedBoxW ?? 260;


  // cap items (like before)
  const maxItems = 10;
  const shown = items.slice(0, maxItems);
  const hiddenCount = Math.max(0, items.length - shown.length);

  ctx.save();
  ctx.textBaseline = "top";

  // ─────────────────────────────────────────────
  // 1) Determine card width based on content
  // ─────────────────────────────────────────────
  ctx.font = `800 ${itemSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;

  // temporary wrap width assuming maxBoxW
  const rowLabelMaxW_cap = maxBoxW - cardPad * 2 - rowPadX * 2 - dot - gap;

  const wrappedRows_cap = shown.map((it) => {
    const lines = wrapCanvasText(ctx, String(it.label || ""), rowLabelMaxW_cap);
    return { ...it, lines: lines.length ? lines : [""] };
  });

  const rowsTextW = wrappedRows_cap.reduce((m, row) => {
    const w = row.lines.reduce((mm, l) => Math.max(mm, ctx.measureText(l).width), 0);
    return Math.max(m, w);
  }, 0);

  ctx.font = `900 ${titleSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const titleMaxW_cap = maxBoxW - cardPad * 2;
  const titleLines_cap = wrapCanvasText(ctx, title, titleMaxW_cap);
  const titleTextW = titleLines_cap.reduce((m, l) => Math.max(m, ctx.measureText(l).width), 0);

  ctx.font = `700 ${metaSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const moreW = hiddenCount ? ctx.measureText(`+${hiddenCount} more`).width : 0;

  const contentW_fromRows = rowsTextW + dot + gap + rowPadX * 2;
  const contentW = Math.max(contentW_fromRows, titleTextW, moreW);

  const boxW = forcedBoxW
    ? forcedBoxW
    : Math.max(minBoxW, Math.min(maxBoxW, Math.ceil(contentW + cardPad * 2)));

  // re-wrap rows to final width
  ctx.font = `800 ${itemSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const rowLabelMaxW = boxW - cardPad * 2 - rowPadX * 2 - dot - gap;

  const rows = shown.map((it) => {
    const lines = wrapCanvasText(ctx, String(it.label || ""), rowLabelMaxW);
    return { ...it, lines: lines.length ? lines : [""] };
  });

  // wrap title to final width
  ctx.font = `900 ${titleSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
  const titleMaxW = boxW - cardPad * 2;
  const titleLines = wrapCanvasText(ctx, title, titleMaxW);

  // ─────────────────────────────────────────────
  // 2) Height calc (includes row "pills")
  // ─────────────────────────────────────────────
  const headerH = titleLines.length ? titleLines.length * titleLineH + Math.round(base * 0.55) : 0;
  const dividerH = titleLines.length ? Math.round(base * 0.9) : 0;

  const rowsH = rows.reduce((sum, row) => {
    const blockH = row.lines.length * itemLineH;
    const pillH = blockH + rowPadY * 2;
    return sum + pillH;
  }, 0);

  const rowsGapH = rows.length ? rowGap * (rows.length - 1) : 0;

  const moreH = hiddenCount ? Math.round(metaSize * 1.25) + Math.round(base * 0.45) : 0;

  const boxH = cardPad + headerH + dividerH + rowsH + rowsGapH + moreH + cardPad;

  // ─────────────────────────────────────────────
  // 3) Position
  // ─────────────────────────────────────────────
  let x = outerPad;
  let y = canvas.height - outerPad - boxH;

  if (anchor === "bottom-right") x = canvas.width - outerPad - boxW;
  if (anchor === "top-left") y = outerPad;
  if (anchor === "top-right") {
    x = canvas.width - outerPad - boxW;
    y = outerPad;
  }

  if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
    const maxX = canvas.width - outerPad - boxW;
    const maxY = canvas.height - outerPad - boxH;

    x = outerPad + pos.x * Math.max(0, maxX - outerPad);
    y = outerPad + pos.y * Math.max(0, maxY - outerPad);

    x = clamp(x, outerPad, maxX);
    y = clamp(y, outerPad, maxY);
  }

  // ─────────────────────────────────────────────
  // 4) Draw card background (THIS is what you were missing)
  // ─────────────────────────────────────────────
  ctx.save();

  // shadow
  ctx.shadowColor = "rgba(15, 23, 42, 0.18)";
  ctx.shadowBlur = Math.round(base * 1.6);
  ctx.shadowOffsetY = Math.round(base * 0.55);

  roundRectPath(ctx, x, y, boxW, boxH, cardRadius);
  ctx.fillStyle = "rgba(255,255,255,0.94)";
  ctx.fill();

  // border (no shadow)
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  roundRectPath(ctx, x, y, boxW, boxH, cardRadius);
  ctx.strokeStyle = "rgba(20, 24, 40, 0.10)";
  ctx.lineWidth = Math.max(1, Math.round(base * 0.08));
  ctx.stroke();

  ctx.restore();

  // ─────────────────────────────────────────────
  // 5) Title + divider
  // ─────────────────────────────────────────────
  let cy = y + cardPad;

  if (titleLines.length) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.92)";
    ctx.font = `900 ${titleSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;

    for (const line of titleLines) {
      ctx.fillText(line, x + cardPad, cy);
      cy += titleLineH;
    }

    cy += Math.round(base * 0.25);

    ctx.strokeStyle = "rgba(20, 24, 40, 0.08)";
    ctx.lineWidth = Math.max(1, Math.round(base * 0.08));
    ctx.beginPath();
    ctx.moveTo(x + cardPad, cy);
    ctx.lineTo(x + boxW - cardPad, cy);
    ctx.stroke();

    cy += Math.round(base * 0.7);
  }

  // ─────────────────────────────────────────────
  // 6) Rows as pill cards (like your screenshot)
  // ─────────────────────────────────────────────
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    const blockH = row.lines.length * itemLineH;
    const pillH = blockH + rowPadY * 2;

    const px = x + cardPad;
    const py = cy;
    const pw = boxW - cardPad * 2;

    // pill bg
    ctx.save();
    roundRectPath(ctx, px, py, pw, pillH, rowRadius);
    ctx.fillStyle = "rgba(15, 23, 42, 0.025)";
    ctx.fill();
    ctx.strokeStyle = "rgba(20, 24, 40, 0.09)";
    ctx.lineWidth = Math.max(1, Math.round(base * 0.07));
    ctx.stroke();
    ctx.restore();

    // dot
    const dx = px + rowPadX;
    const dy = py + Math.round((pillH - dot) / 2);

    // dot shadow
    ctx.save();
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(dx + dot / 2, dy + dot / 2 + 1, dot / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // dot fill + stroke
    ctx.save();
    ctx.fillStyle = row.color || "#e5e7eb";
    ctx.beginPath();
    ctx.arc(dx + dot / 2, dy + dot / 2, dot / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(15, 23, 42, 0.18)";
    ctx.lineWidth = Math.max(1, Math.round(base * 0.08));
    ctx.stroke();
    ctx.restore();

    // text
    ctx.fillStyle = "rgba(15, 23, 42, 0.88)";
    ctx.font = `800 ${itemSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;

    let ly = py + rowPadY;
    const tx = dx + dot + gap;

    for (const line of row.lines) {
      ctx.fillText(line, tx, ly + Math.round((itemLineH - itemSize) / 2));
      ly += itemLineH;
    }

    cy += pillH;
    if (i !== rows.length - 1) cy += rowGap;
  }

  // +N more
  if (hiddenCount) {
    cy += Math.round(base * 0.45);
    ctx.fillStyle = "rgba(15, 23, 42, 0.50)";
    ctx.font = `700 ${metaSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif`;
    ctx.fillText(`+${hiddenCount} more`, x + cardPad, cy);
  }

  ctx.restore();
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

    // ✅ HARD GATE (so client UI can't bypass)
    const effectiveTransparent = isPro ? transparentBgLocal : false;
    const effectiveWatermarkOff = isPro ? watermarkOffLocal : false;

    const effectiveJpgPreset =
      isPro ? jpgPresetLocal : (jpgPresetLocal === "max" ? "high" : jpgPresetLocal);

    const vb = viewBoxFromInsets(cropLocal);
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
      textElement.setAttribute("font-weight", "bold");
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
        if (el.closest("#legend")) el.setAttribute("font-weight", "normal");
        else el.setAttribute("font-weight", "bold");
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

    // JPG background
    if (fmt === "jpg") {
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    ctx.drawImage(svgImg, 0, 0, canvas.width, canvas.height);

    // ✅ Legend box (export overlay) using params
    try {
      const legendItems = buildLegendItemsFromMapData(mapData);

      drawLegendBoxOnCanvas(ctx, canvas, {
        title: mapData?.title || "Untitled Map",
        items: legendItems,
        anchor: "bottom-left",
        pos: legendPosLocal,
        widthPx: legendWidthPxLocal,
        size: legendSizeLocal,
      });
    } catch {
      // ignore legend issues
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
  [mapData]
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
       const { blob, url, fmt } = await exportFromSvg(format, debouncedRenderParams);


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
    setIsDownloading(true);

    try {
      let blob = previewBlob;
      let fmt = previewFormat;

      // if somehow not ready / mismatched, regenerate once
      if (!blob || fmt !== format) {
        const out = await exportFromSvg(format, debouncedRenderParams);
        blob = out.blob;
        fmt = out.fmt;
      }

      const safeTitle = (mapData?.title || "map").trim() || "map";
      const ext = fmt === "jpg" ? "jpg" : "png";
      downloadBlob(blob, `${safeTitle}.${ext}`);

      // increment download count
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

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={() => {
        if (isDownloading) return;
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
          {/* LEFT: raster preview */}
          <div className={styles.previewCard} aria-label="Download preview">
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
            <div className={styles.previewHint}>This is the exact exported image</div>


<div className={styles.leftControls}>
 {/* ===== Legend ===== */}
<div className={styles.sectionTitle}>Legend</div>

<div className={styles.controlsCard}>
  <div className={styles.legendGrid}>
    {/* X */}
    <div className={styles.legendStack}>
      <div className={styles.legendLabel}>X</div>
      <div className={styles.legendLine}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setLegendPos((p) => ({ ...p, x: Math.max(0, p.x - 0.01) }))}
          disabled={isDownloading}
          aria-label="Decrease legend X"
        >
          −
        </button>

       <input
  className={styles.miniInput}
  type="text"
  inputMode="numeric"
  value={legendXDraft}
  onChange={(e) => {
    // allow empty while typing + digits only
    const cleaned = e.target.value.replace(/[^\d]/g, "");
    setLegendXDraft(cleaned);
    legendXDraftRef.current = cleaned;
  }}
  onBlur={() => {
    const raw = legendXDraftRef.current;

    // if user left it empty, revert to committed value (no snap-to-0)
    if (raw === "") {
      const back = String(Math.round(legendPos.x * 100));
      setLegendXDraft(back);
      legendXDraftRef.current = back;
      return;
    }

    const n = Number(raw);
    if (!Number.isFinite(n)) return;

    const clamped = Math.max(0, Math.min(100, Math.round(n)));
    setLegendPos((p) => ({ ...p, x: clamped / 100 }));

    const s = String(clamped);
    setLegendXDraft(s);
    legendXDraftRef.current = s;
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      const back = String(Math.round(legendPos.x * 100));
      setLegendXDraft(back);
      legendXDraftRef.current = back;
      e.currentTarget.blur();
    }
  }}
  disabled={isDownloading}
  aria-label="Legend X percent"
/>


        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setLegendPos((p) => ({ ...p, x: Math.min(1, p.x + 0.01) }))}
          disabled={isDownloading}
          aria-label="Increase legend X"
        >
          +
        </button>

        <span className={styles.miniSuffix}></span>
      </div>
    </div>

    {/* Y */}
    <div className={styles.legendStack}>
      <div className={styles.legendLabel}>Y</div>
      <div className={styles.legendLine}>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setLegendPos((p) => ({ ...p, y: Math.max(0, p.y - 0.01) }))}
          disabled={isDownloading}
          aria-label="Decrease legend Y"
        >
          −
        </button>

       <input
  className={styles.miniInput}
  type="text"
  inputMode="numeric"
  value={legendYDraft}
  onChange={(e) => {
    // allow empty while typing + digits only
    const cleaned = e.target.value.replace(/[^\d]/g, "");
    setLegendYDraft(cleaned);
    legendYDraftRef.current = cleaned;
  }}
  onBlur={() => {
    const raw = legendYDraftRef.current;

    // if user left it empty, revert to committed value (no snap-to-0)
    if (raw === "") {
      const back = String(Math.round(legendPos.y * 100));
      setLegendYDraft(back);
      legendYDraftRef.current = back;
      return;
    }

    const n = Number(raw);
    if (!Number.isFinite(n)) return;

    const clamped = Math.max(0, Math.min(100, Math.round(n)));
    setLegendPos((p) => ({ ...p, y: clamped / 100 }));

    const s = String(clamped);
    setLegendYDraft(s);
    legendYDraftRef.current = s;
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") e.currentTarget.blur();
    if (e.key === "Escape") {
      const back = String(Math.round(legendPos.x * 100));
      setLegendYDraft(back);
      legendYDraftRef.current = back;
      e.currentTarget.blur();
    }
  }}
  disabled={isDownloading}
  aria-label="Legend Y percent"
/>


        <button
          type="button"
          className={styles.iconBtn}
          onClick={() => setLegendPos((p) => ({ ...p, y: Math.min(1, p.y + 0.01) }))}
          disabled={isDownloading}
          aria-label="Increase legend Y"
        >
          +
        </button>

        <span className={styles.miniSuffix}></span>
      </div>
    </div>

{/* Size */}
<div className={styles.legendStack}>
  <div className={styles.legendLabel}>Size</div>

  <div className={styles.legendLine}>
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => {
        setLegendSize((s) => {
          const next = Math.max(0.75, Math.round((s - 0.01) * 100) / 100);
          const pct = String(Math.round(next * 100));
          setLegendSizeDraft(pct);
          legendSizeDraftRef.current = pct;
          return next;
        });
      }}
      disabled={isDownloading}
      aria-label="Decrease legend size"
    >
      −
    </button>

    <input
      className={styles.miniInput}
      type="text"
      inputMode="numeric"
      value={legendSizeDraft}
      onChange={(e) => {
        // allow typing freely: "", "1", "10", "100", etc.
        const raw = e.target.value;
        const cleaned = raw.replace(/[^\d]/g, ""); // digits only
        setLegendSizeDraft(cleaned);
        legendSizeDraftRef.current = cleaned;
      }}
      onBlur={() => {
        // commit on blur
        const raw = legendSizeDraftRef.current;
        const n = Number(raw);

        if (!Number.isFinite(n)) {
          const pct = String(Math.round(legendSize * 100));
          setLegendSizeDraft(pct);
          legendSizeDraftRef.current = pct;
          return;
        }

        const clamped = Math.max(75, Math.min(180, Math.round(n)));
        setLegendSize(clamped / 100);

        const pct = String(clamped);
        setLegendSizeDraft(pct);
        legendSizeDraftRef.current = pct;
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") {
          const pct = String(Math.round(legendSize * 100));
          setLegendSizeDraft(pct);
          legendSizeDraftRef.current = pct;
          e.currentTarget.blur();
        }
      }}
      disabled={isDownloading}
      aria-label="Legend size percent"
      placeholder="100"
    />

    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => {
        setLegendSize((s) => {
          const next = Math.min(1.8, Math.round((s + 0.01) * 100) / 100);
          const pct = String(Math.round(next * 100));
          setLegendSizeDraft(pct);
          legendSizeDraftRef.current = pct;
          return next;
        });
      }}
      disabled={isDownloading}
      aria-label="Increase legend size"
    >
      +
    </button>

    <span className={styles.miniSuffix}></span>
  </div>
</div>


    {/* Width */}
{/* Width (px, blank = auto) */}
<div className={styles.legendStack}>
  <div className={styles.legendLabel}>Width</div>

  <div className={styles.legendLine}>
    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => {
        const next = Math.max(240, legendWidthPx - 40);
        setLegendWidthPx(next);
        setLegendWidthDraft(String(next));
legendWidthDraftRef.current = String(next);

      }}
      disabled={isDownloading}
      aria-label="Decrease legend width"
    >
      −
    </button>

  <input
  className={styles.miniInput}
  type="text"
  inputMode="numeric"
  value={legendWidthDraft}
  onChange={(e) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d]/g, ""); // digits only
    setLegendWidthDraft(cleaned);
    legendWidthDraftRef.current = cleaned;
  }}
  onBlur={() => {
    const raw = legendWidthDraftRef.current;
    const n = Number(raw);

    if (!Number.isFinite(n) || raw === "") {
      // snap back to current committed value
      const back = String(legendWidthPx);
      setLegendWidthDraft(back);
      legendWidthDraftRef.current = back;
      return;
    }

    const scaleFactor = 3;
    const vb = viewBoxFromInsets(crop);
    const exportCanvasW = Math.round(vb.w * scaleFactor);

    const hardMax = Math.max(240, Math.round(exportCanvasW - 40));
    const clamped = Math.max(240, Math.min(hardMax, Math.round(n)));

    setLegendWidthPx(clamped);

    const s = String(clamped);
    setLegendWidthDraft(s);
    legendWidthDraftRef.current = s;
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") e.currentTarget.blur();     // ✅ commit now
    if (e.key === "Escape") {
      const back = String(legendWidthPx);
      setLegendWidthDraft(back);
      legendWidthDraftRef.current = back;
      e.currentTarget.blur();
    }
  }}
  disabled={isDownloading}
  aria-label="Legend width in pixels"
/>


    <button
      type="button"
      className={styles.iconBtn}
      onClick={() => {
        const scaleFactor = 3;
        const exportCanvasW = Math.round(VBW * scaleFactor);
        const hardMax = Math.round(exportCanvasW - 40);
        const next = Math.min(hardMax, legendWidthPx + 40);
        setLegendWidthPx(next);
        setLegendWidthDraft(String(next));
legendWidthDraftRef.current = String(next);
      }}
      disabled={isDownloading}
      aria-label="Increase legend width"
    >
      +
    </button>

    <span className={styles.miniSuffix}>px</span>
  </div>
</div>



<button
  type="button"
  className={styles.miniReset}
  onClick={() => {
    setLegendPos({ x: 0.02, y: 0.78 });

    setLegendSize(1.0);
    setLegendSizeDraft("100");
    legendSizeDraftRef.current = "100";

    const w0 = defaultLegendWidthRef.current || 900;
    setLegendWidthPx(w0);
    setLegendWidthDraft(String(w0));
    legendWidthDraftRef.current = String(w0);
  }}
>
  Reset
</button>


  </div>
</div>


  {/* ===== Crop ===== */}
  <div className={styles.sectionTitle}>Crop</div>

  <div className={styles.controlsCard}>
    <div className={styles.cropGrid}>
      {[
        ["Left", "left"],
        ["Top", "top"],
        ["Right", "right"],
        ["Bottom", "bottom"],
      ].map(([label, key]) => (
        <div key={key} className={styles.cropStack}>
          <div className={styles.cropLabel}>{label}</div>

          <div className={styles.cropLine}>
            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => {
                didInitCropRef.current = true;
                setCrop((c) => ({ ...c, [key]: Math.max(0, c[key] - 1) }));
              }}
              disabled={isDownloading}
              aria-label={`Decrease crop ${label.toLowerCase()}`}
            >
              −
            </button>

            <input
              className={styles.miniInput}
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              step={1}
              value={Math.round(crop[key])}
              onChange={(e) => {
                const n = Number(e.target.value);
                if (!Number.isFinite(n)) return;
                didInitCropRef.current = true;
                const clamped = Math.max(0, Math.min(100, Math.round(n)));
                setCrop((c) => ({ ...c, [key]: clamped }));
              }}
              disabled={isDownloading}
              aria-label={`Crop ${label} percent`}
            />

            <button
              type="button"
              className={styles.iconBtn}
              onClick={() => {
                didInitCropRef.current = true;
                setCrop((c) => ({ ...c, [key]: Math.min(100, c[key] + 1) }));
              }}
              disabled={isDownloading}
              aria-label={`Increase crop ${label.toLowerCase()}`}
            >
              +
            </button>

            <span className={styles.miniSuffix}></span>
          </div>
        </div>
      ))}

      <button
        type="button"
        className={styles.miniReset}
        onClick={() => {
          didInitCropRef.current = true;
          setCrop(defaultCropRef.current || { top: 0, right: 0, bottom: 0, left: 0 });
        }}
        disabled={isDownloading}
      >
        Reset
      </button>
    </div>
  </div>

</div>


          </div>

        {/* RIGHT: options */}
<div className={styles.options}>
  <div className={styles.sectionTitle}>Format</div>

  {/* Format select */}
  <div className={styles.selectWrap}>
    <select
      className={styles.select}
      value={format}
      onChange={(e) => setFormat(e.target.value)} // format: "jpg" | "png"
      disabled={isDownloading}
      aria-label="Download format"
    >
      <option value="jpg">JPG</option>
      <option value="png">PNG</option>
    </select>

    <span className={styles.selectChevron} aria-hidden="true">
      ▾
    </span>
  </div>

  {/* Format-specific options */}
  {format === "jpg" ? (
    <div className={styles.formatPanel}>
      <div className={styles.expandTitle}>JPG quality</div>

      <div className={styles.subList}>
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

        {/* Max (pro) */}
        <button
          type="button"
          className={`${styles.subRow} ${styles.subRowPro} ${jpgPreset === "max" ? styles.subRowActive : ""}`}
          disabled={isDownloading}
          onClick={() => setJpgPreset("max")}
        >
          <div className={styles.subLeft}>
            <div className={styles.subName}>
              Max{" "}
              <img
                className={styles.proBadge}
                src="/assets/3-0/PRO-label.png"
                alt="Pro"
              />
            </div>
            <div className={styles.subDesc}>Highest quality, biggest file.</div>
          </div>
          <div className={styles.subRight}>
            <span className={styles.subMeta}>98%</span>
          </div>
        </button>
      </div>
    </div>
  ) : (
    <div className={styles.formatPanel}>
      <div className={styles.expandTitle}>PNG options</div>

      <div className={styles.toggleRow}>
        <div className={styles.toggleLeft}>
          <div className={styles.toggleName}>
            Transparent background{" "}
            <img
              className={styles.proBadge}
              src="/assets/3-0/PRO-label.png"
              alt="Pro"
            />
          </div>
          <div className={styles.toggleDesc}>
            Export without a background fill.
          </div>
        </div>

        <label className={styles.switch} aria-label="Transparent background">
          <input type="checkbox" disabled />
          <span className={styles.slider} />
        </label>
      </div>
    </div>
  )}

  {/* Shared pro option */}
  <div className={styles.proCallout}>
    <div className={styles.toggleRow}>
      <div className={styles.toggleLeft}>
        <div className={styles.toggleName}>
          Toggle watermark off{" "}
          <img
            className={styles.proBadge}
            src="/assets/3-0/PRO-label.png"
            alt="Pro"
          />
        </div>
        <div className={styles.toggleDesc}>
          Remove the Map in Color watermark.
        </div>
      </div>

      <label className={styles.switch} aria-label="Toggle watermark off">
        <input type="checkbox" disabled />
        <span className={styles.slider} />
      </label>
    </div>
  </div>

  {/* Actions */}
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

  <div className={styles.footnote}>
    Tip: PNG is best for sharp edges and map details. JPG is smaller and great for
    posting.
  </div>
</div>
</div>
      </div>
    </div>,
    document.body
  );
}
