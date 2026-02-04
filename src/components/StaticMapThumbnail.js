// src/components/StaticMapThumbnail.js
import React from 'react';
import Map from './Map';
import styles from './StaticMapThumbnail.module.css';

export default function StaticMapThumbnail({
  map,
  className = '',
  background = '#dddddd',
  children,
}) {
  if (!map) {
    return (
      <div className={`${styles.container} ${className}`} style={{ background }}>
        <div className={styles.fallback}>No preview</div>
      </div>
    );
  }

  const title = map.title || 'Untitled';

  const ocean_color = map.ocean_color ?? '#ffffff';
  const unassigned_color = map.unassigned_color ?? '#c0c0c0';
  const font_color = map.font_color ?? 'black';

  const is_title_hidden = !!map.is_title_hidden;
  const showNoDataLegend = !!map.show_no_data_legend;

  const titleFontSize = map.title_font_size ?? map.titleFontSize ?? null;
  const legendFontSize = map.legend_font_size ?? map.legendFontSize ?? null;

  const groups = Array.isArray(map.groups) ? map.groups : [];
  const data = Array.isArray(map.data) ? map.data : [];

  const selectedMap = map.selected_map || map.selectedMap || 'world';

  return (
    <div className={`${styles.container} ${className}`} style={{ background }}>
      <div className={styles.stage}>
        <Map
          groups={groups}
          mapTitleValue={title}
          ocean_color={ocean_color}
          unassigned_color={unassigned_color}
          data={data}
          selected_map={selectedMap}
          font_color={font_color}
          is_title_hidden={is_title_hidden}
          isThumbnail={true}
          showNoDataLegend={showNoDataLegend}
          titleFontSize={titleFontSize}
          legendFontSize={legendFontSize}
        />
      </div>

      {/* ✅ Hard block ALL hover/zoom/pan/tooltips */}
      <div className={styles.blocker} aria-hidden="true" />

      {children}
    </div>
  );
}
