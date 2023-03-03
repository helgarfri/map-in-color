import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from '../Countries';
import React, { Component, useEffect, useState } from 'react';
import { CompactPicker, SketchPicker } from 'react-color'


 

function Group1({
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
    legend1ColorValue, 
    setLegend1ColorValue, 
    legend1TitleValue, 
    handleTitle1ValueChange,

    
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

   
   




    
    
        if (activeLegend !== 1) {
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
                            onChange={handleTitle1Change}
                            type='text'
                            value={legend1TitleValue}
                            ></input>

                        
                   
                        

                    </div>
                

                    <CompactPicker
                        
                        className='color-picker'
                        color={legend1ColorValue}
                        value={legend1ColorValue}
                        onChangeComplete={handleColorChange} 
                        colors={[
                              '#8B0000', //Dark red
                              '#FF0000', // Red
                              '#FF4500', // Orange Red
                              '#FF8C00', // Dark Orange
                              '#FFA500', // Orange
                              '#FFD700', // Gold
                              '#006400', // Dark Green
                              '#008000', // Geen
                              '#008B8B', // Dark Cyan
                              '#00CED1', // Dark Turquoise
                              '#00008B', // Dark Blue
                              '#0000FF', // Blue
                              '#800000', // Maroon
                              '#A52A2A', // Brown
                              '#C71585', // Medium Violet Red 
                              '#DB7093', // PaleVioletRed 
                              '#4B0082', //Indigo
                              '#800080', // Purple
                              '#BDB76B', // Dark Khaki 
                              '#F0E68C', // Khaki
                              '#4682B4', // Steel Blue
                              '#5F9EA0', // Cadet Blue
                              '#BC8F8F', // Rosy Brown
                              '#F4A460', // Sandy Brown
                              '#808000', // Olive
                              '#2F4F4F', // Dark Slate Gray
                              '#778899', // Light Slate Gray
                              '#696969', // Dim Gray
                              '#C0C0C0', // Silver
                              '#CD5C5C', // Indian Red
                              '#000000', //Black
                              '#FFFFFF', // White
                            





                        ]

                        }
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

export default Group1