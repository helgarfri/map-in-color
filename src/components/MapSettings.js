import { useState } from "react";

function MapSettings({ handleDownloadClickPNG, handleDownloadClickJPEG, selectedRes, setSelectedRes }) {

    const handleOptionChange = (event) => {
        setSelectedRes(event.target.value);
      }

    return(
        <div className="settings">
			<div className="map-settings">
                <div>
                <input type='checkbox' className="settings-checkbox"></input>
                <label className="settings-label">Show microstates</label>

                </div>
                <div>
                <input type='checkbox' className="settings-checkbox"></input>
                <label className="settings-label">Show labels on states</label>
                </div>
                
            </div>

            <div className="map-download">
                <div className="download-format">
                <p className="settings-title">Download as</p>
                <button className="settings-button" onClick={handleDownloadClickPNG}>PNG</button>

                <button className="settings-button" onClick={handleDownloadClickJPEG}>JPEG</button>
        
                </div>
                
                <div className="download-format">
                    <p className="settings-title">Resolution</p>
                    
                    <label className="settings-label-r">
                        <input
                        type="radio"
                        className="settings-radio"
                        name="option"
                        value="6.66"
                        checked={selectedRes === "6.66"}
                        onChange={handleOptionChange}
                        />
                        Low
                    </label>
                    <label className="settings-label-r">
                        <input
                        type="radio"
                        className="settings-radio"
                        name="option"
                        value="13.33"
                        checked={selectedRes === "13.33"}
                        onChange={handleOptionChange}
                        />
                        Medium
                    </label>
                    <label className="settings-label-r">
                        <input
                        type="radio"
                        className="settings-radio"
                        name="option"
                        value="20"
                        checked={selectedRes === "20"}
                        onChange={handleOptionChange}
                        />
                        High
                    </label>
            </div>

                
                </div>
            
            </div>
            
            

    )
}

export default MapSettings