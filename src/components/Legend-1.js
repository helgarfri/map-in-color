import '../world-states.svg'
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from './Countries';
import React, { Component, useEffect, useState } from 'react';
import './Navigator'
import { CompactPicker, SketchPicker } from 'react-color'
import Navigator from './Navigator';


 

function Legend1({
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
    legend1ColorValue, 
    setLegend1ColorValue, 
    legend1TitleValue, 
    handleTitle1ValueChange,
    showLabel1,
    setShowLabel1
    
}) {
    

    
   
      

    const handleColorChange = (color) =>{
        setLegend1ColorValue(color.hex)
        for (var i = 0; i < legend1CountryValue.length; i++) {
            const id = legend1CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle1Change = (event) => {
        handleTitle1ValueChange(event.target.value)

        
    }

   
   




    
    
        if (activeLegend !== 'legend1') {
            return null
        } 

        
    return(
        <div>
            <div className='legend'>
                <div className='legend-set'>
                    
                    <div className='legend-title'>
                        
                        <input 
                            value={legend1TitleValue  !== "Legend 1" ? legend1TitleValue : ""}  
                            className='legend-title' 
                            placeholder="Legend's Title" 
                            onChange={handleTitle1Change}
                            type='text'
                            ></input>

                        
                        <div className='legend-show'>
                            <input 
                                type='checkbox'
                                onChange={(e) => setShowLabel1(e.target.checked)}
                                checked={showLabel1}
                                >

                            </input>
                            <label>Show label on map</label>
                        </div>
                        
                        

                    </div>


                    <CompactPicker 
                        className='color-picker'
                        color={legend1ColorValue}
                        value={legend1ColorValue}
                        onChangeComplete={handleColorChange} 
                        
                        />
                    
                   
                    
                </div>

                
                    <Countries
                    legend1ColorValue={legend1ColorValue}
                    setLegend1ColorValue={setLegend1ColorValue}
                    legend={1}
                    
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

export default Legend1