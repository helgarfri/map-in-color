import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from '../Countries';
import { CompactPicker } from 'react-color'



 

function Group8({
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
    group8ColorValue, 
    setGroup8ColorValue, 

    group8TitleValue,
    handleTitle8ValueChange,

    selectedOption,
    setSelectedOption
   
    
}) {


    
   
      

    const handleColorChange = (color) =>{
        setGroup8ColorValue(color.hex)
        for (var i = 0; i < group8CountryValue.length; i++) {
            const id = group8CountryValue[i];
            document.getElementById(id).style.fill = color.hex;
          }
    }


    const handleTitle8Change = (event) => {
        handleTitle8ValueChange(event.target.value)

        
    }


        if (activeGroup !== 8) {
            return null
        } 

        
    return(
        <div>
            <div className='group-eu'>


                <div className='group-set'>
                    
                    <div className='group-title'>
                        
                        <input 
                            className='group-title' 
                            placeholder="Click to add title" 
                            onChange={handleTitle8Change}
                            type='text'
                            value={group8TitleValue}
                            maxLength='30'
                            ></input>

                        
                     
                        

                    </div>


                    <CompactPicker
                        
                        className='color-picker'
                        color={group8ColorValue}
                        value={group8ColorValue}
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
                    group8ColorValue={group8ColorValue}
                    setGroup8ColorValue={setGroup8ColorValue}
                    group={8}
                    
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

                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}


                
                    

                />
               
                
            </div>
            
            
        </div>
    )

   
}

export default Group8