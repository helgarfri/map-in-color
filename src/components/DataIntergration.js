import styles from "./Data.module.css"
import React from "react";
import { useState } from "react";
import countryCodes from '../countries.json'
import { useDropzone } from "react-dropzone";
import usStatesCodes from '../usStates.json'
import euCodes from '../europeanCountries.json'
import WorldMapSVG from './WorldMapSVG'
import UsSVG from "./UsSVG";
import EuropeSVG from "./EuropeSVG";
import { useEffect } from "react";

export default function DataCate({
  goBack, 
  selectedMap,
  goToNextStep,
  setCsvData,
  csvData,

}) {
  const [groups, setGroups] = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      processCsv(text, selectedMap);
      setIsUploaded(true); 
    };
    reader.readAsText(file);
  

    setGroups({});
  }, [selectedMap, setIsUploaded, setGroups]);
  

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, accept: '.csv'});


  const resetState = () => {
    resetSvgColors(); 
    setGroups({});
    setIsUploaded(false);
    setCsvData({}); 
  };
  
  const processCsv = (csvText) => {
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    const result = {};
  
   
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
  
    lines.forEach(line => {
      const [name, category] = line.split(',').map(item => item.trim().replace(/""/g, '"'));
      if (name && category) {
        const dataItem = dataSource.find(item => item.name === name);
        const code = dataItem ? dataItem.code : 'Unknown'; 
        if (!result[category]) {
          const existingColor = groups[category] ? groups[category].color : '#c0c0c0';
          result[category] = { countries: [], color: existingColor };
        }
        result[category].countries.push({ name, code });
      }
    });
  
    setGroups(result);
    setIsUploaded(true);
    setCsvData(result); 
    console.log("Processed CSV:", result);
  };
  
  
  
  const resetSvgColors = () => {
    console.log("Resetting SVG colors");
  
    switch (selectedMap) {
      case 'usa':
        resetSvgColorsForStates();
        break;
      case 'world':
      case 'europe': 
      default:
        resetSvgColorsForCountries();
        break;
    }
  };
  
  const resetSvgColorsForCountries = () => {
    console.log("Resetting SVG colors for countries");
    
    countryCodes.forEach(country => {
      const elements = document.querySelectorAll(`#${country.code.toLowerCase()}`);
      elements.forEach(element => {
        element.style.fill = '#c0c0c0'; 
      });
    });
    if(selectedMap == 'europe') {
      document.getElementById("ru-kgd").style.fill = "#c0c0c0";

    }
  };
  
  const resetSvgColorsForStates = () => {
    console.log("Resetting SVG colors for U.S. states");
    
    usStatesCodes.forEach(state => {
      console.log(state)
      const elements = document.querySelectorAll(`#${state.code.toLowerCase()}`);
      elements.forEach(element => {
          element.style.fill = '#c0c0c0'; 
      });
    });
  };
  
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
      setGroups({});
  
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      processCsv(text);
    };
    reader.readAsText(file);
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

  
  

  const handleColorChange = (newColor, category) => {
    setGroups(prevGroups => ({
      ...prevGroups,
      [category]: {
        ...prevGroups[category],
        color: newColor,
        
      },
    }));
   
    console.log("COLORFUNCTION")
    console.log(groups)
  };
  
  
  
  const updateCountryColors = () => {
    Object.entries(groups).forEach(([category, { countries, color }]) => {
      countries.forEach(country => {
        const elements = document.querySelectorAll(`#${country.code.toLowerCase()}`);
        elements.forEach(element => {
          element.style.backgroundColor = color; 
        });
      });
    });
  };

useEffect(() => {
  if (csvData && Object.keys(csvData).length > 0) {
    setGroups(csvData);
    setIsUploaded(true); 
   
  }
}, [csvData]);



const toggleCategory = (category) => {
  setOpenCategory((prevOpenCategory) => (prevOpenCategory === category ? null : category));
};

return (
  <div>
    <button onClick={downloadTemplate}>Download</button>
    <h2>Data Integration</h2>
    <div className={styles.dataUploader}>
      <div className={styles.content}>
        {isUploaded ? (
          <div className={styles.groupsDisplay}>
            <h3>Categories</h3>
            {Object.entries(groups).map(([category, { countries, color }]) => {
              const isOpen = openCategory === category;
              const unknownCount = countries.filter(country => country.code === 'Unknown').length;

              return (
                <div key={category} className={styles.group}>
                  <div className={styles.categoryHeader}>
                    {/*Here we need either Categroup or Chorogroup and
                      they should handle the data diffrently
                    */}
                    <input
                      type="color"
                      value={color}
                      className={styles.colorInp}
                      onChange={(e) => handleColorChange(e.target.value, category)}
                    />
                      <h3>{category}</h3>
                        {unknownCount > 0 && (
                          <span className={styles.unknownMessage}>
                            {unknownCount} {unknownCount === 1 ? 'item' : 'items'} not found
                          </span>
                        )}
                        <button
                          aria-expanded={isOpen}
                          onClick={() => toggleCategory(category)}
                          className={`${styles.toggleButton} ${isOpen ? styles.rotated : ''}`}
                        >
                          ▼
                        </button>
                     
                  </div>
                  <div className={`${styles.animatedContent} ${isOpen ? styles.expanded : ''} `}>
                    <div className={styles.itemListContainer}>
                    {countries.map((country, index) => (
            
                        <React.Fragment key={index}>
                          <span className={styles.itemList} style={{ color: country.code === 'Unknown' ? 'red' : 'inherit' }}>
                            {`${country.name} (${country.code})`}
                          </span>
                          {index < countries.length - 1 ? ', ' : ''}
                        </React.Fragment>
                      ))}
                    </div>
               
                  </div>
                </div>
              );
            })}
            <button className={styles.resetButton} onClick={resetState}>Reset data</button>
          </div>
        ) : (
          <div {...getRootProps({ className: styles.csvUploader })}>
            <input {...getInputProps()} />
            <h3>Upload Your CSV</h3>
            {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
          </div>
        )}
          <div className={styles.svgMapContainer}>
          <h3>Preview</h3>
          {selectedMap === 'world' && <WorldMapSVG groups={groups} />}
          {selectedMap === 'usa' && <UsSVG groups={groups} />}
          {selectedMap === 'europe' && <EuropeSVG groups={groups} />}
        </div>
      </div>
    </div>
    <button onClick={goBack}>Go back</button>
    <button onClick={goToNextStep}>Finalize</button>
  </div>
);
};
