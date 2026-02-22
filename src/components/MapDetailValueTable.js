// src/components/MapDetailValueTable.js
import React, { useMemo } from "react";
import styles from "./MapDetail.module.css";

function safeStr(v) {
  return v == null ? "" : String(v).trim();
}

function isFiniteNumber(x) {
  return typeof x === "number" && Number.isFinite(x);
}

function getCategoricalDisplayValue(rawValue, groups = []) {
  const v = safeStr(rawValue);
  if (!v) return "No data";
  for (const g of groups) {
    const label =
      safeStr(g?.title) || safeStr(g?.name) || safeStr(g?.label) || safeStr(g?.category) || safeStr(g?.value);
    if (safeStr(g?.id) === v) return label || v;
    if (safeStr(g?.value) === v) return label || v;
    if (safeStr(g?.label) === v) return label || v;
    if (safeStr(g?.category) === v) return label || v;
    if (Array.isArray(g?.values) && g.values.map((x) => safeStr(x)).includes(v)) return label || v;
    if (Array.isArray(g?.items) && g.items.map((x) => safeStr(x)).includes(v)) return label || v;
  }
  return v;
}

export default function MapDetailValueTable({
  mapDataType,
  dataEntries,
  codeToName,
  groups = [],
  hoveredCode,
  selectedCode,
  onHoverCode,
  onSelectCode,
  formatValue,
}) {
  const type = (mapDataType || "choropleth").toLowerCase();

  const rows = useMemo(() => {
    const arr = Array.isArray(dataEntries) ? dataEntries : [];

    const normalized = arr
      .map((d) => {
        const code = safeStr(d?.code).toUpperCase();
        if (!code) return null;

        const name =
          safeStr(d?.name) || safeStr(codeToName?.[code]) || code;

        // For choropleth expect numbers; for categorical expect strings
        const raw = d?.value;

        return { code, name, raw };
      })
      .filter(Boolean);

    if (type === "categorical") {
      const withCats = normalized
        .map((r) => ({ ...r, category: safeStr(r.raw) }))
        .filter((r) => r.category.length > 0);

      withCats.sort((a, b) => a.name.localeCompare(b.name));
      return withCats.map((r) => ({
        code: r.code,
        name: r.name,
        display: getCategoricalDisplayValue(r.category, groups),
      }));
    }

    // choropleth
    const withNums = normalized
      .map((r) => {
        const n = Number(r.raw);
        return { ...r, num: Number.isFinite(n) ? n : null };
      })
      .filter((r) => r.num != null);

    withNums.sort((a, b) => (b.num ?? -Infinity) - (a.num ?? -Infinity));

    return withNums.map((r) => ({
      code: r.code,
      name: r.name,
      display: isFiniteNumber(r.num)
        ? (typeof formatValue === "function" ? formatValue(r.num) : String(r.num))
        : "",
    }));
  }, [dataEntries, codeToName, type, formatValue, groups]);

  const valueLabel = type === "categorical" ? "Category" : "Value";

  return (
    <div className={styles.cleanTableWrap}>
      <div className={styles.cleanTable}>
        {rows.length === 0 ? (
          <div className={styles.cleanEmpty}>
            No {valueLabel.toLowerCase()} data
          </div>
        ) : (
          rows.map((r, idx) => {
            const isHovered = hoveredCode === r.code;
            const isActive = selectedCode === r.code;

            return (
              <div
                key={`${r.code}-${idx}`}
                className={`${styles.cleanRow} ${
                  isHovered ? styles.cleanRowHovered : ""
                } ${isActive ? styles.cleanRowActive : ""}`}
                onMouseEnter={() => onHoverCode?.(r.code)}
                onMouseLeave={() => onHoverCode?.(null)}
                onClick={() => onSelectCode?.(r.code)}
                role="button"
                tabIndex={0}
              >
                <div className={styles.cleanCellNum}>{idx + 1}</div>
                <div className={styles.cleanCellName} title={r.name}>
                  {r.name}
                </div>
                <div className={styles.cleanCellValue} title={String(r.display)}>
                  {r.display}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
