import React, { useState } from 'react';
import styles from './DataUploader.module.css';

export default function DataUploaderCate() {
  const [groups, setGroups] = useState({});

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
      const text = e.target.result;
      processCsv(text);
    };
    reader.readAsText(file);
  };

  const processCsv = (csvText) => {
    const lines = csvText.split('\n');
    const result = {};
    lines.forEach((line, index) => {
      if (index === 0 || !line) return;
      const [country, category] = line.split(',').map((s) => s.trim());
      if (!result[category]) {
        result[category] = [];
      }
      result[category].push(country.toLowerCase());
    });
    setGroups(result);
  };

  const downloadTemplate = () => {
    const template = "Country,Category\n";
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = "country_categories_template.csv";
    link.click();
  };

  return (
    <div className={styles.dataUploader}>
      <div className={styles.csvUploader}>
        <h3>Upload Your CSV</h3>
        <button onClick={downloadTemplate}>Download Starter Template</button>
        <input type="file" accept=".csv" onChange={handleFileUpload} />
      </div>
    
      <div className={styles.content}>
        <div className={styles.groupsDisplay}>
            <h3>Categories</h3>
          {Object.entries(groups).map(([category, countries]) => (
            <div key={category} className={styles.group}>
              <h3>{category}</h3>
              <p>{countries.join(', ')}</p>
            </div>
          ))}
        </div>
        <h3>Preview</h3>
        <div className={styles.svgMapContainer}>
          {/* SVG Map Placeholder */}
        </div>
      </div>
    </div>
  );
}
