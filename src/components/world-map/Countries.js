import '../App.css'
import { useEffect, useState } from 'react';




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
            group8CountryValue,    ];
      
          const colors = [      
            group1ColorValue,      
            group2ColorValue,      
            group3ColorValue,      
            group4ColorValue,      
            group5ColorValue,      
            group6ColorValue,      
            group7ColorValue,      
            group8ColorValue,    ];
          
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
      }, [  
        group,   
        group1CountryValue,   
        group2CountryValue,   
        group3CountryValue,   
        group4CountryValue,  
        group5CountryValue,  
        group6CountryValue,  
        group7CountryValue,  
        group8CountryValue,]);
      
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
                        group === 1 ? group1CountryValue.includes('dz') : 
                        group === 2 ? group2CountryValue.includes('dz') : 
                        group === 3 ? group3CountryValue.includes('dz') : 
                        group === 4 ? group4CountryValue.includes('dz') :
                        group === 5 ? group5CountryValue.includes('dz') :
                        group === 6 ? group6CountryValue.includes('dz') :
                        group === 7 ? group7CountryValue.includes('dz') :
                        group8CountryValue.includes('dz')
                    }
                    disabled={
                        selectedOption.includes('dz') &&
                        ((group !== 1 && group1CountryValue.includes('dz')) ||
                        (group !== 2 && group2CountryValue.includes('dz')) ||
                        (group !== 3 && group3CountryValue.includes('dz')) ||
                        (group !== 4 && group4CountryValue.includes('dz')) ||
                        (group !== 5 && group5CountryValue.includes('dz')) ||
                        (group !== 6 && group6CountryValue.includes('dz')) ||
                        (group !== 7 && group7CountryValue.includes('dz')) ||
                        (group !== 8 && group8CountryValue.includes('dz')))
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
                        group === 1 ? group1CountryValue.includes('ao') : 
                        group === 2 ? group2CountryValue.includes('ao') : 
                        group === 3 ? group3CountryValue.includes('ao') : 
                        group === 4 ? group4CountryValue.includes('ao') :
                        group === 5 ? group5CountryValue.includes('ao') :
                        group === 6 ? group6CountryValue.includes('ao') :
                        group === 7 ? group7CountryValue.includes('ao') :
                        group8CountryValue.includes('ao')
                    }
                    disabled={
                        selectedOption.includes('ao') &&
                        ((group !== 1 && group1CountryValue.includes('ao')) ||
                        (group !== 2 && group2CountryValue.includes('ao')) ||
                        (group !== 3 && group3CountryValue.includes('ao')) ||
                        (group !== 4 && group4CountryValue.includes('ao')) ||
                        (group !== 5 && group5CountryValue.includes('ao')) ||
                        (group !== 6 && group6CountryValue.includes('ao')) ||
                        (group !== 7 && group7CountryValue.includes('ao')) ||
                        (group !== 8 && group8CountryValue.includes('ao')))
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
                        group === 1 ? group1CountryValue.includes('bj') : 
                        group === 2 ? group2CountryValue.includes('bj') : 
                        group === 3 ? group3CountryValue.includes('bj') : 
                        group === 4 ? group4CountryValue.includes('bj') :
                        group === 5 ? group5CountryValue.includes('bj') :
                        group === 6 ? group6CountryValue.includes('bj') :
                        group === 7 ? group7CountryValue.includes('bj') :
                        group8CountryValue.includes('bj')
                    }
                    disabled={
                        selectedOption.includes('bj') &&
                        ((group !== 1 && group1CountryValue.includes('bj')) ||
                        (group !== 2 && group2CountryValue.includes('bj')) ||
                        (group !== 3 && group3CountryValue.includes('bj')) ||
                        (group !== 4 && group4CountryValue.includes('bj')) ||
                        (group !== 5 && group5CountryValue.includes('bj')) ||
                        (group !== 6 && group6CountryValue.includes('bj')) ||
                        (group !== 7 && group7CountryValue.includes('bj')) ||
                        (group !== 8 && group8CountryValue.includes('bj')))
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
                        group === 1 ? group1CountryValue.includes('bw') : 
                        group === 2 ? group2CountryValue.includes('bw') : 
                        group === 3 ? group3CountryValue.includes('bw') : 
                        group === 4 ? group4CountryValue.includes('bw') :
                        group === 5 ? group5CountryValue.includes('bw') :
                        group === 6 ? group6CountryValue.includes('bw') :
                        group === 7 ? group7CountryValue.includes('bw') :
                        group8CountryValue.includes('bw')
                    }
                    disabled={
                        selectedOption.includes('bw') &&
                        ((group !== 1 && group1CountryValue.includes('bw')) ||
                        (group !== 2 && group2CountryValue.includes('bw')) ||
                        (group !== 3 && group3CountryValue.includes('bw')) ||
                        (group !== 4 && group4CountryValue.includes('bw')) ||
                        (group !== 5 && group5CountryValue.includes('bw')) ||
                        (group !== 6 && group6CountryValue.includes('bw')) ||
                        (group !== 7 && group7CountryValue.includes('bw')) ||
                        (group !== 8 && group8CountryValue.includes('bw')))
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
                        group === 1 ? group1CountryValue.includes('bf') : 
                        group === 2 ? group2CountryValue.includes('bf') : 
                        group === 3 ? group3CountryValue.includes('bf') : 
                        group === 4 ? group4CountryValue.includes('bf') :
                        group === 5 ? group5CountryValue.includes('bf') :
                        group === 6 ? group6CountryValue.includes('bf') :
                        group === 7 ? group7CountryValue.includes('bf') :
                        group8CountryValue.includes('bf')
                    }
                    disabled={
                        selectedOption.includes('bf') &&
                        ((group !== 1 && group1CountryValue.includes('bf')) ||
                        (group !== 2 && group2CountryValue.includes('bf')) ||
                        (group !== 3 && group3CountryValue.includes('bf')) ||
                        (group !== 4 && group4CountryValue.includes('bf')) ||
                        (group !== 5 && group5CountryValue.includes('bf')) ||
                        (group !== 6 && group6CountryValue.includes('bf')) ||
                        (group !== 7 && group7CountryValue.includes('bf')) ||
                        (group !== 8 && group8CountryValue.includes('bf')))
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
                        group === 1 ? group1CountryValue.includes('bi') : 
                        group === 2 ? group2CountryValue.includes('bi') : 
                        group === 3 ? group3CountryValue.includes('bi') : 
                        group === 4 ? group4CountryValue.includes('bi') :
                        group === 5 ? group5CountryValue.includes('bi') :
                        group === 6 ? group6CountryValue.includes('bi') :
                        group === 7 ? group7CountryValue.includes('bi') :
                        group8CountryValue.includes('bi')
                    }                            
                    disabled={
                        selectedOption.includes('bi') &&
                        ((group !== 1 && group1CountryValue.includes('bi')) ||
                        (group !== 2 && group2CountryValue.includes('bi')) ||
                        (group !== 3 && group3CountryValue.includes('bi')) ||
                        (group !== 4 && group4CountryValue.includes('bi')) ||
                        (group !== 5 && group5CountryValue.includes('bi')) ||
                        (group !== 6 && group6CountryValue.includes('bi')) ||
                        (group !== 7 && group7CountryValue.includes('bi')) ||
                        (group !== 8 && group8CountryValue.includes('bi')))
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
                    group === 1 ? group1CountryValue.includes('cv') : 
                    group === 2 ? group2CountryValue.includes('cv') : 
                    group === 3 ? group3CountryValue.includes('cv') : 
                    group === 4 ? group4CountryValue.includes('cv') :
                    group === 5 ? group5CountryValue.includes('cv') :
                    group === 6 ? group6CountryValue.includes('cv') :
                    group === 7 ? group7CountryValue.includes('cv') :
                    group8CountryValue.includes('cv')
                }                            
                disabled={
                        selectedOption.includes('cv') &&
                        ((group !== 1 && group1CountryValue.includes('cv')) ||
                        (group !== 2 && group2CountryValue.includes('cv')) ||
                        (group !== 3 && group3CountryValue.includes('cv')) ||
                        (group !== 4 && group4CountryValue.includes('cv')) ||
                        (group !== 5 && group5CountryValue.includes('cv')) ||
                        (group !== 6 && group6CountryValue.includes('cv')) ||
                        (group !== 7 && group7CountryValue.includes('cv')) ||
                        (group !== 8 && group8CountryValue.includes('cv')))
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
                    group === 1 ? group1CountryValue.includes('cm') : 
                    group === 2 ? group2CountryValue.includes('cm') : 
                    group === 3 ? group3CountryValue.includes('cm') : 
                    group === 4 ? group4CountryValue.includes('cm') :
                    group === 5 ? group5CountryValue.includes('cm') :
                    group === 6 ? group6CountryValue.includes('cm') :
                    group === 7 ? group7CountryValue.includes('cm') :
                    group8CountryValue.includes('cm')
                }                            
                disabled={
                        selectedOption.includes('cm') &&
                        ((group !== 1 && group1CountryValue.includes('cm')) ||
                        (group !== 2 && group2CountryValue.includes('cm')) ||
                        (group !== 3 && group3CountryValue.includes('cm')) ||
                        (group !== 4 && group4CountryValue.includes('cm')) ||
                        (group !== 5 && group5CountryValue.includes('cm')) ||
                        (group !== 6 && group6CountryValue.includes('cm')) ||
                        (group !== 7 && group7CountryValue.includes('cm')) ||
                        (group !== 8 && group8CountryValue.includes('cm')))
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
                    group === 1 ? group1CountryValue.includes('cf') : 
                    group === 2 ? group2CountryValue.includes('cf') : 
                    group === 3 ? group3CountryValue.includes('cf') : 
                    group === 4 ? group4CountryValue.includes('cf') :
                    group === 5 ? group5CountryValue.includes('cf') :
                    group === 6 ? group6CountryValue.includes('cf') :
                    group === 7 ? group7CountryValue.includes('cf') :
                    group8CountryValue.includes('cf')
                }                            
                disabled={
                        selectedOption.includes('cf') &&
                        ((group !== 1 && group1CountryValue.includes('cf')) ||
                        (group !== 2 && group2CountryValue.includes('cf')) ||
                        (group !== 3 && group3CountryValue.includes('cf')) ||
                        (group !== 4 && group4CountryValue.includes('cf')) ||
                        (group !== 5 && group5CountryValue.includes('cf')) ||
                        (group !== 6 && group6CountryValue.includes('cf')) ||
                        (group !== 7 && group7CountryValue.includes('cf')) ||
                        (group !== 8 && group8CountryValue.includes('cf')))
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
                    group === 1 ? group1CountryValue.includes('td') : 
                    group === 2 ? group2CountryValue.includes('td') : 
                    group === 3 ? group3CountryValue.includes('td') : 
                    group === 4 ? group4CountryValue.includes('td') :
                    group === 5 ? group5CountryValue.includes('td') :
                    group === 6 ? group6CountryValue.includes('td') :
                    group === 7 ? group7CountryValue.includes('td') :
                    group8CountryValue.includes('td')
                }                            
                disabled={
                        selectedOption.includes('td') &&
                        ((group !== 1 && group1CountryValue.includes('td')) ||
                        (group !== 2 && group2CountryValue.includes('td')) ||
                        (group !== 3 && group3CountryValue.includes('td')) ||
                        (group !== 4 && group4CountryValue.includes('td')) ||
                        (group !== 5 && group5CountryValue.includes('td')) ||
                        (group !== 6 && group6CountryValue.includes('td')) ||
                        (group !== 7 && group7CountryValue.includes('td')) ||
                        (group !== 8 && group8CountryValue.includes('td')))
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
                    group === 1 ? group1CountryValue.includes('km') : 
                    group === 2 ? group2CountryValue.includes('km') : 
                    group === 3 ? group3CountryValue.includes('km') : 
                    group === 4 ? group4CountryValue.includes('km') :
                    group === 5 ? group5CountryValue.includes('km') :
                    group === 6 ? group6CountryValue.includes('km') :
                    group === 7 ? group7CountryValue.includes('km') :
                    group8CountryValue.includes('km')
                }                            
                disabled={
                        selectedOption.includes('km') &&
                        ((group !== 1 && group1CountryValue.includes('km')) ||
                        (group !== 2 && group2CountryValue.includes('km')) ||
                        (group !== 3 && group3CountryValue.includes('km')) ||
                        (group !== 4 && group4CountryValue.includes('km')) ||
                        (group !== 5 && group5CountryValue.includes('km')) ||
                        (group !== 6 && group6CountryValue.includes('km')) ||
                        (group !== 7 && group7CountryValue.includes('km')) ||
                        (group !== 8 && group8CountryValue.includes('km')))
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
                    group === 1 ? group1CountryValue.includes('cg') : 
                    group === 2 ? group2CountryValue.includes('cg') : 
                    group === 3 ? group3CountryValue.includes('cg') : 
                    group === 4 ? group4CountryValue.includes('cg') :
                    group === 5 ? group5CountryValue.includes('cg') :
                    group === 6 ? group6CountryValue.includes('cg') :
                    group === 7 ? group7CountryValue.includes('cg') :
                    group8CountryValue.includes('cg')
                }                            
                disabled={
                        selectedOption.includes('cg') &&
                        ((group !== 1 && group1CountryValue.includes('cg')) ||
                        (group !== 2 && group2CountryValue.includes('cg')) ||
                        (group !== 3 && group3CountryValue.includes('cg')) ||
                        (group !== 4 && group4CountryValue.includes('cg')) ||
                        (group !== 5 && group5CountryValue.includes('cg')) ||
                        (group !== 6 && group6CountryValue.includes('cg')) ||
                        (group !== 7 && group7CountryValue.includes('cg')) ||
                        (group !== 8 && group8CountryValue.includes('cg')))
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
                    group === 1 ? group1CountryValue.includes('ci') : 
                    group === 2 ? group2CountryValue.includes('ci') : 
                    group === 3 ? group3CountryValue.includes('ci') : 
                    group === 4 ? group4CountryValue.includes('ci') :
                    group === 5 ? group5CountryValue.includes('ci') :
                    group === 6 ? group6CountryValue.includes('ci') :
                    group === 7 ? group7CountryValue.includes('ci') :
                    group8CountryValue.includes('ci')
                }                            
                disabled={
                        selectedOption.includes('ci') &&
                        ((group !== 1 && group1CountryValue.includes('ci')) ||
                        (group !== 2 && group2CountryValue.includes('ci')) ||
                        (group !== 3 && group3CountryValue.includes('ci')) ||
                        (group !== 4 && group4CountryValue.includes('ci')) ||
                        (group !== 5 && group5CountryValue.includes('ci')) ||
                        (group !== 6 && group6CountryValue.includes('ci')) ||
                        (group !== 7 && group7CountryValue.includes('ci')) ||
                        (group !== 8 && group8CountryValue.includes('ci')))
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
                    group === 1 ? group1CountryValue.includes('dj') : 
                    group === 2 ? group2CountryValue.includes('dj') : 
                    group === 3 ? group3CountryValue.includes('dj') : 
                    group === 4 ? group4CountryValue.includes('dj') :
                    group === 5 ? group5CountryValue.includes('dj') :
                    group === 6 ? group6CountryValue.includes('dj') :
                    group === 7 ? group7CountryValue.includes('dj') :
                    group8CountryValue.includes('dj')
                }                            
                disabled={
                        selectedOption.includes('dj') &&
                        ((group !== 1 && group1CountryValue.includes('dj')) ||
                        (group !== 2 && group2CountryValue.includes('dj')) ||
                        (group !== 3 && group3CountryValue.includes('dj')) ||
                        (group !== 4 && group4CountryValue.includes('dj')) ||
                        (group !== 5 && group5CountryValue.includes('dj')) ||
                        (group !== 6 && group6CountryValue.includes('dj')) ||
                        (group !== 7 && group7CountryValue.includes('dj')) ||
                        (group !== 8 && group8CountryValue.includes('dj')))
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
                    group === 1 ? group1CountryValue.includes('cd') : 
                    group === 2 ? group2CountryValue.includes('cd') : 
                    group === 3 ? group3CountryValue.includes('cd') : 
                    group === 4 ? group4CountryValue.includes('cd') :
                    group === 5 ? group5CountryValue.includes('cd') :
                    group === 6 ? group6CountryValue.includes('cd') :
                    group === 7 ? group7CountryValue.includes('cd') :
                    group8CountryValue.includes('cd')
                }                            
                disabled={
                        selectedOption.includes('cd') &&
                        ((group !== 1 && group1CountryValue.includes('cd')) ||
                        (group !== 2 && group2CountryValue.includes('cd')) ||
                        (group !== 3 && group3CountryValue.includes('cd')) ||
                        (group !== 4 && group4CountryValue.includes('cd')) ||
                        (group !== 5 && group5CountryValue.includes('cd')) ||
                        (group !== 6 && group6CountryValue.includes('cd')) ||
                        (group !== 7 && group7CountryValue.includes('cd')) ||
                        (group !== 8 && group8CountryValue.includes('cd')))
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
                    group === 1 ? group1CountryValue.includes('eg') : 
                    group === 2 ? group2CountryValue.includes('eg') : 
                    group === 3 ? group3CountryValue.includes('eg') : 
                    group === 4 ? group4CountryValue.includes('eg') :
                    group === 5 ? group5CountryValue.includes('eg') :
                    group === 6 ? group6CountryValue.includes('eg') :
                    group === 7 ? group7CountryValue.includes('eg') :
                    group8CountryValue.includes('eg')
                }                            
                disabled={
                        selectedOption.includes('eg') &&
                        ((group !== 1 && group1CountryValue.includes('eg')) ||
                        (group !== 2 && group2CountryValue.includes('eg')) ||
                        (group !== 3 && group3CountryValue.includes('eg')) ||
                        (group !== 4 && group4CountryValue.includes('eg')) ||
                        (group !== 5 && group5CountryValue.includes('eg')) ||
                        (group !== 6 && group6CountryValue.includes('eg')) ||
                        (group !== 7 && group7CountryValue.includes('eg')) ||
                        (group !== 8 && group8CountryValue.includes('eg')))
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
                    group === 1 ? group1CountryValue.includes('gq') : 
                    group === 2 ? group2CountryValue.includes('gq') : 
                    group === 3 ? group3CountryValue.includes('gq') : 
                    group === 4 ? group4CountryValue.includes('gq') :
                    group === 5 ? group5CountryValue.includes('gq') :
                    group === 6 ? group6CountryValue.includes('gq') :
                    group === 7 ? group7CountryValue.includes('gq') :
                    group8CountryValue.includes('gq')
                }                            
                disabled={
                        selectedOption.includes('gq') &&
                        ((group !== 1 && group1CountryValue.includes('gq')) ||
                        (group !== 2 && group2CountryValue.includes('gq')) ||
                        (group !== 3 && group3CountryValue.includes('gq')) ||
                        (group !== 4 && group4CountryValue.includes('gq')) ||
                        (group !== 5 && group5CountryValue.includes('gq')) ||
                        (group !== 6 && group6CountryValue.includes('gq')) ||
                        (group !== 7 && group7CountryValue.includes('gq')) ||
                        (group !== 8 && group8CountryValue.includes('gq')))
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
                    group === 1 ? group1CountryValue.includes('er') : 
                    group === 2 ? group2CountryValue.includes('er') : 
                    group === 3 ? group3CountryValue.includes('er') : 
                    group === 4 ? group4CountryValue.includes('er') :
                    group === 5 ? group5CountryValue.includes('er') :
                    group === 6 ? group6CountryValue.includes('er') :
                    group === 7 ? group7CountryValue.includes('er') :
                    group8CountryValue.includes('er')
                }                            
                disabled={
                        selectedOption.includes('er') &&
                        ((group !== 1 && group1CountryValue.includes('er')) ||
                        (group !== 2 && group2CountryValue.includes('er')) ||
                        (group !== 3 && group3CountryValue.includes('er')) ||
                        (group !== 4 && group4CountryValue.includes('er')) ||
                        (group !== 5 && group5CountryValue.includes('er')) ||
                        (group !== 6 && group6CountryValue.includes('er')) ||
                        (group !== 7 && group7CountryValue.includes('er')) ||
                        (group !== 8 && group8CountryValue.includes('er')))
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
                    group === 1 ? group1CountryValue.includes('sz') : 
                    group === 2 ? group2CountryValue.includes('sz') : 
                    group === 3 ? group3CountryValue.includes('sz') : 
                    group === 4 ? group4CountryValue.includes('sz') :
                    group === 5 ? group5CountryValue.includes('sz') :
                    group === 6 ? group6CountryValue.includes('sz') :
                    group === 7 ? group7CountryValue.includes('sz') :
                    group8CountryValue.includes('sz')
                }                            
                disabled={
                        selectedOption.includes('sz') &&
                        ((group !== 1 && group1CountryValue.includes('sz')) ||
                        (group !== 2 && group2CountryValue.includes('sz')) ||
                        (group !== 3 && group3CountryValue.includes('sz')) ||
                        (group !== 4 && group4CountryValue.includes('sz')) ||
                        (group !== 5 && group5CountryValue.includes('sz')) ||
                        (group !== 6 && group6CountryValue.includes('sz')) ||
                        (group !== 7 && group7CountryValue.includes('sz')) ||
                        (group !== 8 && group8CountryValue.includes('sz')))
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
                    group === 1 ? group1CountryValue.includes('et') : 
                    group === 2 ? group2CountryValue.includes('et') : 
                    group === 3 ? group3CountryValue.includes('et') : 
                    group === 4 ? group4CountryValue.includes('et') :
                    group === 5 ? group5CountryValue.includes('et') :
                    group === 6 ? group6CountryValue.includes('et') :
                    group === 7 ? group7CountryValue.includes('et') :
                    group8CountryValue.includes('et')
                }                            
                disabled={
                        selectedOption.includes('et') &&
                        ((group !== 1 && group1CountryValue.includes('et')) ||
                        (group !== 2 && group2CountryValue.includes('et')) ||
                        (group !== 3 && group3CountryValue.includes('et')) ||
                        (group !== 4 && group4CountryValue.includes('et')) ||
                        (group !== 5 && group5CountryValue.includes('et')) ||
                        (group !== 6 && group6CountryValue.includes('et')) ||
                        (group !== 7 && group7CountryValue.includes('et')) ||
                        (group !== 8 && group8CountryValue.includes('et')))
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
                    group === 1 ? group1CountryValue.includes('ga') : 
                    group === 2 ? group2CountryValue.includes('ga') : 
                    group === 3 ? group3CountryValue.includes('ga') : 
                    group === 4 ? group4CountryValue.includes('ga') :
                    group === 5 ? group5CountryValue.includes('ga') :
                    group === 6 ? group6CountryValue.includes('ga') :
                    group === 7 ? group7CountryValue.includes('ga') :
                    group8CountryValue.includes('ga')
                }                            
                disabled={
                        selectedOption.includes('ga') &&
                        ((group !== 1 && group1CountryValue.includes('ga')) ||
                        (group !== 2 && group2CountryValue.includes('ga')) ||
                        (group !== 3 && group3CountryValue.includes('ga')) ||
                        (group !== 4 && group4CountryValue.includes('ga')) ||
                        (group !== 5 && group5CountryValue.includes('ga')) ||
                        (group !== 6 && group6CountryValue.includes('ga')) ||
                        (group !== 7 && group7CountryValue.includes('ga')) ||
                        (group !== 8 && group8CountryValue.includes('ga')))
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
                    group === 1 ? group1CountryValue.includes('gm') : 
                    group === 2 ? group2CountryValue.includes('gm') : 
                    group === 3 ? group3CountryValue.includes('gm') : 
                    group === 4 ? group4CountryValue.includes('gm') :
                    group === 5 ? group5CountryValue.includes('gm') :
                    group === 6 ? group6CountryValue.includes('gm') :
                    group === 7 ? group7CountryValue.includes('gm') :
                    group8CountryValue.includes('gm')
                }                            
                disabled={
                        selectedOption.includes('gm') &&
                        ((group !== 1 && group1CountryValue.includes('gm')) ||
                        (group !== 2 && group2CountryValue.includes('gm')) ||
                        (group !== 3 && group3CountryValue.includes('gm')) ||
                        (group !== 4 && group4CountryValue.includes('gm')) ||
                        (group !== 5 && group5CountryValue.includes('gm')) ||
                        (group !== 6 && group6CountryValue.includes('gm')) ||
                        (group !== 7 && group7CountryValue.includes('gm')) ||
                        (group !== 8 && group8CountryValue.includes('gm')))
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
                    group === 1 ? group1CountryValue.includes('gh') : 
                    group === 2 ? group2CountryValue.includes('gh') : 
                    group === 3 ? group3CountryValue.includes('gh') : 
                    group === 4 ? group4CountryValue.includes('gh') :
                    group === 5 ? group5CountryValue.includes('gh') :
                    group === 6 ? group6CountryValue.includes('gh') :
                    group === 7 ? group7CountryValue.includes('gh') :
                    group8CountryValue.includes('gh')
                }                            
                disabled={
                        selectedOption.includes('gh') &&
                        ((group !== 1 && group1CountryValue.includes('gh')) ||
                        (group !== 2 && group2CountryValue.includes('gh')) ||
                        (group !== 3 && group3CountryValue.includes('gh')) ||
                        (group !== 4 && group4CountryValue.includes('gh')) ||
                        (group !== 5 && group5CountryValue.includes('gh')) ||
                        (group !== 6 && group6CountryValue.includes('gh')) ||
                        (group !== 7 && group7CountryValue.includes('gh')) ||
                        (group !== 8 && group8CountryValue.includes('gh')))
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
                    group === 1 ? group1CountryValue.includes('gn') : 
                    group === 2 ? group2CountryValue.includes('gn') : 
                    group === 3 ? group3CountryValue.includes('gn') : 
                    group === 4 ? group4CountryValue.includes('gn') :
                    group === 5 ? group5CountryValue.includes('gn') :
                    group === 6 ? group6CountryValue.includes('gn') :
                    group === 7 ? group7CountryValue.includes('gn') :
                    group8CountryValue.includes('gn')
                }                            
                disabled={
                        selectedOption.includes('gn') &&
                        ((group !== 1 && group1CountryValue.includes('gn')) ||
                        (group !== 2 && group2CountryValue.includes('gn')) ||
                        (group !== 3 && group3CountryValue.includes('gn')) ||
                        (group !== 4 && group4CountryValue.includes('gn')) ||
                        (group !== 5 && group5CountryValue.includes('gn')) ||
                        (group !== 6 && group6CountryValue.includes('gn')) ||
                        (group !== 7 && group7CountryValue.includes('gn')) ||
                        (group !== 8 && group8CountryValue.includes('gn')))
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
                    group === 1 ? group1CountryValue.includes('gw') : 
                    group === 2 ? group2CountryValue.includes('gw') : 
                    group === 3 ? group3CountryValue.includes('gw') : 
                    group === 4 ? group4CountryValue.includes('gw') :
                    group === 5 ? group5CountryValue.includes('gw') :
                    group === 6 ? group6CountryValue.includes('gw') :
                    group === 7 ? group7CountryValue.includes('gw') :
                    group8CountryValue.includes('gw')
                }                            
                disabled={
                        selectedOption.includes('gw') &&
                        ((group !== 1 && group1CountryValue.includes('gw')) ||
                        (group !== 2 && group2CountryValue.includes('gw')) ||
                        (group !== 3 && group3CountryValue.includes('gw')) ||
                        (group !== 4 && group4CountryValue.includes('gw')) ||
                        (group !== 5 && group5CountryValue.includes('gw')) ||
                        (group !== 6 && group6CountryValue.includes('gw')) ||
                        (group !== 7 && group7CountryValue.includes('gw')) ||
                        (group !== 8 && group8CountryValue.includes('gw')))
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
                    group === 1 ? group1CountryValue.includes('ke') : 
                    group === 2 ? group2CountryValue.includes('ke') : 
                    group === 3 ? group3CountryValue.includes('ke') : 
                    group === 4 ? group4CountryValue.includes('ke') :
                    group === 5 ? group5CountryValue.includes('ke') :
                    group === 6 ? group6CountryValue.includes('ke') :
                    group === 7 ? group7CountryValue.includes('ke') :
                    group8CountryValue.includes('ke')
                }                            
                disabled={
                        selectedOption.includes('ke') &&
                        ((group !== 1 && group1CountryValue.includes('ke')) ||
                        (group !== 2 && group2CountryValue.includes('ke')) ||
                        (group !== 3 && group3CountryValue.includes('ke')) ||
                        (group !== 4 && group4CountryValue.includes('ke')) ||
                        (group !== 5 && group5CountryValue.includes('ke')) ||
                        (group !== 6 && group6CountryValue.includes('ke')) ||
                        (group !== 7 && group7CountryValue.includes('ke')) ||
                        (group !== 8 && group8CountryValue.includes('ke')))
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
                    group === 1 ? group1CountryValue.includes('ls') : 
                    group === 2 ? group2CountryValue.includes('ls') : 
                    group === 3 ? group3CountryValue.includes('ls') : 
                    group === 4 ? group4CountryValue.includes('ls') :
                    group === 5 ? group5CountryValue.includes('ls') :
                    group === 6 ? group6CountryValue.includes('ls') :
                    group === 7 ? group7CountryValue.includes('ls') :
                    group8CountryValue.includes('ls')
                }                            
                disabled={
                        selectedOption.includes('ls') &&
                        ((group !== 1 && group1CountryValue.includes('ls')) ||
                        (group !== 2 && group2CountryValue.includes('ls')) ||
                        (group !== 3 && group3CountryValue.includes('ls')) ||
                        (group !== 4 && group4CountryValue.includes('ls')) ||
                        (group !== 5 && group5CountryValue.includes('ls')) ||
                        (group !== 6 && group6CountryValue.includes('ls')) ||
                        (group !== 7 && group7CountryValue.includes('ls')) ||
                        (group !== 8 && group8CountryValue.includes('ls')))
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
                    group === 1 ? group1CountryValue.includes('lr') : 
                    group === 2 ? group2CountryValue.includes('lr') : 
                    group === 3 ? group3CountryValue.includes('lr') : 
                    group === 4 ? group4CountryValue.includes('lr') :
                    group === 5 ? group5CountryValue.includes('lr') :
                    group === 6 ? group6CountryValue.includes('lr') :
                    group === 7 ? group7CountryValue.includes('lr') :
                    group8CountryValue.includes('lr')
                }                            
                disabled={
                        selectedOption.includes('lr') &&
                        ((group !== 1 && group1CountryValue.includes('lr')) ||
                        (group !== 2 && group2CountryValue.includes('lr')) ||
                        (group !== 3 && group3CountryValue.includes('lr')) ||
                        (group !== 4 && group4CountryValue.includes('lr')) ||
                        (group !== 5 && group5CountryValue.includes('lr')) ||
                        (group !== 6 && group6CountryValue.includes('lr')) ||
                        (group !== 7 && group7CountryValue.includes('lr')) ||
                        (group !== 8 && group8CountryValue.includes('lr')))
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
                    group === 1 ? group1CountryValue.includes('ly') : 
                    group === 2 ? group2CountryValue.includes('ly') : 
                    group === 3 ? group3CountryValue.includes('ly') : 
                    group === 4 ? group4CountryValue.includes('ly') :
                    group === 5 ? group5CountryValue.includes('ly') :
                    group === 6 ? group6CountryValue.includes('ly') :
                    group === 7 ? group7CountryValue.includes('ly') :
                    group8CountryValue.includes('ly')
                }                            
                disabled={
                        selectedOption.includes('ly') &&
                        ((group !== 1 && group1CountryValue.includes('ly')) ||
                        (group !== 2 && group2CountryValue.includes('ly')) ||
                        (group !== 3 && group3CountryValue.includes('ly')) ||
                        (group !== 4 && group4CountryValue.includes('ly')) ||
                        (group !== 5 && group5CountryValue.includes('ly')) ||
                        (group !== 6 && group6CountryValue.includes('ly')) ||
                        (group !== 7 && group7CountryValue.includes('ly')) ||
                        (group !== 8 && group8CountryValue.includes('ly')))
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
                    group === 1 ? group1CountryValue.includes('mg') : 
                    group === 2 ? group2CountryValue.includes('mg') : 
                    group === 3 ? group3CountryValue.includes('mg') : 
                    group === 4 ? group4CountryValue.includes('mg') :
                    group === 5 ? group5CountryValue.includes('mg') :
                    group === 6 ? group6CountryValue.includes('mg') :
                    group === 7 ? group7CountryValue.includes('mg') :
                    group8CountryValue.includes('mg')
                }                            
                disabled={
                        selectedOption.includes('mg') &&
                        ((group !== 1 && group1CountryValue.includes('mg')) ||
                        (group !== 2 && group2CountryValue.includes('mg')) ||
                        (group !== 3 && group3CountryValue.includes('mg')) ||
                        (group !== 4 && group4CountryValue.includes('mg')) ||
                        (group !== 5 && group5CountryValue.includes('mg')) ||
                        (group !== 6 && group6CountryValue.includes('mg')) ||
                        (group !== 7 && group7CountryValue.includes('mg')) ||
                        (group !== 8 && group8CountryValue.includes('mg')))
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
                    group === 1 ? group1CountryValue.includes('mw') : 
                    group === 2 ? group2CountryValue.includes('mw') : 
                    group === 3 ? group3CountryValue.includes('mw') : 
                    group === 4 ? group4CountryValue.includes('mw') :
                    group === 5 ? group5CountryValue.includes('mw') :
                    group === 6 ? group6CountryValue.includes('mw') :
                    group === 7 ? group7CountryValue.includes('mw') :
                    group8CountryValue.includes('mw')
                }                            
                disabled={
                        selectedOption.includes('mw') &&
                        ((group !== 1 && group1CountryValue.includes('mw')) ||
                        (group !== 2 && group2CountryValue.includes('mw')) ||
                        (group !== 3 && group3CountryValue.includes('mw')) ||
                        (group !== 4 && group4CountryValue.includes('mw')) ||
                        (group !== 5 && group5CountryValue.includes('mw')) ||
                        (group !== 6 && group6CountryValue.includes('mw')) ||
                        (group !== 7 && group7CountryValue.includes('mw')) ||
                        (group !== 8 && group8CountryValue.includes('mw')))
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
                    group === 1 ? group1CountryValue.includes('ml') : 
                    group === 2 ? group2CountryValue.includes('ml') : 
                    group === 3 ? group3CountryValue.includes('ml') : 
                    group === 4 ? group4CountryValue.includes('ml') :
                    group === 5 ? group5CountryValue.includes('ml') :
                    group === 6 ? group6CountryValue.includes('ml') :
                    group === 7 ? group7CountryValue.includes('ml') :
                    group8CountryValue.includes('ml')
                }                            
                disabled={
                        selectedOption.includes('ml') &&
                        ((group !== 1 && group1CountryValue.includes('ml')) ||
                        (group !== 2 && group2CountryValue.includes('ml')) ||
                        (group !== 3 && group3CountryValue.includes('ml')) ||
                        (group !== 4 && group4CountryValue.includes('ml')) ||
                        (group !== 5 && group5CountryValue.includes('ml')) ||
                        (group !== 6 && group6CountryValue.includes('ml')) ||
                        (group !== 7 && group7CountryValue.includes('ml')) ||
                        (group !== 8 && group8CountryValue.includes('ml')))
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
                    group === 1 ? group1CountryValue.includes('mr') : 
                    group === 2 ? group2CountryValue.includes('mr') : 
                    group === 3 ? group3CountryValue.includes('mr') : 
                    group === 4 ? group4CountryValue.includes('mr') :
                    group === 5 ? group5CountryValue.includes('mr') :
                    group === 6 ? group6CountryValue.includes('mr') :
                    group === 7 ? group7CountryValue.includes('mr') :
                    group8CountryValue.includes('mr')
                }                            
                disabled={
                        selectedOption.includes('mr') &&
                        ((group !== 1 && group1CountryValue.includes('mr')) ||
                        (group !== 2 && group2CountryValue.includes('mr')) ||
                        (group !== 3 && group3CountryValue.includes('mr')) ||
                        (group !== 4 && group4CountryValue.includes('mr')) ||
                        (group !== 5 && group5CountryValue.includes('mr')) ||
                        (group !== 6 && group6CountryValue.includes('mr')) ||
                        (group !== 7 && group7CountryValue.includes('mr')) ||
                        (group !== 8 && group8CountryValue.includes('mr')))
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
                    group === 1 ? group1CountryValue.includes('mu') : 
                    group === 2 ? group2CountryValue.includes('mu') : 
                    group === 3 ? group3CountryValue.includes('mu') : 
                    group === 4 ? group4CountryValue.includes('mu') :
                    group === 5 ? group5CountryValue.includes('mu') :
                    group === 6 ? group6CountryValue.includes('mu') :
                    group === 7 ? group7CountryValue.includes('mu') :
                    group8CountryValue.includes('mu')
                }                            
                disabled={
                        selectedOption.includes('mu') &&
                        ((group !== 1 && group1CountryValue.includes('mu')) ||
                        (group !== 2 && group2CountryValue.includes('mu')) ||
                        (group !== 3 && group3CountryValue.includes('mu')) ||
                        (group !== 4 && group4CountryValue.includes('mu')) ||
                        (group !== 5 && group5CountryValue.includes('mu')) ||
                        (group !== 6 && group6CountryValue.includes('mu')) ||
                        (group !== 7 && group7CountryValue.includes('mu')) ||
                        (group !== 8 && group8CountryValue.includes('mu')))
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
                    group === 1 ? group1CountryValue.includes('ma') : 
                    group === 2 ? group2CountryValue.includes('ma') : 
                    group === 3 ? group3CountryValue.includes('ma') : 
                    group === 4 ? group4CountryValue.includes('ma') :
                    group === 5 ? group5CountryValue.includes('ma') :
                    group === 6 ? group6CountryValue.includes('ma') :
                    group === 7 ? group7CountryValue.includes('ma') :
                    group8CountryValue.includes('ma')
                }                            
                disabled={
                        selectedOption.includes('ma') &&
                        ((group !== 1 && group1CountryValue.includes('ma')) ||
                        (group !== 2 && group2CountryValue.includes('ma')) ||
                        (group !== 3 && group3CountryValue.includes('ma')) ||
                        (group !== 4 && group4CountryValue.includes('ma')) ||
                        (group !== 5 && group5CountryValue.includes('ma')) ||
                        (group !== 6 && group6CountryValue.includes('ma')) ||
                        (group !== 7 && group7CountryValue.includes('ma')) ||
                        (group !== 8 && group8CountryValue.includes('ma')))
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
                    group === 1 ? group1CountryValue.includes('mz') : 
                    group === 2 ? group2CountryValue.includes('mz') : 
                    group === 3 ? group3CountryValue.includes('mz') : 
                    group === 4 ? group4CountryValue.includes('mz') :
                    group === 5 ? group5CountryValue.includes('mz') :
                    group === 6 ? group6CountryValue.includes('mz') :
                    group === 7 ? group7CountryValue.includes('mz') :
                    group8CountryValue.includes('mz')
                }                            
                disabled={
                        selectedOption.includes('mz') &&
                        ((group !== 1 && group1CountryValue.includes('mz')) ||
                        (group !== 2 && group2CountryValue.includes('mz')) ||
                        (group !== 3 && group3CountryValue.includes('mz')) ||
                        (group !== 4 && group4CountryValue.includes('mz')) ||
                        (group !== 5 && group5CountryValue.includes('mz')) ||
                        (group !== 6 && group6CountryValue.includes('mz')) ||
                        (group !== 7 && group7CountryValue.includes('mz')) ||
                        (group !== 8 && group8CountryValue.includes('mz')))
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
                    group === 1 ? group1CountryValue.includes('na') : 
                    group === 2 ? group2CountryValue.includes('na') : 
                    group === 3 ? group3CountryValue.includes('na') : 
                    group === 4 ? group4CountryValue.includes('na') :
                    group === 5 ? group5CountryValue.includes('na') :
                    group === 6 ? group6CountryValue.includes('na') :
                    group === 7 ? group7CountryValue.includes('na') :
                    group8CountryValue.includes('na')
                }                            
                disabled={
                        selectedOption.includes('na') &&
                        ((group !== 1 && group1CountryValue.includes('na')) ||
                        (group !== 2 && group2CountryValue.includes('na')) ||
                        (group !== 3 && group3CountryValue.includes('na')) ||
                        (group !== 4 && group4CountryValue.includes('na')) ||
                        (group !== 5 && group5CountryValue.includes('na')) ||
                        (group !== 6 && group6CountryValue.includes('na')) ||
                        (group !== 7 && group7CountryValue.includes('na')) ||
                        (group !== 8 && group8CountryValue.includes('na')))
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
                    group === 1 ? group1CountryValue.includes('ne') : 
                    group === 2 ? group2CountryValue.includes('ne') : 
                    group === 3 ? group3CountryValue.includes('ne') : 
                    group === 4 ? group4CountryValue.includes('ne') :
                    group === 5 ? group5CountryValue.includes('ne') :
                    group === 6 ? group6CountryValue.includes('ne') :
                    group === 7 ? group7CountryValue.includes('ne') :
                    group8CountryValue.includes('ne')
                }                            
                disabled={
                        selectedOption.includes('ne') &&
                        ((group !== 1 && group1CountryValue.includes('ne')) ||
                        (group !== 2 && group2CountryValue.includes('ne')) ||
                        (group !== 3 && group3CountryValue.includes('ne')) ||
                        (group !== 4 && group4CountryValue.includes('ne')) ||
                        (group !== 5 && group5CountryValue.includes('ne')) ||
                        (group !== 6 && group6CountryValue.includes('ne')) ||
                        (group !== 7 && group7CountryValue.includes('ne')) ||
                        (group !== 8 && group8CountryValue.includes('ne')))
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
                    group === 1 ? group1CountryValue.includes('ng') : 
                    group === 2 ? group2CountryValue.includes('ng') : 
                    group === 3 ? group3CountryValue.includes('ng') : 
                    group === 4 ? group4CountryValue.includes('ng') :
                    group === 5 ? group5CountryValue.includes('ng') :
                    group === 6 ? group6CountryValue.includes('ng') :
                    group === 7 ? group7CountryValue.includes('ng') :
                    group8CountryValue.includes('ng')
                }                            
                disabled={
                        selectedOption.includes('ng') &&
                        ((group !== 1 && group1CountryValue.includes('ng')) ||
                        (group !== 2 && group2CountryValue.includes('ng')) ||
                        (group !== 3 && group3CountryValue.includes('ng')) ||
                        (group !== 4 && group4CountryValue.includes('ng')) ||
                        (group !== 5 && group5CountryValue.includes('ng')) ||
                        (group !== 6 && group6CountryValue.includes('ng')) ||
                        (group !== 7 && group7CountryValue.includes('ng')) ||
                        (group !== 8 && group8CountryValue.includes('ng')))
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
                    group === 1 ? group1CountryValue.includes('rw') : 
                    group === 2 ? group2CountryValue.includes('rw') : 
                    group === 3 ? group3CountryValue.includes('rw') : 
                    group === 4 ? group4CountryValue.includes('rw') :
                    group === 5 ? group5CountryValue.includes('rw') :
                    group === 6 ? group6CountryValue.includes('rw') :
                    group === 7 ? group7CountryValue.includes('rw') :
                    group8CountryValue.includes('rw')
                }                            
                disabled={
                        selectedOption.includes('rw') &&
                        ((group !== 1 && group1CountryValue.includes('rw')) ||
                        (group !== 2 && group2CountryValue.includes('rw')) ||
                        (group !== 3 && group3CountryValue.includes('rw')) ||
                        (group !== 4 && group4CountryValue.includes('rw')) ||
                        (group !== 5 && group5CountryValue.includes('rw')) ||
                        (group !== 6 && group6CountryValue.includes('rw')) ||
                        (group !== 7 && group7CountryValue.includes('rw')) ||
                        (group !== 8 && group8CountryValue.includes('rw')))
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
                    group === 1 ? group1CountryValue.includes('st') : 
                    group === 2 ? group2CountryValue.includes('st') : 
                    group === 3 ? group3CountryValue.includes('st') : 
                    group === 4 ? group4CountryValue.includes('st') :
                    group === 5 ? group5CountryValue.includes('st') :
                    group === 6 ? group6CountryValue.includes('st') :
                    group === 7 ? group7CountryValue.includes('st') :
                    group8CountryValue.includes('st')
                }                            
                disabled={
                        selectedOption.includes('st') &&
                        ((group !== 1 && group1CountryValue.includes('st')) ||
                        (group !== 2 && group2CountryValue.includes('st')) ||
                        (group !== 3 && group3CountryValue.includes('st')) ||
                        (group !== 4 && group4CountryValue.includes('st')) ||
                        (group !== 5 && group5CountryValue.includes('st')) ||
                        (group !== 6 && group6CountryValue.includes('st')) ||
                        (group !== 7 && group7CountryValue.includes('st')) ||
                        (group !== 8 && group8CountryValue.includes('st')))
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
                    group === 1 ? group1CountryValue.includes('sn') : 
                    group === 2 ? group2CountryValue.includes('sn') : 
                    group === 3 ? group3CountryValue.includes('sn') : 
                    group === 4 ? group4CountryValue.includes('sn') :
                    group === 5 ? group5CountryValue.includes('sn') :
                    group === 6 ? group6CountryValue.includes('sn') :
                    group === 7 ? group7CountryValue.includes('sn') :
                    group8CountryValue.includes('sn')
                }                            
                disabled={
                        selectedOption.includes('sn') &&
                        ((group !== 1 && group1CountryValue.includes('sn')) ||
                        (group !== 2 && group2CountryValue.includes('sn')) ||
                        (group !== 3 && group3CountryValue.includes('sn')) ||
                        (group !== 4 && group4CountryValue.includes('sn')) ||
                        (group !== 5 && group5CountryValue.includes('sn')) ||
                        (group !== 6 && group6CountryValue.includes('sn')) ||
                        (group !== 7 && group7CountryValue.includes('sn')) ||
                        (group !== 8 && group8CountryValue.includes('sn')))
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
                    group === 1 ? group1CountryValue.includes('sc') : 
                    group === 2 ? group2CountryValue.includes('sc') : 
                    group === 3 ? group3CountryValue.includes('sc') : 
                    group === 4 ? group4CountryValue.includes('sc') :
                    group === 5 ? group5CountryValue.includes('sc') :
                    group === 6 ? group6CountryValue.includes('sc') :
                    group === 7 ? group7CountryValue.includes('sc') :
                    group8CountryValue.includes('sc')
                }                            
                disabled={
                        selectedOption.includes('sc') &&
                        ((group !== 1 && group1CountryValue.includes('sc')) ||
                        (group !== 2 && group2CountryValue.includes('sc')) ||
                        (group !== 3 && group3CountryValue.includes('sc')) ||
                        (group !== 4 && group4CountryValue.includes('sc')) ||
                        (group !== 5 && group5CountryValue.includes('sc')) ||
                        (group !== 6 && group6CountryValue.includes('sc')) ||
                        (group !== 7 && group7CountryValue.includes('sc')) ||
                        (group !== 8 && group8CountryValue.includes('sc')))
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
                    group === 1 ? group1CountryValue.includes('sl') : 
                    group === 2 ? group2CountryValue.includes('sl') : 
                    group === 3 ? group3CountryValue.includes('sl') : 
                    group === 4 ? group4CountryValue.includes('sl') :
                    group === 5 ? group5CountryValue.includes('sl') :
                    group === 6 ? group6CountryValue.includes('sl') :
                    group === 7 ? group7CountryValue.includes('sl') :
                    group8CountryValue.includes('sl')
                }                            
                disabled={
                        selectedOption.includes('sl') &&
                        ((group !== 1 && group1CountryValue.includes('sl')) ||
                        (group !== 2 && group2CountryValue.includes('sl')) ||
                        (group !== 3 && group3CountryValue.includes('sl')) ||
                        (group !== 4 && group4CountryValue.includes('sl')) ||
                        (group !== 5 && group5CountryValue.includes('sl')) ||
                        (group !== 6 && group6CountryValue.includes('sl')) ||
                        (group !== 7 && group7CountryValue.includes('sl')) ||
                        (group !== 8 && group8CountryValue.includes('sl')))
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
                    group === 1 ? group1CountryValue.includes('so') : 
                    group === 2 ? group2CountryValue.includes('so') : 
                    group === 3 ? group3CountryValue.includes('so') : 
                    group === 4 ? group4CountryValue.includes('so') :
                    group === 5 ? group5CountryValue.includes('so') :
                    group === 6 ? group6CountryValue.includes('so') :
                    group === 7 ? group7CountryValue.includes('so') :
                    group8CountryValue.includes('so')
                }                            
                disabled={
                        selectedOption.includes('so') &&
                        ((group !== 1 && group1CountryValue.includes('so')) ||
                        (group !== 2 && group2CountryValue.includes('so')) ||
                        (group !== 3 && group3CountryValue.includes('so')) ||
                        (group !== 4 && group4CountryValue.includes('so')) ||
                        (group !== 5 && group5CountryValue.includes('so')) ||
                        (group !== 6 && group6CountryValue.includes('so')) ||
                        (group !== 7 && group7CountryValue.includes('so')) ||
                        (group !== 8 && group8CountryValue.includes('so')))
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
                    group === 1 ? group1CountryValue.includes('za') : 
                    group === 2 ? group2CountryValue.includes('za') : 
                    group === 3 ? group3CountryValue.includes('za') : 
                    group === 4 ? group4CountryValue.includes('za') :
                    group === 5 ? group5CountryValue.includes('za') :
                    group === 6 ? group6CountryValue.includes('za') :
                    group === 7 ? group7CountryValue.includes('za') :
                    group8CountryValue.includes('za')
                }                            
                disabled={
                        selectedOption.includes('za') &&
                        ((group !== 1 && group1CountryValue.includes('za')) ||
                        (group !== 2 && group2CountryValue.includes('za')) ||
                        (group !== 3 && group3CountryValue.includes('za')) ||
                        (group !== 4 && group4CountryValue.includes('za')) ||
                        (group !== 5 && group5CountryValue.includes('za')) ||
                        (group !== 6 && group6CountryValue.includes('za')) ||
                        (group !== 7 && group7CountryValue.includes('za')) ||
                        (group !== 8 && group8CountryValue.includes('za')))
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
                    group === 1 ? group1CountryValue.includes('ss') : 
                    group === 2 ? group2CountryValue.includes('ss') : 
                    group === 3 ? group3CountryValue.includes('ss') : 
                    group === 4 ? group4CountryValue.includes('ss') :
                    group === 5 ? group5CountryValue.includes('ss') :
                    group === 6 ? group6CountryValue.includes('ss') :
                    group === 7 ? group7CountryValue.includes('ss') :
                    group8CountryValue.includes('ss')
                }                            
                disabled={
                        selectedOption.includes('ss') &&
                        ((group !== 1 && group1CountryValue.includes('ss')) ||
                        (group !== 2 && group2CountryValue.includes('ss')) ||
                        (group !== 3 && group3CountryValue.includes('ss')) ||
                        (group !== 4 && group4CountryValue.includes('ss')) ||
                        (group !== 5 && group5CountryValue.includes('ss')) ||
                        (group !== 6 && group6CountryValue.includes('ss')) ||
                        (group !== 7 && group7CountryValue.includes('ss')) ||
                        (group !== 8 && group8CountryValue.includes('ss')))
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
                    group === 1 ? group1CountryValue.includes('sd') : 
                    group === 2 ? group2CountryValue.includes('sd') : 
                    group === 3 ? group3CountryValue.includes('sd') : 
                    group === 4 ? group4CountryValue.includes('sd') :
                    group === 5 ? group5CountryValue.includes('sd') :
                    group === 6 ? group6CountryValue.includes('sd') :
                    group === 7 ? group7CountryValue.includes('sd') :
                    group8CountryValue.includes('sd')
                }                            
                disabled={
                        selectedOption.includes('sd') &&
                        ((group !== 1 && group1CountryValue.includes('sd')) ||
                        (group !== 2 && group2CountryValue.includes('sd')) ||
                        (group !== 3 && group3CountryValue.includes('sd')) ||
                        (group !== 4 && group4CountryValue.includes('sd')) ||
                        (group !== 5 && group5CountryValue.includes('sd')) ||
                        (group !== 6 && group6CountryValue.includes('sd')) ||
                        (group !== 7 && group7CountryValue.includes('sd')) ||
                        (group !== 8 && group8CountryValue.includes('sd')))
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
                    group === 1 ? group1CountryValue.includes('tz') : 
                    group === 2 ? group2CountryValue.includes('tz') : 
                    group === 3 ? group3CountryValue.includes('tz') : 
                    group === 4 ? group4CountryValue.includes('tz') :
                    group === 5 ? group5CountryValue.includes('tz') :
                    group === 6 ? group6CountryValue.includes('tz') :
                    group === 7 ? group7CountryValue.includes('tz') :
                    group8CountryValue.includes('tz')
                }                            
                disabled={
                        selectedOption.includes('tz') &&
                        ((group !== 1 && group1CountryValue.includes('tz')) ||
                        (group !== 2 && group2CountryValue.includes('tz')) ||
                        (group !== 3 && group3CountryValue.includes('tz')) ||
                        (group !== 4 && group4CountryValue.includes('tz')) ||
                        (group !== 5 && group5CountryValue.includes('tz')) ||
                        (group !== 6 && group6CountryValue.includes('tz')) ||
                        (group !== 7 && group7CountryValue.includes('tz')) ||
                        (group !== 8 && group8CountryValue.includes('tz')))
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
                    group === 1 ? group1CountryValue.includes('tg') : 
                    group === 2 ? group2CountryValue.includes('tg') : 
                    group === 3 ? group3CountryValue.includes('tg') : 
                    group === 4 ? group4CountryValue.includes('tg') :
                    group === 5 ? group5CountryValue.includes('tg') :
                    group === 6 ? group6CountryValue.includes('tg') :
                    group === 7 ? group7CountryValue.includes('tg') :
                    group8CountryValue.includes('tg')
                }                            
                disabled={
                        selectedOption.includes('tg') &&
                        ((group !== 1 && group1CountryValue.includes('tg')) ||
                        (group !== 2 && group2CountryValue.includes('tg')) ||
                        (group !== 3 && group3CountryValue.includes('tg')) ||
                        (group !== 4 && group4CountryValue.includes('tg')) ||
                        (group !== 5 && group5CountryValue.includes('tg')) ||
                        (group !== 6 && group6CountryValue.includes('tg')) ||
                        (group !== 7 && group7CountryValue.includes('tg')) ||
                        (group !== 8 && group8CountryValue.includes('tg')))
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
                    group === 1 ? group1CountryValue.includes('tn') : 
                    group === 2 ? group2CountryValue.includes('tn') : 
                    group === 3 ? group3CountryValue.includes('tn') : 
                    group === 4 ? group4CountryValue.includes('tn') :
                    group === 5 ? group5CountryValue.includes('tn') :
                    group === 6 ? group6CountryValue.includes('tn') :
                    group === 7 ? group7CountryValue.includes('tn') :
                    group8CountryValue.includes('tn')
                }                            
                disabled={
                        selectedOption.includes('tn') &&
                        ((group !== 1 && group1CountryValue.includes('tn')) ||
                        (group !== 2 && group2CountryValue.includes('tn')) ||
                        (group !== 3 && group3CountryValue.includes('tn')) ||
                        (group !== 4 && group4CountryValue.includes('tn')) ||
                        (group !== 5 && group5CountryValue.includes('tn')) ||
                        (group !== 6 && group6CountryValue.includes('tn')) ||
                        (group !== 7 && group7CountryValue.includes('tn')) ||
                        (group !== 8 && group8CountryValue.includes('tn')))
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
                    group === 1 ? group1CountryValue.includes('ug') : 
                    group === 2 ? group2CountryValue.includes('ug') : 
                    group === 3 ? group3CountryValue.includes('ug') : 
                    group === 4 ? group4CountryValue.includes('ug') :
                    group === 5 ? group5CountryValue.includes('ug') :
                    group === 6 ? group6CountryValue.includes('ug') :
                    group === 7 ? group7CountryValue.includes('ug') :
                    group8CountryValue.includes('ug')
                }                            
                disabled={
                        selectedOption.includes('ug') &&
                        ((group !== 1 && group1CountryValue.includes('ug')) ||
                        (group !== 2 && group2CountryValue.includes('ug')) ||
                        (group !== 3 && group3CountryValue.includes('ug')) ||
                        (group !== 4 && group4CountryValue.includes('ug')) ||
                        (group !== 5 && group5CountryValue.includes('ug')) ||
                        (group !== 6 && group6CountryValue.includes('ug')) ||
                        (group !== 7 && group7CountryValue.includes('ug')) ||
                        (group !== 8 && group8CountryValue.includes('ug')))
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
                    group === 1 ? group1CountryValue.includes('zm') : 
                    group === 2 ? group2CountryValue.includes('zm') : 
                    group === 3 ? group3CountryValue.includes('zm') : 
                    group === 4 ? group4CountryValue.includes('zm') :
                    group === 5 ? group5CountryValue.includes('zm') :
                    group === 6 ? group6CountryValue.includes('zm') :
                    group === 7 ? group7CountryValue.includes('zm') :
                    group8CountryValue.includes('zm')
                }                            
                disabled={
                        selectedOption.includes('zm') &&
                        ((group !== 1 && group1CountryValue.includes('zm')) ||
                        (group !== 2 && group2CountryValue.includes('zm')) ||
                        (group !== 3 && group3CountryValue.includes('zm')) ||
                        (group !== 4 && group4CountryValue.includes('zm')) ||
                        (group !== 5 && group5CountryValue.includes('zm')) ||
                        (group !== 6 && group6CountryValue.includes('zm')) ||
                        (group !== 7 && group7CountryValue.includes('zm')) ||
                        (group !== 8 && group8CountryValue.includes('zm')))
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
                    group === 1 ? group1CountryValue.includes('zw') : 
                    group === 2 ? group2CountryValue.includes('zw') : 
                    group === 3 ? group3CountryValue.includes('zw') : 
                    group === 4 ? group4CountryValue.includes('zw') :
                    group === 5 ? group5CountryValue.includes('zw') :
                    group === 6 ? group6CountryValue.includes('zw') :
                    group === 7 ? group7CountryValue.includes('zw') :
                    group8CountryValue.includes('zw')
                }                            
                disabled={
                        selectedOption.includes('zw') &&
                        ((group !== 1 && group1CountryValue.includes('zw')) ||
                        (group !== 2 && group2CountryValue.includes('zw')) ||
                        (group !== 3 && group3CountryValue.includes('zw')) ||
                        (group !== 4 && group4CountryValue.includes('zw')) ||
                        (group !== 5 && group5CountryValue.includes('zw')) ||
                        (group !== 6 && group6CountryValue.includes('zw')) ||
                        (group !== 7 && group7CountryValue.includes('zw')) ||
                        (group !== 8 && group8CountryValue.includes('zw')))
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
                        group === 1 ? group1CountryValue.includes('af') : 
                        group === 2 ? group2CountryValue.includes('af') : 
                        group === 3 ? group3CountryValue.includes('af') : 
                        group === 4 ? group4CountryValue.includes('af') :
                        group === 5 ? group5CountryValue.includes('af') :
                        group === 6 ? group6CountryValue.includes('af') :
                        group === 7 ? group7CountryValue.includes('af') :
                        group8CountryValue.includes('af')
                    }                            
                    disabled={
                        selectedOption.includes('dz') &&
                        ((group !== 1 && group1CountryValue.includes('dz')) ||
                        (group !== 2 && group2CountryValue.includes('dz')) ||
                        (group !== 3 && group3CountryValue.includes('dz')) ||
                        (group !== 4 && group4CountryValue.includes('dz')) ||
                        (group !== 5 && group5CountryValue.includes('dz')) ||
                        (group !== 6 && group6CountryValue.includes('dz')) ||
                        (group !== 7 && group7CountryValue.includes('dz')) ||
                        (group !== 8 && group8CountryValue.includes('dz')))
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
                        group === 1 ? group1CountryValue.includes('am') : 
                        group === 2 ? group2CountryValue.includes('am') : 
                        group === 3 ? group3CountryValue.includes('am') : 
                        group === 4 ? group4CountryValue.includes('am') :
                        group === 5 ? group5CountryValue.includes('am') :
                        group === 6 ? group6CountryValue.includes('am') :
                        group === 7 ? group7CountryValue.includes('am') :
                        group8CountryValue.includes('am')
                    }                            
                    disabled={
                        selectedOption.includes('am') &&
                        ((group !== 1 && group1CountryValue.includes('am')) ||
                        (group !== 2 && group2CountryValue.includes('am')) ||
                        (group !== 3 && group3CountryValue.includes('am')) ||
                        (group !== 4 && group4CountryValue.includes('am')) ||
                        (group !== 5 && group5CountryValue.includes('am')) ||
                        (group !== 6 && group6CountryValue.includes('am')) ||
                        (group !== 7 && group7CountryValue.includes('am')) ||
                        (group !== 8 && group8CountryValue.includes('am')))
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
                        group === 1 ? group1CountryValue.includes('az') : 
                        group === 2 ? group2CountryValue.includes('az') : 
                        group === 3 ? group3CountryValue.includes('az') : 
                        group === 4 ? group4CountryValue.includes('az') :
                        group === 5 ? group5CountryValue.includes('az') :
                        group === 6 ? group6CountryValue.includes('az') :
                        group === 7 ? group7CountryValue.includes('az') :
                        group8CountryValue.includes('az')
                    }                            
                    disabled={
                        selectedOption.includes('az') &&
                        ((group !== 1 && group1CountryValue.includes('az')) ||
                        (group !== 2 && group2CountryValue.includes('az')) ||
                        (group !== 3 && group3CountryValue.includes('az')) ||
                        (group !== 4 && group4CountryValue.includes('az')) ||
                        (group !== 5 && group5CountryValue.includes('az')) ||
                        (group !== 6 && group6CountryValue.includes('az')) ||
                        (group !== 7 && group7CountryValue.includes('az')) ||
                        (group !== 8 && group8CountryValue.includes('az')))
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
                        group === 1 ? group1CountryValue.includes('bh') : 
                        group === 2 ? group2CountryValue.includes('bh') : 
                        group === 3 ? group3CountryValue.includes('bh') : 
                        group === 4 ? group4CountryValue.includes('bh') :
                        group === 5 ? group5CountryValue.includes('bh') :
                        group === 6 ? group6CountryValue.includes('bh') :
                        group === 7 ? group7CountryValue.includes('bh') :
                        group8CountryValue.includes('bh')
                    }                            
                    disabled={
                        selectedOption.includes('bh') &&
                        ((group !== 1 && group1CountryValue.includes('bh')) ||
                        (group !== 2 && group2CountryValue.includes('bh')) ||
                        (group !== 3 && group3CountryValue.includes('bh')) ||
                        (group !== 4 && group4CountryValue.includes('bh')) ||
                        (group !== 5 && group5CountryValue.includes('bh')) ||
                        (group !== 6 && group6CountryValue.includes('bh')) ||
                        (group !== 7 && group7CountryValue.includes('bh')) ||
                        (group !== 8 && group8CountryValue.includes('bh')))
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
                        group === 1 ? group1CountryValue.includes('bd') : 
                        group === 2 ? group2CountryValue.includes('bd') : 
                        group === 3 ? group3CountryValue.includes('bd') : 
                        group === 4 ? group4CountryValue.includes('bd') :
                        group === 5 ? group5CountryValue.includes('bd') :
                        group === 6 ? group6CountryValue.includes('bd') :
                        group === 7 ? group7CountryValue.includes('bd') :
                        group8CountryValue.includes('bd')
                    }                            
                    disabled={
                        selectedOption.includes('bd') &&
                        ((group !== 1 && group1CountryValue.includes('bd')) ||
                        (group !== 2 && group2CountryValue.includes('bd')) ||
                        (group !== 3 && group3CountryValue.includes('bd')) ||
                        (group !== 4 && group4CountryValue.includes('bd')) ||
                        (group !== 5 && group5CountryValue.includes('bd')) ||
                        (group !== 6 && group6CountryValue.includes('bd')) ||
                        (group !== 7 && group7CountryValue.includes('bd')) ||
                        (group !== 8 && group8CountryValue.includes('bd')))
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
                        group === 1 ? group1CountryValue.includes('bt') : 
                        group === 2 ? group2CountryValue.includes('bt') : 
                        group === 3 ? group3CountryValue.includes('bt') : 
                        group === 4 ? group4CountryValue.includes('bt') :
                        group === 5 ? group5CountryValue.includes('bt') :
                        group === 6 ? group6CountryValue.includes('bt') :
                        group === 7 ? group7CountryValue.includes('bt') :
                        group8CountryValue.includes('bt')
                    }                            
                    disabled={
                        selectedOption.includes('bt') &&
                        ((group !== 1 && group1CountryValue.includes('bt')) ||
                        (group !== 2 && group2CountryValue.includes('bt')) ||
                        (group !== 3 && group3CountryValue.includes('bt')) ||
                        (group !== 4 && group4CountryValue.includes('bt')) ||
                        (group !== 5 && group5CountryValue.includes('bt')) ||
                        (group !== 6 && group6CountryValue.includes('bt')) ||
                        (group !== 7 && group7CountryValue.includes('bt')) ||
                        (group !== 8 && group8CountryValue.includes('bt')))
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
                    group === 1 ? group1CountryValue.includes('bn') : 
                    group === 2 ? group2CountryValue.includes('bn') : 
                    group === 3 ? group3CountryValue.includes('bn') : 
                    group === 4 ? group4CountryValue.includes('bn') :
                    group === 5 ? group5CountryValue.includes('bn') :
                    group === 6 ? group6CountryValue.includes('bn') :
                    group === 7 ? group7CountryValue.includes('bn') :
                    group8CountryValue.includes('bn')
                }                            
                disabled={
                        selectedOption.includes('bn') &&
                        ((group !== 1 && group1CountryValue.includes('bn')) ||
                        (group !== 2 && group2CountryValue.includes('bn')) ||
                        (group !== 3 && group3CountryValue.includes('bn')) ||
                        (group !== 4 && group4CountryValue.includes('bn')) ||
                        (group !== 5 && group5CountryValue.includes('bn')) ||
                        (group !== 6 && group6CountryValue.includes('bn')) ||
                        (group !== 7 && group7CountryValue.includes('bn')) ||
                        (group !== 8 && group8CountryValue.includes('bn')))
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
                    group === 1 ? group1CountryValue.includes('kh') : 
                    group === 2 ? group2CountryValue.includes('kh') : 
                    group === 3 ? group3CountryValue.includes('kh') : 
                    group === 4 ? group4CountryValue.includes('kh') :
                    group === 5 ? group5CountryValue.includes('kh') :
                    group === 6 ? group6CountryValue.includes('kh') :
                    group === 7 ? group7CountryValue.includes('kh') :
                    group8CountryValue.includes('kh')
                }                            
                disabled={
                        selectedOption.includes('kh') &&
                        ((group !== 1 && group1CountryValue.includes('kh')) ||
                        (group !== 2 && group2CountryValue.includes('kh')) ||
                        (group !== 3 && group3CountryValue.includes('kh')) ||
                        (group !== 4 && group4CountryValue.includes('kh')) ||
                        (group !== 5 && group5CountryValue.includes('kh')) ||
                        (group !== 6 && group6CountryValue.includes('kh')) ||
                        (group !== 7 && group7CountryValue.includes('kh')) ||
                        (group !== 8 && group8CountryValue.includes('kh')))
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
                    group === 1 ? group1CountryValue.includes('cn') : 
                    group === 2 ? group2CountryValue.includes('cn') : 
                    group === 3 ? group3CountryValue.includes('cn') : 
                    group === 4 ? group4CountryValue.includes('cn') :
                    group === 5 ? group5CountryValue.includes('cn') :
                    group === 6 ? group6CountryValue.includes('cn') :
                    group === 7 ? group7CountryValue.includes('cn') :
                    group8CountryValue.includes('cn')
                }                            
                disabled={
                        selectedOption.includes('cn') &&
                        ((group !== 1 && group1CountryValue.includes('cn')) ||
                        (group !== 2 && group2CountryValue.includes('cn')) ||
                        (group !== 3 && group3CountryValue.includes('cn')) ||
                        (group !== 4 && group4CountryValue.includes('cn')) ||
                        (group !== 5 && group5CountryValue.includes('cn')) ||
                        (group !== 6 && group6CountryValue.includes('cn')) ||
                        (group !== 7 && group7CountryValue.includes('cn')) ||
                        (group !== 8 && group8CountryValue.includes('cn')))
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
                    group === 1 ? group1CountryValue.includes('cy') : 
                    group === 2 ? group2CountryValue.includes('cy') : 
                    group === 3 ? group3CountryValue.includes('cy') : 
                    group === 4 ? group4CountryValue.includes('cy') :
                    group === 5 ? group5CountryValue.includes('cy') :
                    group === 6 ? group6CountryValue.includes('cy') :
                    group === 7 ? group7CountryValue.includes('cy') :
                    group8CountryValue.includes('cy')
                }                            
                disabled={
                        selectedOption.includes('cy') &&
                        ((group !== 1 && group1CountryValue.includes('cy')) ||
                        (group !== 2 && group2CountryValue.includes('cy')) ||
                        (group !== 3 && group3CountryValue.includes('cy')) ||
                        (group !== 4 && group4CountryValue.includes('cy')) ||
                        (group !== 5 && group5CountryValue.includes('cy')) ||
                        (group !== 6 && group6CountryValue.includes('cy')) ||
                        (group !== 7 && group7CountryValue.includes('cy')) ||
                        (group !== 8 && group8CountryValue.includes('cy')))
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
                    group === 1 ? group1CountryValue.includes('ge') : 
                    group === 2 ? group2CountryValue.includes('ge') : 
                    group === 3 ? group3CountryValue.includes('ge') : 
                    group === 4 ? group4CountryValue.includes('ge') :
                    group === 5 ? group5CountryValue.includes('ge') :
                    group === 6 ? group6CountryValue.includes('ge') :
                    group === 7 ? group7CountryValue.includes('ge') :
                    group8CountryValue.includes('ge')
                }                            
                disabled={
                        selectedOption.includes('ge') &&
                        ((group !== 1 && group1CountryValue.includes('ge')) ||
                        (group !== 2 && group2CountryValue.includes('ge')) ||
                        (group !== 3 && group3CountryValue.includes('ge')) ||
                        (group !== 4 && group4CountryValue.includes('ge')) ||
                        (group !== 5 && group5CountryValue.includes('ge')) ||
                        (group !== 6 && group6CountryValue.includes('ge')) ||
                        (group !== 7 && group7CountryValue.includes('ge')) ||
                        (group !== 8 && group8CountryValue.includes('ge')))
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
                    group === 1 ? group1CountryValue.includes('in') : 
                    group === 2 ? group2CountryValue.includes('in') : 
                    group === 3 ? group3CountryValue.includes('in') : 
                    group === 4 ? group4CountryValue.includes('in') :
                    group === 5 ? group5CountryValue.includes('in') :
                    group === 6 ? group6CountryValue.includes('in') :
                    group === 7 ? group7CountryValue.includes('in') :
                    group8CountryValue.includes('in')
                }                            
                disabled={
                        selectedOption.includes('in') &&
                        ((group !== 1 && group1CountryValue.includes('in')) ||
                        (group !== 2 && group2CountryValue.includes('in')) ||
                        (group !== 3 && group3CountryValue.includes('in')) ||
                        (group !== 4 && group4CountryValue.includes('in')) ||
                        (group !== 5 && group5CountryValue.includes('in')) ||
                        (group !== 6 && group6CountryValue.includes('in')) ||
                        (group !== 7 && group7CountryValue.includes('in')) ||
                        (group !== 8 && group8CountryValue.includes('in')))
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
                    group === 1 ? group1CountryValue.includes('id') : 
                    group === 2 ? group2CountryValue.includes('id') : 
                    group === 3 ? group3CountryValue.includes('id') : 
                    group === 4 ? group4CountryValue.includes('id') :
                    group === 5 ? group5CountryValue.includes('id') :
                    group === 6 ? group6CountryValue.includes('id') :
                    group === 7 ? group7CountryValue.includes('id') :
                    group8CountryValue.includes('id')
                }                            
                disabled={
                        selectedOption.includes('id') &&
                        ((group !== 1 && group1CountryValue.includes('id')) ||
                        (group !== 2 && group2CountryValue.includes('id')) ||
                        (group !== 3 && group3CountryValue.includes('id')) ||
                        (group !== 4 && group4CountryValue.includes('id')) ||
                        (group !== 5 && group5CountryValue.includes('id')) ||
                        (group !== 6 && group6CountryValue.includes('id')) ||
                        (group !== 7 && group7CountryValue.includes('id')) ||
                        (group !== 8 && group8CountryValue.includes('id')))
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
                    group === 1 ? group1CountryValue.includes('ir') : 
                    group === 2 ? group2CountryValue.includes('ir') : 
                    group === 3 ? group3CountryValue.includes('ir') : 
                    group === 4 ? group4CountryValue.includes('ir') :
                    group === 5 ? group5CountryValue.includes('ir') :
                    group === 6 ? group6CountryValue.includes('ir') :
                    group === 7 ? group7CountryValue.includes('ir') :
                    group8CountryValue.includes('ir')
                }                            
                disabled={
                        selectedOption.includes('ir') &&
                        ((group !== 1 && group1CountryValue.includes('ir')) ||
                        (group !== 2 && group2CountryValue.includes('ir')) ||
                        (group !== 3 && group3CountryValue.includes('ir')) ||
                        (group !== 4 && group4CountryValue.includes('ir')) ||
                        (group !== 5 && group5CountryValue.includes('ir')) ||
                        (group !== 6 && group6CountryValue.includes('ir')) ||
                        (group !== 7 && group7CountryValue.includes('ir')) ||
                        (group !== 8 && group8CountryValue.includes('ir')))
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
                    group === 1 ? group1CountryValue.includes('iq') : 
                    group === 2 ? group2CountryValue.includes('iq') : 
                    group === 3 ? group3CountryValue.includes('iq') : 
                    group === 4 ? group4CountryValue.includes('iq') :
                    group === 5 ? group5CountryValue.includes('iq') :
                    group === 6 ? group6CountryValue.includes('iq') :
                    group === 7 ? group7CountryValue.includes('iq') :
                    group8CountryValue.includes('iq')
                }                            
                disabled={
                        selectedOption.includes('iq') &&
                        ((group !== 1 && group1CountryValue.includes('iq')) ||
                        (group !== 2 && group2CountryValue.includes('iq')) ||
                        (group !== 3 && group3CountryValue.includes('iq')) ||
                        (group !== 4 && group4CountryValue.includes('iq')) ||
                        (group !== 5 && group5CountryValue.includes('iq')) ||
                        (group !== 6 && group6CountryValue.includes('iq')) ||
                        (group !== 7 && group7CountryValue.includes('iq')) ||
                        (group !== 8 && group8CountryValue.includes('iq')))
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
                    group === 1 ? group1CountryValue.includes('il') : 
                    group === 2 ? group2CountryValue.includes('il') : 
                    group === 3 ? group3CountryValue.includes('il') : 
                    group === 4 ? group4CountryValue.includes('il') :
                    group === 5 ? group5CountryValue.includes('il') :
                    group === 6 ? group6CountryValue.includes('il') :
                    group === 7 ? group7CountryValue.includes('il') :
                    group8CountryValue.includes('il')
                }                            
                disabled={
                        selectedOption.includes('il') &&
                        ((group !== 1 && group1CountryValue.includes('il')) ||
                        (group !== 2 && group2CountryValue.includes('il')) ||
                        (group !== 3 && group3CountryValue.includes('il')) ||
                        (group !== 4 && group4CountryValue.includes('il')) ||
                        (group !== 5 && group5CountryValue.includes('il')) ||
                        (group !== 6 && group6CountryValue.includes('il')) ||
                        (group !== 7 && group7CountryValue.includes('il')) ||
                        (group !== 8 && group8CountryValue.includes('il')))
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
                    group === 1 ? group1CountryValue.includes('jp') : 
                    group === 2 ? group2CountryValue.includes('jp') : 
                    group === 3 ? group3CountryValue.includes('jp') : 
                    group === 4 ? group4CountryValue.includes('jp') :
                    group === 5 ? group5CountryValue.includes('jp') :
                    group === 6 ? group6CountryValue.includes('jp') :
                    group === 7 ? group7CountryValue.includes('jp') :
                    group8CountryValue.includes('jp')
                }                            
                disabled={
                        selectedOption.includes('jp') &&
                        ((group !== 1 && group1CountryValue.includes('jp')) ||
                        (group !== 2 && group2CountryValue.includes('jp')) ||
                        (group !== 3 && group3CountryValue.includes('jp')) ||
                        (group !== 4 && group4CountryValue.includes('jp')) ||
                        (group !== 5 && group5CountryValue.includes('jp')) ||
                        (group !== 6 && group6CountryValue.includes('jp')) ||
                        (group !== 7 && group7CountryValue.includes('jp')) ||
                        (group !== 8 && group8CountryValue.includes('jp')))
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
                    group === 1 ? group1CountryValue.includes('jo') : 
                    group === 2 ? group2CountryValue.includes('jo') : 
                    group === 3 ? group3CountryValue.includes('jo') : 
                    group === 4 ? group4CountryValue.includes('jo') :
                    group === 5 ? group5CountryValue.includes('jo') :
                    group === 6 ? group6CountryValue.includes('jo') :
                    group === 7 ? group7CountryValue.includes('jo') :
                    group8CountryValue.includes('jo')
                }                            
                disabled={
                        selectedOption.includes('jo') &&
                        ((group !== 1 && group1CountryValue.includes('jo')) ||
                        (group !== 2 && group2CountryValue.includes('jo')) ||
                        (group !== 3 && group3CountryValue.includes('jo')) ||
                        (group !== 4 && group4CountryValue.includes('jo')) ||
                        (group !== 5 && group5CountryValue.includes('jo')) ||
                        (group !== 6 && group6CountryValue.includes('jo')) ||
                        (group !== 7 && group7CountryValue.includes('jo')) ||
                        (group !== 8 && group8CountryValue.includes('jo')))
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
                    group === 1 ? group1CountryValue.includes('kz') : 
                    group === 2 ? group2CountryValue.includes('kz') : 
                    group === 3 ? group3CountryValue.includes('kz') : 
                    group === 4 ? group4CountryValue.includes('kz') :
                    group === 5 ? group5CountryValue.includes('kz') :
                    group === 6 ? group6CountryValue.includes('kz') :
                    group === 7 ? group7CountryValue.includes('kz') :
                    group8CountryValue.includes('kz')
                }                            
                disabled={
                        selectedOption.includes('kz') &&
                        ((group !== 1 && group1CountryValue.includes('kz')) ||
                        (group !== 2 && group2CountryValue.includes('kz')) ||
                        (group !== 3 && group3CountryValue.includes('kz')) ||
                        (group !== 4 && group4CountryValue.includes('kz')) ||
                        (group !== 5 && group5CountryValue.includes('kz')) ||
                        (group !== 6 && group6CountryValue.includes('kz')) ||
                        (group !== 7 && group7CountryValue.includes('kz')) ||
                        (group !== 8 && group8CountryValue.includes('kz')))
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
                    group === 1 ? group1CountryValue.includes('kw') : 
                    group === 2 ? group2CountryValue.includes('kw') : 
                    group === 3 ? group3CountryValue.includes('kw') : 
                    group === 4 ? group4CountryValue.includes('kw') :
                    group === 5 ? group5CountryValue.includes('kw') :
                    group === 6 ? group6CountryValue.includes('kw') :
                    group === 7 ? group7CountryValue.includes('kw') :
                    group8CountryValue.includes('kw')
                }                            
                disabled={
                        selectedOption.includes('kw') &&
                        ((group !== 1 && group1CountryValue.includes('kw')) ||
                        (group !== 2 && group2CountryValue.includes('kw')) ||
                        (group !== 3 && group3CountryValue.includes('kw')) ||
                        (group !== 4 && group4CountryValue.includes('kw')) ||
                        (group !== 5 && group5CountryValue.includes('kw')) ||
                        (group !== 6 && group6CountryValue.includes('kw')) ||
                        (group !== 7 && group7CountryValue.includes('kw')) ||
                        (group !== 8 && group8CountryValue.includes('kw')))
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
                    group === 1 ? group1CountryValue.includes('kg') : 
                    group === 2 ? group2CountryValue.includes('kg') : 
                    group === 3 ? group3CountryValue.includes('kg') : 
                    group === 4 ? group4CountryValue.includes('kg') :
                    group === 5 ? group5CountryValue.includes('kg') :
                    group === 6 ? group6CountryValue.includes('kg') :
                    group === 7 ? group7CountryValue.includes('kg') :
                    group8CountryValue.includes('kg')
                }                            
                disabled={
                        selectedOption.includes('kg') &&
                        ((group !== 1 && group1CountryValue.includes('kg')) ||
                        (group !== 2 && group2CountryValue.includes('kg')) ||
                        (group !== 3 && group3CountryValue.includes('kg')) ||
                        (group !== 4 && group4CountryValue.includes('kg')) ||
                        (group !== 5 && group5CountryValue.includes('kg')) ||
                        (group !== 6 && group6CountryValue.includes('kg')) ||
                        (group !== 7 && group7CountryValue.includes('kg')) ||
                        (group !== 8 && group8CountryValue.includes('kg')))
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
                    group === 1 ? group1CountryValue.includes('la') : 
                    group === 2 ? group2CountryValue.includes('la') : 
                    group === 3 ? group3CountryValue.includes('la') : 
                    group === 4 ? group4CountryValue.includes('la') :
                    group === 5 ? group5CountryValue.includes('la') :
                    group === 6 ? group6CountryValue.includes('la') :
                    group === 7 ? group7CountryValue.includes('la') :
                    group8CountryValue.includes('la')
                }                            
                disabled={
                        selectedOption.includes('la') &&
                        ((group !== 1 && group1CountryValue.includes('la')) ||
                        (group !== 2 && group2CountryValue.includes('la')) ||
                        (group !== 3 && group3CountryValue.includes('la')) ||
                        (group !== 4 && group4CountryValue.includes('la')) ||
                        (group !== 5 && group5CountryValue.includes('la')) ||
                        (group !== 6 && group6CountryValue.includes('la')) ||
                        (group !== 7 && group7CountryValue.includes('la')) ||
                        (group !== 8 && group8CountryValue.includes('la')))
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
                    group === 1 ? group1CountryValue.includes('lb') : 
                    group === 2 ? group2CountryValue.includes('lb') : 
                    group === 3 ? group3CountryValue.includes('lb') : 
                    group === 4 ? group4CountryValue.includes('lb') :
                    group === 5 ? group5CountryValue.includes('lb') :
                    group === 6 ? group6CountryValue.includes('lb') :
                    group === 7 ? group7CountryValue.includes('lb') :
                    group8CountryValue.includes('lb')
                }                            
                disabled={
                        selectedOption.includes('lb') &&
                        ((group !== 1 && group1CountryValue.includes('lb')) ||
                        (group !== 2 && group2CountryValue.includes('lb')) ||
                        (group !== 3 && group3CountryValue.includes('lb')) ||
                        (group !== 4 && group4CountryValue.includes('lb')) ||
                        (group !== 5 && group5CountryValue.includes('lb')) ||
                        (group !== 6 && group6CountryValue.includes('lb')) ||
                        (group !== 7 && group7CountryValue.includes('lb')) ||
                        (group !== 8 && group8CountryValue.includes('lb')))
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
                    group === 1 ? group1CountryValue.includes('my') : 
                    group === 2 ? group2CountryValue.includes('my') : 
                    group === 3 ? group3CountryValue.includes('my') : 
                    group === 4 ? group4CountryValue.includes('my') :
                    group === 5 ? group5CountryValue.includes('my') :
                    group === 6 ? group6CountryValue.includes('my') :
                    group === 7 ? group7CountryValue.includes('my') :
                    group8CountryValue.includes('my')
                }                            
                disabled={
                        selectedOption.includes('my') &&
                        ((group !== 1 && group1CountryValue.includes('my')) ||
                        (group !== 2 && group2CountryValue.includes('my')) ||
                        (group !== 3 && group3CountryValue.includes('my')) ||
                        (group !== 4 && group4CountryValue.includes('my')) ||
                        (group !== 5 && group5CountryValue.includes('my')) ||
                        (group !== 6 && group6CountryValue.includes('my')) ||
                        (group !== 7 && group7CountryValue.includes('my')) ||
                        (group !== 8 && group8CountryValue.includes('my')))
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
                    group === 1 ? group1CountryValue.includes('mv') : 
                    group === 2 ? group2CountryValue.includes('mv') : 
                    group === 3 ? group3CountryValue.includes('mv') : 
                    group === 4 ? group4CountryValue.includes('mv') :
                    group === 5 ? group5CountryValue.includes('mv') :
                    group === 6 ? group6CountryValue.includes('mv') :
                    group === 7 ? group7CountryValue.includes('mv') :
                    group8CountryValue.includes('mv')
                }                            
                disabled={
                        selectedOption.includes('mv') &&
                        ((group !== 1 && group1CountryValue.includes('mv')) ||
                        (group !== 2 && group2CountryValue.includes('mv')) ||
                        (group !== 3 && group3CountryValue.includes('mv')) ||
                        (group !== 4 && group4CountryValue.includes('mv')) ||
                        (group !== 5 && group5CountryValue.includes('mv')) ||
                        (group !== 6 && group6CountryValue.includes('mv')) ||
                        (group !== 7 && group7CountryValue.includes('mv')) ||
                        (group !== 8 && group8CountryValue.includes('mv')))
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
                    group === 1 ? group1CountryValue.includes('mn') : 
                    group === 2 ? group2CountryValue.includes('mn') : 
                    group === 3 ? group3CountryValue.includes('mn') : 
                    group === 4 ? group4CountryValue.includes('mn') :
                    group === 5 ? group5CountryValue.includes('mn') :
                    group === 6 ? group6CountryValue.includes('mn') :
                    group === 7 ? group7CountryValue.includes('mn') :
                    group8CountryValue.includes('mn')
                }                            
                disabled={
                        selectedOption.includes('mn') &&
                        ((group !== 1 && group1CountryValue.includes('mn')) ||
                        (group !== 2 && group2CountryValue.includes('mn')) ||
                        (group !== 3 && group3CountryValue.includes('mn')) ||
                        (group !== 4 && group4CountryValue.includes('mn')) ||
                        (group !== 5 && group5CountryValue.includes('mn')) ||
                        (group !== 6 && group6CountryValue.includes('mn')) ||
                        (group !== 7 && group7CountryValue.includes('mn')) ||
                        (group !== 8 && group8CountryValue.includes('mn')))
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
                    group === 1 ? group1CountryValue.includes('mm') : 
                    group === 2 ? group2CountryValue.includes('mm') : 
                    group === 3 ? group3CountryValue.includes('mm') : 
                    group === 4 ? group4CountryValue.includes('mm') :
                    group === 5 ? group5CountryValue.includes('mm') :
                    group === 6 ? group6CountryValue.includes('mm') :
                    group === 7 ? group7CountryValue.includes('mm') :
                    group8CountryValue.includes('mm')
                }                            
                disabled={
                        selectedOption.includes('mm') &&
                        ((group !== 1 && group1CountryValue.includes('mm')) ||
                        (group !== 2 && group2CountryValue.includes('mm')) ||
                        (group !== 3 && group3CountryValue.includes('mm')) ||
                        (group !== 4 && group4CountryValue.includes('mm')) ||
                        (group !== 5 && group5CountryValue.includes('mm')) ||
                        (group !== 6 && group6CountryValue.includes('mm')) ||
                        (group !== 7 && group7CountryValue.includes('mm')) ||
                        (group !== 8 && group8CountryValue.includes('mm')))
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
                    group === 1 ? group1CountryValue.includes('np') : 
                    group === 2 ? group2CountryValue.includes('np') : 
                    group === 3 ? group3CountryValue.includes('np') : 
                    group === 4 ? group4CountryValue.includes('np') :
                    group === 5 ? group5CountryValue.includes('np') :
                    group === 6 ? group6CountryValue.includes('np') :
                    group === 7 ? group7CountryValue.includes('np') :
                    group8CountryValue.includes('np')
                }                            
                disabled={
                        selectedOption.includes('np') &&
                        ((group !== 1 && group1CountryValue.includes('np')) ||
                        (group !== 2 && group2CountryValue.includes('np')) ||
                        (group !== 3 && group3CountryValue.includes('np')) ||
                        (group !== 4 && group4CountryValue.includes('np')) ||
                        (group !== 5 && group5CountryValue.includes('np')) ||
                        (group !== 6 && group6CountryValue.includes('np')) ||
                        (group !== 7 && group7CountryValue.includes('np')) ||
                        (group !== 8 && group8CountryValue.includes('np')))
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
                    group === 1 ? group1CountryValue.includes('kp') : 
                    group === 2 ? group2CountryValue.includes('kp') : 
                    group === 3 ? group3CountryValue.includes('kp') : 
                    group === 4 ? group4CountryValue.includes('kp') :
                    group === 5 ? group5CountryValue.includes('kp') :
                    group === 6 ? group6CountryValue.includes('kp') :
                    group === 7 ? group7CountryValue.includes('kp') :
                    group8CountryValue.includes('kp')
                }                            
                disabled={
                        selectedOption.includes('kp') &&
                        ((group !== 1 && group1CountryValue.includes('kp')) ||
                        (group !== 2 && group2CountryValue.includes('kp')) ||
                        (group !== 3 && group3CountryValue.includes('kp')) ||
                        (group !== 4 && group4CountryValue.includes('kp')) ||
                        (group !== 5 && group5CountryValue.includes('kp')) ||
                        (group !== 6 && group6CountryValue.includes('kp')) ||
                        (group !== 7 && group7CountryValue.includes('kp')) ||
                        (group !== 8 && group8CountryValue.includes('kp')))
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
                    group === 1 ? group1CountryValue.includes('om') : 
                    group === 2 ? group2CountryValue.includes('om') : 
                    group === 3 ? group3CountryValue.includes('om') : 
                    group === 4 ? group4CountryValue.includes('om') :
                    group === 5 ? group5CountryValue.includes('om') :
                    group === 6 ? group6CountryValue.includes('om') :
                    group === 7 ? group7CountryValue.includes('om') :
                    group8CountryValue.includes('om')
                }                            
                disabled={
                        selectedOption.includes('om') &&
                        ((group !== 1 && group1CountryValue.includes('om')) ||
                        (group !== 2 && group2CountryValue.includes('om')) ||
                        (group !== 3 && group3CountryValue.includes('om')) ||
                        (group !== 4 && group4CountryValue.includes('om')) ||
                        (group !== 5 && group5CountryValue.includes('om')) ||
                        (group !== 6 && group6CountryValue.includes('om')) ||
                        (group !== 7 && group7CountryValue.includes('om')) ||
                        (group !== 8 && group8CountryValue.includes('om')))
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
                    group === 1 ? group1CountryValue.includes('pk') : 
                    group === 2 ? group2CountryValue.includes('pk') : 
                    group === 3 ? group3CountryValue.includes('pk') : 
                    group === 4 ? group4CountryValue.includes('pk') :
                    group === 5 ? group5CountryValue.includes('pk') :
                    group === 6 ? group6CountryValue.includes('pk') :
                    group === 7 ? group7CountryValue.includes('pk') :
                    group8CountryValue.includes('pk')
                }                            
                disabled={
                        selectedOption.includes('pk') &&
                        ((group !== 1 && group1CountryValue.includes('pk')) ||
                        (group !== 2 && group2CountryValue.includes('pk')) ||
                        (group !== 3 && group3CountryValue.includes('pk')) ||
                        (group !== 4 && group4CountryValue.includes('pk')) ||
                        (group !== 5 && group5CountryValue.includes('pk')) ||
                        (group !== 6 && group6CountryValue.includes('pk')) ||
                        (group !== 7 && group7CountryValue.includes('pk')) ||
                        (group !== 8 && group8CountryValue.includes('pk')))
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
                    group === 1 ? group1CountryValue.includes('ps') : 
                    group === 2 ? group2CountryValue.includes('ps') : 
                    group === 3 ? group3CountryValue.includes('ps') : 
                    group === 4 ? group4CountryValue.includes('ps') :
                    group === 5 ? group5CountryValue.includes('ps') :
                    group === 6 ? group6CountryValue.includes('ps') :
                    group === 7 ? group7CountryValue.includes('ps') :
                    group8CountryValue.includes('ps')    
                }                            
                disabled={
                        selectedOption.includes('ps') &&
                        ((group !== 1 && group1CountryValue.includes('ps')) ||
                        (group !== 2 && group2CountryValue.includes('ps')) ||
                        (group !== 3 && group3CountryValue.includes('ps')) ||
                        (group !== 4 && group4CountryValue.includes('ps')) ||
                        (group !== 5 && group5CountryValue.includes('ps')) ||
                        (group !== 6 && group6CountryValue.includes('ps')) ||
                        (group !== 7 && group7CountryValue.includes('ps')) ||
                        (group !== 8 && group8CountryValue.includes('ps')))
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
                    group === 1 ? group1CountryValue.includes('ph') : 
                    group === 2 ? group2CountryValue.includes('ph') : 
                    group === 3 ? group3CountryValue.includes('ph') : 
                    group === 4 ? group4CountryValue.includes('ph') :
                    group === 5 ? group5CountryValue.includes('ph') :
                    group === 6 ? group6CountryValue.includes('ph') :
                    group === 7 ? group7CountryValue.includes('ph') :
                    group8CountryValue.includes('ph')    
                }                            
                disabled={
                        selectedOption.includes('ph') &&
                        ((group !== 1 && group1CountryValue.includes('ph')) ||
                        (group !== 2 && group2CountryValue.includes('ph')) ||
                        (group !== 3 && group3CountryValue.includes('ph')) ||
                        (group !== 4 && group4CountryValue.includes('ph')) ||
                        (group !== 5 && group5CountryValue.includes('ph')) ||
                        (group !== 6 && group6CountryValue.includes('ph')) ||
                        (group !== 7 && group7CountryValue.includes('ph')) ||
                        (group !== 8 && group8CountryValue.includes('ph')))
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
                    group === 1 ? group1CountryValue.includes('qa') : 
                    group === 2 ? group2CountryValue.includes('qa') : 
                    group === 3 ? group3CountryValue.includes('qa') : 
                    group === 4 ? group4CountryValue.includes('qa') :
                    group === 5 ? group5CountryValue.includes('qa') :
                    group === 6 ? group6CountryValue.includes('qa') :
                    group === 7 ? group7CountryValue.includes('qa') :
                    group8CountryValue.includes('qa')    
                }                            
                disabled={
                        selectedOption.includes('qa') &&
                        ((group !== 1 && group1CountryValue.includes('qa')) ||
                        (group !== 2 && group2CountryValue.includes('qa')) ||
                        (group !== 3 && group3CountryValue.includes('qa')) ||
                        (group !== 4 && group4CountryValue.includes('qa')) ||
                        (group !== 5 && group5CountryValue.includes('qa')) ||
                        (group !== 6 && group6CountryValue.includes('qa')) ||
                        (group !== 7 && group7CountryValue.includes('qa')) ||
                        (group !== 8 && group8CountryValue.includes('qa')))
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
                    group === 1 ? group1CountryValue.includes('sa') : 
                    group === 2 ? group2CountryValue.includes('sa') : 
                    group === 3 ? group3CountryValue.includes('sa') : 
                    group === 4 ? group4CountryValue.includes('sa') :
                    group === 5 ? group5CountryValue.includes('sa') :
                    group === 6 ? group6CountryValue.includes('sa') :
                    group === 7 ? group7CountryValue.includes('sa') :
                    group8CountryValue.includes('sa')    
                }                            
                disabled={
                        selectedOption.includes('sa') &&
                        ((group !== 1 && group1CountryValue.includes('sa')) ||
                        (group !== 2 && group2CountryValue.includes('sa')) ||
                        (group !== 3 && group3CountryValue.includes('sa')) ||
                        (group !== 4 && group4CountryValue.includes('sa')) ||
                        (group !== 5 && group5CountryValue.includes('sa')) ||
                        (group !== 6 && group6CountryValue.includes('sa')) ||
                        (group !== 7 && group7CountryValue.includes('sa')) ||
                        (group !== 8 && group8CountryValue.includes('sa')))
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
                    group === 1 ? group1CountryValue.includes('sg') : 
                    group === 2 ? group2CountryValue.includes('sg') : 
                    group === 3 ? group3CountryValue.includes('sg') : 
                    group === 4 ? group4CountryValue.includes('sg') :
                    group === 5 ? group5CountryValue.includes('sg') :
                    group === 6 ? group6CountryValue.includes('sg') :
                    group === 7 ? group7CountryValue.includes('sg') :
                    group8CountryValue.includes('sg')    
                }                            
                disabled={
                        selectedOption.includes('sg') &&
                        ((group !== 1 && group1CountryValue.includes('sg')) ||
                        (group !== 2 && group2CountryValue.includes('sg')) ||
                        (group !== 3 && group3CountryValue.includes('sg')) ||
                        (group !== 4 && group4CountryValue.includes('sg')) ||
                        (group !== 5 && group5CountryValue.includes('sg')) ||
                        (group !== 6 && group6CountryValue.includes('sg')) ||
                        (group !== 7 && group7CountryValue.includes('sg')) ||
                        (group !== 8 && group8CountryValue.includes('sg')))
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
                    group === 1 ? group1CountryValue.includes('kr') : 
                    group === 2 ? group2CountryValue.includes('kr') : 
                    group === 3 ? group3CountryValue.includes('kr') : 
                    group === 4 ? group4CountryValue.includes('kr') :
                    group === 5 ? group5CountryValue.includes('kr') :
                    group === 6 ? group6CountryValue.includes('kr') :
                    group === 7 ? group7CountryValue.includes('kr') :
                    group8CountryValue.includes('kr')    
                }                            
                disabled={
                        selectedOption.includes('kr') &&
                        ((group !== 1 && group1CountryValue.includes('kr')) ||
                        (group !== 2 && group2CountryValue.includes('kr')) ||
                        (group !== 3 && group3CountryValue.includes('kr')) ||
                        (group !== 4 && group4CountryValue.includes('kr')) ||
                        (group !== 5 && group5CountryValue.includes('kr')) ||
                        (group !== 6 && group6CountryValue.includes('kr')) ||
                        (group !== 7 && group7CountryValue.includes('kr')) ||
                        (group !== 8 && group8CountryValue.includes('kr')))
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
                    group === 1 ? group1CountryValue.includes('lk') : 
                    group === 2 ? group2CountryValue.includes('lk') : 
                    group === 3 ? group3CountryValue.includes('lk') : 
                    group === 4 ? group4CountryValue.includes('lk') :
                    group === 5 ? group5CountryValue.includes('lk') :
                    group === 6 ? group6CountryValue.includes('lk') :
                    group === 7 ? group7CountryValue.includes('lk') :
                    group8CountryValue.includes('lk')    
                }                            
                disabled={
                        selectedOption.includes('lk') &&
                        ((group !== 1 && group1CountryValue.includes('lk')) ||
                        (group !== 2 && group2CountryValue.includes('lk')) ||
                        (group !== 3 && group3CountryValue.includes('lk')) ||
                        (group !== 4 && group4CountryValue.includes('lk')) ||
                        (group !== 5 && group5CountryValue.includes('lk')) ||
                        (group !== 6 && group6CountryValue.includes('lk')) ||
                        (group !== 7 && group7CountryValue.includes('lk')) ||
                        (group !== 8 && group8CountryValue.includes('lk')))
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
                    group === 1 ? group1CountryValue.includes('sy') : 
                    group === 2 ? group2CountryValue.includes('sy') : 
                    group === 3 ? group3CountryValue.includes('sy') : 
                    group === 4 ? group4CountryValue.includes('sy') :
                    group === 5 ? group5CountryValue.includes('sy') :
                    group === 6 ? group6CountryValue.includes('sy') :
                    group === 7 ? group7CountryValue.includes('sy') :
                    group8CountryValue.includes('sy')    
                }                            
                disabled={
                        selectedOption.includes('sy') &&
                        ((group !== 1 && group1CountryValue.includes('sy')) ||
                        (group !== 2 && group2CountryValue.includes('sy')) ||
                        (group !== 3 && group3CountryValue.includes('sy')) ||
                        (group !== 4 && group4CountryValue.includes('sy')) ||
                        (group !== 5 && group5CountryValue.includes('sy')) ||
                        (group !== 6 && group6CountryValue.includes('sy')) ||
                        (group !== 7 && group7CountryValue.includes('sy')) ||
                        (group !== 8 && group8CountryValue.includes('sy')))
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
                    group === 1 ? group1CountryValue.includes('tw') : 
                    group === 2 ? group2CountryValue.includes('tw') : 
                    group === 3 ? group3CountryValue.includes('tw') : 
                    group === 4 ? group4CountryValue.includes('tw') :
                    group === 5 ? group5CountryValue.includes('tw') :
                    group === 6 ? group6CountryValue.includes('tw') :
                    group === 7 ? group7CountryValue.includes('tw') :
                    group8CountryValue.includes('tw')    
                }                            
                disabled={
                        selectedOption.includes('tw') &&
                        ((group !== 1 && group1CountryValue.includes('tw')) ||
                        (group !== 2 && group2CountryValue.includes('tw')) ||
                        (group !== 3 && group3CountryValue.includes('tw')) ||
                        (group !== 4 && group4CountryValue.includes('tw')) ||
                        (group !== 5 && group5CountryValue.includes('tw')) ||
                        (group !== 6 && group6CountryValue.includes('tw')) ||
                        (group !== 7 && group7CountryValue.includes('tw')) ||
                        (group !== 8 && group8CountryValue.includes('tw')))
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
                    group === 1 ? group1CountryValue.includes('tj') : 
                    group === 2 ? group2CountryValue.includes('tj') : 
                    group === 3 ? group3CountryValue.includes('tj') : 
                    group === 4 ? group4CountryValue.includes('tj') :
                    group === 5 ? group5CountryValue.includes('tj') :
                    group === 6 ? group6CountryValue.includes('tj') :
                    group === 7 ? group7CountryValue.includes('tj') :
                    group8CountryValue.includes('tj')    
                }                            
                disabled={
                        selectedOption.includes('tj') &&
                        ((group !== 1 && group1CountryValue.includes('tj')) ||
                        (group !== 2 && group2CountryValue.includes('tj')) ||
                        (group !== 3 && group3CountryValue.includes('tj')) ||
                        (group !== 4 && group4CountryValue.includes('tj')) ||
                        (group !== 5 && group5CountryValue.includes('tj')) ||
                        (group !== 6 && group6CountryValue.includes('tj')) ||
                        (group !== 7 && group7CountryValue.includes('tj')) ||
                        (group !== 8 && group8CountryValue.includes('tj')))
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
                    group === 1 ? group1CountryValue.includes('th') : 
                    group === 2 ? group2CountryValue.includes('th') : 
                    group === 3 ? group3CountryValue.includes('th') : 
                    group === 4 ? group4CountryValue.includes('th') :
                    group === 5 ? group5CountryValue.includes('th') :
                    group === 6 ? group6CountryValue.includes('th') :
                    group === 7 ? group7CountryValue.includes('th') :
                    group8CountryValue.includes('th')    
                }                            
                disabled={
                        selectedOption.includes('th') &&
                        ((group !== 1 && group1CountryValue.includes('th')) ||
                        (group !== 2 && group2CountryValue.includes('th')) ||
                        (group !== 3 && group3CountryValue.includes('th')) ||
                        (group !== 4 && group4CountryValue.includes('th')) ||
                        (group !== 5 && group5CountryValue.includes('th')) ||
                        (group !== 6 && group6CountryValue.includes('th')) ||
                        (group !== 7 && group7CountryValue.includes('th')) ||
                        (group !== 8 && group8CountryValue.includes('th')))
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
                    group === 1 ? group1CountryValue.includes('tl') : 
                    group === 2 ? group2CountryValue.includes('tl') : 
                    group === 3 ? group3CountryValue.includes('tl') : 
                    group === 4 ? group4CountryValue.includes('tl') :
                    group === 5 ? group5CountryValue.includes('tl') :
                    group === 6 ? group6CountryValue.includes('tl') :
                    group === 7 ? group7CountryValue.includes('tl') :
                    group8CountryValue.includes('tl')    
                }                            
                disabled={
                        selectedOption.includes('tl') &&
                        ((group !== 1 && group1CountryValue.includes('tl')) ||
                        (group !== 2 && group2CountryValue.includes('tl')) ||
                        (group !== 3 && group3CountryValue.includes('tl')) ||
                        (group !== 4 && group4CountryValue.includes('tl')) ||
                        (group !== 5 && group5CountryValue.includes('tl')) ||
                        (group !== 6 && group6CountryValue.includes('tl')) ||
                        (group !== 7 && group7CountryValue.includes('tl')) ||
                        (group !== 8 && group8CountryValue.includes('tl')))
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
                    group === 1 ? group1CountryValue.includes('tr') : 
                    group === 2 ? group2CountryValue.includes('tr') : 
                    group === 3 ? group3CountryValue.includes('tr') : 
                    group === 4 ? group4CountryValue.includes('tr') :
                    group === 5 ? group5CountryValue.includes('tr') :
                    group === 6 ? group6CountryValue.includes('tr') :
                    group === 7 ? group7CountryValue.includes('tr') :
                    group8CountryValue.includes('tr')    
                }                            
                disabled={
                        selectedOption.includes('tr') &&
                        ((group !== 1 && group1CountryValue.includes('tr')) ||
                        (group !== 2 && group2CountryValue.includes('tr')) ||
                        (group !== 3 && group3CountryValue.includes('tr')) ||
                        (group !== 4 && group4CountryValue.includes('tr')) ||
                        (group !== 5 && group5CountryValue.includes('tr')) ||
                        (group !== 6 && group6CountryValue.includes('tr')) ||
                        (group !== 7 && group7CountryValue.includes('tr')) ||
                        (group !== 8 && group8CountryValue.includes('tr')))
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
                    group === 1 ? group1CountryValue.includes('tm') : 
                    group === 2 ? group2CountryValue.includes('tm') : 
                    group === 3 ? group3CountryValue.includes('tm') : 
                    group === 4 ? group4CountryValue.includes('tm') :
                    group === 5 ? group5CountryValue.includes('tm') :
                    group === 6 ? group6CountryValue.includes('tm') :
                    group === 7 ? group7CountryValue.includes('tm') :
                    group8CountryValue.includes('tm')    
                }                            
                disabled={
                        selectedOption.includes('tm') &&
                        ((group !== 1 && group1CountryValue.includes('tm')) ||
                        (group !== 2 && group2CountryValue.includes('tm')) ||
                        (group !== 3 && group3CountryValue.includes('tm')) ||
                        (group !== 4 && group4CountryValue.includes('tm')) ||
                        (group !== 5 && group5CountryValue.includes('tm')) ||
                        (group !== 6 && group6CountryValue.includes('tm')) ||
                        (group !== 7 && group7CountryValue.includes('tm')) ||
                        (group !== 8 && group8CountryValue.includes('tm')))
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
                    group === 1 ? group1CountryValue.includes('ae') : 
                    group === 2 ? group2CountryValue.includes('ae') : 
                    group === 3 ? group3CountryValue.includes('ae') : 
                    group === 4 ? group4CountryValue.includes('ae') :
                    group === 5 ? group5CountryValue.includes('ae') :
                    group === 6 ? group6CountryValue.includes('ae') :
                    group === 7 ? group7CountryValue.includes('ae') :
                    group8CountryValue.includes('ae')    
                }                            
                disabled={
                        selectedOption.includes('ae') &&
                        ((group !== 1 && group1CountryValue.includes('ae')) ||
                        (group !== 2 && group2CountryValue.includes('ae')) ||
                        (group !== 3 && group3CountryValue.includes('ae')) ||
                        (group !== 4 && group4CountryValue.includes('ae')) ||
                        (group !== 5 && group5CountryValue.includes('ae')) ||
                        (group !== 6 && group6CountryValue.includes('ae')) ||
                        (group !== 7 && group7CountryValue.includes('ae')) ||
                        (group !== 8 && group8CountryValue.includes('ae')))
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
                    group === 1 ? group1CountryValue.includes('uz') : 
                    group === 2 ? group2CountryValue.includes('uz') : 
                    group === 3 ? group3CountryValue.includes('uz') : 
                    group === 4 ? group4CountryValue.includes('uz') :
                    group === 5 ? group5CountryValue.includes('uz') :
                    group === 6 ? group6CountryValue.includes('uz') :
                    group === 7 ? group7CountryValue.includes('uz') :
                    group8CountryValue.includes('uz')    
                }                            
                disabled={
                        selectedOption.includes('uz') &&
                        ((group !== 1 && group1CountryValue.includes('uz')) ||
                        (group !== 2 && group2CountryValue.includes('uz')) ||
                        (group !== 3 && group3CountryValue.includes('uz')) ||
                        (group !== 4 && group4CountryValue.includes('uz')) ||
                        (group !== 5 && group5CountryValue.includes('uz')) ||
                        (group !== 6 && group6CountryValue.includes('uz')) ||
                        (group !== 7 && group7CountryValue.includes('uz')) ||
                        (group !== 8 && group8CountryValue.includes('uz')))
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
                    group === 1 ? group1CountryValue.includes('vn') : 
                    group === 2 ? group2CountryValue.includes('vn') : 
                    group === 3 ? group3CountryValue.includes('vn') : 
                    group === 4 ? group4CountryValue.includes('vn') :
                    group === 5 ? group5CountryValue.includes('vn') :
                    group === 6 ? group6CountryValue.includes('vn') :
                    group === 7 ? group7CountryValue.includes('vn') :
                    group8CountryValue.includes('vn')    
                }                            
                disabled={
                        selectedOption.includes('vn') &&
                        ((group !== 1 && group1CountryValue.includes('vn')) ||
                        (group !== 2 && group2CountryValue.includes('vn')) ||
                        (group !== 3 && group3CountryValue.includes('vn')) ||
                        (group !== 4 && group4CountryValue.includes('vn')) ||
                        (group !== 5 && group5CountryValue.includes('vn')) ||
                        (group !== 6 && group6CountryValue.includes('vn')) ||
                        (group !== 7 && group7CountryValue.includes('vn')) ||
                        (group !== 8 && group8CountryValue.includes('vn')))
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
                    group === 1 ? group1CountryValue.includes('ye') : 
                    group === 2 ? group2CountryValue.includes('ye') : 
                    group === 3 ? group3CountryValue.includes('ye') : 
                    group === 4 ? group4CountryValue.includes('ye') :
                    group === 5 ? group5CountryValue.includes('ye') :
                    group === 6 ? group6CountryValue.includes('ye') :
                    group === 7 ? group7CountryValue.includes('ye') :
                    group8CountryValue.includes('ye')    
                }                            
                disabled={
                        selectedOption.includes('ye') &&
                        ((group !== 1 && group1CountryValue.includes('ye')) ||
                        (group !== 2 && group2CountryValue.includes('ye')) ||
                        (group !== 3 && group3CountryValue.includes('ye')) ||
                        (group !== 4 && group4CountryValue.includes('ye')) ||
                        (group !== 5 && group5CountryValue.includes('ye')) ||
                        (group !== 6 && group6CountryValue.includes('ye')) ||
                        (group !== 7 && group7CountryValue.includes('ye')) ||
                        (group !== 8 && group8CountryValue.includes('ye')))
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
                            group === 1 ? group1CountryValue.includes('al') : 
                            group === 2 ? group2CountryValue.includes('al') : 
                            group === 3 ? group3CountryValue.includes('al') : 
                            group === 4 ? group4CountryValue.includes('al') :
                            group === 5 ? group5CountryValue.includes('al') :
                            group === 6 ? group6CountryValue.includes('al') :
                            group === 7 ? group7CountryValue.includes('al') :
                            group8CountryValue.includes('al')    
                        }                            
                        disabled={
                        selectedOption.includes('al') &&
                        ((group !== 1 && group1CountryValue.includes('al')) ||
                        (group !== 2 && group2CountryValue.includes('al')) ||
                        (group !== 3 && group3CountryValue.includes('al')) ||
                        (group !== 4 && group4CountryValue.includes('al')) ||
                        (group !== 5 && group5CountryValue.includes('al')) ||
                        (group !== 6 && group6CountryValue.includes('al')) ||
                        (group !== 7 && group7CountryValue.includes('al')) ||
                        (group !== 8 && group8CountryValue.includes('al')))
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
                            group === 1 ? group1CountryValue.includes('ad') : 
                            group === 2 ? group2CountryValue.includes('ad') : 
                            group === 3 ? group3CountryValue.includes('ad') : 
                            group === 4 ? group4CountryValue.includes('ad') :
                            group === 5 ? group5CountryValue.includes('ad') :
                            group === 6 ? group6CountryValue.includes('ad') :
                            group === 7 ? group7CountryValue.includes('ad') :
                            group8CountryValue.includes('ad')    
                        }                            
                        disabled={
                        selectedOption.includes('ad') &&
                        ((group !== 1 && group1CountryValue.includes('ad')) ||
                        (group !== 2 && group2CountryValue.includes('ad')) ||
                        (group !== 3 && group3CountryValue.includes('ad')) ||
                        (group !== 4 && group4CountryValue.includes('ad')) ||
                        (group !== 5 && group5CountryValue.includes('ad')) ||
                        (group !== 6 && group6CountryValue.includes('ad')) ||
                        (group !== 7 && group7CountryValue.includes('ad')) ||
                        (group !== 8 && group8CountryValue.includes('ad')))
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
                            group === 1 ? group1CountryValue.includes('at') : 
                            group === 2 ? group2CountryValue.includes('at') : 
                            group === 3 ? group3CountryValue.includes('at') : 
                            group === 4 ? group4CountryValue.includes('at') :
                            group === 5 ? group5CountryValue.includes('at') :
                            group === 6 ? group6CountryValue.includes('at') :
                            group === 7 ? group7CountryValue.includes('at') :
                            group8CountryValue.includes('at')    
                        }                            
                        disabled={
                        selectedOption.includes('at') &&
                        ((group !== 1 && group1CountryValue.includes('at')) ||
                        (group !== 2 && group2CountryValue.includes('at')) ||
                        (group !== 3 && group3CountryValue.includes('at')) ||
                        (group !== 4 && group4CountryValue.includes('at')) ||
                        (group !== 5 && group5CountryValue.includes('at')) ||
                        (group !== 6 && group6CountryValue.includes('at')) ||
                        (group !== 7 && group7CountryValue.includes('at')) ||
                        (group !== 8 && group8CountryValue.includes('at')))
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
                            group === 1 ? group1CountryValue.includes('by') : 
                            group === 2 ? group2CountryValue.includes('by') : 
                            group === 3 ? group3CountryValue.includes('by') : 
                            group === 4 ? group4CountryValue.includes('by') :
                            group === 5 ? group5CountryValue.includes('by') :
                            group === 6 ? group6CountryValue.includes('by') :
                            group === 7 ? group7CountryValue.includes('by') :
                            group8CountryValue.includes('by')    
                        }                            
                        disabled={
                        selectedOption.includes('by') &&
                        ((group !== 1 && group1CountryValue.includes('by')) ||
                        (group !== 2 && group2CountryValue.includes('by')) ||
                        (group !== 3 && group3CountryValue.includes('by')) ||
                        (group !== 4 && group4CountryValue.includes('by')) ||
                        (group !== 5 && group5CountryValue.includes('by')) ||
                        (group !== 6 && group6CountryValue.includes('by')) ||
                        (group !== 7 && group7CountryValue.includes('by')) ||
                        (group !== 8 && group8CountryValue.includes('by')))
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
                            group === 1 ? group1CountryValue.includes('be') : 
                            group === 2 ? group2CountryValue.includes('be') : 
                            group === 3 ? group3CountryValue.includes('be') : 
                            group === 4 ? group4CountryValue.includes('be') :
                            group === 5 ? group5CountryValue.includes('be') :
                            group === 6 ? group6CountryValue.includes('be') :
                            group === 7 ? group7CountryValue.includes('be') :
                            group8CountryValue.includes('be')    
                        }                            
                        disabled={
                        selectedOption.includes('be') &&
                        ((group !== 1 && group1CountryValue.includes('be')) ||
                        (group !== 2 && group2CountryValue.includes('be')) ||
                        (group !== 3 && group3CountryValue.includes('be')) ||
                        (group !== 4 && group4CountryValue.includes('be')) ||
                        (group !== 5 && group5CountryValue.includes('be')) ||
                        (group !== 6 && group6CountryValue.includes('be')) ||
                        (group !== 7 && group7CountryValue.includes('be')) ||
                        (group !== 8 && group8CountryValue.includes('be')))
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
                            group === 1 ? group1CountryValue.includes('ba') : 
                            group === 2 ? group2CountryValue.includes('ba') : 
                            group === 3 ? group3CountryValue.includes('ba') : 
                            group === 4 ? group4CountryValue.includes('ba') :
                            group === 5 ? group5CountryValue.includes('ba') :
                            group === 6 ? group6CountryValue.includes('ba') :
                            group === 7 ? group7CountryValue.includes('ba') :
                            group8CountryValue.includes('ba')    
                        }                            
                        disabled={
                        selectedOption.includes('ba') &&
                        ((group !== 1 && group1CountryValue.includes('ba')) ||
                        (group !== 2 && group2CountryValue.includes('ba')) ||
                        (group !== 3 && group3CountryValue.includes('ba')) ||
                        (group !== 4 && group4CountryValue.includes('ba')) ||
                        (group !== 5 && group5CountryValue.includes('ba')) ||
                        (group !== 6 && group6CountryValue.includes('ba')) ||
                        (group !== 7 && group7CountryValue.includes('ba')) ||
                        (group !== 8 && group8CountryValue.includes('ba')))
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
                        group === 1 ? group1CountryValue.includes('bg') : 
                        group === 2 ? group2CountryValue.includes('bg') : 
                        group === 3 ? group3CountryValue.includes('bg') : 
                        group === 4 ? group4CountryValue.includes('bg') :
                        group === 5 ? group5CountryValue.includes('bg') :
                        group === 6 ? group6CountryValue.includes('bg') :
                        group === 7 ? group7CountryValue.includes('bg') :
                        group8CountryValue.includes('bg')    
                    }                            
                    disabled={
                        selectedOption.includes('bg') &&
                        ((group !== 1 && group1CountryValue.includes('bg')) ||
                        (group !== 2 && group2CountryValue.includes('bg')) ||
                        (group !== 3 && group3CountryValue.includes('bg')) ||
                        (group !== 4 && group4CountryValue.includes('bg')) ||
                        (group !== 5 && group5CountryValue.includes('bg')) ||
                        (group !== 6 && group6CountryValue.includes('bg')) ||
                        (group !== 7 && group7CountryValue.includes('bg')) ||
                        (group !== 8 && group8CountryValue.includes('bg')))
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
                        group === 1 ? group1CountryValue.includes('hr') : 
                        group === 2 ? group2CountryValue.includes('hr') : 
                        group === 3 ? group3CountryValue.includes('hr') : 
                        group === 4 ? group4CountryValue.includes('hr') :
                        group === 5 ? group5CountryValue.includes('hr') :
                        group === 6 ? group6CountryValue.includes('hr') :
                        group === 7 ? group7CountryValue.includes('hr') :
                        group8CountryValue.includes('hr')    
                    }                            
                    disabled={
                        selectedOption.includes('hr') &&
                        ((group !== 1 && group1CountryValue.includes('hr')) ||
                        (group !== 2 && group2CountryValue.includes('hr')) ||
                        (group !== 3 && group3CountryValue.includes('hr')) ||
                        (group !== 4 && group4CountryValue.includes('hr')) ||
                        (group !== 5 && group5CountryValue.includes('hr')) ||
                        (group !== 6 && group6CountryValue.includes('hr')) ||
                        (group !== 7 && group7CountryValue.includes('hr')) ||
                        (group !== 8 && group8CountryValue.includes('hr')))
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
                        group === 1 ? group1CountryValue.includes('cz') : 
                        group === 2 ? group2CountryValue.includes('cz') : 
                        group === 3 ? group3CountryValue.includes('cz') : 
                        group === 4 ? group4CountryValue.includes('cz') :
                        group === 5 ? group5CountryValue.includes('cz') :
                        group === 6 ? group6CountryValue.includes('cz') :
                        group === 7 ? group7CountryValue.includes('cz') :
                        group8CountryValue.includes('cz')    
                    }                            
                    disabled={
                        selectedOption.includes('cz') &&
                        ((group !== 1 && group1CountryValue.includes('cz')) ||
                        (group !== 2 && group2CountryValue.includes('cz')) ||
                        (group !== 3 && group3CountryValue.includes('cz')) ||
                        (group !== 4 && group4CountryValue.includes('cz')) ||
                        (group !== 5 && group5CountryValue.includes('cz')) ||
                        (group !== 6 && group6CountryValue.includes('cz')) ||
                        (group !== 7 && group7CountryValue.includes('cz')) ||
                        (group !== 8 && group8CountryValue.includes('cz')))
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
                        group === 1 ? group1CountryValue.includes('dk') : 
                        group === 2 ? group2CountryValue.includes('dk') : 
                        group === 3 ? group3CountryValue.includes('dk') : 
                        group === 4 ? group4CountryValue.includes('dk') :
                        group === 5 ? group5CountryValue.includes('dk') :
                        group === 6 ? group6CountryValue.includes('dk') :
                        group === 7 ? group7CountryValue.includes('dk') :
                        group8CountryValue.includes('dk')    
                    }                            
                    disabled={
                        selectedOption.includes('dk') &&
                        ((group !== 1 && group1CountryValue.includes('dk')) ||
                        (group !== 2 && group2CountryValue.includes('dk')) ||
                        (group !== 3 && group3CountryValue.includes('dk')) ||
                        (group !== 4 && group4CountryValue.includes('dk')) ||
                        (group !== 5 && group5CountryValue.includes('dk')) ||
                        (group !== 6 && group6CountryValue.includes('dk')) ||
                        (group !== 7 && group7CountryValue.includes('dk')) ||
                        (group !== 8 && group8CountryValue.includes('dk')))
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
                        group === 1 ? group1CountryValue.includes('ee') : 
                        group === 2 ? group2CountryValue.includes('ee') : 
                        group === 3 ? group3CountryValue.includes('ee') : 
                        group === 4 ? group4CountryValue.includes('ee') :
                        group === 5 ? group5CountryValue.includes('ee') :
                        group === 6 ? group6CountryValue.includes('ee') :
                        group === 7 ? group7CountryValue.includes('ee') :
                        group8CountryValue.includes('ee')    
                    }                            
                    disabled={
                        selectedOption.includes('ee') &&
                        ((group !== 1 && group1CountryValue.includes('ee')) ||
                        (group !== 2 && group2CountryValue.includes('ee')) ||
                        (group !== 3 && group3CountryValue.includes('ee')) ||
                        (group !== 4 && group4CountryValue.includes('ee')) ||
                        (group !== 5 && group5CountryValue.includes('ee')) ||
                        (group !== 6 && group6CountryValue.includes('ee')) ||
                        (group !== 7 && group7CountryValue.includes('ee')) ||
                        (group !== 8 && group8CountryValue.includes('ee')))
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
                        group === 1 ? group1CountryValue.includes('fo') : 
                        group === 2 ? group2CountryValue.includes('fo') : 
                        group === 3 ? group3CountryValue.includes('fo') : 
                        group === 4 ? group4CountryValue.includes('fo') :
                        group === 5 ? group5CountryValue.includes('fo') :
                        group === 6 ? group6CountryValue.includes('fo') :
                        group === 7 ? group7CountryValue.includes('fo') :
                        group8CountryValue.includes('fo')    
                    }                            
                    disabled={
                        selectedOption.includes('fo') &&
                        ((group !== 1 && group1CountryValue.includes('fo')) ||
                        (group !== 2 && group2CountryValue.includes('fo')) ||
                        (group !== 3 && group3CountryValue.includes('fo')) ||
                        (group !== 4 && group4CountryValue.includes('fo')) ||
                        (group !== 5 && group5CountryValue.includes('fo')) ||
                        (group !== 6 && group6CountryValue.includes('fo')) ||
                        (group !== 7 && group7CountryValue.includes('fo')) ||
                        (group !== 8 && group8CountryValue.includes('fo')))
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
                        group === 1 ? group1CountryValue.includes('fi') : 
                        group === 2 ? group2CountryValue.includes('fi') : 
                        group === 3 ? group3CountryValue.includes('fi') : 
                        group === 4 ? group4CountryValue.includes('fi') :
                        group === 5 ? group5CountryValue.includes('fi') :
                        group === 6 ? group6CountryValue.includes('fi') :
                        group === 7 ? group7CountryValue.includes('fi') :
                        group8CountryValue.includes('fi')    
                    }                            
                    disabled={
                        selectedOption.includes('fi') &&
                        ((group !== 1 && group1CountryValue.includes('fi')) ||
                        (group !== 2 && group2CountryValue.includes('fi')) ||
                        (group !== 3 && group3CountryValue.includes('fi')) ||
                        (group !== 4 && group4CountryValue.includes('fi')) ||
                        (group !== 5 && group5CountryValue.includes('fi')) ||
                        (group !== 6 && group6CountryValue.includes('fi')) ||
                        (group !== 7 && group7CountryValue.includes('fi')) ||
                        (group !== 8 && group8CountryValue.includes('fi')))
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
                        group === 1 ? group1CountryValue.includes('fr') : 
                        group === 2 ? group2CountryValue.includes('fr') : 
                        group === 3 ? group3CountryValue.includes('fr') : 
                        group === 4 ? group4CountryValue.includes('fr') :
                        group === 5 ? group5CountryValue.includes('fr') :
                        group === 6 ? group6CountryValue.includes('fr') :
                        group === 7 ? group7CountryValue.includes('fr') :
                        group8CountryValue.includes('fr')    
                    }                            
                    disabled={
                        selectedOption.includes('fr') &&
                        ((group !== 1 && group1CountryValue.includes('fr')) ||
                        (group !== 2 && group2CountryValue.includes('fr')) ||
                        (group !== 3 && group3CountryValue.includes('fr')) ||
                        (group !== 4 && group4CountryValue.includes('fr')) ||
                        (group !== 5 && group5CountryValue.includes('fr')) ||
                        (group !== 6 && group6CountryValue.includes('fr')) ||
                        (group !== 7 && group7CountryValue.includes('fr')) ||
                        (group !== 8 && group8CountryValue.includes('fr')))
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
                        group === 1 ? group1CountryValue.includes('de') : 
                        group === 2 ? group2CountryValue.includes('de') : 
                        group === 3 ? group3CountryValue.includes('de') : 
                        group === 4 ? group4CountryValue.includes('de') :
                        group === 5 ? group5CountryValue.includes('de') :
                        group === 6 ? group6CountryValue.includes('de') :
                        group === 7 ? group7CountryValue.includes('de') :
                        group8CountryValue.includes('de')    
                    }                            
                    disabled={
                        selectedOption.includes('de') &&
                        ((group !== 1 && group1CountryValue.includes('de')) ||
                        (group !== 2 && group2CountryValue.includes('de')) ||
                        (group !== 3 && group3CountryValue.includes('de')) ||
                        (group !== 4 && group4CountryValue.includes('de')) ||
                        (group !== 5 && group5CountryValue.includes('de')) ||
                        (group !== 6 && group6CountryValue.includes('de')) ||
                        (group !== 7 && group7CountryValue.includes('de')) ||
                        (group !== 8 && group8CountryValue.includes('de')))
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
                        group === 1 ? group1CountryValue.includes('gr') : 
                        group === 2 ? group2CountryValue.includes('gr') : 
                        group === 3 ? group3CountryValue.includes('gr') : 
                        group === 4 ? group4CountryValue.includes('gr') :
                        group === 5 ? group5CountryValue.includes('gr') :
                        group === 6 ? group6CountryValue.includes('gr') :
                        group === 7 ? group7CountryValue.includes('gr') :
                        group8CountryValue.includes('gr')    
                    }                            
                    disabled={
                        selectedOption.includes('gr') &&
                        ((group !== 1 && group1CountryValue.includes('gr')) ||
                        (group !== 2 && group2CountryValue.includes('gr')) ||
                        (group !== 3 && group3CountryValue.includes('gr')) ||
                        (group !== 4 && group4CountryValue.includes('gr')) ||
                        (group !== 5 && group5CountryValue.includes('gr')) ||
                        (group !== 6 && group6CountryValue.includes('gr')) ||
                        (group !== 7 && group7CountryValue.includes('gr')) ||
                        (group !== 8 && group8CountryValue.includes('gr')))
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
                        group === 1 ? group1CountryValue.includes('hu') : 
                        group === 2 ? group2CountryValue.includes('hu') : 
                        group === 3 ? group3CountryValue.includes('hu') : 
                        group === 4 ? group4CountryValue.includes('hu') :
                        group === 5 ? group5CountryValue.includes('hu') :
                        group === 6 ? group6CountryValue.includes('hu') :
                        group === 7 ? group7CountryValue.includes('hu') :
                        group8CountryValue.includes('hu')    
                    }                            
                    disabled={
                        selectedOption.includes('hu') &&
                        ((group !== 1 && group1CountryValue.includes('hu')) ||
                        (group !== 2 && group2CountryValue.includes('hu')) ||
                        (group !== 3 && group3CountryValue.includes('hu')) ||
                        (group !== 4 && group4CountryValue.includes('hu')) ||
                        (group !== 5 && group5CountryValue.includes('hu')) ||
                        (group !== 6 && group6CountryValue.includes('hu')) ||
                        (group !== 7 && group7CountryValue.includes('hu')) ||
                        (group !== 8 && group8CountryValue.includes('hu')))
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
                        group === 1 ? group1CountryValue.includes('is') : 
                        group === 2 ? group2CountryValue.includes('is') : 
                        group === 3 ? group3CountryValue.includes('is') : 
                        group === 4 ? group4CountryValue.includes('is') :
                        group === 5 ? group5CountryValue.includes('is') :
                        group === 6 ? group6CountryValue.includes('is') :
                        group === 7 ? group7CountryValue.includes('is') :
                        group8CountryValue.includes('is')    
                    }                            
                    disabled={
                        selectedOption.includes('is') &&
                        ((group !== 1 && group1CountryValue.includes('is')) ||
                        (group !== 2 && group2CountryValue.includes('is')) ||
                        (group !== 3 && group3CountryValue.includes('is')) ||
                        (group !== 4 && group4CountryValue.includes('is')) ||
                        (group !== 5 && group5CountryValue.includes('is')) ||
                        (group !== 6 && group6CountryValue.includes('is')) ||
                        (group !== 7 && group7CountryValue.includes('is')) ||
                        (group !== 8 && group8CountryValue.includes('is')))
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
                        group === 1 ? group1CountryValue.includes('ie') : 
                        group === 2 ? group2CountryValue.includes('ie') : 
                        group === 3 ? group3CountryValue.includes('ie') : 
                        group === 4 ? group4CountryValue.includes('ie') :
                        group === 5 ? group5CountryValue.includes('ie') :
                        group === 6 ? group6CountryValue.includes('ie') :
                        group === 7 ? group7CountryValue.includes('ie') :
                        group8CountryValue.includes('ie')    
                    }                            
                    disabled={
                        selectedOption.includes('ie') &&
                        ((group !== 1 && group1CountryValue.includes('ie')) ||
                        (group !== 2 && group2CountryValue.includes('ie')) ||
                        (group !== 3 && group3CountryValue.includes('ie')) ||
                        (group !== 4 && group4CountryValue.includes('ie')) ||
                        (group !== 5 && group5CountryValue.includes('ie')) ||
                        (group !== 6 && group6CountryValue.includes('ie')) ||
                        (group !== 7 && group7CountryValue.includes('ie')) ||
                        (group !== 8 && group8CountryValue.includes('ie')))
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
                        group === 1 ? group1CountryValue.includes('it') : 
                        group === 2 ? group2CountryValue.includes('it') : 
                        group === 3 ? group3CountryValue.includes('it') : 
                        group === 4 ? group4CountryValue.includes('it') :
                        group === 5 ? group5CountryValue.includes('it') :
                        group === 6 ? group6CountryValue.includes('it') :
                        group === 7 ? group7CountryValue.includes('it') :
                        group8CountryValue.includes('it')    
                    }                            
                    disabled={
                        selectedOption.includes('it') &&
                        ((group !== 1 && group1CountryValue.includes('it')) ||
                        (group !== 2 && group2CountryValue.includes('it')) ||
                        (group !== 3 && group3CountryValue.includes('it')) ||
                        (group !== 4 && group4CountryValue.includes('it')) ||
                        (group !== 5 && group5CountryValue.includes('it')) ||
                        (group !== 6 && group6CountryValue.includes('it')) ||
                        (group !== 7 && group7CountryValue.includes('it')) ||
                        (group !== 8 && group8CountryValue.includes('it')))
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
                        group === 1 ? group1CountryValue.includes('lv') : 
                        group === 2 ? group2CountryValue.includes('lv') : 
                        group === 3 ? group3CountryValue.includes('lv') : 
                        group === 4 ? group4CountryValue.includes('lv') :
                        group === 5 ? group5CountryValue.includes('lv') :
                        group === 6 ? group6CountryValue.includes('lv') :
                        group === 7 ? group7CountryValue.includes('lv') :
                        group8CountryValue.includes('lv')    
                    }                            
                    disabled={
                        selectedOption.includes('lv') &&
                        ((group !== 1 && group1CountryValue.includes('lv')) ||
                        (group !== 2 && group2CountryValue.includes('lv')) ||
                        (group !== 3 && group3CountryValue.includes('lv')) ||
                        (group !== 4 && group4CountryValue.includes('lv')) ||
                        (group !== 5 && group5CountryValue.includes('lv')) ||
                        (group !== 6 && group6CountryValue.includes('lv')) ||
                        (group !== 7 && group7CountryValue.includes('lv')) ||
                        (group !== 8 && group8CountryValue.includes('lv')))
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
                        group === 1 ? group1CountryValue.includes('li') : 
                        group === 2 ? group2CountryValue.includes('li') : 
                        group === 3 ? group3CountryValue.includes('li') : 
                        group === 4 ? group4CountryValue.includes('li') :
                        group === 5 ? group5CountryValue.includes('li') :
                        group === 6 ? group6CountryValue.includes('li') :
                        group === 7 ? group7CountryValue.includes('li') :
                        group8CountryValue.includes('li')    
                    }                            
                    disabled={
                        selectedOption.includes('li') &&
                        ((group !== 1 && group1CountryValue.includes('li')) ||
                        (group !== 2 && group2CountryValue.includes('li')) ||
                        (group !== 3 && group3CountryValue.includes('li')) ||
                        (group !== 4 && group4CountryValue.includes('li')) ||
                        (group !== 5 && group5CountryValue.includes('li')) ||
                        (group !== 6 && group6CountryValue.includes('li')) ||
                        (group !== 7 && group7CountryValue.includes('li')) ||
                        (group !== 8 && group8CountryValue.includes('li')))
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
                        group === 1 ? group1CountryValue.includes('lt') : 
                        group === 2 ? group2CountryValue.includes('lt') : 
                        group === 3 ? group3CountryValue.includes('lt') : 
                        group === 4 ? group4CountryValue.includes('lt') :
                        group === 5 ? group5CountryValue.includes('lt') :
                        group === 6 ? group6CountryValue.includes('lt') :
                        group === 7 ? group7CountryValue.includes('lt') :
                        group8CountryValue.includes('lt')    
                    }                            
                    disabled={
                        selectedOption.includes('lt') &&
                        ((group !== 1 && group1CountryValue.includes('lt')) ||
                        (group !== 2 && group2CountryValue.includes('lt')) ||
                        (group !== 3 && group3CountryValue.includes('lt')) ||
                        (group !== 4 && group4CountryValue.includes('lt')) ||
                        (group !== 5 && group5CountryValue.includes('lt')) ||
                        (group !== 6 && group6CountryValue.includes('lt')) ||
                        (group !== 7 && group7CountryValue.includes('lt')) ||
                        (group !== 8 && group8CountryValue.includes('lt')))
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
                        group === 1 ? group1CountryValue.includes('lu') : 
                        group === 2 ? group2CountryValue.includes('lu') : 
                        group === 3 ? group3CountryValue.includes('lu') : 
                        group === 4 ? group4CountryValue.includes('lu') :
                        group === 5 ? group5CountryValue.includes('lu') :
                        group === 6 ? group6CountryValue.includes('lu') :
                        group === 7 ? group7CountryValue.includes('lu') :
                        group8CountryValue.includes('lu')    
                    }                            
                    disabled={
                        selectedOption.includes('lu') &&
                        ((group !== 1 && group1CountryValue.includes('lu')) ||
                        (group !== 2 && group2CountryValue.includes('lu')) ||
                        (group !== 3 && group3CountryValue.includes('lu')) ||
                        (group !== 4 && group4CountryValue.includes('lu')) ||
                        (group !== 5 && group5CountryValue.includes('lu')) ||
                        (group !== 6 && group6CountryValue.includes('lu')) ||
                        (group !== 7 && group7CountryValue.includes('lu')) ||
                        (group !== 8 && group8CountryValue.includes('lu')))
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
                        group === 1 ? group1CountryValue.includes('mt') : 
                        group === 2 ? group2CountryValue.includes('mt') : 
                        group === 3 ? group3CountryValue.includes('mt') : 
                        group === 4 ? group4CountryValue.includes('mt') :
                        group === 5 ? group5CountryValue.includes('mt') :
                        group === 6 ? group6CountryValue.includes('mt') :
                        group === 7 ? group7CountryValue.includes('mt') :
                        group8CountryValue.includes('mt')    
                    }                            
                    disabled={
                        selectedOption.includes('mt') &&
                        ((group !== 1 && group1CountryValue.includes('mt')) ||
                        (group !== 2 && group2CountryValue.includes('mt')) ||
                        (group !== 3 && group3CountryValue.includes('mt')) ||
                        (group !== 4 && group4CountryValue.includes('mt')) ||
                        (group !== 5 && group5CountryValue.includes('mt')) ||
                        (group !== 6 && group6CountryValue.includes('mt')) ||
                        (group !== 7 && group7CountryValue.includes('mt')) ||
                        (group !== 8 && group8CountryValue.includes('mt')))
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
                        group === 1 ? group1CountryValue.includes('md') : 
                        group === 2 ? group2CountryValue.includes('md') : 
                        group === 3 ? group3CountryValue.includes('md') : 
                        group === 4 ? group4CountryValue.includes('md') :
                        group === 5 ? group5CountryValue.includes('md') :
                        group === 6 ? group6CountryValue.includes('md') :
                        group === 7 ? group7CountryValue.includes('md') :
                        group8CountryValue.includes('md')    
                    }                            
                    disabled={
                        selectedOption.includes('md') &&
                        ((group !== 1 && group1CountryValue.includes('md')) ||
                        (group !== 2 && group2CountryValue.includes('md')) ||
                        (group !== 3 && group3CountryValue.includes('md')) ||
                        (group !== 4 && group4CountryValue.includes('md')) ||
                        (group !== 5 && group5CountryValue.includes('md')) ||
                        (group !== 6 && group6CountryValue.includes('md')) ||
                        (group !== 7 && group7CountryValue.includes('md')) ||
                        (group !== 8 && group8CountryValue.includes('md')))
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
                        group === 1 ? group1CountryValue.includes('mc') : 
                        group === 2 ? group2CountryValue.includes('mc') : 
                        group === 3 ? group3CountryValue.includes('mc') : 
                        group === 4 ? group4CountryValue.includes('mc') :
                        group === 5 ? group5CountryValue.includes('mc') :
                        group === 6 ? group6CountryValue.includes('mc') :
                        group === 7 ? group7CountryValue.includes('mc') :
                        group8CountryValue.includes('mc')    
                    }                            
                    disabled={
                        selectedOption.includes('mc') &&
                        ((group !== 1 && group1CountryValue.includes('mc')) ||
                        (group !== 2 && group2CountryValue.includes('mc')) ||
                        (group !== 3 && group3CountryValue.includes('mc')) ||
                        (group !== 4 && group4CountryValue.includes('mc')) ||
                        (group !== 5 && group5CountryValue.includes('mc')) ||
                        (group !== 6 && group6CountryValue.includes('mc')) ||
                        (group !== 7 && group7CountryValue.includes('mc')) ||
                        (group !== 8 && group8CountryValue.includes('mc')))
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
                        group === 1 ? group1CountryValue.includes('me') : 
                        group === 2 ? group2CountryValue.includes('me') : 
                        group === 3 ? group3CountryValue.includes('me') : 
                        group === 4 ? group4CountryValue.includes('me') :
                        group === 5 ? group5CountryValue.includes('me') :
                        group === 6 ? group6CountryValue.includes('me') :
                        group === 7 ? group7CountryValue.includes('me') :
                        group8CountryValue.includes('me')    
                    }                            
                    disabled={
                        selectedOption.includes('me') &&
                        ((group !== 1 && group1CountryValue.includes('me')) ||
                        (group !== 2 && group2CountryValue.includes('me')) ||
                        (group !== 3 && group3CountryValue.includes('me')) ||
                        (group !== 4 && group4CountryValue.includes('me')) ||
                        (group !== 5 && group5CountryValue.includes('me')) ||
                        (group !== 6 && group6CountryValue.includes('me')) ||
                        (group !== 7 && group7CountryValue.includes('me')) ||
                        (group !== 8 && group8CountryValue.includes('me')))
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
                        group === 1 ? group1CountryValue.includes('nl') : 
                        group === 2 ? group2CountryValue.includes('nl') : 
                        group === 3 ? group3CountryValue.includes('nl') : 
                        group === 4 ? group4CountryValue.includes('nl') :
                        group === 5 ? group5CountryValue.includes('nl') :
                        group === 6 ? group6CountryValue.includes('nl') :
                        group === 7 ? group7CountryValue.includes('nl') :
                        group8CountryValue.includes('nl')    
                    }                            
                    disabled={
                        selectedOption.includes('nl') &&
                        ((group !== 1 && group1CountryValue.includes('nl')) ||
                        (group !== 2 && group2CountryValue.includes('nl')) ||
                        (group !== 3 && group3CountryValue.includes('nl')) ||
                        (group !== 4 && group4CountryValue.includes('nl')) ||
                        (group !== 5 && group5CountryValue.includes('nl')) ||
                        (group !== 6 && group6CountryValue.includes('nl')) ||
                        (group !== 7 && group7CountryValue.includes('nl')) ||
                        (group !== 8 && group8CountryValue.includes('nl')))
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
                        group === 1 ? group1CountryValue.includes('mk') : 
                        group === 2 ? group2CountryValue.includes('mk') : 
                        group === 3 ? group3CountryValue.includes('mk') : 
                        group === 4 ? group4CountryValue.includes('mk') :
                        group === 5 ? group5CountryValue.includes('mk') :
                        group === 6 ? group6CountryValue.includes('mk') :
                        group === 7 ? group7CountryValue.includes('mk') :
                        group8CountryValue.includes('mk')    
                    }                            
                    disabled={
                        selectedOption.includes('mk') &&
                        ((group !== 1 && group1CountryValue.includes('mk')) ||
                        (group !== 2 && group2CountryValue.includes('mk')) ||
                        (group !== 3 && group3CountryValue.includes('mk')) ||
                        (group !== 4 && group4CountryValue.includes('mk')) ||
                        (group !== 5 && group5CountryValue.includes('mk')) ||
                        (group !== 6 && group6CountryValue.includes('mk')) ||
                        (group !== 7 && group7CountryValue.includes('mk')) ||
                        (group !== 8 && group8CountryValue.includes('mk')))
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
                        group === 1 ? group1CountryValue.includes('no') : 
                        group === 2 ? group2CountryValue.includes('no') : 
                        group === 3 ? group3CountryValue.includes('no') : 
                        group === 4 ? group4CountryValue.includes('no') :
                        group === 5 ? group5CountryValue.includes('no') :
                        group === 6 ? group6CountryValue.includes('no') :
                        group === 7 ? group7CountryValue.includes('no') :
                        group8CountryValue.includes('no')    
                    }                            
                    disabled={
                        selectedOption.includes('no') &&
                        ((group !== 1 && group1CountryValue.includes('no')) ||
                        (group !== 2 && group2CountryValue.includes('no')) ||
                        (group !== 3 && group3CountryValue.includes('no')) ||
                        (group !== 4 && group4CountryValue.includes('no')) ||
                        (group !== 5 && group5CountryValue.includes('no')) ||
                        (group !== 6 && group6CountryValue.includes('no')) ||
                        (group !== 7 && group7CountryValue.includes('no')) ||
                        (group !== 8 && group8CountryValue.includes('no')))
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
                        group === 1 ? group1CountryValue.includes('pl') : 
                        group === 2 ? group2CountryValue.includes('pl') : 
                        group === 3 ? group3CountryValue.includes('pl') : 
                        group === 4 ? group4CountryValue.includes('pl') :
                        group === 5 ? group5CountryValue.includes('pl') :
                        group === 6 ? group6CountryValue.includes('pl') :
                        group === 7 ? group7CountryValue.includes('pl') :
                        group8CountryValue.includes('pl')    
                    }                            
                    disabled={
                        selectedOption.includes('pl') &&
                        ((group !== 1 && group1CountryValue.includes('pl')) ||
                        (group !== 2 && group2CountryValue.includes('pl')) ||
                        (group !== 3 && group3CountryValue.includes('pl')) ||
                        (group !== 4 && group4CountryValue.includes('pl')) ||
                        (group !== 5 && group5CountryValue.includes('pl')) ||
                        (group !== 6 && group6CountryValue.includes('pl')) ||
                        (group !== 7 && group7CountryValue.includes('pl')) ||
                        (group !== 8 && group8CountryValue.includes('pl')))
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
                        group === 1 ? group1CountryValue.includes('pt') : 
                        group === 2 ? group2CountryValue.includes('pt') : 
                        group === 3 ? group3CountryValue.includes('pt') : 
                        group === 4 ? group4CountryValue.includes('pt') :
                        group === 5 ? group5CountryValue.includes('pt') :
                        group === 6 ? group6CountryValue.includes('pt') :
                        group === 7 ? group7CountryValue.includes('pt') :
                        group8CountryValue.includes('pt')    
                    }                            
                    disabled={
                        selectedOption.includes('pt') &&
                        ((group !== 1 && group1CountryValue.includes('pt')) ||
                        (group !== 2 && group2CountryValue.includes('pt')) ||
                        (group !== 3 && group3CountryValue.includes('pt')) ||
                        (group !== 4 && group4CountryValue.includes('pt')) ||
                        (group !== 5 && group5CountryValue.includes('pt')) ||
                        (group !== 6 && group6CountryValue.includes('pt')) ||
                        (group !== 7 && group7CountryValue.includes('pt')) ||
                        (group !== 8 && group8CountryValue.includes('pt')))
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
                        group === 1 ? group1CountryValue.includes('ro') : 
                        group === 2 ? group2CountryValue.includes('ro') : 
                        group === 3 ? group3CountryValue.includes('ro') : 
                        group === 4 ? group4CountryValue.includes('ro') :
                        group === 5 ? group5CountryValue.includes('ro') :
                        group === 6 ? group6CountryValue.includes('ro') :
                        group === 7 ? group7CountryValue.includes('ro') :
                        group8CountryValue.includes('ro')    
                    }                            
                    disabled={
                        selectedOption.includes('ro') &&
                        ((group !== 1 && group1CountryValue.includes('ro')) ||
                        (group !== 2 && group2CountryValue.includes('ro')) ||
                        (group !== 3 && group3CountryValue.includes('ro')) ||
                        (group !== 4 && group4CountryValue.includes('ro')) ||
                        (group !== 5 && group5CountryValue.includes('ro')) ||
                        (group !== 6 && group6CountryValue.includes('ro')) ||
                        (group !== 7 && group7CountryValue.includes('ro')) ||
                        (group !== 8 && group8CountryValue.includes('ro')))
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
                        group === 1 ? group1CountryValue.includes('ru') : 
                        group === 2 ? group2CountryValue.includes('ru') : 
                        group === 3 ? group3CountryValue.includes('ru') : 
                        group === 4 ? group4CountryValue.includes('ru') :
                        group === 5 ? group5CountryValue.includes('ru') :
                        group === 6 ? group6CountryValue.includes('ru') :
                        group === 7 ? group7CountryValue.includes('ru') :
                        group8CountryValue.includes('ru')    
                    }                            
                    disabled={
                        selectedOption.includes('ru') &&
                        ((group !== 1 && group1CountryValue.includes('ru')) ||
                        (group !== 2 && group2CountryValue.includes('ru')) ||
                        (group !== 3 && group3CountryValue.includes('ru')) ||
                        (group !== 4 && group4CountryValue.includes('ru')) ||
                        (group !== 5 && group5CountryValue.includes('ru')) ||
                        (group !== 6 && group6CountryValue.includes('ru')) ||
                        (group !== 7 && group7CountryValue.includes('ru')) ||
                        (group !== 8 && group8CountryValue.includes('ru')))
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
                        group === 1 ? group1CountryValue.includes('sm') : 
                        group === 2 ? group2CountryValue.includes('sm') : 
                        group === 3 ? group3CountryValue.includes('sm') : 
                        group === 4 ? group4CountryValue.includes('sm') :
                        group === 5 ? group5CountryValue.includes('sm') :
                        group === 6 ? group6CountryValue.includes('sm') :
                        group === 7 ? group7CountryValue.includes('sm') :
                        group8CountryValue.includes('sm')    
                    }                            
                    disabled={
                        selectedOption.includes('sm') &&
                        ((group !== 1 && group1CountryValue.includes('sm')) ||
                        (group !== 2 && group2CountryValue.includes('sm')) ||
                        (group !== 3 && group3CountryValue.includes('sm')) ||
                        (group !== 4 && group4CountryValue.includes('sm')) ||
                        (group !== 5 && group5CountryValue.includes('sm')) ||
                        (group !== 6 && group6CountryValue.includes('sm')) ||
                        (group !== 7 && group7CountryValue.includes('sm')) ||
                        (group !== 8 && group8CountryValue.includes('sm')))
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
                        group === 1 ? group1CountryValue.includes('rs') : 
                        group === 2 ? group2CountryValue.includes('rs') : 
                        group === 3 ? group3CountryValue.includes('rs') : 
                        group === 4 ? group4CountryValue.includes('rs') :
                        group === 5 ? group5CountryValue.includes('rs') :
                        group === 6 ? group6CountryValue.includes('rs') :
                        group === 7 ? group7CountryValue.includes('rs') :
                        group8CountryValue.includes('rs')    
                    }                            
                    disabled={
                        selectedOption.includes('rs') &&
                        ((group !== 1 && group1CountryValue.includes('rs')) ||
                        (group !== 2 && group2CountryValue.includes('rs')) ||
                        (group !== 3 && group3CountryValue.includes('rs')) ||
                        (group !== 4 && group4CountryValue.includes('rs')) ||
                        (group !== 5 && group5CountryValue.includes('rs')) ||
                        (group !== 6 && group6CountryValue.includes('rs')) ||
                        (group !== 7 && group7CountryValue.includes('rs')) ||
                        (group !== 8 && group8CountryValue.includes('rs')))
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
                        group === 1 ? group1CountryValue.includes('sk') : 
                        group === 2 ? group2CountryValue.includes('sk') : 
                        group === 3 ? group3CountryValue.includes('sk') : 
                        group === 4 ? group4CountryValue.includes('sk') :
                        group === 5 ? group5CountryValue.includes('sk') :
                        group === 6 ? group6CountryValue.includes('sk') :
                        group === 7 ? group7CountryValue.includes('sk') :
                        group8CountryValue.includes('sk')    
                    }                            
                    disabled={
                        selectedOption.includes('sk') &&
                        ((group !== 1 && group1CountryValue.includes('sk')) ||
                        (group !== 2 && group2CountryValue.includes('sk')) ||
                        (group !== 3 && group3CountryValue.includes('sk')) ||
                        (group !== 4 && group4CountryValue.includes('sk')) ||
                        (group !== 5 && group5CountryValue.includes('sk')) ||
                        (group !== 6 && group6CountryValue.includes('sk')) ||
                        (group !== 7 && group7CountryValue.includes('sk')) ||
                        (group !== 8 && group8CountryValue.includes('sk')))
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
                        group === 1 ? group1CountryValue.includes('si') : 
                        group === 2 ? group2CountryValue.includes('si') : 
                        group === 3 ? group3CountryValue.includes('si') : 
                        group === 4 ? group4CountryValue.includes('si') :
                        group === 5 ? group5CountryValue.includes('si') :
                        group === 6 ? group6CountryValue.includes('si') :
                        group === 7 ? group7CountryValue.includes('si') :
                        group8CountryValue.includes('si')    
                    }                            
                    disabled={
                        selectedOption.includes('si') &&
                        ((group !== 1 && group1CountryValue.includes('si')) ||
                        (group !== 2 && group2CountryValue.includes('si')) ||
                        (group !== 3 && group3CountryValue.includes('si')) ||
                        (group !== 4 && group4CountryValue.includes('si')) ||
                        (group !== 5 && group5CountryValue.includes('si')) ||
                        (group !== 6 && group6CountryValue.includes('si')) ||
                        (group !== 7 && group7CountryValue.includes('si')) ||
                        (group !== 8 && group8CountryValue.includes('si')))
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
                        group === 1 ? group1CountryValue.includes('es') : 
                        group === 2 ? group2CountryValue.includes('es') : 
                        group === 3 ? group3CountryValue.includes('es') : 
                        group === 4 ? group4CountryValue.includes('es') :
                        group === 5 ? group5CountryValue.includes('es') :
                        group === 6 ? group6CountryValue.includes('es') :
                        group === 7 ? group7CountryValue.includes('es') :
                        group8CountryValue.includes('es')    
                    }                            
                    disabled={
                        selectedOption.includes('es') &&
                        ((group !== 1 && group1CountryValue.includes('es')) ||
                        (group !== 2 && group2CountryValue.includes('es')) ||
                        (group !== 3 && group3CountryValue.includes('es')) ||
                        (group !== 4 && group4CountryValue.includes('es')) ||
                        (group !== 5 && group5CountryValue.includes('es')) ||
                        (group !== 6 && group6CountryValue.includes('es')) ||
                        (group !== 7 && group7CountryValue.includes('es')) ||
                        (group !== 8 && group8CountryValue.includes('es')))
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
                        group === 1 ? group1CountryValue.includes('se') : 
                        group === 2 ? group2CountryValue.includes('se') : 
                        group === 3 ? group3CountryValue.includes('se') : 
                        group === 4 ? group4CountryValue.includes('se') :
                        group === 5 ? group5CountryValue.includes('se') :
                        group === 6 ? group6CountryValue.includes('se') :
                        group === 7 ? group7CountryValue.includes('se') :
                        group8CountryValue.includes('se')    
                    }                            
                    disabled={
                        selectedOption.includes('se') &&
                        ((group !== 1 && group1CountryValue.includes('se')) ||
                        (group !== 2 && group2CountryValue.includes('se')) ||
                        (group !== 3 && group3CountryValue.includes('se')) ||
                        (group !== 4 && group4CountryValue.includes('se')) ||
                        (group !== 5 && group5CountryValue.includes('se')) ||
                        (group !== 6 && group6CountryValue.includes('se')) ||
                        (group !== 7 && group7CountryValue.includes('se')) ||
                        (group !== 8 && group8CountryValue.includes('se')))
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
                        group === 1 ? group1CountryValue.includes('ch') : 
                        group === 2 ? group2CountryValue.includes('ch') : 
                        group === 3 ? group3CountryValue.includes('ch') : 
                        group === 4 ? group4CountryValue.includes('ch') :
                        group === 5 ? group5CountryValue.includes('ch') :
                        group === 6 ? group6CountryValue.includes('ch') :
                        group === 7 ? group7CountryValue.includes('ch') :
                        group8CountryValue.includes('ch')    
                    }                            
                    disabled={
                        selectedOption.includes('ch') &&
                        ((group !== 1 && group1CountryValue.includes('ch')) ||
                        (group !== 2 && group2CountryValue.includes('ch')) ||
                        (group !== 3 && group3CountryValue.includes('ch')) ||
                        (group !== 4 && group4CountryValue.includes('ch')) ||
                        (group !== 5 && group5CountryValue.includes('ch')) ||
                        (group !== 6 && group6CountryValue.includes('ch')) ||
                        (group !== 7 && group7CountryValue.includes('ch')) ||
                        (group !== 8 && group8CountryValue.includes('ch')))
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
                        group === 1 ? group1CountryValue.includes('ua') : 
                        group === 2 ? group2CountryValue.includes('ua') : 
                        group === 3 ? group3CountryValue.includes('ua') : 
                        group === 4 ? group4CountryValue.includes('ua') :
                        group === 5 ? group5CountryValue.includes('ua') :
                        group === 6 ? group6CountryValue.includes('ua') :
                        group === 7 ? group7CountryValue.includes('ua') :
                        group8CountryValue.includes('ua')    
                    }                            
                    disabled={
                        selectedOption.includes('ua') &&
                        ((group !== 1 && group1CountryValue.includes('ua')) ||
                        (group !== 2 && group2CountryValue.includes('ua')) ||
                        (group !== 3 && group3CountryValue.includes('ua')) ||
                        (group !== 4 && group4CountryValue.includes('ua')) ||
                        (group !== 5 && group5CountryValue.includes('ua')) ||
                        (group !== 6 && group6CountryValue.includes('ua')) ||
                        (group !== 7 && group7CountryValue.includes('ua')) ||
                        (group !== 8 && group8CountryValue.includes('ua')))
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
                        group === 1 ? group1CountryValue.includes('gb') : 
                        group === 2 ? group2CountryValue.includes('gb') : 
                        group === 3 ? group3CountryValue.includes('gb') : 
                        group === 4 ? group4CountryValue.includes('gb') :
                        group === 5 ? group5CountryValue.includes('gb') :
                        group === 6 ? group6CountryValue.includes('gb') :
                        group === 7 ? group7CountryValue.includes('gb') :
                        group8CountryValue.includes('gb')    
                    }                            
                    disabled={
                        selectedOption.includes('gb') &&
                        ((group !== 1 && group1CountryValue.includes('gb')) ||
                        (group !== 2 && group2CountryValue.includes('gb')) ||
                        (group !== 3 && group3CountryValue.includes('gb')) ||
                        (group !== 4 && group4CountryValue.includes('gb')) ||
                        (group !== 5 && group5CountryValue.includes('gb')) ||
                        (group !== 6 && group6CountryValue.includes('gb')) ||
                        (group !== 7 && group7CountryValue.includes('gb')) ||
                        (group !== 8 && group8CountryValue.includes('gb')))
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
                        group === 1 ? group1CountryValue.includes('ai') : 
                        group === 2 ? group2CountryValue.includes('ai') : 
                        group === 3 ? group3CountryValue.includes('ai') : 
                        group === 4 ? group4CountryValue.includes('ai') :
                        group === 5 ? group5CountryValue.includes('ai') :
                        group === 6 ? group6CountryValue.includes('ai') :
                        group === 7 ? group7CountryValue.includes('ai') :
                        group8CountryValue.includes('ai')    
                    }                            
                    disabled={
                        selectedOption.includes('ai') &&
                        ((group !== 1 && group1CountryValue.includes('ai')) ||
                        (group !== 2 && group2CountryValue.includes('ai')) ||
                        (group !== 3 && group3CountryValue.includes('ai')) ||
                        (group !== 4 && group4CountryValue.includes('ai')) ||
                        (group !== 5 && group5CountryValue.includes('ai')) ||
                        (group !== 6 && group6CountryValue.includes('ai')) ||
                        (group !== 7 && group7CountryValue.includes('ai')) ||
                        (group !== 8 && group8CountryValue.includes('ai')))
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
                        group === 1 ? group1CountryValue.includes('ag') : 
                        group === 2 ? group2CountryValue.includes('ag') : 
                        group === 3 ? group3CountryValue.includes('ag') : 
                        group === 4 ? group4CountryValue.includes('ag') :
                        group === 5 ? group5CountryValue.includes('ag') :
                        group === 6 ? group6CountryValue.includes('ag') :
                        group === 7 ? group7CountryValue.includes('ag') :
                        group8CountryValue.includes('ag')    
                    }                            
                    disabled={
                        selectedOption.includes('ag') &&
                        ((group !== 1 && group1CountryValue.includes('ag')) ||
                        (group !== 2 && group2CountryValue.includes('ag')) ||
                        (group !== 3 && group3CountryValue.includes('ag')) ||
                        (group !== 4 && group4CountryValue.includes('ag')) ||
                        (group !== 5 && group5CountryValue.includes('ag')) ||
                        (group !== 6 && group6CountryValue.includes('ag')) ||
                        (group !== 7 && group7CountryValue.includes('ag')) ||
                        (group !== 8 && group8CountryValue.includes('ag')))
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
                        group === 1 ? group1CountryValue.includes('aw') : 
                        group === 2 ? group2CountryValue.includes('aw') : 
                        group === 3 ? group3CountryValue.includes('aw') : 
                        group === 4 ? group4CountryValue.includes('aw') :
                        group === 5 ? group5CountryValue.includes('aw') :
                        group === 6 ? group6CountryValue.includes('aw') :
                        group === 7 ? group7CountryValue.includes('aw') :
                        group8CountryValue.includes('aw')    
                    }                            
                    disabled={
                        selectedOption.includes('aw') &&
                        ((group !== 1 && group1CountryValue.includes('aw')) ||
                        (group !== 2 && group2CountryValue.includes('aw')) ||
                        (group !== 3 && group3CountryValue.includes('aw')) ||
                        (group !== 4 && group4CountryValue.includes('aw')) ||
                        (group !== 5 && group5CountryValue.includes('aw')) ||
                        (group !== 6 && group6CountryValue.includes('aw')) ||
                        (group !== 7 && group7CountryValue.includes('aw')) ||
                        (group !== 8 && group8CountryValue.includes('aw')))
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
                        group === 1 ? group1CountryValue.includes('bs') : 
                        group === 2 ? group2CountryValue.includes('bs') : 
                        group === 3 ? group3CountryValue.includes('bs') : 
                        group === 4 ? group4CountryValue.includes('bs') :
                        group === 5 ? group5CountryValue.includes('bs') :
                        group === 6 ? group6CountryValue.includes('bs') :
                        group === 7 ? group7CountryValue.includes('bs') :
                        group8CountryValue.includes('bs')    
                    }                            
                    disabled={
                        selectedOption.includes('bs') &&
                        ((group !== 1 && group1CountryValue.includes('bs')) ||
                        (group !== 2 && group2CountryValue.includes('bs')) ||
                        (group !== 3 && group3CountryValue.includes('bs')) ||
                        (group !== 4 && group4CountryValue.includes('bs')) ||
                        (group !== 5 && group5CountryValue.includes('bs')) ||
                        (group !== 6 && group6CountryValue.includes('bs')) ||
                        (group !== 7 && group7CountryValue.includes('bs')) ||
                        (group !== 8 && group8CountryValue.includes('bs')))
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
                        group === 1 ? group1CountryValue.includes('bb') : 
                        group === 2 ? group2CountryValue.includes('bb') : 
                        group === 3 ? group3CountryValue.includes('bb') : 
                        group === 4 ? group4CountryValue.includes('bb') :
                        group === 5 ? group5CountryValue.includes('bb') :
                        group === 6 ? group6CountryValue.includes('bb') :
                        group === 7 ? group7CountryValue.includes('bb') :
                        group8CountryValue.includes('bb')    
                    }                            
                    disabled={
                        selectedOption.includes('bb') &&
                        ((group !== 1 && group1CountryValue.includes('bb')) ||
                        (group !== 2 && group2CountryValue.includes('bb')) ||
                        (group !== 3 && group3CountryValue.includes('bb')) ||
                        (group !== 4 && group4CountryValue.includes('bb')) ||
                        (group !== 5 && group5CountryValue.includes('bb')) ||
                        (group !== 6 && group6CountryValue.includes('bb')) ||
                        (group !== 7 && group7CountryValue.includes('bb')) ||
                        (group !== 8 && group8CountryValue.includes('bb')))
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
                        group === 1 ? group1CountryValue.includes('bz') : 
                        group === 2 ? group2CountryValue.includes('bz') : 
                        group === 3 ? group3CountryValue.includes('bz') : 
                        group === 4 ? group4CountryValue.includes('bz') :
                        group === 5 ? group5CountryValue.includes('bz') :
                        group === 6 ? group6CountryValue.includes('bz') :
                        group === 7 ? group7CountryValue.includes('bz') :
                        group8CountryValue.includes('bz')    
                    }                            
                    disabled={
                        selectedOption.includes('bz') &&
                        ((group !== 1 && group1CountryValue.includes('bz')) ||
                        (group !== 2 && group2CountryValue.includes('bz')) ||
                        (group !== 3 && group3CountryValue.includes('bz')) ||
                        (group !== 4 && group4CountryValue.includes('bz')) ||
                        (group !== 5 && group5CountryValue.includes('bz')) ||
                        (group !== 6 && group6CountryValue.includes('bz')) ||
                        (group !== 7 && group7CountryValue.includes('bz')) ||
                        (group !== 8 && group8CountryValue.includes('bz')))
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
                        group === 1 ? group1CountryValue.includes('bm') : 
                        group === 2 ? group2CountryValue.includes('bm') : 
                        group === 3 ? group3CountryValue.includes('bm') : 
                        group === 4 ? group4CountryValue.includes('bm') :
                        group === 5 ? group5CountryValue.includes('bm') :
                        group === 6 ? group6CountryValue.includes('bm') :
                        group === 7 ? group7CountryValue.includes('bm') :
                        group8CountryValue.includes('bm')    
                    }                            
                    disabled={
                        selectedOption.includes('bm') &&
                        ((group !== 1 && group1CountryValue.includes('bm')) ||
                        (group !== 2 && group2CountryValue.includes('bm')) ||
                        (group !== 3 && group3CountryValue.includes('bm')) ||
                        (group !== 4 && group4CountryValue.includes('bm')) ||
                        (group !== 5 && group5CountryValue.includes('bm')) ||
                        (group !== 6 && group6CountryValue.includes('bm')) ||
                        (group !== 7 && group7CountryValue.includes('bm')) ||
                        (group !== 8 && group8CountryValue.includes('bm')))
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
                        group === 1 ? group1CountryValue.includes('bq') : 
                        group === 2 ? group2CountryValue.includes('bq') : 
                        group === 3 ? group3CountryValue.includes('bq') : 
                        group === 4 ? group4CountryValue.includes('bq') :
                        group === 5 ? group5CountryValue.includes('bq') :
                        group === 6 ? group6CountryValue.includes('bq') :
                        group === 7 ? group7CountryValue.includes('bq') :
                        group8CountryValue.includes('bq')    
                    }                            
                    disabled={
                        selectedOption.includes('bq') &&
                        ((group !== 1 && group1CountryValue.includes('bq')) ||
                        (group !== 2 && group2CountryValue.includes('bq')) ||
                        (group !== 3 && group3CountryValue.includes('bq')) ||
                        (group !== 4 && group4CountryValue.includes('bq')) ||
                        (group !== 5 && group5CountryValue.includes('bq')) ||
                        (group !== 6 && group6CountryValue.includes('bq')) ||
                        (group !== 7 && group7CountryValue.includes('bq')) ||
                        (group !== 8 && group8CountryValue.includes('bq')))
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
                        group === 1 ? group1CountryValue.includes('vg') : 
                        group === 2 ? group2CountryValue.includes('vg') : 
                        group === 3 ? group3CountryValue.includes('vg') : 
                        group === 4 ? group4CountryValue.includes('vg') :
                        group === 5 ? group5CountryValue.includes('vg') :
                        group === 6 ? group6CountryValue.includes('vg') :
                        group === 7 ? group7CountryValue.includes('vg') :
                        group8CountryValue.includes('vg')    
                    }                            
                    disabled={
                        selectedOption.includes('vg') &&
                        ((group !== 1 && group1CountryValue.includes('vg')) ||
                        (group !== 2 && group2CountryValue.includes('vg')) ||
                        (group !== 3 && group3CountryValue.includes('vg')) ||
                        (group !== 4 && group4CountryValue.includes('vg')) ||
                        (group !== 5 && group5CountryValue.includes('vg')) ||
                        (group !== 6 && group6CountryValue.includes('vg')) ||
                        (group !== 7 && group7CountryValue.includes('vg')) ||
                        (group !== 8 && group8CountryValue.includes('vg')))
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
                        group === 1 ? group1CountryValue.includes('ca') : 
                        group === 2 ? group2CountryValue.includes('ca') : 
                        group === 3 ? group3CountryValue.includes('ca') : 
                        group === 4 ? group4CountryValue.includes('ca') :
                        group === 5 ? group5CountryValue.includes('ca') :
                        group === 6 ? group6CountryValue.includes('ca') :
                        group === 7 ? group7CountryValue.includes('ca') :
                        group8CountryValue.includes('ca')    
                    }                            
                    disabled={
                        selectedOption.includes('ca') &&
                        ((group !== 1 && group1CountryValue.includes('ca')) ||
                        (group !== 2 && group2CountryValue.includes('ca')) ||
                        (group !== 3 && group3CountryValue.includes('ca')) ||
                        (group !== 4 && group4CountryValue.includes('ca')) ||
                        (group !== 5 && group5CountryValue.includes('ca')) ||
                        (group !== 6 && group6CountryValue.includes('ca')) ||
                        (group !== 7 && group7CountryValue.includes('ca')) ||
                        (group !== 8 && group8CountryValue.includes('ca')))
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
                        group === 1 ? group1CountryValue.includes('ky') : 
                        group === 2 ? group2CountryValue.includes('ky') : 
                        group === 3 ? group3CountryValue.includes('ky') : 
                        group === 4 ? group4CountryValue.includes('ky') :
                        group === 5 ? group5CountryValue.includes('ky') :
                        group === 6 ? group6CountryValue.includes('ky') :
                        group === 7 ? group7CountryValue.includes('ky') :
                        group8CountryValue.includes('ky')    
                    }                            
                    disabled={
                        selectedOption.includes('ky') &&
                        ((group !== 1 && group1CountryValue.includes('ky')) ||
                        (group !== 2 && group2CountryValue.includes('ky')) ||
                        (group !== 3 && group3CountryValue.includes('ky')) ||
                        (group !== 4 && group4CountryValue.includes('ky')) ||
                        (group !== 5 && group5CountryValue.includes('ky')) ||
                        (group !== 6 && group6CountryValue.includes('ky')) ||
                        (group !== 7 && group7CountryValue.includes('ky')) ||
                        (group !== 8 && group8CountryValue.includes('ky')))
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
                        group === 1 ? group1CountryValue.includes('cr') : 
                        group === 2 ? group2CountryValue.includes('cr') : 
                        group === 3 ? group3CountryValue.includes('cr') : 
                        group === 4 ? group4CountryValue.includes('cr') :
                        group === 5 ? group5CountryValue.includes('cr') :
                        group === 6 ? group6CountryValue.includes('cr') :
                        group === 7 ? group7CountryValue.includes('cr') :
                        group8CountryValue.includes('cr')    
                    }                            
                    disabled={
                        selectedOption.includes('cr') &&
                        ((group !== 1 && group1CountryValue.includes('cr')) ||
                        (group !== 2 && group2CountryValue.includes('cr')) ||
                        (group !== 3 && group3CountryValue.includes('cr')) ||
                        (group !== 4 && group4CountryValue.includes('cr')) ||
                        (group !== 5 && group5CountryValue.includes('cr')) ||
                        (group !== 6 && group6CountryValue.includes('cr')) ||
                        (group !== 7 && group7CountryValue.includes('cr')) ||
                        (group !== 8 && group8CountryValue.includes('cr')))
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
                        group === 1 ? group1CountryValue.includes('cu') : 
                        group === 2 ? group2CountryValue.includes('cu') : 
                        group === 3 ? group3CountryValue.includes('cu') : 
                        group === 4 ? group4CountryValue.includes('cu') :
                        group === 5 ? group5CountryValue.includes('cu') :
                        group === 6 ? group6CountryValue.includes('cu') :
                        group === 7 ? group7CountryValue.includes('cu') :
                        group8CountryValue.includes('cu')    
                    }                            
                    disabled={
                        selectedOption.includes('cu') &&
                        ((group !== 1 && group1CountryValue.includes('cu')) ||
                        (group !== 2 && group2CountryValue.includes('cu')) ||
                        (group !== 3 && group3CountryValue.includes('cu')) ||
                        (group !== 4 && group4CountryValue.includes('cu')) ||
                        (group !== 5 && group5CountryValue.includes('cu')) ||
                        (group !== 6 && group6CountryValue.includes('cu')) ||
                        (group !== 7 && group7CountryValue.includes('cu')) ||
                        (group !== 8 && group8CountryValue.includes('cu')))
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
                        group === 1 ? group1CountryValue.includes('cw') : 
                        group === 2 ? group2CountryValue.includes('cw') : 
                        group === 3 ? group3CountryValue.includes('cw') : 
                        group === 4 ? group4CountryValue.includes('cw') :
                        group === 5 ? group5CountryValue.includes('cw') :
                        group === 6 ? group6CountryValue.includes('cw') :
                        group === 7 ? group7CountryValue.includes('cw') :
                        group8CountryValue.includes('cw')    
                    }                            
                    disabled={
                        selectedOption.includes('cw') &&
                        ((group !== 1 && group1CountryValue.includes('cw')) ||
                        (group !== 2 && group2CountryValue.includes('cw')) ||
                        (group !== 3 && group3CountryValue.includes('cw')) ||
                        (group !== 4 && group4CountryValue.includes('cw')) ||
                        (group !== 5 && group5CountryValue.includes('cw')) ||
                        (group !== 6 && group6CountryValue.includes('cw')) ||
                        (group !== 7 && group7CountryValue.includes('cw')) ||
                        (group !== 8 && group8CountryValue.includes('cw')))
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
                        group === 1 ? group1CountryValue.includes('dm') : 
                        group === 2 ? group2CountryValue.includes('dm') : 
                        group === 3 ? group3CountryValue.includes('dm') : 
                        group === 4 ? group4CountryValue.includes('dm') :
                        group === 5 ? group5CountryValue.includes('dm') :
                        group === 6 ? group6CountryValue.includes('dm') :
                        group === 7 ? group7CountryValue.includes('dm') :
                        group8CountryValue.includes('dm')    
                    }                            
                    disabled={
                        selectedOption.includes('dm') &&
                        ((group !== 1 && group1CountryValue.includes('dm')) ||
                        (group !== 2 && group2CountryValue.includes('dm')) ||
                        (group !== 3 && group3CountryValue.includes('dm')) ||
                        (group !== 4 && group4CountryValue.includes('dm')) ||
                        (group !== 5 && group5CountryValue.includes('dm')) ||
                        (group !== 6 && group6CountryValue.includes('dm')) ||
                        (group !== 7 && group7CountryValue.includes('dm')) ||
                        (group !== 8 && group8CountryValue.includes('dm')))
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
                        group === 1 ? group1CountryValue.includes('do') : 
                        group === 2 ? group2CountryValue.includes('do') : 
                        group === 3 ? group3CountryValue.includes('do') : 
                        group === 4 ? group4CountryValue.includes('do') :
                        group === 5 ? group5CountryValue.includes('do') :
                        group === 6 ? group6CountryValue.includes('do') :
                        group === 7 ? group7CountryValue.includes('do') :
                        group8CountryValue.includes('do')    
                    }                            
                    disabled={
                        selectedOption.includes('do') &&
                        ((group !== 1 && group1CountryValue.includes('do')) ||
                        (group !== 2 && group2CountryValue.includes('do')) ||
                        (group !== 3 && group3CountryValue.includes('do')) ||
                        (group !== 4 && group4CountryValue.includes('do')) ||
                        (group !== 5 && group5CountryValue.includes('do')) ||
                        (group !== 6 && group6CountryValue.includes('do')) ||
                        (group !== 7 && group7CountryValue.includes('do')) ||
                        (group !== 8 && group8CountryValue.includes('do')))
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
                        group === 1 ? group1CountryValue.includes('sv') : 
                        group === 2 ? group2CountryValue.includes('sv') : 
                        group === 3 ? group3CountryValue.includes('sv') : 
                        group === 4 ? group4CountryValue.includes('sv') :
                        group === 5 ? group5CountryValue.includes('sv') :
                        group === 6 ? group6CountryValue.includes('sv') :
                        group === 7 ? group7CountryValue.includes('sv') :
                        group8CountryValue.includes('sv')    
                    }                            
                    disabled={
                        selectedOption.includes('sv') &&
                        ((group !== 1 && group1CountryValue.includes('sv')) ||
                        (group !== 2 && group2CountryValue.includes('sv')) ||
                        (group !== 3 && group3CountryValue.includes('sv')) ||
                        (group !== 4 && group4CountryValue.includes('sv')) ||
                        (group !== 5 && group5CountryValue.includes('sv')) ||
                        (group !== 6 && group6CountryValue.includes('sv')) ||
                        (group !== 7 && group7CountryValue.includes('sv')) ||
                        (group !== 8 && group8CountryValue.includes('sv')))
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
                        group === 1 ? group1CountryValue.includes('gd') : 
                        group === 2 ? group2CountryValue.includes('gd') : 
                        group === 3 ? group3CountryValue.includes('gd') : 
                        group === 4 ? group4CountryValue.includes('gd') :
                        group === 5 ? group5CountryValue.includes('gd') :
                        group === 6 ? group6CountryValue.includes('gd') :
                        group === 7 ? group7CountryValue.includes('gd') :
                        group8CountryValue.includes('gd')    
                    }                            
                    disabled={
                        selectedOption.includes('gd') &&
                        ((group !== 1 && group1CountryValue.includes('gd')) ||
                        (group !== 2 && group2CountryValue.includes('gd')) ||
                        (group !== 3 && group3CountryValue.includes('gd')) ||
                        (group !== 4 && group4CountryValue.includes('gd')) ||
                        (group !== 5 && group5CountryValue.includes('gd')) ||
                        (group !== 6 && group6CountryValue.includes('gd')) ||
                        (group !== 7 && group7CountryValue.includes('gd')) ||
                        (group !== 8 && group8CountryValue.includes('gd')))
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
                        group === 1 ? group1CountryValue.includes('gl') : 
                        group === 2 ? group2CountryValue.includes('gl') : 
                        group === 3 ? group3CountryValue.includes('gl') : 
                        group === 4 ? group4CountryValue.includes('gl') :
                        group === 5 ? group5CountryValue.includes('gl') :
                        group === 6 ? group6CountryValue.includes('gl') :
                        group === 7 ? group7CountryValue.includes('gl') :
                        group8CountryValue.includes('gl')    
                    }                            
                    disabled={
                        selectedOption.includes('gl') &&
                        ((group !== 1 && group1CountryValue.includes('gl')) ||
                        (group !== 2 && group2CountryValue.includes('gl')) ||
                        (group !== 3 && group3CountryValue.includes('gl')) ||
                        (group !== 4 && group4CountryValue.includes('gl')) ||
                        (group !== 5 && group5CountryValue.includes('gl')) ||
                        (group !== 6 && group6CountryValue.includes('gl')) ||
                        (group !== 7 && group7CountryValue.includes('gl')) ||
                        (group !== 8 && group8CountryValue.includes('gl')))
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
                        group === 1 ? group1CountryValue.includes('gp') : 
                        group === 2 ? group2CountryValue.includes('gp') : 
                        group === 3 ? group3CountryValue.includes('gp') : 
                        group === 4 ? group4CountryValue.includes('gp') :
                        group === 5 ? group5CountryValue.includes('gp') :
                        group === 6 ? group6CountryValue.includes('gp') :
                        group === 7 ? group7CountryValue.includes('gp') :
                        group8CountryValue.includes('gp')    
                    }                            
                    disabled={
                        selectedOption.includes('gp') &&
                        ((group !== 1 && group1CountryValue.includes('gp')) ||
                        (group !== 2 && group2CountryValue.includes('gp')) ||
                        (group !== 3 && group3CountryValue.includes('gp')) ||
                        (group !== 4 && group4CountryValue.includes('gp')) ||
                        (group !== 5 && group5CountryValue.includes('gp')) ||
                        (group !== 6 && group6CountryValue.includes('gp')) ||
                        (group !== 7 && group7CountryValue.includes('gp')) ||
                        (group !== 8 && group8CountryValue.includes('gp')))
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
                        group === 1 ? group1CountryValue.includes('gt') : 
                        group === 2 ? group2CountryValue.includes('gt') : 
                        group === 3 ? group3CountryValue.includes('gt') : 
                        group === 4 ? group4CountryValue.includes('gt') :
                        group === 5 ? group5CountryValue.includes('gt') :
                        group === 6 ? group6CountryValue.includes('gt') :
                        group === 7 ? group7CountryValue.includes('gt') :
                        group8CountryValue.includes('gt')    
                    }                            
                    disabled={
                        selectedOption.includes('gt') &&
                        ((group !== 1 && group1CountryValue.includes('gt')) ||
                        (group !== 2 && group2CountryValue.includes('gt')) ||
                        (group !== 3 && group3CountryValue.includes('gt')) ||
                        (group !== 4 && group4CountryValue.includes('gt')) ||
                        (group !== 5 && group5CountryValue.includes('gt')) ||
                        (group !== 6 && group6CountryValue.includes('gt')) ||
                        (group !== 7 && group7CountryValue.includes('gt')) ||
                        (group !== 8 && group8CountryValue.includes('gt')))
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
                        group === 1 ? group1CountryValue.includes('ht') : 
                        group === 2 ? group2CountryValue.includes('ht') : 
                        group === 3 ? group3CountryValue.includes('ht') : 
                        group === 4 ? group4CountryValue.includes('ht') :
                        group === 5 ? group5CountryValue.includes('ht') :
                        group === 6 ? group6CountryValue.includes('ht') :
                        group === 7 ? group7CountryValue.includes('ht') :
                        group8CountryValue.includes('ht')    
                    }                            
                    disabled={
                        selectedOption.includes('ht') &&
                        ((group !== 1 && group1CountryValue.includes('ht')) ||
                        (group !== 2 && group2CountryValue.includes('ht')) ||
                        (group !== 3 && group3CountryValue.includes('ht')) ||
                        (group !== 4 && group4CountryValue.includes('ht')) ||
                        (group !== 5 && group5CountryValue.includes('ht')) ||
                        (group !== 6 && group6CountryValue.includes('ht')) ||
                        (group !== 7 && group7CountryValue.includes('ht')) ||
                        (group !== 8 && group8CountryValue.includes('ht')))
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
                        group === 1 ? group1CountryValue.includes('hn') : 
                        group === 2 ? group2CountryValue.includes('hn') : 
                        group === 3 ? group3CountryValue.includes('hn') : 
                        group === 4 ? group4CountryValue.includes('hn') :
                        group === 5 ? group5CountryValue.includes('hn') :
                        group === 6 ? group6CountryValue.includes('hn') :
                        group === 7 ? group7CountryValue.includes('hn') :
                        group8CountryValue.includes('hn')    
                    }                            
                    disabled={
                        selectedOption.includes('hn') &&
                        ((group !== 1 && group1CountryValue.includes('hn')) ||
                        (group !== 2 && group2CountryValue.includes('hn')) ||
                        (group !== 3 && group3CountryValue.includes('hn')) ||
                        (group !== 4 && group4CountryValue.includes('hn')) ||
                        (group !== 5 && group5CountryValue.includes('hn')) ||
                        (group !== 6 && group6CountryValue.includes('hn')) ||
                        (group !== 7 && group7CountryValue.includes('hn')) ||
                        (group !== 8 && group8CountryValue.includes('hn')))
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
                        group === 1 ? group1CountryValue.includes('jm') : 
                        group === 2 ? group2CountryValue.includes('jm') : 
                        group === 3 ? group3CountryValue.includes('jm') : 
                        group === 4 ? group4CountryValue.includes('jm') :
                        group === 5 ? group5CountryValue.includes('jm') :
                        group === 6 ? group6CountryValue.includes('jm') :
                        group === 7 ? group7CountryValue.includes('jm') :
                        group8CountryValue.includes('jm')    
                    }                            
                    disabled={
                        selectedOption.includes('jm') &&
                        ((group !== 1 && group1CountryValue.includes('jm')) ||
                        (group !== 2 && group2CountryValue.includes('jm')) ||
                        (group !== 3 && group3CountryValue.includes('jm')) ||
                        (group !== 4 && group4CountryValue.includes('jm')) ||
                        (group !== 5 && group5CountryValue.includes('jm')) ||
                        (group !== 6 && group6CountryValue.includes('jm')) ||
                        (group !== 7 && group7CountryValue.includes('jm')) ||
                        (group !== 8 && group8CountryValue.includes('jm')))
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
                        group === 1 ? group1CountryValue.includes('mq') : 
                        group === 2 ? group2CountryValue.includes('mq') : 
                        group === 3 ? group3CountryValue.includes('mq') : 
                        group === 4 ? group4CountryValue.includes('mq') :
                        group === 5 ? group5CountryValue.includes('mq') :
                        group === 6 ? group6CountryValue.includes('mq') :
                        group === 7 ? group7CountryValue.includes('mq') :
                        group8CountryValue.includes('mq')    
                    }                            
                    disabled={
                        selectedOption.includes('mq') &&
                        ((group !== 1 && group1CountryValue.includes('mq')) ||
                        (group !== 2 && group2CountryValue.includes('mq')) ||
                        (group !== 3 && group3CountryValue.includes('mq')) ||
                        (group !== 4 && group4CountryValue.includes('mq')) ||
                        (group !== 5 && group5CountryValue.includes('mq')) ||
                        (group !== 6 && group6CountryValue.includes('mq')) ||
                        (group !== 7 && group7CountryValue.includes('mq')) ||
                        (group !== 8 && group8CountryValue.includes('mq')))
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
                        group === 1 ? group1CountryValue.includes('mx') : 
                        group === 2 ? group2CountryValue.includes('mx') : 
                        group === 3 ? group3CountryValue.includes('mx') : 
                        group === 4 ? group4CountryValue.includes('mx') :
                        group === 5 ? group5CountryValue.includes('mx') :
                        group === 6 ? group6CountryValue.includes('mx') :
                        group === 7 ? group7CountryValue.includes('mx') :
                        group8CountryValue.includes('mx')    
                    }                            
                    disabled={
                        selectedOption.includes('mx') &&
                        ((group !== 1 && group1CountryValue.includes('mx')) ||
                        (group !== 2 && group2CountryValue.includes('mx')) ||
                        (group !== 3 && group3CountryValue.includes('mx')) ||
                        (group !== 4 && group4CountryValue.includes('mx')) ||
                        (group !== 5 && group5CountryValue.includes('mx')) ||
                        (group !== 6 && group6CountryValue.includes('mx')) ||
                        (group !== 7 && group7CountryValue.includes('mx')) ||
                        (group !== 8 && group8CountryValue.includes('mx')))
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
                        group === 1 ? group1CountryValue.includes('ms') : 
                        group === 2 ? group2CountryValue.includes('ms') : 
                        group === 3 ? group3CountryValue.includes('ms') : 
                        group === 4 ? group4CountryValue.includes('ms') :
                        group === 5 ? group5CountryValue.includes('ms') :
                        group === 6 ? group6CountryValue.includes('ms') :
                        group === 7 ? group7CountryValue.includes('ms') :
                        group8CountryValue.includes('ms')    
                    }                            
                    disabled={
                        selectedOption.includes('ms') &&
                        ((group !== 1 && group1CountryValue.includes('ms')) ||
                        (group !== 2 && group2CountryValue.includes('ms')) ||
                        (group !== 3 && group3CountryValue.includes('ms')) ||
                        (group !== 4 && group4CountryValue.includes('ms')) ||
                        (group !== 5 && group5CountryValue.includes('ms')) ||
                        (group !== 6 && group6CountryValue.includes('ms')) ||
                        (group !== 7 && group7CountryValue.includes('ms')) ||
                        (group !== 8 && group8CountryValue.includes('ms')))
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
                        group === 1 ? group1CountryValue.includes('ni') : 
                        group === 2 ? group2CountryValue.includes('ni') : 
                        group === 3 ? group3CountryValue.includes('ni') : 
                        group === 4 ? group4CountryValue.includes('ni') :
                        group === 5 ? group5CountryValue.includes('ni') :
                        group === 6 ? group6CountryValue.includes('ni') :
                        group === 7 ? group7CountryValue.includes('ni') :
                        group8CountryValue.includes('ni')    
                    }                            
                    disabled={
                        selectedOption.includes('ni') &&
                        ((group !== 1 && group1CountryValue.includes('ni')) ||
                        (group !== 2 && group2CountryValue.includes('ni')) ||
                        (group !== 3 && group3CountryValue.includes('ni')) ||
                        (group !== 4 && group4CountryValue.includes('ni')) ||
                        (group !== 5 && group5CountryValue.includes('ni')) ||
                        (group !== 6 && group6CountryValue.includes('ni')) ||
                        (group !== 7 && group7CountryValue.includes('ni')) ||
                        (group !== 8 && group8CountryValue.includes('ni')))
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
                        group === 1 ? group1CountryValue.includes('pa') : 
                        group === 2 ? group2CountryValue.includes('pa') : 
                        group === 3 ? group3CountryValue.includes('pa') : 
                        group === 4 ? group4CountryValue.includes('pa') :
                        group === 5 ? group5CountryValue.includes('pa') :
                        group === 6 ? group6CountryValue.includes('pa') :
                        group === 7 ? group7CountryValue.includes('pa') :
                        group8CountryValue.includes('pa')    
                    }                            
                    disabled={
                        selectedOption.includes('pa') &&
                        ((group !== 1 && group1CountryValue.includes('pa')) ||
                        (group !== 2 && group2CountryValue.includes('pa')) ||
                        (group !== 3 && group3CountryValue.includes('pa')) ||
                        (group !== 4 && group4CountryValue.includes('pa')) ||
                        (group !== 5 && group5CountryValue.includes('pa')) ||
                        (group !== 6 && group6CountryValue.includes('pa')) ||
                        (group !== 7 && group7CountryValue.includes('pa')) ||
                        (group !== 8 && group8CountryValue.includes('pa')))
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
                        group === 1 ? group1CountryValue.includes('pr') : 
                        group === 2 ? group2CountryValue.includes('pr') : 
                        group === 3 ? group3CountryValue.includes('pr') : 
                        group === 4 ? group4CountryValue.includes('pr') :
                        group === 5 ? group5CountryValue.includes('pr') :
                        group === 6 ? group6CountryValue.includes('pr') :
                        group === 7 ? group7CountryValue.includes('pr') :
                        group8CountryValue.includes('pr')    
                    }                            
                    disabled={
                        selectedOption.includes('pr') &&
                        ((group !== 1 && group1CountryValue.includes('pr')) ||
                        (group !== 2 && group2CountryValue.includes('pr')) ||
                        (group !== 3 && group3CountryValue.includes('pr')) ||
                        (group !== 4 && group4CountryValue.includes('pr')) ||
                        (group !== 5 && group5CountryValue.includes('pr')) ||
                        (group !== 6 && group6CountryValue.includes('pr')) ||
                        (group !== 7 && group7CountryValue.includes('pr')) ||
                        (group !== 8 && group8CountryValue.includes('pr')))
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
                        group === 1 ? group1CountryValue.includes('bl') : 
                        group === 2 ? group2CountryValue.includes('bl') : 
                        group === 3 ? group3CountryValue.includes('bl') : 
                        group === 4 ? group4CountryValue.includes('bl') :
                        group === 5 ? group5CountryValue.includes('bl') :
                        group === 6 ? group6CountryValue.includes('bl') :
                        group === 7 ? group7CountryValue.includes('bl') :
                        group8CountryValue.includes('bl')    
                    }                            
                    disabled={
                        selectedOption.includes('bl') &&
                        ((group !== 1 && group1CountryValue.includes('bl')) ||
                        (group !== 2 && group2CountryValue.includes('bl')) ||
                        (group !== 3 && group3CountryValue.includes('bl')) ||
                        (group !== 4 && group4CountryValue.includes('bl')) ||
                        (group !== 5 && group5CountryValue.includes('bl')) ||
                        (group !== 6 && group6CountryValue.includes('bl')) ||
                        (group !== 7 && group7CountryValue.includes('bl')) ||
                        (group !== 8 && group8CountryValue.includes('bl')))
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
                        group === 1 ? group1CountryValue.includes('kn') : 
                        group === 2 ? group2CountryValue.includes('kn') : 
                        group === 3 ? group3CountryValue.includes('kn') : 
                        group === 4 ? group4CountryValue.includes('kn') :
                        group === 5 ? group5CountryValue.includes('kn') :
                        group === 6 ? group6CountryValue.includes('kn') :
                        group === 7 ? group7CountryValue.includes('kn') :
                        group8CountryValue.includes('kn')    
                    }                            
                    disabled={
                        selectedOption.includes('kn') &&
                        ((group !== 1 && group1CountryValue.includes('kn')) ||
                        (group !== 2 && group2CountryValue.includes('kn')) ||
                        (group !== 3 && group3CountryValue.includes('kn')) ||
                        (group !== 4 && group4CountryValue.includes('kn')) ||
                        (group !== 5 && group5CountryValue.includes('kn')) ||
                        (group !== 6 && group6CountryValue.includes('kn')) ||
                        (group !== 7 && group7CountryValue.includes('kn')) ||
                        (group !== 8 && group8CountryValue.includes('kn')))
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
                        group === 1 ? group1CountryValue.includes('lc') : 
                        group === 2 ? group2CountryValue.includes('lc') : 
                        group === 3 ? group3CountryValue.includes('lc') : 
                        group === 4 ? group4CountryValue.includes('lc') :
                        group === 5 ? group5CountryValue.includes('lc') :
                        group === 6 ? group6CountryValue.includes('lc') :
                        group === 7 ? group7CountryValue.includes('lc') :
                        group8CountryValue.includes('lc')    
                    }                            
                    disabled={
                        selectedOption.includes('lc') &&
                        ((group !== 1 && group1CountryValue.includes('lc')) ||
                        (group !== 2 && group2CountryValue.includes('lc')) ||
                        (group !== 3 && group3CountryValue.includes('lc')) ||
                        (group !== 4 && group4CountryValue.includes('lc')) ||
                        (group !== 5 && group5CountryValue.includes('lc')) ||
                        (group !== 6 && group6CountryValue.includes('lc')) ||
                        (group !== 7 && group7CountryValue.includes('lc')) ||
                        (group !== 8 && group8CountryValue.includes('lc')))
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
                        group === 1 ? group1CountryValue.includes('mf') : 
                        group === 2 ? group2CountryValue.includes('mf') : 
                        group === 3 ? group3CountryValue.includes('mf') : 
                        group === 4 ? group4CountryValue.includes('mf') :
                        group === 5 ? group5CountryValue.includes('mf') :
                        group === 6 ? group6CountryValue.includes('mf') :
                        group === 7 ? group7CountryValue.includes('mf') :
                        group8CountryValue.includes('mf')    
                    }                            
                    disabled={
                        selectedOption.includes('mf') &&
                        ((group !== 1 && group1CountryValue.includes('mf')) ||
                        (group !== 2 && group2CountryValue.includes('mf')) ||
                        (group !== 3 && group3CountryValue.includes('mf')) ||
                        (group !== 4 && group4CountryValue.includes('mf')) ||
                        (group !== 5 && group5CountryValue.includes('mf')) ||
                        (group !== 6 && group6CountryValue.includes('mf')) ||
                        (group !== 7 && group7CountryValue.includes('mf')) ||
                        (group !== 8 && group8CountryValue.includes('mf')))
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
                        group === 1 ? group1CountryValue.includes('pm') : 
                        group === 2 ? group2CountryValue.includes('pm') : 
                        group === 3 ? group3CountryValue.includes('pm') : 
                        group === 4 ? group4CountryValue.includes('pm') :
                        group === 5 ? group5CountryValue.includes('pm') :
                        group === 6 ? group6CountryValue.includes('pm') :
                        group === 7 ? group7CountryValue.includes('pm') :
                        group8CountryValue.includes('pm')    
                    }                            
                    disabled={
                        selectedOption.includes('pm') &&
                        ((group !== 1 && group1CountryValue.includes('pm')) ||
                        (group !== 2 && group2CountryValue.includes('pm')) ||
                        (group !== 3 && group3CountryValue.includes('pm')) ||
                        (group !== 4 && group4CountryValue.includes('pm')) ||
                        (group !== 5 && group5CountryValue.includes('pm')) ||
                        (group !== 6 && group6CountryValue.includes('pm')) ||
                        (group !== 7 && group7CountryValue.includes('pm')) ||
                        (group !== 8 && group8CountryValue.includes('pm')))
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
                        group === 1 ? group1CountryValue.includes('vc') : 
                        group === 2 ? group2CountryValue.includes('vc') : 
                        group === 3 ? group3CountryValue.includes('vc') : 
                        group === 4 ? group4CountryValue.includes('vc') :
                        group === 5 ? group5CountryValue.includes('vc') :
                        group === 6 ? group6CountryValue.includes('vc') :
                        group === 7 ? group7CountryValue.includes('vc') :
                        group8CountryValue.includes('vc')    
                    }                            
                    disabled={
                        selectedOption.includes('vc') &&
                        ((group !== 1 && group1CountryValue.includes('vc')) ||
                        (group !== 2 && group2CountryValue.includes('vc')) ||
                        (group !== 3 && group3CountryValue.includes('vc')) ||
                        (group !== 4 && group4CountryValue.includes('vc')) ||
                        (group !== 5 && group5CountryValue.includes('vc')) ||
                        (group !== 6 && group6CountryValue.includes('vc')) ||
                        (group !== 7 && group7CountryValue.includes('vc')) ||
                        (group !== 8 && group8CountryValue.includes('vc')))
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
                        group === 1 ? group1CountryValue.includes('sx') : 
                        group === 2 ? group2CountryValue.includes('sx') : 
                        group === 3 ? group3CountryValue.includes('sx') : 
                        group === 4 ? group4CountryValue.includes('sx') :
                        group === 5 ? group5CountryValue.includes('sx') :
                        group === 6 ? group6CountryValue.includes('sx') :
                        group === 7 ? group7CountryValue.includes('sx') :
                        group8CountryValue.includes('sx')    
                    }                            
                    disabled={
                        selectedOption.includes('sx') &&
                        ((group !== 1 && group1CountryValue.includes('sx')) ||
                        (group !== 2 && group2CountryValue.includes('sx')) ||
                        (group !== 3 && group3CountryValue.includes('sx')) ||
                        (group !== 4 && group4CountryValue.includes('sx')) ||
                        (group !== 5 && group5CountryValue.includes('sx')) ||
                        (group !== 6 && group6CountryValue.includes('sx')) ||
                        (group !== 7 && group7CountryValue.includes('sx')) ||
                        (group !== 8 && group8CountryValue.includes('sx')))
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
                        group === 1 ? group1CountryValue.includes('tt') : 
                        group === 2 ? group2CountryValue.includes('tt') : 
                        group === 3 ? group3CountryValue.includes('tt') : 
                        group === 4 ? group4CountryValue.includes('tt') :
                        group === 5 ? group5CountryValue.includes('tt') :
                        group === 6 ? group6CountryValue.includes('tt') :
                        group === 7 ? group7CountryValue.includes('tt') :
                        group8CountryValue.includes('tt')    
                    }                            
                    disabled={
                        selectedOption.includes('tt') &&
                        ((group !== 1 && group1CountryValue.includes('tt')) ||
                        (group !== 2 && group2CountryValue.includes('tt')) ||
                        (group !== 3 && group3CountryValue.includes('tt')) ||
                        (group !== 4 && group4CountryValue.includes('tt')) ||
                        (group !== 5 && group5CountryValue.includes('tt')) ||
                        (group !== 6 && group6CountryValue.includes('tt')) ||
                        (group !== 7 && group7CountryValue.includes('tt')) ||
                        (group !== 8 && group8CountryValue.includes('tt')))
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
                        group === 1 ? group1CountryValue.includes('tc') : 
                        group === 2 ? group2CountryValue.includes('tc') : 
                        group === 3 ? group3CountryValue.includes('tc') : 
                        group === 4 ? group4CountryValue.includes('tc') :
                        group === 5 ? group5CountryValue.includes('tc') :
                        group === 6 ? group6CountryValue.includes('tc') :
                        group === 7 ? group7CountryValue.includes('tc') :
                        group8CountryValue.includes('tc')    
                    }                            
                    disabled={
                        selectedOption.includes('tc') &&
                        ((group !== 1 && group1CountryValue.includes('tc')) ||
                        (group !== 2 && group2CountryValue.includes('tc')) ||
                        (group !== 3 && group3CountryValue.includes('tc')) ||
                        (group !== 4 && group4CountryValue.includes('tc')) ||
                        (group !== 5 && group5CountryValue.includes('tc')) ||
                        (group !== 6 && group6CountryValue.includes('tc')) ||
                        (group !== 7 && group7CountryValue.includes('tc')) ||
                        (group !== 8 && group8CountryValue.includes('tc')))
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
                        group === 1 ? group1CountryValue.includes('vi') : 
                        group === 2 ? group2CountryValue.includes('vi') : 
                        group === 3 ? group3CountryValue.includes('vi') : 
                        group === 4 ? group4CountryValue.includes('vi') :
                        group === 5 ? group5CountryValue.includes('vi') :
                        group === 6 ? group6CountryValue.includes('vi') :
                        group === 7 ? group7CountryValue.includes('vi') :
                        group8CountryValue.includes('vi')    
                    }                            
                    disabled={
                        selectedOption.includes('vi') &&
                        ((group !== 1 && group1CountryValue.includes('vi')) ||
                        (group !== 2 && group2CountryValue.includes('vi')) ||
                        (group !== 3 && group3CountryValue.includes('vi')) ||
                        (group !== 4 && group4CountryValue.includes('vi')) ||
                        (group !== 5 && group5CountryValue.includes('vi')) ||
                        (group !== 6 && group6CountryValue.includes('vi')) ||
                        (group !== 7 && group7CountryValue.includes('vi')) ||
                        (group !== 8 && group8CountryValue.includes('vi')))
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
                        group === 1 ? group1CountryValue.includes('us') : 
                        group === 2 ? group2CountryValue.includes('us') : 
                        group === 3 ? group3CountryValue.includes('us') : 
                        group === 4 ? group4CountryValue.includes('us') :
                        group === 5 ? group5CountryValue.includes('us') :
                        group === 6 ? group6CountryValue.includes('us') :
                        group === 7 ? group7CountryValue.includes('us') :
                        group8CountryValue.includes('us')    
                    }                            
                    disabled={
                        selectedOption.includes('us') &&
                        ((group !== 1 && group1CountryValue.includes('us')) ||
                        (group !== 2 && group2CountryValue.includes('us')) ||
                        (group !== 3 && group3CountryValue.includes('us')) ||
                        (group !== 4 && group4CountryValue.includes('us')) ||
                        (group !== 5 && group5CountryValue.includes('us')) ||
                        (group !== 6 && group6CountryValue.includes('us')) ||
                        (group !== 7 && group7CountryValue.includes('us')) ||
                        (group !== 8 && group8CountryValue.includes('us')))
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
                        group === 1 ? group1CountryValue.includes('ar') : 
                        group === 2 ? group2CountryValue.includes('ar') : 
                        group === 3 ? group3CountryValue.includes('ar') : 
                        group === 4 ? group4CountryValue.includes('ar') :
                        group === 5 ? group5CountryValue.includes('ar') :
                        group === 6 ? group6CountryValue.includes('ar') :
                        group === 7 ? group7CountryValue.includes('ar') :
                        group8CountryValue.includes('ar')    
                    }                            
                    disabled={
                        selectedOption.includes('ar') &&
                        ((group !== 1 && group1CountryValue.includes('ar')) ||
                        (group !== 2 && group2CountryValue.includes('ar')) ||
                        (group !== 3 && group3CountryValue.includes('ar')) ||
                        (group !== 4 && group4CountryValue.includes('ar')) ||
                        (group !== 5 && group5CountryValue.includes('ar')) ||
                        (group !== 6 && group6CountryValue.includes('ar')) ||
                        (group !== 7 && group7CountryValue.includes('ar')) ||
                        (group !== 8 && group8CountryValue.includes('ar')))
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
                        group === 1 ? group1CountryValue.includes('bo') : 
                        group === 2 ? group2CountryValue.includes('bo') : 
                        group === 3 ? group3CountryValue.includes('bo') : 
                        group === 4 ? group4CountryValue.includes('bo') :
                        group === 5 ? group5CountryValue.includes('bo') :
                        group === 6 ? group6CountryValue.includes('bo') :
                        group === 7 ? group7CountryValue.includes('bo') :
                        group8CountryValue.includes('bo')    
                    }                            
                    disabled={
                        selectedOption.includes('bo') &&
                        ((group !== 1 && group1CountryValue.includes('bo')) ||
                        (group !== 2 && group2CountryValue.includes('bo')) ||
                        (group !== 3 && group3CountryValue.includes('bo')) ||
                        (group !== 4 && group4CountryValue.includes('bo')) ||
                        (group !== 5 && group5CountryValue.includes('bo')) ||
                        (group !== 6 && group6CountryValue.includes('bo')) ||
                        (group !== 7 && group7CountryValue.includes('bo')) ||
                        (group !== 8 && group8CountryValue.includes('bo')))
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
                        group === 1 ? group1CountryValue.includes('br') : 
                        group === 2 ? group2CountryValue.includes('br') : 
                        group === 3 ? group3CountryValue.includes('br') : 
                        group === 4 ? group4CountryValue.includes('br') :
                        group === 5 ? group5CountryValue.includes('br') :
                        group === 6 ? group6CountryValue.includes('br') :
                        group === 7 ? group7CountryValue.includes('br') :
                        group8CountryValue.includes('br')    
                    }                            
                    disabled={
                        selectedOption.includes('br') &&
                        ((group !== 1 && group1CountryValue.includes('br')) ||
                        (group !== 2 && group2CountryValue.includes('br')) ||
                        (group !== 3 && group3CountryValue.includes('br')) ||
                        (group !== 4 && group4CountryValue.includes('br')) ||
                        (group !== 5 && group5CountryValue.includes('br')) ||
                        (group !== 6 && group6CountryValue.includes('br')) ||
                        (group !== 7 && group7CountryValue.includes('br')) ||
                        (group !== 8 && group8CountryValue.includes('br')))
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
                        group === 1 ? group1CountryValue.includes('cl') : 
                        group === 2 ? group2CountryValue.includes('cl') : 
                        group === 3 ? group3CountryValue.includes('cl') : 
                        group === 4 ? group4CountryValue.includes('cl') :
                        group === 5 ? group5CountryValue.includes('cl') :
                        group === 6 ? group6CountryValue.includes('cl') :
                        group === 7 ? group7CountryValue.includes('cl') :
                        group8CountryValue.includes('cl')    
                    }                            
                    disabled={
                        selectedOption.includes('cl') &&
                        ((group !== 1 && group1CountryValue.includes('cl')) ||
                        (group !== 2 && group2CountryValue.includes('cl')) ||
                        (group !== 3 && group3CountryValue.includes('cl')) ||
                        (group !== 4 && group4CountryValue.includes('cl')) ||
                        (group !== 5 && group5CountryValue.includes('cl')) ||
                        (group !== 6 && group6CountryValue.includes('cl')) ||
                        (group !== 7 && group7CountryValue.includes('cl')) ||
                        (group !== 8 && group8CountryValue.includes('cl')))
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
                        group === 1 ? group1CountryValue.includes('co') : 
                        group === 2 ? group2CountryValue.includes('co') : 
                        group === 3 ? group3CountryValue.includes('co') : 
                        group === 4 ? group4CountryValue.includes('co') :
                        group === 5 ? group5CountryValue.includes('co') :
                        group === 6 ? group6CountryValue.includes('co') :
                        group === 7 ? group7CountryValue.includes('co') :
                        group8CountryValue.includes('co')    
                    }                            
                    disabled={
                        selectedOption.includes('co') &&
                        ((group !== 1 && group1CountryValue.includes('co')) ||
                        (group !== 2 && group2CountryValue.includes('co')) ||
                        (group !== 3 && group3CountryValue.includes('co')) ||
                        (group !== 4 && group4CountryValue.includes('co')) ||
                        (group !== 5 && group5CountryValue.includes('co')) ||
                        (group !== 6 && group6CountryValue.includes('co')) ||
                        (group !== 7 && group7CountryValue.includes('co')) ||
                        (group !== 8 && group8CountryValue.includes('co')))
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
                        group === 1 ? group1CountryValue.includes('ec') : 
                        group === 2 ? group2CountryValue.includes('ec') : 
                        group === 3 ? group3CountryValue.includes('ec') : 
                        group === 4 ? group4CountryValue.includes('ec') :
                        group === 5 ? group5CountryValue.includes('ec') :
                        group === 6 ? group6CountryValue.includes('ec') :
                        group === 7 ? group7CountryValue.includes('ec') :
                        group8CountryValue.includes('ec')    
                    }                            
                    disabled={
                        selectedOption.includes('ec') &&
                        ((group !== 1 && group1CountryValue.includes('ec')) ||
                        (group !== 2 && group2CountryValue.includes('ec')) ||
                        (group !== 3 && group3CountryValue.includes('ec')) ||
                        (group !== 4 && group4CountryValue.includes('ec')) ||
                        (group !== 5 && group5CountryValue.includes('ec')) ||
                        (group !== 6 && group6CountryValue.includes('ec')) ||
                        (group !== 7 && group7CountryValue.includes('ec')) ||
                        (group !== 8 && group8CountryValue.includes('ec')))
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
                        group === 1 ? group1CountryValue.includes('fk') : 
                        group === 2 ? group2CountryValue.includes('fk') : 
                        group === 3 ? group3CountryValue.includes('fk') : 
                        group === 4 ? group4CountryValue.includes('fk') :
                        group === 5 ? group5CountryValue.includes('fk') :
                        group === 6 ? group6CountryValue.includes('fk') :
                        group === 7 ? group7CountryValue.includes('fk') :
                        group8CountryValue.includes('fk')    
                    }                            
                    disabled={
                        selectedOption.includes('fk') &&
                        ((group !== 1 && group1CountryValue.includes('fk')) ||
                        (group !== 2 && group2CountryValue.includes('fk')) ||
                        (group !== 3 && group3CountryValue.includes('fk')) ||
                        (group !== 4 && group4CountryValue.includes('fk')) ||
                        (group !== 5 && group5CountryValue.includes('fk')) ||
                        (group !== 6 && group6CountryValue.includes('fk')) ||
                        (group !== 7 && group7CountryValue.includes('fk')) ||
                        (group !== 8 && group8CountryValue.includes('fk')))
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
                        group === 1 ? group1CountryValue.includes('gf') : 
                        group === 2 ? group2CountryValue.includes('gf') : 
                        group === 3 ? group3CountryValue.includes('gf') : 
                        group === 4 ? group4CountryValue.includes('gf') :
                        group === 5 ? group5CountryValue.includes('gf') :
                        group === 6 ? group6CountryValue.includes('gf') :
                        group === 7 ? group7CountryValue.includes('gf') :
                        group8CountryValue.includes('gf')    
                    }                            
                    disabled={
                        selectedOption.includes('gf') &&
                        ((group !== 1 && group1CountryValue.includes('gf')) ||
                        (group !== 2 && group2CountryValue.includes('gf')) ||
                        (group !== 3 && group3CountryValue.includes('gf')) ||
                        (group !== 4 && group4CountryValue.includes('gf')) ||
                        (group !== 5 && group5CountryValue.includes('gf')) ||
                        (group !== 6 && group6CountryValue.includes('gf')) ||
                        (group !== 7 && group7CountryValue.includes('gf')) ||
                        (group !== 8 && group8CountryValue.includes('gf')))
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
                        group === 1 ? group1CountryValue.includes('gy') : 
                        group === 2 ? group2CountryValue.includes('gy') : 
                        group === 3 ? group3CountryValue.includes('gy') : 
                        group === 4 ? group4CountryValue.includes('gy') :
                        group === 5 ? group5CountryValue.includes('gy') :
                        group === 6 ? group6CountryValue.includes('gy') :
                        group === 7 ? group7CountryValue.includes('gy') :
                        group8CountryValue.includes('gy')    
                    }                            
                    disabled={
                        selectedOption.includes('gy') &&
                        ((group !== 1 && group1CountryValue.includes('gy')) ||
                        (group !== 2 && group2CountryValue.includes('gy')) ||
                        (group !== 3 && group3CountryValue.includes('gy')) ||
                        (group !== 4 && group4CountryValue.includes('gy')) ||
                        (group !== 5 && group5CountryValue.includes('gy')) ||
                        (group !== 6 && group6CountryValue.includes('gy')) ||
                        (group !== 7 && group7CountryValue.includes('gy')) ||
                        (group !== 8 && group8CountryValue.includes('gy')))
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
                        group === 1 ? group1CountryValue.includes('py') : 
                        group === 2 ? group2CountryValue.includes('py') : 
                        group === 3 ? group3CountryValue.includes('py') : 
                        group === 4 ? group4CountryValue.includes('py') :
                        group === 5 ? group5CountryValue.includes('py') :
                        group === 6 ? group6CountryValue.includes('py') :
                        group === 7 ? group7CountryValue.includes('py') :
                        group8CountryValue.includes('py')    
                    }                            
                    disabled={
                        selectedOption.includes('py') &&
                        ((group !== 1 && group1CountryValue.includes('py')) ||
                        (group !== 2 && group2CountryValue.includes('py')) ||
                        (group !== 3 && group3CountryValue.includes('py')) ||
                        (group !== 4 && group4CountryValue.includes('py')) ||
                        (group !== 5 && group5CountryValue.includes('py')) ||
                        (group !== 6 && group6CountryValue.includes('py')) ||
                        (group !== 7 && group7CountryValue.includes('py')) ||
                        (group !== 8 && group8CountryValue.includes('py')))
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
                        group === 1 ? group1CountryValue.includes('pe') : 
                        group === 2 ? group2CountryValue.includes('pe') : 
                        group === 3 ? group3CountryValue.includes('pe') : 
                        group === 4 ? group4CountryValue.includes('pe') :
                        group === 5 ? group5CountryValue.includes('pe') :
                        group === 6 ? group6CountryValue.includes('pe') :
                        group === 7 ? group7CountryValue.includes('pe') :
                        group8CountryValue.includes('pe')    
                    }                            
                    disabled={
                        selectedOption.includes('pe') &&
                        ((group !== 1 && group1CountryValue.includes('pe')) ||
                        (group !== 2 && group2CountryValue.includes('pe')) ||
                        (group !== 3 && group3CountryValue.includes('pe')) ||
                        (group !== 4 && group4CountryValue.includes('pe')) ||
                        (group !== 5 && group5CountryValue.includes('pe')) ||
                        (group !== 6 && group6CountryValue.includes('pe')) ||
                        (group !== 7 && group7CountryValue.includes('pe')) ||
                        (group !== 8 && group8CountryValue.includes('pe')))
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
                        group === 1 ? group1CountryValue.includes('sr') : 
                        group === 2 ? group2CountryValue.includes('sr') : 
                        group === 3 ? group3CountryValue.includes('sr') : 
                        group === 4 ? group4CountryValue.includes('sr') :
                        group === 5 ? group5CountryValue.includes('sr') :
                        group === 6 ? group6CountryValue.includes('sr') :
                        group === 7 ? group7CountryValue.includes('sr') :
                        group8CountryValue.includes('sr')    
                    }                            
                    disabled={
                        selectedOption.includes('sr') &&
                        ((group !== 1 && group1CountryValue.includes('sr')) ||
                        (group !== 2 && group2CountryValue.includes('sr')) ||
                        (group !== 3 && group3CountryValue.includes('sr')) ||
                        (group !== 4 && group4CountryValue.includes('sr')) ||
                        (group !== 5 && group5CountryValue.includes('sr')) ||
                        (group !== 6 && group6CountryValue.includes('sr')) ||
                        (group !== 7 && group7CountryValue.includes('sr')) ||
                        (group !== 8 && group8CountryValue.includes('sr')))
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
                        group === 1 ? group1CountryValue.includes('uy') : 
                        group === 2 ? group2CountryValue.includes('uy') : 
                        group === 3 ? group3CountryValue.includes('uy') : 
                        group === 4 ? group4CountryValue.includes('uy') :
                        group === 5 ? group5CountryValue.includes('uy') :
                        group === 6 ? group6CountryValue.includes('uy') :
                        group === 7 ? group7CountryValue.includes('uy') :
                        group8CountryValue.includes('uy')    
                    }                            
                    disabled={
                        selectedOption.includes('uy') &&
                        ((group !== 1 && group1CountryValue.includes('uy')) ||
                        (group !== 2 && group2CountryValue.includes('uy')) ||
                        (group !== 3 && group3CountryValue.includes('uy')) ||
                        (group !== 4 && group4CountryValue.includes('uy')) ||
                        (group !== 5 && group5CountryValue.includes('uy')) ||
                        (group !== 6 && group6CountryValue.includes('uy')) ||
                        (group !== 7 && group7CountryValue.includes('uy')) ||
                        (group !== 8 && group8CountryValue.includes('uy')))
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
                        group === 1 ? group1CountryValue.includes('ve') : 
                        group === 2 ? group2CountryValue.includes('ve') : 
                        group === 3 ? group3CountryValue.includes('ve') : 
                        group === 4 ? group4CountryValue.includes('ve') :
                        group === 5 ? group5CountryValue.includes('ve') :
                        group === 6 ? group6CountryValue.includes('ve') :
                        group === 7 ? group7CountryValue.includes('ve') :
                        group8CountryValue.includes('ve')    
                    }                            
                    disabled={
                        selectedOption.includes('ve') &&
                        ((group !== 1 && group1CountryValue.includes('ve')) ||
                        (group !== 2 && group2CountryValue.includes('ve')) ||
                        (group !== 3 && group3CountryValue.includes('ve')) ||
                        (group !== 4 && group4CountryValue.includes('ve')) ||
                        (group !== 5 && group5CountryValue.includes('ve')) ||
                        (group !== 6 && group6CountryValue.includes('ve')) ||
                        (group !== 7 && group7CountryValue.includes('ve')) ||
                        (group !== 8 && group8CountryValue.includes('ve')))
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
                        group === 1 ? group1CountryValue.includes('au') : 
                        group === 2 ? group2CountryValue.includes('au') : 
                        group === 3 ? group3CountryValue.includes('au') : 
                        group === 4 ? group4CountryValue.includes('au') :
                        group === 5 ? group5CountryValue.includes('au') :
                        group === 6 ? group6CountryValue.includes('au') :
                        group === 7 ? group7CountryValue.includes('au') :
                        group8CountryValue.includes('au')    
                    }                            
                    disabled={
                        selectedOption.includes('au') &&
                        ((group !== 1 && group1CountryValue.includes('au')) ||
                        (group !== 2 && group2CountryValue.includes('au')) ||
                        (group !== 3 && group3CountryValue.includes('au')) ||
                        (group !== 4 && group4CountryValue.includes('au')) ||
                        (group !== 5 && group5CountryValue.includes('au')) ||
                        (group !== 6 && group6CountryValue.includes('au')) ||
                        (group !== 7 && group7CountryValue.includes('au')) ||
                        (group !== 8 && group8CountryValue.includes('au')))
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
                        group === 1 ? group1CountryValue.includes('fj') : 
                        group === 2 ? group2CountryValue.includes('fj') : 
                        group === 3 ? group3CountryValue.includes('fj') : 
                        group === 4 ? group4CountryValue.includes('fj') :
                        group === 5 ? group5CountryValue.includes('fj') :
                        group === 6 ? group6CountryValue.includes('fj') :
                        group === 7 ? group7CountryValue.includes('fj') :
                        group8CountryValue.includes('fj')    
                    }                            
                    disabled={
                        selectedOption.includes('fj') &&
                        ((group !== 1 && group1CountryValue.includes('fj')) ||
                        (group !== 2 && group2CountryValue.includes('fj')) ||
                        (group !== 3 && group3CountryValue.includes('fj')) ||
                        (group !== 4 && group4CountryValue.includes('fj')) ||
                        (group !== 5 && group5CountryValue.includes('fj')) ||
                        (group !== 6 && group6CountryValue.includes('fj')) ||
                        (group !== 7 && group7CountryValue.includes('fj')) ||
                        (group !== 8 && group8CountryValue.includes('fj')))
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
                        group === 1 ? group1CountryValue.includes('ki') : 
                        group === 2 ? group2CountryValue.includes('ki') : 
                        group === 3 ? group3CountryValue.includes('ki') : 
                        group === 4 ? group4CountryValue.includes('ki') :
                        group === 5 ? group5CountryValue.includes('ki') :
                        group === 6 ? group6CountryValue.includes('ki') :
                        group === 7 ? group7CountryValue.includes('ki') :
                        group8CountryValue.includes('ki')    
                    }                            
                    disabled={
                        selectedOption.includes('ki') &&
                        ((group !== 1 && group1CountryValue.includes('ki')) ||
                        (group !== 2 && group2CountryValue.includes('ki')) ||
                        (group !== 3 && group3CountryValue.includes('ki')) ||
                        (group !== 4 && group4CountryValue.includes('ki')) ||
                        (group !== 5 && group5CountryValue.includes('ki')) ||
                        (group !== 6 && group6CountryValue.includes('ki')) ||
                        (group !== 7 && group7CountryValue.includes('ki')) ||
                        (group !== 8 && group8CountryValue.includes('ki')))
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
                        group === 1 ? group1CountryValue.includes('mh') : 
                        group === 2 ? group2CountryValue.includes('mh') : 
                        group === 3 ? group3CountryValue.includes('mh') : 
                        group === 4 ? group4CountryValue.includes('mh') :
                        group === 5 ? group5CountryValue.includes('mh') :
                        group === 6 ? group6CountryValue.includes('mh') :
                        group === 7 ? group7CountryValue.includes('mh') :
                        group8CountryValue.includes('mh')    
                    }                            
                    disabled={
                        selectedOption.includes('mh') &&
                        ((group !== 1 && group1CountryValue.includes('mh')) ||
                        (group !== 2 && group2CountryValue.includes('mh')) ||
                        (group !== 3 && group3CountryValue.includes('mh')) ||
                        (group !== 4 && group4CountryValue.includes('mh')) ||
                        (group !== 5 && group5CountryValue.includes('mh')) ||
                        (group !== 6 && group6CountryValue.includes('mh')) ||
                        (group !== 7 && group7CountryValue.includes('mh')) ||
                        (group !== 8 && group8CountryValue.includes('mh')))
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
                        group === 1 ? group1CountryValue.includes('fm') : 
                        group === 2 ? group2CountryValue.includes('fm') : 
                        group === 3 ? group3CountryValue.includes('fm') : 
                        group === 4 ? group4CountryValue.includes('fm') :
                        group === 5 ? group5CountryValue.includes('fm') :
                        group === 6 ? group6CountryValue.includes('fm') :
                        group === 7 ? group7CountryValue.includes('fm') :
                        group8CountryValue.includes('fm')    
                    }                            
                    disabled={
                        selectedOption.includes('fm') &&
                        ((group !== 1 && group1CountryValue.includes('fm')) ||
                        (group !== 2 && group2CountryValue.includes('fm')) ||
                        (group !== 3 && group3CountryValue.includes('fm')) ||
                        (group !== 4 && group4CountryValue.includes('fm')) ||
                        (group !== 5 && group5CountryValue.includes('fm')) ||
                        (group !== 6 && group6CountryValue.includes('fm')) ||
                        (group !== 7 && group7CountryValue.includes('fm')) ||
                        (group !== 8 && group8CountryValue.includes('fm')))
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
                        group === 1 ? group1CountryValue.includes('nr') : 
                        group === 2 ? group2CountryValue.includes('nr') : 
                        group === 3 ? group3CountryValue.includes('nr') : 
                        group === 4 ? group4CountryValue.includes('nr') :
                        group === 5 ? group5CountryValue.includes('nr') :
                        group === 6 ? group6CountryValue.includes('nr') :
                        group === 7 ? group7CountryValue.includes('nr') :
                        group8CountryValue.includes('nr')    
                    }                            
                    disabled={
                        selectedOption.includes('nr') &&
                        ((group !== 1 && group1CountryValue.includes('nr')) ||
                        (group !== 2 && group2CountryValue.includes('nr')) ||
                        (group !== 3 && group3CountryValue.includes('nr')) ||
                        (group !== 4 && group4CountryValue.includes('nr')) ||
                        (group !== 5 && group5CountryValue.includes('nr')) ||
                        (group !== 6 && group6CountryValue.includes('nr')) ||
                        (group !== 7 && group7CountryValue.includes('nr')) ||
                        (group !== 8 && group8CountryValue.includes('nr')))
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
                        group === 1 ? group1CountryValue.includes('nc') : 
                        group === 2 ? group2CountryValue.includes('nc') : 
                        group === 3 ? group3CountryValue.includes('nc') : 
                        group === 4 ? group4CountryValue.includes('nc') :
                        group === 5 ? group5CountryValue.includes('nc') :
                        group === 6 ? group6CountryValue.includes('nc') :
                        group === 7 ? group7CountryValue.includes('nc') :
                        group8CountryValue.includes('nc')    
                    }                            
                    disabled={
                        selectedOption.includes('nc') &&
                        ((group !== 1 && group1CountryValue.includes('nc')) ||
                        (group !== 2 && group2CountryValue.includes('nc')) ||
                        (group !== 3 && group3CountryValue.includes('nc')) ||
                        (group !== 4 && group4CountryValue.includes('nc')) ||
                        (group !== 5 && group5CountryValue.includes('nc')) ||
                        (group !== 6 && group6CountryValue.includes('nc')) ||
                        (group !== 7 && group7CountryValue.includes('nc')) ||
                        (group !== 8 && group8CountryValue.includes('nc')))
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
                        group === 1 ? group1CountryValue.includes('nz') : 
                        group === 2 ? group2CountryValue.includes('nz') : 
                        group === 3 ? group3CountryValue.includes('nz') : 
                        group === 4 ? group4CountryValue.includes('nz') :
                        group === 5 ? group5CountryValue.includes('nz') :
                        group === 6 ? group6CountryValue.includes('nz') :
                        group === 7 ? group7CountryValue.includes('nz') :
                        group8CountryValue.includes('nz')    
                    }                            
                    disabled={
                        selectedOption.includes('nz') &&
                        ((group !== 1 && group1CountryValue.includes('nz')) ||
                        (group !== 2 && group2CountryValue.includes('nz')) ||
                        (group !== 3 && group3CountryValue.includes('nz')) ||
                        (group !== 4 && group4CountryValue.includes('nz')) ||
                        (group !== 5 && group5CountryValue.includes('nz')) ||
                        (group !== 6 && group6CountryValue.includes('nz')) ||
                        (group !== 7 && group7CountryValue.includes('nz')) ||
                        (group !== 8 && group8CountryValue.includes('nz')))
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
                        group === 1 ? group1CountryValue.includes('pw') : 
                        group === 2 ? group2CountryValue.includes('pw') : 
                        group === 3 ? group3CountryValue.includes('pw') : 
                        group === 4 ? group4CountryValue.includes('pw') :
                        group === 5 ? group5CountryValue.includes('pw') :
                        group === 6 ? group6CountryValue.includes('pw') :
                        group === 7 ? group7CountryValue.includes('pw') :
                        group8CountryValue.includes('pw')    
                    }                            
                    disabled={
                        selectedOption.includes('pw') &&
                        ((group !== 1 && group1CountryValue.includes('pw')) ||
                        (group !== 2 && group2CountryValue.includes('pw')) ||
                        (group !== 3 && group3CountryValue.includes('pw')) ||
                        (group !== 4 && group4CountryValue.includes('pw')) ||
                        (group !== 5 && group5CountryValue.includes('pw')) ||
                        (group !== 6 && group6CountryValue.includes('pw')) ||
                        (group !== 7 && group7CountryValue.includes('pw')) ||
                        (group !== 8 && group8CountryValue.includes('pw')))
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
                        group === 1 ? group1CountryValue.includes('pg') : 
                        group === 2 ? group2CountryValue.includes('pg') : 
                        group === 3 ? group3CountryValue.includes('pg') : 
                        group === 4 ? group4CountryValue.includes('pg') :
                        group === 5 ? group5CountryValue.includes('pg') :
                        group === 6 ? group6CountryValue.includes('pg') :
                        group === 7 ? group7CountryValue.includes('pg') :
                        group8CountryValue.includes('pg')    
                    }                            
                    disabled={
                        selectedOption.includes('pg') &&
                        ((group !== 1 && group1CountryValue.includes('pg')) ||
                        (group !== 2 && group2CountryValue.includes('pg')) ||
                        (group !== 3 && group3CountryValue.includes('pg')) ||
                        (group !== 4 && group4CountryValue.includes('pg')) ||
                        (group !== 5 && group5CountryValue.includes('pg')) ||
                        (group !== 6 && group6CountryValue.includes('pg')) ||
                        (group !== 7 && group7CountryValue.includes('pg')) ||
                        (group !== 8 && group8CountryValue.includes('pg')))
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
                        group === 1 ? group1CountryValue.includes('ws') : 
                        group === 2 ? group2CountryValue.includes('ws') : 
                        group === 3 ? group3CountryValue.includes('ws') : 
                        group === 4 ? group4CountryValue.includes('ws') :
                        group === 5 ? group5CountryValue.includes('ws') :
                        group === 6 ? group6CountryValue.includes('ws') :
                        group === 7 ? group7CountryValue.includes('ws') :
                        group8CountryValue.includes('ws')    
                    }                            
                    disabled={
                        selectedOption.includes('ws') &&
                        ((group !== 1 && group1CountryValue.includes('ws')) ||
                        (group !== 2 && group2CountryValue.includes('ws')) ||
                        (group !== 3 && group3CountryValue.includes('ws')) ||
                        (group !== 4 && group4CountryValue.includes('ws')) ||
                        (group !== 5 && group5CountryValue.includes('ws')) ||
                        (group !== 6 && group6CountryValue.includes('ws')) ||
                        (group !== 7 && group7CountryValue.includes('ws')) ||
                        (group !== 8 && group8CountryValue.includes('ws')))
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
                        group === 1 ? group1CountryValue.includes('sb') : 
                        group === 2 ? group2CountryValue.includes('sb') : 
                        group === 3 ? group3CountryValue.includes('sb') : 
                        group === 4 ? group4CountryValue.includes('sb') :
                        group === 5 ? group5CountryValue.includes('sb') :
                        group === 6 ? group6CountryValue.includes('sb') :
                        group === 7 ? group7CountryValue.includes('sb') :
                        group8CountryValue.includes('sb')    
                    }                            
                    disabled={
                        selectedOption.includes('sb') &&
                        ((group !== 1 && group1CountryValue.includes('sb')) ||
                        (group !== 2 && group2CountryValue.includes('sb')) ||
                        (group !== 3 && group3CountryValue.includes('sb')) ||
                        (group !== 4 && group4CountryValue.includes('sb')) ||
                        (group !== 5 && group5CountryValue.includes('sb')) ||
                        (group !== 6 && group6CountryValue.includes('sb')) ||
                        (group !== 7 && group7CountryValue.includes('sb')) ||
                        (group !== 8 && group8CountryValue.includes('sb')))
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
                        group === 1 ? group1CountryValue.includes('to') : 
                        group === 2 ? group2CountryValue.includes('to') : 
                        group === 3 ? group3CountryValue.includes('to') : 
                        group === 4 ? group4CountryValue.includes('to') :
                        group === 5 ? group5CountryValue.includes('to') :
                        group === 6 ? group6CountryValue.includes('to') :
                        group === 7 ? group7CountryValue.includes('to') :
                        group8CountryValue.includes('to')    
                    }                            
                    disabled={
                        selectedOption.includes('to') &&
                        ((group !== 1 && group1CountryValue.includes('to')) ||
                        (group !== 2 && group2CountryValue.includes('to')) ||
                        (group !== 3 && group3CountryValue.includes('to')) ||
                        (group !== 4 && group4CountryValue.includes('to')) ||
                        (group !== 5 && group5CountryValue.includes('to')) ||
                        (group !== 6 && group6CountryValue.includes('to')) ||
                        (group !== 7 && group7CountryValue.includes('to')) ||
                        (group !== 8 && group8CountryValue.includes('to')))
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
                        group === 1 ? group1CountryValue.includes('tv') : 
                        group === 2 ? group2CountryValue.includes('tv') : 
                        group === 3 ? group3CountryValue.includes('tv') : 
                        group === 4 ? group4CountryValue.includes('tv') :
                        group === 5 ? group5CountryValue.includes('tv') :
                        group === 6 ? group6CountryValue.includes('tv') :
                        group === 7 ? group7CountryValue.includes('tv') :
                        group8CountryValue.includes('tv')    
                    }                            
                    disabled={
                        selectedOption.includes('tv') &&
                        ((group !== 1 && group1CountryValue.includes('tv')) ||
                        (group !== 2 && group2CountryValue.includes('tv')) ||
                        (group !== 3 && group3CountryValue.includes('tv')) ||
                        (group !== 4 && group4CountryValue.includes('tv')) ||
                        (group !== 5 && group5CountryValue.includes('tv')) ||
                        (group !== 6 && group6CountryValue.includes('tv')) ||
                        (group !== 7 && group7CountryValue.includes('tv')) ||
                        (group !== 8 && group8CountryValue.includes('tv')))
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
                        group === 1 ? group1CountryValue.includes('vu') : 
                        group === 2 ? group2CountryValue.includes('vu') : 
                        group === 3 ? group3CountryValue.includes('vu') : 
                        group === 4 ? group4CountryValue.includes('vu') :
                        group === 5 ? group5CountryValue.includes('vu') :
                        group === 6 ? group6CountryValue.includes('vu') :
                        group === 7 ? group7CountryValue.includes('vu') :
                        group8CountryValue.includes('vu')    
                    }                            
                    disabled={
                        selectedOption.includes('vu') &&
                        ((group !== 1 && group1CountryValue.includes('vu')) ||
                        (group !== 2 && group2CountryValue.includes('vu')) ||
                        (group !== 3 && group3CountryValue.includes('vu')) ||
                        (group !== 4 && group4CountryValue.includes('vu')) ||
                        (group !== 5 && group5CountryValue.includes('vu')) ||
                        (group !== 6 && group6CountryValue.includes('vu')) ||
                        (group !== 7 && group7CountryValue.includes('vu')) ||
                        (group !== 8 && group8CountryValue.includes('vu')))
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

