// src/components/UploadDataModal.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";

// JSON with country/state codes
import countryCodes from "../world-countries.json";
import usStatesCodes from "../united-states.json";
import euCodes from "../european-countries.json";

import { FaDownload, FaUpload } from "react-icons/fa";
import styles from "./UploadDataModal.module.css";

function toNum(x) {
  const n =
    typeof x === "number"
      ? x
      : parseFloat(String(x ?? "").trim().replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** ------------------- STATS HELPERS ------------------- **/
function calculateMedian(values) {
  if (!values || values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateStdDev(values) {
  if (!values || values.length === 0) return null;
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const sqDiffs = values.map((val) => (val - mean) ** 2);
  const variance = sqDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  return Math.sqrt(variance);
}

function aggregateCategories(categoricalData) {
  const categoryMap = {};
  let totalAssigned = 0;
  categoricalData.forEach((item) => {
    if (!item.categoryValue) return;
    totalAssigned++;
    categoryMap[item.categoryValue] = (categoryMap[item.categoryValue] || 0) + 1;
  });
  return { categoryMap, totalAssigned };
}

export default function UploadDataModal({
  isOpen,
  onClose,
  selectedMap = "world",
  onImport,
  session,
  setSession,
  embedded = false,
}) {
  // ---- Session-backed UI state ----
  const fileName = session?.fileName || "";
  const terminalLines = session?.terminalLines || [];
  const fileIsValid = session?.fileIsValid ?? null;
  const isParsing = session?.isParsing || false;
  const errors = session?.errors || [];
  const mapDataType = session?.mapDataType || null;
  const parsedData = session?.parsedData || [];
  const universalRows = session?.universalRows || [];
  const canManualSwitch = session?.canManualSwitch || false;

  // ---- Local-only stats ----
  const [numericStats, setNumericStats] = useState({
    lowestValue: null,
    lowestCountry: "",
    highestValue: null,
    highestCountry: "",
    averageValue: null,
    medianValue: null,
    standardDeviation: null,
    numberOfValues: 0,
    totalCountries: 0,
  });

  const [categoricalStats, setCategoricalStats] = useState({
    numberOfUniqueCategories: 0,
    mostFrequentCategory: "",
    mostFrequentCount: 0,
    totalAssigned: 0,
    totalCountries: 0,
  });

  // Data source (depends on selected map)
  const dataSource =
    selectedMap === "usa" ? usStatesCodes : selectedMap === "europe" ? euCodes : countryCodes;

  // Keep stats totalCountries in sync
  useEffect(() => {
    setNumericStats((prev) => ({ ...prev, totalCountries: dataSource.length }));
    setCategoricalStats((prev) => ({ ...prev, totalCountries: dataSource.length }));
  }, [dataSource.length]);

  // Don’t wipe session when closing; just avoid stuck "Reading…"
  useEffect(() => {
    if (!isOpen && !embedded) {
      setSession((prev) => ({ ...prev, isParsing: false }));
    }
  }, [isOpen, embedded, setSession]);

  // Terminal logging
  const log = (msg, level = "info") => {
    setSession((prev) => ({
      ...prev,
      terminalLines: [
        ...(prev.terminalLines || []),
        { id: `${Date.now()}-${Math.random()}`, ts: new Date(), level, msg },
      ],
    }));
  };

  // Auto-scroll terminal
  const terminalRef = useRef(null);
  useEffect(() => {
    const el = terminalRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [terminalLines]);

  // --------------------------
  // Normalizers / helpers
  // --------------------------
  const normCell = (v) => {
    let s = String(v ?? "");
    s = s.replace(/^\uFEFF/, ""); // remove BOM
    s = s.trim();

    // strip wrapping quotes "..."
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
      s = s.slice(1, -1);
      s = s.replace(/""/g, '"');
    }
    return s.trim();
  };

  const normKey = (v) => normCell(v).toLowerCase();

  const isYear = (v) => {
    const s = normCell(v);
    return /^\d{4}$/.test(s) && +s >= 1800 && +s <= 2200;
  };

  const looksLikeWDIHeader = (row) => {
    const r = row.map(normKey);
    const hasCountryName = r.some((c) => c.includes("country name"));
    const hasCountryCode = r.some((c) => c.includes("country code"));
    const hasYears = row.some(isYear);
    return hasCountryName && hasCountryCode && hasYears;
  };

  function buildDataSourceIndex(src) {
    const byCode = new Map();
    const byName = new Map();

    for (const item of src) {
      const code = String(item.code ?? "").trim().toUpperCase();
      if (code) byCode.set(code, item);

      const names = [item.name, ...(item.aliases || [])]
        .map((n) => normKey(n))
        .filter(Boolean);

      for (const n of names) byName.set(n, item);
    }

    return { byCode, byName };
  }

  function splitCSVLine(line) {
    const out = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];

      if (ch === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }

      if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
        continue;
      }

      cur += ch;
    }

    out.push(cur);
    return out;
  }

  // --------------------------
  // Parsing entrypoints
  // --------------------------
  const parseTextFile = (content, fileExt) => {
    const lines = content
      .split("\n")
      .map((l) => l.replace(/\r$/, ""))
      .filter((l) => l && !l.trim().startsWith("#"));

    let rows;
    if (fileExt === "tsv") {
      rows = lines.map((line) => line.split("\t").map(normCell));
    } else {
      rows = lines.map((line) => {
        // semicolon CSV (common in EU locales)
        if (line.includes(";") && !line.includes(",")) {
          return line.split(";").map(normCell);
        }
        if (line.includes(",")) {
          return splitCSVLine(line).map(normCell);
        }
        return line.split(/\s+/).map(normCell);
      });
    }

    parseArrayOfRows(rows);
  };

  const processFile = (file) => {
    setSession((prev) => ({
      ...prev,
      fileName: file.name,
      errors: [],
      fileIsValid: null,
      mapDataType: null,
      universalRows: [],
      parsedData: [],
      canManualSwitch: false,
      isParsing: true,

      // keep old log history (so reopening modal shows last logs)
      terminalLines: prev.terminalLines || [],
    }));

    log(`Reading file: ${file.name}`, "info");

    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "csv" || ext === "tsv" || ext === "txt") {
      const reader = new FileReader();
      reader.onload = (e) => parseTextFile(e.target.result, ext);
      reader.readAsText(file);
      return;
    }

    if (ext === "xlsx" || ext === "xls") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: "array" });
        const sheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        parseArrayOfRows(rows);
      };
      reader.readAsArrayBuffer(file);
      return;
    }

    // unsupported
    const msg = "Unsupported file type. Use CSV/TSV/XLSX/XLS.";
    setSession((prev) => ({
      ...prev,
      errors: [{ line: 0, type: "Invalid File", message: msg }],
      fileIsValid: false,
      isParsing: false,
    }));
    log(`❌ ${msg}`, "error");
  };

  // Dropzone
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) processFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [".csv"],
      "text/tab-separated-values": [".tsv", ".txt"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    },
    multiple: false,
    onDrop,
  });

  // --------------------------
  // Core parser
  // --------------------------
  const parseArrayOfRows = (rows) => {
    const errorList = [];
    const allRows = [];
    let numericCount = 0;
    let totalDataRows = 0;

    const cleanedRows = (Array.isArray(rows) ? rows : [])
      .map((r) => (Array.isArray(r) ? r.map(normCell) : []))
      .filter((r) => r.length && !r.every((c) => !c));

    const { byCode, byName } = buildDataSourceIndex(dataSource);

    // 1) Detect WDI wide header
    let headerIndex = -1;
    for (let i = 0; i < cleanedRows.length; i++) {
      if (looksLikeWDIHeader(cleanedRows[i])) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex !== -1) {
      const header = cleanedRows[headerIndex];
      const headerLower = header.map(normKey);

      const countryNameCol = headerLower.findIndex((h) => h.includes("country name"));
      const countryCodeCol = headerLower.findIndex((h) => h.includes("country code"));

      const yearCols = [];
      for (let c = 0; c < header.length; c++) {
        if (isYear(header[c])) yearCols.push({ year: header[c], idx: c });
      }

      log(`✅ Detected wide format header at row ${headerIndex + 1}`, "success");
      log(
        `Country Name col: ${countryNameCol + 1}, Country Code col: ${countryCodeCol + 1}`,
        "info"
      );
      log(
        `Year columns detected: ${yearCols.length} (latest: ${
          yearCols[yearCols.length - 1]?.year || "?"
        })`,
        "info"
      );

      const matchLogs = [];
      for (let r = headerIndex + 1; r < cleanedRows.length; r++) {
        const row = cleanedRows[r];

        const rawCode = normCell(row[countryCodeCol]).toUpperCase();
        const rawName = normCell(row[countryNameCol]);

        const found =
          (rawCode && byCode.get(rawCode)) || (rawName && byName.get(normKey(rawName)));

        if (!found) {
          errorList.push({
            line: r + 1,
            type: "Invalid Name",
            message: `No match for "${rawName || rawCode}"`,
          });
          continue;
        }

        let pickedValue = null;
        let pickedYear = null;

        for (let i = yearCols.length - 1; i >= 0; i--) {
          const { year, idx } = yearCols[i];
          const v = toNum(row[idx]);
          if (v != null) {
            pickedValue = v;
            pickedYear = year;
            break;
          }
        }

        if (pickedValue == null) {
          // fallback: scan rightmost numeric
          for (let c = row.length - 1; c >= 0; c--) {
            const v = toNum(row[c]);
            if (v != null) {
              pickedValue = v;
              pickedYear = null;
              break;
            }
          }
        }

        if (pickedValue == null) {
          errorList.push({
            line: r + 1,
            type: "Missing Value",
            message: `No numeric values found for ${found.name} (${found.code})`,
          });
          continue;
        }

        totalDataRows++;
        numericCount++;

        allRows.push({
          name: found.name,
          code: found.code,
          rawValue: String(pickedValue),
          isNumeric: true,
          pickedYear,
        });

        matchLogs.push({
          code: found.code,
          value: pickedValue,
          year: pickedYear,
        });
      }

      // Log all matches in one batch, then we'll add warnings after
      if (matchLogs.length > 0) {
        const newLines = matchLogs.map(({ code, value, year }) => ({
          id: `${Date.now()}-${Math.random()}-${code}`,
          ts: new Date(),
          level: "info",
          msg: `Matched ${code}: newest value ${value}${year ? ` (${year})` : ""}`,
        }));
        setSession((prev) => ({
          ...prev,
          terminalLines: [...(prev.terminalLines || []), ...newLines],
        }));
      }

      if (allRows.length === 0) {
        const msg =
          errorList.length > 0
            ? "No valid rows found in wide table. (Countries might not match your map's dataset.)"
            : "File has no valid rows.";
        const errorLogLines = [
          ...errorList.map((err) => ({
            id: `err-${err.line}-${Date.now()}-${Math.random()}`,
            ts: new Date(),
            level: "error",
            msg: `Line ${err.line}: ${err.message}`,
          })),
          { id: `no-data-${Date.now()}`, ts: new Date(), level: "error", msg: `❌ ${msg}` },
        ];
        setSession((prev) => ({
          ...prev,
          errors: [{ line: 0, type: "No Data", message: msg }, ...errorList],
          terminalLines: [...(prev.terminalLines || []), ...errorLogLines],
          fileIsValid: false,
          isParsing: false,
        }));
        return;
      }

      // Persist session
      setSession((prev) => ({
        ...prev,
        universalRows: allRows,
        errors: errorList,
        fileIsValid: true,
        canManualSwitch: false,
        mapDataType: "choropleth",
        isParsing: false,
      }));

      if (errorList.length > 0) log(`⚠ Imported with ${errorList.length} ignored line(s).`, "warn");
      else log(`✅ Parsed wide file successfully. Rows: ${allRows.length}`, "success");

      finalizeChoropleth(allRows);
      return;
    }

    // 2) Fallback: simple 2-column
    cleanedRows.forEach((row, index) => {
      if (row.length < 2) {
        errorList.push({
          line: index + 1,
          type: "Missing Value",
          message: `Need at least 2 columns on line ${index + 1}`,
        });
        return;
      }

      const [nameRaw, secondRaw] = row;
      if (!nameRaw) {
        errorList.push({
          line: index + 1,
          type: "Missing Name",
          message: `No state/country name on line ${index + 1}`,
        });
        return;
      }
      if (secondRaw === null || secondRaw === undefined || String(secondRaw).trim() === "") {
        errorList.push({
          line: index + 1,
          type: "Missing Value",
          message: `No value provided on line ${index + 1}`,
        });
        return;
      }

      const needleKey = normKey(nameRaw);
      const found =
        byCode.get(String(nameRaw).trim().toUpperCase()) || byName.get(needleKey);

      if (!found) {
        errorList.push({
          line: index + 1,
          type: "Invalid Name",
          message: `No match for "${nameRaw}"`,
        });
        return;
      }

      totalDataRows++;

      const valAsNum = toNum(secondRaw);
      const isNum = valAsNum != null;
      if (isNum) numericCount++;

      allRows.push({
        name: found.name,
        code: found.code,
        rawValue: String(secondRaw),
        isNumeric: isNum,
      });
    });

    if (allRows.length === 0) {
      const msg =
        errorList.length > 0
          ? "No valid rows found. Fix the lines shown above."
          : "File has no valid rows.";
      const errorLogLines = [
        ...errorList.map((err) => ({
          id: `err-${err.line}-${Date.now()}-${Math.random()}`,
          ts: new Date(),
          level: "error",
          msg: `Line ${err.line}: ${err.message}`,
        })),
        { id: `no-data-${Date.now()}`, ts: new Date(), level: "error", msg: `❌ ${msg}` },
      ];
      setSession((prev) => ({
        ...prev,
        errors: [{ line: 0, type: "No Data", message: msg }, ...errorList],
        terminalLines: [...(prev.terminalLines || []), ...errorLogLines],
        fileIsValid: false,
        isParsing: false,
      }));
      return;
    }

    // deduce type
    const hasNumeric = numericCount > 0;
    const hasText = numericCount < totalDataRows;
    const mixture = hasNumeric && hasText;

    let deducedType = "choropleth";
    if (!hasNumeric && hasText) deducedType = "categorical";
    else if (hasNumeric && !hasText) deducedType = "choropleth";
    else deducedType = "choropleth"; // mixed defaults numeric

    setSession((prev) => ({
      ...prev,
      universalRows: allRows,
      errors: errorList,
      fileIsValid: true,
      canManualSwitch: mixture,
      mapDataType: deducedType,
      isParsing: false,
    }));

    log(`Matched ${allRows.length} row(s).`, "success");

    if (deducedType === "choropleth") finalizeChoropleth(allRows);
    else finalizeCategorical(allRows);
  };

  // --------------------------
  // Finalizers
  // --------------------------
  function finalizeChoropleth(rows) {
    const numericOnly = rows.filter((r) => r.isNumeric === true);
    if (!numericOnly.length) {
      setSession((prev) => ({ ...prev, parsedData: [] }));
      setNumericStats((prev) => ({
        ...prev,
        lowestValue: null,
        lowestCountry: "",
        highestValue: null,
        highestCountry: "",
        averageValue: null,
        medianValue: null,
        standardDeviation: null,
        numberOfValues: 0,
        totalCountries: dataSource.length,
      }));
      return;
    }

    const numericParsed = numericOnly.map((r) => ({
      name: r.name,
      code: r.code,
      numericValue: toNum(r.rawValue),
    }));

    setSession((prev) => ({ ...prev, parsedData: numericParsed }));
    updateNumericStats(numericParsed);
  }

  function finalizeCategorical(rows) {
    const textOnly = rows.filter((r) => r.isNumeric === false);
    if (!textOnly.length) {
      setSession((prev) => ({ ...prev, parsedData: [] }));
      setCategoricalStats((prev) => ({
        ...prev,
        numberOfUniqueCategories: 0,
        mostFrequentCategory: "",
        mostFrequentCount: 0,
        totalAssigned: 0,
        totalCountries: dataSource.length,
      }));
      return;
    }

    const catParsed = textOnly.map((r) => ({
      name: r.name,
      code: r.code,
      categoryValue: r.rawValue,
    }));

    setSession((prev) => ({ ...prev, parsedData: catParsed }));
    updateCategoricalStats(catParsed);
  }

  function updateNumericStats(numericData) {
    if (!numericData.length) return;

    let minVal = numericData[0].numericValue;
    let maxVal = numericData[0].numericValue;
    let minName = numericData[0].name;
    let maxName = numericData[0].name;
    let sumVal = 0;
    const arrVals = [];

    numericData.forEach((item) => {
      arrVals.push(item.numericValue);
      sumVal += item.numericValue;

      if (item.numericValue < minVal) {
        minVal = item.numericValue;
        minName = item.name;
      }
      if (item.numericValue > maxVal) {
        maxVal = item.numericValue;
        maxName = item.name;
      }
    });

    const avg = sumVal / numericData.length;
    const median = calculateMedian(arrVals);
    const stdDev = calculateStdDev(arrVals);

    setNumericStats({
      lowestValue: parseFloat(minVal.toFixed(2)),
      lowestCountry: minName,
      highestValue: parseFloat(maxVal.toFixed(2)),
      highestCountry: maxName,
      averageValue: parseFloat(avg.toFixed(2)),
      medianValue: median != null ? parseFloat(median.toFixed(2)) : null,
      standardDeviation: stdDev != null ? parseFloat(stdDev.toFixed(2)) : null,
      numberOfValues: numericData.length,
      totalCountries: dataSource.length,
    });
  }

  function updateCategoricalStats(catData) {
    if (!catData.length) return;

    const { categoryMap, totalAssigned } = aggregateCategories(catData);
    const uniqueCategories = Object.keys(categoryMap).length;

    let mostCat = "";
    let mostCount = 0;
    for (const [cat, ccount] of Object.entries(categoryMap)) {
      if (ccount > mostCount) {
        mostCount = ccount;
        mostCat = cat;
      }
    }

    setCategoricalStats({
      numberOfUniqueCategories: uniqueCategories,
      mostFrequentCategory: mostCat,
      mostFrequentCount: mostCount,
      totalAssigned,
      totalCountries: dataSource.length,
    });
  }

  // Manual override (only shown if mixed)
  const handleManualTypeChange = (e) => {
    const chosen = e.target.value; // 'choropleth' or 'categorical'
    setSession((prev) => ({ ...prev, mapDataType: chosen }));

    if (chosen === "choropleth") finalizeChoropleth(universalRows);
    else finalizeCategorical(universalRows);

    log(`Switched interpretation to: ${chosen}`, "warn");
  };

  // Download template
  const downloadStarterTemplate = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    dataSource.forEach((item) => {
      const maybeQuote = item.name.includes(",") ? `"${item.name}"` : item.name;
      csvContent += `${maybeQuote},\n`;
    });

    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute(
      "download",
      selectedMap === "usa"
        ? "us_states_template.csv"
        : selectedMap === "europe"
        ? "eu_countries_template.csv"
        : "world_countries_template.csv"
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    log("Downloaded starter template.", "info");
  };

  // Import
  const handleImportData = () => {
    if (mapDataType === "choropleth") onImport(parsedData, numericStats, "choropleth");
    else onImport(parsedData, categoricalStats, "categorical");
    onClose();
  };

  // Completeness (optional)
  let dataCompleteness = "N/A";
  if (mapDataType === "choropleth" && numericStats.totalCountries > 0) {
    dataCompleteness = ((numericStats.numberOfValues / numericStats.totalCountries) * 100).toFixed(2);
  }
  if (mapDataType === "categorical" && categoricalStats.totalCountries > 0) {
    dataCompleteness = ((categoricalStats.totalAssigned / categoricalStats.totalCountries) * 100).toFixed(2);
  }

  // Table helpers (optional)
  const sortedNumericData = useMemo(() => {
    if (mapDataType !== "choropleth") return [];
    return [...parsedData].sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0));
  }, [mapDataType, parsedData]);

  const categoryFreq = useMemo(() => {
    if (mapDataType !== "categorical") return [];
    const freqMap = {};
    let totalCatAssignments = 0;

    parsedData.forEach((item) => {
      if (item.categoryValue) {
        totalCatAssignments++;
        freqMap[item.categoryValue] = (freqMap[item.categoryValue] || 0) + 1;
      }
    });

    const freqArr = Object.entries(freqMap).map(([cat, cnt]) => {
      const pct = totalCatAssignments > 0 ? (cnt / totalCatAssignments) * 100 : 0;
      return { category: cat, count: cnt, percent: pct };
    });

    freqArr.sort((a, b) => b.count - a.count);
    return freqArr;
  }, [mapDataType, parsedData]);

  if (!isOpen && !embedded) return null;

  const content = (
    <div className={styles.modalContent} onClick={embedded ? undefined : (e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div>
            <div className={styles.modalEyebrow}>Data Import</div>
            <h2 className={styles.modalTitle}>Upload data</h2>
            <p className={styles.modalSubtitle}>
              Drop a file and we’ll match rows to{" "}
              {selectedMap === "usa" ? "US states" : selectedMap === "europe" ? "Europe" : "countries"}.
            </p>
          </div>

        {!embedded && (
          <button
            type="button"
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Close"
            title="Close"
          >
            &times;
          </button>
        )}
      </div>

      <div className={styles.modalBody}>
          <div className={styles.topRow}>
            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={isDragActive ? `${styles.dropZone} ${styles.dropZoneActive}` : styles.dropZone}
            >
              <input {...getInputProps()} />
              <FaUpload className={styles.uploadIcon} />
              {isDragActive ? (
                <p>Drop the file here...</p>
              ) : (
                <>
                  <p>Drag & drop or click to browse</p>
                  <small>CSV, TSV, XLSX, XLS</small>
                </>
              )}
            </div>

            {/* Terminal */}
            <div className={styles.terminalCard}>
              <div className={styles.terminalHeader}>
                <div className={styles.terminalDots}>
                  <span />
                  <span />
                  <span />
                </div>
                <div className={styles.terminalTitle}>Import log</div>

                {isParsing ? (
                  <div className={styles.terminalStatus}>Reading…</div>
                ) : fileIsValid === true ? (
                  <div className={styles.terminalStatusOk}>OK</div>
                ) : fileIsValid === false ? (
                  <div className={styles.terminalStatusBad}>Errors</div>
                ) : (
                  <div className={styles.terminalStatusIdle}>Idle</div>
                )}
              </div>

              <div ref={terminalRef} className={styles.terminalBody}>
                {terminalLines.length === 0 ? (
                  <div className={styles.terminalHint}>Drop a file to see parsing output here.</div>
                ) : (
                  terminalLines.map((l) => (
                    <div
                      key={l.id}
                      className={[
                        styles.termLine,
                        l.level === "error" ? styles.termError : "",
                        l.level === "warn" ? styles.termWarn : "",
                        l.level === "success" ? styles.termSuccess : "",
                      ].join(" ")}
                    >
                      <span className={styles.termPrompt}>$</span>
                      <span className={styles.termText}>{l.msg}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Inline mixed-data switch */}
              {universalRows.length > 0 && canManualSwitch && (
                <div className={styles.inlineTypeRow}>
                  <span className={styles.inlineTypeLabel}>Interpret as:</span>
                  <select
                    className={styles.inlineTypeSelect}
                    value={mapDataType || ""}
                    onChange={handleManualTypeChange}
                  >
                    <option value="choropleth">Choropleth (numeric)</option>
                    <option value="categorical">Categorical (text)</option>
                  </select>
                </div>
              )}

              {/* If not mixed, show detected type */}
              {mapDataType && !canManualSwitch && (
                <div className={styles.inlineDetected}>
                  Detected: <strong>{mapDataType}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Action row */}
          <div className={styles.actionsRow}>
            <button type="button" className={styles.templateLink} onClick={downloadStarterTemplate}>
              <span className={styles.templateLinkIcon}>
                <FaDownload />
              </span>
              <span className={styles.templateLinkText}>
                Don’t have a file? <span className={styles.templateLinkUnderline}>See our starter template</span>
              </span>
            </button>

            {embedded ? (
              <p className={styles.embeddedHint}>Try processing your own file</p>
            ) : (
              <div className={styles.actionsRight}>
                <button className={styles.btn} type="button" onClick={onClose}>
                  Cancel
                </button>

                <button
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  type="button"
                  disabled={isParsing || !mapDataType || parsedData.length === 0}
                  onClick={handleImportData}
                >
                  Import data
                </button>
              </div>
            )}
          </div>

          {/* (Optional) You can render stats/tables below if you want,
              but I’m keeping this minimal so you can compile immediately. */}
        </div>
    </div>
  );

  if (embedded) {
    return <div className={styles.embeddedWrap}>{content}</div>;
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      {content}
    </div>
  );
}
