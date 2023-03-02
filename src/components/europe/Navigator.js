import React, { useState, Component } from 'react'
import '../App.css'
import Legend1 from './legends/Legend-1'
import Legend2 from './legends/Legend-2'
import Legend3 from './legends/Legend-3'
import Legend4 from './legends/Legend-4'
import Legend5 from './legends/Legend-5'
import Legend6 from './legends/Legend-6'
import Legend7 from './legends/Legend-7'
import Legend8 from './legends/Legend-8'
import NavButton from '../NavButton'



function Navigator({ 
    legend1TitleValue, 
    legend2TitleValue ,
    legend3TitleValue,
    legend4TitleValue,
    legend5TitleValue,
    legend6TitleValue,
    legend7TitleValue,
    legend8TitleValue,




    handleTitle1ValueChange,
    handleTitle2ValueChange, 
    handleTitle3ValueChange,
    handleTitle4ValueChange,
    handleTitle5ValueChange,
    handleTitle6ValueChange,
    handleTitle7ValueChange,
    handleTitle8ValueChange,




    legend1ColorValue, 
    legend2ColorValue, 
    legend3ColorValue,
    legend4ColorValue,
    legend5ColorValue,
    legend6ColorValue,
    legend7ColorValue,
    legend8ColorValue,





    setLegend1ColorValue, 
    setLegend2ColorValue,
    setLegend3ColorValue,
    setLegend4ColorValue,
    setLegend5ColorValue,
    setLegend6ColorValue,
    setLegend7ColorValue,
    setLegend8ColorValue,






    numItems,
    setNumItems



}) {


    
    const [ activeLegend, setActiveLegend ] = useState(1);



    const [ activeButton, setActiveButton ] = useState(1)

    
    const [legend1CountryValue, setLegend1CountryValue] = useState('');

    const [legend2CountryValue, setLegend2CountryValue] = useState('')

    const [ legend3CountryValue, setLegend3CountryValue] = useState('')

    const [ legend4CountryValue, setLegend4CountryValue ] = useState('')

    const [ legend5CountryValue, setLegend5CountryValue ] = useState('')

    const [ legend6CountryValue, setLegend6CountryValue ] = useState('')

    const [ legend7CountryValue, setLegend7CountryValue ] = useState('')

    const [ legend8CountryValue, setLegend8CountryValue ] = useState('')




    

   const handleButtonClick = (buttonNum) => {
    setActiveLegend(buttonNum)
    setActiveButton(buttonNum)
   }

   const handleAddButtonClick = () => {
    if (numItems < 8) {
        var addButton = document.getElementById('addButton')

      setNumItems(numItems + 1);
      
    } if (numItems >= 7) {
        addButton.style.display = 'none'
    }  
  };


    
    return(

        <div>

            <ul className='class-items'>
            {Array.from({ length: Math.min(numItems, 8) }, (_, index) => (<li className='nav-button' key={index}>
            <NavButton
              onClick={() => handleButtonClick(index + 1)}
              label={`Group ${index + 1}`}
              active={activeButton === index + 1}
              index={index}
              numItems={numItems}
              setNumItems={setNumItems}
              
            />
             
          </li>
        ))}

        <button id='addButton' className='add-button' onClick={handleAddButtonClick}><img className='add-img' src='../assets/plus.png'></img></button>
                

        

                </ul>
                <Legend1
                    activeLegend={activeLegend}
                     // color value
                    legend1ColorValue = {legend1ColorValue}
                    setLegend1ColorValue={setLegend1ColorValue}
                    
                    // country value
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
                    
                    // legend title
                    legend1TitleValue={legend1TitleValue}
                    handleTitle1ValueChange={handleTitle1ValueChange}


                 

                />

                <Legend2
                    activeLegend={activeLegend }
                    
                    // color value
                    legend2ColorValue={legend2ColorValue}
                    setLegend2ColorValue={setLegend2ColorValue}

                    // country value
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

                    // legend title
                    legend2TitleValue={legend2TitleValue}
                    handleTitle2ValueChange={handleTitle2ValueChange}

            
                   
                   
                    
                    

                />

                <Legend3
                    activeLegend={activeLegend}

                    // color value
                    legend3ColorValue={legend3ColorValue}
                    setLegend3ColorValue={setLegend3ColorValue}

                    // country value
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

                    // legend title
                    legend3TitleValue={legend3TitleValue}
                    handleTitle3ValueChange={handleTitle3ValueChange}

               
                />

                <Legend4
                    activeLegend={activeLegend}

                    // color value
                    legend4ColorValue={legend4ColorValue}
                    setLegend4ColorValue={setLegend4ColorValue}

                    // country value
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

                    // legend title
                    legend4TitleValue={legend4TitleValue}
                    handleTitle4ValueChange={handleTitle4ValueChange}

         
                />

                <Legend5
                    activeLegend={activeLegend}

                    // color value
                    legend5ColorValue={legend5ColorValue}
                    setLegend5ColorValue={setLegend5ColorValue}

                    // country value
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

                    // legend title
                    legend5TitleValue={legend5TitleValue}
                    handleTitle5ValueChange={handleTitle5ValueChange}




                />

                <Legend6
                    activeLegend={activeLegend}

                    // color value
                    legend6ColorValue={legend6ColorValue}
                    setLegend6ColorValue={setLegend6ColorValue}

                    // country value
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

                    // legend title
                    legend6TitleValue={legend6TitleValue}
                    handleTitle6ValueChange={handleTitle6ValueChange}


                />

                <Legend7
                    activeLegend={activeLegend}

                    // color value
                    legend7ColorValue={legend7ColorValue}
                    setLegend7ColorValue={setLegend7ColorValue}

                    // country value
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

                    // legend title
                    legend7TitleValue={legend7TitleValue}
                    handleTitle7ValueChange={handleTitle7ValueChange}


                />

                <Legend8
                    activeLegend={activeLegend}

                    // color value
                    legend8ColorValue={legend8ColorValue}
                    setLegend8ColorValue={setLegend8ColorValue}

                    // country value
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

                    // legend title
                    legend8TitleValue={legend8TitleValue}
                    handleTitle8ValueChange={handleTitle8ValueChange}


                />

                
            

        
            
            
        </div>
    )

    


}

export default Navigator