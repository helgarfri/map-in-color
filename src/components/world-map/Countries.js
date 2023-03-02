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
    const allCountryIds = document.getElementsByClassName("country");
    
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
      <div className="state-selector">
            
      <div className="countries">
          
          

         

        

          <ul>
          <li>
               <div className="continents">
                    <img className='con-icon' src='../assets/africa.png'></img>

                    <label className='con-label'>Africa</label>
              </div>         
          </li>
                  
              <li>
                  <input  
                      type='checkbox' 
                      value='dz'
                      className="country"
                      onChange={handleChange} 
                      
                      
                      checked={
                        legend === 1 ? legend1CountryValue.includes('dz') : 
                        legend === 2 ? legend2CountryValue.includes('dz') : 
                        legend === 3 ? legend3CountryValue.includes('dz') : 
                        legend === 4 ? legend4CountryValue.includes('dz') :
                        legend === 5 ? legend5CountryValue.includes('dz') :
                        legend === 6 ? legend6CountryValue.includes('dz') :
                        legend === 7 ? legend7CountryValue.includes('dz') :
                        legend8CountryValue.includes('dz')
                    }
                      >
                  </input>
                  <label className='country-label'>Algeria</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='ao'
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ao') : 
                        legend === 2 ? legend2CountryValue.includes('ao') : 
                        legend === 3 ? legend3CountryValue.includes('ao') : 
                        legend === 4 ? legend4CountryValue.includes('ao') :
                        legend === 5 ? legend5CountryValue.includes('ao') :
                        legend === 6 ? legend6CountryValue.includes('ao') :
                        legend === 7 ? legend7CountryValue.includes('ao') :
                        legend8CountryValue.includes('ao')
                    }

                      
                      
                      >
                      
                  </input>
                  <label className='country-label'>Angola</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='bj'
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bj') : 
                        legend === 2 ? legend2CountryValue.includes('bj') : 
                        legend === 3 ? legend3CountryValue.includes('bj') : 
                        legend === 4 ? legend4CountryValue.includes('bj') :
                        legend === 5 ? legend5CountryValue.includes('bj') :
                        legend === 6 ? legend6CountryValue.includes('bj') :
                        legend === 7 ? legend7CountryValue.includes('bj') :
                        legend8CountryValue.includes('bj')
                    }
                      
                      
                      >
                      
                  </input>
                  <label className='country-label'>Benin</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bw'
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bw') : 
                        legend === 2 ? legend2CountryValue.includes('bw') : 
                        legend === 3 ? legend3CountryValue.includes('bw') : 
                        legend === 4 ? legend4CountryValue.includes('bw') :
                        legend === 5 ? legend5CountryValue.includes('bw') :
                        legend === 6 ? legend6CountryValue.includes('bw') :
                        legend === 7 ? legend7CountryValue.includes('bw') :
                        legend8CountryValue.includes('bw')
                    }
                      
                      
                      >
                      
                  </input>
                  <label className='country-label'>Botswana</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bf'
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bf') : 
                        legend === 2 ? legend2CountryValue.includes('bf') : 
                        legend === 3 ? legend3CountryValue.includes('bf') : 
                        legend === 4 ? legend4CountryValue.includes('bf') :
                        legend === 5 ? legend5CountryValue.includes('bf') :
                        legend === 6 ? legend6CountryValue.includes('bf') :
                        legend === 7 ? legend7CountryValue.includes('bf') :
                        legend8CountryValue.includes('bf')
                    }
                      
                      
                      >
                      
                  </input>
                  <label className='country-label'>Burkina Faso</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bi'
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bi') : 
                        legend === 2 ? legend2CountryValue.includes('bi') : 
                        legend === 3 ? legend3CountryValue.includes('bi') : 
                        legend === 4 ? legend4CountryValue.includes('bi') :
                        legend === 5 ? legend5CountryValue.includes('bi') :
                        legend === 6 ? legend6CountryValue.includes('bi') :
                        legend === 7 ? legend7CountryValue.includes('bi') :
                        legend8CountryValue.includes('bi')
                    }                            
                      
                      
                      >
                      
                  </input>
                  <label className='country-label'>Burundi</label>
              </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cv'
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('cv') : 
                    legend === 2 ? legend2CountryValue.includes('cv') : 
                    legend === 3 ? legend3CountryValue.includes('cv') : 
                    legend === 4 ? legend4CountryValue.includes('cv') :
                    legend === 5 ? legend5CountryValue.includes('cv') :
                    legend === 6 ? legend6CountryValue.includes('cv') :
                    legend === 7 ? legend7CountryValue.includes('cv') :
                    legend8CountryValue.includes('cv')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Cabo Verde</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cm'
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('cm') : 
                    legend === 2 ? legend2CountryValue.includes('cm') : 
                    legend === 3 ? legend3CountryValue.includes('cm') : 
                    legend === 4 ? legend4CountryValue.includes('cm') :
                    legend === 5 ? legend5CountryValue.includes('cm') :
                    legend === 6 ? legend6CountryValue.includes('cm') :
                    legend === 7 ? legend7CountryValue.includes('cm') :
                    legend8CountryValue.includes('cm')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Cameroon</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cf'
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('cf') : 
                    legend === 2 ? legend2CountryValue.includes('cf') : 
                    legend === 3 ? legend3CountryValue.includes('cf') : 
                    legend === 4 ? legend4CountryValue.includes('cf') :
                    legend === 5 ? legend5CountryValue.includes('cf') :
                    legend === 6 ? legend6CountryValue.includes('cf') :
                    legend === 7 ? legend7CountryValue.includes('cf') :
                    legend8CountryValue.includes('cf')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Central African Republic</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='td'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('td') : 
                    legend === 2 ? legend2CountryValue.includes('td') : 
                    legend === 3 ? legend3CountryValue.includes('td') : 
                    legend === 4 ? legend4CountryValue.includes('td') :
                    legend === 5 ? legend5CountryValue.includes('td') :
                    legend === 6 ? legend6CountryValue.includes('td') :
                    legend === 7 ? legend7CountryValue.includes('td') :
                    legend8CountryValue.includes('td')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Chad</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='km'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('km') : 
                    legend === 2 ? legend2CountryValue.includes('km') : 
                    legend === 3 ? legend3CountryValue.includes('km') : 
                    legend === 4 ? legend4CountryValue.includes('km') :
                    legend === 5 ? legend5CountryValue.includes('km') :
                    legend === 6 ? legend6CountryValue.includes('km') :
                    legend === 7 ? legend7CountryValue.includes('km') :
                    legend8CountryValue.includes('km')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Comoros</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('cg') : 
                    legend === 2 ? legend2CountryValue.includes('cg') : 
                    legend === 3 ? legend3CountryValue.includes('cg') : 
                    legend === 4 ? legend4CountryValue.includes('cg') :
                    legend === 5 ? legend5CountryValue.includes('cg') :
                    legend === 6 ? legend6CountryValue.includes('cg') :
                    legend === 7 ? legend7CountryValue.includes('cg') :
                    legend8CountryValue.includes('cg')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Congo</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ci'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ci') : 
                    legend === 2 ? legend2CountryValue.includes('ci') : 
                    legend === 3 ? legend3CountryValue.includes('ci') : 
                    legend === 4 ? legend4CountryValue.includes('ci') :
                    legend === 5 ? legend5CountryValue.includes('ci') :
                    legend === 6 ? legend6CountryValue.includes('ci') :
                    legend === 7 ? legend7CountryValue.includes('ci') :
                    legend8CountryValue.includes('ci')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Cote d'Ivoire</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='dj'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('dj') : 
                    legend === 2 ? legend2CountryValue.includes('dj') : 
                    legend === 3 ? legend3CountryValue.includes('dj') : 
                    legend === 4 ? legend4CountryValue.includes('dj') :
                    legend === 5 ? legend5CountryValue.includes('dj') :
                    legend === 6 ? legend6CountryValue.includes('dj') :
                    legend === 7 ? legend7CountryValue.includes('dj') :
                    legend8CountryValue.includes('dj')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Djibouti</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cd'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('cd') : 
                    legend === 2 ? legend2CountryValue.includes('cd') : 
                    legend === 3 ? legend3CountryValue.includes('cd') : 
                    legend === 4 ? legend4CountryValue.includes('cd') :
                    legend === 5 ? legend5CountryValue.includes('cd') :
                    legend === 6 ? legend6CountryValue.includes('cd') :
                    legend === 7 ? legend7CountryValue.includes('cd') :
                    legend8CountryValue.includes('cd')
                }                            
                  
                      >

              </input>
              <label className='country-label'>DR Congo</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='eg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('eg') : 
                    legend === 2 ? legend2CountryValue.includes('eg') : 
                    legend === 3 ? legend3CountryValue.includes('eg') : 
                    legend === 4 ? legend4CountryValue.includes('eg') :
                    legend === 5 ? legend5CountryValue.includes('eg') :
                    legend === 6 ? legend6CountryValue.includes('eg') :
                    legend === 7 ? legend7CountryValue.includes('eg') :
                    legend8CountryValue.includes('eg')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Egypt</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gq'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('gq') : 
                    legend === 2 ? legend2CountryValue.includes('gq') : 
                    legend === 3 ? legend3CountryValue.includes('gq') : 
                    legend === 4 ? legend4CountryValue.includes('gq') :
                    legend === 5 ? legend5CountryValue.includes('gq') :
                    legend === 6 ? legend6CountryValue.includes('gq') :
                    legend === 7 ? legend7CountryValue.includes('gq') :
                    legend8CountryValue.includes('gq')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Equatorial Guinea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='er'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('er') : 
                    legend === 2 ? legend2CountryValue.includes('er') : 
                    legend === 3 ? legend3CountryValue.includes('er') : 
                    legend === 4 ? legend4CountryValue.includes('er') :
                    legend === 5 ? legend5CountryValue.includes('er') :
                    legend === 6 ? legend6CountryValue.includes('er') :
                    legend === 7 ? legend7CountryValue.includes('er') :
                    legend8CountryValue.includes('er')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Eritrea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sz') : 
                    legend === 2 ? legend2CountryValue.includes('sz') : 
                    legend === 3 ? legend3CountryValue.includes('sz') : 
                    legend === 4 ? legend4CountryValue.includes('sz') :
                    legend === 5 ? legend5CountryValue.includes('sz') :
                    legend === 6 ? legend6CountryValue.includes('sz') :
                    legend === 7 ? legend7CountryValue.includes('sz') :
                    legend8CountryValue.includes('sz')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Eswatini</label>
          </li>
   
          <li>
              <input 
                  type='checkbox' 
                  value='et'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('et') : 
                    legend === 2 ? legend2CountryValue.includes('et') : 
                    legend === 3 ? legend3CountryValue.includes('et') : 
                    legend === 4 ? legend4CountryValue.includes('et') :
                    legend === 5 ? legend5CountryValue.includes('et') :
                    legend === 6 ? legend6CountryValue.includes('et') :
                    legend === 7 ? legend7CountryValue.includes('et') :
                    legend8CountryValue.includes('et')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Ethiopia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ga'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ga') : 
                    legend === 2 ? legend2CountryValue.includes('ga') : 
                    legend === 3 ? legend3CountryValue.includes('ga') : 
                    legend === 4 ? legend4CountryValue.includes('ga') :
                    legend === 5 ? legend5CountryValue.includes('ga') :
                    legend === 6 ? legend6CountryValue.includes('ga') :
                    legend === 7 ? legend7CountryValue.includes('ga') :
                    legend8CountryValue.includes('ga')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Gabon</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('gm') : 
                    legend === 2 ? legend2CountryValue.includes('gm') : 
                    legend === 3 ? legend3CountryValue.includes('gm') : 
                    legend === 4 ? legend4CountryValue.includes('gm') :
                    legend === 5 ? legend5CountryValue.includes('gm') :
                    legend === 6 ? legend6CountryValue.includes('gm') :
                    legend === 7 ? legend7CountryValue.includes('gm') :
                    legend8CountryValue.includes('gm')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Gambia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gh'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('gh') : 
                    legend === 2 ? legend2CountryValue.includes('gh') : 
                    legend === 3 ? legend3CountryValue.includes('gh') : 
                    legend === 4 ? legend4CountryValue.includes('gh') :
                    legend === 5 ? legend5CountryValue.includes('gh') :
                    legend === 6 ? legend6CountryValue.includes('gh') :
                    legend === 7 ? legend7CountryValue.includes('gh') :
                    legend8CountryValue.includes('gh')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Ghana</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('gn') : 
                    legend === 2 ? legend2CountryValue.includes('gn') : 
                    legend === 3 ? legend3CountryValue.includes('gn') : 
                    legend === 4 ? legend4CountryValue.includes('gn') :
                    legend === 5 ? legend5CountryValue.includes('gn') :
                    legend === 6 ? legend6CountryValue.includes('gn') :
                    legend === 7 ? legend7CountryValue.includes('gn') :
                    legend8CountryValue.includes('gn')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Guinea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('gw') : 
                    legend === 2 ? legend2CountryValue.includes('gw') : 
                    legend === 3 ? legend3CountryValue.includes('gw') : 
                    legend === 4 ? legend4CountryValue.includes('gw') :
                    legend === 5 ? legend5CountryValue.includes('gw') :
                    legend === 6 ? legend6CountryValue.includes('gw') :
                    legend === 7 ? legend7CountryValue.includes('gw') :
                    legend8CountryValue.includes('gw')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Guiana-Bissau</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='ke'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ke') : 
                    legend === 2 ? legend2CountryValue.includes('ke') : 
                    legend === 3 ? legend3CountryValue.includes('ke') : 
                    legend === 4 ? legend4CountryValue.includes('ke') :
                    legend === 5 ? legend5CountryValue.includes('ke') :
                    legend === 6 ? legend6CountryValue.includes('ke') :
                    legend === 7 ? legend7CountryValue.includes('ke') :
                    legend8CountryValue.includes('ke')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Kenya</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ls'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ls') : 
                    legend === 2 ? legend2CountryValue.includes('ls') : 
                    legend === 3 ? legend3CountryValue.includes('ls') : 
                    legend === 4 ? legend4CountryValue.includes('ls') :
                    legend === 5 ? legend5CountryValue.includes('ls') :
                    legend === 6 ? legend6CountryValue.includes('ls') :
                    legend === 7 ? legend7CountryValue.includes('ls') :
                    legend8CountryValue.includes('ls')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Lesotho</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='lr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('lr') : 
                    legend === 2 ? legend2CountryValue.includes('lr') : 
                    legend === 3 ? legend3CountryValue.includes('lr') : 
                    legend === 4 ? legend4CountryValue.includes('lr') :
                    legend === 5 ? legend5CountryValue.includes('lr') :
                    legend === 6 ? legend6CountryValue.includes('lr') :
                    legend === 7 ? legend7CountryValue.includes('lr') :
                    legend8CountryValue.includes('lr')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Liberia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ly'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ly') : 
                    legend === 2 ? legend2CountryValue.includes('ly') : 
                    legend === 3 ? legend3CountryValue.includes('ly') : 
                    legend === 4 ? legend4CountryValue.includes('ly') :
                    legend === 5 ? legend5CountryValue.includes('ly') :
                    legend === 6 ? legend6CountryValue.includes('ly') :
                    legend === 7 ? legend7CountryValue.includes('ly') :
                    legend8CountryValue.includes('ly')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Libya</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mg') : 
                    legend === 2 ? legend2CountryValue.includes('mg') : 
                    legend === 3 ? legend3CountryValue.includes('mg') : 
                    legend === 4 ? legend4CountryValue.includes('mg') :
                    legend === 5 ? legend5CountryValue.includes('mg') :
                    legend === 6 ? legend6CountryValue.includes('mg') :
                    legend === 7 ? legend7CountryValue.includes('mg') :
                    legend8CountryValue.includes('mg')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Madagascar</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mw') : 
                    legend === 2 ? legend2CountryValue.includes('mw') : 
                    legend === 3 ? legend3CountryValue.includes('mw') : 
                    legend === 4 ? legend4CountryValue.includes('mw') :
                    legend === 5 ? legend5CountryValue.includes('mw') :
                    legend === 6 ? legend6CountryValue.includes('mw') :
                    legend === 7 ? legend7CountryValue.includes('mw') :
                    legend8CountryValue.includes('mw')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Malawi</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ml'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ml') : 
                    legend === 2 ? legend2CountryValue.includes('ml') : 
                    legend === 3 ? legend3CountryValue.includes('ml') : 
                    legend === 4 ? legend4CountryValue.includes('ml') :
                    legend === 5 ? legend5CountryValue.includes('ml') :
                    legend === 6 ? legend6CountryValue.includes('ml') :
                    legend === 7 ? legend7CountryValue.includes('ml') :
                    legend8CountryValue.includes('ml')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Mali</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mr') : 
                    legend === 2 ? legend2CountryValue.includes('mr') : 
                    legend === 3 ? legend3CountryValue.includes('mr') : 
                    legend === 4 ? legend4CountryValue.includes('mr') :
                    legend === 5 ? legend5CountryValue.includes('mr') :
                    legend === 6 ? legend6CountryValue.includes('mr') :
                    legend === 7 ? legend7CountryValue.includes('mr') :
                    legend8CountryValue.includes('mr')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Mauritania</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mu'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mu') : 
                    legend === 2 ? legend2CountryValue.includes('mu') : 
                    legend === 3 ? legend3CountryValue.includes('mu') : 
                    legend === 4 ? legend4CountryValue.includes('mu') :
                    legend === 5 ? legend5CountryValue.includes('mu') :
                    legend === 6 ? legend6CountryValue.includes('mu') :
                    legend === 7 ? legend7CountryValue.includes('mu') :
                    legend8CountryValue.includes('mu')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Mauritius</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ma'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ma') : 
                    legend === 2 ? legend2CountryValue.includes('ma') : 
                    legend === 3 ? legend3CountryValue.includes('ma') : 
                    legend === 4 ? legend4CountryValue.includes('ma') :
                    legend === 5 ? legend5CountryValue.includes('ma') :
                    legend === 6 ? legend6CountryValue.includes('ma') :
                    legend === 7 ? legend7CountryValue.includes('ma') :
                    legend8CountryValue.includes('ma')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Morocco</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mz') : 
                    legend === 2 ? legend2CountryValue.includes('mz') : 
                    legend === 3 ? legend3CountryValue.includes('mz') : 
                    legend === 4 ? legend4CountryValue.includes('mz') :
                    legend === 5 ? legend5CountryValue.includes('mz') :
                    legend === 6 ? legend6CountryValue.includes('mz') :
                    legend === 7 ? legend7CountryValue.includes('mz') :
                    legend8CountryValue.includes('mz')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Mozambique</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='na'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('na') : 
                    legend === 2 ? legend2CountryValue.includes('na') : 
                    legend === 3 ? legend3CountryValue.includes('na') : 
                    legend === 4 ? legend4CountryValue.includes('na') :
                    legend === 5 ? legend5CountryValue.includes('na') :
                    legend === 6 ? legend6CountryValue.includes('na') :
                    legend === 7 ? legend7CountryValue.includes('na') :
                    legend8CountryValue.includes('na')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Namibia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ne'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ne') : 
                    legend === 2 ? legend2CountryValue.includes('ne') : 
                    legend === 3 ? legend3CountryValue.includes('ne') : 
                    legend === 4 ? legend4CountryValue.includes('ne') :
                    legend === 5 ? legend5CountryValue.includes('ne') :
                    legend === 6 ? legend6CountryValue.includes('ne') :
                    legend === 7 ? legend7CountryValue.includes('ne') :
                    legend8CountryValue.includes('ne')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Niger</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ng'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ng') : 
                    legend === 2 ? legend2CountryValue.includes('ng') : 
                    legend === 3 ? legend3CountryValue.includes('ng') : 
                    legend === 4 ? legend4CountryValue.includes('ng') :
                    legend === 5 ? legend5CountryValue.includes('ng') :
                    legend === 6 ? legend6CountryValue.includes('ng') :
                    legend === 7 ? legend7CountryValue.includes('ng') :
                    legend8CountryValue.includes('ng')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Nigeria</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='rw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('rw') : 
                    legend === 2 ? legend2CountryValue.includes('rw') : 
                    legend === 3 ? legend3CountryValue.includes('rw') : 
                    legend === 4 ? legend4CountryValue.includes('rw') :
                    legend === 5 ? legend5CountryValue.includes('rw') :
                    legend === 6 ? legend6CountryValue.includes('rw') :
                    legend === 7 ? legend7CountryValue.includes('rw') :
                    legend8CountryValue.includes('rw')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Rwanda</label>
          </li>


          <li>
              <input 
                  type='checkbox' 
                  value='st'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('st') : 
                    legend === 2 ? legend2CountryValue.includes('st') : 
                    legend === 3 ? legend3CountryValue.includes('st') : 
                    legend === 4 ? legend4CountryValue.includes('st') :
                    legend === 5 ? legend5CountryValue.includes('st') :
                    legend === 6 ? legend6CountryValue.includes('st') :
                    legend === 7 ? legend7CountryValue.includes('st') :
                    legend8CountryValue.includes('st')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Sao Tome and Principe</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sn') : 
                    legend === 2 ? legend2CountryValue.includes('sn') : 
                    legend === 3 ? legend3CountryValue.includes('sn') : 
                    legend === 4 ? legend4CountryValue.includes('sn') :
                    legend === 5 ? legend5CountryValue.includes('sn') :
                    legend === 6 ? legend6CountryValue.includes('sn') :
                    legend === 7 ? legend7CountryValue.includes('sn') :
                    legend8CountryValue.includes('sn')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Senegal</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sc'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sc') : 
                    legend === 2 ? legend2CountryValue.includes('sc') : 
                    legend === 3 ? legend3CountryValue.includes('sc') : 
                    legend === 4 ? legend4CountryValue.includes('sc') :
                    legend === 5 ? legend5CountryValue.includes('sc') :
                    legend === 6 ? legend6CountryValue.includes('sc') :
                    legend === 7 ? legend7CountryValue.includes('sc') :
                    legend8CountryValue.includes('sc')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Seychelles</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sl'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sl') : 
                    legend === 2 ? legend2CountryValue.includes('sl') : 
                    legend === 3 ? legend3CountryValue.includes('sl') : 
                    legend === 4 ? legend4CountryValue.includes('sl') :
                    legend === 5 ? legend5CountryValue.includes('sl') :
                    legend === 6 ? legend6CountryValue.includes('sl') :
                    legend === 7 ? legend7CountryValue.includes('sl') :
                    legend8CountryValue.includes('sl')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Sierra Leone</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='so'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('so') : 
                    legend === 2 ? legend2CountryValue.includes('so') : 
                    legend === 3 ? legend3CountryValue.includes('so') : 
                    legend === 4 ? legend4CountryValue.includes('so') :
                    legend === 5 ? legend5CountryValue.includes('so') :
                    legend === 6 ? legend6CountryValue.includes('so') :
                    legend === 7 ? legend7CountryValue.includes('so') :
                    legend8CountryValue.includes('so')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Somalia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='za'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('za') : 
                    legend === 2 ? legend2CountryValue.includes('za') : 
                    legend === 3 ? legend3CountryValue.includes('za') : 
                    legend === 4 ? legend4CountryValue.includes('za') :
                    legend === 5 ? legend5CountryValue.includes('za') :
                    legend === 6 ? legend6CountryValue.includes('za') :
                    legend === 7 ? legend7CountryValue.includes('za') :
                    legend8CountryValue.includes('za')
                }                            
                  
                      >

              </input>
              <label className='country-label'>South Africa</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ss'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ss') : 
                    legend === 2 ? legend2CountryValue.includes('ss') : 
                    legend === 3 ? legend3CountryValue.includes('ss') : 
                    legend === 4 ? legend4CountryValue.includes('ss') :
                    legend === 5 ? legend5CountryValue.includes('ss') :
                    legend === 6 ? legend6CountryValue.includes('ss') :
                    legend === 7 ? legend7CountryValue.includes('ss') :
                    legend8CountryValue.includes('ss')
                }                            
                  
                      >

              </input>
              <label className='country-label'>South Sudan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sd'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sd') : 
                    legend === 2 ? legend2CountryValue.includes('sd') : 
                    legend === 3 ? legend3CountryValue.includes('sd') : 
                    legend === 4 ? legend4CountryValue.includes('sd') :
                    legend === 5 ? legend5CountryValue.includes('sd') :
                    legend === 6 ? legend6CountryValue.includes('sd') :
                    legend === 7 ? legend7CountryValue.includes('sd') :
                    legend8CountryValue.includes('sd')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Sudan</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='tz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tz') : 
                    legend === 2 ? legend2CountryValue.includes('tz') : 
                    legend === 3 ? legend3CountryValue.includes('tz') : 
                    legend === 4 ? legend4CountryValue.includes('tz') :
                    legend === 5 ? legend5CountryValue.includes('tz') :
                    legend === 6 ? legend6CountryValue.includes('tz') :
                    legend === 7 ? legend7CountryValue.includes('tz') :
                    legend8CountryValue.includes('tz')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Tanzania</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tg') : 
                    legend === 2 ? legend2CountryValue.includes('tg') : 
                    legend === 3 ? legend3CountryValue.includes('tg') : 
                    legend === 4 ? legend4CountryValue.includes('tg') :
                    legend === 5 ? legend5CountryValue.includes('tg') :
                    legend === 6 ? legend6CountryValue.includes('tg') :
                    legend === 7 ? legend7CountryValue.includes('tg') :
                    legend8CountryValue.includes('tg')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Togo</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tn') : 
                    legend === 2 ? legend2CountryValue.includes('tn') : 
                    legend === 3 ? legend3CountryValue.includes('tn') : 
                    legend === 4 ? legend4CountryValue.includes('tn') :
                    legend === 5 ? legend5CountryValue.includes('tn') :
                    legend === 6 ? legend6CountryValue.includes('tn') :
                    legend === 7 ? legend7CountryValue.includes('tn') :
                    legend8CountryValue.includes('tn')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Tunisia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ug'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ug') : 
                    legend === 2 ? legend2CountryValue.includes('ug') : 
                    legend === 3 ? legend3CountryValue.includes('ug') : 
                    legend === 4 ? legend4CountryValue.includes('ug') :
                    legend === 5 ? legend5CountryValue.includes('ug') :
                    legend === 6 ? legend6CountryValue.includes('ug') :
                    legend === 7 ? legend7CountryValue.includes('ug') :
                    legend8CountryValue.includes('ug')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Uganda</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='zm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('zm') : 
                    legend === 2 ? legend2CountryValue.includes('zm') : 
                    legend === 3 ? legend3CountryValue.includes('zm') : 
                    legend === 4 ? legend4CountryValue.includes('zm') :
                    legend === 5 ? legend5CountryValue.includes('zm') :
                    legend === 6 ? legend6CountryValue.includes('zm') :
                    legend === 7 ? legend7CountryValue.includes('zm') :
                    legend8CountryValue.includes('zm')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Zambia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='zw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('zw') : 
                    legend === 2 ? legend2CountryValue.includes('zw') : 
                    legend === 3 ? legend3CountryValue.includes('zw') : 
                    legend === 4 ? legend4CountryValue.includes('zw') :
                    legend === 5 ? legend5CountryValue.includes('zw') :
                    legend === 6 ? legend6CountryValue.includes('zw') :
                    legend === 7 ? legend7CountryValue.includes('zw') :
                    legend8CountryValue.includes('zw')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Zimbabwe</label>
          </li>


          </ul>

      </div>

      <div className="countries">
          
          

      

        

          <ul>

          <li>
               <div className="continents">
                    <img className='con-icon' src='../assets/asia.png'></img>

                    <label className='con-label'>Asia</label>
              </div>         
          </li>
                  
              <li>
                  <input 
                      type='checkbox' 
                      value='af'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('af') : 
                        legend === 2 ? legend2CountryValue.includes('af') : 
                        legend === 3 ? legend3CountryValue.includes('af') : 
                        legend === 4 ? legend4CountryValue.includes('af') :
                        legend === 5 ? legend5CountryValue.includes('af') :
                        legend === 6 ? legend6CountryValue.includes('af') :
                        legend === 7 ? legend7CountryValue.includes('af') :
                        legend8CountryValue.includes('af')
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Afghanistan</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='am'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('am') : 
                        legend === 2 ? legend2CountryValue.includes('am') : 
                        legend === 3 ? legend3CountryValue.includes('am') : 
                        legend === 4 ? legend4CountryValue.includes('am') :
                        legend === 5 ? legend5CountryValue.includes('am') :
                        legend === 6 ? legend6CountryValue.includes('am') :
                        legend === 7 ? legend7CountryValue.includes('am') :
                        legend8CountryValue.includes('am')
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Armenia</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='az'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('az') : 
                        legend === 2 ? legend2CountryValue.includes('az') : 
                        legend === 3 ? legend3CountryValue.includes('az') : 
                        legend === 4 ? legend4CountryValue.includes('az') :
                        legend === 5 ? legend5CountryValue.includes('az') :
                        legend === 6 ? legend6CountryValue.includes('az') :
                        legend === 7 ? legend7CountryValue.includes('az') :
                        legend8CountryValue.includes('az')
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Azerbaijan</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bh'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bh') : 
                        legend === 2 ? legend2CountryValue.includes('bh') : 
                        legend === 3 ? legend3CountryValue.includes('bh') : 
                        legend === 4 ? legend4CountryValue.includes('bh') :
                        legend === 5 ? legend5CountryValue.includes('bh') :
                        legend === 6 ? legend6CountryValue.includes('bh') :
                        legend === 7 ? legend7CountryValue.includes('bh') :
                        legend8CountryValue.includes('bh')
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Bahrain</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bd'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bd') : 
                        legend === 2 ? legend2CountryValue.includes('bd') : 
                        legend === 3 ? legend3CountryValue.includes('bd') : 
                        legend === 4 ? legend4CountryValue.includes('bd') :
                        legend === 5 ? legend5CountryValue.includes('bd') :
                        legend === 6 ? legend6CountryValue.includes('bd') :
                        legend === 7 ? legend7CountryValue.includes('bd') :
                        legend8CountryValue.includes('bd')
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Bangladesh</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bt') : 
                        legend === 2 ? legend2CountryValue.includes('bt') : 
                        legend === 3 ? legend3CountryValue.includes('bt') : 
                        legend === 4 ? legend4CountryValue.includes('bt') :
                        legend === 5 ? legend5CountryValue.includes('bt') :
                        legend === 6 ? legend6CountryValue.includes('bt') :
                        legend === 7 ? legend7CountryValue.includes('bt') :
                        legend8CountryValue.includes('bt')
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Bhutan</label>
              </li>

          <li>
              <input 
                  type='checkbox' 
                  value='bn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('bn') : 
                    legend === 2 ? legend2CountryValue.includes('bn') : 
                    legend === 3 ? legend3CountryValue.includes('bn') : 
                    legend === 4 ? legend4CountryValue.includes('bn') :
                    legend === 5 ? legend5CountryValue.includes('bn') :
                    legend === 6 ? legend6CountryValue.includes('bn') :
                    legend === 7 ? legend7CountryValue.includes('bn') :
                    legend8CountryValue.includes('bn')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Brunei</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kh'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('kh') : 
                    legend === 2 ? legend2CountryValue.includes('kh') : 
                    legend === 3 ? legend3CountryValue.includes('kh') : 
                    legend === 4 ? legend4CountryValue.includes('kh') :
                    legend === 5 ? legend5CountryValue.includes('kh') :
                    legend === 6 ? legend6CountryValue.includes('kh') :
                    legend === 7 ? legend7CountryValue.includes('kh') :
                    legend8CountryValue.includes('kh')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Cambodia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('cn') : 
                    legend === 2 ? legend2CountryValue.includes('cn') : 
                    legend === 3 ? legend3CountryValue.includes('cn') : 
                    legend === 4 ? legend4CountryValue.includes('cn') :
                    legend === 5 ? legend5CountryValue.includes('cn') :
                    legend === 6 ? legend6CountryValue.includes('cn') :
                    legend === 7 ? legend7CountryValue.includes('cn') :
                    legend8CountryValue.includes('cn')
                }                            
                  
                      >

              </input>
              <label className='country-label'>China</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cy'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('cy') : 
                    legend === 2 ? legend2CountryValue.includes('cy') : 
                    legend === 3 ? legend3CountryValue.includes('cy') : 
                    legend === 4 ? legend4CountryValue.includes('cy') :
                    legend === 5 ? legend5CountryValue.includes('cy') :
                    legend === 6 ? legend6CountryValue.includes('cy') :
                    legend === 7 ? legend7CountryValue.includes('cy') :
                    legend8CountryValue.includes('cy')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Cyprus</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ge'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ge') : 
                    legend === 2 ? legend2CountryValue.includes('ge') : 
                    legend === 3 ? legend3CountryValue.includes('ge') : 
                    legend === 4 ? legend4CountryValue.includes('ge') :
                    legend === 5 ? legend5CountryValue.includes('ge') :
                    legend === 6 ? legend6CountryValue.includes('ge') :
                    legend === 7 ? legend7CountryValue.includes('ge') :
                    legend8CountryValue.includes('ge')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Georgia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='in'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('in') : 
                    legend === 2 ? legend2CountryValue.includes('in') : 
                    legend === 3 ? legend3CountryValue.includes('in') : 
                    legend === 4 ? legend4CountryValue.includes('in') :
                    legend === 5 ? legend5CountryValue.includes('in') :
                    legend === 6 ? legend6CountryValue.includes('in') :
                    legend === 7 ? legend7CountryValue.includes('in') :
                    legend8CountryValue.includes('in')
                }                            
                  
                      >

              </input>
              <label className='country-label'>India</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='id'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('id') : 
                    legend === 2 ? legend2CountryValue.includes('id') : 
                    legend === 3 ? legend3CountryValue.includes('id') : 
                    legend === 4 ? legend4CountryValue.includes('id') :
                    legend === 5 ? legend5CountryValue.includes('id') :
                    legend === 6 ? legend6CountryValue.includes('id') :
                    legend === 7 ? legend7CountryValue.includes('id') :
                    legend8CountryValue.includes('id')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Indonesia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ir'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ir') : 
                    legend === 2 ? legend2CountryValue.includes('ir') : 
                    legend === 3 ? legend3CountryValue.includes('ir') : 
                    legend === 4 ? legend4CountryValue.includes('ir') :
                    legend === 5 ? legend5CountryValue.includes('ir') :
                    legend === 6 ? legend6CountryValue.includes('ir') :
                    legend === 7 ? legend7CountryValue.includes('ir') :
                    legend8CountryValue.includes('ir')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Iran</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='iq'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('iq') : 
                    legend === 2 ? legend2CountryValue.includes('iq') : 
                    legend === 3 ? legend3CountryValue.includes('iq') : 
                    legend === 4 ? legend4CountryValue.includes('iq') :
                    legend === 5 ? legend5CountryValue.includes('iq') :
                    legend === 6 ? legend6CountryValue.includes('iq') :
                    legend === 7 ? legend7CountryValue.includes('iq') :
                    legend8CountryValue.includes('iq')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Iraq</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='il'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('il') : 
                    legend === 2 ? legend2CountryValue.includes('il') : 
                    legend === 3 ? legend3CountryValue.includes('il') : 
                    legend === 4 ? legend4CountryValue.includes('il') :
                    legend === 5 ? legend5CountryValue.includes('il') :
                    legend === 6 ? legend6CountryValue.includes('il') :
                    legend === 7 ? legend7CountryValue.includes('il') :
                    legend8CountryValue.includes('il')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Israel</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='jp'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('jp') : 
                    legend === 2 ? legend2CountryValue.includes('jp') : 
                    legend === 3 ? legend3CountryValue.includes('jp') : 
                    legend === 4 ? legend4CountryValue.includes('jp') :
                    legend === 5 ? legend5CountryValue.includes('jp') :
                    legend === 6 ? legend6CountryValue.includes('jp') :
                    legend === 7 ? legend7CountryValue.includes('jp') :
                    legend8CountryValue.includes('jp')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Japan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='jo'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('jo') : 
                    legend === 2 ? legend2CountryValue.includes('jo') : 
                    legend === 3 ? legend3CountryValue.includes('jo') : 
                    legend === 4 ? legend4CountryValue.includes('jo') :
                    legend === 5 ? legend5CountryValue.includes('jo') :
                    legend === 6 ? legend6CountryValue.includes('jo') :
                    legend === 7 ? legend7CountryValue.includes('jo') :
                    legend8CountryValue.includes('jo')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Jordan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('kz') : 
                    legend === 2 ? legend2CountryValue.includes('kz') : 
                    legend === 3 ? legend3CountryValue.includes('kz') : 
                    legend === 4 ? legend4CountryValue.includes('kz') :
                    legend === 5 ? legend5CountryValue.includes('kz') :
                    legend === 6 ? legend6CountryValue.includes('kz') :
                    legend === 7 ? legend7CountryValue.includes('kz') :
                    legend8CountryValue.includes('kz')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Kazakhstan</label>
          </li>
   
          <li>
              <input 
                  type='checkbox' 
                  value='kw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('kw') : 
                    legend === 2 ? legend2CountryValue.includes('kw') : 
                    legend === 3 ? legend3CountryValue.includes('kw') : 
                    legend === 4 ? legend4CountryValue.includes('kw') :
                    legend === 5 ? legend5CountryValue.includes('kw') :
                    legend === 6 ? legend6CountryValue.includes('kw') :
                    legend === 7 ? legend7CountryValue.includes('kw') :
                    legend8CountryValue.includes('kw')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Kuwait</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('kg') : 
                    legend === 2 ? legend2CountryValue.includes('kg') : 
                    legend === 3 ? legend3CountryValue.includes('kg') : 
                    legend === 4 ? legend4CountryValue.includes('kg') :
                    legend === 5 ? legend5CountryValue.includes('kg') :
                    legend === 6 ? legend6CountryValue.includes('kg') :
                    legend === 7 ? legend7CountryValue.includes('kg') :
                    legend8CountryValue.includes('kg')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Kyrgyzstan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='la'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('la') : 
                    legend === 2 ? legend2CountryValue.includes('la') : 
                    legend === 3 ? legend3CountryValue.includes('la') : 
                    legend === 4 ? legend4CountryValue.includes('la') :
                    legend === 5 ? legend5CountryValue.includes('la') :
                    legend === 6 ? legend6CountryValue.includes('la') :
                    legend === 7 ? legend7CountryValue.includes('la') :
                    legend8CountryValue.includes('la')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Laos</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='lb'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('lb') : 
                    legend === 2 ? legend2CountryValue.includes('lb') : 
                    legend === 3 ? legend3CountryValue.includes('lb') : 
                    legend === 4 ? legend4CountryValue.includes('lb') :
                    legend === 5 ? legend5CountryValue.includes('lb') :
                    legend === 6 ? legend6CountryValue.includes('lb') :
                    legend === 7 ? legend7CountryValue.includes('lb') :
                    legend8CountryValue.includes('lb')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Lebanon</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='my'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('my') : 
                    legend === 2 ? legend2CountryValue.includes('my') : 
                    legend === 3 ? legend3CountryValue.includes('my') : 
                    legend === 4 ? legend4CountryValue.includes('my') :
                    legend === 5 ? legend5CountryValue.includes('my') :
                    legend === 6 ? legend6CountryValue.includes('my') :
                    legend === 7 ? legend7CountryValue.includes('my') :
                    legend8CountryValue.includes('my')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Malaysia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mv'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mv') : 
                    legend === 2 ? legend2CountryValue.includes('mv') : 
                    legend === 3 ? legend3CountryValue.includes('mv') : 
                    legend === 4 ? legend4CountryValue.includes('mv') :
                    legend === 5 ? legend5CountryValue.includes('mv') :
                    legend === 6 ? legend6CountryValue.includes('mv') :
                    legend === 7 ? legend7CountryValue.includes('mv') :
                    legend8CountryValue.includes('mv')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Maldives</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mn') : 
                    legend === 2 ? legend2CountryValue.includes('mn') : 
                    legend === 3 ? legend3CountryValue.includes('mn') : 
                    legend === 4 ? legend4CountryValue.includes('mn') :
                    legend === 5 ? legend5CountryValue.includes('mn') :
                    legend === 6 ? legend6CountryValue.includes('mn') :
                    legend === 7 ? legend7CountryValue.includes('mn') :
                    legend8CountryValue.includes('mn')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Mongolia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('mm') : 
                    legend === 2 ? legend2CountryValue.includes('mm') : 
                    legend === 3 ? legend3CountryValue.includes('mm') : 
                    legend === 4 ? legend4CountryValue.includes('mm') :
                    legend === 5 ? legend5CountryValue.includes('mm') :
                    legend === 6 ? legend6CountryValue.includes('mm') :
                    legend === 7 ? legend7CountryValue.includes('mm') :
                    legend8CountryValue.includes('mm')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Myanmar</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='np'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('np') : 
                    legend === 2 ? legend2CountryValue.includes('np') : 
                    legend === 3 ? legend3CountryValue.includes('np') : 
                    legend === 4 ? legend4CountryValue.includes('np') :
                    legend === 5 ? legend5CountryValue.includes('np') :
                    legend === 6 ? legend6CountryValue.includes('np') :
                    legend === 7 ? legend7CountryValue.includes('np') :
                    legend8CountryValue.includes('np')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Nepal</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kp'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('kp') : 
                    legend === 2 ? legend2CountryValue.includes('kp') : 
                    legend === 3 ? legend3CountryValue.includes('kp') : 
                    legend === 4 ? legend4CountryValue.includes('kp') :
                    legend === 5 ? legend5CountryValue.includes('kp') :
                    legend === 6 ? legend6CountryValue.includes('kp') :
                    legend === 7 ? legend7CountryValue.includes('kp') :
                    legend8CountryValue.includes('kp')
                }                            
                  
                      >

              </input>
              <label className='country-label'>North Korea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='om'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('om') : 
                    legend === 2 ? legend2CountryValue.includes('om') : 
                    legend === 3 ? legend3CountryValue.includes('om') : 
                    legend === 4 ? legend4CountryValue.includes('om') :
                    legend === 5 ? legend5CountryValue.includes('om') :
                    legend === 6 ? legend6CountryValue.includes('om') :
                    legend === 7 ? legend7CountryValue.includes('om') :
                    legend8CountryValue.includes('om')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Oman</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='pk'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('pk') : 
                    legend === 2 ? legend2CountryValue.includes('pk') : 
                    legend === 3 ? legend3CountryValue.includes('pk') : 
                    legend === 4 ? legend4CountryValue.includes('pk') :
                    legend === 5 ? legend5CountryValue.includes('pk') :
                    legend === 6 ? legend6CountryValue.includes('pk') :
                    legend === 7 ? legend7CountryValue.includes('pk') :
                    legend8CountryValue.includes('pk')
                }                            
                  
                      >

              </input>
              <label className='country-label'>Pakistan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ps'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ps') : 
                    legend === 2 ? legend2CountryValue.includes('ps') : 
                    legend === 3 ? legend3CountryValue.includes('ps') : 
                    legend === 4 ? legend4CountryValue.includes('ps') :
                    legend === 5 ? legend5CountryValue.includes('ps') :
                    legend === 6 ? legend6CountryValue.includes('ps') :
                    legend === 7 ? legend7CountryValue.includes('ps') :
                    legend8CountryValue.includes('ps')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Palestine</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ph'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ph') : 
                    legend === 2 ? legend2CountryValue.includes('ph') : 
                    legend === 3 ? legend3CountryValue.includes('ph') : 
                    legend === 4 ? legend4CountryValue.includes('ph') :
                    legend === 5 ? legend5CountryValue.includes('ph') :
                    legend === 6 ? legend6CountryValue.includes('ph') :
                    legend === 7 ? legend7CountryValue.includes('ph') :
                    legend8CountryValue.includes('ph')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Philippines</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='qa'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('qa') : 
                    legend === 2 ? legend2CountryValue.includes('qa') : 
                    legend === 3 ? legend3CountryValue.includes('qa') : 
                    legend === 4 ? legend4CountryValue.includes('qa') :
                    legend === 5 ? legend5CountryValue.includes('qa') :
                    legend === 6 ? legend6CountryValue.includes('qa') :
                    legend === 7 ? legend7CountryValue.includes('qa') :
                    legend8CountryValue.includes('qa')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Qatar</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sa'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sa') : 
                    legend === 2 ? legend2CountryValue.includes('sa') : 
                    legend === 3 ? legend3CountryValue.includes('sa') : 
                    legend === 4 ? legend4CountryValue.includes('sa') :
                    legend === 5 ? legend5CountryValue.includes('sa') :
                    legend === 6 ? legend6CountryValue.includes('sa') :
                    legend === 7 ? legend7CountryValue.includes('sa') :
                    legend8CountryValue.includes('sa')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Saudi Arabia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sg') : 
                    legend === 2 ? legend2CountryValue.includes('sg') : 
                    legend === 3 ? legend3CountryValue.includes('sg') : 
                    legend === 4 ? legend4CountryValue.includes('sg') :
                    legend === 5 ? legend5CountryValue.includes('sg') :
                    legend === 6 ? legend6CountryValue.includes('sg') :
                    legend === 7 ? legend7CountryValue.includes('sg') :
                    legend8CountryValue.includes('sg')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Singapore</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('kr') : 
                    legend === 2 ? legend2CountryValue.includes('kr') : 
                    legend === 3 ? legend3CountryValue.includes('kr') : 
                    legend === 4 ? legend4CountryValue.includes('kr') :
                    legend === 5 ? legend5CountryValue.includes('kr') :
                    legend === 6 ? legend6CountryValue.includes('kr') :
                    legend === 7 ? legend7CountryValue.includes('kr') :
                    legend8CountryValue.includes('kr')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>South Korea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='lk'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('lk') : 
                    legend === 2 ? legend2CountryValue.includes('lk') : 
                    legend === 3 ? legend3CountryValue.includes('lk') : 
                    legend === 4 ? legend4CountryValue.includes('lk') :
                    legend === 5 ? legend5CountryValue.includes('lk') :
                    legend === 6 ? legend6CountryValue.includes('lk') :
                    legend === 7 ? legend7CountryValue.includes('lk') :
                    legend8CountryValue.includes('lk')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Sri Lanka</label>
          </li>


          <li>
              <input 
                  type='checkbox' 
                  value='sy'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('sy') : 
                    legend === 2 ? legend2CountryValue.includes('sy') : 
                    legend === 3 ? legend3CountryValue.includes('sy') : 
                    legend === 4 ? legend4CountryValue.includes('sy') :
                    legend === 5 ? legend5CountryValue.includes('sy') :
                    legend === 6 ? legend6CountryValue.includes('sy') :
                    legend === 7 ? legend7CountryValue.includes('sy') :
                    legend8CountryValue.includes('sy')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Syria</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tw') : 
                    legend === 2 ? legend2CountryValue.includes('tw') : 
                    legend === 3 ? legend3CountryValue.includes('tw') : 
                    legend === 4 ? legend4CountryValue.includes('tw') :
                    legend === 5 ? legend5CountryValue.includes('tw') :
                    legend === 6 ? legend6CountryValue.includes('tw') :
                    legend === 7 ? legend7CountryValue.includes('tw') :
                    legend8CountryValue.includes('tw')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Taiwan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tj'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tj') : 
                    legend === 2 ? legend2CountryValue.includes('tj') : 
                    legend === 3 ? legend3CountryValue.includes('tj') : 
                    legend === 4 ? legend4CountryValue.includes('tj') :
                    legend === 5 ? legend5CountryValue.includes('tj') :
                    legend === 6 ? legend6CountryValue.includes('tj') :
                    legend === 7 ? legend7CountryValue.includes('tj') :
                    legend8CountryValue.includes('tj')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Tajikistan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='th'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('th') : 
                    legend === 2 ? legend2CountryValue.includes('th') : 
                    legend === 3 ? legend3CountryValue.includes('th') : 
                    legend === 4 ? legend4CountryValue.includes('th') :
                    legend === 5 ? legend5CountryValue.includes('th') :
                    legend === 6 ? legend6CountryValue.includes('th') :
                    legend === 7 ? legend7CountryValue.includes('th') :
                    legend8CountryValue.includes('th')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Thailand</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tl'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tl') : 
                    legend === 2 ? legend2CountryValue.includes('tl') : 
                    legend === 3 ? legend3CountryValue.includes('tl') : 
                    legend === 4 ? legend4CountryValue.includes('tl') :
                    legend === 5 ? legend5CountryValue.includes('tl') :
                    legend === 6 ? legend6CountryValue.includes('tl') :
                    legend === 7 ? legend7CountryValue.includes('tl') :
                    legend8CountryValue.includes('tl')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Timor-Leste</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tr') : 
                    legend === 2 ? legend2CountryValue.includes('tr') : 
                    legend === 3 ? legend3CountryValue.includes('tr') : 
                    legend === 4 ? legend4CountryValue.includes('tr') :
                    legend === 5 ? legend5CountryValue.includes('tr') :
                    legend === 6 ? legend6CountryValue.includes('tr') :
                    legend === 7 ? legend7CountryValue.includes('tr') :
                    legend8CountryValue.includes('tr')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Turkey</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('tm') : 
                    legend === 2 ? legend2CountryValue.includes('tm') : 
                    legend === 3 ? legend3CountryValue.includes('tm') : 
                    legend === 4 ? legend4CountryValue.includes('tm') :
                    legend === 5 ? legend5CountryValue.includes('tm') :
                    legend === 6 ? legend6CountryValue.includes('tm') :
                    legend === 7 ? legend7CountryValue.includes('tm') :
                    legend8CountryValue.includes('tm')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Turkmenistan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ae'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ae') : 
                    legend === 2 ? legend2CountryValue.includes('ae') : 
                    legend === 3 ? legend3CountryValue.includes('ae') : 
                    legend === 4 ? legend4CountryValue.includes('ae') :
                    legend === 5 ? legend5CountryValue.includes('ae') :
                    legend === 6 ? legend6CountryValue.includes('ae') :
                    legend === 7 ? legend7CountryValue.includes('ae') :
                    legend8CountryValue.includes('ae')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>United Arab Emirates</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='uz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('uz') : 
                    legend === 2 ? legend2CountryValue.includes('uz') : 
                    legend === 3 ? legend3CountryValue.includes('uz') : 
                    legend === 4 ? legend4CountryValue.includes('uz') :
                    legend === 5 ? legend5CountryValue.includes('uz') :
                    legend === 6 ? legend6CountryValue.includes('uz') :
                    legend === 7 ? legend7CountryValue.includes('uz') :
                    legend8CountryValue.includes('uz')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Uzbekistan</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='vn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('vn') : 
                    legend === 2 ? legend2CountryValue.includes('vn') : 
                    legend === 3 ? legend3CountryValue.includes('vn') : 
                    legend === 4 ? legend4CountryValue.includes('vn') :
                    legend === 5 ? legend5CountryValue.includes('vn') :
                    legend === 6 ? legend6CountryValue.includes('vn') :
                    legend === 7 ? legend7CountryValue.includes('vn') :
                    legend8CountryValue.includes('vn')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Vietnam</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ye'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={
                    legend === 1 ? legend1CountryValue.includes('ye') : 
                    legend === 2 ? legend2CountryValue.includes('ye') : 
                    legend === 3 ? legend3CountryValue.includes('ye') : 
                    legend === 4 ? legend4CountryValue.includes('ye') :
                    legend === 5 ? legend5CountryValue.includes('ye') :
                    legend === 6 ? legend6CountryValue.includes('ye') :
                    legend === 7 ? legend7CountryValue.includes('ye') :
                    legend8CountryValue.includes('ye')    
                }                            
                  
                      >

              </input>
              <label className='country-label'>Yemen</label>
          </li>
          </ul>

      </div>
          <div className="countries">
          
          


            

              <ul>
                      
          <li>
              
              <div className="continents">
                      <img className='con-icon' src='../assets/europe.png'></img>

                      <label className='con-label'>Europe</label>
              </div>
             
    </li>
                  <li>
                      <input 
                          type='checkbox' 
                          value='al'
                          name='' 
                          className="country"
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
                      <label className='country-label'>Albania</label>
                  </li>
              
                  <li>
                      <input 
                          type='checkbox' 
                          value='ad'
                          name='' 
                          className="country"
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
                      <label className='country-label'>Andorra</label>
                  </li>

             

                  <li>
                      <input 
                          type='checkbox' 
                          value='at'
                          name='' 
                          className="country"
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
                      <label className='country-label'>Austria</label>
                  </li>

                  <li>
                      <input 
                          type='checkbox' 
                          value='by'
                          name='' 
                          className="country"
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
                      <label className='country-label'>Belarus</label>
                  </li>

                  <li>
                      <input 
                          type='checkbox' 
                          value='be'
                          name='' 
                          className="country"
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
                      <label className='country-label'>Belgium</label>
                  </li>

                  <li>
                      <input 
                          type='checkbox' 
                          value='ba'
                          name='' 
                          className="country"
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
                      <label className='country-label'>Bosnia and Herzegovina</label>
                  </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bg'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Bulgaria</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='hr'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Croatia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='cz'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Czech Republic</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='dk'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Denmark</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ee'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Estonia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fo'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('fo') : 
                        legend === 2 ? legend2CountryValue.includes('fo') : 
                        legend === 3 ? legend3CountryValue.includes('fo') : 
                        legend === 4 ? legend4CountryValue.includes('fo') :
                        legend === 5 ? legend5CountryValue.includes('fo') :
                        legend === 6 ? legend6CountryValue.includes('fo') :
                        legend === 7 ? legend7CountryValue.includes('fo') :
                        legend8CountryValue.includes('fo')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Faroe Islands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fi'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Finland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fr'
                      name='' 
                      className="country"
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
                  <label className='country-label'>France</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='de'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Germany</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gr'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Greece</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='hu'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Hungary</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='is'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Iceland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ie'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Ireland</label>
              </li>
       
              <li>
                  <input 
                      type='checkbox' 
                      value='it'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Italy</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='lv'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Latvia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='li'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Liechtenstein</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='lt'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Lithuania</label>
              </li>
              
              <li>
                  <input 
                      type='checkbox' 
                      value='lu'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Luxembourg</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mt'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Malta</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='md'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Moldova</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mc'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Monaco</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='me'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Montenegro</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nl'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Netherlands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mk'
                      name='' 
                      className="country"
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
                  <label className='country-label'>North Macedonia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='no'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Norway</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pl'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Poland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pt'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Portugal</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ro'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Romania</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ru'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Russia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sm'
                      name='' 
                      className="country"
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
                  <label className='country-label'>San Marino</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='rs'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Serbia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sk'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Slovakia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='si'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Slovenia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='es'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Spain</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='se'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Sweden</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ch'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Switzerland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ua'
                      name='' 
                      className="country"
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
                  <label className='country-label'>Ukraine</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gb'
                      name='' 
                      className="country"
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
                  <label className='country-label'>United Kingdom</label>
              </li>
              
              </ul>

          </div>

         


      <div className="countries">
          
          

        

          <ul>


      <li>
                    <div className="continents">
                            <img className='con-icon' src='../assets/north-america.png'></img>

                            <label className='con-label'>North America</label>
                    </div>    
          </li>


          <li>
                  <input 
                      type='checkbox' 
                      value='ai'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ai') : 
                        legend === 2 ? legend2CountryValue.includes('ai') : 
                        legend === 3 ? legend3CountryValue.includes('ai') : 
                        legend === 4 ? legend4CountryValue.includes('ai') :
                        legend === 5 ? legend5CountryValue.includes('ai') :
                        legend === 6 ? legend6CountryValue.includes('ai') :
                        legend === 7 ? legend7CountryValue.includes('ai') :
                        legend8CountryValue.includes('ai')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Anguilla</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ag'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ag') : 
                        legend === 2 ? legend2CountryValue.includes('ag') : 
                        legend === 3 ? legend3CountryValue.includes('ag') : 
                        legend === 4 ? legend4CountryValue.includes('ag') :
                        legend === 5 ? legend5CountryValue.includes('ag') :
                        legend === 6 ? legend6CountryValue.includes('ag') :
                        legend === 7 ? legend7CountryValue.includes('ag') :
                        legend8CountryValue.includes('ag')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Antigua and Barbuda</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='aw'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('aw') : 
                        legend === 2 ? legend2CountryValue.includes('aw') : 
                        legend === 3 ? legend3CountryValue.includes('aw') : 
                        legend === 4 ? legend4CountryValue.includes('aw') :
                        legend === 5 ? legend5CountryValue.includes('aw') :
                        legend === 6 ? legend6CountryValue.includes('aw') :
                        legend === 7 ? legend7CountryValue.includes('aw') :
                        legend8CountryValue.includes('aw')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Aruba</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='bs'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bs') : 
                        legend === 2 ? legend2CountryValue.includes('bs') : 
                        legend === 3 ? legend3CountryValue.includes('bs') : 
                        legend === 4 ? legend4CountryValue.includes('bs') :
                        legend === 5 ? legend5CountryValue.includes('bs') :
                        legend === 6 ? legend6CountryValue.includes('bs') :
                        legend === 7 ? legend7CountryValue.includes('bs') :
                        legend8CountryValue.includes('bs')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Bahamas</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='bb'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bb') : 
                        legend === 2 ? legend2CountryValue.includes('bb') : 
                        legend === 3 ? legend3CountryValue.includes('bb') : 
                        legend === 4 ? legend4CountryValue.includes('bb') :
                        legend === 5 ? legend5CountryValue.includes('bb') :
                        legend === 6 ? legend6CountryValue.includes('bb') :
                        legend === 7 ? legend7CountryValue.includes('bb') :
                        legend8CountryValue.includes('bb')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Barbados</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bz'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bz') : 
                        legend === 2 ? legend2CountryValue.includes('bz') : 
                        legend === 3 ? legend3CountryValue.includes('bz') : 
                        legend === 4 ? legend4CountryValue.includes('bz') :
                        legend === 5 ? legend5CountryValue.includes('bz') :
                        legend === 6 ? legend6CountryValue.includes('bz') :
                        legend === 7 ? legend7CountryValue.includes('bz') :
                        legend8CountryValue.includes('bz')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Belize</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bm') : 
                        legend === 2 ? legend2CountryValue.includes('bm') : 
                        legend === 3 ? legend3CountryValue.includes('bm') : 
                        legend === 4 ? legend4CountryValue.includes('bm') :
                        legend === 5 ? legend5CountryValue.includes('bm') :
                        legend === 6 ? legend6CountryValue.includes('bm') :
                        legend === 7 ? legend7CountryValue.includes('bm') :
                        legend8CountryValue.includes('bm')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Bermunda</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bq'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bq') : 
                        legend === 2 ? legend2CountryValue.includes('bq') : 
                        legend === 3 ? legend3CountryValue.includes('bq') : 
                        legend === 4 ? legend4CountryValue.includes('bq') :
                        legend === 5 ? legend5CountryValue.includes('bq') :
                        legend === 6 ? legend6CountryValue.includes('bq') :
                        legend === 7 ? legend7CountryValue.includes('bq') :
                        legend8CountryValue.includes('bq')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Bonaire</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vg'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('vg') : 
                        legend === 2 ? legend2CountryValue.includes('vg') : 
                        legend === 3 ? legend3CountryValue.includes('vg') : 
                        legend === 4 ? legend4CountryValue.includes('vg') :
                        legend === 5 ? legend5CountryValue.includes('vg') :
                        legend === 6 ? legend6CountryValue.includes('vg') :
                        legend === 7 ? legend7CountryValue.includes('vg') :
                        legend8CountryValue.includes('vg')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>British Virgin Islands</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='ca'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ca') : 
                        legend === 2 ? legend2CountryValue.includes('ca') : 
                        legend === 3 ? legend3CountryValue.includes('ca') : 
                        legend === 4 ? legend4CountryValue.includes('ca') :
                        legend === 5 ? legend5CountryValue.includes('ca') :
                        legend === 6 ? legend6CountryValue.includes('ca') :
                        legend === 7 ? legend7CountryValue.includes('ca') :
                        legend8CountryValue.includes('ca')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Canada</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ky'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ky') : 
                        legend === 2 ? legend2CountryValue.includes('ky') : 
                        legend === 3 ? legend3CountryValue.includes('ky') : 
                        legend === 4 ? legend4CountryValue.includes('ky') :
                        legend === 5 ? legend5CountryValue.includes('ky') :
                        legend === 6 ? legend6CountryValue.includes('ky') :
                        legend === 7 ? legend7CountryValue.includes('ky') :
                        legend8CountryValue.includes('ky')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Cayman Islands</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='cr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('cr') : 
                        legend === 2 ? legend2CountryValue.includes('cr') : 
                        legend === 3 ? legend3CountryValue.includes('cr') : 
                        legend === 4 ? legend4CountryValue.includes('cr') :
                        legend === 5 ? legend5CountryValue.includes('cr') :
                        legend === 6 ? legend6CountryValue.includes('cr') :
                        legend === 7 ? legend7CountryValue.includes('cr') :
                        legend8CountryValue.includes('cr')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Costa Rica</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='cu'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('cu') : 
                        legend === 2 ? legend2CountryValue.includes('cu') : 
                        legend === 3 ? legend3CountryValue.includes('cu') : 
                        legend === 4 ? legend4CountryValue.includes('cu') :
                        legend === 5 ? legend5CountryValue.includes('cu') :
                        legend === 6 ? legend6CountryValue.includes('cu') :
                        legend === 7 ? legend7CountryValue.includes('cu') :
                        legend8CountryValue.includes('cu')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Cuba</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='cw'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('cw') : 
                        legend === 2 ? legend2CountryValue.includes('cw') : 
                        legend === 3 ? legend3CountryValue.includes('cw') : 
                        legend === 4 ? legend4CountryValue.includes('cw') :
                        legend === 5 ? legend5CountryValue.includes('cw') :
                        legend === 6 ? legend6CountryValue.includes('cw') :
                        legend === 7 ? legend7CountryValue.includes('cw') :
                        legend8CountryValue.includes('cw')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Curacao</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='dm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('dm') : 
                        legend === 2 ? legend2CountryValue.includes('dm') : 
                        legend === 3 ? legend3CountryValue.includes('dm') : 
                        legend === 4 ? legend4CountryValue.includes('dm') :
                        legend === 5 ? legend5CountryValue.includes('dm') :
                        legend === 6 ? legend6CountryValue.includes('dm') :
                        legend === 7 ? legend7CountryValue.includes('dm') :
                        legend8CountryValue.includes('dm')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Dominica</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='do'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('do') : 
                        legend === 2 ? legend2CountryValue.includes('do') : 
                        legend === 3 ? legend3CountryValue.includes('do') : 
                        legend === 4 ? legend4CountryValue.includes('do') :
                        legend === 5 ? legend5CountryValue.includes('do') :
                        legend === 6 ? legend6CountryValue.includes('do') :
                        legend === 7 ? legend7CountryValue.includes('do') :
                        legend8CountryValue.includes('do')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Dominican Republic</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sv'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('sv') : 
                        legend === 2 ? legend2CountryValue.includes('sv') : 
                        legend === 3 ? legend3CountryValue.includes('sv') : 
                        legend === 4 ? legend4CountryValue.includes('sv') :
                        legend === 5 ? legend5CountryValue.includes('sv') :
                        legend === 6 ? legend6CountryValue.includes('sv') :
                        legend === 7 ? legend7CountryValue.includes('sv') :
                        legend8CountryValue.includes('sv')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>El Salvador</label>
              </li>


         
              
              <li>
                  <input 
                      type='checkbox' 
                      value='gd'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('gd') : 
                        legend === 2 ? legend2CountryValue.includes('gd') : 
                        legend === 3 ? legend3CountryValue.includes('gd') : 
                        legend === 4 ? legend4CountryValue.includes('gd') :
                        legend === 5 ? legend5CountryValue.includes('gd') :
                        legend === 6 ? legend6CountryValue.includes('gd') :
                        legend === 7 ? legend7CountryValue.includes('gd') :
                        legend8CountryValue.includes('gd')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Grenada</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('gl') : 
                        legend === 2 ? legend2CountryValue.includes('gl') : 
                        legend === 3 ? legend3CountryValue.includes('gl') : 
                        legend === 4 ? legend4CountryValue.includes('gl') :
                        legend === 5 ? legend5CountryValue.includes('gl') :
                        legend === 6 ? legend6CountryValue.includes('gl') :
                        legend === 7 ? legend7CountryValue.includes('gl') :
                        legend8CountryValue.includes('gl')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Greenland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gp'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('gp') : 
                        legend === 2 ? legend2CountryValue.includes('gp') : 
                        legend === 3 ? legend3CountryValue.includes('gp') : 
                        legend === 4 ? legend4CountryValue.includes('gp') :
                        legend === 5 ? legend5CountryValue.includes('gp') :
                        legend === 6 ? legend6CountryValue.includes('gp') :
                        legend === 7 ? legend7CountryValue.includes('gp') :
                        legend8CountryValue.includes('gp')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Guadeloupe</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='gt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('gt') : 
                        legend === 2 ? legend2CountryValue.includes('gt') : 
                        legend === 3 ? legend3CountryValue.includes('gt') : 
                        legend === 4 ? legend4CountryValue.includes('gt') :
                        legend === 5 ? legend5CountryValue.includes('gt') :
                        legend === 6 ? legend6CountryValue.includes('gt') :
                        legend === 7 ? legend7CountryValue.includes('gt') :
                        legend8CountryValue.includes('gt')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Guatemala</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ht'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ht') : 
                        legend === 2 ? legend2CountryValue.includes('ht') : 
                        legend === 3 ? legend3CountryValue.includes('ht') : 
                        legend === 4 ? legend4CountryValue.includes('ht') :
                        legend === 5 ? legend5CountryValue.includes('ht') :
                        legend === 6 ? legend6CountryValue.includes('ht') :
                        legend === 7 ? legend7CountryValue.includes('ht') :
                        legend8CountryValue.includes('ht')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Haiti</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='hn'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('hn') : 
                        legend === 2 ? legend2CountryValue.includes('hn') : 
                        legend === 3 ? legend3CountryValue.includes('hn') : 
                        legend === 4 ? legend4CountryValue.includes('hn') :
                        legend === 5 ? legend5CountryValue.includes('hn') :
                        legend === 6 ? legend6CountryValue.includes('hn') :
                        legend === 7 ? legend7CountryValue.includes('hn') :
                        legend8CountryValue.includes('hn')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Honduras</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='jm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('jm') : 
                        legend === 2 ? legend2CountryValue.includes('jm') : 
                        legend === 3 ? legend3CountryValue.includes('jm') : 
                        legend === 4 ? legend4CountryValue.includes('jm') :
                        legend === 5 ? legend5CountryValue.includes('jm') :
                        legend === 6 ? legend6CountryValue.includes('jm') :
                        legend === 7 ? legend7CountryValue.includes('jm') :
                        legend8CountryValue.includes('jm')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Jamaica</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mq'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('mq') : 
                        legend === 2 ? legend2CountryValue.includes('mq') : 
                        legend === 3 ? legend3CountryValue.includes('mq') : 
                        legend === 4 ? legend4CountryValue.includes('mq') :
                        legend === 5 ? legend5CountryValue.includes('mq') :
                        legend === 6 ? legend6CountryValue.includes('mq') :
                        legend === 7 ? legend7CountryValue.includes('mq') :
                        legend8CountryValue.includes('mq')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Martinique</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mx'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('mx') : 
                        legend === 2 ? legend2CountryValue.includes('mx') : 
                        legend === 3 ? legend3CountryValue.includes('mx') : 
                        legend === 4 ? legend4CountryValue.includes('mx') :
                        legend === 5 ? legend5CountryValue.includes('mx') :
                        legend === 6 ? legend6CountryValue.includes('mx') :
                        legend === 7 ? legend7CountryValue.includes('mx') :
                        legend8CountryValue.includes('mx')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Mexico</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ms'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ms') : 
                        legend === 2 ? legend2CountryValue.includes('ms') : 
                        legend === 3 ? legend3CountryValue.includes('ms') : 
                        legend === 4 ? legend4CountryValue.includes('ms') :
                        legend === 5 ? legend5CountryValue.includes('ms') :
                        legend === 6 ? legend6CountryValue.includes('ms') :
                        legend === 7 ? legend7CountryValue.includes('ms') :
                        legend8CountryValue.includes('ms')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Montserrat</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ni'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ni') : 
                        legend === 2 ? legend2CountryValue.includes('ni') : 
                        legend === 3 ? legend3CountryValue.includes('ni') : 
                        legend === 4 ? legend4CountryValue.includes('ni') :
                        legend === 5 ? legend5CountryValue.includes('ni') :
                        legend === 6 ? legend6CountryValue.includes('ni') :
                        legend === 7 ? legend7CountryValue.includes('ni') :
                        legend8CountryValue.includes('ni')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Nicaragua</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pa'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('pa') : 
                        legend === 2 ? legend2CountryValue.includes('pa') : 
                        legend === 3 ? legend3CountryValue.includes('pa') : 
                        legend === 4 ? legend4CountryValue.includes('pa') :
                        legend === 5 ? legend5CountryValue.includes('pa') :
                        legend === 6 ? legend6CountryValue.includes('pa') :
                        legend === 7 ? legend7CountryValue.includes('pa') :
                        legend8CountryValue.includes('pa')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Panama</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('pr') : 
                        legend === 2 ? legend2CountryValue.includes('pr') : 
                        legend === 3 ? legend3CountryValue.includes('pr') : 
                        legend === 4 ? legend4CountryValue.includes('pr') :
                        legend === 5 ? legend5CountryValue.includes('pr') :
                        legend === 6 ? legend6CountryValue.includes('pr') :
                        legend === 7 ? legend7CountryValue.includes('pr') :
                        legend8CountryValue.includes('pr')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Puerto Rica</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bl') : 
                        legend === 2 ? legend2CountryValue.includes('bl') : 
                        legend === 3 ? legend3CountryValue.includes('bl') : 
                        legend === 4 ? legend4CountryValue.includes('bl') :
                        legend === 5 ? legend5CountryValue.includes('bl') :
                        legend === 6 ? legend6CountryValue.includes('bl') :
                        legend === 7 ? legend7CountryValue.includes('bl') :
                        legend8CountryValue.includes('bl')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Saint Barthélemy</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='kn'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('kn') : 
                        legend === 2 ? legend2CountryValue.includes('kn') : 
                        legend === 3 ? legend3CountryValue.includes('kn') : 
                        legend === 4 ? legend4CountryValue.includes('kn') :
                        legend === 5 ? legend5CountryValue.includes('kn') :
                        legend === 6 ? legend6CountryValue.includes('kn') :
                        legend === 7 ? legend7CountryValue.includes('kn') :
                        legend8CountryValue.includes('kn')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Saint Kitts and Nevis</label>
              </li>
      
              <li>
                  <input 
                      type='checkbox' 
                      value='lc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('lc') : 
                        legend === 2 ? legend2CountryValue.includes('lc') : 
                        legend === 3 ? legend3CountryValue.includes('lc') : 
                        legend === 4 ? legend4CountryValue.includes('lc') :
                        legend === 5 ? legend5CountryValue.includes('lc') :
                        legend === 6 ? legend6CountryValue.includes('lc') :
                        legend === 7 ? legend7CountryValue.includes('lc') :
                        legend8CountryValue.includes('lc')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Saint Lucia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mf'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('mf') : 
                        legend === 2 ? legend2CountryValue.includes('mf') : 
                        legend === 3 ? legend3CountryValue.includes('mf') : 
                        legend === 4 ? legend4CountryValue.includes('mf') :
                        legend === 5 ? legend5CountryValue.includes('mf') :
                        legend === 6 ? legend6CountryValue.includes('mf') :
                        legend === 7 ? legend7CountryValue.includes('mf') :
                        legend8CountryValue.includes('mf')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Saint Martin</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('pm') : 
                        legend === 2 ? legend2CountryValue.includes('pm') : 
                        legend === 3 ? legend3CountryValue.includes('pm') : 
                        legend === 4 ? legend4CountryValue.includes('pm') :
                        legend === 5 ? legend5CountryValue.includes('pm') :
                        legend === 6 ? legend6CountryValue.includes('pm') :
                        legend === 7 ? legend7CountryValue.includes('pm') :
                        legend8CountryValue.includes('pm')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Saint Pierre and Miquelon</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('vc') : 
                        legend === 2 ? legend2CountryValue.includes('vc') : 
                        legend === 3 ? legend3CountryValue.includes('vc') : 
                        legend === 4 ? legend4CountryValue.includes('vc') :
                        legend === 5 ? legend5CountryValue.includes('vc') :
                        legend === 6 ? legend6CountryValue.includes('vc') :
                        legend === 7 ? legend7CountryValue.includes('vc') :
                        legend8CountryValue.includes('vc')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Saint Vincent and the Grenadines</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sx'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('sx') : 
                        legend === 2 ? legend2CountryValue.includes('sx') : 
                        legend === 3 ? legend3CountryValue.includes('sx') : 
                        legend === 4 ? legend4CountryValue.includes('sx') :
                        legend === 5 ? legend5CountryValue.includes('sx') :
                        legend === 6 ? legend6CountryValue.includes('sx') :
                        legend === 7 ? legend7CountryValue.includes('sx') :
                        legend8CountryValue.includes('sx')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Sint Maarten</label>
              </li>



              <li>
                  <input 
                      type='checkbox' 
                      value='tt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('tt') : 
                        legend === 2 ? legend2CountryValue.includes('tt') : 
                        legend === 3 ? legend3CountryValue.includes('tt') : 
                        legend === 4 ? legend4CountryValue.includes('tt') :
                        legend === 5 ? legend5CountryValue.includes('tt') :
                        legend === 6 ? legend6CountryValue.includes('tt') :
                        legend === 7 ? legend7CountryValue.includes('tt') :
                        legend8CountryValue.includes('tt')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Trinidad and Tobago</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='tc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('tc') : 
                        legend === 2 ? legend2CountryValue.includes('tc') : 
                        legend === 3 ? legend3CountryValue.includes('tc') : 
                        legend === 4 ? legend4CountryValue.includes('tc') :
                        legend === 5 ? legend5CountryValue.includes('tc') :
                        legend === 6 ? legend6CountryValue.includes('tc') :
                        legend === 7 ? legend7CountryValue.includes('tc') :
                        legend8CountryValue.includes('tc')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Turks and Caicos Island</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vi'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('vi') : 
                        legend === 2 ? legend2CountryValue.includes('vi') : 
                        legend === 3 ? legend3CountryValue.includes('vi') : 
                        legend === 4 ? legend4CountryValue.includes('vi') :
                        legend === 5 ? legend5CountryValue.includes('vi') :
                        legend === 6 ? legend6CountryValue.includes('vi') :
                        legend === 7 ? legend7CountryValue.includes('vi') :
                        legend8CountryValue.includes('vi')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>US Virgin Islands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='us'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('us') : 
                        legend === 2 ? legend2CountryValue.includes('us') : 
                        legend === 3 ? legend3CountryValue.includes('us') : 
                        legend === 4 ? legend4CountryValue.includes('us') :
                        legend === 5 ? legend5CountryValue.includes('us') :
                        legend === 6 ? legend6CountryValue.includes('us') :
                        legend === 7 ? legend7CountryValue.includes('us') :
                        legend8CountryValue.includes('us')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>United States of America</label>
              </li>
          
        
          </ul>

      </div>

      <div className="countries">
          
          

     
        

          <ul>
          <li>
                    <div className="continents">
                            <img className='con-icon' src='../assets/south-america.png'></img>

                            <label className='con-label'>South America</label>
                    </div>      
          </li>


          <li>
                  <input 
                      type='checkbox' 
                      value='ar'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ar') : 
                        legend === 2 ? legend2CountryValue.includes('ar') : 
                        legend === 3 ? legend3CountryValue.includes('ar') : 
                        legend === 4 ? legend4CountryValue.includes('ar') :
                        legend === 5 ? legend5CountryValue.includes('ar') :
                        legend === 6 ? legend6CountryValue.includes('ar') :
                        legend === 7 ? legend7CountryValue.includes('ar') :
                        legend8CountryValue.includes('ar')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Argentina</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bo'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('bo') : 
                        legend === 2 ? legend2CountryValue.includes('bo') : 
                        legend === 3 ? legend3CountryValue.includes('bo') : 
                        legend === 4 ? legend4CountryValue.includes('bo') :
                        legend === 5 ? legend5CountryValue.includes('bo') :
                        legend === 6 ? legend6CountryValue.includes('bo') :
                        legend === 7 ? legend7CountryValue.includes('bo') :
                        legend8CountryValue.includes('bo')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Bolivia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='br'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('br') : 
                        legend === 2 ? legend2CountryValue.includes('br') : 
                        legend === 3 ? legend3CountryValue.includes('br') : 
                        legend === 4 ? legend4CountryValue.includes('br') :
                        legend === 5 ? legend5CountryValue.includes('br') :
                        legend === 6 ? legend6CountryValue.includes('br') :
                        legend === 7 ? legend7CountryValue.includes('br') :
                        legend8CountryValue.includes('br')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Brazil</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='cl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('cl') : 
                        legend === 2 ? legend2CountryValue.includes('cl') : 
                        legend === 3 ? legend3CountryValue.includes('cl') : 
                        legend === 4 ? legend4CountryValue.includes('cl') :
                        legend === 5 ? legend5CountryValue.includes('cl') :
                        legend === 6 ? legend6CountryValue.includes('cl') :
                        legend === 7 ? legend7CountryValue.includes('cl') :
                        legend8CountryValue.includes('cl')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Chile</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='co'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('co') : 
                        legend === 2 ? legend2CountryValue.includes('co') : 
                        legend === 3 ? legend3CountryValue.includes('co') : 
                        legend === 4 ? legend4CountryValue.includes('co') :
                        legend === 5 ? legend5CountryValue.includes('co') :
                        legend === 6 ? legend6CountryValue.includes('co') :
                        legend === 7 ? legend7CountryValue.includes('co') :
                        legend8CountryValue.includes('co')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Colombia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ec'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ec') : 
                        legend === 2 ? legend2CountryValue.includes('ec') : 
                        legend === 3 ? legend3CountryValue.includes('ec') : 
                        legend === 4 ? legend4CountryValue.includes('ec') :
                        legend === 5 ? legend5CountryValue.includes('ec') :
                        legend === 6 ? legend6CountryValue.includes('ec') :
                        legend === 7 ? legend7CountryValue.includes('ec') :
                        legend8CountryValue.includes('ec')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Ecuador</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fk'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('fk') : 
                        legend === 2 ? legend2CountryValue.includes('fk') : 
                        legend === 3 ? legend3CountryValue.includes('fk') : 
                        legend === 4 ? legend4CountryValue.includes('fk') :
                        legend === 5 ? legend5CountryValue.includes('fk') :
                        legend === 6 ? legend6CountryValue.includes('fk') :
                        legend === 7 ? legend7CountryValue.includes('fk') :
                        legend8CountryValue.includes('fk')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Falkland Islands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gf'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('gf') : 
                        legend === 2 ? legend2CountryValue.includes('gf') : 
                        legend === 3 ? legend3CountryValue.includes('gf') : 
                        legend === 4 ? legend4CountryValue.includes('gf') :
                        legend === 5 ? legend5CountryValue.includes('gf') :
                        legend === 6 ? legend6CountryValue.includes('gf') :
                        legend === 7 ? legend7CountryValue.includes('gf') :
                        legend8CountryValue.includes('gf')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>French Guiana</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gy'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('gy') : 
                        legend === 2 ? legend2CountryValue.includes('gy') : 
                        legend === 3 ? legend3CountryValue.includes('gy') : 
                        legend === 4 ? legend4CountryValue.includes('gy') :
                        legend === 5 ? legend5CountryValue.includes('gy') :
                        legend === 6 ? legend6CountryValue.includes('gy') :
                        legend === 7 ? legend7CountryValue.includes('gy') :
                        legend8CountryValue.includes('gy')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Guyana</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='py'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('py') : 
                        legend === 2 ? legend2CountryValue.includes('py') : 
                        legend === 3 ? legend3CountryValue.includes('py') : 
                        legend === 4 ? legend4CountryValue.includes('py') :
                        legend === 5 ? legend5CountryValue.includes('py') :
                        legend === 6 ? legend6CountryValue.includes('py') :
                        legend === 7 ? legend7CountryValue.includes('py') :
                        legend8CountryValue.includes('py')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Paraguay</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pe'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('pe') : 
                        legend === 2 ? legend2CountryValue.includes('pe') : 
                        legend === 3 ? legend3CountryValue.includes('pe') : 
                        legend === 4 ? legend4CountryValue.includes('pe') :
                        legend === 5 ? legend5CountryValue.includes('pe') :
                        legend === 6 ? legend6CountryValue.includes('pe') :
                        legend === 7 ? legend7CountryValue.includes('pe') :
                        legend8CountryValue.includes('pe')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Peru</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='sr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('sr') : 
                        legend === 2 ? legend2CountryValue.includes('sr') : 
                        legend === 3 ? legend3CountryValue.includes('sr') : 
                        legend === 4 ? legend4CountryValue.includes('sr') :
                        legend === 5 ? legend5CountryValue.includes('sr') :
                        legend === 6 ? legend6CountryValue.includes('sr') :
                        legend === 7 ? legend7CountryValue.includes('sr') :
                        legend8CountryValue.includes('sr')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Suriname</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='uy'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('uy') : 
                        legend === 2 ? legend2CountryValue.includes('uy') : 
                        legend === 3 ? legend3CountryValue.includes('uy') : 
                        legend === 4 ? legend4CountryValue.includes('uy') :
                        legend === 5 ? legend5CountryValue.includes('uy') :
                        legend === 6 ? legend6CountryValue.includes('uy') :
                        legend === 7 ? legend7CountryValue.includes('uy') :
                        legend8CountryValue.includes('uy')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Uruguay</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ve'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ve') : 
                        legend === 2 ? legend2CountryValue.includes('ve') : 
                        legend === 3 ? legend3CountryValue.includes('ve') : 
                        legend === 4 ? legend4CountryValue.includes('ve') :
                        legend === 5 ? legend5CountryValue.includes('ve') :
                        legend === 6 ? legend6CountryValue.includes('ve') :
                        legend === 7 ? legend7CountryValue.includes('ve') :
                        legend8CountryValue.includes('ve')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Venezuela</label>
              </li>

             
          
        
          </ul>

      

      <div className="countries oceana">
          
          

  
        

          <ul>
          <li>
                <div className="continents" >
                    <img className='con-icon' src='../assets/australia.png'></img>

                    <label className='con-label'>Oceana</label>
                </div>           
          </li>


          <li>
                  <input 
                      type='checkbox' 
                      value='au'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('au') : 
                        legend === 2 ? legend2CountryValue.includes('au') : 
                        legend === 3 ? legend3CountryValue.includes('au') : 
                        legend === 4 ? legend4CountryValue.includes('au') :
                        legend === 5 ? legend5CountryValue.includes('au') :
                        legend === 6 ? legend6CountryValue.includes('au') :
                        legend === 7 ? legend7CountryValue.includes('au') :
                        legend8CountryValue.includes('au')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Australia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fj'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('fj') : 
                        legend === 2 ? legend2CountryValue.includes('fj') : 
                        legend === 3 ? legend3CountryValue.includes('fj') : 
                        legend === 4 ? legend4CountryValue.includes('fj') :
                        legend === 5 ? legend5CountryValue.includes('fj') :
                        legend === 6 ? legend6CountryValue.includes('fj') :
                        legend === 7 ? legend7CountryValue.includes('fj') :
                        legend8CountryValue.includes('fj')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Fiji</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ki'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ki') : 
                        legend === 2 ? legend2CountryValue.includes('ki') : 
                        legend === 3 ? legend3CountryValue.includes('ki') : 
                        legend === 4 ? legend4CountryValue.includes('ki') :
                        legend === 5 ? legend5CountryValue.includes('ki') :
                        legend === 6 ? legend6CountryValue.includes('ki') :
                        legend === 7 ? legend7CountryValue.includes('ki') :
                        legend8CountryValue.includes('ki')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Kiribati</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='mh'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('mh') : 
                        legend === 2 ? legend2CountryValue.includes('mh') : 
                        legend === 3 ? legend3CountryValue.includes('mh') : 
                        legend === 4 ? legend4CountryValue.includes('mh') :
                        legend === 5 ? legend5CountryValue.includes('mh') :
                        legend === 6 ? legend6CountryValue.includes('mh') :
                        legend === 7 ? legend7CountryValue.includes('mh') :
                        legend8CountryValue.includes('mh')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Marshall Islands</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='fm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('fm') : 
                        legend === 2 ? legend2CountryValue.includes('fm') : 
                        legend === 3 ? legend3CountryValue.includes('fm') : 
                        legend === 4 ? legend4CountryValue.includes('fm') :
                        legend === 5 ? legend5CountryValue.includes('fm') :
                        legend === 6 ? legend6CountryValue.includes('fm') :
                        legend === 7 ? legend7CountryValue.includes('fm') :
                        legend8CountryValue.includes('fm')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Micronesia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('nr') : 
                        legend === 2 ? legend2CountryValue.includes('nr') : 
                        legend === 3 ? legend3CountryValue.includes('nr') : 
                        legend === 4 ? legend4CountryValue.includes('nr') :
                        legend === 5 ? legend5CountryValue.includes('nr') :
                        legend === 6 ? legend6CountryValue.includes('nr') :
                        legend === 7 ? legend7CountryValue.includes('nr') :
                        legend8CountryValue.includes('nr')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Nauru</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('nc') : 
                        legend === 2 ? legend2CountryValue.includes('nc') : 
                        legend === 3 ? legend3CountryValue.includes('nc') : 
                        legend === 4 ? legend4CountryValue.includes('nc') :
                        legend === 5 ? legend5CountryValue.includes('nc') :
                        legend === 6 ? legend6CountryValue.includes('nc') :
                        legend === 7 ? legend7CountryValue.includes('nc') :
                        legend8CountryValue.includes('nc')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>New Caledonia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nz'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('nz') : 
                        legend === 2 ? legend2CountryValue.includes('nz') : 
                        legend === 3 ? legend3CountryValue.includes('nz') : 
                        legend === 4 ? legend4CountryValue.includes('nz') :
                        legend === 5 ? legend5CountryValue.includes('nz') :
                        legend === 6 ? legend6CountryValue.includes('nz') :
                        legend === 7 ? legend7CountryValue.includes('nz') :
                        legend8CountryValue.includes('nz')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>New Zealand</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pw'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('pw') : 
                        legend === 2 ? legend2CountryValue.includes('pw') : 
                        legend === 3 ? legend3CountryValue.includes('pw') : 
                        legend === 4 ? legend4CountryValue.includes('pw') :
                        legend === 5 ? legend5CountryValue.includes('pw') :
                        legend === 6 ? legend6CountryValue.includes('pw') :
                        legend === 7 ? legend7CountryValue.includes('pw') :
                        legend8CountryValue.includes('pw')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Palau</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pg'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('pg') : 
                        legend === 2 ? legend2CountryValue.includes('pg') : 
                        legend === 3 ? legend3CountryValue.includes('pg') : 
                        legend === 4 ? legend4CountryValue.includes('pg') :
                        legend === 5 ? legend5CountryValue.includes('pg') :
                        legend === 6 ? legend6CountryValue.includes('pg') :
                        legend === 7 ? legend7CountryValue.includes('pg') :
                        legend8CountryValue.includes('pg')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Papua New Guiana</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='ws'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('ws') : 
                        legend === 2 ? legend2CountryValue.includes('ws') : 
                        legend === 3 ? legend3CountryValue.includes('ws') : 
                        legend === 4 ? legend4CountryValue.includes('ws') :
                        legend === 5 ? legend5CountryValue.includes('ws') :
                        legend === 6 ? legend6CountryValue.includes('ws') :
                        legend === 7 ? legend7CountryValue.includes('ws') :
                        legend8CountryValue.includes('ws')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Samoa</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sb'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('sb') : 
                        legend === 2 ? legend2CountryValue.includes('sb') : 
                        legend === 3 ? legend3CountryValue.includes('sb') : 
                        legend === 4 ? legend4CountryValue.includes('sb') :
                        legend === 5 ? legend5CountryValue.includes('sb') :
                        legend === 6 ? legend6CountryValue.includes('sb') :
                        legend === 7 ? legend7CountryValue.includes('sb') :
                        legend8CountryValue.includes('sb')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Solomon Islands</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='to'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('to') : 
                        legend === 2 ? legend2CountryValue.includes('to') : 
                        legend === 3 ? legend3CountryValue.includes('to') : 
                        legend === 4 ? legend4CountryValue.includes('to') :
                        legend === 5 ? legend5CountryValue.includes('to') :
                        legend === 6 ? legend6CountryValue.includes('to') :
                        legend === 7 ? legend7CountryValue.includes('to') :
                        legend8CountryValue.includes('to')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Tonga</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='tv'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('tv') : 
                        legend === 2 ? legend2CountryValue.includes('tv') : 
                        legend === 3 ? legend3CountryValue.includes('tv') : 
                        legend === 4 ? legend4CountryValue.includes('tv') :
                        legend === 5 ? legend5CountryValue.includes('tv') :
                        legend === 6 ? legend6CountryValue.includes('tv') :
                        legend === 7 ? legend7CountryValue.includes('tv') :
                        legend8CountryValue.includes('tv')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Tuvalu</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vu'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('vu') : 
                        legend === 2 ? legend2CountryValue.includes('vu') : 
                        legend === 3 ? legend3CountryValue.includes('vu') : 
                        legend === 4 ? legend4CountryValue.includes('vu') :
                        legend === 5 ? legend5CountryValue.includes('vu') :
                        legend === 6 ? legend6CountryValue.includes('vu') :
                        legend === 7 ? legend7CountryValue.includes('vu') :
                        legend8CountryValue.includes('vu')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Vanuatu</label>
              </li>

             
          
        
          </ul>

        
      </div>
          <ul>
            <li>
            <input 
                      type='checkbox' 
                      value='aq'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={
                        legend === 1 ? legend1CountryValue.includes('aq') : 
                        legend === 2 ? legend2CountryValue.includes('aq') : 
                        legend === 3 ? legend3CountryValue.includes('aq') : 
                        legend === 4 ? legend4CountryValue.includes('aq') :
                        legend === 5 ? legend5CountryValue.includes('aq') :
                        legend === 6 ? legend6CountryValue.includes('aq') :
                        legend === 7 ? legend7CountryValue.includes('aq') :
                        legend8CountryValue.includes('aq')    
                    }                            
                      
                      >
                      
                  </input>
                  <label className='country-label'>Antarctica</label>
            </li>
          </ul>
      
      </div>

      
  </div>
    )
}

export default Countries

