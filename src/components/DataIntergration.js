/* DataIntegration.js */
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
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
import { faGlobe, faLock, faCaretDown, faCog } from '@fortawesome/free-solid-svg-icons';
import Header from "./Header";


// Define preloaded color themes
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


  // Define preloaded map themes
  const mapThemes = [
    {
      name: 'Default',
      oceanColor: '#ffffff',
      fontColor: 'black',
      unassignedColor: '#c0c0c0',
    },
    {
      name: 'Muted Twilight',
      oceanColor: '#3D3846',
      fontColor: 'white',
      unassignedColor: '#5E5C64',
    },
    {
      name: 'Oceanic',
      oceanColor: '#006994',
      fontColor: 'white',
      unassignedColor: '#004c70',
    },
    {
      name: 'Polar Ice',
      oceanColor: '#E0F7FA', // Light blue ocean
      fontColor: 'black',
      unassignedColor: '#ffffff', // White unassigned areas
    },
    {
      name: 'Vintage Sepia',
      oceanColor: '#704214', // Brown ocean for an old map look
      fontColor: 'white',
      unassignedColor: '#D2B48C', // Tan unassigned areas
    },
    {
      name: 'Midnight Blue',
      oceanColor: '#191970', // Dark blue ocean
      fontColor: 'white',
      unassignedColor: '#2F4F4F', // Dark slate gray unassigned areas
    },
    {
      name: 'Emerald Isles',
      oceanColor: '#50C878', // Emerald green ocean
      fontColor: 'black',
      unassignedColor: '#98FB98', // Pale green unassigned areas
    },
    {
      name: 'Desert Sand',
      oceanColor: '#EDC9AF', // Sand-colored ocean
      fontColor: 'black',
      unassignedColor: '#C2B280', // Light brown unassigned areas
    },
    {
      name: 'Fire and Ice',
      oceanColor: '#1E90FF', // Dodger blue ocean
      fontColor: 'white',
      unassignedColor: '#FF4500', // Orange-red unassigned areas
    },
    {
      name: 'Deep Space',
      oceanColor: '#000000', // Black ocean
      fontColor: 'white',
      unassignedColor: '#2E2E2E', // Dark gray unassigned areas
    },
    {
      name: 'Pastel Dreams',
      oceanColor: '#FFB6C1', // Light pink ocean
      fontColor: 'black',
      unassignedColor: '#FFDAB9', // Peach puff unassigned areas
    },
    {
      name: 'Sunset Glow',
      oceanColor: '#FFA07A', // Light salmon ocean
      fontColor: 'black',
      unassignedColor: '#FF6347', // Tomato unassigned areas
    },
    {
      name: 'Forest Green',
      oceanColor: '#228B22', // Forest green ocean
      fontColor: 'white',
      unassignedColor: '#6B8E23', // Olive drab unassigned areas
    },
  ];


export default function DataIntegration({

  existingMapData = null,
  isEditing = false,
  isCollapsed,
  setIsCollapsed
}) {

 

  const location = useLocation();
  const [selectedMap, setSelectedMap] = useState(
    existingMapData ? existingMapData.selectedMap : location.state?.selectedMap || 'world'
  );
  // Initialize state with existing map data if editing
  useEffect(() => {
    if (existingMapData) {
      setFileName(existingMapData.fileName);
      setFileStats(existingMapData.fileStats);
      setMapTitle(existingMapData.title);
      setData(existingMapData.data);
      setCustomRanges(existingMapData.customRanges);
      setGroups(existingMapData.groups);
      setSelectedMap(existingMapData.selectedMap);
      setOceanColor(existingMapData.oceanColor);
      setUnassignedColor(existingMapData.unassignedColor);
      setFontColor(existingMapData.fontColor);
      setShowTopHighValues(existingMapData.showTopHighValues);
      setShowTopLowValues(existingMapData.showTopLowValues);
      setTopHighValues(existingMapData.topHighValues);
      setTopLowValues(existingMapData.topLowValues);
      setSelectedPalette(existingMapData.selectedPalette);
      setSelectedMapTheme(existingMapData.selectedMapTheme);
      setDescription(existingMapData.description || '');
      setTags(existingMapData.tags || []);
      setIsPublic(existingMapData.isPublic || false);
      setIsTitleHidden(existingMapData.isTitleHidden || false);
    }
  }, [existingMapData]);


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

  const [rangeOrder, setRangeOrder] = useState('low-high'); // Default to 'low-high'

  const [showLoginModal, setShowLoginModal] = useState(false);


  // File information
  const [fileName, setFileName] = useState('');
  const [ fileIsValid, setFileIsValid ] = useState(null)
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

  // Map settings
  const [mapTitle, setMapTitle] = useState('');
  const [oceanColor, setOceanColor] = useState('#ffffff'); // Default ocean color
  const [unassignedColor, setUnassignedColor] = useState('#c0c0c0'); // Default unassigned color
  const [showTopHighValues, setShowTopHighValues] = useState(false);
  const [showTopLowValues, setShowTopLowValues] = useState(false);
  const [fontColor, setFontColor] = useState('black'); // Default to black font color
  const [topHighValues, setTopHighValues] = useState([]);
  const [topLowValues, setTopLowValues] = useState([]);

  // State for selected color palette
const [selectedPalette, setSelectedPalette] = useState('None'); // Default palette

// State for selected map theme
const [selectedMapTheme, setSelectedMapTheme] = useState('Default'); // Default map theme




  const [isPopupOpen, setIsPopupOpen] = useState(false);





  // State variables to store dataSource and validData
  const [dataSource, setDataSource] = useState([]);
  const [validData, setValidData] = useState([]);
  const [missingCountries, setMissingCountries] = useState([]);

  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);

  const [isPublic, setIsPublic] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);


  const [isTitleHidden, setIsTitleHidden] = useState(false);

  // State for error messages
  const [errors, setErrors] = useState([]);

  let updateState = (event) => {
    console.log(event.detail);
  };

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

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  useEffect(() => {
    if (isPopupOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isPopupOpen]);


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name); // Set the file name
    setFileIsValid(null);

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
      setFileIsValid(false)
    } else {
      setErrors([]);
      setFileIsValid(true)
    }
  
    setData(parsedData);
    setDataSource(dataSourceLocal);
    setValidData(parsedData);
    
        // After parsing the data and before computing statistics
    // Sort the data in descending order for highest values
    const sortedDataDesc = [...parsedData].sort((a, b) => b.value - a.value);

    // Assign ranks (descending order)
    sortedDataDesc.forEach((item, index) => {
      item.rankDesc = index + 1; // Rank starts from 1
    });

    // Sort the data in ascending order for lowest values
    const sortedDataAsc = [...parsedData].sort((a, b) => a.value - b.value);

    // Assign ranks (ascending order)
    sortedDataAsc.forEach((item, index) => {
      item.rankAsc = index + 1; // Rank starts from 1
    });



  
    // Compute statistics if there are no errors
    if (parsedData.length > 0 && errorList.length === 0) {

    // Compute top high and low values with ranks
    const topHighValuesLocal = sortedDataDesc.slice(0, Math.min(3, sortedDataDesc.length));
    const topLowValuesLocal = sortedDataAsc.slice(0, Math.min(3, sortedDataAsc.length));

    // Update state
    setTopHighValues(topHighValuesLocal);
    setTopLowValues(topLowValuesLocal);


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

      setTopHighValues([]);
      setTopLowValues([]);
    }
  };
  

  const handlePaletteChange = (e) => {
    const paletteName = e.target.value;
    setSelectedPalette(paletteName);
    const paletteColors = themes.find((theme) => theme.name === paletteName)?.colors;
    if (paletteColors) {
      applyPaletteToRanges(customRanges, paletteColors); // Apply the color palette to the current ranges
    }
  };
  
  

  const handleThemeChange = (e) => {
    const themeName = e.target.value;
    setSelectedMapTheme(themeName);
    const mapTheme = mapThemes.find((theme) => theme.name === themeName);
    if (mapTheme) {
      // Update the map settings based on the selected theme
      setOceanColor(mapTheme.oceanColor);
      setFontColor(mapTheme.fontColor);
      setUnassignedColor(mapTheme.unassignedColor);
    }
  };
  



  


  const addRange = () => {
    const newRanges = [
      ...customRanges,
      {
        id: Date.now(),
        lowerBound: '',
        upperBound: '',
        color: '#c0c0c0',
        name: '',
      },
    ];
  
    // Apply palette to new ranges
    const paletteColors = themes.find((theme) => theme.name === selectedPalette)?.colors;
    if (paletteColors) {
      applyPaletteToRanges(newRanges, paletteColors);
    } else {
      setCustomRanges(newRanges);
    }
  };
  

  const removeRange = (id) => {
    if (customRanges.length > 1) {
      const newRanges = customRanges.filter((range) => range.id !== id);
      setCustomRanges(newRanges);
  
      // Apply palette to new ranges
      const paletteColors = themes.find((theme) => theme.name === selectedPalette)?.colors;
      if (paletteColors) {
        applyPaletteToRanges(newRanges, paletteColors);
      } else {
        setCustomRanges(newRanges);
      }
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
  const getRangesValidationResult = () => {
    if (customRanges.length === 0) {
      return {
        isValid: false,
        errorMessage: 'Please define at least one range.',
      };
    }
  
    // Ensure all ranges have valid lower and upper bounds
    for (let range of customRanges) {
      if (
        isNaN(range.lowerBound) ||
        isNaN(range.upperBound) ||
        range.lowerBound > range.upperBound
      ) {
        return {
          isValid: false,
          errorMessage: 'Please ensure all ranges are valid.',
        };
      }
    }
  
    // Check for overlapping ranges
    const sortedRanges = [...customRanges].sort((a, b) => a.lowerBound - b.lowerBound);
    for (let i = 0; i < sortedRanges.length - 1; i++) {
      if (sortedRanges[i].upperBound > sortedRanges[i + 1].lowerBound) {
        return {
          isValid: false,
          errorMessage: 'Ranges are overlapping. Please adjust them.',
        };
      }
    }
  
    return {
      isValid: true,
      errorMessage: '',
    };
  };
  
  
  const rangesValidation = getRangesValidationResult();
  const isGenerateGroupsDisabled = data.length === 0 || !rangesValidation.isValid;

  

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
  
    // Ensure validRanges are sorted based on rangeOrder
    const sortedRanges = [...validRanges].sort((a, b) => {
      if (rangeOrder === 'low-high') {
        return a.lowerBound - b.lowerBound;
      } else {
        return b.lowerBound - a.lowerBound;
      }
    });
  
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
  
    const values = data.map((d) => d.value).sort((a, b) => a - b);
    const numValues = values.length;
    const suggestedRanges = [];
  
    if (rangeOrder === 'low-high') {
      // Generate ranges from low to high
      for (let i = 0; i < numRanges; i++) {
        const lowerQuantile = i / numRanges;
        const upperQuantile = (i + 1) / numRanges;
  
        const lowerBound = getQuantile(values, lowerQuantile);
        const upperBound = getQuantile(values, upperQuantile);
  
        suggestedRanges.push({
          id: Date.now() + i,
          lowerBound: parseFloat(lowerBound.toFixed(2)),
          upperBound: parseFloat(upperBound.toFixed(2)),
          color: '#c0c0c0',
          name: '',
        });
      }
    } else {
      // Generate ranges from high to low
      for (let i = 0; i < numRanges; i++) {
        const lowerQuantile = (numRanges - i - 1) / numRanges;
        const upperQuantile = (numRanges - i) / numRanges;
  
        const lowerBound = getQuantile(values, lowerQuantile);
        const upperBound = getQuantile(values, upperQuantile);
  
        suggestedRanges.push({
          id: Date.now() + i,
          lowerBound: parseFloat(lowerBound.toFixed(2)),
          upperBound: parseFloat(upperBound.toFixed(2)),
          color: '#c0c0c0',
          name: '',
        });
      }
    }
  
    // Apply palette to suggested ranges
    const paletteColors = themes.find((theme) => theme.name === selectedPalette)?.colors;
    if (paletteColors) {
      applyPaletteToRanges(suggestedRanges, paletteColors, rangeOrder);
    } else {
      setCustomRanges(suggestedRanges);
    }
  };
  

  

  const applyPaletteToRanges = (ranges, paletteColors) => {
    const numRanges = ranges.length;
    const numColors = paletteColors.length;
  
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
    const newRanges = ranges.map((range, index) => ({
      ...range,
      color: paletteColors[indices[index]] || '#c0c0c0', // Fallback color
    }));
  
    setCustomRanges(newRanges);
  };
  
  
  
  
  // Helper function to calculate quantiles
  const getQuantile = (sortedValues, quantile) => {
    const pos = (sortedValues.length - 1) * quantile;
    const base = Math.floor(pos);
    const rest = pos - base;
  
    if ((sortedValues[base + 1] !== undefined)) {
      return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]);
    } else {
      return sortedValues[base];
    }
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

  const navigate = useNavigate();

  const handleSaveMap = () => {
    if (true) {
      if (!isEditing) {
        // Show the settings modal
        setShowSettingsModal(true);
      } else {
        // Save directly when editing
        saveMapData();
      }
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
      isPublic,
      data: data,
      customRanges: customRanges,
      groups: groups,
      selectedMap: selectedMap,
      oceanColor: oceanColor,
      unassignedColor: unassignedColor,
      fontColor: fontColor,
      showTopHighValues: showTopHighValues,
      showTopLowValues: showTopLowValues,
      topHighValues: topHighValues,
      topLowValues: topLowValues,
      selectedPalette: selectedPalette,
      selectedMapTheme: selectedMapTheme,
      fileName: fileName,
      fileStats: fileStats,
      isTitleHidden
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
  
  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  
  
  

  return (
    <div className={styles.container}>

      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
     
      {/* Main Content */}
      <div
        className={`${styles.content} ${
          isCollapsed ? styles.contentCollapsed : ''
        }`}
      >

         {/* Header Section */}
     <Header
            title="Data intergration"
            
          />

<div className={styles.contentInner}>


      <div className={styles.topSection}>
  {/* File Upload Box */}
  <div className={styles.fileUploadBox}>
    <h3>Upload CSV File</h3>
    <p>
      Selected Map: <b>{selectedMap === 'world' ? 'World Map' : selectedMap === 'europe' ? 'Europe' : 'USA'}</b> 
      
    </p>
    
        <button className={styles.secondaryButton} onClick={downloadTemplate}>Download Template</button>

    
   
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

    <input className={styles.fileInput} type="file" accept=".csv" onChange={handleFileUpload} />

   {/* File Upload Status */}
    {fileName !== '' ? (
      fileIsValid === true ? (
        <p className={styles.validMessage}>File is valid</p>
      ) : fileIsValid === false ? (
        <p className={styles.invalidMessage}>File is not valid</p>
      ) : null
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

{/* Number of Ranges Select Input, Suggest Ranges Button, Add Range Button, Generate Groups Button, and Theme Selector */}
<div className={styles.rangeControls}>
  <div className={styles.leftControls}>
    <label htmlFor="numRanges" title="Select the total number of ranges you want to define">
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

{/* Range Order Selector */}
<div className={styles.rangeOrderSelector}>
  <select
    id="rangeOrder"
    className={styles.inputBox}
    value={rangeOrder}
    onChange={(e) => setRangeOrder(e.target.value)}
  >
    <option value="low-high">Low to High</option>
    <option value="high-low">High to Low</option>
  </select>
</div>

    
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
      disabled={isGenerateGroupsDisabled}
    >
      Generate Groups
    </button>


     {/* Error Message */}


    {isGenerateGroupsDisabled && (
      
      <p className={styles.errorMessage}>
        <img className={styles.warningIcon} src={`${process.env.PUBLIC_URL}/assets/warning_icon.png`} alt="Warning Icon" />

        
        {data.length === 0
          ? 'Please upload a CSV file first.'
          : rangesValidation.errorMessage}
      </p>
    )}
  </div>

{/* Palette Selector */}
<div className={styles.themeSelectorContainer}>
  <label htmlFor="paletteSelector">Palette:</label>
  <select
    id="paletteSelector"
    className={styles.inputBox}
    value={selectedPalette}
    onChange={handlePaletteChange}
  >
    {themes.map((theme, index) => (
      <option key={index} value={theme.name}>
        {theme.name}
      </option>
    ))}
  </select>
  {/* Display the color pattern of the selected palette */}
  <div className={styles.themePreview}>
    {themes.find((theme) => theme.name === selectedPalette)?.colors.map((color, idx) => (
      <div
        key={idx}
        className={styles.themeColor}
        style={{ backgroundColor: color }}
      ></div>
    ))}
  </div>
</div>
</div>
{/* Map Theme Container */}
<div className={styles.mapThemeContainer}>
  {/* Map Preview Section */}
  <div className={styles.mapPreviewSection}>
    <div className={styles.mapPreviewContainer}>
      <div onClick={togglePopup} className={styles.mapPreviewWrapper}>
        {selectedMap === 'world' && (
          <WorldMapSVG
            groups={groups}
            mapTitleValue={mapTitle}
            oceanColor={oceanColor}
            unassignedColor={unassignedColor}
            showTopHighValues={showTopHighValues}
            showTopLowValues={showTopLowValues}
            data={data}
            selectedMap={selectedMap}
            fontColor={fontColor}
            topHighValues={topHighValues}
            topLowValues={topLowValues}
            isLargeMap={false}
            isTitleHidden={isTitleHidden}
          />
        )}
        {selectedMap === 'usa' && (
          <UsSVG
          groups={groups}
          mapTitleValue={mapTitle}
          oceanColor={oceanColor}
          unassignedColor={unassignedColor}
          showTopHighValues={showTopHighValues}
          showTopLowValues={showTopLowValues}
          data={data}
          selectedMap={selectedMap}
          fontColor={fontColor}
          topHighValues={topHighValues}
          topLowValues={topLowValues}
          isLargeMap={false}
          isTitleHidden={isTitleHidden}
          />
        )}
        {selectedMap === 'europe' && (
          <EuropeSVG
          groups={groups}
          mapTitleValue={mapTitle}
          oceanColor={oceanColor}
          unassignedColor={unassignedColor}
          showTopHighValues={showTopHighValues}
          showTopLowValues={showTopLowValues}
          data={data}
          selectedMap={selectedMap}
          fontColor={fontColor}
          topHighValues={topHighValues}
          topLowValues={topLowValues}
          isLargeMap={false}
          isTitleHidden={isTitleHidden}
          />
        )}
      </div>
    </div>
  </div>

  {/* Map Theme Section */}
  <div className={styles.mapThemeSection}>
    <h3>Map Theme</h3>
    <div className={styles.mapThemeSettings}>
      {/* Map Theme Selector */}
      <div className={styles.settingItem}>
        <select
          id="mapThemeSelector"
          className={`${styles.inputBox} ${styles.mapThemeSelector}`}
          value={selectedMapTheme}
          onChange={handleThemeChange}
        >
          {mapThemes.map((theme) => (
            <option key={theme.name} value={theme.name}>
              {theme.name}
            </option>
          ))}
        </select>
      </div>

      {/* Font Color Option */}
      <div className={styles.settingItem}>
        <label>Font Color:</label>
        <div className={styles.radioGroup}>
          <label>
            <input
              type="radio"
              value="black"
              checked={fontColor === 'black'}
              onChange={(e) => setFontColor(e.target.value)}
            />
            Black
          </label>
          <label>
            <input
              type="radio"
              value="white"
              checked={fontColor === 'white'}
              onChange={(e) => setFontColor(e.target.value)}
            />
            White
          </label>
        </div>
      </div>

      {/* Ocean Color */}
      <div className={styles.settingItem}>
        <label htmlFor="oceanColor">Ocean Color:</label>
        <input
          id="oceanColor"
          type="color"
          className={styles.colorInputBox}
          value={oceanColor}
          onChange={(e) => setOceanColor(e.target.value)}
        />
      </div>

      {/* Unassigned Countries Color */}
      <div className={styles.settingItem}>
        <label htmlFor="unassignedColor">Unassigned Countries Color:</label>
        <input
          id="unassignedColor"
          type="color"
          className={styles.colorInputBox}
          value={unassignedColor}
          onChange={(e) => setUnassignedColor(e.target.value)}
        />
      </div>
    </div>
  </div>
</div>



     

     


{/* Popup Modal */}
{isPopupOpen && (
  <div className={styles.popupOverlay} onClick={togglePopup}>
    <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
      {/* Close Button */}
      <button className={styles.closeButton} onClick={togglePopup}>
        &times;
      </button>
      {/* Larger Map */}
<div className={styles.largeMapContainer}>
  {selectedMap === 'world' && (
    <WorldMapSVG
      groups={groups}
      mapTitleValue={mapTitle}
      oceanColor={oceanColor}
      unassignedColor={unassignedColor}
      showTopHighValues={showTopHighValues}
      showTopLowValues={showTopLowValues}
      data={data}
      selectedMap={selectedMap}
      fontColor={fontColor}
      topHighValues={topHighValues}
      topLowValues={topLowValues}
      isLargeMap={true} // Pass a prop to adjust map size if needed
      isTitleHidden={isTitleHidden}

    />
  )}
  {selectedMap === 'usa' && (
    <UsSVG
      groups={groups}
      mapTitleValue={mapTitle}
      oceanColor={oceanColor}
      unassignedColor={unassignedColor}
      showTopHighValues={showTopHighValues}
      showTopLowValues={showTopLowValues}
      data={data}
      selectedMap={selectedMap}
      fontColor={fontColor}
      topHighValues={topHighValues}
      topLowValues={topLowValues}
      isLargeMap={true}
      isTitleHidden={isTitleHidden}


    />
  )}
  {selectedMap === 'europe' && (
    <EuropeSVG
      groups={groups}
      mapTitleValue={mapTitle}
      oceanColor={oceanColor}
      unassignedColor={unassignedColor}
      showTopHighValues={showTopHighValues}
      showTopLowValues={showTopLowValues}
      data={data}
      selectedMap={selectedMap}
      fontColor={fontColor}
      topHighValues={topHighValues}
      topLowValues={topLowValues}
      isLargeMap={true}
      isTitleHidden={isTitleHidden}

    />
  )}
</div>

    </div>
  </div>
)}



      {/* Navigation Buttons */}
<div className={styles.navigationButtons}>
  <button className={styles.secondaryButton} onClick={() => setShowSettingsModal(true)}>
    <FontAwesomeIcon icon={faCog} /> Map Settings
  </button>
  <button className={styles.primaryButton} onClick={handleSaveMap}>Save Map</button>
</div>

      {showLoginModal && (
  <div className={styles.modalOverlay} onClick={() => setShowLoginModal(false)}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={() => setShowLoginModal(false)}>
        &times;
      </button>
      <h2>Don't Lose Your Progress!</h2>
      <p>Please log in or sign up to save your map.</p>
      <div className={styles.modalButtons}>
        <button
          className={styles.secondaryButton}
          onClick={() => {
            // Navigate to the login page
            window.location.href = '/login';
          }}
        >
          Log In
        </button>
        <button
          className={styles.primaryButton}
          onClick={() => {
            // Navigate to the signup page
            window.location.href = '/signup';
          }}
        >
          Sign Up
        </button>
      </div>
    </div>
  </div>

)}

{showSettingsModal && (
  <div className={styles.modalOverlay} onClick={() => setShowSettingsModal(false)}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.closeButton} onClick={() => setShowSettingsModal(false)}>
        &times;
      </button>
      <div className={styles.settingsModalContainer}>
        {/* Map Image on the Left */}
        <div className={styles.mapImagePreview}>
          {selectedMap === 'world' && (
            <WorldMapSVG
              groups={groups}
              mapTitleValue={mapTitle}
              oceanColor={oceanColor}
              unassignedColor={unassignedColor}
              showTopHighValues={showTopHighValues}
              showTopLowValues={showTopLowValues}
              data={data}
              selectedMap={selectedMap}
              fontColor={fontColor}
              topHighValues={topHighValues}
              topLowValues={topLowValues}
              isLargeMap={false}
              isTitleHidden={isTitleHidden} // Add this line
            />
          )}
          {selectedMap === 'usa' && (
            <UsSVG
            groups={groups}
            mapTitleValue={mapTitle}
            oceanColor={oceanColor}
            unassignedColor={unassignedColor}
            showTopHighValues={showTopHighValues}
            showTopLowValues={showTopLowValues}
            data={data}
            selectedMap={selectedMap}
            fontColor={fontColor}
            topHighValues={topHighValues}
            topLowValues={topLowValues}
            isLargeMap={false}
            isTitleHidden={isTitleHidden} // Add this line
            />
          )}
          {selectedMap === 'europe' && (
            <EuropeSVG
            groups={groups}
            mapTitleValue={mapTitle}
            oceanColor={oceanColor}
            unassignedColor={unassignedColor}
            showTopHighValues={showTopHighValues}
            showTopLowValues={showTopLowValues}
            data={data}
            selectedMap={selectedMap}
            fontColor={fontColor}
            topHighValues={topHighValues}
            topLowValues={topLowValues}
            isLargeMap={false}
            isTitleHidden={isTitleHidden} // Add this line
            />
          )}
        </div>
        {/* Input Fields on the Right */}
        <div className={styles.settingsInputFields}>
          <h2>My Map</h2>
        {/* Map Title */}
<div className={styles.settingItem}>
  <label htmlFor="mapTitleInput">Map Title:</label>
  <input
    id="mapTitleInput"
    type="text"
    className={styles.inputBox}
    value={mapTitle}
    onChange={(e) => setMapTitle(e.target.value)}
    placeholder="Enter map title"
    maxLength="40"
  />
  {/* Hide Map Title Checkbox */}
  <div className={styles.checkboxItem}>
    <label htmlFor="isTitleHidden">
      <input
        id="isTitleHidden"
        type="checkbox"
        checked={isTitleHidden}
        onChange={(e) => setIsTitleHidden(e.target.checked)}
      />
      Hide Map Title
    </label>
  </div>
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
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInputKeyDown}
            placeholder="Type a tag and press Enter"
          />
          {/* Display tags */}
          <div className={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <div key={index} className={styles.tagItem}>
                {tag}
                <button
                  className={styles.removeTagButton}
                  onClick={() => removeTag(index)}
                  aria-label={`Remove tag ${tag}`}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

            
{/* Public/Private Select */}
<div className={styles.settingItem}>
  <label htmlFor="isPublicSelect">Visibility:</label>
  <div
    className={styles.customSelect}
    onClick={() => setShowVisibilityOptions(!showVisibilityOptions)}
  >
    <FontAwesomeIcon
      icon={isPublic ? faGlobe : faLock}
      className={styles.visibilityIcon}
    />
    {isPublic ? 'Public' : 'Private'}
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
          {/* Buttons */}
          <div className={styles.modalButtons}>
            <button className={styles.secondaryButton} onClick={() => setShowSettingsModal(false)}>
              Go Back
            </button>
            <button className={styles.primaryButton} onClick={saveMapData}>
              Save Map
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}


      </div>
      </div>
      </div>
      </div>
    );
  }
