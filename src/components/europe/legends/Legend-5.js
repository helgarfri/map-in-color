import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from '../Countries';
import React, { Component, useEffect, useState } from 'react';
import { CompactPicker, SketchPicker } from 'react-color'



 

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
    legend6CountryValue,
    setLegend6CountryValue,
    legend7CountryValue,
    setLegend7CountryValue,
    legend8CountryValue,
    setLegend8CountryValue,

    activeLegend, 
    legend5ColorValue, 
    setLegend5ColorValue, 
    legend5TitleValue, 
    handleTitle5ValueChange,
   
    
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


        if (activeLegend !== 5) {
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
                            onChange={handleTitle5Change}
                            type='text'
                            ></input>

                        
                     
                        

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

export default Legend5