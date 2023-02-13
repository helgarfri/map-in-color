import React, { useState } from 'react'
import './App.css'
import Legend1 from './Legend-1'
import Legend2 from './Legend-2'
import Legend3 from './Legend-3'
import Legend4 from './Legend-4'
import Legend5 from './Legend-5'
import NavButton from './NavButton'



function Navigator({ 
    legend1TitleValue, 
    legend2TitleValue ,
    legend3TitleValue,
    legend4TitleValue,
    legend5TitleValue,



    handleTitle1ValueChange,
    handleTitle2ValueChange, 
    handleTitle3ValueChange,
    handleTitle4ValueChange,
    handleTitle5ValueChange,



    legend1ColorValue, 
    legend2ColorValue, 
    legend3ColorValue,
    legend4ColorValue,
    legend5ColorValue,



    setLegend1ColorValue, 
    setLegend2ColorValue,
    setLegend3ColorValue,
    setLegend4ColorValue,
    setLegend5ColorValue,


    
    
    showLabel1,
    showLabel2,
    showLabel3,
    showLabel4,
    showLabel5,



    
    setShowLabel1,
    setShowLabel2,
    setShowLabel3,
    setShowLabel4,
    setShowLabel5,



}) {
  
    const [ activeLegend, setActiveLegend ] = useState('legend1');


    const [ activeButton, setActiveButton ] = useState(1)

    
    const [legend1CountryValue, setLegend1CountryValue] = useState('');

    const [legend2CountryValue, setLegend2CountryValue] = useState('')

    const [ legend3CountryValue, setLegend3CountryValue] = useState('')

    const [ legend4CountryValue, setLegend4CountryValue ] = useState('')

    const [ legend5CountryValue, setLegend5CountryValue ] = useState('')


 

   const handleButton1Click = () => {
    setActiveLegend('legend1')
    setActiveButton(1)
   }

   const handleButton2Click = () => {
    setActiveLegend('legend2')
    setActiveButton(2)
}

    const handleButton3Click = () => {
        setActiveLegend('legend3')
        setActiveButton(3)
    }

    const handleButton4Click = () => {
        setActiveLegend('legend4')
        setActiveButton(4)
    }

    const handleButton5Click = () => {
        setActiveLegend('legend5')
        setActiveButton(5)
    }
  
  
  
  

    
    return(

        <div>
            <nav className='legend-nav'>
                <ul className='class-items'>
                    
                <NavButton 
                    onClick={handleButton1Click} 
                    label={legend1TitleValue && legend1TitleValue !== "" ? legend1TitleValue : "Legend 1"}
                    active={activeButton === 1}
                    />

                <NavButton 
                    onClick={handleButton2Click} 
                    label={legend2TitleValue && legend2TitleValue !== "" ? legend2TitleValue : "Legend 2"}
                    active={activeButton === 2}
                    
                    />

                <NavButton 
                    onClick={handleButton3Click} 
                    label={legend3TitleValue && legend3TitleValue !== "" ? legend3TitleValue : "Legend 3"}
                    active={activeButton === 3}
                    
                    />

                <NavButton 
                    onClick={handleButton4Click} 
                    label={legend4TitleValue && legend4TitleValue !== "" ? legend4TitleValue : "Legend 4"}
                    active={activeButton === 4}
                    
                    />

                <NavButton 
                    onClick={handleButton5Click} 
                    label={legend5TitleValue && legend5TitleValue !== "" ? legend5TitleValue : "Legend 5"}
                    active={activeButton === 5}
                    
                    />

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
                    
                    // legend title
                    legend1TitleValue={legend1TitleValue}
                    handleTitle1ValueChange={handleTitle1ValueChange}

                    // show label
                    showLabel1={showLabel1}
                    setShowLabel1={setShowLabel1}

                 

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

                    // legend title
                    legend2TitleValue={legend2TitleValue}
                    handleTitle2ValueChange={handleTitle2ValueChange}

                    // show label
                    showLabel2={showLabel2}
                    setShowLabel2={setShowLabel2}
                    
                   
                   
                    
                    

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

                    // legend title
                    legend3TitleValue={legend3TitleValue}
                    handleTitle3ValueChange={handleTitle3ValueChange}

                    // show label
                    showLabel3={showLabel3}
                    setShowLabel3={setShowLabel3}

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

                    // legend title
                    legend4TitleValue={legend4TitleValue}
                    handleTitle4ValueChange={handleTitle4ValueChange}

                    // show label
                    showLabel4={showLabel4}
                    setShowLabel4={setShowLabel4}

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

                    // legend title
                    legend5TitleValue={legend5TitleValue}
                    handleTitle5ValueChange={handleTitle5ValueChange}

                    // show label
                    showLabel5={showLabel5}
                    setShowLabel5={setShowLabel5}

                />

                
            </nav>

        
            
            
        </div>
    )

    


}

export default Navigator