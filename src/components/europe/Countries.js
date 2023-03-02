import '../App.css'
import { useEffect, useState } from 'react';




function Countries({ 
    legend,
    
    legend1ColorValue, 
    legend2ColorValue, 
    legend3ColorValue,
    legend4ColorValue,
    legend5ColorValue,
    legend6ColorValue,
    legend7ColorValue,
    legend8ColorValue,


     
    legend1CountryValue, 
    legend2CountryValue, 
    legend3CountryValue,
    legend4CountryValue,
    legend5CountryValue,
    legend6CountryValue,
    legend7CountryValue,
    legend8CountryValue,




    setLegend1CountryValue,
    setLegend2CountryValue,
    setLegend3CountryValue,
    setLegend4CountryValue,
    setLegend5CountryValue,
    setLegend6CountryValue,
    setLegend7CountryValue,
    setLegend8CountryValue,





}) {

   
  useEffect(() => {
    // get a list of all the countries
    const allCountryIds = document.getElementsByClassName("country-eu");
    
    if (
        legend === 1 || 
        legend === 2 || 
        legend === 3 || 
        legend === 4 || 
        legend === 5 || 
        legend === 6 || 
        legend === 7 ||
        legend === 8) {
      
      for (var i = 0; i < legend1CountryValue.length; i++) {
        const id = legend1CountryValue[i];
        document.getElementById(id).style.fill = legend1ColorValue;
      }
      
      for (var i = 0; i < legend2CountryValue.length; i++) {
        const id = legend2CountryValue[i];
        document.getElementById(id).style.fill = legend2ColorValue;
      }

      for (var i = 0; i < legend3CountryValue.length; i++) {
        const id = legend3CountryValue[i];
        document.getElementById(id).style.fill = legend3ColorValue;
      }

      for (var i = 0; i < legend4CountryValue.length; i++) {
        const id = legend4CountryValue[i];
        document.getElementById(id).style.fill = legend4ColorValue;
      }

      for (var i = 0; i < legend5CountryValue.length; i++) {
        const id = legend5CountryValue[i];
        document.getElementById(id).style.fill = legend5ColorValue;
      }

      for (var i = 0; i < legend6CountryValue.length; i++) {
        const id = legend6CountryValue[i];
        document.getElementById(id).style.fill = legend6ColorValue;
      }

      for (var i = 0; i < legend7CountryValue.length; i++) {
        const id = legend7CountryValue[i];
        document.getElementById(id).style.fill = legend7ColorValue;
      }

      for (var i = 0; i < legend8CountryValue.length; i++) {
        const id = legend8CountryValue[i];
        document.getElementById(id).style.fill = legend8ColorValue;
      }
      
      
      
      
      
      
      // loop through all the countries and set their fill color back to the default
      for (var i = 0; i < allCountryIds.length; i++) {
        const id = allCountryIds[i].value;
        if (
            !legend1CountryValue.includes(id) && 
            !legend2CountryValue.includes(id) && 
            !legend3CountryValue.includes(id) && 
            !legend4CountryValue.includes(id) &&
            !legend5CountryValue.includes(id) &&
            !legend6CountryValue.includes(id) &&
            !legend7CountryValue.includes(id) &&
            !legend8CountryValue.includes(id)


            ) {
          document.getElementById(id).style.fill = "#c0c0c0";
        }
      }
    }
  }, [
    legend, 
    legend1CountryValue, 
    legend2CountryValue, 
    legend3CountryValue, 
    legend4CountryValue,
    legend5CountryValue,
    legend6CountryValue,
    legend7CountryValue,
    legend8CountryValue,


]);

    
      const handleChange = (event) => {
        const selectedOption = event.target.value;
        if (legend === 1) {
          if (legend1CountryValue.includes(selectedOption)) {
            setLegend1CountryValue(legend1CountryValue.filter((o) => o !== selectedOption));
          } else {
            setLegend1CountryValue([...legend1CountryValue, selectedOption]);
          }
            

          

        } else if (legend === 2) {
          if (legend2CountryValue.includes(selectedOption)) {
            setLegend2CountryValue(legend2CountryValue.filter((o) => o !== selectedOption));
          } else {
            setLegend2CountryValue([...legend2CountryValue, selectedOption]);
          }
        
        
        }else if (legend === 3) {
            if (legend3CountryValue.includes(selectedOption)) {
              setLegend3CountryValue(legend3CountryValue.filter((o) => o !== selectedOption));
            } else {
              setLegend3CountryValue([...legend3CountryValue, selectedOption]);
            }
          }

          else if (legend === 4) {
            if (legend4CountryValue.includes(selectedOption)) {
              setLegend4CountryValue(legend4CountryValue.filter((o) => o !== selectedOption));
            } else {
              setLegend4CountryValue([...legend4CountryValue, selectedOption]);
            } 
            
          }

          else if (legend === 5) {
            if (legend5CountryValue.includes(selectedOption)) {
              setLegend5CountryValue(legend5CountryValue.filter((o) => o !== selectedOption));
            } else {
              setLegend5CountryValue([...legend5CountryValue, selectedOption]);
            }

        } 

        else if (legend === 6) {
            if (legend6CountryValue.includes(selectedOption)) {
              setLegend6CountryValue(legend6CountryValue.filter((o) => o !== selectedOption));
            } else {
              setLegend6CountryValue([...legend6CountryValue, selectedOption]);
            }
       
      } 
      else if (legend === 7) {
        if (legend7CountryValue.includes(selectedOption)) {
          setLegend7CountryValue(legend7CountryValue.filter((o) => o !== selectedOption));
        } else {
          setLegend7CountryValue([...legend7CountryValue, selectedOption]);
        }
   
  }  else if (legend === 8) {
    if (legend8CountryValue.includes(selectedOption)) {
      setLegend8CountryValue(legend8CountryValue.filter((o) => o !== selectedOption));
    } else {
      setLegend8CountryValue([...legend8CountryValue, selectedOption]);
    }

};


    }

    return(
        <div className='state-selector-eu'>
            <div className='all-states-eu'>
                <ul>
                
                        <li>
                        <input  
                            type='checkbox' 
                            value='al'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('al') : 
                                legend === 2 ? legend2CountryValue.includes('al') : 
                                legend === 3 ? legend3CountryValue.includes('al') : 
                                legend === 4 ? legend4CountryValue.includes('al') :
                                legend === 5 ? legend5CountryValue.includes('al') :
                                legend === 6 ? legend6CountryValue.includes('al') :
                                legend === 7 ? legend7CountryValue.includes('al') :
                                legend8CountryValue.includes('al')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Albania</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ad'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ad') : 
                                legend === 2 ? legend2CountryValue.includes('ad') : 
                                legend === 3 ? legend3CountryValue.includes('ad') : 
                                legend === 4 ? legend4CountryValue.includes('ad') :
                                legend === 5 ? legend5CountryValue.includes('ad') :
                                legend === 6 ? legend6CountryValue.includes('ad') :
                                legend === 7 ? legend7CountryValue.includes('ad') :
                                legend8CountryValue.includes('ad')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Andorra</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='at'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('at') : 
                                legend === 2 ? legend2CountryValue.includes('at') : 
                                legend === 3 ? legend3CountryValue.includes('at') : 
                                legend === 4 ? legend4CountryValue.includes('at') :
                                legend === 5 ? legend5CountryValue.includes('at') :
                                legend === 6 ? legend6CountryValue.includes('at') :
                                legend === 7 ? legend7CountryValue.includes('at') :
                                legend8CountryValue.includes('at')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Austria</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='by'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('by') : 
                                legend === 2 ? legend2CountryValue.includes('by') : 
                                legend === 3 ? legend3CountryValue.includes('by') : 
                                legend === 4 ? legend4CountryValue.includes('by') :
                                legend === 5 ? legend5CountryValue.includes('by') :
                                legend === 6 ? legend6CountryValue.includes('by') :
                                legend === 7 ? legend7CountryValue.includes('by') :
                                legend8CountryValue.includes('by')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Belarus</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='be'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('be') : 
                                legend === 2 ? legend2CountryValue.includes('be') : 
                                legend === 3 ? legend3CountryValue.includes('be') : 
                                legend === 4 ? legend4CountryValue.includes('be') :
                                legend === 5 ? legend5CountryValue.includes('be') :
                                legend === 6 ? legend6CountryValue.includes('be') :
                                legend === 7 ? legend7CountryValue.includes('be') :
                                legend8CountryValue.includes('be')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Belgium</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ba'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ba') : 
                                legend === 2 ? legend2CountryValue.includes('ba') : 
                                legend === 3 ? legend3CountryValue.includes('ba') : 
                                legend === 4 ? legend4CountryValue.includes('ba') :
                                legend === 5 ? legend5CountryValue.includes('ba') :
                                legend === 6 ? legend6CountryValue.includes('ba') :
                                legend === 7 ? legend7CountryValue.includes('ba') :
                                legend8CountryValue.includes('ba')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Bosnia and Herzegovina</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='bg'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('bg') : 
                                legend === 2 ? legend2CountryValue.includes('bg') : 
                                legend === 3 ? legend3CountryValue.includes('bg') : 
                                legend === 4 ? legend4CountryValue.includes('bg') :
                                legend === 5 ? legend5CountryValue.includes('bg') :
                                legend === 6 ? legend6CountryValue.includes('bg') :
                                legend === 7 ? legend7CountryValue.includes('bg') :
                                legend8CountryValue.includes('bg')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Bulgaria</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='hr'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('hr') : 
                                legend === 2 ? legend2CountryValue.includes('hr') : 
                                legend === 3 ? legend3CountryValue.includes('hr') : 
                                legend === 4 ? legend4CountryValue.includes('hr') :
                                legend === 5 ? legend5CountryValue.includes('hr') :
                                legend === 6 ? legend6CountryValue.includes('hr') :
                                legend === 7 ? legend7CountryValue.includes('hr') :
                                legend8CountryValue.includes('hr')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Croatia</label>
                    </li>

               

                    <li>
                        <input  
                            type='checkbox' 
                            value='cz'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('cz') : 
                                legend === 2 ? legend2CountryValue.includes('cz') : 
                                legend === 3 ? legend3CountryValue.includes('cz') : 
                                legend === 4 ? legend4CountryValue.includes('cz') :
                                legend === 5 ? legend5CountryValue.includes('cz') :
                                legend === 6 ? legend6CountryValue.includes('cz') :
                                legend === 7 ? legend7CountryValue.includes('cz') :
                                legend8CountryValue.includes('cz')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Czech Republic</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='dk'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('dk') : 
                                legend === 2 ? legend2CountryValue.includes('dk') : 
                                legend === 3 ? legend3CountryValue.includes('dk') : 
                                legend === 4 ? legend4CountryValue.includes('dk') :
                                legend === 5 ? legend5CountryValue.includes('dk') :
                                legend === 6 ? legend6CountryValue.includes('dk') :
                                legend === 7 ? legend7CountryValue.includes('dk') :
                                legend8CountryValue.includes('dk')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Denmark</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ee'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ee') : 
                                legend === 2 ? legend2CountryValue.includes('ee') : 
                                legend === 3 ? legend3CountryValue.includes('ee') : 
                                legend === 4 ? legend4CountryValue.includes('ee') :
                                legend === 5 ? legend5CountryValue.includes('ee') :
                                legend === 6 ? legend6CountryValue.includes('ee') :
                                legend === 7 ? legend7CountryValue.includes('ee') :
                                legend8CountryValue.includes('ee')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Estonia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='fi'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('fi') : 
                                legend === 2 ? legend2CountryValue.includes('fi') : 
                                legend === 3 ? legend3CountryValue.includes('fi') : 
                                legend === 4 ? legend4CountryValue.includes('fi') :
                                legend === 5 ? legend5CountryValue.includes('fi') :
                                legend === 6 ? legend6CountryValue.includes('fi') :
                                legend === 7 ? legend7CountryValue.includes('fi') :
                                legend8CountryValue.includes('fi')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Finland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='fr'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('fr') : 
                                legend === 2 ? legend2CountryValue.includes('fr') : 
                                legend === 3 ? legend3CountryValue.includes('fr') : 
                                legend === 4 ? legend4CountryValue.includes('fr') :
                                legend === 5 ? legend5CountryValue.includes('fr') :
                                legend === 6 ? legend6CountryValue.includes('fr') :
                                legend === 7 ? legend7CountryValue.includes('fr') :
                                legend8CountryValue.includes('fr')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>France</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='de'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('de') : 
                                legend === 2 ? legend2CountryValue.includes('de') : 
                                legend === 3 ? legend3CountryValue.includes('de') : 
                                legend === 4 ? legend4CountryValue.includes('de') :
                                legend === 5 ? legend5CountryValue.includes('de') :
                                legend === 6 ? legend6CountryValue.includes('de') :
                                legend === 7 ? legend7CountryValue.includes('de') :
                                legend8CountryValue.includes('de')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Germany</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='gr'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('gr') : 
                                legend === 2 ? legend2CountryValue.includes('gr') : 
                                legend === 3 ? legend3CountryValue.includes('gr') : 
                                legend === 4 ? legend4CountryValue.includes('gr') :
                                legend === 5 ? legend5CountryValue.includes('gr') :
                                legend === 6 ? legend6CountryValue.includes('gr') :
                                legend === 7 ? legend7CountryValue.includes('gr') :
                                legend8CountryValue.includes('gr')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Greece</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='hu'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('hu') : 
                                legend === 2 ? legend2CountryValue.includes('hu') : 
                                legend === 3 ? legend3CountryValue.includes('hu') : 
                                legend === 4 ? legend4CountryValue.includes('hu') :
                                legend === 5 ? legend5CountryValue.includes('hu') :
                                legend === 6 ? legend6CountryValue.includes('hu') :
                                legend === 7 ? legend7CountryValue.includes('hu') :
                                legend8CountryValue.includes('hu')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Hungary</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='is'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('is') : 
                                legend === 2 ? legend2CountryValue.includes('is') : 
                                legend === 3 ? legend3CountryValue.includes('is') : 
                                legend === 4 ? legend4CountryValue.includes('is') :
                                legend === 5 ? legend5CountryValue.includes('is') :
                                legend === 6 ? legend6CountryValue.includes('is') :
                                legend === 7 ? legend7CountryValue.includes('is') :
                                legend8CountryValue.includes('is')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Iceland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ie'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ie') : 
                                legend === 2 ? legend2CountryValue.includes('ie') : 
                                legend === 3 ? legend3CountryValue.includes('ie') : 
                                legend === 4 ? legend4CountryValue.includes('ie') :
                                legend === 5 ? legend5CountryValue.includes('ie') :
                                legend === 6 ? legend6CountryValue.includes('ie') :
                                legend === 7 ? legend7CountryValue.includes('ie') :
                                legend8CountryValue.includes('ie')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Ireland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='it'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('it') : 
                                legend === 2 ? legend2CountryValue.includes('it') : 
                                legend === 3 ? legend3CountryValue.includes('it') : 
                                legend === 4 ? legend4CountryValue.includes('it') :
                                legend === 5 ? legend5CountryValue.includes('it') :
                                legend === 6 ? legend6CountryValue.includes('it') :
                                legend === 7 ? legend7CountryValue.includes('it') :
                                legend8CountryValue.includes('it')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Italy</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='xk'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('xk') : 
                                legend === 2 ? legend2CountryValue.includes('xk') : 
                                legend === 3 ? legend3CountryValue.includes('xk') : 
                                legend === 4 ? legend4CountryValue.includes('xk') :
                                legend === 5 ? legend5CountryValue.includes('xk') :
                                legend === 6 ? legend6CountryValue.includes('xk') :
                                legend === 7 ? legend7CountryValue.includes('xk') :
                                legend8CountryValue.includes('xk')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Kosovo</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='lv'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('lv') : 
                                legend === 2 ? legend2CountryValue.includes('lv') : 
                                legend === 3 ? legend3CountryValue.includes('lv') : 
                                legend === 4 ? legend4CountryValue.includes('lv') :
                                legend === 5 ? legend5CountryValue.includes('lv') :
                                legend === 6 ? legend6CountryValue.includes('lv') :
                                legend === 7 ? legend7CountryValue.includes('lv') :
                                legend8CountryValue.includes('lv')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Latvia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='li'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('li') : 
                                legend === 2 ? legend2CountryValue.includes('li') : 
                                legend === 3 ? legend3CountryValue.includes('li') : 
                                legend === 4 ? legend4CountryValue.includes('li') :
                                legend === 5 ? legend5CountryValue.includes('li') :
                                legend === 6 ? legend6CountryValue.includes('li') :
                                legend === 7 ? legend7CountryValue.includes('li') :
                                legend8CountryValue.includes('li')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Liechtenstein</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='lt'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('lt') : 
                                legend === 2 ? legend2CountryValue.includes('lt') : 
                                legend === 3 ? legend3CountryValue.includes('lt') : 
                                legend === 4 ? legend4CountryValue.includes('lt') :
                                legend === 5 ? legend5CountryValue.includes('lt') :
                                legend === 6 ? legend6CountryValue.includes('lt') :
                                legend === 7 ? legend7CountryValue.includes('lt') :
                                legend8CountryValue.includes('lt')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Lithuania</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='lu'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('lu') : 
                                legend === 2 ? legend2CountryValue.includes('lu') : 
                                legend === 3 ? legend3CountryValue.includes('lu') : 
                                legend === 4 ? legend4CountryValue.includes('lu') :
                                legend === 5 ? legend5CountryValue.includes('lu') :
                                legend === 6 ? legend6CountryValue.includes('lu') :
                                legend === 7 ? legend7CountryValue.includes('lu') :
                                legend8CountryValue.includes('lu')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Luxembourg</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='mt'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('mt') : 
                                legend === 2 ? legend2CountryValue.includes('mt') : 
                                legend === 3 ? legend3CountryValue.includes('mt') : 
                                legend === 4 ? legend4CountryValue.includes('mt') :
                                legend === 5 ? legend5CountryValue.includes('mt') :
                                legend === 6 ? legend6CountryValue.includes('mt') :
                                legend === 7 ? legend7CountryValue.includes('mt') :
                                legend8CountryValue.includes('mt')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Malta</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='md'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('md') : 
                                legend === 2 ? legend2CountryValue.includes('md') : 
                                legend === 3 ? legend3CountryValue.includes('md') : 
                                legend === 4 ? legend4CountryValue.includes('md') :
                                legend === 5 ? legend5CountryValue.includes('md') :
                                legend === 6 ? legend6CountryValue.includes('md') :
                                legend === 7 ? legend7CountryValue.includes('md') :
                                legend8CountryValue.includes('md')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Moldova</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='mc'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('mc') : 
                                legend === 2 ? legend2CountryValue.includes('mc') : 
                                legend === 3 ? legend3CountryValue.includes('mc') : 
                                legend === 4 ? legend4CountryValue.includes('mc') :
                                legend === 5 ? legend5CountryValue.includes('mc') :
                                legend === 6 ? legend6CountryValue.includes('mc') :
                                legend === 7 ? legend7CountryValue.includes('mc') :
                                legend8CountryValue.includes('mc')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Monaco</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='me'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('me') : 
                                legend === 2 ? legend2CountryValue.includes('me') : 
                                legend === 3 ? legend3CountryValue.includes('me') : 
                                legend === 4 ? legend4CountryValue.includes('me') :
                                legend === 5 ? legend5CountryValue.includes('me') :
                                legend === 6 ? legend6CountryValue.includes('me') :
                                legend === 7 ? legend7CountryValue.includes('me') :
                                legend8CountryValue.includes('me')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Montenegro</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='nl'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('nl') : 
                                legend === 2 ? legend2CountryValue.includes('nl') : 
                                legend === 3 ? legend3CountryValue.includes('nl') : 
                                legend === 4 ? legend4CountryValue.includes('nl') :
                                legend === 5 ? legend5CountryValue.includes('nl') :
                                legend === 6 ? legend6CountryValue.includes('nl') :
                                legend === 7 ? legend7CountryValue.includes('nl') :
                                legend8CountryValue.includes('nl')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Netherlands</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='mk'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('mk') : 
                                legend === 2 ? legend2CountryValue.includes('mk') : 
                                legend === 3 ? legend3CountryValue.includes('mk') : 
                                legend === 4 ? legend4CountryValue.includes('mk') :
                                legend === 5 ? legend5CountryValue.includes('mk') :
                                legend === 6 ? legend6CountryValue.includes('mk') :
                                legend === 7 ? legend7CountryValue.includes('mk') :
                                legend8CountryValue.includes('mk')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>North Macedonia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='no'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('no') : 
                                legend === 2 ? legend2CountryValue.includes('no') : 
                                legend === 3 ? legend3CountryValue.includes('no') : 
                                legend === 4 ? legend4CountryValue.includes('no') :
                                legend === 5 ? legend5CountryValue.includes('no') :
                                legend === 6 ? legend6CountryValue.includes('no') :
                                legend === 7 ? legend7CountryValue.includes('no') :
                                legend8CountryValue.includes('no')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Norway</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='pl'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('pl') : 
                                legend === 2 ? legend2CountryValue.includes('pl') : 
                                legend === 3 ? legend3CountryValue.includes('pl') : 
                                legend === 4 ? legend4CountryValue.includes('pl') :
                                legend === 5 ? legend5CountryValue.includes('pl') :
                                legend === 6 ? legend6CountryValue.includes('pl') :
                                legend === 7 ? legend7CountryValue.includes('pl') :
                                legend8CountryValue.includes('pl')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Poland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='pt'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('pt') : 
                                legend === 2 ? legend2CountryValue.includes('pt') : 
                                legend === 3 ? legend3CountryValue.includes('pt') : 
                                legend === 4 ? legend4CountryValue.includes('pt') :
                                legend === 5 ? legend5CountryValue.includes('pt') :
                                legend === 6 ? legend6CountryValue.includes('pt') :
                                legend === 7 ? legend7CountryValue.includes('pt') :
                                legend8CountryValue.includes('pt')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Portugal</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ro'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ro') : 
                                legend === 2 ? legend2CountryValue.includes('ro') : 
                                legend === 3 ? legend3CountryValue.includes('ro') : 
                                legend === 4 ? legend4CountryValue.includes('ro') :
                                legend === 5 ? legend5CountryValue.includes('ro') :
                                legend === 6 ? legend6CountryValue.includes('ro') :
                                legend === 7 ? legend7CountryValue.includes('ro') :
                                legend8CountryValue.includes('ro')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Romania</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ru'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ru') : 
                                legend === 2 ? legend2CountryValue.includes('ru') : 
                                legend === 3 ? legend3CountryValue.includes('ru') : 
                                legend === 4 ? legend4CountryValue.includes('ru') :
                                legend === 5 ? legend5CountryValue.includes('ru') :
                                legend === 6 ? legend6CountryValue.includes('ru') :
                                legend === 7 ? legend7CountryValue.includes('ru') :
                                legend8CountryValue.includes('ru')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Russia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='sm'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('sm') : 
                                legend === 2 ? legend2CountryValue.includes('sm') : 
                                legend === 3 ? legend3CountryValue.includes('sm') : 
                                legend === 4 ? legend4CountryValue.includes('sm') :
                                legend === 5 ? legend5CountryValue.includes('sm') :
                                legend === 6 ? legend6CountryValue.includes('sm') :
                                legend === 7 ? legend7CountryValue.includes('sm') :
                                legend8CountryValue.includes('sm')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>San Marino</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='rs'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('rs') : 
                                legend === 2 ? legend2CountryValue.includes('rs') : 
                                legend === 3 ? legend3CountryValue.includes('rs') : 
                                legend === 4 ? legend4CountryValue.includes('rs') :
                                legend === 5 ? legend5CountryValue.includes('rs') :
                                legend === 6 ? legend6CountryValue.includes('rs') :
                                legend === 7 ? legend7CountryValue.includes('rs') :
                                legend8CountryValue.includes('rs')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Serbia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='sk'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('sk') : 
                                legend === 2 ? legend2CountryValue.includes('sk') : 
                                legend === 3 ? legend3CountryValue.includes('sk') : 
                                legend === 4 ? legend4CountryValue.includes('sk') :
                                legend === 5 ? legend5CountryValue.includes('sk') :
                                legend === 6 ? legend6CountryValue.includes('sk') :
                                legend === 7 ? legend7CountryValue.includes('sk') :
                                legend8CountryValue.includes('sk')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Slovakia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='si'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('si') : 
                                legend === 2 ? legend2CountryValue.includes('si') : 
                                legend === 3 ? legend3CountryValue.includes('si') : 
                                legend === 4 ? legend4CountryValue.includes('si') :
                                legend === 5 ? legend5CountryValue.includes('si') :
                                legend === 6 ? legend6CountryValue.includes('si') :
                                legend === 7 ? legend7CountryValue.includes('si') :
                                legend8CountryValue.includes('si')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Slovenia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='es'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('es') : 
                                legend === 2 ? legend2CountryValue.includes('es') : 
                                legend === 3 ? legend3CountryValue.includes('es') : 
                                legend === 4 ? legend4CountryValue.includes('es') :
                                legend === 5 ? legend5CountryValue.includes('es') :
                                legend === 6 ? legend6CountryValue.includes('es') :
                                legend === 7 ? legend7CountryValue.includes('es') :
                                legend8CountryValue.includes('es')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Spain</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='se'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('se') : 
                                legend === 2 ? legend2CountryValue.includes('se') : 
                                legend === 3 ? legend3CountryValue.includes('se') : 
                                legend === 4 ? legend4CountryValue.includes('se') :
                                legend === 5 ? legend5CountryValue.includes('se') :
                                legend === 6 ? legend6CountryValue.includes('se') :
                                legend === 7 ? legend7CountryValue.includes('se') :
                                legend8CountryValue.includes('se')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Sweden</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ch'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ch') : 
                                legend === 2 ? legend2CountryValue.includes('ch') : 
                                legend === 3 ? legend3CountryValue.includes('ch') : 
                                legend === 4 ? legend4CountryValue.includes('ch') :
                                legend === 5 ? legend5CountryValue.includes('ch') :
                                legend === 6 ? legend6CountryValue.includes('ch') :
                                legend === 7 ? legend7CountryValue.includes('ch') :
                                legend8CountryValue.includes('ch')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Switzerland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ua'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('ua') : 
                                legend === 2 ? legend2CountryValue.includes('ua') : 
                                legend === 3 ? legend3CountryValue.includes('ua') : 
                                legend === 4 ? legend4CountryValue.includes('ua') :
                                legend === 5 ? legend5CountryValue.includes('ua') :
                                legend === 6 ? legend6CountryValue.includes('ua') :
                                legend === 7 ? legend7CountryValue.includes('ua') :
                                legend8CountryValue.includes('ua')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>Ukraine</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='gb'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                legend === 1 ? legend1CountryValue.includes('gb') : 
                                legend === 2 ? legend2CountryValue.includes('gb') : 
                                legend === 3 ? legend3CountryValue.includes('gb') : 
                                legend === 4 ? legend4CountryValue.includes('gb') :
                                legend === 5 ? legend5CountryValue.includes('gb') :
                                legend === 6 ? legend6CountryValue.includes('gb') :
                                legend === 7 ? legend7CountryValue.includes('gb') :
                                legend8CountryValue.includes('gb')
                            }
                            >
                        </input>
                        <label className='country-label-eu'>United Kingdom</label>
                    </li>
                </ul>
            </div>

        </div>
    )

}
export default Countries