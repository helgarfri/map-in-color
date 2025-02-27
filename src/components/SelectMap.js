import { useState } from 'react';
import styles from './Create.module.css';

export default function SelectMap({ continueToNextStep, selected_map, setSelectedMap }) {

    const handleMapSelect = (mapName) => {
        setSelectedMap(mapName);
    };

    return (
        <div>
            <h2>Select a map</h2>
            <div className={styles.mapsContainer}>
                {[
                    { src: "./assets/world_map_demo.png", alt: "World", name: "world" },
                    { src: "./assets/us_states_demo.png", alt: "United States", name: "usa" },
                    { src: "./assets/europe_map_demo.png", alt: "Europe", name: "europe" },
                ].map((map) => (
                    <div
                        key={map.name}
                        className={styles.imgContainer}
                        onClick={() => handleMapSelect(map.name)}
                    >
                        <img
                            src={map.src}
                            alt={map.alt}
                            className={`${styles.img} ${selected_map === map.name ? styles.selectedImg : ''}`}
                        />
                        <p>{map.alt}</p>
                    </div>
                ))}
            </div>

            {selected_map && (
                <div>
                    <button onClick={continueToNextStep}>Continue</button>
                </div>
            )}
        </div>
    );
}
