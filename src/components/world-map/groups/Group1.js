import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from '../Countries';
import React, { Component, useEffect, useState } from 'react';
import { CompactPicker, SketchPicker } from 'react-color'


 

function Group1({
    group1CountryValue, 
    setGroup1CountryValue, 
    group2CountryValue,
    setGroup2CountryValue,
    group3CountryValue,
    setGroup3CountryValue,
    group4CountryValue,
    setGroup4CountryValue,
    group5CountryValue,
    setGroup5CountryValue,
    group6CountryValue,
    setGroup6CountryValue,
    group7CountryValue,
    setGroup7CountryValue,
    group8CountryValue,
    setGroup8CountryValue,


    activeGroup, 
    group1ColorValue, 
    setGroup1ColorValue, 
    group1TitleValue, 
    handleTitle1ValueChange,

    
}) {
    

    
   
      

    const handleColorChange = (color) =>{
        setGroup1ColorValue(color.hex)
        for (var i = 0; i < group1CountryValue.length; i++) {
            const id = group1CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle1Change = (event) => {
        handleTitle1ValueChange(event.target.value)

        
    }

   
   



    
    
        if (activeGroup !== 1) {
            return null
        } 

        
    return(
        <div>
            <div className='group'>
                <div className='group-set'>
                    
                    <div className='group-title'>
                        
                        <input 
                            className='group-title' 
                            placeholder="Click to add title" 
                            onChange={handleTitle1Change}
                            type='text'
                            value={group1TitleValue}
                            maxLength='30'
                            ></input>

                        
                   
                        

                    </div>
                

                    <CompactPicker
                        
                        className='color-picker'
                        color={group1ColorValue}
                        value={group1ColorValue}
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
                    group1ColorValue={group1ColorValue}
                    setGroup1ColorValue={setGroup1ColorValue}
                    group={1}
                    
                    group1CountryValue={group1CountryValue}
                    setGroup1CountryValue={setGroup1CountryValue}
                    
                    group2CountryValue={group2CountryValue}
                    setGroup2CountryValue={setGroup2CountryValue}
                    
                    group3CountryValue={group3CountryValue}
                    setGroup3CountryValue={setGroup3CountryValue}

                    group4CountryValue={group4CountryValue}
                    setGroup4CountryValue={setGroup4CountryValue}

                    group5CountryValue={group5CountryValue}
                    setGroup5CountryValue={setGroup5CountryValue}

                    group6CountryValue={group6CountryValue}
                    setGroup6CountryValue={setGroup6CountryValue}

                    group7CountryValue={group7CountryValue}
                    setGroup7CountryValue={setGroup7CountryValue}

                    group8CountryValue={group8CountryValue}
                    setGroup8CountryValue={setGroup8CountryValue}



                
                    

                />
               
                
            </div>
            
            
        </div>
    )

   
}

export default Group1