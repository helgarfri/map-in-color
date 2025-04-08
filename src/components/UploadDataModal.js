import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import styles from './UploadDataModal.module.css';

// Example import for your map components
import WorldMapSVG from './WorldMapSVG';
import UsSVG from './UsSVG';
import EuropeSVG from './EuropeSVG';

// JSON with country/state codes
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

function UploadDataModal({
  isOpen,
  onClose,
  selectedMap = 'world', // 'world' | 'usa' | 'europe'
  onImport,                // callback: gets the parsed data + stats
}) {
  // State for file name, validity, parsing errors
  const [fileName, setFileName] = useState('');
  const [fileIsValid, setFileIsValid] = useState(null);
  const [errors, setErrors] = useState([]);

  // Basic stats object
  const [fileStats, setFileStats] = useState({
    lowestValue: null,
    lowestCountry: '',
    highestValue: null,
    highestCountry: '',
    averageValue: null,
    numberOfValues: 0,
    totalCountries: 0,
  });

  // Parsed data
  const [parsedData, setParsedData] = useState([]);

  // Decide data source
  const dataSource =
    selectedMap === 'usa'
      ? usStatesCodes
      : selectedMap === 'europe'
      ? euCodes
      : countryCodes;

  // Reset when closed
  useEffect(() => {
    if (!isOpen) {
      setFileName('');
      setFileIsValid(null);
      setErrors([]);
      setParsedData([]);
      setFileStats({
        lowestValue: null,
        lowestCountry: '',
        highestValue: null,
        highestCountry: '',
        averageValue: null,
        numberOfValues: 0,
        totalCountries: dataSource.length,
      });
    }
  }, [isOpen, dataSource.length]);

  // On Drop or File Browse
  const onDrop = (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      processFile(acceptedFiles[0]);
    }
  };

  // Setup Dropzone
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

  // Parse logic
  const processFile = (file) => {
    setFileName(file.name);
    setErrors([]);
    setFileIsValid(null);

    const fileExt = file.name.split('.').pop().toLowerCase();

    if (fileExt === 'csv' || fileExt === 'tsv' || fileExt === 'txt') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        parseTextFile(text, fileExt);
      };
      reader.readAsText(file);
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        parseArrayOfRows(rows);
      };
      reader.readAsArrayBuffer(file);
    } else {
      setErrors([{ line: 0, type: 'Invalid File', message: 'Unsupported file type.' }]);
      setFileIsValid(false);
    }
  };

  const parseTextFile = (content, fileExt) => {
    const lines = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    const delimiter = fileExt === 'tsv' ? '\t' : ',';
    const rows = lines.map((line) => line.split(delimiter));
    parseArrayOfRows(rows);
  };

  const parseArrayOfRows = (rows) => {
    const errorList = [];
    const results = [];

    rows.forEach((row, index) => {
      const lineNum = index + 1;
      if (row.length < 2) {
        errorList.push({
          line: lineNum,
          type: 'Missing Value',
          message: `Need at least 2 columns on line ${lineNum}`,
        });
        return;
      }

      const [nameRaw, valueRaw] = row.map((cell) => (cell || '').trim());
      if (!nameRaw) {
        errorList.push({
          line: lineNum,
          type: 'Missing Name',
          message: `No state/country name on line ${lineNum}`,
        });
        return;
      }
      if (!valueRaw) {
        return; // skip
      }

      const numericVal = parseFloat(valueRaw);
      if (isNaN(numericVal)) {
        errorList.push({
          line: lineNum,
          type: 'Invalid Number',
          message: `Value "${valueRaw}" is not valid.`,
        });
        return;
      }

      const foundItem = dataSource.find((item) => {
        const codeMatches = item.code.toLowerCase() === nameRaw.toLowerCase();
        const allNames = [item.name, ...(item.aliases || [])].map((s) => s.toLowerCase());
        const nameMatches = allNames.includes(nameRaw.toLowerCase());
        return codeMatches || nameMatches;
      });

      if (!foundItem) {
        errorList.push({
          line: lineNum,
          type: 'Invalid Name',
          message: `No match for "${nameRaw}"`,
        });
        return;
      }

      results.push({
        name: foundItem.name,
        code: foundItem.code,
        value: numericVal,
      });
    });

    if (errorList.length > 0) {
      setFileIsValid(false);
      setErrors(errorList);
      setParsedData(results);
      updateStats(results);
    } else {
      setFileIsValid(true);
      setErrors([]);
      setParsedData(results);
      updateStats(results);
    }
  };

  const updateStats = (dataArray) => {
    if (dataArray.length === 0) {
      setFileStats({
        lowestValue: null,
        lowestCountry: '',
        highestValue: null,
        highestCountry: '',
        averageValue: null,
        numberOfValues: 0,
        totalCountries: dataSource.length,
      });
      return;
    }

    let minVal = dataArray[0].value;
    let maxVal = dataArray[0].value;
    let minName = dataArray[0].name;
    let maxName = dataArray[0].name;
    let sumVal = 0;

    dataArray.forEach((item) => {
      sumVal += item.value;
      if (item.value < minVal) {
        minVal = item.value;
        minName = item.name;
      }
      if (item.value > maxVal) {
        maxVal = item.value;
        maxName = item.name;
      }
    });

    const avgVal = sumVal / dataArray.length;
    setFileStats({
      lowestValue: minVal,
      lowestCountry: minName,
      highestValue: maxVal,
      highestCountry: maxName,
      averageValue: parseFloat(avgVal.toFixed(2)),
      numberOfValues: dataArray.length,
      totalCountries: dataSource.length,
    });
  };

  const dataCompleteness =
    fileStats.totalCountries > 0
      ? ((fileStats.numberOfValues / fileStats.totalCountries) * 100).toFixed(2)
      : 'N/A';

  const downloadStarterTemplate = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    dataSource.forEach((item) => {
      const maybeQuote = item.name.includes(',') ? `"${item.name}"` : item.name;
      csvContent += `${maybeQuote},\n`; // no value
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
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

  const handleImportData = () => {
    onImport(parsedData, fileStats);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Close button (X) */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>

        <div className={styles.modalBody}>
          {/* LEFT: Drop area + error display */}
          <div className={styles.leftSide}>
            <div
              {...getRootProps()}
              className={`${styles.dropArea} ${isDragActive ? styles.dragging : ''}`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the file here ...</p>
              ) : (
                <>
                  <p>Drag & Drop your CSV, TSV, or Excel file here</p>
                  <p>OR click to browse</p>
                </>
              )}
            </div>

            <div className={styles.fileDisplay}>
              {fileName && (
                <p className={styles.fileName}>
                  File: <strong>{fileName}</strong>
                </p>
              )}
              {fileName && fileIsValid === true && (
                <p className={styles.validMessage}>File is valid</p>
              )}
              {fileName && fileIsValid === false && (
                <p className={styles.invalidMessage}>File is not valid</p>
              )}
              {!fileName && (
                <p className={styles.noFileMessage}>
                  No file selected or dropped yet.
                </p>
              )}
            </div>

            {/* If errors exist, show them */}
            {errors.length > 0 && (
              <div className={styles.errorBox}>
                <p>
                  {`There ${
                    errors.length === 1 ? 'is' : 'are'
                  } ${errors.length} error${errors.length > 1 ? 's' : ''}:`}
                </p>
                <ul>
                  {errors.map((err, i) => (
                    <li key={i}>
                      <strong>Line {err.line}:</strong> {err.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT: Map overlay + stats + import button */}
          <div className={styles.rightSide}>
            <div className={styles.mapPreviewWrapper}>
              <div className={styles.mapOverlay}>
                <div className={styles.mapOverlayText}>
                  {selectedMap === 'world'
                    ? 'World'
                    : selectedMap === 'usa'
                    ? 'USA'
                    : 'Europe'}
                </div>
              </div>
              <div className={styles.mapContainer}>
                {selectedMap === 'world' && <WorldMapSVG />}
                {selectedMap === 'usa' && <UsSVG />}
                {selectedMap === 'europe' && <EuropeSVG />}
              </div>
            </div>

            <button className={styles.downloadTemplateBtn} onClick={downloadStarterTemplate}>
              Download Starter Template
            </button>

            <div className={styles.statsTable}>
              <table>
                <tbody>
                  <tr>
                    <th>File Name</th>
                    <td>{fileName || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Lowest Value</th>
                    <td>
                      {fileStats.lowestValue !== null
                        ? fileStats.lowestValue
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th>Highest Value</th>
                    <td>
                      {fileStats.highestValue !== null
                        ? fileStats.highestValue
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th>Average Value</th>
                    <td>
                      {fileStats.averageValue !== null
                        ? fileStats.averageValue
                        : 'N/A'}
                    </td>
                  </tr>
                  <tr>
                    <th>Data Completion</th>
                    <td>
                      {fileStats.numberOfValues}/{fileStats.totalCountries} ({dataCompleteness}%)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              className={styles.importDataBtn}
              disabled={!fileIsValid || parsedData.length === 0}
              onClick={handleImportData}
            >
              Import Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadDataModal;
