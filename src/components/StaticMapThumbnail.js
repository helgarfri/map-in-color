// src/components/StaticMapThumbnail.js
import React from 'react';
import Map from './Map';
import MapUS from './MapUS';
import { inferPresetIdFromCodes } from '../constants/regionPresets';
import styles from './StaticMapThumbnail.module.css';

const DEFAULT_THUMB_BG = '#dddddd';
const toArrayMaybeJson = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

export default function StaticMapThumbnail({
  map,
  className = '',
  background = DEFAULT_THUMB_BG,
  children,
}) {
  /* When background is the default, use CSS (var(--thumbnail-bg)) so dark mode applies */
  const inlineBg = background !== DEFAULT_THUMB_BG ? { background } : undefined;

  if (!map) {
    return (
      <div className={`${styles.container} ${className}`} style={inlineBg}>
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
  const show_microstates = map.show_microstates !== false;
  const microstatesCustomArray = toArrayMaybeJson(map.microstates_custom);
  const customMapCountriesArray = toArrayMaybeJson(map.custom_map_countries);
  const microstates_custom = microstatesCustomArray.length ? microstatesCustomArray : null;
  const custom_map_countries = customMapCountriesArray.length ? customMapCountriesArray : null;
  const custom_map_preset_id = map.custom_map_preset_id ?? map.customMapPresetId ?? inferPresetIdFromCodes(customMapCountriesArray);

  const titleFontSize = map.title_font_size ?? map.titleFontSize ?? null;
  const legendFontSize = map.legend_font_size ?? map.legendFontSize ?? null;

  const groups = Array.isArray(map.groups) ? map.groups : [];
  const data = Array.isArray(map.data) ? map.data : [];

  const selectedMap = map.selected_map || map.selectedMap || 'world';

  const custom_ranges = Array.isArray(map.custom_ranges)
  ? map.custom_ranges
  : Array.isArray(map.customRanges)
  ? map.customRanges
  : typeof map.custom_ranges === "string"
  ? (() => {
      try {
        const parsed = JSON.parse(map.custom_ranges);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    })()
  : [];

const mapDataType =
  map.mapDataType ??
  map.map_data_type ??
  map.map_type ??
  map.type ??
  undefined;


  const isUsa = selectedMap === 'usa';

  return (
    <div className={`${styles.container} ${className}`} style={inlineBg}>
      <div className={styles.stage}>
        {isUsa ? (
          <MapUS
            groups={groups}
            custom_ranges={custom_ranges}
            mapDataType={mapDataType}
            mapTitleValue={title}
            ocean_color={ocean_color}
            unassigned_color={unassigned_color}
            data={data}
            font_color={font_color}
            is_title_hidden={is_title_hidden}
            titleFontSize={titleFontSize}
            legendFontSize={legendFontSize}
            strokeMode="thin"
            staticView={true}
            suppressInfoBox={true}
          />
        ) : (
          <Map
            groups={groups}
            custom_ranges={custom_ranges}
            mapDataType={mapDataType}
            mapTitleValue={title}
            ocean_color={ocean_color}
            unassigned_color={unassigned_color}
            data={data}
            selected_map={selectedMap}
            font_color={font_color}
            is_title_hidden={is_title_hidden}
            isThumbnail={true}
            showNoDataLegend={showNoDataLegend}
            show_microstates={show_microstates}
            microstates_custom={microstates_custom}
            custom_map_countries={custom_map_countries}
            custom_map_preset_id={custom_map_preset_id}
            titleFontSize={titleFontSize}
            legendFontSize={legendFontSize}
            strokeMode="thin"
          />
        )}
      </div>

      {/* ✅ Hard block ALL hover/zoom/pan/tooltips */}
      <div className={styles.blocker} aria-hidden="true" />

      {children}
    </div>
  );
}
