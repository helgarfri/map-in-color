/* DataIntegration.js */
import React, { useState, useEffect } from "react";
import styles from "./Data.module.css";
import countryCodes from '../countries.json';
import usStatesCodes from '../usStates.json';
import euCodes from '../europeanCountries.json';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from "./UsSVG";
import EuropeSVG from "./EuropeSVG";

// Define preloaded color themes
const themes = [
  {
    name: 'Blues',
    colors: ['#f7fbff', '#e1edf8', '#c3def1', '#a6d0ea', '#88c1e3', '#6ab3dc', '#4da4d5', '#2f95ce', '#1187c7', '#0078bf'],
  },
  {
    name: 'Reds',
    colors: ['#fff5f0', '#ffe0d9', '#ffccc2', '#ffb7ab', '#ffa295', '#ff8e7e', '#ff7967', '#ff6450', '#ff5039', '#ff3b22'],
  },
  {
    name: 'Rainbow',
    colors: ['#ff0000', '#ff7f00', '#ffff00', '#7fff00', '#00ff00', '#00ff7f', '#00ffff', '#007fff', '#0000ff', '#7f00ff'],
  },
  {
    name: 'Grayscale',
    colors: ['#ffffff', '#e6e6e6', '#cccccc', '#b3b3b3', '#999999', '#808080', '#666666', '#4d4d4d', '#333333', '#1a1a1a'],
  },
];

export default function DataIntegration({
  goBack,
  selectedMap,
  goToNextStep,
  setCsvData,
  csvData,
  selectedType
}) {
  const [groups, setGroups] = useState([]);
  const [data, setData] = useState([]);
  const [customRanges, setCustomRanges] = useState([
    {
      id: Date.now(),
      color: '#c0c0c0',
      name: '',
      lowerBound: '',
      upperBound: '',
    },
  ]);
  const [numRanges, setNumRanges] = useState(5); // Default to 5 ranges

  // File information
  const [fileName, setFileName] = useState('');
  const [fileStats, setFileStats] = useState({
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

  // State variables to store dataSource and validData
  const [dataSource, setDataSource] = useState([]);
  const [validData, setValidData] = useState([]);
  const [missingCountries, setMissingCountries] = useState([]);

  // State for error messages
  const [errors, setErrors] = useState([]);

  const dataCompleteness =
    fileStats.totalCountries > 0
      ? ((fileStats.numberOfValues / fileStats.totalCountries) * 100).toFixed(2)
      : 'N/A';

  // Handle missing countries when dataSource or validData change
  useEffect(() => {
    if (dataSource.length > 0 && validData.length > 0) {
      const missingCountriesList = dataSource
        .filter(
          (item) =>
            !validData.some(
              (dataItem) =>
                dataItem.name.toLowerCase() === item.name.toLowerCase()
            )
        )
        .map((item) => item.name);

      setMissingCountries(missingCountriesList);
    }
  }, [dataSource, validData]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name); // Set the file name
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      processCsv(text);
    };
    reader.readAsText(file);
  };

  const processCsv = (csvText) => {
    const lines = csvText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
  
    // Clear previous errors
    setErrors([]);
  
    // Determine the dataSource based on the selectedMap
    let dataSourceLocal;
    switch (selectedMap) {
      case 'usa':
        dataSourceLocal = usStatesCodes;
        break;
      case 'europe':
        dataSourceLocal = euCodes;
        break;
      default:
        dataSourceLocal = countryCodes;
        break;
    }
  
    const parsedData = [];
    const errorList = [];
  
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
  
      // Split the line by comma
      const parts = line
        .split(',')
        .map((part) => part.trim().replace(/""/g, '"'));
  
      // Check if the line is missing a comma separator
      if (parts.length < 2) {
        errorList.push({
          line: lineNumber,
          type: 'Missing Separator',
          message: `Missing comma separator after country/state "${parts[0]}".`,
        });
        // Skip further processing for this line
        return;
      }
  
      const name = parts[0];
      const valueRaw = parts[1];
      const value = valueRaw !== '' ? parseFloat(valueRaw) : null;
  
      // Validate Country/State Name
      const dataItem = dataSourceLocal.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );
  
      if (!dataItem) {
        errorList.push({
          line: lineNumber,
          type: 'Invalid Country/State Name',
          message: `Country/State "${name}" is invalid.`,
        });
      }
  
      // Validate Numeric Value
      if (valueRaw === '') {
        errorList.push({
          line: lineNumber,
          type: 'Empty Value',
          message: `Value is empty.`,
        });
      } else if (isNaN(value)) {
        errorList.push({
          line: lineNumber,
          type: 'Invalid Numeric Value',
          message: `Value "${valueRaw}" is not a valid number.`,
        });
      }
  
      // If no errors for this line, add to parsedData
      if (dataItem && valueRaw !== '' && !isNaN(value)) {
        parsedData.push({ name, code: dataItem.code, value });
      }
    });
  
    // Update state with errors or parsed data
    if (errorList.length > 0) {
      setErrors(errorList);
    } else {
      setErrors([]);
    }
  
    setData(parsedData);
    setDataSource(dataSourceLocal);
    setValidData(parsedData);
  
    // Compute statistics if there are no errors
    if (parsedData.length > 0 && errorList.length === 0) {
      const values = parsedData.map((d) => d.value);
      const totalValues = values.length;
      const sumValues = values.reduce((sum, val) => sum + val, 0);
      const averageValue = sumValues / totalValues;
  
      // Sort values for median calculation
      const sortedValues = [...values].sort((a, b) => a - b);
      const middleIndex = Math.floor(totalValues / 2);
      const medianValue =
        totalValues % 2 !== 0
          ? sortedValues[middleIndex]
          : (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  
      // Standard Deviation
      const variance =
        values.reduce((sum, val) => sum + Math.pow(val - averageValue, 2), 0) /
        totalValues;
      const standardDeviation = Math.sqrt(variance);
  
      // Find lowest and highest values
      let lowestValue = values[0];
      let highestValue = values[0];
      let lowestCountry = parsedData[0].name;
      let highestCountry = parsedData[0].name;
  
      parsedData.forEach((item) => {
        if (item.value < lowestValue) {
          lowestValue = item.value;
          lowestCountry = item.name;
        }
        if (item.value > highestValue) {
          highestValue = item.value;
          highestCountry = item.name;
        }
      });
  
      // Total number of countries/states
      const totalCountries = dataSourceLocal.length;
  
      // Update fileStats
      setFileStats({
        lowestValue,
        lowestCountry,
        highestValue,
        highestCountry,
        averageValue: parseFloat(averageValue.toFixed(2)),
        medianValue: parseFloat(medianValue.toFixed(2)),
        standardDeviation: parseFloat(standardDeviation.toFixed(2)),
        numberOfValues: totalValues,
        totalCountries,
      });
    } else {
      // Reset fileStats if there are errors
      setFileStats({
        lowestValue: null,
        lowestCountry: '',
        highestValue: null,
        highestCountry: '',
        averageValue: null,
        medianValue: null,
        standardDeviation: null,
        numberOfValues: 0,
        totalCountries: dataSourceLocal.length,
      });
    }
  };
  


  const addRange = () => {
    setCustomRanges([
      ...customRanges,
      {
        id: Date.now(),
        lowerBound: '',
        upperBound: '',
        color: '#c0c0c0',
        name: '',
      },
    ]);
  };

  const removeRange = (id) => {
    if (customRanges.length > 1) {
      setCustomRanges(customRanges.filter((range) => range.id !== id));
    } else {
      alert("Cannot delete the last range.");
    }
  };

  const handleRangeChange = (id, field, value) => {
    setCustomRanges(
      customRanges.map((range) =>
        range.id === id ? { ...range, [field]: value } : range
      )
    );
  };

  const areRangesValid = () => {
    if (customRanges.length === 0) return false;

    // Check for overlapping ranges
    const sortedRanges = [...customRanges].sort((a, b) => a.lowerBound - b.lowerBound);
    for (let i = 0; i < sortedRanges.length - 1; i++) {
      if (sortedRanges[i].upperBound > sortedRanges[i + 1].lowerBound) {
        return false;
      }
    }

    // Ensure all ranges have valid lower and upper bounds
    for (let range of sortedRanges) {
      if (
        isNaN(range.lowerBound) ||
        isNaN(range.upperBound) ||
        range.lowerBound > range.upperBound
      ) {
        return false;
      }
    }

    return true;
  };

  const generateGroups = () => {
    if (data.length === 0) {
      alert("Please upload a CSV file first.");
      return;
    }

    // Validate ranges
    const validRanges = customRanges.filter(
      (range) =>
        !isNaN(range.lowerBound) &&
        !isNaN(range.upperBound) &&
        range.lowerBound <= range.upperBound
    );

    // Check for overlapping ranges
    let isOverlapping = false;
    for (let i = 0; i < validRanges.length - 1; i++) {
      if (validRanges[i].upperBound > validRanges[i + 1].lowerBound) {
        isOverlapping = true;
        break;
      }
    }

    if (isOverlapping) {
      alert('Ranges are overlapping. Please adjust them.');
      return;
    }

    // Sort ranges by lowerBound
    const sortedRanges = validRanges.sort((a, b) => a.lowerBound - b.lowerBound);

    // Initialize groups
    const newGroups = sortedRanges.map((range) => ({
      ...range,
      countries: [],
      rangeLabel: range.name || `${range.lowerBound} - ${range.upperBound}`,
    }));

    // Assign countries to groups
    data.forEach((item) => {
      const group = newGroups.find(
        (g) =>
          item.value >= g.lowerBound && item.value <= g.upperBound
      );
      if (group) {
        group.countries.push(item);
      }
    });

    setGroups(newGroups);
  };

  const suggestRanges = () => {
    if (data.length === 0) {
      alert("Please upload a CSV file first.");
      return;
    }

    const values = data.map((d) => d.value);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);

    const rangeWidth = (maxValue - minValue) / numRanges;

    const suggestedRanges = Array.from({ length: numRanges }, (_, i) => {
      const lowerBound = minValue + i * rangeWidth;
      const upperBound = i === numRanges - 1 ? maxValue : minValue + (i + 1) * rangeWidth;
      return {
        id: Date.now() + i,
        lowerBound: parseFloat(lowerBound.toFixed(2)),
        upperBound: parseFloat(upperBound.toFixed(2)),
        color: '#c0c0c0',
        name: '',
      };
    });

    setCustomRanges(suggestedRanges);
  };

  const applyTheme = (themeColors) => {
    const numRanges = customRanges.length;
    const numColors = themeColors.length;

    const indices = [];
    if (numRanges === 1) {
      // Single range: use the middle color
      indices.push(Math.floor((numColors - 1) / 2));
    } else {
      // Multiple ranges: distribute colors evenly
      const step = (numColors - 1) / (numRanges - 1);
      for (let i = 0; i < numRanges; i++) {
        indices.push(Math.round(i * step));
      }
    }

    // Assign colors to ranges based on calculated indices
    const newRanges = customRanges.map((range, index) => ({
      ...range,
      color: themeColors[indices[index]] || '#c0c0c0', // Fallback color
    }));

    setCustomRanges(newRanges);
  };

  const downloadTemplate = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let dataSourceLocal;
    if (selectedMap === "europe") {
      dataSourceLocal = euCodes;
    } else if (selectedMap === "usa") {
      dataSourceLocal = usStatesCodes;
    } else {
      dataSourceLocal = countryCodes;
    }

    dataSourceLocal.forEach(item => {
      const name = item.name.includes(',') ? `"${item.name}"` : item.name;
      csvContent += `${name},\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', selectedMap === "europe" ? 'european_countries_template.csv' : selectedMap === "usa" ? 'us_states_template.csv' : 'countries_template.csv');
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  // Optional: Download Error Log Function
  const downloadErrorLog = () => {
    if (errors.length === 0) return;

    let errorContent = "Line,Error Type,Message\n";
    errors.forEach((error) => {
      // Escape double quotes and commas in messages
      const escapedMessage = error.message.replace(/"/g, '""');
      errorContent += `${error.line},"${error.type}","${escapedMessage}"\n`;
    });

    const blob = new Blob([errorContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "error_log.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.container}>

      <h2>Data Integration</h2>

      {/* Top Layer: File Upload and File Information */}
<div className={styles.topSection}>
  {/* File Upload Box */}
  <div className={styles.fileUploadBox}>
    <h3>Upload CSV File</h3>
    <p>
      Selected Map: <b>{selectedMap === 'world' ? 'World Map' : selectedMap === 'europe' ? 'Europe' : 'USA'}</b>
    </p>
        <button className={styles.secondaryButton} onClick={downloadTemplate}>Download Template</button>

    <input type="file" accept=".csv" onChange={handleFileUpload} />
    <p>Please ensure your CSV file is structured as follows:</p>
    <ul>
      <li>First column: Country/State Name</li>
      <li>Second column: Value</li>
    </ul>
    <p>Example:</p>
    <pre>
      StateName1,Value1{'\n'}
      StateName2,Value2{'\n'}
      ...
    </pre>

    {/* File Upload Status */}
    {fileName !== '' ? (
      <p className={styles.validMessage}>File is valid.</p>
    ) : (
      <p className={styles.noFileMessage}>No file uploaded.</p>
    )}
  </div>

  {/* File Information Box */}
  <div className={styles.fileInfoBox}>
    {errors.length > 0 ? (
      /* Display Error Log in place of the table */
      <div className={styles.errorBox}>
        <p className={styles.errorTitle}>There are {errors.length} error{errors.length > 1 ? 's' : ''} in the file:</p>
        <ul className={styles.errorList}>
          {errors.map((error, index) => (
            <li key={index}>
              <strong>Line {error.line}:</strong> {error.message}
            </li>
          ))}
        </ul>
        <button className={styles.downloadErrorButton} onClick={downloadErrorLog}>Download Error Log</button>
      </div>
    ) : (
      /* Display the File Information Table when there are no errors */
      <table className={styles.fileInfoTable}>
        <tbody>
          <tr>
            <th>File Name</th>
            <td>{fileName || 'N/A'}</td>
          </tr>
          <tr>
            <th>Lowest Value</th>
            <td>{fileStats.lowestValue !== null ? fileStats.lowestValue : 'N/A'}</td>
          </tr>
          <tr>
            <th>State (Lowest)</th>
            <td>{fileStats.lowestCountry || 'N/A'}</td>
          </tr>
          <tr>
            <th>Highest Value</th>
            <td>{fileStats.highestValue !== null ? fileStats.highestValue : 'N/A'}</td>
          </tr>
          <tr>
            <th>State (Highest)</th>
            <td>{fileStats.highestCountry || 'N/A'}</td>
          </tr>
          <tr>
            <th>Average Value</th>
            <td>{fileStats.averageValue !== null ? fileStats.averageValue : 'N/A'}</td>
          </tr>
          <tr>
            <th>Median Value</th>
            <td>{fileStats.medianValue !== null ? fileStats.medianValue : 'N/A'}</td>
          </tr>
          <tr>
            <th>Standard Deviation</th>
            <td>{fileStats.standardDeviation !== null ? fileStats.standardDeviation : 'N/A'}</td>
          </tr>
          <tr>
            <th>Values Count</th>
            <td>{fileStats.numberOfValues}</td>
          </tr>
          <tr>
            <th>Total Countries</th>
            <td>{fileStats.totalCountries}</td>
          </tr>
          <tr>
            <th>Data Completeness (%)</th>
            <td>{dataCompleteness || 'N/A'}</td>
          </tr>
        </tbody>
      </table>
    )}
  </div>
</div>

      {/* Second Layer: Range Settings */}
      <div className={styles.section}>
        <h3>Define Custom Ranges</h3>
        <table className={styles.rangeTable}>
          <thead>
            <tr>
              <th>Lower Bound</th>
              <th>Upper Bound</th>
              <th>Name</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customRanges.map((range, index) => (
              <tr key={range.id}>
                <td>
                  <input
                    type="number"
                    className={styles.inputBox}
                    value={range.lowerBound}
                    onChange={(e) =>
                      handleRangeChange(range.id, 'lowerBound', parseFloat(e.target.value))
                    }
                    placeholder="Min"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className={styles.inputBox}
                    value={range.upperBound}
                    onChange={(e) =>
                      handleRangeChange(range.id, 'upperBound', parseFloat(e.target.value))
                    }
                    placeholder="Max"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className={styles.inputBox}
                    value={range.name}
                    onChange={(e) => handleRangeChange(range.id, 'name', e.target.value)}
                    placeholder="Name"
                  />
                </td>
                <td>
                  <input
                    type="color"
                    className={styles.inputBox}
                    value={range.color}
                    onChange={(e) => handleRangeChange(range.id, 'color', e.target.value)}
                  />
                </td>
                <td>
                  {/* Remove Button */}
                  {customRanges.length > 1 ? (
                    <button
                      className={styles.removeButton}
                      onClick={() => removeRange(range.id)}
                      aria-label={`Remove range ${range.name || index + 1}`}
                    >
                      &times;
                    </button>
                  ) : (
                    <button
                      className={styles.removeButton}
                      disabled
                      aria-label="Remove range"
                    >
                      &times;
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Number of Ranges Select Input, Suggest Ranges Button, Add Range Button, Generate Groups Button, and Theme Buttons */}
        <div className={styles.rangeControls}>
          <div className={styles.leftControls}>
            <label htmlFor="numRanges" title="Select the total number of ranges you want to define">
              Ranges:
            </label>
            <select
              id="numRanges"
              className={styles.inputBox} /* Apply input styles to select */
              value={numRanges}
              onChange={(e) => setNumRanges(parseInt(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <button
              className={styles.secondaryButton}
              onClick={suggestRanges}
              disabled={data.length === 0}
            >
              Suggest Ranges
            </button>
            <button
              className={styles.secondaryButton}
              onClick={addRange}
            >
              Add Range
            </button>
            <button
              className={styles.primaryButton}
              onClick={generateGroups}
              disabled={data.length === 0 || !areRangesValid()}
            >
              Generate Groups
            </button>
          </div>

          {/* Theme Buttons */}
          <div className={styles.themeButtons}>
            {themes.map((theme, index) => (
              <button
                key={index}
                className={styles.themeButton}
                onClick={() => applyTheme(theme.colors)}
                title={theme.name}
              >
                {/* Display theme colors */}
                <div className={styles.themePreview}>
                  {theme.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className={styles.themeColor}
                      style={{ backgroundColor: color }}
                    ></div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Layer: Map Preview and Displayed Groups */}
      <div className={styles.bottomSection}>
        {/* Map Preview */}
        <div className={styles.mapContainer}>
          <h3>Preview</h3>
          {selectedMap === 'world' && <WorldMapSVG groups={groups} />}
          {selectedMap === 'usa' && <UsSVG groups={groups} />}
          {selectedMap === 'europe' && <EuropeSVG groups={groups} />}
        </div>

        {/* Displayed Groups */}
        <div className={styles.groupsContainer}>
          <h3>Groups</h3>
          <div>
            {groups.length > 0 ? (
              groups.map((group, index) => (
                <div key={group.id} className={styles.group}>
                  <span><b>{group.rangeLabel}</b></span>
                  <div
                    className={styles.colorBox}
                    style={{ backgroundColor: group.color }}
                  ></div>
                  {group.countries.length > 0 && (
                    <div className={styles.countriesContainer}>
                      {group.countries.map((c) => (
                        <div key={c.code} className={styles.countryBox}>
                          {c.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className={styles.placeholderMessage}>
                No groups defined yet. Please define ranges and generate groups.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <button className={styles.secondaryButton} onClick={goBack}>Go Back</button>
        <button className={styles.secondaryButton} onClick={goToNextStep}>Finalize</button>
      </div>
      </div>
    );
  }
