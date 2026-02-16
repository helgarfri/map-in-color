import React, { useState } from "react";
import styles from "./MapLegendOverlay.module.css";

export default function MapLegendOverlay({
  title,
  legendModels,
  activeLegendKey,
  setActiveLegendKey,
  setHoverLegendKey,
  isEmbed = false,
}) {
  const [legendCollapsed, setLegendCollapsed] = useState(false);

  return (
    <div className={styles.mapLegendBox} aria-label="Legend" data-embed={isEmbed ? "1" : "0"}>
      <div className={styles.mapLegendHeader}>
        <div className={styles.mapLegendHeaderRow}>
          <div className={styles.mapLegendTitle}>{title || "Untitled Map"}</div>
          <button
            type="button"
            className={`${styles.mapLegendToggleBtn} ${legendCollapsed ? styles.mapLegendToggleBtnCollapsed : ""}`}
            onClick={() => setLegendCollapsed((c) => !c)}
            aria-label={legendCollapsed ? "Show legend" : "Hide legend"}
            aria-expanded={!legendCollapsed}
            title={legendCollapsed ? "Show legend" : "Hide legend"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className={`${styles.mapLegendItemsWrap} ${legendCollapsed ? styles.mapLegendItemsWrapCollapsed : ""}`}>
        <div className={styles.mapLegendItems}>
        {legendModels?.length === 0 ? (
          <div className={styles.mapLegendEmpty}>No legend data</div>
        ) : (
          legendModels.map((item) => {
            const isActive = activeLegendKey === item.key;

            return (
              <div
                key={item.key}
                className={`${styles.mapLegendRow} ${isActive ? styles.mapLegendRowActive : ""}`}
                onMouseEnter={() => setHoverLegendKey(item.key)}
                onMouseLeave={() => setHoverLegendKey(null)}
                onClick={() => {
                  // “click to activate” (no toggle-off)
                  setActiveLegendKey(item.key);
                }}
                role="button"
                tabIndex={0}
              >
                <span className={styles.mapLegendDot} style={{ backgroundColor: item.color }} />
                <div className={styles.mapLegendText}>
                  <div className={styles.mapLegendLabel}>{item.label}</div>
                  {item.meta && <div className={styles.mapLegendMeta}>{item.meta}</div>}
                </div>
                <span className={styles.mapLegendHoverHint} aria-hidden="true">↗</span>
              </div>
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}
