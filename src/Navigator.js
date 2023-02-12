import React, { useState } from 'react'
import './App.css'
import Legend1 from './Legend-1'
import Legend2 from './Legend-2'
import NavButton from './NavButton'



function Navigator({ 
    legend1TitleValue, 
    legend2TitleValue ,
    handleTitle1ValueChange,
    handleTitle2ValueChange, 
    legend1ColorValue, 
    legend2ColorValue, 
    setLegend1ColorValue, 
    setLegend2ColorValue,
    showLabel1,
    setShowLabel1,
    showLabel2,
    setShowLabel2

}) {
  
    const [ activeLegend, setActiveLegend ] = useState('legend1');


    const [ activeButton, setActiveButton ] = useState(1)

    
    const [legend1CountryValue, setLegend1CountryValue] = useState('');

    const [legend2CountryValue, setLegend2CountryValue] = useState('')

   const handleButton1Click = () => {
    setActiveLegend('legend1')
    setActiveButton(1)
   }

   const handleButton2Click = () => {
    setActiveLegend('legend2')
    setActiveButton(2)
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

                </ul>
                <Legend1
                    activeLegend={activeLegend}
                    legend1ColorValue = {legend1ColorValue}
                    setLegend1ColorValue={setLegend1ColorValue}
                    legend1CountryValue={legend1CountryValue}
                    setLegend1CountryValue={setLegend1CountryValue}
                    legend2CountryValue={legend2CountryValue}
                    setLegend2CountryValue={setLegend2CountryValue}
                    
                    legend1TitleValue={legend1TitleValue}
                    handleTitle1ValueChange={handleTitle1ValueChange}
                    showLabel1={showLabel1}
                    setShowLabel1={setShowLabel1}

                 

                />

                <Legend2
                    activeLegend={activeLegend }
                    legend2ColorValue={legend2ColorValue}
                    setLegend2ColorValue={setLegend2ColorValue}
                    legend1CountryValue={legend1CountryValue}
                    setLegend1CountryValue={setLegend1CountryValue}
                    legend2CountryValue={legend2CountryValue}
                    setLegend2CountryValue={setLegend2CountryValue}
                    legend2TitleValue={legend2TitleValue}
                    handleTitle2ValueChange={handleTitle2ValueChange}

                    showLabel2={showLabel2}
                    setShowLabel2={setShowLabel2}
                    
                   
                   
                    
                    

                />
            </nav>

        
            
            
        </div>
    )

    


}

export default Navigator