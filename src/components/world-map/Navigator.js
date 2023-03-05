import React, { useState, Component } from 'react'
import '../App.css'
import Group1 from './groups/Group1'
import Group2 from './groups/Group2'
import Group3 from './groups/Group3'
import Group4 from './groups/Group4'
import Group5 from './groups/Group5'
import Group6 from './groups/Group6'
import Group7 from './groups/Group7'
import Group8 from './groups/Group8'
import NavButton from '../NavButton'



function Navigator({ 
    group1TitleValue, 
    group2TitleValue ,
    group3TitleValue,
    group4TitleValue,
    group5TitleValue,
    group6TitleValue,
    group7TitleValue,
    group8TitleValue,




    handleTitle1ValueChange,
    handleTitle2ValueChange, 
    handleTitle3ValueChange,
    handleTitle4ValueChange,
    handleTitle5ValueChange,
    handleTitle6ValueChange,
    handleTitle7ValueChange,
    handleTitle8ValueChange,




    group1ColorValue, 
    group2ColorValue, 
    group3ColorValue,
    group4ColorValue,
    group5ColorValue,
    group6ColorValue,
    group7ColorValue,
    group8ColorValue,





    setGroup1ColorValue, 
    setGroup2ColorValue,
    setGroup3ColorValue,
    setGroup4ColorValue,
    setGroup5ColorValue,
    setGroup6ColorValue,
    setGroup7ColorValue,
    setGroup8ColorValue,






    numItems,
    setNumItems



}) {


    
    const [ activeGroup, setActiveGroup ] = useState(1);



    const [ activeButton, setActiveButton ] = useState(1)

    
    const [group1CountryValue, setGroup1CountryValue] = useState('');

    const [group2CountryValue, setGroup2CountryValue] = useState('')

    const [ group3CountryValue, setGroup3CountryValue] = useState('')

    const [ group4CountryValue, setGroup4CountryValue ] = useState('')

    const [ group5CountryValue, setGroup5CountryValue ] = useState('')

    const [ group6CountryValue, setGroup6CountryValue ] = useState('')

    const [ group7CountryValue, setGroup7CountryValue ] = useState('')

    const [ group8CountryValue, setGroup8CountryValue ] = useState('')




    

   const handleButtonClick = (buttonNum) => {
    setActiveGroup(buttonNum)
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
                

                <Group1
                    activeGroup={activeGroup }
                    
                    // color value
                    group1ColorValue={group1ColorValue}
                    setGroup1ColorValue={setGroup1ColorValue}

                    // country value
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

                    // group title
                    group1TitleValue={group1TitleValue}
                    handleTitle1ValueChange={handleTitle1ValueChange}

            
                   
                   
                    
                    

                />
                <Group2
                    activeGroup={activeGroup }
                    
                    // color value
                    group2ColorValue={group2ColorValue}
                    setGroup2ColorValue={setGroup2ColorValue}

                    // country value
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

                    // group title
                    group2TitleValue={group2TitleValue}
                    handleTitle2ValueChange={handleTitle2ValueChange}

            
                   
                   
                    
                    

                />

                <Group3
                    activeGroup={activeGroup}

                    // color value
                    group3ColorValue={group3ColorValue}
                    setGroup3ColorValue={setGroup3ColorValue}

                    // country value
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

                    // group title
                    group3TitleValue={group3TitleValue}
                    handleTitle3ValueChange={handleTitle3ValueChange}

               
                />

                <Group4
                    activeGroup={activeGroup}

                    // color value
                    group4ColorValue={group4ColorValue}
                    setGroup4ColorValue={setGroup4ColorValue}

                    // country value
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

                    // group title
                    group4TitleValue={group4TitleValue}
                    handleTitle4ValueChange={handleTitle4ValueChange}

         
                />

                <Group5
                    activeGroup={activeGroup}

                    // color value
                    group5ColorValue={group5ColorValue}
                    setGroup5ColorValue={setGroup5ColorValue}

                    // country value
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

                    // group title
                    group5TitleValue={group5TitleValue}
                    handleTitle5ValueChange={handleTitle5ValueChange}




                />

                <Group6
                    activeGroup={activeGroup}

                    // color value
                    group6ColorValue={group6ColorValue}
                    setGroup6ColorValue={setGroup6ColorValue}

                    // country value
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

                    // group title
                    group6TitleValue={group6TitleValue}
                    handleTitle6ValueChange={handleTitle6ValueChange}


                />

                <Group7
                    activeGroup={activeGroup}

                    // color value
                    group7ColorValue={group7ColorValue}
                    setGroup7ColorValue={setGroup7ColorValue}

                    // country value
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

                    // group title
                    group7TitleValue={group7TitleValue}
                    handleTitle7ValueChange={handleTitle7ValueChange}


                />

                <Group8
                    activeGroup={activeGroup}

                    // color value
                    group8ColorValue={group8ColorValue}
                    setGroup8ColorValue={setGroup8ColorValue}

                    // country value
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

                    // group title
                    group8TitleValue={group8TitleValue}
                    handleTitle8ValueChange={handleTitle8ValueChange}


                />

                
            

        
            
            
        </div>
    )

    


}

export default Navigator