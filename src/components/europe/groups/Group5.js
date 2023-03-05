import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from '../Countries';
import React, { Component, useEffect, useState } from 'react';
import { CompactPicker, SketchPicker } from 'react-color'



 

function Group5({
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
    group5ColorValue, 
    setGroup5ColorValue, 
    group5TitleValue, 
    handleTitle5ValueChange,
   
    
}) {


    
   
      

    const handleColorChange = (color) =>{
        setGroup5ColorValue(color.hex)
        for (var i = 0; i < group5CountryValue.length; i++) {
            const id = group5CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle5Change = (event) => {
        handleTitle5ValueChange(event.target.value)

        
    }


        if (activeGroup !== 5) {
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
                            onChange={handleTitle5Change}
                            type='text'
                            ></input>

                        
                     
                        

                    </div>


                    <CompactPicker
                        
                        className='color-picker'
                        color={group5ColorValue}
                        value={group5ColorValue}
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
                    group5ColorValue={group5ColorValue}
                    setGroup5ColorValue={setGroup5ColorValue}
                    group={5}
                    
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

export default Group5