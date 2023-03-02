import '../App.css'
import { useEffect } from 'react';
function States({
    legend,
    
    legend1ColorValue, 
    legend2ColorValue, 
    legend3ColorValue,
    legend4ColorValue,
    legend5ColorValue,
    legend6ColorValue,
    legend7ColorValue,
    legend8ColorValue,
    
    legend1StatesValue,
    legend2StatesValue,
    legend3StatesValue,
    legend4StatesValue,
    legend5StatesValue,
    legend6StatesValue,
    legend7StatesValue,
    legend8StatesValue,

    setLegend1StatesValue,
    setLegend2StatesValue,
    setLegend3StatesValue,
    setLegend4StatesValue,
    setLegend5StatesValue,
    setLegend6StatesValue,
    setLegend7StatesValue,
    setLegend8StatesValue,

    
    
}) {
    useEffect(() => {
        // get a list of all the states
        const allStatesId = document.getElementsByClassName("states");
        console.log(allStatesId)

        if (
            legend === 1 || 
            legend === 2 || 
            legend === 3 || 
            legend === 4 || 
            legend === 5 || 
            legend === 6 || 
            legend === 7 ||
            legend === 8) {
          
          for (var i = 0; i < legend1StatesValue.length; i++) {
            const id = legend1StatesValue[i];
            document.getElementById(id).style.fill = legend1ColorValue;
          }
          
          for (var i = 0; i < legend2StatesValue.length; i++) {
            const id = legend2StatesValue[i];
            document.getElementById(id).style.fill = legend2ColorValue;
          }
    
          for (var i = 0; i < legend3StatesValue.length; i++) {
            const id = legend3StatesValue[i];
            document.getElementById(id).style.fill = legend3ColorValue;
          }
    
          for (var i = 0; i < legend4StatesValue.length; i++) {
            const id = legend4StatesValue[i];
            document.getElementById(id).style.fill = legend4ColorValue;
          }
    
          for (var i = 0; i < legend5StatesValue.length; i++) {
            const id = legend5StatesValue[i];
            document.getElementById(id).style.fill = legend5ColorValue;
          }
    
          for (var i = 0; i < legend6StatesValue.length; i++) {
            const id = legend6StatesValue[i];
            document.getElementById(id).style.fill = legend6ColorValue;
          }
    
          for (var i = 0; i < legend7StatesValue.length; i++) {
            const id = legend7StatesValue[i];
            document.getElementById(id).style.fill = legend7ColorValue;
          }
    
          for (var i = 0; i < legend8StatesValue.length; i++) {
            const id = legend8StatesValue[i];
            document.getElementById(id).style.fill = legend8ColorValue;
          }
          
          
          
          
          
          
          // loop through all the countries and set their fill color back to the default
          for (var i = 0; i < allStatesId.length; i++) {
            const id = allStatesId[i].value;
            if (
                !legend1StatesValue.includes(id) && 
                !legend2StatesValue.includes(id) && 
                !legend3StatesValue.includes(id) && 
                !legend4StatesValue.includes(id) &&
                !legend5StatesValue.includes(id) &&
                !legend6StatesValue.includes(id) &&
                !legend7StatesValue.includes(id) &&
                !legend8StatesValue.includes(id)
    
    
                ) {
              document.getElementById(id).style.fill = "#c0c0c0";
            }
          }
        }
      }, [
        legend, 
        legend1StatesValue, 
        legend2StatesValue, 
        legend3StatesValue, 
        legend4StatesValue,
        legend5StatesValue,
        legend6StatesValue,
        legend7StatesValue,
        legend8StatesValue,
    
    
    ]);
    
        
          const handleChange = (event) => {
            const selectedOption = event.target.value;
            if (legend === 1) {
              if (legend1StatesValue.includes(selectedOption)) {
                setLegend1StatesValue(legend1StatesValue.filter((o) => o !== selectedOption));
              } else {
                setLegend1StatesValue([...legend1StatesValue, selectedOption]);
              }
                
    
              
    
            } else if (legend === 2) {
              if (legend2StatesValue.includes(selectedOption)) {
                setLegend2StatesValue(legend2StatesValue.filter((o) => o !== selectedOption));
              } else {
                setLegend2StatesValue([...legend2StatesValue, selectedOption]);
              }
            
            
            }else if (legend === 3) {
                if (legend3StatesValue.includes(selectedOption)) {
                    setLegend3StatesValue(legend3StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setLegend3StatesValue([...legend3StatesValue, selectedOption]);
                }
              }
    
              else if (legend === 4) {
                if (legend4StatesValue.includes(selectedOption)) {
                    setLegend4StatesValue(legend4StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setLegend4StatesValue([...legend4StatesValue, selectedOption]);
                } 
                
              }
    
              else if (legend === 5) {
                if (legend5StatesValue.includes(selectedOption)) {
                    setLegend5StatesValue(legend5StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setLegend5StatesValue([...legend5StatesValue, selectedOption]);
                }
    
            } 
    
            else if (legend === 6) {
                if (legend6StatesValue.includes(selectedOption)) {
                    setLegend6StatesValue(legend6StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setLegend6StatesValue([...legend6StatesValue, selectedOption]);
                }
           
          } 
          else if (legend === 7) {
            if (legend7StatesValue.includes(selectedOption)) {
                setLegend7StatesValue(legend7StatesValue.filter((o) => o !== selectedOption));
            } else {
                setLegend7StatesValue([...legend7StatesValue, selectedOption]);
            }
       
      }  else if (legend === 8) {
        if (legend8StatesValue.includes(selectedOption)) {
            setLegend8StatesValue(legend8StatesValue.filter((o) => o !== selectedOption));
        } else {
            setLegend8StatesValue([...legend8StatesValue, selectedOption]);
        }
    
    };
    
    
        }



    return(
        <div className="state-selector-us">
            <div className='all-states-us'>
                <ul>
                   
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='al'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('al') : 
                                legend === 2 ? legend2StatesValue.includes('al') : 
                                legend === 3 ? legend3StatesValue.includes('al') : 
                                legend === 4 ? legend4StatesValue.includes('al') :
                                legend === 5 ? legend5StatesValue.includes('al') :
                                legend === 6 ? legend6StatesValue.includes('al') :
                                legend === 7 ? legend7StatesValue.includes('al') :
                                legend8StatesValue.includes('al')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Alabama</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ak'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ak') : 
                                legend === 2 ? legend2StatesValue.includes('ak') : 
                                legend === 3 ? legend3StatesValue.includes('ak') : 
                                legend === 4 ? legend4StatesValue.includes('ak') :
                                legend === 5 ? legend5StatesValue.includes('ak') :
                                legend === 6 ? legend6StatesValue.includes('ak') :
                                legend === 7 ? legend7StatesValue.includes('ak') :
                                legend8StatesValue.includes('ak')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Alaska</label>
                    </li>
                    <li>
                        <input 
                            type='checkbox' 
                            value='az'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('az') : 
                                legend === 2 ? legend2StatesValue.includes('az') : 
                                legend === 3 ? legend3StatesValue.includes('az') : 
                                legend === 4 ? legend4StatesValue.includes('az') :
                                legend === 5 ? legend5StatesValue.includes('az') :
                                legend === 6 ? legend6StatesValue.includes('az') :
                                legend === 7 ? legend7StatesValue.includes('az') :
                                legend8StatesValue.includes('az')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Arizona</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ar'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ar') : 
                                legend === 2 ? legend2StatesValue.includes('ar') : 
                                legend === 3 ? legend3StatesValue.includes('ar') : 
                                legend === 4 ? legend4StatesValue.includes('ar') :
                                legend === 5 ? legend5StatesValue.includes('ar') :
                                legend === 6 ? legend6StatesValue.includes('ar') :
                                legend === 7 ? legend7StatesValue.includes('ar') :
                                legend8StatesValue.includes('ar')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Arkansas</label>
                    </li>

                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='ca'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ca') : 
                                legend === 2 ? legend2StatesValue.includes('ca') : 
                                legend === 3 ? legend3StatesValue.includes('ca') : 
                                legend === 4 ? legend4StatesValue.includes('ca') :
                                legend === 5 ? legend5StatesValue.includes('ca') :
                                legend === 6 ? legend6StatesValue.includes('ca') :
                                legend === 7 ? legend7StatesValue.includes('ca') :
                                legend8StatesValue.includes('ca')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>California</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='co'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('co') : 
                                legend === 2 ? legend2StatesValue.includes('co') : 
                                legend === 3 ? legend3StatesValue.includes('co') : 
                                legend === 4 ? legend4StatesValue.includes('co') :
                                legend === 5 ? legend5StatesValue.includes('co') :
                                legend === 6 ? legend6StatesValue.includes('co') :
                                legend === 7 ? legend7StatesValue.includes('co') :
                                legend8StatesValue.includes('co')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Colorado</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ct'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ct') : 
                                legend === 2 ? legend2StatesValue.includes('ct') : 
                                legend === 3 ? legend3StatesValue.includes('ct') : 
                                legend === 4 ? legend4StatesValue.includes('ct') :
                                legend === 5 ? legend5StatesValue.includes('ct') :
                                legend === 6 ? legend6StatesValue.includes('ct') :
                                legend === 7 ? legend7StatesValue.includes('ct') :
                                legend8StatesValue.includes('ct')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Connecticut</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='de'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('de') : 
                                legend === 2 ? legend2StatesValue.includes('de') : 
                                legend === 3 ? legend3StatesValue.includes('de') : 
                                legend === 4 ? legend4StatesValue.includes('de') :
                                legend === 5 ? legend5StatesValue.includes('de') :
                                legend === 6 ? legend6StatesValue.includes('de') :
                                legend === 7 ? legend7StatesValue.includes('de') :
                                legend8StatesValue.includes('de')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Delaware</label>
                    </li>

        
                    

                    <li>
                        <input 
                            type='checkbox' 
                            value='fl'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('fl') : 
                                legend === 2 ? legend2StatesValue.includes('fl') : 
                                legend === 3 ? legend3StatesValue.includes('fl') : 
                                legend === 4 ? legend4StatesValue.includes('fl') :
                                legend === 5 ? legend5StatesValue.includes('fl') :
                                legend === 6 ? legend6StatesValue.includes('fl') :
                                legend === 7 ? legend7StatesValue.includes('fl') :
                                legend8StatesValue.includes('fl')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Florida</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='ga'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ga') : 
                                legend === 2 ? legend2StatesValue.includes('ga') : 
                                legend === 3 ? legend3StatesValue.includes('ga') : 
                                legend === 4 ? legend4StatesValue.includes('ga') :
                                legend === 5 ? legend5StatesValue.includes('ga') :
                                legend === 6 ? legend6StatesValue.includes('ga') :
                                legend === 7 ? legend7StatesValue.includes('ga') :
                                legend8StatesValue.includes('ga')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Georgia</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='hi'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('hi') : 
                                legend === 2 ? legend2StatesValue.includes('hi') : 
                                legend === 3 ? legend3StatesValue.includes('hi') : 
                                legend === 4 ? legend4StatesValue.includes('hi') :
                                legend === 5 ? legend5StatesValue.includes('hi') :
                                legend === 6 ? legend6StatesValue.includes('hi') :
                                legend === 7 ? legend7StatesValue.includes('hi') :
                                legend8StatesValue.includes('hi')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Hawaii</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='id'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('id') : 
                                legend === 2 ? legend2StatesValue.includes('id') : 
                                legend === 3 ? legend3StatesValue.includes('id') : 
                                legend === 4 ? legend4StatesValue.includes('id') :
                                legend === 5 ? legend5StatesValue.includes('id') :
                                legend === 6 ? legend6StatesValue.includes('id') :
                                legend === 7 ? legend7StatesValue.includes('id') :
                                legend8StatesValue.includes('id')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Idaho</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='il'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('il') : 
                                legend === 2 ? legend2StatesValue.includes('il') : 
                                legend === 3 ? legend3StatesValue.includes('il') : 
                                legend === 4 ? legend4StatesValue.includes('il') :
                                legend === 5 ? legend5StatesValue.includes('il') :
                                legend === 6 ? legend6StatesValue.includes('il') :
                                legend === 7 ? legend7StatesValue.includes('il') :
                                legend8StatesValue.includes('il')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Illinois</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='in'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('in') : 
                                legend === 2 ? legend2StatesValue.includes('in') : 
                                legend === 3 ? legend3StatesValue.includes('in') : 
                                legend === 4 ? legend4StatesValue.includes('in') :
                                legend === 5 ? legend5StatesValue.includes('in') :
                                legend === 6 ? legend6StatesValue.includes('in') :
                                legend === 7 ? legend7StatesValue.includes('in') :
                                legend8StatesValue.includes('in')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Indiana</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ia'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ia') : 
                                legend === 2 ? legend2StatesValue.includes('ia') : 
                                legend === 3 ? legend3StatesValue.includes('ia') : 
                                legend === 4 ? legend4StatesValue.includes('ia') :
                                legend === 5 ? legend5StatesValue.includes('ia') :
                                legend === 6 ? legend6StatesValue.includes('ia') :
                                legend === 7 ? legend7StatesValue.includes('ia') :
                                legend8StatesValue.includes('ia')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Iowa</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='ks'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ks') : 
                                legend === 2 ? legend2StatesValue.includes('ks') : 
                                legend === 3 ? legend3StatesValue.includes('ks') : 
                                legend === 4 ? legend4StatesValue.includes('ks') :
                                legend === 5 ? legend5StatesValue.includes('ks') :
                                legend === 6 ? legend6StatesValue.includes('ks') :
                                legend === 7 ? legend7StatesValue.includes('ks') :
                                legend8StatesValue.includes('ks')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Kansas</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ky'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ky') : 
                                legend === 2 ? legend2StatesValue.includes('ky') : 
                                legend === 3 ? legend3StatesValue.includes('ky') : 
                                legend === 4 ? legend4StatesValue.includes('ky') :
                                legend === 5 ? legend5StatesValue.includes('ky') :
                                legend === 6 ? legend6StatesValue.includes('ky') :
                                legend === 7 ? legend7StatesValue.includes('ky') :
                                legend8StatesValue.includes('ky')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Kentucky</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='la'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('la') : 
                                legend === 2 ? legend2StatesValue.includes('la') : 
                                legend === 3 ? legend3StatesValue.includes('la') : 
                                legend === 4 ? legend4StatesValue.includes('la') :
                                legend === 5 ? legend5StatesValue.includes('la') :
                                legend === 6 ? legend6StatesValue.includes('la') :
                                legend === 7 ? legend7StatesValue.includes('la') :
                                legend8StatesValue.includes('la')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Louisiana</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='me'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('me') : 
                                legend === 2 ? legend2StatesValue.includes('me') : 
                                legend === 3 ? legend3StatesValue.includes('me') : 
                                legend === 4 ? legend4StatesValue.includes('me') :
                                legend === 5 ? legend5StatesValue.includes('me') :
                                legend === 6 ? legend6StatesValue.includes('me') :
                                legend === 7 ? legend7StatesValue.includes('me') :
                                legend8StatesValue.includes('me')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Maine</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='md'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('md') : 
                                legend === 2 ? legend2StatesValue.includes('md') : 
                                legend === 3 ? legend3StatesValue.includes('md') : 
                                legend === 4 ? legend4StatesValue.includes('md') :
                                legend === 5 ? legend5StatesValue.includes('md') :
                                legend === 6 ? legend6StatesValue.includes('md') :
                                legend === 7 ? legend7StatesValue.includes('md') :
                                legend8StatesValue.includes('md')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Maryland</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ma'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ma') : 
                                legend === 2 ? legend2StatesValue.includes('ma') : 
                                legend === 3 ? legend3StatesValue.includes('ma') : 
                                legend === 4 ? legend4StatesValue.includes('ma') :
                                legend === 5 ? legend5StatesValue.includes('ma') :
                                legend === 6 ? legend6StatesValue.includes('ma') :
                                legend === 7 ? legend7StatesValue.includes('ma') :
                                legend8StatesValue.includes('ma')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Massachusetts</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='mi'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('mi') : 
                                legend === 2 ? legend2StatesValue.includes('mi') : 
                                legend === 3 ? legend3StatesValue.includes('mi') : 
                                legend === 4 ? legend4StatesValue.includes('mi') :
                                legend === 5 ? legend5StatesValue.includes('mi') :
                                legend === 6 ? legend6StatesValue.includes('mi') :
                                legend === 7 ? legend7StatesValue.includes('mi') :
                                legend8StatesValue.includes('mi')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Michigan</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='mn'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('mn') : 
                                legend === 2 ? legend2StatesValue.includes('mn') : 
                                legend === 3 ? legend3StatesValue.includes('mn') : 
                                legend === 4 ? legend4StatesValue.includes('mn') :
                                legend === 5 ? legend5StatesValue.includes('mn') :
                                legend === 6 ? legend6StatesValue.includes('mn') :
                                legend === 7 ? legend7StatesValue.includes('mn') :
                                legend8StatesValue.includes('mn')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Minnesota</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ms'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ms') : 
                                legend === 2 ? legend2StatesValue.includes('ms') : 
                                legend === 3 ? legend3StatesValue.includes('ms') : 
                                legend === 4 ? legend4StatesValue.includes('ms') :
                                legend === 5 ? legend5StatesValue.includes('ms') :
                                legend === 6 ? legend6StatesValue.includes('ms') :
                                legend === 7 ? legend7StatesValue.includes('ms') :
                                legend8StatesValue.includes('ms')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Mississippi</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='mo'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('mo') : 
                                legend === 2 ? legend2StatesValue.includes('mo') : 
                                legend === 3 ? legend3StatesValue.includes('mo') : 
                                legend === 4 ? legend4StatesValue.includes('mo') :
                                legend === 5 ? legend5StatesValue.includes('mo') :
                                legend === 6 ? legend6StatesValue.includes('mo') :
                                legend === 7 ? legend7StatesValue.includes('mo') :
                                legend8StatesValue.includes('mo')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Missouri</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='mt'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('mt') : 
                                legend === 2 ? legend2StatesValue.includes('mt') : 
                                legend === 3 ? legend3StatesValue.includes('mt') : 
                                legend === 4 ? legend4StatesValue.includes('mt') :
                                legend === 5 ? legend5StatesValue.includes('mt') :
                                legend === 6 ? legend6StatesValue.includes('mt') :
                                legend === 7 ? legend7StatesValue.includes('mt') :
                                legend8StatesValue.includes('mt')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Montana</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='ne'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ne') : 
                                legend === 2 ? legend2StatesValue.includes('ne') : 
                                legend === 3 ? legend3StatesValue.includes('ne') : 
                                legend === 4 ? legend4StatesValue.includes('ne') :
                                legend === 5 ? legend5StatesValue.includes('ne') :
                                legend === 6 ? legend6StatesValue.includes('ne') :
                                legend === 7 ? legend7StatesValue.includes('ne') :
                                legend8StatesValue.includes('ne')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Nebraska</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='nv'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('nv') : 
                                legend === 2 ? legend2StatesValue.includes('nv') : 
                                legend === 3 ? legend3StatesValue.includes('nv') : 
                                legend === 4 ? legend4StatesValue.includes('nv') :
                                legend === 5 ? legend5StatesValue.includes('nv') :
                                legend === 6 ? legend6StatesValue.includes('nv') :
                                legend === 7 ? legend7StatesValue.includes('nv') :
                                legend8StatesValue.includes('nv')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Nevada</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='nh'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('nh') : 
                                legend === 2 ? legend2StatesValue.includes('nh') : 
                                legend === 3 ? legend3StatesValue.includes('nh') : 
                                legend === 4 ? legend4StatesValue.includes('nh') :
                                legend === 5 ? legend5StatesValue.includes('nh') :
                                legend === 6 ? legend6StatesValue.includes('nh') :
                                legend === 7 ? legend7StatesValue.includes('nh') :
                                legend8StatesValue.includes('nh')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>New Hampshire</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='nj'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('nj') : 
                                legend === 2 ? legend2StatesValue.includes('nj') : 
                                legend === 3 ? legend3StatesValue.includes('nj') : 
                                legend === 4 ? legend4StatesValue.includes('nj') :
                                legend === 5 ? legend5StatesValue.includes('nj') :
                                legend === 6 ? legend6StatesValue.includes('nj') :
                                legend === 7 ? legend7StatesValue.includes('nj') :
                                legend8StatesValue.includes('nj')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>New Jersey</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='nm'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('nm') : 
                                legend === 2 ? legend2StatesValue.includes('nm') : 
                                legend === 3 ? legend3StatesValue.includes('nm') : 
                                legend === 4 ? legend4StatesValue.includes('nm') :
                                legend === 5 ? legend5StatesValue.includes('nm') :
                                legend === 6 ? legend6StatesValue.includes('nm') :
                                legend === 7 ? legend7StatesValue.includes('nm') :
                                legend8StatesValue.includes('nm')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>New Mexico</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ny'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ny') : 
                                legend === 2 ? legend2StatesValue.includes('ny') : 
                                legend === 3 ? legend3StatesValue.includes('ny') : 
                                legend === 4 ? legend4StatesValue.includes('ny') :
                                legend === 5 ? legend5StatesValue.includes('ny') :
                                legend === 6 ? legend6StatesValue.includes('ny') :
                                legend === 7 ? legend7StatesValue.includes('ny') :
                                legend8StatesValue.includes('ny')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>New York</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='nc'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('nc') : 
                                legend === 2 ? legend2StatesValue.includes('nc') : 
                                legend === 3 ? legend3StatesValue.includes('nc') : 
                                legend === 4 ? legend4StatesValue.includes('nc') :
                                legend === 5 ? legend5StatesValue.includes('nc') :
                                legend === 6 ? legend6StatesValue.includes('nc') :
                                legend === 7 ? legend7StatesValue.includes('nc') :
                                legend8StatesValue.includes('nc')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>North Carolina</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='nd'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('nd') : 
                                legend === 2 ? legend2StatesValue.includes('nd') : 
                                legend === 3 ? legend3StatesValue.includes('nd') : 
                                legend === 4 ? legend4StatesValue.includes('nd') :
                                legend === 5 ? legend5StatesValue.includes('nd') :
                                legend === 6 ? legend6StatesValue.includes('nd') :
                                legend === 7 ? legend7StatesValue.includes('nd') :
                                legend8StatesValue.includes('nd')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>North Dakota</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='oh'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('oh') : 
                                legend === 2 ? legend2StatesValue.includes('oh') : 
                                legend === 3 ? legend3StatesValue.includes('oh') : 
                                legend === 4 ? legend4StatesValue.includes('oh') :
                                legend === 5 ? legend5StatesValue.includes('oh') :
                                legend === 6 ? legend6StatesValue.includes('oh') :
                                legend === 7 ? legend7StatesValue.includes('oh') :
                                legend8StatesValue.includes('oh')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Ohio</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='ok'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ok') : 
                                legend === 2 ? legend2StatesValue.includes('ok') : 
                                legend === 3 ? legend3StatesValue.includes('ok') : 
                                legend === 4 ? legend4StatesValue.includes('ok') :
                                legend === 5 ? legend5StatesValue.includes('ok') :
                                legend === 6 ? legend6StatesValue.includes('ok') :
                                legend === 7 ? legend7StatesValue.includes('ok') :
                                legend8StatesValue.includes('ok')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Oklahoma</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='or'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('or') : 
                                legend === 2 ? legend2StatesValue.includes('or') : 
                                legend === 3 ? legend3StatesValue.includes('or') : 
                                legend === 4 ? legend4StatesValue.includes('or') :
                                legend === 5 ? legend5StatesValue.includes('or') :
                                legend === 6 ? legend6StatesValue.includes('or') :
                                legend === 7 ? legend7StatesValue.includes('or') :
                                legend8StatesValue.includes('or')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Oregon</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='pa'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('pa') : 
                                legend === 2 ? legend2StatesValue.includes('pa') : 
                                legend === 3 ? legend3StatesValue.includes('pa') : 
                                legend === 4 ? legend4StatesValue.includes('pa') :
                                legend === 5 ? legend5StatesValue.includes('pa') :
                                legend === 6 ? legend6StatesValue.includes('pa') :
                                legend === 7 ? legend7StatesValue.includes('pa') :
                                legend8StatesValue.includes('pa')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Pennsylvania</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='ri'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ri') : 
                                legend === 2 ? legend2StatesValue.includes('ri') : 
                                legend === 3 ? legend3StatesValue.includes('ri') : 
                                legend === 4 ? legend4StatesValue.includes('ri') :
                                legend === 5 ? legend5StatesValue.includes('ri') :
                                legend === 6 ? legend6StatesValue.includes('ri') :
                                legend === 7 ? legend7StatesValue.includes('ri') :
                                legend8StatesValue.includes('ri')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Rhode Island</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='sc'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('sc') : 
                                legend === 2 ? legend2StatesValue.includes('sc') : 
                                legend === 3 ? legend3StatesValue.includes('sc') : 
                                legend === 4 ? legend4StatesValue.includes('sc') :
                                legend === 5 ? legend5StatesValue.includes('sc') :
                                legend === 6 ? legend6StatesValue.includes('sc') :
                                legend === 7 ? legend7StatesValue.includes('sc') :
                                legend8StatesValue.includes('sc')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>South Carolina</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='sd'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('sd') : 
                                legend === 2 ? legend2StatesValue.includes('sd') : 
                                legend === 3 ? legend3StatesValue.includes('sd') : 
                                legend === 4 ? legend4StatesValue.includes('sd') :
                                legend === 5 ? legend5StatesValue.includes('sd') :
                                legend === 6 ? legend6StatesValue.includes('sd') :
                                legend === 7 ? legend7StatesValue.includes('sd') :
                                legend8StatesValue.includes('sd')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>South Dakota</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='tn'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('tn') : 
                                legend === 2 ? legend2StatesValue.includes('tn') : 
                                legend === 3 ? legend3StatesValue.includes('tn') : 
                                legend === 4 ? legend4StatesValue.includes('tn') :
                                legend === 5 ? legend5StatesValue.includes('tn') :
                                legend === 6 ? legend6StatesValue.includes('tn') :
                                legend === 7 ? legend7StatesValue.includes('tn') :
                                legend8StatesValue.includes('tn')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Tennessee</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='tx'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('tx') : 
                                legend === 2 ? legend2StatesValue.includes('tx') : 
                                legend === 3 ? legend3StatesValue.includes('tx') : 
                                legend === 4 ? legend4StatesValue.includes('tx') :
                                legend === 5 ? legend5StatesValue.includes('tx') :
                                legend === 6 ? legend6StatesValue.includes('tx') :
                                legend === 7 ? legend7StatesValue.includes('tx') :
                                legend8StatesValue.includes('tx')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Texas</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='ut'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('ut') : 
                                legend === 2 ? legend2StatesValue.includes('ut') : 
                                legend === 3 ? legend3StatesValue.includes('ut') : 
                                legend === 4 ? legend4StatesValue.includes('ut') :
                                legend === 5 ? legend5StatesValue.includes('ut') :
                                legend === 6 ? legend6StatesValue.includes('ut') :
                                legend === 7 ? legend7StatesValue.includes('ut') :
                                legend8StatesValue.includes('ut')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Utah</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='vt'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('vt') : 
                                legend === 2 ? legend2StatesValue.includes('vt') : 
                                legend === 3 ? legend3StatesValue.includes('vt') : 
                                legend === 4 ? legend4StatesValue.includes('vt') :
                                legend === 5 ? legend5StatesValue.includes('vt') :
                                legend === 6 ? legend6StatesValue.includes('vt') :
                                legend === 7 ? legend7StatesValue.includes('vt') :
                                legend8StatesValue.includes('vt')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Vermont</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='va'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('va') : 
                                legend === 2 ? legend2StatesValue.includes('va') : 
                                legend === 3 ? legend3StatesValue.includes('va') : 
                                legend === 4 ? legend4StatesValue.includes('va') :
                                legend === 5 ? legend5StatesValue.includes('va') :
                                legend === 6 ? legend6StatesValue.includes('va') :
                                legend === 7 ? legend7StatesValue.includes('va') :
                                legend8StatesValue.includes('va')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Virginia</label>
                    </li>
                    
                    <li>
                        <input 
                            type='checkbox' 
                            value='wa'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('wa') : 
                                legend === 2 ? legend2StatesValue.includes('wa') : 
                                legend === 3 ? legend3StatesValue.includes('wa') : 
                                legend === 4 ? legend4StatesValue.includes('wa') :
                                legend === 5 ? legend5StatesValue.includes('wa') :
                                legend === 6 ? legend6StatesValue.includes('wa') :
                                legend === 7 ? legend7StatesValue.includes('wa') :
                                legend8StatesValue.includes('wa')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Washington</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='wv'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('wv') : 
                                legend === 2 ? legend2StatesValue.includes('wv') : 
                                legend === 3 ? legend3StatesValue.includes('wv') : 
                                legend === 4 ? legend4StatesValue.includes('wv') :
                                legend === 5 ? legend5StatesValue.includes('wv') :
                                legend === 6 ? legend6StatesValue.includes('wv') :
                                legend === 7 ? legend7StatesValue.includes('wv') :
                                legend8StatesValue.includes('wv')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>West Virginia</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='wi'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('wi') : 
                                legend === 2 ? legend2StatesValue.includes('wi') : 
                                legend === 3 ? legend3StatesValue.includes('wi') : 
                                legend === 4 ? legend4StatesValue.includes('wi') :
                                legend === 5 ? legend5StatesValue.includes('wi') :
                                legend === 6 ? legend6StatesValue.includes('wi') :
                                legend === 7 ? legend7StatesValue.includes('wi') :
                                legend8StatesValue.includes('wi')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Wisconsin</label>
                    </li>

                    <li>
                        <input 
                            type='checkbox' 
                            value='wy'
                            className="states"
                            onChange={handleChange}
                            checked={
                                legend === 1 ? legend1StatesValue.includes('wy') : 
                                legend === 2 ? legend2StatesValue.includes('wy') : 
                                legend === 3 ? legend3StatesValue.includes('wy') : 
                                legend === 4 ? legend4StatesValue.includes('wy') :
                                legend === 5 ? legend5StatesValue.includes('wy') :
                                legend === 6 ? legend6StatesValue.includes('wy') :
                                legend === 7 ? legend7StatesValue.includes('wy') :
                                legend8StatesValue.includes('wy')
                            }
  
                            >
                            
                        </input>
                        <label className='state-label'>Wyoming</label>
                    </li>

                  
                </ul>
            </div>
        </div>
    )
}
export default States