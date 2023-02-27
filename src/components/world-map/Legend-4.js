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
    legend6CountryValue,
    setLegend6CountryValue,
    legend7CountryValue,
    setLegend7CountryValue,
    legend8CountryValue,
    setLegend8CountryValue,

    activeLegend, 
    legend4ColorValue, 
    setLegend4ColorValue, 
    legend4TitleValue, 
    handleTitle4ValueChange,
  
    
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

   
    




    
    
        if (activeLegend !== 4) {
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
                            onChange={handleTitle4Change}
                            type='text'
                            ></input>

                        
                       
                        
                        

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

export default Legend4