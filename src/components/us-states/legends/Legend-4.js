import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import React from 'react';
import '../Navigator'
import { CompactPicker } from 'react-color'
import States from '../States';


 

function Legend4({
    activeLegend,
    
    legend4ColorValue,
    setLegend4ColorValue,
    
    legend1StatesValue,
    setLegend1StatesValue,

    legend2StatesValue,
    setLegend2StatesValue,

    legend3StatesValue,
    setLegend3StatesValue,

    legend4StatesValue,
    setLegend4StatesValue,

    legend5StatesValue,
    setLegend5StatesValue,

    legend6StatesValue,
    setLegend6StatesValue,

    legend7StatesValue,
    setLegend7StatesValue,

    legend8StatesValue,
    setLegend8StatesValue,


    handleTitle4ValueChange

    
}) {
    
console.log(legend4ColorValue)
    const handleColorChange = (color) =>{
        setLegend4ColorValue(color.hex)
        for (var i = 0; i < legend4StatesValue.length; i++) {
            const id = legend4StatesValue[i];
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

           
               
                
            </div>
            
            <States
                legend={4}

                    legend4ColorValue={legend4ColorValue}


                    legend1StatesValue={legend1StatesValue}
                    setLegend1StatesValue={setLegend1StatesValue}
    
                    legend2StatesValue={legend2StatesValue}
                    setLegend2StatesValue={setLegend2StatesValue}

                    legend3StatesValue={legend3StatesValue}
                    setLegend3StatesValue={setLegend3StatesValue}

                    legend4StatesValue={legend4StatesValue}
                    setLegend4StatesValue={setLegend4StatesValue}

                    legend5StatesValue={legend5StatesValue}
                    setLegend5StatesValue={setLegend5StatesValue}

                    legend6StatesValue={legend6StatesValue}
                    setLegend6StatesValue={setLegend6StatesValue}

                    legend7StatesValue={legend7StatesValue}
                    setLegend7StatesValue={setLegend7StatesValue}

                    legend8StatesValue={legend8StatesValue}
                    setLegend8StatesValue={setLegend8StatesValue}


                  

            />
            
            
        </div>
    )

   
}

export default Legend4