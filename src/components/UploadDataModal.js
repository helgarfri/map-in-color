import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';

// JSON with country/state codes
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

import { FaDownload } from 'react-icons/fa';


// Icons
import {
  FaUpload,
  FaFileAlt,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowDown,
  FaArrowUp,
  FaCalculator,
  FaPercent,
  FaMapMarkerAlt,
  FaChartLine,
  FaRuler,
  FaListUl,
  FaGlobe,
} from 'react-icons/fa';

import styles from './UploadDataModal.module.css';

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
  return (sorted.length % 2 === 1)
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculateStdDev(values) {
  if (!values || values.length === 0) return null;
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  const sqDiffs = values.map(val => (val - mean) ** 2);
  const variance = sqDiffs.reduce((acc, val) => acc + val, 0) / values.length;
  return Math.sqrt(variance);
}

function aggregateCategories(categoricalData) {
  const categoryMap = {};
  let totalAssigned = 0;
  categoricalData.forEach(item => {
    if (!item.categoryValue) return;
    totalAssigned++;
    categoryMap[item.categoryValue] = (categoryMap[item.categoryValue] || 0) + 1;
  });
  return { categoryMap, totalAssigned };
}

/**
 * UploadDataModal
 * - We store "universalRows" with { name, code, rawValue, isNumeric }
 * - If user picks "choropleth", we filter numeric lines only
 * - If user picks "categorical", we filter text lines only
 * - We always display the auto-detected type, but only enable a dropdown switch if there's a mixture
 */
function UploadDataModal({
  isOpen,
  onClose,
  selectedMap = 'world',
  onImport,
}) {
  // Basic file states
  const [fileName, setFileName] = useState('');
  const [fileIsValid, setFileIsValid] = useState(null);
  const [errors, setErrors] = useState([]);

  // Mixed data warning
  const [showMixedWarning, setShowMixedWarning] = useState(false);

  // Data type: 'choropleth' or 'categorical'
  const [mapDataType, setMapDataType] = useState(null);

  // Stats
  const [numericStats, setNumericStats] = useState({
    lowestValue: null,
    lowestCountry: '',
    highestValue: null,
    highestCountry: '',
    averageValue: null,
    medianValue: null,
    standardDeviation: null,
    numberOfValues: 0,
    totalCountries: 0,
  });
  const [categoricalStats, setCategoricalStats] = useState({
    numberOfUniqueCategories: 0,
    mostFrequentCategory: '',
    mostFrequentCount: 0,
    totalAssigned: 0,
    totalCountries: 0,
  });

  // The "final" parsed data we display
  const [parsedData, setParsedData] = useState([]);

  // All matched lines, each with isNumeric or not
  const [universalRows, setUniversalRows] = useState([]);

  // If there's a mixture, we let the user switch manually
  const [canManualSwitch, setCanManualSwitch] = useState(false);

  // Fake terminal log
const [terminalLines, setTerminalLines] = useState([]);
const [isParsing, setIsParsing] = useState(false);

const log = (msg, level = "info") => {
  setTerminalLines((prev) => [
    ...prev,
    { id: `${Date.now()}-${Math.random()}`, ts: new Date(), level, msg },
  ]);
};

const terminalRef = useRef(null);


useEffect(() => {
  const el = terminalRef.current;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}, [terminalLines]);



  // Data source
  const dataSource =
    selectedMap === 'usa'
      ? usStatesCodes
      : selectedMap === 'europe'
      ? euCodes
      : countryCodes;

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setFileName('');
      setFileIsValid(null);
      setErrors([]);
      setShowMixedWarning(false);
      setMapDataType(null);
      setParsedData([]);
      setUniversalRows([]);
      setCanManualSwitch(false);
      setTerminalLines([]);
      setIsParsing(false);

      setNumericStats({
        lowestValue: null,
        lowestCountry: '',
        highestValue: null,
        highestCountry: '',
        averageValue: null,
        medianValue: null,
        standardDeviation: null,
        numberOfValues: 0,
        totalCountries: dataSource.length,
      });
      setCategoricalStats({
        numberOfUniqueCategories: 0,
        mostFrequentCategory: '',
        mostFrequentCount: 0,
        totalAssigned: 0,
        totalCountries: dataSource.length,
      });
    }
  }, [isOpen, dataSource.length]);

  // Dropzone
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': ['.csv'],
      'text/tab-separated-values': ['.tsv', '.txt'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    multiple: false,
    onDrop,
  });

  // Reading the file
  const processFile = (file) => {
    setFileName(file.name);
    setErrors([]);
    setFileIsValid(null);
    setMapDataType(null);
    setShowMixedWarning(false);
    setUniversalRows([]);
    setCanManualSwitch(false);


  setTerminalLines([]);
  setIsParsing(true);
  log(`Reading file: ${file.name}`, "info");

    const ext = file.name.split('.').pop().toLowerCase();
    if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        parseTextFile(e.target.result, ext);
      };
      reader.readAsText(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const sheetName = wb.SheetNames[0];
        const worksheet = wb.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        parseArrayOfRows(rows);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setErrors([{ line: 0, type: 'Invalid File', message: 'Unsupported file type.' }]);
setFileIsValid(false);
log(`❌ Unsupported file type. Use CSV/TSV/XLSX/XLS.`, "error");
setIsParsing(false);
return;

    }
  };

  // parse text
  const parseTextFile = (content, fileExt) => {
    const lines = content
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#'));

    let rows;
    if (fileExt === 'tsv') {
      rows = lines.map(line => line.split('\t').map(c => c.trim()));
    } else {
      // CSV (maybe semicolon?), fallback to whitespace
      rows = lines.map(line => {
        if (line.includes(';')) {
          return line.split(';').map(c => c.trim());
        } else if (line.includes(',')) {
          return line.split(',').map(c => c.trim());
        } else {
          return line.split(/\s+/).map(c => c.trim());
        }
      });
    }
    parseArrayOfRows(rows);
  };

// parse array of rows => build universalRows (tolerant: ignores bad lines)
const parseArrayOfRows = (rows) => {
  const errorList = []; // we keep these as "ignored lines"
  let foundItemCount = 0;
  let numericCount = 0;
  let totalDataRows = 0;
  const allRows = [];

  rows.forEach((row, index) => {
    const safeRow = (Array.isArray(row) ? row : [])
      .map((cell) => String(cell ?? "").trim());

    // ignore empty lines
    if (!safeRow.length || safeRow.every((c) => !c)) return;

    // require at least 2 columns
    if (safeRow.length < 2) {
      errorList.push({
        line: index + 1,
        type: "Missing Value",
        message: `Need at least 2 columns on line ${index + 1}`,
      });
      return; // ✅ ignore this line
    }

    const [nameRaw, secondRaw] = safeRow;

    if (!nameRaw) {
      errorList.push({
        line: index + 1,
        type: "Missing Name",
        message: `No state/country name on line ${index + 1}`,
      });
      return; // ✅ ignore this line
    }

    if (!secondRaw) {
      // optional: treat as warning OR quietly ignore
      errorList.push({
        line: index + 1,
        type: "Missing Value",
        message: `No value provided on line ${index + 1}`,
      });
      return; // ✅ ignore this line
    }

    // match country/state/eu item
    const needle = String(nameRaw).toLowerCase().trim();
    const found = dataSource.find((item) => {
      if (String(item.code).toLowerCase() === needle) return true;
      const allNames = [item.name, ...(item.aliases || [])]
        .map((n) => String(n).toLowerCase().trim());
      return allNames.includes(needle);
    });

    if (!found) {
      errorList.push({
        line: index + 1,
        type: "Invalid Name",
        message: `No match for "${nameRaw}"`,
      });
      return; // ✅ ignore this line
    }

    // ✅ valid matched row
    foundItemCount++;
    totalDataRows++;

    const valAsNum = toNum(secondRaw);
    const isNum = valAsNum != null;
    if (isNum) numericCount++;

    allRows.push({
      name: found.name,
      code: found.code,
      rawValue: secondRaw,
      isNumeric: isNum,
    });
  });

  // ✅ If nothing valid -> hard fail (still)
  if (allRows.length === 0) {
    const msg =
      errorList.length > 0
        ? "No valid rows found. Fix the lines shown below."
        : "File has no valid rows.";
    setErrors([{ line: 0, type: "No Data", message: msg }]);
    setFileIsValid(false);

    log(`❌ ${msg}`, "error");
    setIsParsing(false);
    return;
  }

  // ✅ IMPORTANT: we proceed even if errorList has items
  setUniversalRows(allRows);
  setErrors(errorList);

  setFileIsValid(true); // ✅ allow import
  if (errorList.length > 0) {
    log(`⚠ Imported with ${errorList.length} ignored line(s).`, "warn");
    errorList.slice(0, 200).forEach((err) => {
      log(`Ignored line ${err.line}: ${err.type} — ${err.message}`, "warn");
    });
  } else {
    log(`✅ File parsed successfully. Imported rows ready: ${allRows.length}`, "success");
  }

  // detect data type or mixed
  const hasNumeric = numericCount > 0;
  const hasText = numericCount < totalDataRows; // i.e. at least one non-numeric row
  const mixture = hasNumeric && hasText;
  setCanManualSwitch(mixture);

  // auto detect
  let deducedType = "categorical";
  if (!hasNumeric && hasText) deducedType = "categorical";
  else if (hasNumeric && !hasText) deducedType = "choropleth";
  else if (mixture) {
    const ratio = numericCount / totalDataRows;
    if (ratio > 0.75) deducedType = "choropleth";
    else if (ratio < 0.25) deducedType = "categorical";
    else deducedType = "choropleth";
    log(`⚠ Mixed data detected. You can switch type manually.`, "warn");
  }

  setMapDataType(deducedType);

  log(`Matched ${foundItemCount} row(s).`, "info");
  log(`Detected numeric rows: ${numericCount}/${totalDataRows}.`, "info");
  log(`Selected mode: ${deducedType}.`, "success");

  // finalize display + stats
  if (deducedType === "choropleth") finalizeChoropleth(allRows);
  else finalizeCategorical(allRows);

  setIsParsing(false);
};


  // finalizeChoropleth => only keep lines where isNumeric===true
  function finalizeChoropleth(allRows) {
    const numericOnly = allRows.filter(r => r.isNumeric === true);
    if (!numericOnly.length) {
      setParsedData([]);
      setNumericStats({
        lowestValue: null,
        lowestCountry: '',
        highestValue: null,
        highestCountry: '',
        averageValue: null,
        medianValue: null,
        standardDeviation: null,
        numberOfValues: 0,
        totalCountries: dataSource.length,
      });
      return;
    }
    const numericParsed = numericOnly.map(r => ({
      name: r.name,
      code: r.code,
      numericValue: toNum(r.rawValue),
    }));
    setParsedData(numericParsed);
    updateNumericStats(numericParsed);
  }

  // finalizeCategorical => only keep lines where isNumeric===false
  function finalizeCategorical(allRows) {
    const textOnly = allRows.filter(r => r.isNumeric === false);
    if (!textOnly.length) {
      setParsedData([]);
      setCategoricalStats({
        numberOfUniqueCategories: 0,
        mostFrequentCategory: '',
        mostFrequentCount: 0,
        totalAssigned: 0,
        totalCountries: dataSource.length,
      });
      return;
    }
    const catParsed = textOnly.map(r => ({
      name: r.name,
      code: r.code,
      categoryValue: r.rawValue,
    }));
    setParsedData(catParsed);
    updateCategoricalStats(catParsed);
  }

  // Mixed data popup handlers
  const handleChooseChoropleth = (e) => {
    e.stopPropagation();
    setShowMixedWarning(false);
    setMapDataType('choropleth');
    finalizeChoropleth(universalRows);
  };

  const handleChooseCategorical = (e) => {
    e.stopPropagation();
    setShowMixedWarning(false);
    setMapDataType('categorical');
    finalizeCategorical(universalRows);
  };

  // Manual override
  const handleManualTypeChange = (e) => {
    const chosen = e.target.value; // 'choropleth' or 'categorical'
    setMapDataType(chosen);
    if (chosen === 'choropleth') {
      finalizeChoropleth(universalRows);
    } else {
      finalizeCategorical(universalRows);
    }
  };

  // numeric stats
  function updateNumericStats(numericData) {
    if (!numericData.length) {
      setNumericStats({
        lowestValue: null,
        lowestCountry: '',
        highestValue: null,
        highestCountry: '',
        averageValue: null,
        medianValue: null,
        standardDeviation: null,
        numberOfValues: 0,
        totalCountries: dataSource.length,
      });
      return;
    }
    let minVal = numericData[0].numericValue;
    let maxVal = numericData[0].numericValue;
    let minName = numericData[0].name;
    let maxName = numericData[0].name;
    let sumVal = 0;
    const arrVals = [];

    numericData.forEach(item => {
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

  // categorical stats
  function updateCategoricalStats(catData) {
    if (!catData.length) {
      setCategoricalStats({
        numberOfUniqueCategories: 0,
        mostFrequentCategory: '',
        mostFrequentCount: 0,
        totalAssigned: 0,
        totalCountries: dataSource.length,
      });
      return;
    }
    const { categoryMap, totalAssigned } = aggregateCategories(catData);
    const uniqueCategories = Object.keys(categoryMap).length;
    let mostCat = '';
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

  // data completeness
  let dataCompleteness = 'N/A';
  if (mapDataType === 'choropleth') {
    if (numericStats.totalCountries > 0) {
      dataCompleteness = (
        (numericStats.numberOfValues / numericStats.totalCountries) * 100
      ).toFixed(2);
    }
  } else if (mapDataType === 'categorical') {
    if (categoricalStats.totalCountries > 0) {
      dataCompleteness = (
        (categoricalStats.totalAssigned / categoricalStats.totalCountries) * 100
      ).toFixed(2);
    }
  }

  // table data
  const sortedNumericData = useMemo(() => {
    if (mapDataType !== 'choropleth') return [];
    return [...parsedData].sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0));
  }, [mapDataType, parsedData]);

  const categoryFreq = useMemo(() => {
    if (mapDataType !== 'categorical') return [];
    const freqMap = {};
    let totalCatAssignments = 0;
    parsedData.forEach(item => {
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

  // Download template
  const downloadStarterTemplate = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    dataSource.forEach(item => {
      const maybeQuote = item.name.includes(',') ? `"${item.name}"` : item.name;
      csvContent += `${maybeQuote},\n`;
    });
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute(
      'download',
      selectedMap === 'usa'
        ? 'us_states_template.csv'
        : selectedMap === 'europe'
        ? 'eu_countries_template.csv'
        : 'world_countries_template.csv'
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import
  const handleImportData = () => {
    if (mapDataType === 'choropleth') {
      onImport(parsedData, numericStats, 'choropleth');
    } else {
      onImport(parsedData, categoricalStats, 'categorical');
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      {showMixedWarning && (
        <div
          className={styles.mixedWarningOverlay}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={styles.mixedWarningModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.mixedCloseBtn}
              onClick={(e) => {
                e.stopPropagation();
                setShowMixedWarning(false);
              }}
            >
              &times;
            </button>
            <div className={styles.mixedWarningContent}>
              <FaExclamationTriangle className={styles.mixedWarnIcon} />
              <h2>Mixed data detected</h2>
              <p>
                We found both numeric and text rows. 
                How should we interpret the file?
              </p>
              <div className={styles.mixedActions}>
                <button onClick={handleChooseChoropleth}>
                  Use numeric (Choropleth)
                </button>
                <button onClick={handleChooseCategorical}>
                  Use text (Categorical)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
         <div className={styles.modalHeader}>
    <div>
      <div className={styles.modalEyebrow}>Data Import</div>
      <h2 className={styles.modalTitle}>Upload data</h2>
      <p className={styles.modalSubtitle}>
        Drop a file and we’ll match rows to {selectedMap === "usa" ? "US states" : selectedMap === "europe" ? "Europe" : "countries"}.
      </p>
    </div>

    <button
      type="button"
      className={styles.modalClose}
      onClick={onClose}
      aria-label="Close"
      title="Close"
    >
      &times;
    </button>
  </div>

        <div className={styles.modalBody}>
          {/* 1) DnD + Map */}
        <div className={styles.topRow}>
  {/* Dropzone */}
  <div
    {...getRootProps()}
    className={
      isDragActive ? `${styles.dropZone} ${styles.dropZoneActive}` : styles.dropZone
    }
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
        <div className={styles.terminalHint}>
          Drop a file to see parsing output here.
        </div>
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

    {/* Inline mixed-data switch (NO modal) */}
    {universalRows.length > 0 && canManualSwitch && (
      <div className={styles.inlineTypeRow}>
        <span className={styles.inlineTypeLabel}>Interpret as:</span>
        <select
          className={styles.inlineTypeSelect}
          value={mapDataType || ""}
          onChange={(e) => {
            handleManualTypeChange(e);
            log(`Switched interpretation to: ${e.target.value}`, "warn");
          }}
        >
          <option value="choropleth">Choropleth (numeric)</option>
          <option value="categorical">Categorical (text)</option>
        </select>
      </div>
    )}

    {/* if not mixed, show detected type (quiet) */}
    {mapDataType && !canManualSwitch && (
      <div className={styles.inlineDetected}>
        Detected: <strong>{mapDataType}</strong>
      </div>
    )}
  </div>
</div>


        

          {/* Action row */}
<div className={styles.actionsRow}>
  <button
    type="button"
    className={styles.templateLink}
    onClick={() => {
      downloadStarterTemplate();
      log("Downloaded starter template.", "info");
    }}
  >
    <span className={styles.templateLinkIcon}>
      <FaDownload />
    </span>
    <span className={styles.templateLinkText}>
      Don’t have a file? <span className={styles.templateLinkUnderline}>See our starter template</span>
    </span>
  </button>

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
</div>


        </div>
      </div>
    </div>
  );
}

export default UploadDataModal;
