import './components/App.css';
import WorldMap from './components/WorldStates';
import './components/WorldMap.css'
import Navigator from './components/Navigator';
import { useState } from 'react';
import './components/WorldStates'
import Header from './components/Header';
import Title from './components/Title';




function App() {

  const [mapTitleValue, setMapTitleValue] = useState('')

  const [legend1TitleValue, setLegend1TitleValue] = useState('Legend 1')
  const [legend2TitleValue, setLegend2TitleValue] =useState('Legend 2')
  const [legend3TitleValue, setLegend3TitleValue] =useState('Legend 3')
  const [legend4TitleValue, setLegend4TitleValue] =useState('Legend 4')
  const [legend5TitleValue, setLegend5TitleValue] =useState('Legend 5')

  const [showLabel, setShowLabel] = useState()
  
  const [ showLabel1, setShowLabel1 ] = useState()
  const [ showLabel2, setShowLabel2 ] = useState()
  const [ showLabel3, setShowLabel3 ] = useState()
  const [ showLabel4, setShowLabel4 ] = useState()
  const [ showLabel5, setShowLabel5 ] = useState()


  const [legend1ColorValue, setLegend1ColorValue] = useState('#000000')
  const [legend2ColorValue, setLegend2ColorValue] = useState('#000000')
  const [legend3ColorValue, setLegend3ColorValue] = useState('#000000')
  const [legend4ColorValue, setLegend4ColorValue] = useState('#000000')
  const [legend5ColorValue, setLegend5ColorValue] = useState('#000000')

  

  const [selectedRes, setSelectedRes] = useState('13.33');

    

  
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



  return (
    <div className="App">

      <Header/>
      <WorldMap 
          
          mapTitleValue={mapTitleValue}
          
          legend1TitleValue={legend1TitleValue}
          legend2TitleValue={legend2TitleValue}
          legend3TitleValue={legend3TitleValue}
          legend4TitleValue={legend4TitleValue}
          legend5TitleValue={legend5TitleValue}


          showLabel={showLabel}
          
          showLabel1={showLabel1}
          showLabel2={showLabel2}
          showLabel3={showLabel3}
          showLabel4={showLabel4}
          showLabel5={showLabel5}


          legend1ColorValue={legend1ColorValue}
          legend2ColorValue={legend2ColorValue}
          legend3ColorValue={legend3ColorValue}
          legend4ColorValue={legend4ColorValue}
          legend5ColorValue={legend5ColorValue}

          selectedRes={selectedRes}
          setSelectedRes={setSelectedRes}


        />
    <Title
      handleMapTitleValueChange={handleMapTitleValueChange}
      mapTitleValue={mapTitleValue}
    />

      <Navigator 
          legend1TitleValue={legend1TitleValue}
          legend2TitleValue={legend2TitleValue}
          legend3TitleValue={legend3TitleValue}
          legend4TitleValue={legend4TitleValue}
          legend5TitleValue={legend5TitleValue}


          handleTitle1ValueChange={handleTitle1ValueChange}
          handleTitle2ValueChange={handleTitle2ValueChange}
          handleTitle3ValueChange={handleTitle3ValueChange}
          handleTitle4ValueChange={handleTitle4ValueChange}
          handleTitle5ValueChange={handleTitle5ValueChange}




          legend1ColorValue={legend1ColorValue}
          legend2ColorValue={legend2ColorValue}
          legend3ColorValue={legend3ColorValue}
          legend4ColorValue={legend4ColorValue}
          legend5ColorValue={legend5ColorValue}

          setLegend1ColorValue={setLegend1ColorValue}
          setLegend2ColorValue={setLegend2ColorValue}
          setLegend3ColorValue={setLegend3ColorValue}
          setLegend4ColorValue={setLegend4ColorValue}
          setLegend5ColorValue={setLegend5ColorValue}




          showLabel1={showLabel1}
          setShowLabel1={setShowLabel1}
          showLabel2={showLabel2}
          setShowLabel2={setShowLabel2}
          showLabel3={showLabel3}
          setShowLabel3={setShowLabel3}
          showLabel4={showLabel4}
          setShowLabel4={setShowLabel4}
          showLabel5={showLabel5}
          setShowLabel5={setShowLabel5}


      


      />
      

      </div>
  );
}

export default App;
