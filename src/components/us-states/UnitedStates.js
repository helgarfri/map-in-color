import UsMap from "./UsMap"
import Title from "../Title"
import Navigator from "./Navigator"
import MapSettings from "../MapSettings"
import { useState } from "react"

function UnitedStates({
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

    selectedRes,
    setSelectedRes,
  
    numItems,
    setNumItems,

    mapTitleValue,
    handleMapTitleValueChange
}) {

    console.log(group1TitleValue)
    return(

        <div>

            
            <UsMap
            mapTitleValue={mapTitleValue}
            handleMapTitleValueChange={handleMapTitleValueChange}

          
            group1TitleValue={group1TitleValue}
            group2TitleValue={group2TitleValue}
            group3TitleValue={group3TitleValue}
            group4TitleValue={group4TitleValue}
            group5TitleValue={group5TitleValue}
            group6TitleValue={group6TitleValue}
            group7TitleValue={group7TitleValue}
            group8TitleValue={group8TitleValue}
  
  
  
  
  
            group1ColorValue={group1ColorValue}
            group2ColorValue={group2ColorValue}
            group3ColorValue={group3ColorValue}
            group4ColorValue={group4ColorValue}
            group5ColorValue={group5ColorValue}
            group6ColorValue={group6ColorValue}
            group7ColorValue={group7ColorValue}
            group8ColorValue={group8ColorValue}
        
  
  
  
            selectedRes={selectedRes}
            setSelectedRes={setSelectedRes}
  
    
  
            numItems={numItems}
            setNumItems={setNumItems}

            />

           


            <Navigator
            handleTitle1ValueChange={handleTitle1ValueChange}
            handleTitle2ValueChange={handleTitle2ValueChange}
            handleTitle3ValueChange={handleTitle3ValueChange}
            handleTitle4ValueChange={handleTitle4ValueChange}
            handleTitle5ValueChange={handleTitle5ValueChange}
            handleTitle6ValueChange={handleTitle6ValueChange}
            handleTitle7ValueChange={handleTitle7ValueChange}
            handleTitle8ValueChange={handleTitle8ValueChange}


            group1ColorValue={group1ColorValue}
            group2ColorValue={group2ColorValue}
            group3ColorValue={group3ColorValue}
            group4ColorValue={group4ColorValue}
            group5ColorValue={group5ColorValue}
            group6ColorValue={group6ColorValue}
            group7ColorValue={group7ColorValue}
            group8ColorValue={group8ColorValue}


            setGroup1ColorValue={setGroup1ColorValue}
            setGroup2ColorValue={setGroup2ColorValue}
            setGroup3ColorValue={setGroup3ColorValue}
            setGroup4ColorValue={setGroup4ColorValue}
            setGroup5ColorValue={setGroup5ColorValue}
            setGroup6ColorValue={setGroup6ColorValue}
            setGroup7ColorValue={setGroup7ColorValue}
            setGroup8ColorValue={setGroup8ColorValue}

            numItems={numItems}
            setNumItems={setNumItems}

        
            
            />
        </div>
    )
}

export default UnitedStates