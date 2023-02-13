import '../world-states.svg'
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from './Countries';
import React, { Component, useEffect, useState } from 'react';
import './Navigator'
import { CompactPicker, SketchPicker } from 'react-color'
import Navigator from './Navigator';



 

function Legend5({
    legend1CountryValue, 
    setLegend1CountryValue, 
    legend2CountryValue,
    setLegend2CountryValue,
    legend3CountryValue,
    setLegend3CountryValue,
    legend4CountryValue,
    setLegend4CountryValue,
    legend5CountryValue,
    setLegend5CountryValue,

    activeLegend, 
    legend5ColorValue, 
    setLegend5ColorValue, 
    legend5TitleValue, 
    handleTitle5ValueChange,
    showLabel5,
    setShowLabel5
    
}) {


    
   
      

    const handleColorChange = (color) =>{
        setLegend5ColorValue(color.hex)
        for (var i = 0; i < legend5CountryValue.length; i++) {
            const id = legend5CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle5Change = (event) => {
        handleTitle5ValueChange(event.target.value)

        
    }


        if (activeLegend !== 'legend5') {
            return null
        } 

        
    return(
        <div>
            <div className='legend'>


                <div className='legend-set'>
                    
                    <div className='legend-title'>
                        
                        <input 
                            value={legend5TitleValue  !== "Legend 5" ? legend5TitleValue : ""}  
                            className='legend-title' 
                            placeholder="Legend's Title" 
                            onChange={handleTitle5Change}
                            type='text'
                            ></input>

                        
                        <div className='legend-show'>
                            <input 
                                type='checkbox'
                                onChange={(e) => setShowLabel5(e.target.checked)}
                                checked={showLabel5}
                                >

                            </input>
                            <label>Show label on map</label>
                        </div>
                        
                        

                    </div>


                    <CompactPicker 
                        className='color-picker'
                        color={legend5ColorValue}
                        value={legend5ColorValue}
                        onChangeComplete={handleColorChange} 
                        
                        />
                    
                   
                    
                </div>

                
                    <Countries
                    legend5ColorValue={legend5ColorValue}
                    setLegend5ColorValue={setLegend5ColorValue}
                    legend={5}
                    
                    legend1CountryValue={legend1CountryValue}
                    setLegend1CountryValue={setLegend1CountryValue}
                    
                    legend2CountryValue={legend2CountryValue}
                    setLegend2CountryValue={setLegend2CountryValue}
                    
                    legend3CountryValue={legend3CountryValue}
                    setLegend3CountryValue={setLegend3CountryValue}

                    legend4CountryValue={legend4CountryValue}
                    setLegend4CountryValue={setLegend4CountryValue}

                    legend5CountryValue={legend5CountryValue}
                    setLegend5CountryValue={setLegend5CountryValue}


                
                    

                />
               
                
            </div>
            
            
        </div>
    )

   
}

export default Legend5