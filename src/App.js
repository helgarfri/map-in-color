import './components/App.css';
import './components/world-map/WorldMap.css'
import Header from './components/Header';
import WorldMap from './components/world-map/WorldMap';
import UnitedStates from './components/us-states/UnitedStates';
import { useState } from 'react';
import Europe from './components/europe/Europe';



function App() {

    const [mapTitleValue, setMapTitleValue] = useState('')

    const [legend1TitleValue, setLegend1TitleValue] = useState('Group 1')
    const [legend2TitleValue, setLegend2TitleValue] =useState('Group 2')
    const [legend3TitleValue, setLegend3TitleValue] =useState('Group 3')
    const [legend4TitleValue, setLegend4TitleValue] =useState('Group 4')
    const [legend5TitleValue, setLegend5TitleValue] =useState('Group 5')
    const [legend6TitleValue, setLegend6TitleValue] =useState('Group 6')
    const [legend7TitleValue, setLegend7TitleValue] =useState('Group 7')
    const [legend8TitleValue, setLegend8TitleValue] =useState('Group 8')
  
  
  
  
  
    const [legend1ColorValue, setLegend1ColorValue] = useState('#000000')
    const [legend2ColorValue, setLegend2ColorValue] = useState('#000000')
    const [legend3ColorValue, setLegend3ColorValue] = useState('#000000')
    const [legend4ColorValue, setLegend4ColorValue] = useState('#000000')
    const [legend5ColorValue, setLegend5ColorValue] = useState('#000000')
    const [legend6ColorValue, setLegend6ColorValue] = useState('#000000')
    const [legend7ColorValue, setLegend7ColorValue] = useState('#000000')
    const [legend8ColorValue, setLegend8ColorValue] = useState('#000000')
  
  
  
  
  
    const [selectedRes, setSelectedRes] = useState('13.33');
  
    const [ numItems, setNumItems ] = useState(1)
  
  
    
    const handleMapTitleValueChange = (value) => {
      setMapTitleValue(value)
    }
  
  
    const handleTitle1ValueChange = (newValue) => {
      setLegend1TitleValue(newValue)
    }
  
    const handleTitle2ValueChange = (newValue) => {
      setLegend2TitleValue(newValue)
    }
  
    const handleTitle3ValueChange = (newValue) => {
      setLegend3TitleValue(newValue)
    }
  
    const handleTitle4ValueChange = (newValue) => {
      setLegend4TitleValue(newValue)
    }
  
    const handleTitle5ValueChange = (newValue) => {
      setLegend5TitleValue(newValue)
    }
  
    const handleTitle6ValueChange = (newValue) => {
      setLegend6TitleValue(newValue)
    }
  
    const handleTitle7ValueChange = (newValue) => {
      setLegend7TitleValue(newValue)
    }
  
    const handleTitle8ValueChange = (newValue) => {
      setLegend8TitleValue(newValue)
    }

  let component
  switch (window.location.pathname) {
 
    case '/world-map':
      component = 
      <WorldMap
          legend1TitleValue={legend1TitleValue}
          legend2TitleValue={legend2TitleValue}
          legend3TitleValue={legend3TitleValue}
          legend4TitleValue={legend4TitleValue}
          legend5TitleValue={legend5TitleValue}
          legend6TitleValue={legend6TitleValue}
          legend7TitleValue={legend7TitleValue}
          legend8TitleValue={legend8TitleValue}

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

          mapTitleValue={mapTitleValue}
          handleMapTitleValueChange={handleMapTitleValueChange}

          selectedRes={selectedRes}
          setSelectedRes={setSelectedRes}

          numItems={numItems}
          setNumItems={setNumItems}
      />
    
      break;
    
    case '/us-states':
      component = <UnitedStates
          legend1TitleValue={legend1TitleValue}
          legend2TitleValue={legend2TitleValue}
          legend3TitleValue={legend3TitleValue}
          legend4TitleValue={legend4TitleValue}
          legend5TitleValue={legend5TitleValue}
          legend6TitleValue={legend6TitleValue}
          legend7TitleValue={legend7TitleValue}
          legend8TitleValue={legend8TitleValue}

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

          mapTitleValue={mapTitleValue}
          handleMapTitleValueChange={handleMapTitleValueChange}

          selectedRes={selectedRes}
          setSelectedRes={setSelectedRes}

          numItems={numItems}
          setNumItems={setNumItems}
      />

      break;

    case '/europe':
      component = <Europe
      legend1TitleValue={legend1TitleValue}
          legend2TitleValue={legend2TitleValue}
          legend3TitleValue={legend3TitleValue}
          legend4TitleValue={legend4TitleValue}
          legend5TitleValue={legend5TitleValue}
          legend6TitleValue={legend6TitleValue}
          legend7TitleValue={legend7TitleValue}
          legend8TitleValue={legend8TitleValue}

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

          mapTitleValue={mapTitleValue}
          handleMapTitleValueChange={handleMapTitleValueChange}

          selectedRes={selectedRes}
          setSelectedRes={setSelectedRes}

          numItems={numItems}
          setNumItems={setNumItems}
      />
  }




  return (
    <div className="App">

      <Header/>
      
      {component}
      </div>
  );
}

export default App;
