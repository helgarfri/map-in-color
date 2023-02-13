import '../world-states.svg'
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from './Countries';
import React, { Component, useEffect, useState } from 'react';
import './Navigator'
import { CompactPicker, SketchPicker } from 'react-color'
import Navigator from './Navigator';



 

function Legend3({
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
    legend3ColorValue, 
    setLegend3ColorValue, 
    legend3TitleValue, 
    handleTitle3ValueChange,
    showLabel3,
    setShowLabel3,
    
}) {


    
   
      

    const handleColorChange = (color) =>{
        setLegend3ColorValue(color.hex)
        for (var i = 0; i < legend3CountryValue.length; i++) {
            const id = legend3CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle3Change = (event) => {
        handleTitle3ValueChange(event.target.value)

        
    }

   
    



    
    
        if (activeLegend !== 'legend3') {
            return null
        } 

        
    return(
        <div>
            <div className='legend'>


                <div className='legend-set'>
                    
                    <div className='legend-title'>
                        
                        <input 
                            value={legend3TitleValue !== "Legend 3" ? legend3TitleValue : ""}  
                            className='legend-title' 
                            placeholder="Legend's Title" 
                            onChange={handleTitle3Change}
                            type='text'
                            ></input>

                        
                        <div className='legend-show'>
                            <input 
                                type='checkbox'
                                onChange={(e) => setShowLabel3(e.target.checked)}
                                checked={showLabel3}
                                >

                            </input>
                            <label>Show label on map</label>
                        </div>
                        
                        

                    </div>


                    <CompactPicker 
                        className='color-picker'
                        color={legend3ColorValue}
                        value={legend3ColorValue}
                        onChangeComplete={handleColorChange} 
                        
                        />
                    
                   
                    
                </div>

                
                    <Countries
                    
                    legend3ColorValue={legend3ColorValue}
                    setLegend3ColorValue={setLegend3ColorValue}
                    
                    legend={3}
                    
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

export default Legend3