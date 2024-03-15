import React, { useState } from 'react';
import styles from './Create.module.css';

export default function SelectType({ continueToNextStep, goBack, selectedType, setSelectedType }) {

    const handleTypeSelect = (type) => {
        setSelectedType(type);
    };

    return(
        <div>
            <div className={styles.typeContainer}>
                <h2>Select a data type</h2>
                <div className={styles.dataTypeContainer}>
                    <div
                        className={`${styles.typeOption} ${selectedType === 'categorical' ? styles.selected : ''}`}
                        onClick={() => handleTypeSelect('categorical')}
                    >
                        <h3>Categorical</h3>
                        <p>This type is best for data that can be divided into distinct groups.</p>
                    </div>

                    <div
                        className={`${styles.typeOption} ${selectedType === 'choropleth' ? styles.selected : ''}`}
                        onClick={() => handleTypeSelect('choropleth')}
                    >
                        <h3>Choropleth</h3>
                        <p>This type is ideal for representing statistical data through variations in coloring on a map.</p>
                    </div>
                </div>
                
                <div>
                <button onClick={goBack}>Go Back</button>
                {selectedType && (
                    <button onClick={continueToNextStep}>Continue</button>
                )}
                </div>
             
            </div>
        </div>
    );
}
