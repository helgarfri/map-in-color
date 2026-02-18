import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView from "./Map";
import {
  VBW,
  VBH,
  viewBoxFromInsets,
  insetsFromViewBox,
} from "../utils/downloadViewBoxUtils";
import styles from "./MapCropModal.module.css";

const MIN_W = VBW * 0.05;
const MIN_H = VBH * 0.05;

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
  const prevOpenRef = useRef(false);
  const [vb, setVb] = useState(() =>
    viewBoxFromInsets(initialCrop || FULL_VIEW_INSETS)
  );
  const [drag, setDrag] = useState(null);

  // Sync vb when modal opens (show current crop)
  useEffect(() => {
    const justOpened = isOpen && !prevOpenRef.current;
    prevOpenRef.current = isOpen;
    if (justOpened) {
      setVb(viewBoxFromInsets(initialCrop || FULL_VIEW_INSETS));
    }
  }, [isOpen, initialCrop]);

  const pixelToViewBox = useCallback((clientX, clientY) => {
    const el = containerRef.current;
    if (!el) return { x: 0, y: 0 };
    const r = el.getBoundingClientRect();
    const sx = VBW / r.width;
    const sy = VBH / r.height;
    return {
      x: (clientX - r.left) * sx,
      y: (clientY - r.top) * sy,
    };
  }, []);

  const handlePointerDown = useCallback(
    (e, handle) => {
      e.preventDefault();
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
          y = clamp(startVb.y + dy, 0, VBH - MIN_H);
          h = clamp(startVb.h - dy, MIN_H, VBH - y);
          break;
        case "s":
          h = clamp(startVb.h + dy, MIN_H, VBH - startVb.y);
          break;
        case "e":
          w = clamp(startVb.w + dx, MIN_W, VBW - startVb.x);
          break;
        case "w":
          x = clamp(startVb.x + dx, 0, VBW - MIN_W);
          w = clamp(startVb.w - dx, MIN_W, startVb.x + startVb.w - x);
          break;
        case "nw":
          x = clamp(startVb.x + dx, 0, VBW - MIN_W);
          w = clamp(startVb.w - dx, MIN_W, startVb.x + startVb.w - x);
          y = clamp(startVb.y + dy, 0, VBH - MIN_H);
          h = clamp(startVb.h - dy, MIN_H, startVb.y + startVb.h - y);
          break;
        case "ne":
          w = clamp(startVb.w + dx, MIN_W, VBW - startVb.x);
          y = clamp(startVb.y + dy, 0, VBH - MIN_H);
          h = clamp(startVb.h - dy, MIN_H, startVb.y + startVb.h - y);
          break;
        case "sw":
          x = clamp(startVb.x + dx, 0, VBW - MIN_W);
          w = clamp(startVb.w - dx, MIN_W, startVb.x + startVb.w - x);
          h = clamp(startVb.h + dy, MIN_H, VBH - startVb.y);
          break;
        case "se":
          w = clamp(startVb.w + dx, MIN_W, VBW - startVb.x);
          h = clamp(startVb.h + dy, MIN_H, VBH - startVb.y);
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
    onSave?.(insetsFromViewBox(vb));
    onClose?.();
  };

  const handleCancel = () => {
    onClose?.();
  };

  const handleReset = () => {
    setVb(viewBoxFromInsets(originalCrop || FULL_VIEW_INSETS));
  };

  if (!isOpen) return null;

  const leftPct = (vb.x / VBW) * 100;
  const topPct = (vb.y / VBH) * 100;
  const widthPct = (vb.w / VBW) * 100;
  const heightPct = (vb.h / VBH) * 100;
  const rightPct = 100 - leftPct - widthPct;
  const bottomPct = 100 - topPct - heightPct;

  const mapProps = typeof mapDataProps === "function" ? mapDataProps() : mapDataProps || {};

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
          <div className={styles.mapContainer} ref={containerRef}>
            <div className={styles.mapWrap}>
              <MapView
                {...mapProps}
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
