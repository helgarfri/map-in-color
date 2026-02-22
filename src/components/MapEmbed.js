import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import MapView from "../components/Map";
import MapLegendOverlay from "../components/MapLegendOverlay";
import useWindowSize from "../hooks/useWindowSize";
import { fetchMapById } from "../api";
import countries from "../world-countries.json";
import styles from "./MapEmbed.module.css";

const EMBED_COMPACT_WIDTH = 520;
const EMBED_COMPACT_HEIGHT = 360;

// reuse your helpers (paste from MapDetail or import them)
function parseJsonArray(x) {
  if (!x) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === "string") {
    try { return parseJsonArray(JSON.parse(x)); } catch { return []; }
  }
  if (typeof x === "object") {
    const candidates = [x.ranges, x.items, x.values, x.data, x.legend, x.groups, x.categories, x.custom_ranges, x.customRanges];
    for (const c of candidates) if (Array.isArray(c)) return c;
  }
  return [];
}
function parseJsonObject(x) {
  if (!x) return {};
  if (typeof x === "object") return x;
  if (typeof x === "string") {
    try {
      const parsed = JSON.parse(x);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch { return {}; }
  }
  return {};
}
function toBool(v) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}

export default function MapEmbed() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  // Embed options from URL (?theme=dark&branding=0&legend=0&interactive=0&token=...)
  const embedTheme = searchParams.get("theme") === "dark" ? "dark" : "light";
  const showLegend = searchParams.get("legend") !== "0";
  const isInteractive = searchParams.get("interactive") !== "0";
  const embedToken = searchParams.get("token") || null;

  const [mapData, setMapData] = useState(null);
  const [loadState, setLoadState] = useState("loading"); // loading|ready|error|private

  // Only allow unbranded when API confirms allow_unbranded (Pro token); otherwise force branding
  const urlWantsUnbranded = searchParams.get("branding") === "0";
  const showBranding = urlWantsUnbranded ? !(mapData?.allow_unbranded) : true;

  // legend interaction states (same as MapDetail)
  const [activeLegendKey, setActiveLegendKey] = useState(null);
  const [hoverLegendKey, setHoverLegendKey] = useState(null);

  const [hoveredCode, setHoveredCode] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedCodeZoom, setSelectedCodeZoom] = useState(false);
  const [selectedCodeNonce, setSelectedCodeNonce] = useState(0);

  const { width: embedWidth, height: embedHeight } = useWindowSize();
  const isSmallEmbed =
    embedWidth < EMBED_COMPACT_WIDTH || embedHeight < EMBED_COMPACT_HEIGHT;
  const isNarrowPortrait = embedWidth < embedHeight && embedWidth < 700;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadState("loading");
      try {
        const res = await fetchMapById(id, { embedToken: embedToken || undefined });
        if (cancelled) return;

        if (!res?.data) {
          setLoadState("error");
          return;
        }

        // Private map & not owner → show branded “map is private” message
        if (res.data.is_public === false && !res.data.isOwner) {
          setLoadState("private");
          return;
        }

        setMapData(res.data);
        setLoadState("ready");
      } catch (e) {
        setLoadState("error");
      }
    }

    load();
    return () => { cancelled = true; };
  }, [id, embedToken]);

  const mapType = useMemo(() => {
    const raw =
      mapData?.mapDataType ??
      mapData?.map_data_type ??
      mapData?.map_type ??
      mapData?.type ??
      "choropleth";
    return String(raw).toLowerCase();
  }, [mapData]);

  const countryCodeToName = useMemo(() => {
    return countries.reduce((acc, c) => {
      acc[c.code] = c.name;
      return acc;
    }, {});
  }, []);

  const legendModels = useMemo(() => {
    if (!mapData) return [];
    const dataArr = parseJsonArray(mapData.data);

    const codeToValue = new Map();
    for (const d of dataArr) {
      const code = String(d.code || "").trim().toUpperCase();
      if (!code) continue;
      codeToValue.set(code, d.value);
    }

    // categorical
    if (mapType === "categorical") {
      const groups = parseJsonArray(mapData.groups);

      const codeToCat = new Map();
      for (const d of dataArr) {
        const code = String(d.code || "").trim().toUpperCase();
        if (!code) continue;
        const cat = d.value == null ? "" : String(d.value).trim();
        codeToCat.set(code, cat);
      }

      return groups
        .map((g, idx) => {
          const label =
            (typeof g.title === "string" && g.title.trim())
              ? g.title.trim()
              : (g.name ?? g.label ?? "Group");

          const color = g.color ?? g.fill ?? g.hex ?? g.groupColor ?? g.group_color ?? "#e5e7eb";

          let codes = new Set(
            (g.countries || [])
              .map((c) => {
                const raw =
                  typeof c === "string"
                    ? c
                    : (c?.code ?? c?.countryCode ?? c?.country_code ?? c?.id ?? "");
                return String(raw || "").trim().toUpperCase();
              })
              .filter(Boolean)
          );

          if (codes.size === 0) {
            const matchKeys = [
              typeof g.id === "string" ? String(g.id).trim() : null,
              label,
              typeof g.name === "string" ? g.name.trim() : null,
              typeof g.title === "string" ? g.title.trim() : null,
              typeof g.label === "string" ? g.label.trim() : null,
            ].filter(Boolean);

            for (const [code, cat] of codeToCat.entries()) {
              if (cat && matchKeys.includes(cat)) codes.add(code);
            }
          }

          return { key: g.id ?? `cat-${idx}-${label}-${color}`, label, color, codes };
        })
        .filter((m) => m.label);
    }

    // choropleth
    const ranges = parseJsonArray(mapData.custom_ranges ?? mapData.customRanges);
    const numOrNull = (v) => {
      const n = Number(v);
      return Number.isFinite(n) ? n : null;
    };

    const models = ranges
      .map((r, idx) => {
        const min = numOrNull(r.lowerBound ?? r.min ?? r.from ?? r.start ?? r.low ?? r.lower ?? r.rangeMin);
        const max = numOrNull(r.upperBound ?? r.max ?? r.to ?? r.end ?? r.high ?? r.upper ?? r.rangeMax);
        const color = r.color ?? r.fill ?? r.hex ?? r.rangeColor ?? r.range_color ?? "#e5e7eb";

        const nameOnly = typeof r.name === "string" && r.name.trim() ? r.name.trim() : null;
        const titleOnly = typeof r.title === "string" && r.title.trim() ? r.title.trim() : null;
        const labelOnly = typeof r.label === "string" && r.label.trim() ? r.label.trim() : null;

        const label =
          nameOnly ??
          titleOnly ??
          labelOnly ??
          (min != null && max != null ? `${min} – ${max}` : min != null ? `≥ ${min}` : max != null ? `≤ ${max}` : "Range");

        const codes = new Set();
        for (const [code, rawVal] of codeToValue.entries()) {
          const n = Number(rawVal);
          if (!Number.isFinite(n)) continue;
          if (min != null && max != null && n >= min && n <= max) codes.add(code);
        }

        return {
          key: r.id ?? `range-${idx}-${min}-${max}-${color}-${label}`,
          label,
          color,
          min,
          max,
          codes,
          sortValue: max != null ? max : min != null ? min : -Infinity,
        };
      })
      .filter((m) => m.label);

    models.sort((a, b) => (b.sortValue ?? -Infinity) - (a.sortValue ?? -Infinity));
    return models;
  }, [mapData, mapType]);

  const hoveredLegendCodes = useMemo(() => {
    if (!hoverLegendKey) return [];
    const item = legendModels.find((x) => x.key === hoverLegendKey);
    return item ? Array.from(item.codes) : [];
  }, [hoverLegendKey, legendModels]);

  const activeLegendCodes = useMemo(() => {
    if (!activeLegendKey) return [];
    const item = legendModels.find((x) => x.key === activeLegendKey);
    return item ? Array.from(item.codes) : [];
  }, [activeLegendKey, legendModels]);

  const activeLegendModel = useMemo(() => {
    if (!activeLegendKey) return null;
    return legendModels.find((x) => x.key === activeLegendKey) ?? null;
  }, [activeLegendKey, legendModels]);

  const suppressInfoBox = !!activeLegendKey;

  function mapDataProps() {
    if (!mapData) return {};
    return {
      mapDataType: mapData.mapDataType ?? mapData.map_data_type ?? mapData.map_type ?? mapData.type ?? null,
      data: parseJsonArray(mapData.data),
      custom_ranges: parseJsonArray(mapData.custom_ranges ?? mapData.customRanges),
      groups: parseJsonArray(mapData.groups),
      placeholders: parseJsonObject(mapData.placeholders),
      customDescriptions: parseJsonObject(mapData.placeholders),

      ocean_color: mapData.ocean_color,
      unassigned_color: mapData.unassigned_color,
      font_color: mapData.font_color,

      mapTitleValue: mapData.title,
      title: mapData.title,
      mapTitle: mapData.title,

      is_title_hidden: toBool(mapData.is_title_hidden),
      titleFontSize: Number(mapData.title_font_size) || 28,
      legendFontSize: Number(mapData.legend_font_size) || 18,

      show_top_high_values: toBool(mapData.show_top_high_values),
      show_top_low_values: toBool(mapData.show_top_low_values),
      showNoDataLegend: toBool(mapData.show_no_data_legend),
      top_low_values: parseJsonArray(mapData.top_low_values),

      strokeMode: "thick",
    };
  }

  // ── render gates ─────────────────
  const rootBase = `${styles.embedRoot} ${embedTheme === "dark" ? styles.embedRootDark : ""}`;
  if (loadState === "loading") {
    return <div className={rootBase}><div className={styles.skeleton} /></div>;
  }

  if (loadState === "private") {
    return (
      <div className={rootBase}>
        <div className={styles.privateBox}>
          <div className={styles.privateLogoWrap}>
            <img
              className={styles.privateLogo}
              src="/assets/3-0/mic-logo-2-5-text-cropped.png"
              alt="Map in Color"
            />
          </div>
          <div className={styles.privateTextWrap}>
            <h2 className={styles.privateTitle}>This map is private</h2>
            <p className={styles.privateSub}>Sign in to Map in Color to view it.</p>
          </div>
        </div>
      </div>
    );
  }

  if (loadState === "error" || !mapData) {
    return (
      <div className={rootBase}>
        <div className={styles.errorBox}>
          <div className={styles.errorTitle}>Map not available</div>
          <div className={styles.errorSub}>This map can’t be embedded.</div>
        </div>
      </div>
    );
  }

  const mapWrapClassName = `${styles.mapWrap} ${!isInteractive ? styles.mapWrapStatic : ""}`;

  return (
    <div className={rootBase}>
      <div className={mapWrapClassName}>
        <MapView
          {...mapDataProps()}
          isLargeMap={true}
          theme={embedTheme}
          staticView={!isInteractive}
          compactUi={isSmallEmbed}
          hoveredCode={isInteractive ? hoveredCode : null}
          selectedCode={isInteractive ? selectedCode : null}
          selectedCodeZoom={selectedCodeZoom}
          selectedCodeNonce={selectedCodeNonce}
          groupHoveredCodes={isInteractive ? hoveredLegendCodes : []}
          groupActiveCodes={isInteractive ? activeLegendCodes : []}
          suppressInfoBox={suppressInfoBox}
          activeLegendModel={activeLegendModel}
          codeToName={countryCodeToName}
          onCloseActiveLegend={() => {
            setActiveLegendKey(null);
            setHoverLegendKey(null);
          }}
          onHoverCode={isInteractive ? (code) => setHoveredCode(code) : () => {}}
          onSelectCode={
            isInteractive
              ? (code) => {
                  if (code) {
                    setActiveLegendKey(null);
                    setHoverLegendKey(null);
                  }
                  setSelectedCode(code);
                  setSelectedCodeZoom(false);
                  setSelectedCodeNonce((n) => n + 1);
                }
              : () => {}
          }
        />

        {!isInteractive && (
          <div className={styles.mapNonInteractiveOverlay} aria-hidden="true" />
        )}

        {loadState === "ready" && isNarrowPortrait && (
          <div
            className={`${styles.turnScreenPrompt} ${embedTheme === "dark" ? styles.turnScreenPromptDark : ""}`}
            role="status"
            aria-live="polite"
          >
            <svg className={styles.turnScreenIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.22-8.56" />
              <path d="M21 3v6h-6" />
            </svg>
            <span>Turn your screen for a better experience</span>
          </div>
        )}

        {showLegend && (
          <MapLegendOverlay
            title={mapData?.title}
            legendModels={legendModels}
            activeLegendKey={activeLegendKey}
            setActiveLegendKey={(k) => {
              if (!isInteractive) return;
              setSelectedCode(null);
              setSelectedCodeZoom(false);
              setSelectedCodeNonce((n) => n + 1);
              setActiveLegendKey(k);
            }}
            setHoverLegendKey={isInteractive ? setHoverLegendKey : () => {}}
            isEmbed
            theme={embedTheme}
            interactive={isInteractive}
            compact={isSmallEmbed}
          />
        )}

        {showBranding && (
          <div className={styles.watermark} aria-hidden="true">
            <div className={styles.watermarkText}>Made with</div>
            <img
              className={styles.watermarkLogo}
              src="/assets/3-0/mic-logo-2-5-text-cropped.png"
              alt=""
              draggable={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
