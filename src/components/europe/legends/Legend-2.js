import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from '../Countries';
import React, { Component, useState } from 'react';
import { CompactPicker, SketchPicker } from 'react-color'



 

function Legend2({
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
    legend2ColorValue, 
    setLegend2ColorValue, 
    legend2TitleValue, 
    handleTitle2ValueChange,
  

}) {

    



   

    const handleColorChange = (color) =>{
        setLegend2ColorValue(color.hex)
        for (var i = 0; i < legend2CountryValue.length; i++) {
            const id = legend2CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }

    }

    const handleTitle2Change = (event) => {
        handleTitle2ValueChange(event.target.value)
    }


   
    if (activeLegend !== 2) {
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
                            onChange={handleTitle2Change}
                            type='text'
                            ></input>

                          
                    </div>


                    <CompactPicker 
                        className='color-picker'
                        color={legend2ColorValue}
                        value={legend2ColorValue}
                        onChangeComplete={handleColorChange} 
                        
                        />
                    
                   
                    
                </div>
             
                    <Countries
                    legend2ColorValue={legend2ColorValue}
                    setLegend2ColorValue={setLegend2ColorValue}
                    legend={2}
                    
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

export default Legend2