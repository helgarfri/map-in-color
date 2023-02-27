import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from './Countries';
import React, { Component, useEffect, useState } from 'react';
import './Navigator'
import { CompactPicker, SketchPicker } from 'react-color'
import Navigator from './Navigator';



 

function Legend7({
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
    legend6CountryValue,
    setLegend6CountryValue,
    legend7CountryValue,
    setLegend7CountryValue,
    legend8CountryValue,
    setLegend8CountryValue,

    activeLegend, 
    legend7ColorValue, 
    setLegend7ColorValue, 
    handleTitle7ValueChange,
   
    
}) {


    
   
      

    const handleColorChange = (color) =>{
        setLegend7ColorValue(color.hex)
        for (var i = 0; i < legend7CountryValue.length; i++) {
            const id = legend7CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle7Change = (event) => {
        handleTitle7ValueChange(event.target.value)

        
    }


        if (activeLegend !== 7) {
            return null
        } 

        
    return(
        <div>
            <div className='legend'>


                <div className='legend-set'>
                    
                    <div className='legend-title'>
                        
                        <input 
                            className='legend-title' 
                            placeholder="Click to add title" 
                            onChange={handleTitle7Change}
                            type='text'
                            ></input>

                        
                     
                        

                    </div>


                    <CompactPicker 
                        className='color-picker'
                        color={legend7ColorValue}
                        value={legend7ColorValue}
                        onChangeComplete={handleColorChange} 
                        
                        />
                    
                   
                    
                </div>

                
                    <Countries
                    legend7ColorValue={legend7ColorValue}
                    setLegend7ColorValue={setLegend7ColorValue}
                    legend={7}
                    
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

                    legend6CountryValue={legend6CountryValue}
                    setLegend6CountryValue={setLegend6CountryValue}

                    legend7CountryValue={legend7CountryValue}
                    setLegend7CountryValue={setLegend7CountryValue}

                    legend8CountryValue={legend8CountryValue}
                    setLegend8CountryValue={setLegend8CountryValue}


                
                    

                />
               
                
            </div>
            
            
        </div>
    )

   
}

export default Legend7