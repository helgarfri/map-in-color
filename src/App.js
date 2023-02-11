import './App.css';
import WorldMap from './WorldStates';
import './WorldMap.css'
import Navigator from './Navigator';
import { useState } from 'react';
import './WorldStates'
import './Countries'





function App() {


  const [legend1TitleValue, setLegend1TitleValue] = useState('')
  const [legend2TitleValue, setLegend2TitleValue] =useState('')
  

  const [legend1ColorValue, setLegend1ColorValue] = useState('#000000')
  const [legend2ColorValue, setLegend2ColorValue] = useState('#000000')
  


  const handleTitle1ValueChange = (newValue) => {
    setLegend1TitleValue(newValue)
  }

  const handleTitle2ValueChange = (newValue) => {
    setLegend2TitleValue(newValue)
  }

  return (
    <div className="App">
      <WorldMap 
          legend1TitleValue={legend1TitleValue}
          legend2TitleValue={legend2TitleValue}
          
          
          
          legend1ColorValue={legend1ColorValue}
          legend2ColorValue={legend2ColorValue}
          setLegend1ColorValue={setLegend1ColorValue}
          setLegend2ColorValue={setLegend2ColorValue}

        />
      <Navigator 
          legend1TitleValue={legend1TitleValue}
          legend2TitleValue={legend2TitleValue}
          handleTitle1ValueChange={handleTitle1ValueChange}
          handleTitle2ValueChange={handleTitle2ValueChange}
          legend1ColorValue={legend1ColorValue}
          legend2ColorValue={legend2ColorValue}
          setLegend1ColorValue={setLegend1ColorValue}
          setLegend2ColorValue={setLegend2ColorValue}


      />
      

      </div>
  );
}

export default App;
