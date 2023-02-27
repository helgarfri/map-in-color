import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import React from 'react';
import '../Navigator'
import { CompactPicker } from 'react-color'
import States from '../States';


 

function Legend2({
    activeLegend,
    legend2ColorValue,
    setLegend2ColorValue,
    
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


    handleTitle2ValueChange

    
}) {
    
console.log(legend2ColorValue)
    const handleColorChange = (color) =>{
        setLegend2ColorValue(color.hex)
        for (var i = 0; i < legend2StatesValue.length; i++) {
            const id = legend2StatesValue[i];
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

           
               
                
            </div>
            
            <States
                legend={2}

                    legend2ColorValue={legend2ColorValue}


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

export default Legend2