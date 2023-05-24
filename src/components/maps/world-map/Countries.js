import '../../App.css'
import { useEffect } from 'react';
import CountryList from './CountryList';
import { countriesData } from './CountriesData';




function Countries({ 
    group,
    
    group1ColorValue, 
    group2ColorValue, 
    group3ColorValue,
    group4ColorValue,
    group5ColorValue,
    group6ColorValue,
    group7ColorValue,
    group8ColorValue,


     
    group1CountryValue, 
    group2CountryValue, 
    group3CountryValue,
    group4CountryValue,
    group5CountryValue,
    group6CountryValue,
    group7CountryValue,
    group8CountryValue,




    setGroup1CountryValue,
    setGroup2CountryValue,
    setGroup3CountryValue,
    setGroup4CountryValue,
    setGroup5CountryValue,
    setGroup6CountryValue,
    setGroup7CountryValue,
    setGroup8CountryValue,

    selectedOption,
    setSelectedOption





}) {
   
    useEffect(() => {
        // get a list of all the countries
        const allCountryIds = document.getElementsByClassName("country");

        
        if (
            group === 1 || 
            group === 2 || 
            group === 3 || 
            group === 4 || 
            group === 5 || 
            group === 6 || 
            group === 7 ||
            group === 8
            ) {
          
                const groups = [      
                    group1CountryValue,      
                    group2CountryValue,      
                    group3CountryValue,      
                    group4CountryValue,      
                    group5CountryValue,      
                    group6CountryValue,      
                    group7CountryValue,      
                    group8CountryValue,
                  ];
                  
                  const colors = [      
                    group1ColorValue,      
                    group2ColorValue,      
                    group3ColorValue,      
                    group4ColorValue,      
                    group5ColorValue,      
                    group6ColorValue,      
                    group7ColorValue,      
                    group8ColorValue,
                  ];
                  
                  groups.forEach((groupCountryValue, index) => {
                    if (groupCountryValue.length > 0) {
                      groupCountryValue.forEach((id) => {
                        document.getElementById(id).style.fill = colors[index];
                      });
                    }
                  });

                  
                  


          // loop through all the countries and set their fill color back to the default
          for (var i = 0; i < allCountryIds.length; i++) {
            const id = allCountryIds[i].value;
            
            if (
                !group1CountryValue.includes(id) && 
                !group2CountryValue.includes(id) && 
                !group3CountryValue.includes(id) && 
                !group4CountryValue.includes(id) &&
                !group5CountryValue.includes(id) &&
                !group6CountryValue.includes(id) &&
                !group7CountryValue.includes(id) &&
                !group8CountryValue.includes(id)
                ) {
                   
              document.getElementById(id).style.fill = "#c0c0c0";
            }
          }

      
         
        }
      }, );
      
      
      const handleChange = (event) => {
        const selectedOption = event.target.value;
        
        setSelectedOption(prevSelectedOption => prevSelectedOption.includes(selectedOption)
        ? prevSelectedOption.filter(option => option !== selectedOption)
        : [...prevSelectedOption, selectedOption]
      );

       
        

        if (group === 1) {
            
          if (group1CountryValue.includes(selectedOption)) {
            setGroup1CountryValue(group1CountryValue.filter((o) => o !== selectedOption));
          } else {
            setGroup1CountryValue([...group1CountryValue, selectedOption]);
          }
          


        } else if (group === 2) {
            
          if (group2CountryValue.includes(selectedOption)) {
            setGroup2CountryValue(group2CountryValue.filter((o) => o !== selectedOption));
          } else {
            setGroup2CountryValue([...group2CountryValue, selectedOption]);
          }

          
        }else if (group === 3) {
            if (group3CountryValue.includes(selectedOption)) {
              setGroup3CountryValue(group3CountryValue.filter((o) => o !== selectedOption));
            } else {
              setGroup3CountryValue([...group3CountryValue, selectedOption]);
            }
          }

          else if (group === 4) {
            if (group4CountryValue.includes(selectedOption)) {
              setGroup4CountryValue(group4CountryValue.filter((o) => o !== selectedOption));
            } else {
              setGroup4CountryValue([...group4CountryValue, selectedOption]);
            } 
            
          }

          else if (group === 5) {
            if (group5CountryValue.includes(selectedOption)) {
              setGroup5CountryValue(group5CountryValue.filter((o) => o !== selectedOption));
            } else {
              setGroup5CountryValue([...group5CountryValue, selectedOption]);
            }

        } 

        else if (group === 6) {
            if (group6CountryValue.includes(selectedOption)) {
              setGroup6CountryValue(group6CountryValue.filter((o) => o !== selectedOption));
            } else {
              setGroup6CountryValue([...group6CountryValue, selectedOption]);
            }
       
        } 
        else if (group === 7) {
            if (group7CountryValue.includes(selectedOption)) {
            setGroup7CountryValue(group7CountryValue.filter((o) => o !== selectedOption));
            } else {
            setGroup7CountryValue([...group7CountryValue, selectedOption]);
            }
        
    }   else if (group === 8) {
            if (group8CountryValue.includes(selectedOption)) {
            setGroup8CountryValue(group8CountryValue.filter((o) => o !== selectedOption));
            } else {
            setGroup8CountryValue([...group8CountryValue, selectedOption]);
            }

    };


   
    }

        // Africa
        const africaCountries = countriesData.filter(country => country.region === 'AF');

        // Asia
        const asiaCountries = countriesData.filter(country => country.region === 'AS');

        // Europe
        const europeCountries = countriesData.filter(country => country.region === 'EU');

        // North America
        const northAmericaCountries = countriesData.filter(country => country.region === 'NA');

        // South America
        const southAmericaCountries = countriesData.filter(country => country.region === 'SA');

        // Oceania
        const oceaniaCountries = countriesData.filter(country => country.region === 'OC');

      
    return(
      <div className="state-selector">
            
      <div className="countries">
          
      <ul>

<li>
     <div className="continents">
          <img 
              className='con-icon' 
              src='../assets/africa.png'
              alt='Asia'>

              </img>

          <label className='con-label'>Africa</label>
    </div>         
</li>

         

        

      <CountryList
        countries={africaCountries}
        handleChange={handleChange}
        group={group}
        selectedOption={selectedOption}
        group1CountryValue={group1CountryValue}
        group2CountryValue={group2CountryValue}
        group3CountryValue={group3CountryValue}
        group4CountryValue={group4CountryValue}
        group5CountryValue={group5CountryValue}
        group6CountryValue={group6CountryValue}
        group7CountryValue={group7CountryValue}
        group8CountryValue={group8CountryValue}
       

        />

        </ul>
      </div>

      <div className="countries">
          
          

      

        

          <ul>

          <li>
               <div className="continents">
                    <img 
                        className='con-icon' 
                        src='../assets/asia.png'
                        alt='Asia'>

                        </img>

                    <label className='con-label'>Asia</label>
              </div>         
          </li>
          <CountryList
        countries={asiaCountries}
        handleChange={handleChange}
        selectedOption={selectedOption}
        group={group}
        group1CountryValue={group1CountryValue}
        group2CountryValue={group2CountryValue}
        group3CountryValue={group3CountryValue}
        group4CountryValue={group4CountryValue}
        group5CountryValue={group5CountryValue}
        group6CountryValue={group6CountryValue}
        group7CountryValue={group7CountryValue}
        group8CountryValue={group8CountryValue}

        />

          </ul>

      </div>
          <div className="countries">
          
          


            

              <ul>
                      
          <li>
              
              <div className="continents">
                      <img 
                        className='con-icon' 
                        src='../assets/europe.png'
                        alt='Europe'
                        >

                        </img>

                      <label className='con-label'>Europe</label>
              </div>
             
        </li>
        <CountryList
        countries={europeCountries}
        handleChange={handleChange}
        selectedOption={selectedOption}
        group={group}
        group1CountryValue={group1CountryValue}
        group2CountryValue={group2CountryValue}
        group3CountryValue={group3CountryValue}
        group4CountryValue={group4CountryValue}
        group5CountryValue={group5CountryValue}
        group6CountryValue={group6CountryValue}
        group7CountryValue={group7CountryValue}
        group8CountryValue={group8CountryValue}

        />
              
              </ul>

          </div>

         


      <div className="countries">
          
          

        

          <ul>


      <li>
                    <div className="continents">
                            <img 
                                className='con-icon' 
                                src='../assets/north-america.png'
                                alt='North America'
                                ></img>

                            <label className='con-label'>North America</label>
                    </div>    
          </li>


          <CountryList
        countries={northAmericaCountries}
        handleChange={handleChange}
        selectedOption={selectedOption}
        group={group}
        group1CountryValue={group1CountryValue}
        group2CountryValue={group2CountryValue}
        group3CountryValue={group3CountryValue}
        group4CountryValue={group4CountryValue}
        group5CountryValue={group5CountryValue}
        group6CountryValue={group6CountryValue}
        group7CountryValue={group7CountryValue}
        group8CountryValue={group8CountryValue}

        />
              
          
        
          </ul>

      </div>

      <div className="countries">
          
          

     
        

          <ul>
          <li>
                    <div className="continents">
                            <img 
                                className='con-icon' 
                                src='../assets/south-america.png'
                                alt='South America'
                                >

                                </img>

                            <label className='con-label'>South America</label>
                    </div>      
          </li>


          <CountryList
        countries={southAmericaCountries}
        handleChange={handleChange}
        selectedOption={selectedOption}
        group={group}
        group1CountryValue={group1CountryValue}
        group2CountryValue={group2CountryValue}
        group3CountryValue={group3CountryValue}
        group4CountryValue={group4CountryValue}
        group5CountryValue={group5CountryValue}
        group6CountryValue={group6CountryValue}
        group7CountryValue={group7CountryValue}
        group8CountryValue={group8CountryValue}

        />
              
             
          
        
          </ul>

      

      <div className="countries oceana">
          
          

  
        

          <ul>
          <li>
                <div className="continents" >
                    <img 
                        className='con-icon' 
                        src='../assets/australia.png'
                        alt='Australia'
                        >
                            
                        </img>

                    <label className='con-label'>Oceana</label>
                </div>           
          </li>


          <CountryList
        countries={oceaniaCountries}
        handleChange={handleChange}
        selectedOption={selectedOption}
        group={group}
        group1CountryValue={group1CountryValue}
        group2CountryValue={group2CountryValue}
        group3CountryValue={group3CountryValue}
        group4CountryValue={group4CountryValue}
        group5CountryValue={group5CountryValue}
        group6CountryValue={group6CountryValue}
        group7CountryValue={group7CountryValue}
        group8CountryValue={group8CountryValue}

        />
              

             
          
        
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
                        group === 1 ? group1CountryValue.includes('aq') : 
                        group === 2 ? group2CountryValue.includes('aq') : 
                        group === 3 ? group3CountryValue.includes('aq') : 
                        group === 4 ? group4CountryValue.includes('aq') :
                        group === 5 ? group5CountryValue.includes('aq') :
                        group === 6 ? group6CountryValue.includes('aq') :
                        group === 7 ? group7CountryValue.includes('aq') :
                        group8CountryValue.includes('aq')    
                    }                            
                    disabled={
                        selectedOption.includes('aq') &&
                        ((group !== 1 && group1CountryValue.includes('aq')) ||
                        (group !== 2 && group2CountryValue.includes('aq')) ||
                        (group !== 3 && group3CountryValue.includes('aq')) ||
                        (group !== 4 && group4CountryValue.includes('aq')) ||
                        (group !== 5 && group5CountryValue.includes('aq')) ||
                        (group !== 6 && group6CountryValue.includes('aq')) ||
                        (group !== 7 && group7CountryValue.includes('aq')) ||
                        (group !== 8 && group8CountryValue.includes('aq')))
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

