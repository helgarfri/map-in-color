import React, { useState, useEffect, useContext } from "react";
import styles from "./DataIntergration.module.css";
import countryCodes from '../countries.json';
import usStatesCodes from '../usStates.json';
import euCodes from '../europeanCountries.json';
import WorldMapSVG from './WorldMapSVG';
import UsSVG from "./UsSVG";
import EuropeSVG from "./EuropeSVG";
import { useNavigate, useLocation } from "react-router";
import { updateMap, createMap } from "../api";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faLock, faCaretDown, faFileCsv } from '@fortawesome/free-solid-svg-icons';
import Header from "./Header";

import { SidebarContext } from "../context/SidebarContext";

/** Color Palettes **/
const themes = [
  {
    name: 'None',
    colors: ['#c3c3c3', '#c3c3c3', '#c3c3c3', '#c3c3c3', '#c3c3c3', '#c3c3c3', '#c3c3c3', '#c3c3c3', '#c3c3c3', '#c3c3c3'],
  },
  {
    name: 'Blues',
    colors: ['#f7fbff', '#e1edf8', '#c3def1', '#a6d0ea', '#88c1e3', '#6ab3dc', '#4da4d5', '#2f95ce', '#1187c7', '#0078bf'],
  },
  {
    name: 'Reds',
    colors: ['#fff5f0', '#ffe0d9', '#ffccc2', '#ffb7ab', '#ffa295', '#ff8e7e', '#ff7967', '#ff6450', '#ff5039', '#ff3b22'],
  },
  {
    name: 'Greens',
    colors: ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#33a34d', '#26873c', '#1c6b31'],
  },
  {
    name: 'Yellows',
    colors: ['#ffffe5', '#fff7bc', '#fee391', '#fec44f', '#fe9929', '#ec7014', '#d5600e', '#b04d0b', '#8a3907'],
  },
  {
    name: 'Red to Green',
    colors: ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#4daf4a'],
  },
  {
    name: 'Heatmap',
    colors: ['#ffffff', '#ffffcc', '#ffeda0', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#8e0152'],
  },
  {
    name: 'Oranges',
    colors: ['#fff5eb', '#fee6ce', '#fdd0a2', '#fdae6b', '#fd8d3c', '#f16913', '#d55a0d', '#a94703', '#853200'],
  },
  {
    name: 'Purples',
    colors: ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6b65ab', '#564699', '#453480'],
  },
  {
    name: 'GNBu',
    colors: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#3791b7', '#1d7295', '#0f4d6f'],
  },
  {
    name: 'PuBu',
    colors: ['#f7fcfd', '#e0ecf4', '#bfd3e6', '#9ebcda', '#8c96c6', '#8c6bb1', '#7a4ea0', '#65348b', '#50216e'],
  },
];

/** Map Themes **/
const map_themes = [
  {
    name: 'Default',
    ocean_color: '#ffffff',
    font_color: 'black',
    unassigned_color: '#c0c0c0',
  },
  {
    name: 'Muted Twilight',
    ocean_color: '#3D3846',
    font_color: 'white',
    unassigned_color: '#5E5C64',
  },
  {
    name: 'Oceanic',
    ocean_color: '#006994',
    font_color: 'white',
    unassigned_color: '#004c70',
  },
  {
    name: 'Polar Ice',
    ocean_color: '#E0F7FA',
    font_color: 'black',
    unassigned_color: '#ffffff',
  },
  {
    name: 'Vintage Sepia',
    ocean_color: '#704214',
    font_color: 'white',
    unassigned_color: '#D2B48C',
  },
  {
    name: 'Midnight Blue',
    ocean_color: '#191970',
    font_color: 'white',
    unassigned_color: '#2F4F4F',
  },
  {
    name: 'Emerald Isles',
    ocean_color: '#50C878',
    font_color: 'black',
    unassigned_color: '#98FB98',
  },
  {
    name: 'Desert Sand',
    ocean_color: '#EDC9AF',
    font_color: 'black',
    unassigned_color: '#C2B280',
  },
  {
    name: 'Fire and Ice',
    ocean_color: '#1E90FF',
    font_color: 'white',
    unassigned_color: '#FF4500',
  },
  {
    name: 'Deep Space',
    ocean_color: '#000000',
    font_color: 'white',
    unassigned_color: '#2E2E2E',
  },
  {
    name: 'Pastel Dreams',
    ocean_color: '#FFB6C1',
    font_color: 'black',
    unassigned_color: '#FFDAB9',
  },
  {
    name: 'Sunset Glow',
    ocean_color: '#FFA07A',
    font_color: 'black',
    unassigned_color: '#FF6347',
  },
  {
    name: 'Forest Green',
    ocean_color: '#228B22',
    font_color: 'white',
    unassigned_color: '#6B8E23',
  },
  {
    name: 'Map in Color theme',
    ocean_color: '#80a0b0',
    font_color: 'black',
    unassigned_color: '#55957b',
  }
];

export default function DataIntegration({
  existingMapData = null,
  isEditing = false,

}) {
  const location = useLocation();
  const navigate = useNavigate();

  // --- State variables ---
  const [selected_map, setSelectedMap] = useState(
    existingMapData ? existingMapData.selected_map : location.state?.selected_map || 'world'
  );
  const [file_name, setFileName] = useState('');
  const [fileIsValid, setFileIsValid] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [validData, setValidData] = useState([]);
  const [missingCountries, setMissingCountries] = useState([]);
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState([]);
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const [file_stats, setFileStats] = useState({
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

  const [custom_ranges, setCustomRanges] = useState([
    {
      id: Date.now(),
      color: '#c0c0c0',
      name: '',
      lowerBound: '',
      upperBound: '',
    },
  ]);
  const [numRanges, setNumRanges] = useState(5);
  const [rangeOrder, setRangeOrder] = useState('low-high');
  const [groups, setGroups] = useState([]);

  // Map display
  const [show_top_high_values, setShowTopHighValues] = useState(false);
  const [show_top_low_values, setShowTopLowValues] = useState(false);
  const [topHighValues, setTopHighValues] = useState([]);
  const [top_low_values, setTopLowValues] = useState([]);
  const [is_title_hidden, setIsTitleHidden] = useState(false);

  // Colors & theme
  const [ocean_color, setOceanColor] = useState('#ffffff');
  const [unassigned_color, setUnassignedColor] = useState('#c0c0c0');
  const [font_color, setFontColor] = useState('black');
  const [selected_palette, setSelectedPalette] = useState('None');
  const [selected_map_theme, setSelectedMapTheme] = useState('Default');

  // Other
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);
  const [is_public, setIsPublic] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Map title
  const [mapTitle, setMapTitle] = useState('');

  const [references, setReferences] = useState(existingMapData?.sources || []);

  // Track which reference is being edited (or null for new)
  const [selectedReference, setSelectedReference] = useState(null);
  // Show/hide modal
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);

  const [tempSourceName, setTempSourceName] = useState('');
  const [tempYear, setTempYear] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [tempNotes, setTempNotes] = useState('');
  const [tempPublicator, setTempPublicator] = useState('');

  // If existingMapData is provided (editing)
  useEffect(() => {
    if (existingMapData) {
      setFileName(existingMapData.file_name);
      setFileStats(existingMapData.file_stats);
      setMapTitle(existingMapData.title);
      setData(existingMapData.data);
      setCustomRanges(existingMapData.custom_ranges);
      setGroups(existingMapData.groups);
      setSelectedMap(existingMapData.selected_map);
      setOceanColor(existingMapData.ocean_color);
      setUnassignedColor(existingMapData.unassigned_color);
      setFontColor(existingMapData.font_color);
      setShowTopHighValues(existingMapData.show_top_high_values);
      setShowTopLowValues(existingMapData.show_top_low_values);
      setTopHighValues(existingMapData.show_top_high_values);
      setTopLowValues(existingMapData.top_low_values);
      setSelectedPalette(existingMapData.selected_palette);
      setSelectedMapTheme(existingMapData.selected_map_theme);
      setDescription(existingMapData.description || '');
      setTags(existingMapData.tags || []);
      setIsPublic(existingMapData.is_public || false);
      setIsTitleHidden(existingMapData.is_title_hidden || false);
    }
    // eslint-disable-next-line
  }, [existingMapData]);

  // Prevent scrolling when popup is open
  useEffect(() => {
    document.body.style.overflow = isPopupOpen ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPopupOpen]);

  // Data completeness
  const dataCompleteness =
    file_stats.totalCountries > 0
      ? ((file_stats.numberOfValues / file_stats.totalCountries) * 100).toFixed(2)
      : 'N/A';

  // Track missing countries
  useEffect(() => {
    if (dataSource.length > 0 && validData.length > 0) {
      const missingCountriesList = dataSource.filter(
        (item) =>
          !validData.some(
            (dataItem) =>
              dataItem.name.toLowerCase() === item.name.toLowerCase()
          )
      ).map((item) => item.name);
      setMissingCountries(missingCountriesList);
    }
  }, [dataSource, validData]);

  // Toggle popup
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // File upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setFileIsValid(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      processCsv(e.target.result);
    };
    reader.readAsText(file);
  };

  // Parse CSV
  const processCsv = (csvText) => {
    const lines = csvText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('#'));

    setErrors([]);

    // Decide dataSource
    let dataSourceLocal;
    if (selected_map === 'usa') dataSourceLocal = usStatesCodes;
    else if (selected_map === 'europe') dataSourceLocal = euCodes;
    else dataSourceLocal = countryCodes;

    const parsedData = [];
    const errorList = [];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const parts = line.split(',').map((p) => p.trim().replace(/""/g, '"'));
      if (parts.length < 2) {
        errorList.push({
          line: lineNumber,
          type: 'Missing Separator',
          message: `Missing comma separator after "${parts[0]}"`,
        });
        return;
      }
      const name = parts[0];
      const valueRaw = parts[1];
      const value = valueRaw !== '' ? parseFloat(valueRaw) : null;

      // Validate name
      const dataItem = dataSourceLocal.find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
      );
      if (!dataItem) {
        errorList.push({
          line: lineNumber,
          type: 'Invalid Name',
          message: `Country/State "${name}" is invalid.`,
        });
      }
      // Validate value
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
      if (dataItem && valueRaw !== '' && !isNaN(value)) {
        parsedData.push({ name, code: dataItem.code, value });
      }
    });

    if (errorList.length > 0) {
      setErrors(errorList);
      setFileIsValid(false);
    } else {
      setErrors([]);
      setFileIsValid(true);
    }

    setData(parsedData);
    setDataSource(dataSourceLocal);
    setValidData(parsedData);

    // Post-process
    if (parsedData.length > 0 && errorList.length === 0) {
      // Sort descending
      const sortedDesc = [...parsedData].sort((a, b) => b.value - a.value);
      sortedDesc.forEach((item, i) => (item.rankDesc = i + 1));

      // Sort ascending
      const sortedAsc = [...parsedData].sort((a, b) => a.value - b.value);
      sortedAsc.forEach((item, i) => (item.rankAsc = i + 1));

      // Top values
      setTopHighValues(sortedDesc.slice(0, Math.min(3, sortedDesc.length)));
      setTopLowValues(sortedAsc.slice(0, Math.min(3, sortedAsc.length)));

      // Stats
      const values = parsedData.map((d) => d.value);
      const totalVals = values.length;
      const sumVals = values.reduce((sum, val) => sum + val, 0);
      const avg = sumVals / totalVals;
      const sortedVals = [...values].sort((a, b) => a - b);
      const midIndex = Math.floor(totalVals / 2);
      const median =
        totalVals % 2 !== 0
          ? sortedVals[midIndex]
          : (sortedVals[midIndex - 1] + sortedVals[midIndex]) / 2;
      const variance =
        values.reduce((sum, val) => sum + (val - avg) ** 2, 0) / totalVals;
      const stdDev = Math.sqrt(variance);

      // Find extremes
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

      setFileStats({
        lowestValue,
        lowestCountry,
        highestValue,
        highestCountry,
        averageValue: parseFloat(avg.toFixed(2)),
        medianValue: parseFloat(median.toFixed(2)),
        standardDeviation: parseFloat(stdDev.toFixed(2)),
        numberOfValues: totalVals,
        totalCountries: dataSourceLocal.length,
      });
    } else {
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
      setTopHighValues([]);
      setTopLowValues([]);
    }
  };

  // Download template
  const downloadTemplate = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let dataSourceLocal;
    if (selected_map === "europe") {
      dataSourceLocal = euCodes;
    } else if (selected_map === "usa") {
      dataSourceLocal = usStatesCodes;
    } else {
      dataSourceLocal = countryCodes;
    }
    dataSourceLocal.forEach((item) => {
      const name = item.name.includes(',') ? `"${item.name}"` : item.name;
      csvContent += `${name},\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      selected_map === "europe"
        ? 'european_countries_template.csv'
        : selected_map === "usa"
        ? 'us_states_template.csv'
        : 'countries_template.csv'
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download error log
  const downloadErrorLog = () => {
    if (errors.length === 0) return;
    let errorContent = "Line,Error Type,Message\n";
    errors.forEach((err) => {
      const escapedMsg = err.message.replace(/"/g, '""');
      errorContent += `${err.line},"${err.type}","${escapedMsg}"\n`;
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

  // Palette
// 1) Make a helper that calculates groups from ranges and data
function calculateGroups(ranges, data, rangeOrder) {
  // basically the same logic as your generateGroups():
  const validRanges = ranges.filter(
    (r) => !isNaN(r.lowerBound) && !isNaN(r.upperBound) && r.lowerBound <= r.upperBound
  );

  const sortedRanges = [...validRanges].sort((a, b) => {
    return rangeOrder === 'low-high'
      ? a.lowerBound - b.lowerBound
      : b.lowerBound - a.lowerBound;
  });

  const newGroups = sortedRanges.map((range) => ({
    ...range,
    countries: [],
    rangeLabel: range.name || `${range.lowerBound} - ${range.upperBound}`,
  }));

  data.forEach((item) => {
    const group = newGroups.find(
      (g) => item.value >= g.lowerBound && item.value <= g.upperBound
    );
    if (group) {
      group.countries.push(item);
    }
  });
  return newGroups;
}

// 2) Use the functional form inside handlePaletteChange
const handlePaletteChange = (e) => {
  const paletteName = e.target.value;
  setSelectedPalette(paletteName);

  const paletteColors = themes.find((t) => t.name === paletteName)?.colors || [];

  setCustomRanges((prevRanges) => {
    // Create new ranges with the new palette colors
    const updatedRanges = applyPalette(prevRanges, paletteColors);

    // If we already have data & valid ranges, build the groups in the same step
    if (data.length > 0 && rangesValidation.isValid) {
      // Compute new groups based on updatedRanges
      const newGroups = calculateGroups(updatedRanges, data, rangeOrder);
      // Update the groups state, so the map will re-render immediately
      setGroups(newGroups);
    }

    // Return updatedRanges as the new custom_ranges
    return updatedRanges;
  });
};

// 3) Let applyPalette be a pure function that returns new ranges
function applyPalette(oldRanges, paletteColors) {
  const numRanges = oldRanges.length;
  const numColors = paletteColors.length;
  if (numRanges === 0 || numColors === 0) {
    return oldRanges; // no change
  }

  let indices = [];
  if (numRanges === 1) {
    // Single range => pick mid color
    indices.push(Math.floor((numColors - 1) / 2));
  } else {
    // Evenly distribute colors
    const step = (numColors - 1) / (numRanges - 1);
    for (let i = 0; i < numRanges; i++) {
      indices.push(Math.round(i * step));
    }
  }

  // Return a new array of updated ranges
  return oldRanges.map((range, i) => ({
    ...range,
    color: paletteColors[indices[i]] || '#c0c0c0',
  }));
}


  // Map theme
  const handleThemeChange = (e) => {
    const themeName = e.target.value;
    setSelectedMapTheme(themeName);
    const map_theme = map_themes.find((t) => t.name === themeName);
    if (map_theme) {
      setOceanColor(map_theme.ocean_color);
      setFontColor(map_theme.font_color);
      setUnassignedColor(map_theme.unassigned_color);
    }
  };

  // Ranges
  const handleRangeChange = (id, field, value) => {
    setCustomRanges(
      custom_ranges.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const addRange = () => {
    const newRanges = [
      ...custom_ranges,
      {
        id: Date.now(),
        lowerBound: '',
        upperBound: '',
        color: '#c0c0c0',
        name: '',
      },
    ];
    const paletteColors = themes.find((t) => t.name === selected_palette)?.colors;
    if (paletteColors) {
      applyPaletteToRanges(newRanges, paletteColors);
    } else {
      setCustomRanges(newRanges);
    }
  };

  const removeRange = (id) => {
    if (custom_ranges.length > 1) {
      const newRanges = custom_ranges.filter((r) => r.id !== id);
      const paletteColors = themes.find((t) => t.name === selected_palette)?.colors;
      if (paletteColors) {
        applyPaletteToRanges(newRanges, paletteColors);
      } else {
        setCustomRanges(newRanges);
      }
    } else {
      alert("Cannot delete the last range.");
    }
  };

  // Validate ranges
  const getRangesValidationResult = () => {
    if (custom_ranges.length === 0) {
      return { isValid: false, errorMessage: 'Please define at least one range.' };
    }
    for (let r of custom_ranges) {
      if (
        isNaN(r.lowerBound) ||
        isNaN(r.upperBound) ||
        r.lowerBound > r.upperBound
      ) {
        return {
          isValid: false,
          errorMessage: 'Please ensure all ranges are valid.',
        };
      }
    }
    const sorted = [...custom_ranges].sort((a, b) => a.lowerBound - b.lowerBound);
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].upperBound > sorted[i + 1].lowerBound) {
        return {
          isValid: false,
          errorMessage: 'Ranges are overlapping. Please adjust them.',
        };
      }
    }
    return { isValid: true, errorMessage: '' };
  };
  const rangesValidation = getRangesValidationResult();
  const isGenerateGroupsDisabled = data.length === 0 || !rangesValidation.isValid;

  const generateGroups = () => {
    if (data.length === 0) {
      alert("Please upload a CSV file first.");
      return;
    }
    const validRanges = custom_ranges.filter(
      (r) => !isNaN(r.lowerBound) && !isNaN(r.upperBound) && r.lowerBound <= r.upperBound
    );
    const sortedRanges = [...validRanges].sort((a, b) => {
      if (rangeOrder === 'low-high') return a.lowerBound - b.lowerBound;
      return b.lowerBound - a.lowerBound;
    });
    const newGroups = sortedRanges.map((range) => ({
      ...range,
      countries: [],
      rangeLabel: range.name || `${range.lowerBound} - ${range.upperBound}`,
    }));
    data.forEach((item) => {
      const g = newGroups.find(
        (gr) => item.value >= gr.lowerBound && item.value <= gr.upperBound
      );
      if (g) g.countries.push(item);
    });
    setGroups(newGroups);
  };

  // Suggest Ranges
  const suggestRanges = () => {
    if (data.length === 0) {
      alert("Please upload a CSV file first.");
      return;
    }
    const values = data.map((d) => d.value).sort((a, b) => a - b);
    const suggestedRanges = [];
    if (rangeOrder === 'low-high') {
      for (let i = 0; i < numRanges; i++) {
        const lowerQ = i / numRanges;
        const upperQ = (i + 1) / numRanges;
        const lowerBound = getQuantile(values, lowerQ);
        const upperBound = getQuantile(values, upperQ);
        suggestedRanges.push({
          id: Date.now() + i,
          lowerBound: parseFloat(lowerBound.toFixed(2)),
          upperBound: parseFloat(upperBound.toFixed(2)),
          color: '#c0c0c0',
          name: '',
        });
      }
    } else {
      for (let i = 0; i < numRanges; i++) {
        const lowerQ = (numRanges - i - 1) / numRanges;
        const upperQ = (numRanges - i) / numRanges;
        const lowerBound = getQuantile(values, lowerQ);
        const upperBound = getQuantile(values, upperQ);
        suggestedRanges.push({
          id: Date.now() + i,
          lowerBound: parseFloat(lowerBound.toFixed(2)),
          upperBound: parseFloat(upperBound.toFixed(2)),
          color: '#c0c0c0',
          name: '',
        });
      }
    }
    const paletteColors = themes.find((t) => t.name === selected_palette)?.colors;
    if (paletteColors) {
      applyPaletteToRanges(suggestedRanges, paletteColors);
    } else {
      setCustomRanges(suggestedRanges);
    }
  };

  // Quantile helper
  const getQuantile = (sortedValues, q) => {
    const pos = (sortedValues.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;
    if (sortedValues[base + 1] !== undefined) {
      return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
    } else {
      return sortedValues[base];
    }
  };

  // Apply palette
  const applyPaletteToRanges = (ranges, paletteColors) => {
    const numRanges = ranges.length;
    const numColors = paletteColors.length;
    const indices = [];
    if (numRanges === 1) {
      // Single range
      indices.push(Math.floor((numColors - 1) / 2));
    } else {
      // Evenly distribute colors
      const step = (numColors - 1) / (numRanges - 1);
      for (let i = 0; i < numRanges; i++) {
        indices.push(Math.round(i * step));
      }
    }
    const newRanges = ranges.map((range, i) => ({
      ...range,
      color: paletteColors[indices[i]] || '#c0c0c0',
    }));
    setCustomRanges(newRanges);
  };

  // Tag handling
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };
  const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));

  //REFERENCESES
  function handleAddReference() {
    // Clear out any previously selected reference
    setSelectedReference(null);
    setIsReferenceModalOpen(true);
  }

  function handleEditReference(ref) {
    setSelectedReference(ref);
    setIsReferenceModalOpen(true);
  }

  function handleEditReference(ref) {
    setSelectedReference(ref);
    setTempSourceName(ref.sourceName);
    setTempPublicator(ref.publicator || '');
    setTempYear(ref.publicationYear);
    setTempUrl(ref.url);
    setTempNotes(ref.notes || '');
    setIsReferenceModalOpen(true);
  }

  function handleAddReference() {
    setSelectedReference(null);
    setTempSourceName('');
    setTempPublicator('');
    setTempYear('');
    setTempUrl('');
    setTempNotes('');
    setIsReferenceModalOpen(true);
  }

  function handleSaveReference() {
    if (!tempSourceName.trim() || !tempYear.trim()) {
      alert("Source Name and Publication Year are required.");
      return;
    }
  
    if (selectedReference) {
      // Editing existing reference
      const updated = references.map((r) =>
        r === selectedReference
          ? {
              ...r,
              sourceName: tempSourceName,
              publicationYear: tempYear,
              publicator: tempPublicator,
              url: tempUrl,
              notes: tempNotes,
            }
          : r
      );
      setReferences(updated);
    } else {
      // Creating new
      const newRef = {
        id: Date.now(),  // or use a library like uuid
        sourceName: tempSourceName,
        publicator: tempPublicator,
        publicationYear: tempYear,
        url: tempUrl,
        notes: tempNotes,
      };
      setReferences([...references, newRef]);
    }
  
    // Close modal
    setIsReferenceModalOpen(false);
  }

  function handleDeleteReference() {
    if (!selectedReference) return; // Shouldn't happen unless there's no reference
    
    // Confirm
    if (window.confirm("Are you sure you want to delete this reference?")) {
      // Remove from the references array
      setReferences((prev) => prev.filter((r) => r !== selectedReference));
      // Close the modal
      setIsReferenceModalOpen(false);
    }
  }
  
  
  
  


  // Save map
  const handleSaveMap = () => {
    // If not logged in, show login. For now, we do it directly.
    if (true) {
      saveMapData();
    } else {
      setShowLoginModal(true);
    }
  };

  const saveMapData = async () => {
    const mapData = {
      id: isEditing ? existingMapData.id : Date.now(),
      title: mapTitle || '',
      description,
      tags,
      is_public,
      data,
      custom_ranges,
      groups,
      selected_map,
      ocean_color,
      unassigned_color,
      font_color,
      show_top_high_values,
      show_top_low_values,
      show_top_high_values,
      top_low_values,
      selected_palette,
      selected_map_theme,
      file_name,
      file_stats,
      is_title_hidden,
      sources: references,
    };
    try {
      if (isEditing) {
        await updateMap(existingMapData.id, mapData);
      } else {
        await createMap(mapData);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      <div
        className={`${styles.content} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >
        <Header 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        />

        <div className={styles.contentInner}>

          {/* TOP ROW: 3 Boxes */}
          <div className={styles.topThreeBoxes}>
            {/* INSTRUCTIONS BOX */}
            <div className={styles.instructionsBox}>
              <h3>Instructions</h3>
              <p style={{ textAlign: 'center' }}>
                Selected Map:{' '}
                <strong>
                  {selected_map === 'world'
                    ? 'World'
                    : selected_map === 'europe'
                    ? 'Europe'
                    : 'USA'}
                </strong>
              </p>
              <button
                className={styles.templateButton}
                onClick={downloadTemplate}
              >
                Download Template
              </button>
              <p className={styles.instructionText}>
                Please ensure your CSV file has exactly 2 columns:
                <br />
                1) <em>Country/State Name</em>
                <br />
                2) <em>Value</em>
                <br />
                No value can be left empty.
              </p>
              <p className={styles.instructionText}>
                Example:
                <pre className={styles.csvExample}>
                  State1,Value1{'\n'}
                  State2,Value2{'\n'}
                  ...
                </pre>
              </p>
              <p className={styles.instructionText}>
                Check out our <a href="/docs" target="_blank" rel="noreferrer">documentation</a> for more details.
              </p>
            </div>

            {/* CSV UPLOAD BOX */}
            <div className={styles.csvUploadBox}>
              <h3>Upload Your CSV</h3>
              <label
                htmlFor="csvFileInput"
                className={styles.csvIconLabel}
                title="Click to browse CSV file"
              >
                <FontAwesomeIcon icon={faFileCsv} className={styles.bigCsvIcon} />
              </label>
              <input
                id="csvFileInput"
                type="file"
                accept=".csv"
                className={styles.csvHiddenInput}
                onChange={handleFileUpload}
              />

              <div className={styles.uploadStatus}>
                {file_name ? (
                  <p className={styles.file_nameLabel}>{file_name}</p>
                ) : (
                  <p className={styles.noFileSelected}>No file selected</p>
                )}

                {file_name && fileIsValid === true && (
                  <p className={styles.validMessage}>File is valid</p>
                )}
                {file_name && fileIsValid === false && (
                  <p className={styles.invalidMessage}>File is not valid</p>
                )}
                {!file_name && (
                  <p className={styles.noFileMessage}>No file selected.</p>
                )}
              </div>

              {/* Errors (scrollable) */}
              {errors.length > 0 && (
                <div className={styles.errorBoxScrollable}>
                  <p className={styles.errorTitle}>
                    {`There are ${errors.length} error${errors.length > 1 ? 's' : ''}:`}
                  </p>
                  <ul className={styles.errorList}>
                    {errors.map((err, i) => (
                      <li key={i}>
                        <strong>Line {err.line}:</strong> {err.message}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={styles.downloadErrorButton}
                    onClick={downloadErrorLog}
                  >
                    Download Error Log
                  </button>
                </div>
              )}
            </div>

            {/* FILE INFO BOX / TABLE */}
            <div className={styles.fileInfoBox}>
              <div className={styles.tableContainer}>
                <table className={styles.fileInfoTable}>
                  <tbody>
                    <tr>
                      <th>File Name</th>
                      <td>{file_name || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Lowest Value</th>
                      <td>
                        {file_stats.lowestValue !== null
                          ? file_stats.lowestValue
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <th>State (Lowest)</th>
                      <td>{file_stats.lowestCountry || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Highest Value</th>
                      <td>
                        {file_stats.highestValue !== null
                          ? file_stats.highestValue
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <th>State (Highest)</th>
                      <td>{file_stats.highestCountry || 'N/A'}</td>
                    </tr>
                    <tr>
                      <th>Average Value</th>
                      <td>
                        {file_stats.averageValue !== null
                          ? file_stats.averageValue
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <th>Median Value</th>
                      <td>
                        {file_stats.medianValue !== null
                          ? file_stats.medianValue
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <th>Standard Deviation</th>
                      <td>
                        {file_stats.standardDeviation !== null
                          ? file_stats.standardDeviation
                          : 'N/A'}
                      </td>
                    </tr>
                    <tr>
                      <th>Values Count</th>
                      <td>{file_stats.numberOfValues}</td>
                    </tr>
                    <tr>
                      <th>Total Countries</th>
                      <td>{file_stats.totalCountries}</td>
                    </tr>
                    <tr>
                      <th>Data Completeness (%)</th>
                      <td>{dataCompleteness}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RANGE TABLE */}
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
                {custom_ranges.map((range) => (
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
                        onChange={(e) =>
                          handleRangeChange(range.id, 'name', e.target.value)
                        }
                        placeholder="Name"
                      />
                    </td>
                    <td>
                      <input
                        type="color"
                        className={styles.inputBox}
                        value={range.color}
                        onChange={(e) =>
                          handleRangeChange(range.id, 'color', e.target.value)
                        }
                      />
                    </td>
                    <td>
                      {custom_ranges.length > 1 ? (
                        <button
                          className={styles.removeButton}
                          onClick={() => removeRange(range.id)}
                        >
                          &times;
                        </button>
                      ) : (
                        <button className={styles.removeButton} disabled>
                          &times;
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.rangeControls}>
              <div className={styles.leftControls}>
                <label htmlFor="numRanges" title="Select total ranges">
                  Ranges:
                </label>
                <select
                  id="numRanges"
                  className={styles.inputBox}
                  value={numRanges}
                  onChange={(e) => setNumRanges(parseInt(e.target.value))}
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>

                <select
                  id="rangeOrder"
                  className={styles.inputBox}
                  value={rangeOrder}
                  onChange={(e) => setRangeOrder(e.target.value)}
                >
                  <option value="low-high">Low to High</option>
                  <option value="high-low">High to Low</option>
                </select>

                <button
                  className={styles.secondaryButton}
                  onClick={suggestRanges}
                  disabled={data.length === 0}
                >
                  Suggest Ranges
                </button>

                <button className={styles.secondaryButton} onClick={addRange}>
                  Add Range
                </button>

                <button
                  className={styles.primaryButton}
                  onClick={generateGroups}
                  disabled={data.length === 0 || !rangesValidation.isValid}
                >
                  Generate Groups
                </button>

                {(!rangesValidation.isValid || data.length === 0) && (
                  <p className={styles.errorMessage}>
                    <img
                      className={styles.warningIcon}
                      src={`${process.env.PUBLIC_URL}/assets/warning_icon.png`}
                      alt="Warning"
                    />
                    {data.length === 0
                      ? 'Please upload a CSV file first.'
                      : rangesValidation.errorMessage}
                  </p>
                )}
              </div>
            </div>
          </div>

{/* MAP PREVIEW & THEME + MAP INFO */}
<div className={styles.mapLayoutContainer}>
  {/* LEFT COLUMN: MAP PREVIEW + THEME */}
  <div className={styles.leftColumn}>

    {/* MAP PREVIEW */}
    <div className={styles.mapPreviewBox}>
      <h4 className={styles.mapBoxHeader}>Map Preview</h4>
      <div className={styles.mapPreviewWrapper}>
        {selected_map === 'world' && (
          <WorldMapSVG
            groups={groups}
            mapTitleValue={mapTitle}
            ocean_color={ocean_color}
            unassigned_color={unassigned_color}
            show_top_high_values={show_top_high_values}
            show_top_low_values={show_top_low_values}
            data={data}
            selected_map={selected_map}
            font_color={font_color}
            topHighValues={topHighValues}
            top_low_values={top_low_values}
            isLargeMap={false}
            is_title_hidden={is_title_hidden}
          />
        )}
        {selected_map === 'usa' && (
          <UsSVG
          groups={groups}
          mapTitleValue={mapTitle}
          ocean_color={ocean_color}
          unassigned_color={unassigned_color}
          show_top_high_values={show_top_high_values}
          show_top_low_values={show_top_low_values}
          data={data}
          selected_map={selected_map}
          font_color={font_color}
          topHighValues={topHighValues}
          top_low_values={top_low_values}
          isLargeMap={false}
          is_title_hidden={is_title_hidden}
          />
        )}
        {selected_map === 'europe' && (
          <EuropeSVG
          groups={groups}
          mapTitleValue={mapTitle}
          ocean_color={ocean_color}
          unassigned_color={unassigned_color}
          show_top_high_values={show_top_high_values}
          show_top_low_values={show_top_low_values}
          data={data}
          selected_map={selected_map}
          font_color={font_color}
          topHighValues={topHighValues}
          top_low_values={top_low_values}
          isLargeMap={false}
          is_title_hidden={is_title_hidden}
          />
        )}
      </div>
    </div>

    {/* MAP THEME */}
    <div className={styles.mapThemeBox}>
      <h4 className={styles.mapBoxHeader}>Map Theme</h4>
      <div className={styles.themeSettingsBox}>
        {/* 1) Palette */}
        <div className={styles.themeField}>
          <label htmlFor="paletteSelector">Palette:</label>
          <select
            id="paletteSelector"
            className={styles.inputBox}
            value={selected_palette}
            onChange={handlePaletteChange}
          >
            {themes.map((theme) => (
              <option key={theme.name} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
          <div className={styles.themePreview}>
            {themes
              .find((t) => t.name === selected_palette)
              ?.colors.map((color, idx) => (
                <div
                  key={idx}
                  className={styles.themeColor}
                  style={{ backgroundColor: color }}
                />
              ))}
          </div>
        </div>

        {/* 2) Map Theme (dropdown) */}
        <div className={styles.themeField}>
          <label>Map Theme:</label>
          <select
            id="map_themeSelector"
            className={`${styles.inputBox} ${styles.map_themeSelector}`}
            value={selected_map_theme}
            onChange={handleThemeChange}
          >
            {map_themes.map((theme) => (
              <option key={theme.name} value={theme.name}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3) Font Color */}
        <div className={styles.themeField}>
          <label>Font Color:</label>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                value="black"
                checked={font_color === 'black'}
                onChange={(e) => setFontColor(e.target.value)}
              />
              Black
            </label>
            <label>
              <input
                type="radio"
                value="white"
                checked={font_color === 'white'}
                onChange={(e) => setFontColor(e.target.value)}
              />
              White
            </label>
          </div>
        </div>

        {/* 4) Ocean Color */}
        <div className={styles.themeField}>
          <label htmlFor="ocean_color">Ocean Color:</label>
          <input
            id="ocean_color"
            type="color"
            className={styles.colorInputBox}
            value={ocean_color}
            onChange={(e) => setOceanColor(e.target.value)}
          />
        </div>

        {/* 5) Unassigned Color */}
        <div className={styles.themeField}>
          <label htmlFor="unassigned_color">Unassigned Color:</label>
          <input
            id="unassigned_color"
            type="color"
            className={styles.colorInputBox}
            value={unassigned_color}
            onChange={(e) => setUnassignedColor(e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>

  {/* RIGHT COLUMN: MAP INFO */}
  <div className={styles.rightColumn}>
    <div className={styles.mapInfoBox}>
      <h4 className={styles.mapBoxHeader}>Map Info</h4>

      {/* Title + Hide checkbox */}
      <div className={styles.settingItemRow}>
        <label htmlFor="mapTitleInput">Map Title:</label>
        <input
          id="mapTitleInput"
          type="text"
          className={styles.inputBox}
          style={{ width: '220px' }}
          value={mapTitle}
          onChange={(e) => setMapTitle(e.target.value)}
          placeholder="Enter map title"
          maxLength="40"
        />
        <label className={styles.hideTitleLabel}>
          <input
            type="checkbox"
            checked={is_title_hidden}
            onChange={(e) => setIsTitleHidden(e.target.checked)}
          />
          Hide
        </label>
      </div>

      {/* Description */}
      <div className={styles.settingItem}>
        <label htmlFor="descriptionInput">Description:</label>
        <textarea
          id="descriptionInput"
          className={`${styles.inputBox} ${styles.descriptionInput}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>

{/* Tags */}
<div className={styles.settingItem}>
  <label htmlFor="tagsInput">Tags:</label>
  <input
    id="tagsInput"
    type="text"
    className={styles.inputBox}
    value={tagInput}
    onChange={(e) => {
      // Remove spaces from the input value
      const value = e.target.value.replace(/\s/g, '');
      setTagInput(value);
    }}
    onKeyDown={(e) => {
      // Prevent space key from being entered
      if (e.key === ' ') {
        e.preventDefault();
      } else {
        handleTagInputKeyDown(e);
      }
    }}
    onPaste={(e) => {
      // Prevent pasting spaces into the input
      e.preventDefault();
      const paste = e.clipboardData.getData('text').replace(/\s/g, '');
      setTagInput(paste);
    }}
    placeholder="Type a tag and press Enter"
    maxLength="20"
  />
  <div className={styles.tagBox}>
    {tags.map((tag, i) => (
      <div key={i} className={styles.tagItem}>
        {tag}
        <button
          className={styles.removeTagButton}
          onClick={() => removeTag(i)}
          aria-label={`Remove tag ${tag}`}
        >
          &times;
        </button>
      </div>
    ))}
  </div>
</div>

      {/* References */}
      <div className={styles.settingItem}>
        <label>References:</label>
        <button
          className={styles.secondaryButton}
          onClick={handleAddReference}
          style={{ marginBottom: '10px' }}
        >
          + Add Reference
        </button>

        <div className={styles.referencesList}>
          {references.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#777' }}>No references added.</p>
          ) : (
            references.map((ref) => (
              <div
                key={ref.id}
                className={styles.referenceItem}
                onClick={() => handleEditReference(ref)}
                title="Click to edit reference"
              >
                {ref.sourceName} ({ref.publicationYear})
              </div>
            ))
          )}
        </div>
      </div>

      {/* Visibility */}
      <div className={styles.settingItem}>
        <label>Visibility:</label>
        <div
          className={styles.customSelect}
          onClick={() => setShowVisibilityOptions(!showVisibilityOptions)}
        >
          <FontAwesomeIcon
            icon={is_public ? faGlobe : faLock}
            className={styles.visibilityIcon}
          />
          {is_public ? 'Public' : 'Private'}
          <FontAwesomeIcon icon={faCaretDown} className={styles.selectArrow} />
          {showVisibilityOptions && (
            <div className={styles.selectOptions}>
              <div
                className={styles.selectOption}
                onClick={() => {
                  setIsPublic(true);
                  setShowVisibilityOptions(false);
                }}
              >
                <FontAwesomeIcon icon={faGlobe} className={styles.visibilityIcon} />
                Public
              </div>
              <div
                className={styles.selectOption}
                onClick={() => {
                  setIsPublic(false);
                  setShowVisibilityOptions(false);
                }}
              >
                <FontAwesomeIcon icon={faLock} className={styles.visibilityIcon} />
                Private
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className={styles.navigationButtons}>
        <button className={styles.primaryButton} onClick={handleSaveMap}>
          Save Map
        </button>
      </div>
    </div>
  </div>
</div>

              
          {isReferenceModalOpen && (
  <div
    className={styles.modalOverlay}
    onClick={() => setIsReferenceModalOpen(false)}
  >
    <div
      className={styles.modalContent}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={styles.closeButton}
        onClick={() => setIsReferenceModalOpen(false)}
      >
        &times;
      </button>

      <h2>{selectedReference ? 'Edit Reference' : 'Add Reference'}</h2>

      <div className={styles.modalFormRow}>
        <label>Source Name:</label>
        <input
          type="text"
          value={tempSourceName}
          onChange={(e) => setTempSourceName(e.target.value)}
        />
      </div>

      <div className={styles.modalFormRow}>
        <label>Publication Year:</label>
        <input
          type="text"
          value={tempYear}
          onChange={(e) => setTempYear(e.target.value)}
        />
      </div>

      <div className={styles.modalFormRow}>
           <label>Publisher:</label>
           <input
             type="text"
             value={tempPublicator}
             onChange={(e) => setTempPublicator(e.target.value)}
           />
        </div>


        <div className={styles.modalFormRow}>
          <label>URL or Link:</label>
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            onBlur={() => {
              // If the URL doesn't start with http:// or https://, add "https://www."
              if (tempUrl && !/^https?:\/\//i.test(tempUrl)) {
                setTempUrl(`https://www.${tempUrl}`);
              }
            }}
          />
        </div>


      <div className={styles.modalFormRow}>
        <label>Description/Notes:</label>
        <textarea
          rows={3}
          value={tempNotes}
          onChange={(e) => setTempNotes(e.target.value)}
        />
      </div>

      {/* Container for bottom row (Save on right, Delete on left) */}
      <div className={styles.modalBottomRow}>
        {/* Only show “Delete Reference” if editing an existing reference */}
        {selectedReference && (
          <span
            className={styles.deleteRefLink}
            onClick={handleDeleteReference}
          >
            Delete Reference
          </span>
        )}
        
        <button
          className={styles.primaryButton}
          onClick={handleSaveReference}
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}





          {/* Login Modal */}
          {showLoginModal && (
            <div
              className={styles.modalOverlay}
              onClick={() => setShowLoginModal(false)}
            >
              <div
                className={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className={styles.closeButton}
                  onClick={() => setShowLoginModal(false)}
                >
                  &times;
                </button>
                <h2>Don't Lose Your Progress!</h2>
                <p>Please log in or sign up to save your map.</p>
                <div className={styles.modalButtons}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => {
                      window.location.href = '/login';
                    }}
                  >
                    Log In
                  </button>
                  <button
                    className={styles.primaryButton}
                    onClick={() => {
                      window.location.href = '/signup';
                    }}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}