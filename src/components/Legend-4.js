import '../world-states.svg'
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from './Countries';
import React, { Component, useEffect, useState } from 'react';
import './Navigator'
import { CompactPicker, SketchPicker } from 'react-color'
import Navigator from './Navigator';



 

function Legend4({
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
    legend4ColorValue, 
    setLegend4ColorValue, 
    legend4TitleValue, 
    handleTitle4ValueChange,
    showLabel4,
    setShowLabel4
    
}) {


    
   
      

    const handleColorChange = (color) =>{
        setLegend4ColorValue(color.hex)
        for (var i = 0; i < legend4CountryValue.length; i++) {
            const id = legend4CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle4Change = (event) => {
        handleTitle4ValueChange(event.target.value)

        
    }

   
    




    
    
        if (activeLegend !== 'legend4') {
            return null
        } 

        
    return(
        <div>
            <div className='legend'>


                <div className='legend-set'>
                    
                    <div className='legend-title'>
                        
                        <input 
                            value={legend4TitleValue  !== "Legend 4" ? legend4TitleValue : ""}  
                            className='legend-title' 
                            placeholder="Legend's Title" 
                            onChange={handleTitle4Change}
                            type='text'
                            ></input>

                        
                        <div className='legend-show'>
                            <input 
                                type='checkbox'
                                onChange={(e) => setShowLabel4(e.target.checked)}
                                checked={showLabel4}
                                >

                            </input>
                            <label>Show label on map</label>
                        </div>
                        
                        

                    </div>


                    <CompactPicker 
                        className='color-picker'
                        color={legend4ColorValue}
                        value={legend4ColorValue}
                        onChangeComplete={handleColorChange} 
                        
                        />
                    
                   
                    
                </div>

                
                    <Countries
                    legend4ColorValue={legend4ColorValue}
                    setLegend4ColorValue={setLegend4ColorValue}
                    legend={4}
                    
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

export default Legend4