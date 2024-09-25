import React, { useState } from "react";
import styles from "./Data.module.css";
import countryCodes from '../countries.json';
import usStatesCodes from '../usStates.json';
import euCodes from '../europeanCountries.json';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from "./UsSVG";
import EuropeSVG from "./EuropeSVG";

export default function DataIntegration({
  goBack,
  selectedMap,
  goToNextStep,
  setCsvData,
  csvData,
  selectedType
}) {

  // Place this at the top of your file
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



  //upplýsingar um skrá
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

  const dataCompleteness = (
    (fileStats.numberOfValues / fileStats.totalCountries) *
    100
  ).toFixed(2);


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
  

  //vinnsla á csv skrá
  const processCsv = (csvText) => {
    const lines = csvText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));
  
    // Determine the dataSource based on the selectedMap
    let dataSource;
    switch (selectedMap) {
      case 'usa':
        dataSource = usStatesCodes;
        break;
      case 'europe':
        dataSource = euCodes;
        break;
      default:
        dataSource = countryCodes;
        break;
    }
  
    const parsedData = lines.map((line) => {
      const parts = line
        .split(',')
        .map((part) => part.trim().replace(/""/g, '"'));
      const name = parts[0];
      const value = parts.length > 1 ? parseFloat(parts[1]) : null;
      const dataItem = dataSource.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );
      const code = dataItem ? dataItem.code : 'Unknown';
      return { name, code, value };
    });
  
    // Filter out invalid entries
    const validData = parsedData.filter((d) => !isNaN(d.value));
  
    // Set the parsed data to state
    setData(validData);
  
    // Compute statistics
    if (validData.length > 0) {
      const values = validData.map((d) => d.value);
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
      let lowestCountry = validData[0].name;
      let highestCountry = validData[0].name;
  
      validData.forEach((item) => {
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
      const totalCountries = dataSource.length;
  
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

  const downloadTemplate = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let dataSource;
    if (selectedMap === "europe") {
        dataSource = euCodes;
    } else if (selectedMap === "usa") {
        dataSource = usStatesCodes;
    } else {
        dataSource = countryCodes;
    }

    dataSource.forEach(item => {
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

  const applyTheme = (themeColors) => {
    const numRanges = customRanges.length;
    const numColors = themeColors.length;
  
    const indices = [];
    if (numRanges === 1) {
      indices.push(Math.floor((numColors - 1) / 2));
    } else {
      const step = (numColors - 1) / (numRanges - 1);
      for (let i = 0; i < numRanges; i++) {
        indices.push(Math.round(i * step));
      }
    }
  
    const newRanges = customRanges.map((range, index) => ({
      ...range,
      color: themeColors[indices[index]],
    }));
  
    setCustomRanges(newRanges);
  };
  
  

  return (
    <div className={styles.container}>

      <h2>Data Integration</h2>

    {/* Top Layer: File Upload and File Information */}
<div className={styles.topSection}>
  {/* File Upload Box */}
  <div className={styles.fileUploadBox}>
    <h3>Upload CSV File</h3>
    <p>Selected Map: {selectedMap === 'world' ? 'World Map' : selectedMap === 'europe' ? 'Europe' : 'USA'}</p>
    <input type="file" accept=".csv" onChange={handleFileUpload} />
    <button onClick={downloadTemplate}>Download Template</button>
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
  </div>

  {/* File Information Table */}
  <div className={styles.fileInfoBox}>
    {/* File Information Table */}
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
                    value={range.lowerBound}
                    onChange={(e) =>
                      handleRangeChange(range.id, 'lowerBound', parseFloat(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={range.upperBound}
                    onChange={(e) =>
                      handleRangeChange(range.id, 'upperBound', parseFloat(e.target.value))
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={range.name}
                    onChange={(e) => handleRangeChange(range.id, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="color"
                    value={range.color}
                    onChange={(e) => handleRangeChange(range.id, 'color', e.target.value)}
                  />
                </td>
                <td>
                  {/* Disable or hide the Remove button if there's only one range */}
                  {customRanges.length > 1 ? (
                    <button onClick={() => removeRange(range.id)}>Remove</button>
                  ) : (
                    <button disabled>Remove</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>

      {/* Number of Ranges Select Input, Suggest Ranges Button, Add Range Button, and Theme Buttons */}
      <div className={styles.rangeControls}>
        <div className={styles.leftControls}>
          <label htmlFor="numRanges">Number of Ranges:</label>
          <select
            id="numRanges"
            value={numRanges}
            onChange={(e) => setNumRanges(parseInt(e.target.value))}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <button onClick={suggestRanges} disabled={data.length === 0}>
            Suggest Ranges
          </button>
          <button onClick={addRange}>Add Range</button>
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


        <button onClick={generateGroups}>Generate Groups</button>
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
          {groups.length > 0 ? (
            <div>
              {groups.map((group, index) => (
                <div key={index} className={styles.group}>
                  <span>Range: {group.rangeLabel}</span>
                  <div
                    className={styles.colorBox}
                    style={{ backgroundColor: group.color }}
                  ></div>
                  {group.countries.length > 0 && (
                    <div>
                      {group.countries.map((c) => c.name).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No groups defined yet. Please define ranges and generate groups.</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigationButtons}>
        <button onClick={goBack}>Go Back</button>
        <button onClick={goToNextStep}>Finalize</button>
      </div>
    </div>
  );
}
