import './App.css'
import './Navigator'
import { useEffect, useState } from 'react';




function Countries({ 
    legend1ColorValue, 
    legend2ColorValue, 
    legend, 
    legend1CountryValue, 
    setLegend1CountryValue, 
    legend2CountryValue, 
    setLegend2CountryValue,
    legend1ContinentValue,
    setLegend1ContinentValue,

}) {

   
  useEffect(() => {
    // get a list of all the countries
    const allCountryIds = document.getElementsByClassName("country");
    
    if (legend === 1 || legend === 2) {
      // set the fill color of the countries in legend 1 and legend 2
      for (var i = 0; i < legend1CountryValue.length; i++) {
        const id = legend1CountryValue[i];
        document.getElementById(id).style.fill = legend1ColorValue;
      }
      
      for (var i = 0; i < legend2CountryValue.length; i++) {
        const id = legend2CountryValue[i];
        document.getElementById(id).style.fill = legend2ColorValue;
      }
      
      // loop through all the countries and set their fill color back to the default
      for (var i = 0; i < allCountryIds.length; i++) {
        const id = allCountryIds[i].value;
        if (!legend1CountryValue.includes(id) && !legend2CountryValue.includes(id)) {
          document.getElementById(id).style.fill = "#c0c0c0";
        }
      }
    }
  }, [legend, legend1CountryValue, legend2CountryValue]);


    
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
        }


       
      };

      


    
      
    return(
      <div className="state-selector">
            
      <div className="countries">
          
          

          <li>
               <div className="continents">
                    <img className='con-icon' src='../assets/africa.png'></img>

                    <label className='con-label'>Africa</label>
              </div>         
          </li>

        

          <ul>
                  
              <li>
                  <input  
                      type='checkbox' 
                      value='dz'
                      className="country"
                      onChange={handleChange} 
                      
                      
                      checked={legend === 1 ? legend1CountryValue.includes('dz') : legend2CountryValue.includes('dz')  }
                      >
                  </input>
                  <label>Algeria</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='ao'
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ao') : legend2CountryValue.includes('ao')  }

                      
                      
                      >
                      
                  </input>
                  <label>Angola</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='bj'
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bj') : legend2CountryValue.includes('bj')  }
                      
                      
                      >
                      
                  </input>
                  <label>Benin</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bw'
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bw') : legend2CountryValue.includes('bw')  }
                      
                      
                      >
                      
                  </input>
                  <label>Botswana</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bf'
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bf') : legend2CountryValue.includes('bf')  }
                      
                      
                      >
                      
                  </input>
                  <label>Burkina Faso</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bi'
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bi') : legend2CountryValue.includes('bi')  }                            
                      
                      
                      >
                      
                  </input>
                  <label>Burundi</label>
              </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cv'
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('cv') : legend2CountryValue.includes('cv')  }                            
                  
                      >

              </input>
              <label>Cabo Verde</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cm'
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('cm') : legend2CountryValue.includes('cm')  }                            
                  
                      >

              </input>
              <label>Cameroon</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cf'
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('cf') : legend2CountryValue.includes('cf')  }                            
                  
                      >

              </input>
              <label>Central African Republic</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='td'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('td') : legend2CountryValue.includes('td')  }                            
                  
                      >

              </input>
              <label>Chad</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='km'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('km') : legend2CountryValue.includes('km')  }                            
                  
                      >

              </input>
              <label>Comoros</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('cg') : legend2CountryValue.includes('cg')  }                            
                  
                      >

              </input>
              <label>Congo</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ci'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ci') : legend2CountryValue.includes('ci')  }                            
                  
                      >

              </input>
              <label>Cote d'Ivoire</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='dj'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('dj') : legend2CountryValue.includes('dj')  }                            
                  
                      >

              </input>
              <label>Djibouti</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cd'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('cd') : legend2CountryValue.includes('cd')  }                            
                  
                      >

              </input>
              <label>DR Congo</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='eg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('eg') : legend2CountryValue.includes('eg')  }                            
                  
                      >

              </input>
              <label>Egypt</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gq'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('gq') : legend2CountryValue.includes('gq')  }                            
                  
                      >

              </input>
              <label>Equatorial Guinea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='er'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('er') : legend2CountryValue.includes('er')  }                            
                  
                      >

              </input>
              <label>Eritrea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sz') : legend2CountryValue.includes('sz')  }                            
                  
                      >

              </input>
              <label>Eswatini</label>
          </li>
   
          <li>
              <input 
                  type='checkbox' 
                  value='et'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('et') : legend2CountryValue.includes('et')  }                            
                  
                      >

              </input>
              <label>Ethiopia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ga'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ga') : legend2CountryValue.includes('ga')  }                            
                  
                      >

              </input>
              <label>Gabon</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('gm') : legend2CountryValue.includes('gm')  }                            
                  
                      >

              </input>
              <label>Gambia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gh'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('gh') : legend2CountryValue.includes('gh')  }                            
                  
                      >

              </input>
              <label>Ghana</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('gn') : legend2CountryValue.includes('gn')  }                            
                  
                      >

              </input>
              <label>Guinea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='gw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('gw') : legend2CountryValue.includes('gw')  }                            
                  
                      >

              </input>
              <label>Guiana-Bissau</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='ke'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ke') : legend2CountryValue.includes('ke')  }                            
                  
                      >

              </input>
              <label>Kenya</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ls'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ls') : legend2CountryValue.includes('ls')  }                            
                  
                      >

              </input>
              <label>Lesotho</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='lr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('lr') : legend2CountryValue.includes('lr')  }                            
                  
                      >

              </input>
              <label>Liberia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ly'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ly') : legend2CountryValue.includes('ly')  }                            
                  
                      >

              </input>
              <label>Libya</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mg') : legend2CountryValue.includes('mg')  }                            
                  
                      >

              </input>
              <label>Madagascar</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mw') : legend2CountryValue.includes('mw')  }                            
                  
                      >

              </input>
              <label>Malawi</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ml'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ml') : legend2CountryValue.includes('ml')  }                            
                  
                      >

              </input>
              <label>Mali</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mr') : legend2CountryValue.includes('mr')  }                            
                  
                      >

              </input>
              <label>Mauritania</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mu'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mu') : legend2CountryValue.includes('mu')  }                            
                  
                      >

              </input>
              <label>Mauritius</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ma'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ma') : legend2CountryValue.includes('ma')  }                            
                  
                      >

              </input>
              <label>Morocco</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mz') : legend2CountryValue.includes('mz')  }                            
                  
                      >

              </input>
              <label>Mozambique</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='na'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('na') : legend2CountryValue.includes('na')  }                            
                  
                      >

              </input>
              <label>Namibia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ne'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ne') : legend2CountryValue.includes('ne')  }                            
                  
                      >

              </input>
              <label>Niger</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ng'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ng') : legend2CountryValue.includes('ng')  }                            
                  
                      >

              </input>
              <label>Nigeria</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='rw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('rw') : legend2CountryValue.includes('rw')  }                            
                  
                      >

              </input>
              <label>Rwanda</label>
          </li>


          <li>
              <input 
                  type='checkbox' 
                  value='st'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('st') : legend2CountryValue.includes('st')  }                            
                  
                      >

              </input>
              <label>Sao Tome and Principe</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sn') : legend2CountryValue.includes('sn')  }                            
                  
                      >

              </input>
              <label>Senegal</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sc'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sc') : legend2CountryValue.includes('sc')  }                            
                  
                      >

              </input>
              <label>Seychelles</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sl'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sl') : legend2CountryValue.includes('sl')  }                            
                  
                      >

              </input>
              <label>Sierra Leone</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='so'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('so') : legend2CountryValue.includes('so')  }                            
                  
                      >

              </input>
              <label>Somalia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='za'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('za') : legend2CountryValue.includes('za')  }                            
                  
                      >

              </input>
              <label>South Africa</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ss'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ss') : legend2CountryValue.includes('ss')  }                            
                  
                      >

              </input>
              <label>South Sudan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sd'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sd') : legend2CountryValue.includes('sd')  }                            
                  
                      >

              </input>
              <label>Sudan</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='tz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('tz') : legend2CountryValue.includes('tz')  }                            
                  
                      >

              </input>
              <label>Tanzania</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('tg') : legend2CountryValue.includes('tg')  }                            
                  
                      >

              </input>
              <label>Togo</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('tn') : legend2CountryValue.includes('tn')  }                            
                  
                      >

              </input>
              <label>Tunisia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ug'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ug') : legend2CountryValue.includes('ug')  }                            
                  
                      >

              </input>
              <label>Uganda</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='zm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('zm') : legend2CountryValue.includes('zm')  }                            
                  
                      >

              </input>
              <label>Zambia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='zw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('zw') : legend2CountryValue.includes('zw')  }                            
                  
                      >

              </input>
              <label>Zimbabwe</label>
          </li>


          </ul>

      </div>

      <div className="countries">
          
          

      <li>
               <div className="continents">
                    <img className='con-icon' src='../assets/asia.png'></img>

                    <label className='con-label'>Asia</label>
              </div>         
          </li>

        

          <ul>
                  
              <li>
                  <input 
                      type='checkbox' 
                      value='af'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('af') : legend2CountryValue.includes('af')  }                            
                      
                      >
                      
                  </input>
                  <label>Afghanistan</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='am'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('am') : legend2CountryValue.includes('am')  }                            
                      
                      >
                      
                  </input>
                  <label>Armenia</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='az'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('az') : legend2CountryValue.includes('az')  }                            
                      
                      >
                      
                  </input>
                  <label>Azerbaijan</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bh'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bh') : legend2CountryValue.includes('bh')  }                            
                      
                      >
                      
                  </input>
                  <label>Bahrain</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bd'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bd') : legend2CountryValue.includes('bd')  }                            
                      
                      >
                      
                  </input>
                  <label>Bangladesh</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bt') : legend2CountryValue.includes('bt')  }                            
                      
                      >
                      
                  </input>
                  <label>Bhutan</label>
              </li>

          <li>
              <input 
                  type='checkbox' 
                  value='bn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('bn') : legend2CountryValue.includes('bn')  }                            
                  
                      >

              </input>
              <label>Brunei</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kh'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('kh') : legend2CountryValue.includes('kh')  }                            
                  
                      >

              </input>
              <label>Cambodia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('cn') : legend2CountryValue.includes('cn')  }                            
                  
                      >

              </input>
              <label>China</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='cy'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('cy') : legend2CountryValue.includes('cy')  }                            
                  
                      >

              </input>
              <label>Cyprus</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ge'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ge') : legend2CountryValue.includes('ge')  }                            
                  
                      >

              </input>
              <label>Georgia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='in'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('in') : legend2CountryValue.includes('in')  }                            
                  
                      >

              </input>
              <label>India</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='id'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('id') : legend2CountryValue.includes('id')  }                            
                  
                      >

              </input>
              <label>Indonesia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ir'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ir') : legend2CountryValue.includes('ir')  }                            
                  
                      >

              </input>
              <label>Iran</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='iq'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('iq') : legend2CountryValue.includes('iq')  }                            
                  
                      >

              </input>
              <label>Iraq</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='il'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('il') : legend2CountryValue.includes('il')  }                            
                  
                      >

              </input>
              <label>Israel</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='jp'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('jp') : legend2CountryValue.includes('jp')  }                            
                  
                      >

              </input>
              <label>Japan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='jo'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('jo') : legend2CountryValue.includes('jo')  }                            
                  
                      >

              </input>
              <label>Jordan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('kz') : legend2CountryValue.includes('kz')  }                            
                  
                      >

              </input>
              <label>Kazakhstan</label>
          </li>
   
          <li>
              <input 
                  type='checkbox' 
                  value='kw'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('kw') : legend2CountryValue.includes('kw')  }                            
                  
                      >

              </input>
              <label>Kuwait</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('kg') : legend2CountryValue.includes('kg')  }                            
                  
                      >

              </input>
              <label>Kyrgyzstan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='la'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('la') : legend2CountryValue.includes('la')  }                            
                  
                      >

              </input>
              <label>Laos</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='lb'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('lb') : legend2CountryValue.includes('lb')  }                            
                  
                      >

              </input>
              <label>Lebanon</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='my'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('my') : legend2CountryValue.includes('my')  }                            
                  
                      >

              </input>
              <label>Malaysia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mv'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mv') : legend2CountryValue.includes('mv')  }                            
                  
                      >

              </input>
              <label>Maldives</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mn') : legend2CountryValue.includes('mn')  }                            
                  
                      >

              </input>
              <label>Mongolia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='mm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('mm') : legend2CountryValue.includes('mm')  }                            
                  
                      >

              </input>
              <label>Myanmar</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='np'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('np') : legend2CountryValue.includes('np')  }                            
                  
                      >

              </input>
              <label>Nepal</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kp'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('kp') : legend2CountryValue.includes('kp')  }                            
                  
                      >

              </input>
              <label>North Korea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='om'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('om') : legend2CountryValue.includes('om')  }                            
                  
                      >

              </input>
              <label>Oman</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='pk'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('pk') : legend2CountryValue.includes('pk')  }                            
                  
                      >

              </input>
              <label>Pakistan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ps'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ps') : legend2CountryValue.includes('ps')  }                            
                  
                      >

              </input>
              <label>Palestine</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ph'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ph') : legend2CountryValue.includes('ph')  }                            
                  
                      >

              </input>
              <label>Philippines</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='qa'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('qa') : legend2CountryValue.includes('qa')  }                            
                  
                      >

              </input>
              <label>Qatar</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sa'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sa') : legend2CountryValue.includes('sa')  }                            
                  
                      >

              </input>
              <label>Saudi Arabia</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='sg'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sg') : legend2CountryValue.includes('sg')  }                            
                  
                      >

              </input>
              <label>Singapore</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='kr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('kr') : legend2CountryValue.includes('kr')  }                            
                  
                      >

              </input>
              <label>South Korea</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='lk'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('lk') : legend2CountryValue.includes('lk')  }                            
                  
                      >

              </input>
              <label>Sri Lanka</label>
          </li>


          <li>
              <input 
                  type='checkbox' 
                  value='sy'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('sy') : legend2CountryValue.includes('sy')  }                            
                  
                      >

              </input>
              <label>Syria</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tj'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('tj') : legend2CountryValue.includes('tj')  }                            
                  
                      >

              </input>
              <label>Tajikistan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='th'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('th') : legend2CountryValue.includes('th')  }                            
                  
                      >

              </input>
              <label>Thailand</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tl'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('tl') : legend2CountryValue.includes('tl')  }                            
                  
                      >

              </input>
              <label>Timor-Leste</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tr'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('tr') : legend2CountryValue.includes('tr')  }                            
                  
                      >

              </input>
              <label>Turkey</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='tm'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('tm') : legend2CountryValue.includes('tm')  }                            
                  
                      >

              </input>
              <label>Turkmenistan</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ae'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ae') : legend2CountryValue.includes('ae')  }                            
                  
                      >

              </input>
              <label>United Arab Emirates</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='uz'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('uz') : legend2CountryValue.includes('uz')  }                            
                  
                      >

              </input>
              <label>Uzbekistan</label>
          </li>
          
          <li>
              <input 
                  type='checkbox' 
                  value='vn'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('vn') : legend2CountryValue.includes('vn')  }                            
                  
                      >

              </input>
              <label>Vietnam</label>
          </li>

          <li>
              <input 
                  type='checkbox' 
                  value='ye'
                  name='' 
                  className="country"
                  onChange={handleChange}
                  checked={legend === 1 ? legend1CountryValue.includes('ye') : legend2CountryValue.includes('ye')  }                            
                  
                      >

              </input>
              <label>Yemen</label>
          </li>
          </ul>

      </div>
          <div className="countries">
          
          

          <li>
              
                    <div className="continents">
                            <img className='con-icon' src='../assets/europe.png'></img>

                            <label className='con-label'>Europe</label>
                    </div>
                   
          </li>

            

              <ul>
                      
                  <li>
                      <input 
                          type='checkbox' 
                          value='al'
                          name='' 
                          className="country"
                          onChange={handleChange}
                          checked={legend === 1 ? legend1CountryValue.includes('al') : legend2CountryValue.includes('al')  }                            
                          
                      >
                          
                      </input>
                      <label>Albania</label>
                  </li>
              
                  <li>
                      <input 
                          type='checkbox' 
                          value='ad'
                          name='' 
                          className="country"
                          onChange={handleChange}
                          checked={legend === 1 ? legend1CountryValue.includes('ad') : legend2CountryValue.includes('ad')  }                            
                          
                      >
                          
                      </input>
                      <label>Andorra</label>
                  </li>

             

                  <li>
                      <input 
                          type='checkbox' 
                          value='at'
                          name='' 
                          className="country"
                          onChange={handleChange}
                          checked={legend === 1 ? legend1CountryValue.includes('at') : legend2CountryValue.includes('at')  }                            
                          
                      >
                          
                      </input>
                      <label>Austria</label>
                  </li>

                  <li>
                      <input 
                          type='checkbox' 
                          value='by'
                          name='' 
                          className="country"
                          onChange={handleChange}
                          checked={legend === 1 ? legend1CountryValue.includes('by') : legend2CountryValue.includes('by')  }                            
                          
                      >
                          
                      </input>
                      <label>Belarus</label>
                  </li>

                  <li>
                      <input 
                          type='checkbox' 
                          value='be'
                          name='' 
                          className="country"
                          onChange={handleChange}
                          checked={legend === 1 ? legend1CountryValue.includes('be') : legend2CountryValue.includes('be')  }                            
                          
                      >
                          
                      </input>
                      <label>Belgium</label>
                  </li>

                  <li>
                      <input 
                          type='checkbox' 
                          value='ba'
                          name='' 
                          className="country"
                          onChange={handleChange}
                          checked={legend === 1 ? legend1CountryValue.includes('ba') : legend2CountryValue.includes('ba')  }                            
                          
                      >
                          
                      </input>
                      <label>Bosnia and Herzegovina</label>
                  </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bg'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bg') : legend2CountryValue.includes('bg')  }                            
                      
                      >
                      
                  </input>
                  <label>Bulgaria</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='hr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('hr') : legend2CountryValue.includes('hr')  }                            
                      
                      >
                      
                  </input>
                  <label>Croatia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='cz'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('cz') : legend2CountryValue.includes('cz')  }                            
                      
                      >
                      
                  </input>
                  <label>Czech Republic</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='dk'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('dk') : legend2CountryValue.includes('dk')  }                            
                      
                      >
                      
                  </input>
                  <label>Denmark</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ee'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ee') : legend2CountryValue.includes('ee')  }                            
                      
                      >
                      
                  </input>
                  <label>Estonia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fo'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('fo') : legend2CountryValue.includes('fo')  }                            
                      
                      >
                      
                  </input>
                  <label>Faroe Islands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fi'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('fi') : legend2CountryValue.includes('fi')  }                            
                      
                      >
                      
                  </input>
                  <label>Finland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('fr') : legend2CountryValue.includes('fr')  }                            
                      
                      >
                      
                  </input>
                  <label>France</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='de'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('de') : legend2CountryValue.includes('de')  }                            
                      
                      >
                      
                  </input>
                  <label>Germany</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gr') : legend2CountryValue.includes('gr')  }                            
                      
                      >
                      
                  </input>
                  <label>Greece</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='hu'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('hu') : legend2CountryValue.includes('hu')  }                            
                      
                      >
                      
                  </input>
                  <label>Hungary</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='is'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('is') : legend2CountryValue.includes('is')  }                            
                      
                      >
                      
                  </input>
                  <label>Iceland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ie'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ie') : legend2CountryValue.includes('ie')  }                            
                      
                      >
                      
                  </input>
                  <label>Ireland</label>
              </li>
       
              <li>
                  <input 
                      type='checkbox' 
                      value='it'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('it') : legend2CountryValue.includes('it')  }                            
                      
                      >
                      
                  </input>
                  <label>Italy</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='lv'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('lv') : legend2CountryValue.includes('lv')  }                            
                      
                      >
                      
                  </input>
                  <label>Latvia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='li'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('li') : legend2CountryValue.includes('li')  }                            
                      
                      >
                      
                  </input>
                  <label>Liechtenstein</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='lt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('lt') : legend2CountryValue.includes('lt')  }                            
                      
                      >
                      
                  </input>
                  <label>Lithuania</label>
              </li>
              
              <li>
                  <input 
                      type='checkbox' 
                      value='lu'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('lu') : legend2CountryValue.includes('lu')  }                            
                      
                      >
                      
                  </input>
                  <label>Luxembourg</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('mt') : legend2CountryValue.includes('mt')  }                            
                      
                      >
                      
                  </input>
                  <label>Malta</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='md'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('md') : legend2CountryValue.includes('md')  }                            
                      
                      >
                      
                  </input>
                  <label>Moldova</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('mc') : legend2CountryValue.includes('mc')  }                            
                      
                      >
                      
                  </input>
                  <label>Monaco</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='me'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('me') : legend2CountryValue.includes('me')  }                            
                      
                      >
                      
                  </input>
                  <label>Montenegro</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('nl') : legend2CountryValue.includes('nl')  }                            
                      
                      >
                      
                  </input>
                  <label>Netherlands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mk'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('mk') : legend2CountryValue.includes('mk')  }                            
                      
                      >
                      
                  </input>
                  <label>North Macedonia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='no'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('no') : legend2CountryValue.includes('no')  }                            
                      
                      >
                      
                  </input>
                  <label>Norway</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pl') : legend2CountryValue.includes('pl')  }                            
                      
                      >
                      
                  </input>
                  <label>Poland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pt') : legend2CountryValue.includes('pt')  }                            
                      
                      >
                      
                  </input>
                  <label>Portugal</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ro'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ro') : legend2CountryValue.includes('ro')  }                            
                      
                      >
                      
                  </input>
                  <label>Romania</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ru'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ru') : legend2CountryValue.includes('ru')  }                            
                      
                      >
                      
                  </input>
                  <label>Russia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('sm') : legend2CountryValue.includes('sm')  }                            
                      
                      >
                      
                  </input>
                  <label>San Marino</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='rs'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('rs') : legend2CountryValue.includes('rs')  }                            
                      
                      >
                      
                  </input>
                  <label>Serbia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sk'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('sk') : legend2CountryValue.includes('sk')  }                            
                      
                      >
                      
                  </input>
                  <label>Slovakia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='si'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('si') : legend2CountryValue.includes('si')  }                            
                      
                      >
                      
                  </input>
                  <label>Slovenia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='es'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('es') : legend2CountryValue.includes('es')  }                            
                      
                      >
                      
                  </input>
                  <label>Spain</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='se'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('se') : legend2CountryValue.includes('se')  }                            
                      
                      >
                      
                  </input>
                  <label>Sweden</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ch'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ch') : legend2CountryValue.includes('ch')  }                            
                      
                      >
                      
                  </input>
                  <label>Switzerland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ua'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ua') : legend2CountryValue.includes('ua')  }                            
                      
                      >
                      
                  </input>
                  <label>Ukraine</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gb'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gb') : legend2CountryValue.includes('gb')  }                            
                      
                      >
                      
                  </input>
                  <label>United Kingdom</label>
              </li>
              
              </ul>

          </div>

         


      <div className="countries">
          
          

      <li>
                    <div className="continents">
                            <img className='con-icon' src='../assets/north-america.png'></img>

                            <label className='con-label'>North America</label>
                    </div>    
          </li>

        

          <ul>

          <li>
                  <input 
                      type='checkbox' 
                      value='ai'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ai') : legend2CountryValue.includes('ai')  }                            
                      
                      >
                      
                  </input>
                  <label>Anguilla</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ag'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ag') : legend2CountryValue.includes('ag')  }                            
                      
                      >
                      
                  </input>
                  <label>Antigua and Barbuda</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='aw'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('aw') : legend2CountryValue.includes('aw')  }                            
                      
                      >
                      
                  </input>
                  <label>Aruba</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='bs'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bs') : legend2CountryValue.includes('bs')  }                            
                      
                      >
                      
                  </input>
                  <label>Bahamas</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='bb'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bb') : legend2CountryValue.includes('bb')  }                            
                      
                      >
                      
                  </input>
                  <label>Barbados</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bz'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bz') : legend2CountryValue.includes('bz')  }                            
                      
                      >
                      
                  </input>
                  <label>Belize</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bm') : legend2CountryValue.includes('bm')  }                            
                      
                      >
                      
                  </input>
                  <label>Bermunda</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bq'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bq') : legend2CountryValue.includes('bq')  }                            
                      
                      >
                      
                  </input>
                  <label>Bonaire</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vg'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('vg') : legend2CountryValue.includes('vg')  }                            
                      
                      >
                      
                  </input>
                  <label>British Virgin Islands</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='ca'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ca') : legend2CountryValue.includes('ca')  }                            
                      
                      >
                      
                  </input>
                  <label>Canada</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ky'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ky') : legend2CountryValue.includes('ky')  }                            
                      
                      >
                      
                  </input>
                  <label>Cayman Islands</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='cr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('cr') : legend2CountryValue.includes('cr')  }                            
                      
                      >
                      
                  </input>
                  <label>Costa Rica</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='cu'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('cu') : legend2CountryValue.includes('cu')  }                            
                      
                      >
                      
                  </input>
                  <label>Cuba</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='cw'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('cw') : legend2CountryValue.includes('cw')  }                            
                      
                      >
                      
                  </input>
                  <label>Curacao</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='dm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('dm') : legend2CountryValue.includes('dm')  }                            
                      
                      >
                      
                  </input>
                  <label>Dominica</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='do'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('do') : legend2CountryValue.includes('do')  }                            
                      
                      >
                      
                  </input>
                  <label>Dominican Republic</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sv'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('sv') : legend2CountryValue.includes('sv')  }                            
                      
                      >
                      
                  </input>
                  <label>El Salvador</label>
              </li>


         
              
              <li>
                  <input 
                      type='checkbox' 
                      value='gd'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gd') : legend2CountryValue.includes('gd')  }                            
                      
                      >
                      
                  </input>
                  <label>Grenada</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gl') : legend2CountryValue.includes('gl')  }                            
                      
                      >
                      
                  </input>
                  <label>Greenland</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gp'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gp') : legend2CountryValue.includes('gp')  }                            
                      
                      >
                      
                  </input>
                  <label>Guadeloupe</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='gt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gt') : legend2CountryValue.includes('gt')  }                            
                      
                      >
                      
                  </input>
                  <label>Guatemala</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ht'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ht') : legend2CountryValue.includes('ht')  }                            
                      
                      >
                      
                  </input>
                  <label>Haiti</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='hn'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('hn') : legend2CountryValue.includes('hn')  }                            
                      
                      >
                      
                  </input>
                  <label>Honduras</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='jm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('jm') : legend2CountryValue.includes('jm')  }                            
                      
                      >
                      
                  </input>
                  <label>Jamaica</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mq'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('mq') : legend2CountryValue.includes('mq')  }                            
                      
                      >
                      
                  </input>
                  <label>Martinique</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mx'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('mx') : legend2CountryValue.includes('mx')  }                            
                      
                      >
                      
                  </input>
                  <label>Mexico</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ms'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ms') : legend2CountryValue.includes('ms')  }                            
                      
                      >
                      
                  </input>
                  <label>Montserrat</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ni'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ni') : legend2CountryValue.includes('ni')  }                            
                      
                      >
                      
                  </input>
                  <label>Nicaragua</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pa'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pa') : legend2CountryValue.includes('pa')  }                            
                      
                      >
                      
                  </input>
                  <label>Panama</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pr') : legend2CountryValue.includes('pr')  }                            
                      
                      >
                      
                  </input>
                  <label>Puerto Rica</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bl') : legend2CountryValue.includes('bl')  }                            
                      
                      >
                      
                  </input>
                  <label>Saint Barthélemy</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='kn'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('kn') : legend2CountryValue.includes('kn')  }                            
                      
                      >
                      
                  </input>
                  <label>Saint Kitts and Nevis</label>
              </li>
      
              <li>
                  <input 
                      type='checkbox' 
                      value='lc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('lc') : legend2CountryValue.includes('lc')  }                            
                      
                      >
                      
                  </input>
                  <label>Saint Lucia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='mf'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('mf') : legend2CountryValue.includes('mf')  }                            
                      
                      >
                      
                  </input>
                  <label>Saint Martin</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pm') : legend2CountryValue.includes('pm')  }                            
                      
                      >
                      
                  </input>
                  <label>Saint Pierre and Miquelon</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('vc') : legend2CountryValue.includes('vc')  }                            
                      
                      >
                      
                  </input>
                  <label>Saint Vincent and the Grenadines</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sx'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('sx') : legend2CountryValue.includes('sx')  }                            
                      
                      >
                      
                  </input>
                  <label>Sint Maarten</label>
              </li>



              <li>
                  <input 
                      type='checkbox' 
                      value='tt'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('tt') : legend2CountryValue.includes('tt')  }                            
                      
                      >
                      
                  </input>
                  <label>Trinidad and Tobago</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='tc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('tc') : legend2CountryValue.includes('tc')  }                            
                      
                      >
                      
                  </input>
                  <label>Turks and Caicos Island</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vi'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('vi') : legend2CountryValue.includes('vi')  }                            
                      
                      >
                      
                  </input>
                  <label>US Virgin Islands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='us'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('us') : legend2CountryValue.includes('us')  }                            
                      
                      >
                      
                  </input>
                  <label>United States of America</label>
              </li>
          
        
          </ul>

      </div>

      <div className="countries">
          
          

      <li>
                    <div className="continents">
                            <img className='con-icon' src='../assets/south-america.png'></img>

                            <label className='con-label'>South America</label>
                    </div>      
          </li>

        

          <ul>

          <li>
                  <input 
                      type='checkbox' 
                      value='ar'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ar') : legend2CountryValue.includes('ar')  }                            
                      
                      >
                      
                  </input>
                  <label>Argentina</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='bo'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('bo') : legend2CountryValue.includes('bo')  }                            
                      
                      >
                      
                  </input>
                  <label>Bolivia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='br'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('br') : legend2CountryValue.includes('br')  }                            
                      
                      >
                      
                  </input>
                  <label>Brazil</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='cl'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('cl') : legend2CountryValue.includes('cl')  }                            
                      
                      >
                      
                  </input>
                  <label>Chile</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='co'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('co') : legend2CountryValue.includes('co')  }                            
                      
                      >
                      
                  </input>
                  <label>Colombia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ec'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ec') : legend2CountryValue.includes('ec')  }                            
                      
                      >
                      
                  </input>
                  <label>Ecuador</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fk'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('fk') : legend2CountryValue.includes('fk')  }                            
                      
                      >
                      
                  </input>
                  <label>Falkland Islands</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gf'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gf') : legend2CountryValue.includes('gf')  }                            
                      
                      >
                      
                  </input>
                  <label>French Guiana</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='gy'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('gy') : legend2CountryValue.includes('gy')  }                            
                      
                      >
                      
                  </input>
                  <label>Guyana</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='py'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('py') : legend2CountryValue.includes('py')  }                            
                      
                      >
                      
                  </input>
                  <label>Paraguay</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pe'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pe') : legend2CountryValue.includes('pe')  }                            
                      
                      >
                      
                  </input>
                  <label>Peru</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='sr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('sr') : legend2CountryValue.includes('sr')  }                            
                      
                      >
                      
                  </input>
                  <label>Suriname</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='uy'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('uy') : legend2CountryValue.includes('uy')  }                            
                      
                      >
                      
                  </input>
                  <label>Uruguay</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ve'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ve') : legend2CountryValue.includes('ve')  }                            
                      
                      >
                      
                  </input>
                  <label>Venezuela</label>
              </li>

             
          
        
          </ul>

      

      <div className="countries">
          
          

      <li>
               <div className="continents">
                      <input
                          type='checkbox'
                          className='continent'
                          
                          />

                   <label>Oceana</label>
              </div>         
          </li>

        

          <ul>

          <li>
                  <input 
                      type='checkbox' 
                      value='au'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('au') : legend2CountryValue.includes('au')  }                            
                      
                      >
                      
                  </input>
                  <label>Australia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='fj'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('fj') : legend2CountryValue.includes('fj')  }                            
                      
                      >
                      
                  </input>
                  <label>Fiji</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='ki'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ki') : legend2CountryValue.includes('ki')  }                            
                      
                      >
                      
                  </input>
                  <label>Kiribati</label>
              </li>
          
              <li>
                  <input 
                      type='checkbox' 
                      value='mh'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('mh') : legend2CountryValue.includes('mh')  }                            
                      
                      >
                      
                  </input>
                  <label>Marshall Islands</label>
              </li>

         

              <li>
                  <input 
                      type='checkbox' 
                      value='fm'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('fm') : legend2CountryValue.includes('fm')  }                            
                      
                      >
                      
                  </input>
                  <label>Micronesia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nr'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('nr') : legend2CountryValue.includes('nr')  }                            
                      
                      >
                      
                  </input>
                  <label>Nauru</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nc'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('nc') : legend2CountryValue.includes('nc')  }                            
                      
                      >
                      
                  </input>
                  <label>New Caledonia</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='nz'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('nz') : legend2CountryValue.includes('nz')  }                            
                      
                      >
                      
                  </input>
                  <label>New Zealand</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pw'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pw') : legend2CountryValue.includes('pw')  }                            
                      
                      >
                      
                  </input>
                  <label>Palau</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='pg'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('pg') : legend2CountryValue.includes('pg')  }                            
                      
                      >
                      
                  </input>
                  <label>Papua New Guiana</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='ws'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('ws') : legend2CountryValue.includes('ws')  }                            
                      
                      >
                      
                  </input>
                  <label>Samoa</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='sb'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('sb') : legend2CountryValue.includes('sb')  }                            
                      
                      >
                      
                  </input>
                  <label>Solomon Islands</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='to'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('to') : legend2CountryValue.includes('to')  }                            
                      
                      >
                      
                  </input>
                  <label>Tonga</label>
              </li>


              <li>
                  <input 
                      type='checkbox' 
                      value='tv'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('tv') : legend2CountryValue.includes('tv')  }                            
                      
                      >
                      
                  </input>
                  <label>Tuvalu</label>
              </li>

              <li>
                  <input 
                      type='checkbox' 
                      value='vu'
                      name='' 
                      className="country"
                      onChange={handleChange}
                      checked={legend === 1 ? legend1CountryValue.includes('vu') : legend2CountryValue.includes('vu')  }                            
                      
                      >
                      
                  </input>
                  <label>Vanuatu</label>
              </li>

             
          
        
          </ul>

      </div>
          
       
      </div>

      
  </div>
    )
}

export default Countries

