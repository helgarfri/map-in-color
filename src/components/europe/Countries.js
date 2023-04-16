import '../App.css'
import { useEffect } from 'react';




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
        const allCountryIds = document.getElementsByClassName("country-eu");

        
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
                        <label className='country-label-eu'>Albania</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ad'
                            className="country-eu"
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
                        <label className='country-label-eu'>Andorra</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='at'
                            className="country-eu"
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
                        <label className='country-label-eu'>Austria</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='by'
                            className="country-eu"
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
                        <label className='country-label-eu'>Belarus</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='be'
                            className="country-eu"
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
                        <label className='country-label-eu'>Belgium</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ba'
                            className="country-eu"
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
                        <label className='country-label-eu'>Bosnia and Herzegovina</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='bg'
                            className="country-eu"
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
                        <label className='country-label-eu'>Bulgaria</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='hr'
                            className="country-eu"
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
                        <label className='country-label-eu'>Croatia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='cy'
                            className="country-eu"
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
                        <label className='country-label-eu'>Cyprus</label>
                    </li>

               

                    <li>
                        <input  
                            type='checkbox' 
                            value='cz'
                            className="country-eu"
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
                        <label className='country-label-eu'>Czech Republic</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='dk'
                            className="country-eu"
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
                        <label className='country-label-eu'>Denmark</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ee'
                            className="country-eu"
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
                        <label className='country-label-eu'>Estonia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='fo'
                            className="country-eu"
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
                        <label className='country-label-eu'>Faroe Islands</label>
                    </li>


                    <li>
                        <input  
                            type='checkbox' 
                            value='fi'
                            className="country-eu"
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
                        <label className='country-label-eu'>Finland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='fr'
                            className="country-eu"
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
                        <label className='country-label-eu'>France</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='de'
                            className="country-eu"
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
                        <label className='country-label-eu'>Germany</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='gr'
                            className="country-eu"
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
                        <label className='country-label-eu'>Greece</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='gl'
                            className="country-eu"
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
                        <label className='country-label-eu'>Greenland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='hu'
                            className="country-eu"
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
                        <label className='country-label-eu'>Hungary</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='is'
                            className="country-eu"
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
                        <label className='country-label-eu'>Iceland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ie'
                            className="country-eu"
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
                        <label className='country-label-eu'>Ireland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='it'
                            className="country-eu"
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
                        <label className='country-label-eu'>Italy</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='xk'
                            className="country-eu"
                            onChange={handleChange} 
                            
                            
                            checked={
                                group === 1 ? group1CountryValue.includes('xk') : 
                                group === 2 ? group2CountryValue.includes('xk') : 
                                group === 3 ? group3CountryValue.includes('xk') : 
                                group === 4 ? group4CountryValue.includes('xk') :
                                group === 5 ? group5CountryValue.includes('xk') :
                                group === 6 ? group6CountryValue.includes('xk') :
                                group === 7 ? group7CountryValue.includes('xk') :
                                group8CountryValue.includes('xk')
                            }
                            disabled={
                                selectedOption.includes('xk') &&
                                ((group !== 1 && group1CountryValue.includes('xk')) ||
                                (group !== 2 && group2CountryValue.includes('xk')) ||
                                (group !== 3 && group3CountryValue.includes('xk')) ||
                                (group !== 4 && group4CountryValue.includes('xk')) ||
                                (group !== 5 && group5CountryValue.includes('xk')) ||
                                (group !== 6 && group6CountryValue.includes('xk')) ||
                                (group !== 7 && group7CountryValue.includes('xk')) ||
                                (group !== 8 && group8CountryValue.includes('xk')))
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
                        <label className='country-label-eu'>Latvia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='li'
                            className="country-eu"
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
                        <label className='country-label-eu'>Liechtenstein</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='lt'
                            className="country-eu"
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
                        <label className='country-label-eu'>Lithuania</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='lu'
                            className="country-eu"
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
                        <label className='country-label-eu'>Luxembourg</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='mt'
                            className="country-eu"
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
                        <label className='country-label-eu'>Malta</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='md'
                            className="country-eu"
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
                        <label className='country-label-eu'>Moldova</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='mc'
                            className="country-eu"
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
                        <label className='country-label-eu'>Monaco</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='me'
                            className="country-eu"
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
                        <label className='country-label-eu'>Montenegro</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='nl'
                            className="country-eu"
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
                        <label className='country-label-eu'>Netherlands</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='mk'
                            className="country-eu"
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
                        <label className='country-label-eu'>North Macedonia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='no'
                            className="country-eu"
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
                        <label className='country-label-eu'>Norway</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='pl'
                            className="country-eu"
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
                        <label className='country-label-eu'>Poland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='pt'
                            className="country-eu"
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
                        <label className='country-label-eu'>Portugal</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ro'
                            className="country-eu"
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
                        <label className='country-label-eu'>Romania</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ru'
                            className="country-eu"
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
                        <label className='country-label-eu'>Russia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='sm'
                            className="country-eu"
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
                        <label className='country-label-eu'>San Marino</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='rs'
                            className="country-eu"
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
                        <label className='country-label-eu'>Serbia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='sk'
                            className="country-eu"
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
                        <label className='country-label-eu'>Slovakia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='si'
                            className="country-eu"
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
                        <label className='country-label-eu'>Slovenia</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='es'
                            className="country-eu"
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
                        <label className='country-label-eu'>Spain</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='se'
                            className="country-eu"
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
                        <label className='country-label-eu'>Sweden</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ch'
                            className="country-eu"
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
                        <label className='country-label-eu'>Switzerland</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='tr'
                            className="country-eu"
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
                        <label className='country-label-eu'>Turkey</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='ua'
                            className="country-eu"
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
                        <label className='country-label-eu'>Ukraine</label>
                    </li>

                    <li>
                        <input  
                            type='checkbox' 
                            value='gb'
                            className="country-eu"
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
                        <label className='country-label-eu'>United Kingdom</label>
                    </li>
                </ul>
            </div>

        </div>
    )

}
export default Countries