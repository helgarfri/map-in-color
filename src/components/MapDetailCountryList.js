// src/components/MapDetailCountryList.js
import React, { useMemo, useRef, useLayoutEffect, useState, useCallback } from "react";
import styles from "./MapDetailCountryList.module.css";

import countryCodes from "../world-countries.json";
import usStatesCodes from "../united-states.json";
import euCodes from "../european-countries.json";

const norm = (c) => String(c || "").trim().toUpperCase();
const safeTrim = (v) => (v == null ? "" : String(v).trim());

function toNumOrNull(x) {
  const s = safeTrim(x);
  if (!s) return null;
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function toNum(x) {
  const n =
    typeof x === "number" ? x : parseFloat(String(x ?? "").replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function normalizeGroups(groups = []) {
  return (groups || [])
    .filter(Boolean)
    .map((g) => ({
      ...g,
      countries: (g.countries || [])
        .map((c) => {
          const code =
            typeof c === "string"
              ? c
              : (c?.code ?? c?.countryCode ?? c?.id ?? "");
          return { code: norm(code) };
        })
        .filter((c) => c.code),
    }))
    .filter((g) => g.countries?.length > 0);
}

function formatDotsInteger(n) {
  // 1234567 -> "1.234.567"
  const s = Math.trunc(Math.abs(n)).toString();
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDotsNumber(n, maxDecimals = 5) {
  // 1000.34598 -> "1.000,34598"
  if (typeof n !== "number" || !Number.isFinite(n)) return "No data";

  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  // Round to maxDecimals (avoids floating noise)
  const rounded = Number(abs.toFixed(maxDecimals));

  const intPart = Math.trunc(rounded);
  const frac = rounded - intPart;

  const intStr = formatDotsInteger(intPart);

  if (frac === 0) return sign + intStr;

  // Take up to maxDecimals digits, then trim trailing zeros
  const fracStr = frac.toFixed(maxDecimals).slice(2).replace(/0+$/, "");
  return fracStr ? `${sign}${intStr},${fracStr}` : `${sign}${intStr}`;
}

function formatValueLong(n) {
  if (typeof n !== "number" || !Number.isFinite(n)) return "No data";

  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);

  // Full number formatting up to < 1 quadrillion, WITH decimals up to 5 places
  const ABBREV_FROM = 1e15;
  if (abs < ABBREV_FROM) {
    return sign + formatDotsNumber(abs, 5).replace(/^-/, ""); // keep sign from `sign`
  }

  const units = [
    { value: 1e24, label: "septillion" },
    { value: 1e21, label: "sextillion" },
    { value: 1e18, label: "quintillion" },
    { value: 1e15, label: "quadrillion" },
    { value: 1e12, label: "trillion" },
    { value: 1e9, label: "billion" },
    { value: 1e6, label: "million" },
    { value: 1e3, label: "thousand" },
  ];

  const u = units.find((x) => abs >= x.value) || units[units.length - 1];
  const scaled = abs / u.value;

  // Abbreviated form: keep up to 2 decimals (EU style)
  const scaledStr = formatDotsNumber(scaled, 2);
  return `${sign}${scaledStr} ${u.label}`;
}




export default function MapDetailCountryList({
  selectedMap = "world",          // "world" | "usa" | "europe"
  mapDataType = "choropleth",     // "choropleth" | "categorical"
  dataEntries = [],        
    placeholders = {},          // ✅ NEW
  customRanges = [],          // ✅ NEW
  groups = [],                // ✅ NEW
  unassignedColor = "#e5e7eb",// ✅ NEW      // mapData.data parsed
  hoveredCode = null,
  selectedCode = null,
  onHoverCode,
  onSelectCode,                  // single click select (no zoom)
  onRequestZoom,                 // double click => zoom
}) {
  const rowRefs = useRef(new Map());
  const listRef = useRef(null);

  const [sortMode, setSortMode] = useState(() =>
    mapDataType === "choropleth" ? "value_high_low" : "cat_az"
  );

function getChoroplethLabel(value) {
  const n = toNumOrNull(value);
  if (n == null) return "No data";

  // If your customRanges include a label/name, show it.
  for (const r of customRanges || []) {
    const min = Number(r?.min);
    const max = Number(r?.max);
    if (!Number.isFinite(min) || !Number.isFinite(max)) continue;
    if (n >= min && n <= max) {
      return safeTrim(r?.label) || safeTrim(r?.name) || `${min}–${max}`;
    }
  }

  return "Unassigned";
}

function getCategoricalLabel(value) {
  const v = safeTrim(value);
  if (!v) return "No data";

  // If groups contain “label/name/category”, return the group label for the matching value.
  for (const g of groups || []) {
    const label = safeTrim(g?.title) || safeTrim(g?.name) || safeTrim(g?.label) || safeTrim(g?.category) || safeTrim(g?.value);

    if (safeTrim(g?.id) === v) return label || v;
    if (safeTrim(g?.value) === v) return label || v;
    if (safeTrim(g?.label) === v) return label || v;
    if (safeTrim(g?.category) === v) return label || v;

    if (Array.isArray(g?.values) && g.values.map(safeTrim).includes(v)) return label || v;
    if (Array.isArray(g?.items) && g.items.map(safeTrim).includes(v)) return label || v;
  }

  // fallback: the raw category itself
  return v;
}

function getValueLabel(r) {
  return mapDataType === "choropleth"
    ? getChoroplethLabel(r.value)
    : getCategoricalLabel(r.value);
}


const safeColor = (c) => (typeof c === "string" && c.trim() ? c.trim() : null);

function pickChoroplethColor(value) {
  const n = toNumOrNull(value);
  if (n == null) return unassignedColor;

  // customRanges: [{ min, max, color }, ...]
  for (const r of customRanges || []) {
    const min = Number(r?.min);
    const max = Number(r?.max);
    const col = safeColor(r?.color);
    if (!Number.isFinite(min) || !Number.isFinite(max) || !col) continue;

    // inclusive range match (adjust if your Map.js does different)
    if (n >= min && n <= max) return col;
  }

  // fallback if no range matched
  return unassignedColor;
}

function pickCategoricalColor(value) {
  const v = safeTrim(value);
  if (!v) return unassignedColor;

  // groups often look like: [{ label/value/category, color, items/values }, ...]
  for (const g of groups || []) {
    const col = safeColor(g?.color);
    if (!col) continue;

    // Match by id first (data often stores value = group id), then label/value/category
    if (safeTrim(g?.id) === v) return col;
    if (safeTrim(g?.value) === v) return col;
    if (safeTrim(g?.label) === v) return col;
    if (safeTrim(g?.category) === v) return col;

    if (Array.isArray(g?.values) && g.values.map(safeTrim).includes(v)) return col;
    if (Array.isArray(g?.items) && g.items.map(safeTrim).includes(v)) return col;
  }

  return unassignedColor;
}
const effectiveMapType = useMemo(() => {
  if (mapDataType) return mapDataType;

  const looksCategorical =
    Array.isArray(groups) &&
    groups.some((g) => typeof g?.name === "string" && g.name.trim().length > 0);

  return looksCategorical ? "categorical" : "choropleth";
}, [mapDataType, groups]);

// normalize data like Map.js does
const normalizedData = useMemo(() => {
  return (dataEntries || []).map((d) => {
    const code = norm(d.code);
    if (effectiveMapType === "choropleth") {
      return { ...d, code, value: toNum(d.value) };
    }
    return { ...d, code, value: d.value == null ? "" : String(d.value) };
  });
}, [dataEntries, effectiveMapType]);

const derivedGroups = useMemo(() => {
  const hasRanges = Array.isArray(customRanges) && customRanges.length > 0;

  const hasOldGroups =
    Array.isArray(groups) &&
    groups.length > 0 &&
    groups.some((g) => Array.isArray(g?.countries) && g.countries.length > 0);

  // CHOROPLETH
  if (effectiveMapType === "choropleth") {
    if (hasRanges) {
      // Map.js uses lowerBound / upperBound
      const ranges = customRanges
        .map((r) => ({
          ...r,
          lower: toNum(r.lowerBound),
          upper: toNum(r.upperBound),
        }))
        .filter((r) => r.lower != null && r.upper != null);

      return ranges.map((r) => ({
        color: (r.color ?? "").toString().trim() || unassignedColor,
        countries: normalizedData
          .filter(
            (d) =>
              typeof d.value === "number" &&
              d.value >= r.lower &&
              d.value < r.upper
          )
          .map((d) => ({ code: d.code })),
      }));
    }

    if (hasOldGroups) return normalizeGroups(groups);
    return [];
  }

  // CATEGORICAL
  if (hasOldGroups) return normalizeGroups(groups);

  // fallback categorical: groups with {name,color} (Map.js logic)
  const colorByCategory = new Map();
  for (const g of Array.isArray(groups) ? groups : []) {
    if (!g) continue;
    const key = (g.name ?? g.category ?? g.label ?? "").toString().trim();
    const color = (g.color ?? g.hex ?? g.fill ?? "").toString().trim();
    if (key) colorByCategory.set(key, color || "#c0c0c0");
  }

  const categories = Array.from(
    new Set(
      normalizedData
        .map((d) => (d.value == null ? "" : String(d.value).trim()))
        .filter(Boolean)
    )
  );

  return categories.map((cat) => ({
    name: cat,
    color: colorByCategory.get(cat) || "#c0c0c0",
    countries: normalizedData
      .filter((d) => String(d.value).trim() === cat)
      .map((d) => ({ code: d.code })),
  }));
}, [effectiveMapType, customRanges, groups, normalizedData, unassignedColor]);

const findColor = useCallback(
  (code) => {
    const C = norm(code);
    for (const g of derivedGroups) {
      if (g.countries?.some((c) => norm(c.code) === C)) return g.color;
    }
    return unassignedColor;
  },
  [derivedGroups, unassignedColor]
);


function getDotColor(r) {
  return findColor(r.code);
}


  // keep sort sane if type changes
  React.useEffect(() => {
    setSortMode(mapDataType === "choropleth" ? "value_high_low" : "cat_az");
  }, [mapDataType]);

  const dataSource = useMemo(() => {
    if (selectedMap === "usa") return usStatesCodes;
    if (selectedMap === "europe") return euCodes;
    return countryCodes;
  }, [selectedMap]);

  const byCodeValue = useMemo(() => {
    const m = new Map();
    (dataEntries || []).forEach((d) => {
      const code = norm(d.code);
      if (!code) return;
      m.set(code, d.value);
    });
    return m;
  }, [dataEntries]);

  const rows = useMemo(() => {
    // Build full list (including missing)
    const base = dataSource.map((item) => {
      const code = norm(item.code);
      const rawVal = byCodeValue.get(code);

      return {
        code,
        name: item.name,
        value: rawVal,
        hasValue:
          mapDataType === "choropleth"
            ? toNumOrNull(rawVal) != null
            : safeTrim(rawVal) !== "",
      };
    });

    const collator = new Intl.Collator(undefined, { sensitivity: "base" });
    const compareNameAZ = (a, b) => collator.compare(a.name, b.name);
    const compareNameZA = (a, b) => collator.compare(b.name, a.name);

    // choropleth sorting
    if (mapDataType === "choropleth") {
      const num = (r) => toNumOrNull(r.value);

      if (sortMode === "value_high_low") {
        return [...base].sort((a, b) => {
          const av = num(a);
          const bv = num(b);
          if (av == null && bv == null) return compareNameAZ(a, b);
          if (av == null) return 1;
          if (bv == null) return -1;
          return bv - av;
        });
      }

      if (sortMode === "value_low_high") {
        return [...base].sort((a, b) => {
          const av = num(a);
          const bv = num(b);
          if (av == null && bv == null) return compareNameAZ(a, b);
          if (av == null) return 1;
          if (bv == null) return -1;
          return av - bv;
        });
      }

      if (sortMode === "name_za") return [...base].sort(compareNameZA);
      return [...base].sort(compareNameAZ);
    }

    // categorical sorting
    const cat = (r) => safeTrim(r.value);

    if (sortMode === "cat_az") {
      return [...base].sort((a, b) => {
        const av = cat(a);
        const bv = cat(b);
        if (!av && !bv) return compareNameAZ(a, b);
        if (!av) return 1;
        if (!bv) return -1;
        const c = collator.compare(av, bv);
        return c !== 0 ? c : compareNameAZ(a, b);
      });
    }

    if (sortMode === "cat_za") {
      return [...base].sort((a, b) => {
        const av = cat(a);
        const bv = cat(b);
        if (!av && !bv) return compareNameAZ(a, b);
        if (!av) return 1;
        if (!bv) return -1;
        const c = collator.compare(bv, av);
        return c !== 0 ? c : compareNameAZ(a, b);
      });
    }

    if (sortMode === "name_za") return [...base].sort(compareNameZA);
    return [...base].sort(compareNameAZ);
  }, [dataSource, byCodeValue, mapDataType, sortMode]);


  // dbl-click detection
  const lastClickRef = useRef({ code: null, t: 0 });
  const DOUBLE_MS = 260;

  const handleRowClick = (code) => {
    const now = performance.now();
    const last = lastClickRef.current;

    // always select (single click behavior)
    onSelectCode?.(code);

    const isFastDouble = last.code === code && (now - last.t) <= DOUBLE_MS;
    lastClickRef.current = { code, t: now };

    if (isFastDouble) {
      onRequestZoom?.(code);
    }
  };

const renderValue = (r) => {
  if (mapDataType === "choropleth") {
    const n = toNumOrNull(r.value);
    return n == null ? "No data" : formatValueLong(n);
  }
  // Categorical: show group display name (title/name), not raw id (e.g. group_3)
  return getValueLabel(r);
};


  return (
    <aside className={styles.wrap}>
      <div className={styles.header}>
        <div className={styles.title}>Countries</div>

        <select
          className={styles.sortSelect}
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
        >
          {mapDataType === "choropleth" ? (
            <>
              <option value="value_high_low">Value: high → low</option>
              <option value="value_low_high">Value: low → high</option>
            </>
          ) : (
            <>
              <option value="cat_az">Category: A → Z</option>
              <option value="cat_za">Category: Z → A</option>
            </>
          )}
          <option value="name_az">Name: A → Z</option>
          <option value="name_za">Name: Z → A</option>
        </select>
      </div>

    <div ref={listRef} className={styles.list}>
{rows.map((r) => {
  const isHovered = hoveredCode && norm(hoveredCode) === r.code;
  const isSelected = selectedCode && norm(selectedCode) === r.code;

  const desc = String(placeholders?.[r.code] ?? "").trim();
  const hasDesc = desc.length > 0;

  const dotColor = getDotColor(r);
  const valueText = renderValue(r);
  const labelText = getValueLabel(r);

  return (
    <div
      key={r.code}
      ref={(el) => {
        if (!el) rowRefs.current.delete(r.code);
        else rowRefs.current.set(r.code, el);
      }}
      className={[
        styles.row,
        isHovered ? styles.rowHovered : "",
        isSelected ? styles.rowSelected : "",
        isSelected && hasDesc ? styles.rowExpanded : "",
      ].join(" ")}
      onMouseEnter={() => onHoverCode?.(r.code)}
      onMouseLeave={() => onHoverCode?.(null)}
      onClick={() => handleRowClick(r.code)}
    >
      {/* top line */}
      <div className={styles.rowTop}>
        <div className={styles.left}>
          <img
            className={styles.flag}
            src={`https://flagcdn.com/w20/${r.code.toLowerCase()}.png`}
            alt=""
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <div className={styles.name} title={r.name}>{r.name}</div>
        </div>

        <div className={styles.value} title={`${valueText} • ${labelText}`}>
          <span className={styles.dot} style={{ background: dotColor }} aria-hidden="true" />
          <span className={styles.valueText}>{valueText}</span>
        </div>
      </div>

      {/* compact description inside same card */}
      {isSelected && hasDesc && (
        <div className={styles.descInline}>
          {desc}
        </div>
      )}
    </div>
  );
})}

</div>


      <div className={styles.hint}>
        Click to select • Double click to zoom
      </div>
    </aside>
  );
}
