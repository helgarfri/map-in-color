import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView from "./Map";
import MapUS from "./MapUS";
import {
  VBW,
  VBH,
} from "../utils/downloadViewBoxUtils";
import styles from "./MapCropModal.module.css";

function clamp(x, a, b) {
  return Math.max(a, Math.min(b, x));
}

const FULL_VIEW_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };

export default function MapCropModal({
  isOpen,
  onClose,
  onSave,
  initialCrop,
  originalCrop,
  mapData,
  mapDataProps,
}) {
  const containerRef = useRef(null);
  const mapStageRef = useRef(null);
  const prevOpenRef = useRef(false);
  const hasUserAdjustedRef = useRef(false);
  const [baseViewBox, setBaseViewBox] = useState({ x: 0, y: 0, w: VBW, h: VBH });
  const MIN_W = baseViewBox.w * 0.05;
  const MIN_H = baseViewBox.h * 0.05;
  const [vb, setVb] = useState({ x: 0, y: 0, w: VBW, h: VBH });
  const [drag, setDrag] = useState(null);

  const mapProps = typeof mapDataProps === "function" ? mapDataProps() : mapDataProps || {};
  const selectedMapForCrop = String(
    mapProps.selected_map ?? mapProps.selectedMap ?? mapData?.selected_map ?? mapData?.selectedMap ?? "world"
  ).toLowerCase();
  const isUsCropMap = selectedMapForCrop === "usa";
  const customPresetId = String(mapProps.custom_map_preset_id ?? mapProps.customMapPresetId ?? "").toLowerCase();
  const hasCustomCountries = Array.isArray(mapProps.custom_map_countries) && mapProps.custom_map_countries.length > 0;
  const shouldWaitForFittedViewBox =
    selectedMapForCrop === "usa" ||
    (selectedMapForCrop === "world" &&
      hasCustomCountries &&
      customPresetId &&
      customPresetId !== "world");

  const safeBase = useCallback((base) => {
    if (!base || !Number.isFinite(base.w) || !Number.isFinite(base.h) || base.w <= 0 || base.h <= 0) {
      return { x: 0, y: 0, w: VBW, h: VBH };
    }
    return base;
  }, []);

  const getViewBoxFromSvg = useCallback((svgEl) => {
    const vbAttr = svgEl?.getAttribute?.("viewBox");
    if (!vbAttr) return null;
    const parts = vbAttr.trim().split(/[\s,]+/).map(Number);
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
    return { x: parts[0], y: parts[1], w: parts[2], h: parts[3] };
  }, []);

  const isWorldLikeViewBox = useCallback((b) => {
    if (!b) return true;
    return Math.abs(b.x) < 0.5 &&
      Math.abs(b.y) < 0.5 &&
      Math.abs(b.w - VBW) < 2 &&
      Math.abs(b.h - VBH) < 2;
  }, []);

  const viewBoxFromInsetsForBase = useCallback((insets, base) => {
    const b = safeBase(base);
    const l = clamp((insets?.left ?? 0) / 100, 0, 1);
    const r = clamp((insets?.right ?? 0) / 100, 0, 1);
    const t = clamp((insets?.top ?? 0) / 100, 0, 1);
    const bo = clamp((insets?.bottom ?? 0) / 100, 0, 1);
    let x = b.x + b.w * l;
    let y = b.y + b.h * t;
    let w = b.w * (1 - l - r);
    let h = b.h * (1 - t - bo);
    if (w < 1) w = 1;
    if (h < 1) h = 1;
    x = clamp(x, b.x, b.x + b.w - w);
    y = clamp(y, b.y, b.y + b.h - h);
    return { x, y, w, h };
  }, [safeBase]);

  const insetsFromViewBoxForBase = useCallback((nextVb, base) => {
    const b = safeBase(base);
    const round = (n) => Math.round(n * 10) / 10;
    return {
      left: round(clamp(((nextVb.x - b.x) / b.w) * 100, 0, 100)),
      top: round(clamp(((nextVb.y - b.y) / b.h) * 100, 0, 100)),
      right: round(clamp(((b.x + b.w - (nextVb.x + nextVb.w)) / b.w) * 100, 0, 100)),
      bottom: round(clamp(((b.y + b.h - (nextVb.y + nextVb.h)) / b.h) * 100, 0, 100)),
    };
  }, [safeBase]);

  // Detect map's true base viewBox so crop math matches world/continent/US.
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    const detect = async () => {
      // On first open MapView can briefly be at world viewBox before region fit applies.
      // Wait a few frames for the fitted viewBox so crop starts correct immediately.
      for (let i = 0; i < 18; i++) {
        await new Promise((r) => requestAnimationFrame(() => r()));
        if (cancelled) return;
        const svg = mapStageRef.current?.querySelector?.("svg");
        const detected = getViewBoxFromSvg(svg);
        if (!detected) continue;

        const worldLike = isWorldLikeViewBox(detected);
        if (shouldWaitForFittedViewBox && worldLike && i < 17) {
          continue;
        }

        setBaseViewBox(safeBase(detected));
        return;
      }
    };
    detect();
    return () => {
      cancelled = true;
    };
  }, [isOpen, isUsCropMap, shouldWaitForFittedViewBox, getViewBoxFromSvg, isWorldLikeViewBox, safeBase]);

  // Sync vb when modal opens (show current crop)
  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;
    if (justOpened) {
      hasUserAdjustedRef.current = false;
      setVb(viewBoxFromInsetsForBase(initialCrop || FULL_VIEW_INSETS, baseViewBox));
      setDrag(null);
    }
  }, [isOpen, initialCrop, baseViewBox, viewBoxFromInsetsForBase]);

  // After base viewBox is detected, rebind initial crop once so handles never start out-of-bounds.
  useEffect(() => {
    if (!isOpen) return;
    if (drag) return;
    if (hasUserAdjustedRef.current) return;
    setVb(viewBoxFromInsetsForBase(initialCrop || FULL_VIEW_INSETS, baseViewBox));
  }, [isOpen, baseViewBox, initialCrop, viewBoxFromInsetsForBase, drag]);

  const pixelToViewBox = useCallback((clientX, clientY) => {
    const el = mapStageRef.current?.querySelector?.("svg") || containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const cx = clamp(clientX, r.left, r.right);
    const cy = clamp(clientY, r.top, r.bottom);
    const sx = baseViewBox.w / r.width;
    const sy = baseViewBox.h / r.height;
    return {
      x: baseViewBox.x + (cx - r.left) * sx,
      y: baseViewBox.y + (cy - r.top) * sy,
    };
  }, [baseViewBox]);

  const handlePointerDown = useCallback(
    (e, handle) => {
      e.preventDefault();
      hasUserAdjustedRef.current = true;
      const pt = pixelToViewBox(e.clientX, e.clientY);
      setDrag({ handle, startVb: { ...vb }, startPt: pt });
    },
    [vb, pixelToViewBox]
  );

  useEffect(() => {
    if (!drag) return;

    const onMove = (e) => {
      const pt = pixelToViewBox(e.clientX, e.clientY);
      const dx = pt.x - drag.startPt.x;
      const dy = pt.y - drag.startPt.y;
      const { handle, startVb } = drag;
      let { x, y, w, h } = startVb;

      switch (handle) {
        case "n":
          y = clamp(startVb.y + dy, baseViewBox.y, baseViewBox.y + baseViewBox.h - MIN_H);
          h = clamp(startVb.h - dy, MIN_H, baseViewBox.y + baseViewBox.h - y);
          break;
        case "s":
          h = clamp(startVb.h + dy, MIN_H, baseViewBox.y + baseViewBox.h - startVb.y);
          break;
        case "e":
          w = clamp(startVb.w + dx, MIN_W, baseViewBox.x + baseViewBox.w - startVb.x);
          break;
        case "w":
          x = clamp(startVb.x + dx, baseViewBox.x, baseViewBox.x + baseViewBox.w - MIN_W);
          w = clamp(startVb.w - dx, MIN_W, startVb.x + startVb.w - x);
          break;
        case "nw":
          x = clamp(startVb.x + dx, baseViewBox.x, baseViewBox.x + baseViewBox.w - MIN_W);
          w = clamp(startVb.w - dx, MIN_W, startVb.x + startVb.w - x);
          y = clamp(startVb.y + dy, baseViewBox.y, baseViewBox.y + baseViewBox.h - MIN_H);
          h = clamp(startVb.h - dy, MIN_H, startVb.y + startVb.h - y);
          break;
        case "ne":
          w = clamp(startVb.w + dx, MIN_W, baseViewBox.x + baseViewBox.w - startVb.x);
          y = clamp(startVb.y + dy, baseViewBox.y, baseViewBox.y + baseViewBox.h - MIN_H);
          h = clamp(startVb.h - dy, MIN_H, startVb.y + startVb.h - y);
          break;
        case "sw":
          x = clamp(startVb.x + dx, baseViewBox.x, baseViewBox.x + baseViewBox.w - MIN_W);
          w = clamp(startVb.w - dx, MIN_W, startVb.x + startVb.w - x);
          h = clamp(startVb.h + dy, MIN_H, baseViewBox.y + baseViewBox.h - startVb.y);
          break;
        case "se":
          w = clamp(startVb.w + dx, MIN_W, baseViewBox.x + baseViewBox.w - startVb.x);
          h = clamp(startVb.h + dy, MIN_H, baseViewBox.y + baseViewBox.h - startVb.y);
          break;
        default:
          return;
      }

      setVb({ x, y, w, h });
    };

    const onUp = () => setDrag(null);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [drag, pixelToViewBox]);

  const handleSave = () => {
    onSave?.(insetsFromViewBoxForBase(vb, baseViewBox));
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  const handleReset = () => {
    hasUserAdjustedRef.current = false;
    setVb(viewBoxFromInsetsForBase(originalCrop || FULL_VIEW_INSETS, baseViewBox));
  };

  if (!isOpen) return null;

  const leftPct = ((vb.x - baseViewBox.x) / baseViewBox.w) * 100;
  const topPct = ((vb.y - baseViewBox.y) / baseViewBox.h) * 100;
  const widthPct = (vb.w / baseViewBox.w) * 100;
  const heightPct = (vb.h / baseViewBox.h) * 100;
  const rightPct = 100 - leftPct - widthPct;
  const bottomPct = 100 - topPct - heightPct;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Crop map"
    >
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.eyebrow}>Crop area</div>
            <h2 className={styles.title}>Crop map</h2>
            <p className={styles.headerSubtext}>
              Drag the edges or corners to set the crop area. Save to apply or Cancel to discard.
            </p>
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleCancel}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className={styles.cropArea}>
          <div
            className={styles.mapContainer}
            ref={containerRef}
            style={{ "--map-ar": `${baseViewBox.w} / ${baseViewBox.h}` }}
          >
            <div className={styles.mapWrap} ref={mapStageRef}>
              {isUsCropMap ? (
                <MapUS
                  {...mapProps}
                  staticView={true}
                  strokeMode="thick"
                  isLargeMap={false}
                  hoveredCode={null}
                  selectedCode={null}
                  groupHoveredCodes={[]}
                  groupActiveCodes={[]}
                  suppressInfoBox={true}
                  activeLegendModel={null}
                  onCloseActiveLegend={() => {}}
                  onHoverCode={() => {}}
                  onSelectCode={() => {}}
                />
              ) : (
                <MapView
                  {...mapProps}
                  isThumbnail={true}
                  staticView={true}
                  strokeMode="thick"
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
                  onTransformChange={() => {}}
                />
              )}
            </div>

            <div className={styles.mapBlockOverlay} aria-hidden="true" />

            <div
              className={styles.cropOverlay}
              style={
                {
                  "--crop-left": `${leftPct}%`,
                  "--crop-top": `${topPct}%`,
                  "--crop-width": `${widthPct}%`,
                  "--crop-height": `${heightPct}%`,
                  "--crop-right": `${rightPct}%`,
                  "--crop-bottom": `${bottomPct}%`,
                }
              }
            >
              <div className={`${styles.shade} ${styles.shadeTop}`} />
              <div className={`${styles.shade} ${styles.shadeBottom}`} />
              <div className={`${styles.shade} ${styles.shadeLeft}`} />
              <div className={`${styles.shade} ${styles.shadeRight}`} />
              <div className={styles.cropWindow}>
                <div
                  className={styles.handle + " " + styles.handleN}
                  onPointerDown={(e) => handlePointerDown(e, "n")}
                  role="slider"
                  aria-label="Resize crop top"
                />
                <div
                  className={styles.handle + " " + styles.handleS}
                  onPointerDown={(e) => handlePointerDown(e, "s")}
                  aria-label="Resize crop bottom"
                />
                <div
                  className={styles.handle + " " + styles.handleE}
                  onPointerDown={(e) => handlePointerDown(e, "e")}
                  aria-label="Resize crop right"
                />
                <div
                  className={styles.handle + " " + styles.handleW}
                  onPointerDown={(e) => handlePointerDown(e, "w")}
                  aria-label="Resize crop left"
                />
                <div
                  className={styles.handle + " " + styles.handleNW}
                  onPointerDown={(e) => handlePointerDown(e, "nw")}
                  aria-label="Resize crop top-left"
                />
                <div
                  className={styles.handle + " " + styles.handleNE}
                  onPointerDown={(e) => handlePointerDown(e, "ne")}
                  aria-label="Resize crop top-right"
                />
                <div
                  className={styles.handle + " " + styles.handleSW}
                  onPointerDown={(e) => handlePointerDown(e, "sw")}
                  aria-label="Resize crop bottom-left"
                />
                <div
                  className={styles.handle + " " + styles.handleSE}
                  onPointerDown={(e) => handlePointerDown(e, "se")}
                  aria-label="Resize crop bottom-right"
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={`${styles.actionPill} ${styles.resetPill}`} onClick={handleReset}>
            Reset
          </button>
          <button type="button" className={`${styles.actionPill} ${styles.cancelPill}`} onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className={`${styles.actionPill} ${styles.primaryPill}`} onClick={handleSave}>
            Save crop
          </button>
        </div>
      </div>
    </div>
  );
}
