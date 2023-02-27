import UsMap from "./UsMap"
import Title from "../Title"
import Navigator from "./Navigator"
import MapSettings from "../MapSettings"
import { useState } from "react"

function UnitedStates({
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

    selectedRes,
    setSelectedRes,
  
    numItems,
    setNumItems,

    mapTitleValue,
    handleMapTitleValueChange
}) {

    console.log(legend1TitleValue)
    return(

        <div>

            
            <UsMap
            mapTitleValue={mapTitleValue}
          
            legend1TitleValue={legend1TitleValue}
            legend2TitleValue={legend2TitleValue}
            legend3TitleValue={legend3TitleValue}
            legend4TitleValue={legend4TitleValue}
            legend5TitleValue={legend5TitleValue}
            legend6TitleValue={legend6TitleValue}
            legend7TitleValue={legend7TitleValue}
            legend8TitleValue={legend8TitleValue}
  
  
  
  
  
            legend1ColorValue={legend1ColorValue}
            legend2ColorValue={legend2ColorValue}
            legend3ColorValue={legend3ColorValue}
            legend4ColorValue={legend4ColorValue}
            legend5ColorValue={legend5ColorValue}
            legend6ColorValue={legend6ColorValue}
            legend7ColorValue={legend7ColorValue}
            legend8ColorValue={legend8ColorValue}
        
  
  
  
            selectedRes={selectedRes}
            setSelectedRes={setSelectedRes}
  
    
  
            numItems={numItems}
            setNumItems={setNumItems}

            />

            <Title
            handleMapTitleValueChange={handleMapTitleValueChange}
            mapTitleValue={mapTitleValue}
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


            legend1ColorValue={legend1ColorValue}
            legend2ColorValue={legend2ColorValue}
            legend3ColorValue={legend3ColorValue}
            legend4ColorValue={legend4ColorValue}
            legend5ColorValue={legend5ColorValue}
            legend6ColorValue={legend6ColorValue}
            legend7ColorValue={legend7ColorValue}
            legend8ColorValue={legend8ColorValue}


            setLegend1ColorValue={setLegend1ColorValue}
            setLegend2ColorValue={setLegend2ColorValue}
            setLegend3ColorValue={setLegend3ColorValue}
            setLegend4ColorValue={setLegend4ColorValue}
            setLegend5ColorValue={setLegend5ColorValue}
            setLegend6ColorValue={setLegend6ColorValue}
            setLegend7ColorValue={setLegend7ColorValue}
            setLegend8ColorValue={setLegend8ColorValue}

            numItems={numItems}
            setNumItems={setNumItems}

        
            
            />
        </div>
    )
}

export default UnitedStates