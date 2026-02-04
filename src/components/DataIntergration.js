import React, { useState, useEffect, useContext, useMemo } from "react";
import { useNavigate, useLocation } from "react-router";
import styles from "./DataIntergration.module.css";

// JSON data
import countryCodes from '../world-countries.json';
import usStatesCodes from '../united-states.json';
import euCodes from '../european-countries.json';

// Components
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import DataSidebar from "./DataSidebar";
import TitleFontSizeField from "./TitleFontSizeField";
import LegendFontSizeField from "./LegendFontSizeField";
import WorldMapSVG from "./WorldMapSVG";
import UsSVG from "./UsSVG";
import EuropeSVG from "./EuropeSVG";
import UploadDataModal from "./UploadDataModal";

// Icons, contexts, etc.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faLock, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { SidebarContext } from "../context/SidebarContext";
import useWindowSize from "../hooks/useWindowSize";

// “updateMap” and “createMap” API calls
import { updateMap, createMap } from "../api";
import Map from "./Map";

/** Example Color Palettes **/
const themes = [
  {
    name: 'None',
    colors: Array(10).fill('#c3c3c3'),
  },
  {
    name: 'Mic Blues',
    colors: ['#d2e9ef','#b9dbe4','#a0cdd8','#89bfcb','#78b0bd','#7aa7b7','#6993a3','#5b7f8d','#4a6b78','#385561'],
  },
  {
    name: 'Mic Reds',
    colors: ['#f9d3cf','#f5a8a4','#f0807c','#ea5b58','#e14a48','#d24b4c','#b94443','#9f3a39','#86302f','#6c2625'],
  },
];

/** Example Map Themes **/
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
];

const defaultFileStats = {
  lowestValue: null,
  lowestCountry: '',
  highestValue: null,
  highestCountry: '',
  averageValue: null,
  medianValue: null,
  standardDeviation: null,
  numberOfValues: 0,
  totalCountries: 0,
};

export default function DataIntegration({ existingMapData = null, isEditing = false }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isCollapsed, setIsCollapsed } = useContext(SidebarContext);
  const { width } = useWindowSize();

  // Map selection
  // selected map is now always world
  const [selected_map] = useState('world');


  // Are we in "choropleth" or "categorical"?
  const [mapDataType, setMapDataType] = useState('choropleth');

  // The actual data array for the map
  const [data, setData] = useState([]);

  // Other states (title, desc, tags, etc.)
  const [file_stats, setFileStats] = useState(existingMapData?.file_stats || defaultFileStats);
  const [description, setDescription] = useState(existingMapData?.description || '');
  const [mapTitle, setMapTitle] = useState(existingMapData?.title || '');
  const [is_public, setIsPublic] = useState(existingMapData?.is_public || false);
  const [tags, setTags] = useState(existingMapData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showVisibilityOptions, setShowVisibilityOptions] = useState(false);

  // Ranges / Groups
  const [custom_ranges, setCustomRanges] = useState(
    existingMapData?.custom_ranges || [
      { id: Date.now(), color: '#c0c0c0', name: '', lowerBound: '', upperBound: '' },
    ]
  );
  const [rangeOrder, setRangeOrder] = useState('low-high');
  const [numRanges, setNumRanges] = useState(5);
  const [groups, setGroups] = useState(existingMapData?.groups || []);

  // Theme / Colors
  const [ocean_color, setOceanColor] = useState(existingMapData?.ocean_color || '#ffffff');
  const [unassigned_color, setUnassignedColor] = useState(existingMapData?.unassigned_color || '#c0c0c0');
  const [font_color, setFontColor] = useState(existingMapData?.font_color || 'black');
  const [selected_palette, setSelectedPalette] = useState(existingMapData?.selected_palette || 'None');
  const [selected_map_theme, setSelectedMapTheme] = useState(existingMapData?.selected_map_theme || 'Default');

  // Title & Legend
  const [is_title_hidden, setIsTitleHidden] = useState(existingMapData?.is_title_hidden || false);
  const [showNoDataLegend, setShowNoDataLegend] = useState(existingMapData?.show_no_data_legend || false);
  const [titleFontSize, setTitleFontSize] = useState(existingMapData?.title_font_size ?? null);
  const [legendFontSize, setLegendFontSize] = useState(existingMapData?.legend_font_size ?? null);

  // References
  const [references, setReferences] = useState(existingMapData?.sources || []);
  const [selectedReference, setSelectedReference] = useState(null);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [tempSourceName, setTempSourceName] = useState('');
  const [tempPublicator, setTempPublicator] = useState('');
  const [tempYear, setTempYear] = useState('');
  const [tempUrl, setTempUrl] = useState('');
  const [tempNotes, setTempNotes] = useState('');

  // Upload modal
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Tabs: 'ranges' | 'theme' | 'info'
  const [activeTab, setActiveTab] = useState('ranges');

  const [editingRangeId, setEditingRangeId] = useState(null);


  // Collapse the main sidebar for small screens
  useEffect(() => {
    if (width < 1000) setIsCollapsed(true);
    else setIsCollapsed(false);
  }, [width, setIsCollapsed]);

  // If editing existing
  useEffect(() => {
    if (existingMapData) {
      setMapDataType(existingMapData.map_data_type || existingMapData.mapDataType || "choropleth");

      // Possibly detect numeric vs text
    }
  }, [existingMapData]);

  useEffect(() => {
  if (!existingMapData) return;

  // IMPORTANT: actually load the DB data into state
  setData(existingMapData.data || []);

  // (optional but recommended) sync the rest too
  setMapTitle(existingMapData.title || "");
  setDescription(existingMapData.description || "");
  setTags(existingMapData.tags || []);
  setIsPublic(!!existingMapData.is_public);

  setCustomRanges(
    existingMapData.custom_ranges || [
      { id: Date.now(), color: "#c0c0c0", name: "", lowerBound: "", upperBound: "" },
    ]
  );

  setGroups(existingMapData.groups || []);
  setOceanColor(existingMapData.ocean_color || "#ffffff");
  setUnassignedColor(existingMapData.unassigned_color || "#c0c0c0");
  setFontColor(existingMapData.font_color || "black");
  setSelectedPalette(existingMapData.selected_palette || "None");
  setSelectedMapTheme(existingMapData.selected_map_theme || "Default");

  setIsTitleHidden(!!existingMapData.is_title_hidden);
  setShowNoDataLegend(!!existingMapData.show_no_data_legend);
  setTitleFontSize(existingMapData.title_font_size ?? null);
  setLegendFontSize(existingMapData.legend_font_size ?? null);

  setReferences(existingMapData.sources || []);
  setFileStats(existingMapData.file_stats || defaultFileStats);
}, [existingMapData]);


  // Upload modal
  const handleOpenUploadModal = () => {
    setShowUploadModal(true);
  };
  const handleImportData = (parsedData, stats) => {
    setData(parsedData);
    setShowUploadModal(false);
  };

  // Palette
  const handlePaletteChange = (e) => {
    const newPalette = e.target.value;
    setSelectedPalette(newPalette);
    const paletteColors = themes.find((t) => t.name === newPalette)?.colors || [];
    setCustomRanges((prev) => applyPalette(prev, paletteColors));
  };
  function applyPalette(ranges, paletteColors) {
    if (!ranges.length || !paletteColors.length) return ranges;
    const numRanges = ranges.length;
    const numColors = paletteColors.length;
    const indices = [];
    if (numRanges === 1) {
      indices.push(Math.floor((numColors - 1) / 2));
    } else {
      const step = (numColors - 1) / (numRanges - 1);
      for (let i = 0; i < numRanges; i++) {
        indices.push(Math.round(i * step));
      }
    }
    return ranges.map((r, i) => ({
      ...r,
      color: paletteColors[indices[i]] || '#c0c0c0',
    }));
  }

  // Theme
  const handleThemeChange = (e) => {
    const themeName = e.target.value;
    setSelectedMapTheme(themeName);
    const found = map_themes.find((t) => t.name === themeName);
    if (found) {
      setOceanColor(found.ocean_color);
      setFontColor(found.font_color);
      setUnassignedColor(found.unassigned_color);
    }
  };

  // Ranges logic
  const handleRangeChange = (id, field, value) => {
    setCustomRanges(
      custom_ranges.map(r => (r.id === id ? { ...r, [field]: value } : r))
    );
  };
  const addRange = () => {
    setCustomRanges((prev) => [
      ...prev,
      { id: Date.now(), color: '#c0c0c0', name: '', lowerBound: '', upperBound: '' },
    ]);
  };
  const removeRange = (id) => {
    if (custom_ranges.length > 1) {
      setCustomRanges(custom_ranges.filter(r => r.id !== id));
    }
  };
  const generateGroups = () => {
    if (!data.length) {
      alert("No data to group. Upload or enter data first.");
      return;
    }
    // ...
  };
  const suggestRanges = () => {
    // ...
  };
  const getRangesValidationResult = () => {
    if (!custom_ranges.length) {
      return { isValid: false, errorMessage: 'No ranges defined.' };
    }
    return { isValid: true, errorMessage: '' };
  };
  const rangesValidation = getRangesValidationResult();

  // Category freq table
  const renderCategoryGroupsTable = () => {
    const freqMap = {};
    data.forEach(item => {
      const cat = item.value.trim();
      if (!cat) return;
      freqMap[cat] = (freqMap[cat] || 0) + 1;
    });
    const categories = Object.keys(freqMap).sort();
    return (
      <div className={styles.section}>
        <h3>Category Groups</h3>
        {categories.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>No categories assigned yet.</p>
        ) : (
          <table className={styles.rangeTable}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat}>
                  <td>{cat}</td>
                  <td>{freqMap[cat]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  // Tags
  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };
  const removeTag = (idx) => setTags(tags.filter((_, i) => i !== idx));

  // References
  const handleAddReference = () => {
    setSelectedReference(null);
    setTempSourceName('');
    setTempPublicator('');
    setTempYear('');
    setTempUrl('');
    setTempNotes('');
    setIsReferenceModalOpen(true);
  };
  const handleEditReference = (ref) => {
    setSelectedReference(ref);
    setTempSourceName(ref.sourceName);
    setTempPublicator(ref.publicator || '');
    setTempYear(ref.publicationYear);
    setTempUrl(ref.url);
    setTempNotes(ref.notes || '');
    setIsReferenceModalOpen(true);
  };
  const handleDeleteReference = () => {
    if (!selectedReference) return;
    if (window.confirm("Are you sure you want to delete this reference?")) {
      setReferences(prev => prev.filter(x => x !== selectedReference));
      setIsReferenceModalOpen(false);
    }
  };
  const handleSaveReference = () => {
    if (!tempSourceName.trim() || !tempYear.trim()) {
      alert("Source Name and Publication Year are required.");
      return;
    }
    if (selectedReference) {
      setReferences(prev =>
        prev.map(ref =>
          ref === selectedReference
            ? {
                ...ref,
                sourceName: tempSourceName,
                publicationYear: tempYear,
                publicator: tempPublicator,
                url: tempUrl,
                notes: tempNotes,
              }
            : ref
        )
      );
    } else {
      const newRef = {
        id: Date.now(),
        sourceName: tempSourceName,
        publicationYear: tempYear,
        publicator: tempPublicator,
        url: tempUrl,
        notes: tempNotes,
      };
      setReferences([...references, newRef]);
    }
    setIsReferenceModalOpen(false);
  };

    function pick(obj, keys) {
  for (const k of keys) {
    if (obj && obj[k] != null && String(obj[k]).trim() !== "") return obj[k];
  }
  return null;
}

function toNumber(x) {
  const n = typeof x === "number" ? x : parseFloat(String(x).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

const mapDataNormalized = useMemo(() => {
  return (data || [])
    .map((d) => {
      const code = pick(d, ["code", "countryCode", "iso2", "ISO2", "Country Code", "country_code"]);
      const name = pick(d, ["name", "countryName", "Country", "country_name"]);
      const valueRaw = pick(d, ["value", "Value", "val"]);

      return {
        ...d,
        code: code ? String(code).trim().toUpperCase() : "",
        name: name ? String(name) : undefined,
        value: mapDataType === "choropleth" ? toNumber(valueRaw) : valueRaw,
      };
    })
    .filter((d) => d.code); // drop broken rows
}, [data, mapDataType]);

const rangesWithCountries = useMemo(() => {
  const toNum = (x) => {
    const n = typeof x === "number" ? x : parseFloat(String(x).replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  // sanitize ranges (some of yours are "" initially)
  const rangesClean = (custom_ranges || []).map((r) => ({
    ...r,
    lower: toNum(r.lowerBound),
    upper: toNum(r.upperBound),
  }));

  // helper: for display, use name if present else code
  const countryLabel = (d) => {
    const n = d.name ? String(d.name).trim() : "";
    const c = d.code ? String(d.code).trim() : "";
    return (n || c).toLowerCase();
  };

  // compute countries per range using normalized numeric data
  const rows = rangesClean.map((r) => {
    const valid = r.lower != null && r.upper != null;

    const countries = valid
      ? (mapDataNormalized || [])
          .filter((d) => typeof d.value === "number" && d.value >= r.lower && d.value < r.upper)
          .map(countryLabel)
          .filter(Boolean)
          .sort((a, b) => a.localeCompare(b))
      : [];

    return {
      ...r,
      countries,
      count: countries.length,
      isValidRange: valid,
    };
  });

  // sort by lower bound (invalid ranges sink to bottom)
  rows.sort((a, b) => {
    if (a.lower == null && b.lower == null) return 0;
    if (a.lower == null) return 1;
    if (b.lower == null) return -1;
    return a.lower - b.lower;
  });

  return rows;
}, [custom_ranges, mapDataNormalized]);



  // Save map
const handleSaveMap = async () => {
  // ✅ IMPORTANT: don't send `id` on create (Supabase should generate it)
  const payload = {
    title: mapTitle,
    description,
    tags,
    is_public,

    // Use normalized data so codes are clean ISO2, numbers are real numbers
    data: mapDataNormalized,

    // Pick ONE of these based on your DB column name.
    // If your DB column is `map_data_type`, keep this:
    map_data_type: mapDataType,
    // If your DB column is `mapDataType` (older), keep this instead:
    // mapDataType,

    custom_ranges,
    groups,

    selected_map, // world
    ocean_color,
    unassigned_color,
    font_color,
    selected_palette,
    selected_map_theme,

    file_stats,
    is_title_hidden,
    show_no_data_legend: showNoDataLegend,
    sources: references,

    // ✅ what your backend expects (it converts to title_font_size / legend_font_size)
    titleFontSize: titleFontSize ?? null,
    legendFontSize: legendFontSize ?? null,
  };

  try {
    const res = isEditing
      ? await updateMap(existingMapData.id, payload)
      : await createMap(payload);

    console.log("✅ Saved map:", res?.data);
    navigate("/dashboard");
  } catch (err) {
    console.error("❌ Save map failed:", err?.response?.data || err);
    alert(err?.response?.data?.msg || "Failed to save map (check console).");
  }
};



  

  return (
    <div className={styles.layoutContainer}>
      {/* Main sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* LEFT: Data sidebar */}


      {/* RIGHT: Map preview on top, navigation below */}
      <div className={styles.rightPanel}>
        {/* Map preview */}
        <div className={styles.mapSection}>
          <div className={styles.mapBox}>
            <h4>Map Preview</h4>
            <div className={styles.mapPreview}>
                <Map
                  groups={groups}
                  mapTitleValue={mapTitle}
                  custom_ranges={custom_ranges}     
                  mapDataType={mapDataType} 
                  ocean_color={ocean_color}
                  unassigned_color={unassigned_color}
                  data={mapDataNormalized}
                  selected_map="world"
                  font_color={font_color}
                  showNoDataLegend={showNoDataLegend}
                  is_title_hidden={is_title_hidden}
                  titleFontSize={titleFontSize}
                  legendFontSize={legendFontSize}
                />

            </div>
          </div>
        </div>

        {/* Navigation / settings */}
        <div className={styles.navSection}>
          <Header
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
            title={isEditing ? `Edit ${mapTitle}` : 'Create Map'}
          />

          {/* Tabs */}
          <div className={styles.tabRow}>
            <div
              className={`${styles.tabItem} ${activeTab === 'ranges' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('ranges')}
            >
              Data &amp; Ranges
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'theme' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('theme')}
            >
              Map Theme
            </div>
            <div
              className={`${styles.tabItem} ${activeTab === 'info' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('info')}
            >
              Map Info
            </div>
          </div>

{/* Tab content */}
<div className={styles.tabContentArea}>
  {activeTab === "ranges" && (
    <>
      {mapDataType === "choropleth" ? (
        <div className={styles.section}>
          <h3>Ranges</h3>

          <table className={styles.rangeTable}>
            <thead>
              <tr>
                <th>Countries</th>
                <th>Lower</th>
                <th>Upper</th>
                <th>Name</th>
                <th>Color</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {rangesWithCountries.map((range) => {
                const isEditingRow = editingRangeId === range.id;

                return (
                  <tr key={range.id}>
                    {/* Countries */}
                    <td style={{ maxWidth: 380 }}>
                      {range.isValidRange ? (
                        <>
                          <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
                            {range.count} countries
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              lineHeight: 1.3,
                              wordBreak: "break-word",
                            }}
                          >
                            {range.countries.join(", ")}
                          </div>
                        </>
                      ) : (
                        <span style={{ fontStyle: "italic", opacity: 0.7 }}>
                          Add lower/upper to see countries
                        </span>
                      )}
                    </td>

                    {/* Lower */}
                    <td>
                      {isEditingRow ? (
                        <input
                          type="number"
                          className={styles.inputBox}
                          value={range.lowerBound}
                          onChange={(e) =>
                            handleRangeChange(range.id, "lowerBound", parseFloat(e.target.value))
                          }
                          placeholder="Min"
                        />
                      ) : (
                        <span>{range.lower ?? ""}</span>
                      )}
                    </td>

                    {/* Upper */}
                    <td>
                      {isEditingRow ? (
                        <input
                          type="number"
                          className={styles.inputBox}
                          value={range.upperBound}
                          onChange={(e) =>
                            handleRangeChange(range.id, "upperBound", parseFloat(e.target.value))
                          }
                          placeholder="Max"
                        />
                      ) : (
                        <span>{range.upper ?? ""}</span>
                      )}
                    </td>

                    {/* Name */}
                    <td>
                      {isEditingRow ? (
                        <input
                          type="text"
                          className={styles.inputBox}
                          value={range.name}
                          onChange={(e) => handleRangeChange(range.id, "name", e.target.value)}
                          placeholder="Range Name"
                        />
                      ) : (
                        <span>
                          {range.name || <span style={{ opacity: 0.6 }}>(unnamed)</span>}
                        </span>
                      )}
                    </td>

                    {/* Color */}
                    <td>
                      {isEditingRow ? (
                        <input
                          type="color"
                          className={styles.inputBox}
                          value={range.color}
                          onChange={(e) => handleRangeChange(range.id, "color", e.target.value)}
                        />
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: 4,
                              background: range.color,
                              border: "1px solid rgba(0,0,0,0.2)",
                              display: "inline-block",
                            }}
                          />
                          <span style={{ fontSize: 12, opacity: 0.8 }}>{range.color}</span>
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      {isEditingRow ? (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className={styles.secondaryButton}
                            onClick={() => setEditingRangeId(null)}
                          >
                            Done
                          </button>

                          <button
                            className={styles.removeButton}
                            onClick={() => {
                              setEditingRangeId(null);
                              removeRange(range.id);
                            }}
                            disabled={custom_ranges.length <= 1}
                            title={
                              custom_ranges.length <= 1
                                ? "You must keep at least one range"
                                : "Delete"
                            }
                          >
                            &times;
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            className={styles.secondaryButton}
                            onClick={() => setEditingRangeId(range.id)}
                          >
                            Edit
                          </button>

                          <button
                            className={styles.removeButton}
                            onClick={() => removeRange(range.id)}
                            disabled={custom_ranges.length <= 1}
                            title={
                              custom_ranges.length <= 1
                                ? "You must keep at least one range"
                                : "Delete"
                            }
                          >
                            &times;
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Keep your existing range controls exactly as before */}
          <div className={styles.rangeControls}>
          
       
            <button className={styles.secondaryButton} onClick={addRange}>
              Add Range
            </button>

           
            {(!rangesValidation.isValid || !data.length) && (
              <p className={styles.errorMessage}>
                {!data.length ? "Please upload or enter data first." : rangesValidation.errorMessage}
              </p>
            )}
          </div>
        </div>
      ) : (
        renderCategoryGroupsTable()
      )}
    </>
  )}
            {activeTab === 'theme' && (
              <div className={styles.themeTab}>
                <h3>Map Theme</h3>
                <div className={styles.themeField}>
                  <label htmlFor="paletteSelector">Palette:</label>
                  <select
                    id="paletteSelector"
                    className={styles.inputBox}
                    value={selected_palette}
                    onChange={handlePaletteChange}
                  >
                    {themes.map((th) => (
                      <option key={th.name} value={th.name}>{th.name}</option>
                    ))}
                  </select>
                  <div className={styles.themePreview}>
                    {themes
                      .find(t => t.name === selected_palette)
                      ?.colors.map((color, idx) => (
                        <div
                          key={idx}
                          className={styles.themeColor}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                  </div>
                </div>

                <div className={styles.themeField}>
                  <label>Map Theme:</label>
                  <select
                    className={styles.inputBox}
                    value={selected_map_theme}
                    onChange={handleThemeChange}
                  >
                    {map_themes.map(mt => (
                      <option key={mt.name} value={mt.name}>
                        {mt.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.themeField}>
                  <label>Ocean Color:</label>
                  <input
                    type="color"
                    className={styles.inputBox}
                    value={ocean_color}
                    onChange={(e) => setOceanColor(e.target.value)}
                  />
                </div>

                <div className={styles.themeField}>
                  <label>Unassigned Color:</label>
                  <input
                    type="color"
                    className={styles.inputBox}
                    value={unassigned_color}
                    onChange={(e) => setUnassignedColor(e.target.value)}
                  />
                </div>

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

                <div className={styles.themeField}>
                  <TitleFontSizeField
                    titleFontSize={titleFontSize}
                    setTitleFontSize={setTitleFontSize}
                  />
                </div>
                <div className={styles.themeField}>
                  <LegendFontSizeField
                    legendFontSize={legendFontSize}
                    setLegendFontSize={setLegendFontSize}
                  />
                </div>

                <div className={styles.themeField}>
                  <label>Show "No data" in legend:</label>
                  <input
                    type="checkbox"
                    checked={showNoDataLegend}
                    onChange={(e) => setShowNoDataLegend(e.target.checked)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className={styles.infoTab}>
                <h3>Map Information</h3>
                <div className={styles.settingItemRow}>
                  <label>Map Title:</label>
                  <input
                    type="text"
                    className={styles.inputBox}
                    style={{ width: '220px' }}
                    value={mapTitle}
                    onChange={(e) => setMapTitle(e.target.value)}
                    placeholder="Enter map title"
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

                <div className={styles.settingItem}>
                  <label>Description:</label>
                  <textarea
                    className={`${styles.inputBox} ${styles.descriptionInput}`}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </div>

                <div className={styles.settingItem}>
                  <label>Tags:</label>
                  <input
                    type="text"
                    className={styles.inputBox}
                    value={tagInput}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\s/g, '');
                      setTagInput(val);
                    }}
                    onKeyDown={handleTagInputKeyDown}
                    placeholder="Type a tag and press Enter"
                  />
                  <div className={styles.tagBox}>
                    {tags.map((tag, i) => (
                      <div key={i} className={styles.tagItem}>
                        {tag}
                        <button
                          className={styles.removeTagButton}
                          onClick={() => removeTag(i)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

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
                      <p style={{ fontStyle: 'italic' }}>No references added.</p>
                    ) : (
                      references.map(ref => (
                        <div
                          key={ref.id}
                          className={styles.referenceItem}
                          onClick={() => handleEditReference(ref)}
                          title="Click to edit"
                        >
                          {ref.sourceName} ({ref.publicationYear})
                        </div>
                      ))
                    )}
                  </div>
                </div>

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
                          onClick={() => { setIsPublic(true); setShowVisibilityOptions(false); }}
                        >
                          <FontAwesomeIcon icon={faGlobe} className={styles.visibilityIcon} />
                          Public
                        </div>
                        <div
                          className={styles.selectOption}
                          onClick={() => { setIsPublic(false); setShowVisibilityOptions(false); }}
                        >
                          <FontAwesomeIcon icon={faLock} className={styles.visibilityIcon} />
                          Private
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className={styles.navigationButtons}>
                  <button className={styles.primaryButton} onClick={handleSaveMap}>
                    Save Map
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className={`${styles.leftSidebar} ${isCollapsed ? styles.collapsed : ''}`}>
  <DataSidebar
    selectedMap={selected_map}
    mapDataType={mapDataType}
    onChangeDataType={setMapDataType}
    dataEntries={data}
    setDataEntries={setData}
    onOpenUploadModal={handleOpenUploadModal}
  />
</div>

      {/* Reference Modal */}
      {isReferenceModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsReferenceModalOpen(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setIsReferenceModalOpen(false)}>
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


            <div className={styles.modalBottomRow}>
              {selectedReference && (
                <span className={styles.deleteRefLink} onClick={handleDeleteReference}>
                  Delete Reference
                </span>
              )}
              <button className={styles.primaryButton} onClick={handleSaveReference}>
                Save
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Upload Data Modal */}
      <UploadDataModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        selectedMap={selected_map}
        onImport={handleImportData}
      />
    </div>
  );
}
