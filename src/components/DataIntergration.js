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
import CateGroup from "./CateGroup";
import ChoroGroup from "./ChoroGroup"


export default function DataIntergration({
  goBack, 
  selectedMap,
  goToNextStep,
  setCsvData,
  csvData,
  selectedType

}) {
  const [groups, setGroups] = useState({});
  const [isUploaded, setIsUploaded] = useState(false);
  const [openCategory, setOpenCategory] = useState(null);

  const [classLabels, setClassLabels] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

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
    // Split lines and filter out empty or comment lines
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
  
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
  
    // Parse the CSV lines to extract name, value pairs
    let parsedData = lines.map(line => {
      const parts = line.split(',').map(part => part.trim().replace(/""/g, '"'));
      const name = parts[0];
      const value = parts.length > 1 ? parts[1] : null; // Assuming second column is the value
      const dataItem = dataSource.find(item => item.name === name);
      const code = dataItem ? dataItem.code : 'Unknown';
      return { name, code, value };
    });
  
    // Delegate to type-specific processing functions
    if (selectedType === 'categorical') {
      processCsvForCategorical(parsedData);
    } else if (selectedType === 'choropleth') {
      processCsvForChoropleth(parsedData);
    }
  };
  
  const processCsvForCategorical = (parsedData) => {
    // Group parsed data into categories
    const result = parsedData.reduce((acc, { name, code, value }) => {
      const category = value; // Assuming value is the category in categorical data
      if (!acc[category]) {
        acc[category] = { countries: [], color: '#c0c0c0' }; // Default color
      }
      acc[category].countries.push({ name, code });
      return acc;
    }, {});
  
    setGroups(result);
    setIsUploaded(true);
    setCsvData(result);
  };
  
  
  const processCsvForChoropleth = (parsedData) => {
    const values = parsedData
      .map((d) => ({ ...d, value: parseFloat(d.value) }))
      .filter((d) => !isNaN(d.value))
      .sort((a, b) => a.value - b.value);
  
    const numClasses = 5;
    const minValue = values[0].value;
    const maxValue = values[values.length - 1].value;
    const range = maxValue - minValue;
    const classWidth = range / numClasses;
  
    const initialGroups = Array.from({ length: numClasses }, (_, i) => {
      const lowerBound = minValue + i * classWidth;
      const upperBound = i === numClasses - 1 ? maxValue : lowerBound + classWidth;
      return {
        range: `${lowerBound.toFixed(2)} - ${upperBound.toFixed(2)}`,
        countries: [],
        color: '#c0c0c0',
      };
    });
  
    // A safer function to determine the class index
    const getClassIndex = (value) => {
      if (value === maxValue) {
        return numClasses - 1; // Ensure the max value falls within the last class
      }
      return Math.floor((value - minValue) / classWidth);
    };
  
    values.forEach((dataItem) => {
      const classIndex = getClassIndex(dataItem.value);
      // Safety check to ensure classIndex is within bounds
      if (initialGroups[classIndex]) {
        initialGroups[classIndex].countries.push({
          name: dataItem.name,
          code: dataItem.code,
        });
      } else {
        console.error('Class index out of bounds:', classIndex);
      }
    });
  
    const finalGroups = initialGroups.reduce((acc, group, index) => {
      acc[group.range] = { countries: group.countries, color: group.color };
      return acc;
    }, {});
  
    setGroups(finalGroups);
    setIsUploaded(true);
    setCsvData(finalGroups);
  };
  
  


  // Handler for class selection
const handleClassSelection = (classIndex) => {
  setSelectedClass(classIndex);
  // Here, you could further process data based on the selected class, such as highlighting the map accordingly
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
    <button onClick={downloadTemplate}>Download Template</button>
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



                  {selectedType === 'categorical' && (
                    <CateGroup
                      color={color}
                      handleColorChange={(newColor) => handleColorChange(newColor, category)}
                      category={category}
                      unknownCount={unknownCount}
                      isOpen={isOpen}
                      toggleCategory={toggleCategory}
                      countries={countries}
                    />
                  )}

            

                    {selectedType === "choropleth" && (
                      console.log("Rendering ChoroGroup", classLabels),
                      <ChoroGroup
                        color={color}
                      handleColorChange={(newColor) => handleColorChange(newColor, category)}
                      category={category}
                      unknownCount={unknownCount}
                      isOpen={isOpen}
                      toggleCategory={toggleCategory}
                      countries={countries}
                      />
                    )}

                
                

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
        }