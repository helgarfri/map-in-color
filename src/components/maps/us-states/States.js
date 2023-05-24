import '../../App.css'
import { useEffect } from 'react';
function States({
    group,
    
    group1ColorValue, 
    group2ColorValue, 
    group3ColorValue,
    group4ColorValue,
    group5ColorValue,
    group6ColorValue,
    group7ColorValue,
    group8ColorValue,
    
    group1StatesValue,
    group2StatesValue,
    group3StatesValue,
    group4StatesValue,
    group5StatesValue,
    group6StatesValue,
    group7StatesValue,
    group8StatesValue,

    setGroup1StatesValue,
    setGroup2StatesValue,
    setGroup3StatesValue,
    setGroup4StatesValue,
    setGroup5StatesValue,
    setGroup6StatesValue,
    setGroup7StatesValue,
    setGroup8StatesValue,

    selectedOption,
    setSelectedOption
    

    
    
}) {
    useEffect(() => {
        // get a list of all the states
        const allStatesId = document.getElementsByClassName("states");

        if (
            group === 1 || 
            group === 2 || 
            group === 3 || 
            group === 4 || 
            group === 5 || 
            group === 6 || 
            group === 7 ||
            group === 8) {
          
                const groups = [
                    group1StatesValue,
                    group2StatesValue,
                    group3StatesValue,
                    group4StatesValue,
                    group5StatesValue,
                    group6StatesValue,
                    group7StatesValue,
                    group8StatesValue,
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
                  
                  groups.forEach((groupStatesValue, index) => {
                    if (groupStatesValue.length > 0) {
                      groupStatesValue.forEach((id) => {
                        document.getElementById(id).style.fill = colors[index];
                      });
                    }
                  });
                  
          
          
          
          
          // loop through all the countries and set their fill color back to the default
          for (var i = 0; i < allStatesId.length; i++) {
            const id = allStatesId[i].value;
            if (
                !group1StatesValue.includes(id) && 
                !group2StatesValue.includes(id) && 
                !group3StatesValue.includes(id) && 
                !group4StatesValue.includes(id) &&
                !group5StatesValue.includes(id) &&
                !group6StatesValue.includes(id) &&
                !group7StatesValue.includes(id) &&
                !group8StatesValue.includes(id)
    
    
                ) {
              document.getElementById(id).style.fill = "#c0c0c0";
            }
          }
        }
      },);
        
          const handleChange = (event) => {
            const selectedOption = event.target.value;

            setSelectedOption(prevSelectedOption => prevSelectedOption.includes(selectedOption)
        ? prevSelectedOption.filter(option => option !== selectedOption)
        : [...prevSelectedOption, selectedOption]
      );

            if (group === 1) {
              if (group1StatesValue.includes(selectedOption)) {
                setGroup1StatesValue(group1StatesValue.filter((o) => o !== selectedOption));
              } else {
                setGroup1StatesValue([...group1StatesValue, selectedOption]);
              }
                
    
              
    
            } else if (group === 2) {
              if (group2StatesValue.includes(selectedOption)) {
                setGroup2StatesValue(group2StatesValue.filter((o) => o !== selectedOption));
              } else {
                setGroup2StatesValue([...group2StatesValue, selectedOption]);
              }
            
            
            }else if (group === 3) {
                if (group3StatesValue.includes(selectedOption)) {
                    setGroup3StatesValue(group3StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setGroup3StatesValue([...group3StatesValue, selectedOption]);
                }
              }
    
              else if (group === 4) {
                if (group4StatesValue.includes(selectedOption)) {
                    setGroup4StatesValue(group4StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setGroup4StatesValue([...group4StatesValue, selectedOption]);
                } 
                
              }
    
              else if (group === 5) {
                if (group5StatesValue.includes(selectedOption)) {
                    setGroup5StatesValue(group5StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setGroup5StatesValue([...group5StatesValue, selectedOption]);
                }
    
            } 
    
            else if (group === 6) {
                if (group6StatesValue.includes(selectedOption)) {
                    setGroup6StatesValue(group6StatesValue.filter((o) => o !== selectedOption));
                } else {
                    setGroup6StatesValue([...group6StatesValue, selectedOption]);
                }
           
          } 
          else if (group === 7) {
            if (group7StatesValue.includes(selectedOption)) {
                setGroup7StatesValue(group7StatesValue.filter((o) => o !== selectedOption));
            } else {
                setGroup7StatesValue([...group7StatesValue, selectedOption]);
            }
       
      }  else if (group === 8) {
        if (group8StatesValue.includes(selectedOption)) {
            setGroup8StatesValue(group8StatesValue.filter((o) => o !== selectedOption));
        } else {
            setGroup8StatesValue([...group8StatesValue, selectedOption]);
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
                                group === 1 ? group1StatesValue.includes('al') : 
                                group === 2 ? group2StatesValue.includes('al') : 
                                group === 3 ? group3StatesValue.includes('al') : 
                                group === 4 ? group4StatesValue.includes('al') :
                                group === 5 ? group5StatesValue.includes('al') :
                                group === 6 ? group6StatesValue.includes('al') :
                                group === 7 ? group7StatesValue.includes('al') :
                                group8StatesValue.includes('al')
                            }
                            disabled={
                                selectedOption.includes('al') &&
                                ((group !== 1 && group1StatesValue.includes('al')) ||
                                (group !== 2 && group2StatesValue.includes('al')) ||
                                (group !== 3 && group3StatesValue.includes('al')) ||
                                (group !== 4 && group4StatesValue.includes('al')) ||
                                (group !== 5 && group5StatesValue.includes('al')) ||
                                (group !== 6 && group6StatesValue.includes('al')) ||
                                (group !== 7 && group7StatesValue.includes('al')) ||
                                (group !== 8 && group8StatesValue.includes('al')))
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
                                group === 1 ? group1StatesValue.includes('ak') : 
                                group === 2 ? group2StatesValue.includes('ak') : 
                                group === 3 ? group3StatesValue.includes('ak') : 
                                group === 4 ? group4StatesValue.includes('ak') :
                                group === 5 ? group5StatesValue.includes('ak') :
                                group === 6 ? group6StatesValue.includes('ak') :
                                group === 7 ? group7StatesValue.includes('ak') :
                                group8StatesValue.includes('ak')
                            }
                            disabled={
                                selectedOption.includes('ak') &&
                                ((group !== 1 && group1StatesValue.includes('ak')) ||
                                (group !== 2 && group2StatesValue.includes('ak')) ||
                                (group !== 3 && group3StatesValue.includes('ak')) ||
                                (group !== 4 && group4StatesValue.includes('ak')) ||
                                (group !== 5 && group5StatesValue.includes('ak')) ||
                                (group !== 6 && group6StatesValue.includes('ak')) ||
                                (group !== 7 && group7StatesValue.includes('ak')) ||
                                (group !== 8 && group8StatesValue.includes('ak')))
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
                                group === 1 ? group1StatesValue.includes('az') : 
                                group === 2 ? group2StatesValue.includes('az') : 
                                group === 3 ? group3StatesValue.includes('az') : 
                                group === 4 ? group4StatesValue.includes('az') :
                                group === 5 ? group5StatesValue.includes('az') :
                                group === 6 ? group6StatesValue.includes('az') :
                                group === 7 ? group7StatesValue.includes('az') :
                                group8StatesValue.includes('az')
                            }
                            disabled={
                                selectedOption.includes('az') &&
                                ((group !== 1 && group1StatesValue.includes('az')) ||
                                (group !== 2 && group2StatesValue.includes('az')) ||
                                (group !== 3 && group3StatesValue.includes('az')) ||
                                (group !== 4 && group4StatesValue.includes('az')) ||
                                (group !== 5 && group5StatesValue.includes('az')) ||
                                (group !== 6 && group6StatesValue.includes('az')) ||
                                (group !== 7 && group7StatesValue.includes('az')) ||
                                (group !== 8 && group8StatesValue.includes('az')))
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
                                group === 1 ? group1StatesValue.includes('ar') : 
                                group === 2 ? group2StatesValue.includes('ar') : 
                                group === 3 ? group3StatesValue.includes('ar') : 
                                group === 4 ? group4StatesValue.includes('ar') :
                                group === 5 ? group5StatesValue.includes('ar') :
                                group === 6 ? group6StatesValue.includes('ar') :
                                group === 7 ? group7StatesValue.includes('ar') :
                                group8StatesValue.includes('ar')
                            }
                            disabled={
                                selectedOption.includes('ar') &&
                                ((group !== 1 && group1StatesValue.includes('ar')) ||
                                (group !== 2 && group2StatesValue.includes('ar')) ||
                                (group !== 3 && group3StatesValue.includes('ar')) ||
                                (group !== 4 && group4StatesValue.includes('ar')) ||
                                (group !== 5 && group5StatesValue.includes('ar')) ||
                                (group !== 6 && group6StatesValue.includes('ar')) ||
                                (group !== 7 && group7StatesValue.includes('ar')) ||
                                (group !== 8 && group8StatesValue.includes('ar')))
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
                                group === 1 ? group1StatesValue.includes('ca') : 
                                group === 2 ? group2StatesValue.includes('ca') : 
                                group === 3 ? group3StatesValue.includes('ca') : 
                                group === 4 ? group4StatesValue.includes('ca') :
                                group === 5 ? group5StatesValue.includes('ca') :
                                group === 6 ? group6StatesValue.includes('ca') :
                                group === 7 ? group7StatesValue.includes('ca') :
                                group8StatesValue.includes('ca')
                            }
                            disabled={
                                selectedOption.includes('ca') &&
                                ((group !== 1 && group1StatesValue.includes('ca')) ||
                                (group !== 2 && group2StatesValue.includes('ca')) ||
                                (group !== 3 && group3StatesValue.includes('ca')) ||
                                (group !== 4 && group4StatesValue.includes('ca')) ||
                                (group !== 5 && group5StatesValue.includes('ca')) ||
                                (group !== 6 && group6StatesValue.includes('ca')) ||
                                (group !== 7 && group7StatesValue.includes('ca')) ||
                                (group !== 8 && group8StatesValue.includes('ca')))
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
                                group === 1 ? group1StatesValue.includes('co') : 
                                group === 2 ? group2StatesValue.includes('co') : 
                                group === 3 ? group3StatesValue.includes('co') : 
                                group === 4 ? group4StatesValue.includes('co') :
                                group === 5 ? group5StatesValue.includes('co') :
                                group === 6 ? group6StatesValue.includes('co') :
                                group === 7 ? group7StatesValue.includes('co') :
                                group8StatesValue.includes('co')
                            }
                            disabled={
                                selectedOption.includes('co') &&
                                ((group !== 1 && group1StatesValue.includes('co')) ||
                                (group !== 2 && group2StatesValue.includes('co')) ||
                                (group !== 3 && group3StatesValue.includes('co')) ||
                                (group !== 4 && group4StatesValue.includes('co')) ||
                                (group !== 5 && group5StatesValue.includes('co')) ||
                                (group !== 6 && group6StatesValue.includes('co')) ||
                                (group !== 7 && group7StatesValue.includes('co')) ||
                                (group !== 8 && group8StatesValue.includes('co')))
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
                                group === 1 ? group1StatesValue.includes('ct') : 
                                group === 2 ? group2StatesValue.includes('ct') : 
                                group === 3 ? group3StatesValue.includes('ct') : 
                                group === 4 ? group4StatesValue.includes('ct') :
                                group === 5 ? group5StatesValue.includes('ct') :
                                group === 6 ? group6StatesValue.includes('ct') :
                                group === 7 ? group7StatesValue.includes('ct') :
                                group8StatesValue.includes('ct')
                            }
                            disabled={
                                selectedOption.includes('ct') &&
                                ((group !== 1 && group1StatesValue.includes('ct')) ||
                                (group !== 2 && group2StatesValue.includes('ct')) ||
                                (group !== 3 && group3StatesValue.includes('ct')) ||
                                (group !== 4 && group4StatesValue.includes('ct')) ||
                                (group !== 5 && group5StatesValue.includes('ct')) ||
                                (group !== 6 && group6StatesValue.includes('ct')) ||
                                (group !== 7 && group7StatesValue.includes('ct')) ||
                                (group !== 8 && group8StatesValue.includes('ct')))
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
                                group === 1 ? group1StatesValue.includes('de') : 
                                group === 2 ? group2StatesValue.includes('de') : 
                                group === 3 ? group3StatesValue.includes('de') : 
                                group === 4 ? group4StatesValue.includes('de') :
                                group === 5 ? group5StatesValue.includes('de') :
                                group === 6 ? group6StatesValue.includes('de') :
                                group === 7 ? group7StatesValue.includes('de') :
                                group8StatesValue.includes('de')
                            }
                            disabled={
                                selectedOption.includes('de') &&
                                ((group !== 1 && group1StatesValue.includes('de')) ||
                                (group !== 2 && group2StatesValue.includes('de')) ||
                                (group !== 3 && group3StatesValue.includes('de')) ||
                                (group !== 4 && group4StatesValue.includes('de')) ||
                                (group !== 5 && group5StatesValue.includes('de')) ||
                                (group !== 6 && group6StatesValue.includes('de')) ||
                                (group !== 7 && group7StatesValue.includes('de')) ||
                                (group !== 8 && group8StatesValue.includes('de')))
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
                                group === 1 ? group1StatesValue.includes('fl') : 
                                group === 2 ? group2StatesValue.includes('fl') : 
                                group === 3 ? group3StatesValue.includes('fl') : 
                                group === 4 ? group4StatesValue.includes('fl') :
                                group === 5 ? group5StatesValue.includes('fl') :
                                group === 6 ? group6StatesValue.includes('fl') :
                                group === 7 ? group7StatesValue.includes('fl') :
                                group8StatesValue.includes('fl')
                            }
                            disabled={
                                selectedOption.includes('fl') &&
                                ((group !== 1 && group1StatesValue.includes('fl')) ||
                                (group !== 2 && group2StatesValue.includes('fl')) ||
                                (group !== 3 && group3StatesValue.includes('fl')) ||
                                (group !== 4 && group4StatesValue.includes('fl')) ||
                                (group !== 5 && group5StatesValue.includes('fl')) ||
                                (group !== 6 && group6StatesValue.includes('fl')) ||
                                (group !== 7 && group7StatesValue.includes('fl')) ||
                                (group !== 8 && group8StatesValue.includes('fl')))
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
                                group === 1 ? group1StatesValue.includes('ga') : 
                                group === 2 ? group2StatesValue.includes('ga') : 
                                group === 3 ? group3StatesValue.includes('ga') : 
                                group === 4 ? group4StatesValue.includes('ga') :
                                group === 5 ? group5StatesValue.includes('ga') :
                                group === 6 ? group6StatesValue.includes('ga') :
                                group === 7 ? group7StatesValue.includes('ga') :
                                group8StatesValue.includes('ga')
                            }
                            disabled={
                                selectedOption.includes('ga') &&
                                ((group !== 1 && group1StatesValue.includes('ga')) ||
                                (group !== 2 && group2StatesValue.includes('ga')) ||
                                (group !== 3 && group3StatesValue.includes('ga')) ||
                                (group !== 4 && group4StatesValue.includes('ga')) ||
                                (group !== 5 && group5StatesValue.includes('ga')) ||
                                (group !== 6 && group6StatesValue.includes('ga')) ||
                                (group !== 7 && group7StatesValue.includes('ga')) ||
                                (group !== 8 && group8StatesValue.includes('ga')))
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
                                group === 1 ? group1StatesValue.includes('hi') : 
                                group === 2 ? group2StatesValue.includes('hi') : 
                                group === 3 ? group3StatesValue.includes('hi') : 
                                group === 4 ? group4StatesValue.includes('hi') :
                                group === 5 ? group5StatesValue.includes('hi') :
                                group === 6 ? group6StatesValue.includes('hi') :
                                group === 7 ? group7StatesValue.includes('hi') :
                                group8StatesValue.includes('hi')
                            }
                            disabled={
                                selectedOption.includes('hi') &&
                                ((group !== 1 && group1StatesValue.includes('hi')) ||
                                (group !== 2 && group2StatesValue.includes('hi')) ||
                                (group !== 3 && group3StatesValue.includes('hi')) ||
                                (group !== 4 && group4StatesValue.includes('hi')) ||
                                (group !== 5 && group5StatesValue.includes('hi')) ||
                                (group !== 6 && group6StatesValue.includes('hi')) ||
                                (group !== 7 && group7StatesValue.includes('hi')) ||
                                (group !== 8 && group8StatesValue.includes('hi')))
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
                                group === 1 ? group1StatesValue.includes('id') : 
                                group === 2 ? group2StatesValue.includes('id') : 
                                group === 3 ? group3StatesValue.includes('id') : 
                                group === 4 ? group4StatesValue.includes('id') :
                                group === 5 ? group5StatesValue.includes('id') :
                                group === 6 ? group6StatesValue.includes('id') :
                                group === 7 ? group7StatesValue.includes('id') :
                                group8StatesValue.includes('id')
                            }
                            disabled={
                                selectedOption.includes('id') &&
                                ((group !== 1 && group1StatesValue.includes('id')) ||
                                (group !== 2 && group2StatesValue.includes('id')) ||
                                (group !== 3 && group3StatesValue.includes('id')) ||
                                (group !== 4 && group4StatesValue.includes('id')) ||
                                (group !== 5 && group5StatesValue.includes('id')) ||
                                (group !== 6 && group6StatesValue.includes('id')) ||
                                (group !== 7 && group7StatesValue.includes('id')) ||
                                (group !== 8 && group8StatesValue.includes('id')))
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
                                group === 1 ? group1StatesValue.includes('il') : 
                                group === 2 ? group2StatesValue.includes('il') : 
                                group === 3 ? group3StatesValue.includes('il') : 
                                group === 4 ? group4StatesValue.includes('il') :
                                group === 5 ? group5StatesValue.includes('il') :
                                group === 6 ? group6StatesValue.includes('il') :
                                group === 7 ? group7StatesValue.includes('il') :
                                group8StatesValue.includes('il')
                            }
                            disabled={
                                selectedOption.includes('il') &&
                                ((group !== 1 && group1StatesValue.includes('il')) ||
                                (group !== 2 && group2StatesValue.includes('il')) ||
                                (group !== 3 && group3StatesValue.includes('il')) ||
                                (group !== 4 && group4StatesValue.includes('il')) ||
                                (group !== 5 && group5StatesValue.includes('il')) ||
                                (group !== 6 && group6StatesValue.includes('il')) ||
                                (group !== 7 && group7StatesValue.includes('il')) ||
                                (group !== 8 && group8StatesValue.includes('il')))
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
                                group === 1 ? group1StatesValue.includes('in') : 
                                group === 2 ? group2StatesValue.includes('in') : 
                                group === 3 ? group3StatesValue.includes('in') : 
                                group === 4 ? group4StatesValue.includes('in') :
                                group === 5 ? group5StatesValue.includes('in') :
                                group === 6 ? group6StatesValue.includes('in') :
                                group === 7 ? group7StatesValue.includes('in') :
                                group8StatesValue.includes('in')
                            }
                            disabled={
                                selectedOption.includes('in') &&
                                ((group !== 1 && group1StatesValue.includes('in')) ||
                                (group !== 2 && group2StatesValue.includes('in')) ||
                                (group !== 3 && group3StatesValue.includes('in')) ||
                                (group !== 4 && group4StatesValue.includes('in')) ||
                                (group !== 5 && group5StatesValue.includes('in')) ||
                                (group !== 6 && group6StatesValue.includes('in')) ||
                                (group !== 7 && group7StatesValue.includes('in')) ||
                                (group !== 8 && group8StatesValue.includes('in')))
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
                                group === 1 ? group1StatesValue.includes('ia') : 
                                group === 2 ? group2StatesValue.includes('ia') : 
                                group === 3 ? group3StatesValue.includes('ia') : 
                                group === 4 ? group4StatesValue.includes('ia') :
                                group === 5 ? group5StatesValue.includes('ia') :
                                group === 6 ? group6StatesValue.includes('ia') :
                                group === 7 ? group7StatesValue.includes('ia') :
                                group8StatesValue.includes('ia')
                            }
                            disabled={
                                selectedOption.includes('ia') &&
                                ((group !== 1 && group1StatesValue.includes('ia')) ||
                                (group !== 2 && group2StatesValue.includes('ia')) ||
                                (group !== 3 && group3StatesValue.includes('ia')) ||
                                (group !== 4 && group4StatesValue.includes('ia')) ||
                                (group !== 5 && group5StatesValue.includes('ia')) ||
                                (group !== 6 && group6StatesValue.includes('ia')) ||
                                (group !== 7 && group7StatesValue.includes('ia')) ||
                                (group !== 8 && group8StatesValue.includes('ia')))
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
                                group === 1 ? group1StatesValue.includes('ks') : 
                                group === 2 ? group2StatesValue.includes('ks') : 
                                group === 3 ? group3StatesValue.includes('ks') : 
                                group === 4 ? group4StatesValue.includes('ks') :
                                group === 5 ? group5StatesValue.includes('ks') :
                                group === 6 ? group6StatesValue.includes('ks') :
                                group === 7 ? group7StatesValue.includes('ks') :
                                group8StatesValue.includes('ks')
                            }
                            disabled={
                                selectedOption.includes('ks') &&
                                ((group !== 1 && group1StatesValue.includes('ks')) ||
                                (group !== 2 && group2StatesValue.includes('ks')) ||
                                (group !== 3 && group3StatesValue.includes('ks')) ||
                                (group !== 4 && group4StatesValue.includes('ks')) ||
                                (group !== 5 && group5StatesValue.includes('ks')) ||
                                (group !== 6 && group6StatesValue.includes('ks')) ||
                                (group !== 7 && group7StatesValue.includes('ks')) ||
                                (group !== 8 && group8StatesValue.includes('ks')))
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
                                group === 1 ? group1StatesValue.includes('ky') : 
                                group === 2 ? group2StatesValue.includes('ky') : 
                                group === 3 ? group3StatesValue.includes('ky') : 
                                group === 4 ? group4StatesValue.includes('ky') :
                                group === 5 ? group5StatesValue.includes('ky') :
                                group === 6 ? group6StatesValue.includes('ky') :
                                group === 7 ? group7StatesValue.includes('ky') :
                                group8StatesValue.includes('ky')
                            }
                            disabled={
                                selectedOption.includes('ky') &&
                                ((group !== 1 && group1StatesValue.includes('ky')) ||
                                (group !== 2 && group2StatesValue.includes('ky')) ||
                                (group !== 3 && group3StatesValue.includes('ky')) ||
                                (group !== 4 && group4StatesValue.includes('ky')) ||
                                (group !== 5 && group5StatesValue.includes('ky')) ||
                                (group !== 6 && group6StatesValue.includes('ky')) ||
                                (group !== 7 && group7StatesValue.includes('ky')) ||
                                (group !== 8 && group8StatesValue.includes('ky')))
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
                                group === 1 ? group1StatesValue.includes('la') : 
                                group === 2 ? group2StatesValue.includes('la') : 
                                group === 3 ? group3StatesValue.includes('la') : 
                                group === 4 ? group4StatesValue.includes('la') :
                                group === 5 ? group5StatesValue.includes('la') :
                                group === 6 ? group6StatesValue.includes('la') :
                                group === 7 ? group7StatesValue.includes('la') :
                                group8StatesValue.includes('la')
                            }
                            disabled={
                                selectedOption.includes('la') &&
                                ((group !== 1 && group1StatesValue.includes('la')) ||
                                (group !== 2 && group2StatesValue.includes('la')) ||
                                (group !== 3 && group3StatesValue.includes('la')) ||
                                (group !== 4 && group4StatesValue.includes('la')) ||
                                (group !== 5 && group5StatesValue.includes('la')) ||
                                (group !== 6 && group6StatesValue.includes('la')) ||
                                (group !== 7 && group7StatesValue.includes('la')) ||
                                (group !== 8 && group8StatesValue.includes('la')))
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
                                group === 1 ? group1StatesValue.includes('me') : 
                                group === 2 ? group2StatesValue.includes('me') : 
                                group === 3 ? group3StatesValue.includes('me') : 
                                group === 4 ? group4StatesValue.includes('me') :
                                group === 5 ? group5StatesValue.includes('me') :
                                group === 6 ? group6StatesValue.includes('me') :
                                group === 7 ? group7StatesValue.includes('me') :
                                group8StatesValue.includes('me')
                            }
                            disabled={
                                selectedOption.includes('me') &&
                                ((group !== 1 && group1StatesValue.includes('me')) ||
                                (group !== 2 && group2StatesValue.includes('me')) ||
                                (group !== 3 && group3StatesValue.includes('me')) ||
                                (group !== 4 && group4StatesValue.includes('me')) ||
                                (group !== 5 && group5StatesValue.includes('me')) ||
                                (group !== 6 && group6StatesValue.includes('me')) ||
                                (group !== 7 && group7StatesValue.includes('me')) ||
                                (group !== 8 && group8StatesValue.includes('me')))
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
                                group === 1 ? group1StatesValue.includes('md') : 
                                group === 2 ? group2StatesValue.includes('md') : 
                                group === 3 ? group3StatesValue.includes('md') : 
                                group === 4 ? group4StatesValue.includes('md') :
                                group === 5 ? group5StatesValue.includes('md') :
                                group === 6 ? group6StatesValue.includes('md') :
                                group === 7 ? group7StatesValue.includes('md') :
                                group8StatesValue.includes('md')
                            }
                            disabled={
                                selectedOption.includes('md') &&
                                ((group !== 1 && group1StatesValue.includes('md')) ||
                                (group !== 2 && group2StatesValue.includes('md')) ||
                                (group !== 3 && group3StatesValue.includes('md')) ||
                                (group !== 4 && group4StatesValue.includes('md')) ||
                                (group !== 5 && group5StatesValue.includes('md')) ||
                                (group !== 6 && group6StatesValue.includes('md')) ||
                                (group !== 7 && group7StatesValue.includes('md')) ||
                                (group !== 8 && group8StatesValue.includes('md')))
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
                                group === 1 ? group1StatesValue.includes('ma') : 
                                group === 2 ? group2StatesValue.includes('ma') : 
                                group === 3 ? group3StatesValue.includes('ma') : 
                                group === 4 ? group4StatesValue.includes('ma') :
                                group === 5 ? group5StatesValue.includes('ma') :
                                group === 6 ? group6StatesValue.includes('ma') :
                                group === 7 ? group7StatesValue.includes('ma') :
                                group8StatesValue.includes('ma')
                            }
                            disabled={
                                selectedOption.includes('ma') &&
                                ((group !== 1 && group1StatesValue.includes('ma')) ||
                                (group !== 2 && group2StatesValue.includes('ma')) ||
                                (group !== 3 && group3StatesValue.includes('ma')) ||
                                (group !== 4 && group4StatesValue.includes('ma')) ||
                                (group !== 5 && group5StatesValue.includes('ma')) ||
                                (group !== 6 && group6StatesValue.includes('ma')) ||
                                (group !== 7 && group7StatesValue.includes('ma')) ||
                                (group !== 8 && group8StatesValue.includes('ma')))
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
                                group === 1 ? group1StatesValue.includes('mi') : 
                                group === 2 ? group2StatesValue.includes('mi') : 
                                group === 3 ? group3StatesValue.includes('mi') : 
                                group === 4 ? group4StatesValue.includes('mi') :
                                group === 5 ? group5StatesValue.includes('mi') :
                                group === 6 ? group6StatesValue.includes('mi') :
                                group === 7 ? group7StatesValue.includes('mi') :
                                group8StatesValue.includes('mi')
                            }
                            disabled={
                                selectedOption.includes('mi') &&
                                ((group !== 1 && group1StatesValue.includes('mi')) ||
                                (group !== 2 && group2StatesValue.includes('mi')) ||
                                (group !== 3 && group3StatesValue.includes('mi')) ||
                                (group !== 4 && group4StatesValue.includes('mi')) ||
                                (group !== 5 && group5StatesValue.includes('mi')) ||
                                (group !== 6 && group6StatesValue.includes('mi')) ||
                                (group !== 7 && group7StatesValue.includes('mi')) ||
                                (group !== 8 && group8StatesValue.includes('mi')))
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
                                group === 1 ? group1StatesValue.includes('mn') : 
                                group === 2 ? group2StatesValue.includes('mn') : 
                                group === 3 ? group3StatesValue.includes('mn') : 
                                group === 4 ? group4StatesValue.includes('mn') :
                                group === 5 ? group5StatesValue.includes('mn') :
                                group === 6 ? group6StatesValue.includes('mn') :
                                group === 7 ? group7StatesValue.includes('mn') :
                                group8StatesValue.includes('mn')
                            }
                            disabled={
                                selectedOption.includes('mn') &&
                                ((group !== 1 && group1StatesValue.includes('mn')) ||
                                (group !== 2 && group2StatesValue.includes('mn')) ||
                                (group !== 3 && group3StatesValue.includes('mn')) ||
                                (group !== 4 && group4StatesValue.includes('mn')) ||
                                (group !== 5 && group5StatesValue.includes('mn')) ||
                                (group !== 6 && group6StatesValue.includes('mn')) ||
                                (group !== 7 && group7StatesValue.includes('mn')) ||
                                (group !== 8 && group8StatesValue.includes('mn')))
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
                                group === 1 ? group1StatesValue.includes('ms') : 
                                group === 2 ? group2StatesValue.includes('ms') : 
                                group === 3 ? group3StatesValue.includes('ms') : 
                                group === 4 ? group4StatesValue.includes('ms') :
                                group === 5 ? group5StatesValue.includes('ms') :
                                group === 6 ? group6StatesValue.includes('ms') :
                                group === 7 ? group7StatesValue.includes('ms') :
                                group8StatesValue.includes('ms')
                            }
                            disabled={
                                selectedOption.includes('ms') &&
                                ((group !== 1 && group1StatesValue.includes('ms')) ||
                                (group !== 2 && group2StatesValue.includes('ms')) ||
                                (group !== 3 && group3StatesValue.includes('ms')) ||
                                (group !== 4 && group4StatesValue.includes('ms')) ||
                                (group !== 5 && group5StatesValue.includes('ms')) ||
                                (group !== 6 && group6StatesValue.includes('ms')) ||
                                (group !== 7 && group7StatesValue.includes('ms')) ||
                                (group !== 8 && group8StatesValue.includes('ms')))
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
                                group === 1 ? group1StatesValue.includes('mo') : 
                                group === 2 ? group2StatesValue.includes('mo') : 
                                group === 3 ? group3StatesValue.includes('mo') : 
                                group === 4 ? group4StatesValue.includes('mo') :
                                group === 5 ? group5StatesValue.includes('mo') :
                                group === 6 ? group6StatesValue.includes('mo') :
                                group === 7 ? group7StatesValue.includes('mo') :
                                group8StatesValue.includes('mo')
                            }
                            disabled={
                                selectedOption.includes('mo') &&
                                ((group !== 1 && group1StatesValue.includes('mo')) ||
                                (group !== 2 && group2StatesValue.includes('mo')) ||
                                (group !== 3 && group3StatesValue.includes('mo')) ||
                                (group !== 4 && group4StatesValue.includes('mo')) ||
                                (group !== 5 && group5StatesValue.includes('mo')) ||
                                (group !== 6 && group6StatesValue.includes('mo')) ||
                                (group !== 7 && group7StatesValue.includes('mo')) ||
                                (group !== 8 && group8StatesValue.includes('mo')))
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
                                group === 1 ? group1StatesValue.includes('mt') : 
                                group === 2 ? group2StatesValue.includes('mt') : 
                                group === 3 ? group3StatesValue.includes('mt') : 
                                group === 4 ? group4StatesValue.includes('mt') :
                                group === 5 ? group5StatesValue.includes('mt') :
                                group === 6 ? group6StatesValue.includes('mt') :
                                group === 7 ? group7StatesValue.includes('mt') :
                                group8StatesValue.includes('mt')
                            }
                            disabled={
                                selectedOption.includes('mt') &&
                                ((group !== 1 && group1StatesValue.includes('mt')) ||
                                (group !== 2 && group2StatesValue.includes('mt')) ||
                                (group !== 3 && group3StatesValue.includes('mt')) ||
                                (group !== 4 && group4StatesValue.includes('mt')) ||
                                (group !== 5 && group5StatesValue.includes('mt')) ||
                                (group !== 6 && group6StatesValue.includes('mt')) ||
                                (group !== 7 && group7StatesValue.includes('mt')) ||
                                (group !== 8 && group8StatesValue.includes('mt')))
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
                                group === 1 ? group1StatesValue.includes('ne') : 
                                group === 2 ? group2StatesValue.includes('ne') : 
                                group === 3 ? group3StatesValue.includes('ne') : 
                                group === 4 ? group4StatesValue.includes('ne') :
                                group === 5 ? group5StatesValue.includes('ne') :
                                group === 6 ? group6StatesValue.includes('ne') :
                                group === 7 ? group7StatesValue.includes('ne') :
                                group8StatesValue.includes('ne')
                            }
                            disabled={
                                selectedOption.includes('ne') &&
                                ((group !== 1 && group1StatesValue.includes('ne')) ||
                                (group !== 2 && group2StatesValue.includes('ne')) ||
                                (group !== 3 && group3StatesValue.includes('ne')) ||
                                (group !== 4 && group4StatesValue.includes('ne')) ||
                                (group !== 5 && group5StatesValue.includes('ne')) ||
                                (group !== 6 && group6StatesValue.includes('ne')) ||
                                (group !== 7 && group7StatesValue.includes('ne')) ||
                                (group !== 8 && group8StatesValue.includes('ne')))
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
                                group === 1 ? group1StatesValue.includes('nv') : 
                                group === 2 ? group2StatesValue.includes('nv') : 
                                group === 3 ? group3StatesValue.includes('nv') : 
                                group === 4 ? group4StatesValue.includes('nv') :
                                group === 5 ? group5StatesValue.includes('nv') :
                                group === 6 ? group6StatesValue.includes('nv') :
                                group === 7 ? group7StatesValue.includes('nv') :
                                group8StatesValue.includes('nv')
                            }
                            disabled={
                                selectedOption.includes('nv') &&
                                ((group !== 1 && group1StatesValue.includes('nv')) ||
                                (group !== 2 && group2StatesValue.includes('nv')) ||
                                (group !== 3 && group3StatesValue.includes('nv')) ||
                                (group !== 4 && group4StatesValue.includes('nv')) ||
                                (group !== 5 && group5StatesValue.includes('nv')) ||
                                (group !== 6 && group6StatesValue.includes('nv')) ||
                                (group !== 7 && group7StatesValue.includes('nv')) ||
                                (group !== 8 && group8StatesValue.includes('nv')))
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
                                group === 1 ? group1StatesValue.includes('nh') : 
                                group === 2 ? group2StatesValue.includes('nh') : 
                                group === 3 ? group3StatesValue.includes('nh') : 
                                group === 4 ? group4StatesValue.includes('nh') :
                                group === 5 ? group5StatesValue.includes('nh') :
                                group === 6 ? group6StatesValue.includes('nh') :
                                group === 7 ? group7StatesValue.includes('nh') :
                                group8StatesValue.includes('nh')
                            }
                            disabled={
                                selectedOption.includes('nh') &&
                                ((group !== 1 && group1StatesValue.includes('nh')) ||
                                (group !== 2 && group2StatesValue.includes('nh')) ||
                                (group !== 3 && group3StatesValue.includes('nh')) ||
                                (group !== 4 && group4StatesValue.includes('nh')) ||
                                (group !== 5 && group5StatesValue.includes('nh')) ||
                                (group !== 6 && group6StatesValue.includes('nh')) ||
                                (group !== 7 && group7StatesValue.includes('nh')) ||
                                (group !== 8 && group8StatesValue.includes('nh')))
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
                                group === 1 ? group1StatesValue.includes('nj') : 
                                group === 2 ? group2StatesValue.includes('nj') : 
                                group === 3 ? group3StatesValue.includes('nj') : 
                                group === 4 ? group4StatesValue.includes('nj') :
                                group === 5 ? group5StatesValue.includes('nj') :
                                group === 6 ? group6StatesValue.includes('nj') :
                                group === 7 ? group7StatesValue.includes('nj') :
                                group8StatesValue.includes('nj')
                            }
                            disabled={
                                selectedOption.includes('nj') &&
                                ((group !== 1 && group1StatesValue.includes('nj')) ||
                                (group !== 2 && group2StatesValue.includes('nj')) ||
                                (group !== 3 && group3StatesValue.includes('nj')) ||
                                (group !== 4 && group4StatesValue.includes('nj')) ||
                                (group !== 5 && group5StatesValue.includes('nj')) ||
                                (group !== 6 && group6StatesValue.includes('nj')) ||
                                (group !== 7 && group7StatesValue.includes('nj')) ||
                                (group !== 8 && group8StatesValue.includes('nj')))
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
                                group === 1 ? group1StatesValue.includes('nm') : 
                                group === 2 ? group2StatesValue.includes('nm') : 
                                group === 3 ? group3StatesValue.includes('nm') : 
                                group === 4 ? group4StatesValue.includes('nm') :
                                group === 5 ? group5StatesValue.includes('nm') :
                                group === 6 ? group6StatesValue.includes('nm') :
                                group === 7 ? group7StatesValue.includes('nm') :
                                group8StatesValue.includes('nm')
                            }
                            disabled={
                                selectedOption.includes('nm') &&
                                ((group !== 1 && group1StatesValue.includes('nm')) ||
                                (group !== 2 && group2StatesValue.includes('nm')) ||
                                (group !== 3 && group3StatesValue.includes('nm')) ||
                                (group !== 4 && group4StatesValue.includes('nm')) ||
                                (group !== 5 && group5StatesValue.includes('nm')) ||
                                (group !== 6 && group6StatesValue.includes('nm')) ||
                                (group !== 7 && group7StatesValue.includes('nm')) ||
                                (group !== 8 && group8StatesValue.includes('nm')))
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
                                group === 1 ? group1StatesValue.includes('ny') : 
                                group === 2 ? group2StatesValue.includes('ny') : 
                                group === 3 ? group3StatesValue.includes('ny') : 
                                group === 4 ? group4StatesValue.includes('ny') :
                                group === 5 ? group5StatesValue.includes('ny') :
                                group === 6 ? group6StatesValue.includes('ny') :
                                group === 7 ? group7StatesValue.includes('ny') :
                                group8StatesValue.includes('ny')
                            }
                            disabled={
                                selectedOption.includes('ny') &&
                                ((group !== 1 && group1StatesValue.includes('ny')) ||
                                (group !== 2 && group2StatesValue.includes('ny')) ||
                                (group !== 3 && group3StatesValue.includes('ny')) ||
                                (group !== 4 && group4StatesValue.includes('ny')) ||
                                (group !== 5 && group5StatesValue.includes('ny')) ||
                                (group !== 6 && group6StatesValue.includes('ny')) ||
                                (group !== 7 && group7StatesValue.includes('ny')) ||
                                (group !== 8 && group8StatesValue.includes('ny')))
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
                                group === 1 ? group1StatesValue.includes('nc') : 
                                group === 2 ? group2StatesValue.includes('nc') : 
                                group === 3 ? group3StatesValue.includes('nc') : 
                                group === 4 ? group4StatesValue.includes('nc') :
                                group === 5 ? group5StatesValue.includes('nc') :
                                group === 6 ? group6StatesValue.includes('nc') :
                                group === 7 ? group7StatesValue.includes('nc') :
                                group8StatesValue.includes('nc')
                            }
                            disabled={
                                selectedOption.includes('nc') &&
                                ((group !== 1 && group1StatesValue.includes('nc')) ||
                                (group !== 2 && group2StatesValue.includes('nc')) ||
                                (group !== 3 && group3StatesValue.includes('nc')) ||
                                (group !== 4 && group4StatesValue.includes('nc')) ||
                                (group !== 5 && group5StatesValue.includes('nc')) ||
                                (group !== 6 && group6StatesValue.includes('nc')) ||
                                (group !== 7 && group7StatesValue.includes('nc')) ||
                                (group !== 8 && group8StatesValue.includes('nc')))
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
                                group === 1 ? group1StatesValue.includes('nd') : 
                                group === 2 ? group2StatesValue.includes('nd') : 
                                group === 3 ? group3StatesValue.includes('nd') : 
                                group === 4 ? group4StatesValue.includes('nd') :
                                group === 5 ? group5StatesValue.includes('nd') :
                                group === 6 ? group6StatesValue.includes('nd') :
                                group === 7 ? group7StatesValue.includes('nd') :
                                group8StatesValue.includes('nd')
                            }
                            disabled={
                                selectedOption.includes('nd') &&
                                ((group !== 1 && group1StatesValue.includes('nd')) ||
                                (group !== 2 && group2StatesValue.includes('nd')) ||
                                (group !== 3 && group3StatesValue.includes('nd')) ||
                                (group !== 4 && group4StatesValue.includes('nd')) ||
                                (group !== 5 && group5StatesValue.includes('nd')) ||
                                (group !== 6 && group6StatesValue.includes('nd')) ||
                                (group !== 7 && group7StatesValue.includes('nd')) ||
                                (group !== 8 && group8StatesValue.includes('nd')))
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
                                group === 1 ? group1StatesValue.includes('oh') : 
                                group === 2 ? group2StatesValue.includes('oh') : 
                                group === 3 ? group3StatesValue.includes('oh') : 
                                group === 4 ? group4StatesValue.includes('oh') :
                                group === 5 ? group5StatesValue.includes('oh') :
                                group === 6 ? group6StatesValue.includes('oh') :
                                group === 7 ? group7StatesValue.includes('oh') :
                                group8StatesValue.includes('oh')
                            }
                            disabled={
                                selectedOption.includes('oh') &&
                                ((group !== 1 && group1StatesValue.includes('oh')) ||
                                (group !== 2 && group2StatesValue.includes('oh')) ||
                                (group !== 3 && group3StatesValue.includes('oh')) ||
                                (group !== 4 && group4StatesValue.includes('oh')) ||
                                (group !== 5 && group5StatesValue.includes('oh')) ||
                                (group !== 6 && group6StatesValue.includes('oh')) ||
                                (group !== 7 && group7StatesValue.includes('oh')) ||
                                (group !== 8 && group8StatesValue.includes('oh')))
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
                                group === 1 ? group1StatesValue.includes('ok') : 
                                group === 2 ? group2StatesValue.includes('ok') : 
                                group === 3 ? group3StatesValue.includes('ok') : 
                                group === 4 ? group4StatesValue.includes('ok') :
                                group === 5 ? group5StatesValue.includes('ok') :
                                group === 6 ? group6StatesValue.includes('ok') :
                                group === 7 ? group7StatesValue.includes('ok') :
                                group8StatesValue.includes('ok')
                            }
                            disabled={
                                selectedOption.includes('ok') &&
                                ((group !== 1 && group1StatesValue.includes('ok')) ||
                                (group !== 2 && group2StatesValue.includes('ok')) ||
                                (group !== 3 && group3StatesValue.includes('ok')) ||
                                (group !== 4 && group4StatesValue.includes('ok')) ||
                                (group !== 5 && group5StatesValue.includes('ok')) ||
                                (group !== 6 && group6StatesValue.includes('ok')) ||
                                (group !== 7 && group7StatesValue.includes('ok')) ||
                                (group !== 8 && group8StatesValue.includes('ok')))
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
                                group === 1 ? group1StatesValue.includes('or') : 
                                group === 2 ? group2StatesValue.includes('or') : 
                                group === 3 ? group3StatesValue.includes('or') : 
                                group === 4 ? group4StatesValue.includes('or') :
                                group === 5 ? group5StatesValue.includes('or') :
                                group === 6 ? group6StatesValue.includes('or') :
                                group === 7 ? group7StatesValue.includes('or') :
                                group8StatesValue.includes('or')
                            }
                            disabled={
                                selectedOption.includes('or') &&
                                ((group !== 1 && group1StatesValue.includes('or')) ||
                                (group !== 2 && group2StatesValue.includes('or')) ||
                                (group !== 3 && group3StatesValue.includes('or')) ||
                                (group !== 4 && group4StatesValue.includes('or')) ||
                                (group !== 5 && group5StatesValue.includes('or')) ||
                                (group !== 6 && group6StatesValue.includes('or')) ||
                                (group !== 7 && group7StatesValue.includes('or')) ||
                                (group !== 8 && group8StatesValue.includes('or')))
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
                                group === 1 ? group1StatesValue.includes('pa') : 
                                group === 2 ? group2StatesValue.includes('pa') : 
                                group === 3 ? group3StatesValue.includes('pa') : 
                                group === 4 ? group4StatesValue.includes('pa') :
                                group === 5 ? group5StatesValue.includes('pa') :
                                group === 6 ? group6StatesValue.includes('pa') :
                                group === 7 ? group7StatesValue.includes('pa') :
                                group8StatesValue.includes('pa')
                            }
                            disabled={
                                selectedOption.includes('pa') &&
                                ((group !== 1 && group1StatesValue.includes('pa')) ||
                                (group !== 2 && group2StatesValue.includes('pa')) ||
                                (group !== 3 && group3StatesValue.includes('pa')) ||
                                (group !== 4 && group4StatesValue.includes('pa')) ||
                                (group !== 5 && group5StatesValue.includes('pa')) ||
                                (group !== 6 && group6StatesValue.includes('pa')) ||
                                (group !== 7 && group7StatesValue.includes('pa')) ||
                                (group !== 8 && group8StatesValue.includes('pa')))
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
                                group === 1 ? group1StatesValue.includes('ri') : 
                                group === 2 ? group2StatesValue.includes('ri') : 
                                group === 3 ? group3StatesValue.includes('ri') : 
                                group === 4 ? group4StatesValue.includes('ri') :
                                group === 5 ? group5StatesValue.includes('ri') :
                                group === 6 ? group6StatesValue.includes('ri') :
                                group === 7 ? group7StatesValue.includes('ri') :
                                group8StatesValue.includes('ri')
                            }
                            disabled={
                                selectedOption.includes('ri') &&
                                ((group !== 1 && group1StatesValue.includes('ri')) ||
                                (group !== 2 && group2StatesValue.includes('ri')) ||
                                (group !== 3 && group3StatesValue.includes('ri')) ||
                                (group !== 4 && group4StatesValue.includes('ri')) ||
                                (group !== 5 && group5StatesValue.includes('ri')) ||
                                (group !== 6 && group6StatesValue.includes('ri')) ||
                                (group !== 7 && group7StatesValue.includes('ri')) ||
                                (group !== 8 && group8StatesValue.includes('ri')))
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
                                group === 1 ? group1StatesValue.includes('sc') : 
                                group === 2 ? group2StatesValue.includes('sc') : 
                                group === 3 ? group3StatesValue.includes('sc') : 
                                group === 4 ? group4StatesValue.includes('sc') :
                                group === 5 ? group5StatesValue.includes('sc') :
                                group === 6 ? group6StatesValue.includes('sc') :
                                group === 7 ? group7StatesValue.includes('sc') :
                                group8StatesValue.includes('sc')
                            }
                            disabled={
                                selectedOption.includes('sc') &&
                                ((group !== 1 && group1StatesValue.includes('sc')) ||
                                (group !== 2 && group2StatesValue.includes('sc')) ||
                                (group !== 3 && group3StatesValue.includes('sc')) ||
                                (group !== 4 && group4StatesValue.includes('sc')) ||
                                (group !== 5 && group5StatesValue.includes('sc')) ||
                                (group !== 6 && group6StatesValue.includes('sc')) ||
                                (group !== 7 && group7StatesValue.includes('sc')) ||
                                (group !== 8 && group8StatesValue.includes('sc')))
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
                                group === 1 ? group1StatesValue.includes('sd') : 
                                group === 2 ? group2StatesValue.includes('sd') : 
                                group === 3 ? group3StatesValue.includes('sd') : 
                                group === 4 ? group4StatesValue.includes('sd') :
                                group === 5 ? group5StatesValue.includes('sd') :
                                group === 6 ? group6StatesValue.includes('sd') :
                                group === 7 ? group7StatesValue.includes('sd') :
                                group8StatesValue.includes('sd')
                            }
                            disabled={
                                selectedOption.includes('sd') &&
                                ((group !== 1 && group1StatesValue.includes('sd')) ||
                                (group !== 2 && group2StatesValue.includes('sd')) ||
                                (group !== 3 && group3StatesValue.includes('sd')) ||
                                (group !== 4 && group4StatesValue.includes('sd')) ||
                                (group !== 5 && group5StatesValue.includes('sd')) ||
                                (group !== 6 && group6StatesValue.includes('sd')) ||
                                (group !== 7 && group7StatesValue.includes('sd')) ||
                                (group !== 8 && group8StatesValue.includes('sd')))
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
                                group === 1 ? group1StatesValue.includes('tn') : 
                                group === 2 ? group2StatesValue.includes('tn') : 
                                group === 3 ? group3StatesValue.includes('tn') : 
                                group === 4 ? group4StatesValue.includes('tn') :
                                group === 5 ? group5StatesValue.includes('tn') :
                                group === 6 ? group6StatesValue.includes('tn') :
                                group === 7 ? group7StatesValue.includes('tn') :
                                group8StatesValue.includes('tn')
                            }
                            disabled={
                                selectedOption.includes('tn') &&
                                ((group !== 1 && group1StatesValue.includes('tn')) ||
                                (group !== 2 && group2StatesValue.includes('tn')) ||
                                (group !== 3 && group3StatesValue.includes('tn')) ||
                                (group !== 4 && group4StatesValue.includes('tn')) ||
                                (group !== 5 && group5StatesValue.includes('tn')) ||
                                (group !== 6 && group6StatesValue.includes('tn')) ||
                                (group !== 7 && group7StatesValue.includes('tn')) ||
                                (group !== 8 && group8StatesValue.includes('tn')))
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
                                group === 1 ? group1StatesValue.includes('tx') : 
                                group === 2 ? group2StatesValue.includes('tx') : 
                                group === 3 ? group3StatesValue.includes('tx') : 
                                group === 4 ? group4StatesValue.includes('tx') :
                                group === 5 ? group5StatesValue.includes('tx') :
                                group === 6 ? group6StatesValue.includes('tx') :
                                group === 7 ? group7StatesValue.includes('tx') :
                                group8StatesValue.includes('tx')
                            }
                            disabled={
                                selectedOption.includes('tx') &&
                                ((group !== 1 && group1StatesValue.includes('tx')) ||
                                (group !== 2 && group2StatesValue.includes('tx')) ||
                                (group !== 3 && group3StatesValue.includes('tx')) ||
                                (group !== 4 && group4StatesValue.includes('tx')) ||
                                (group !== 5 && group5StatesValue.includes('tx')) ||
                                (group !== 6 && group6StatesValue.includes('tx')) ||
                                (group !== 7 && group7StatesValue.includes('tx')) ||
                                (group !== 8 && group8StatesValue.includes('tx')))
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
                                group === 1 ? group1StatesValue.includes('ut') : 
                                group === 2 ? group2StatesValue.includes('ut') : 
                                group === 3 ? group3StatesValue.includes('ut') : 
                                group === 4 ? group4StatesValue.includes('ut') :
                                group === 5 ? group5StatesValue.includes('ut') :
                                group === 6 ? group6StatesValue.includes('ut') :
                                group === 7 ? group7StatesValue.includes('ut') :
                                group8StatesValue.includes('ut')
                            }
                            disabled={
                                selectedOption.includes('ut') &&
                                ((group !== 1 && group1StatesValue.includes('ut')) ||
                                (group !== 2 && group2StatesValue.includes('ut')) ||
                                (group !== 3 && group3StatesValue.includes('ut')) ||
                                (group !== 4 && group4StatesValue.includes('ut')) ||
                                (group !== 5 && group5StatesValue.includes('ut')) ||
                                (group !== 6 && group6StatesValue.includes('ut')) ||
                                (group !== 7 && group7StatesValue.includes('ut')) ||
                                (group !== 8 && group8StatesValue.includes('ut')))
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
                                group === 1 ? group1StatesValue.includes('vt') : 
                                group === 2 ? group2StatesValue.includes('vt') : 
                                group === 3 ? group3StatesValue.includes('vt') : 
                                group === 4 ? group4StatesValue.includes('vt') :
                                group === 5 ? group5StatesValue.includes('vt') :
                                group === 6 ? group6StatesValue.includes('vt') :
                                group === 7 ? group7StatesValue.includes('vt') :
                                group8StatesValue.includes('vt')
                            }
                            disabled={
                                selectedOption.includes('vt') &&
                                ((group !== 1 && group1StatesValue.includes('vt')) ||
                                (group !== 2 && group2StatesValue.includes('vt')) ||
                                (group !== 3 && group3StatesValue.includes('vt')) ||
                                (group !== 4 && group4StatesValue.includes('vt')) ||
                                (group !== 5 && group5StatesValue.includes('vt')) ||
                                (group !== 6 && group6StatesValue.includes('vt')) ||
                                (group !== 7 && group7StatesValue.includes('vt')) ||
                                (group !== 8 && group8StatesValue.includes('vt')))
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
                                group === 1 ? group1StatesValue.includes('va') : 
                                group === 2 ? group2StatesValue.includes('va') : 
                                group === 3 ? group3StatesValue.includes('va') : 
                                group === 4 ? group4StatesValue.includes('va') :
                                group === 5 ? group5StatesValue.includes('va') :
                                group === 6 ? group6StatesValue.includes('va') :
                                group === 7 ? group7StatesValue.includes('va') :
                                group8StatesValue.includes('va')
                            }
                            disabled={
                                selectedOption.includes('va') &&
                                ((group !== 1 && group1StatesValue.includes('va')) ||
                                (group !== 2 && group2StatesValue.includes('va')) ||
                                (group !== 3 && group3StatesValue.includes('va')) ||
                                (group !== 4 && group4StatesValue.includes('va')) ||
                                (group !== 5 && group5StatesValue.includes('va')) ||
                                (group !== 6 && group6StatesValue.includes('va')) ||
                                (group !== 7 && group7StatesValue.includes('va')) ||
                                (group !== 8 && group8StatesValue.includes('va')))
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
                                group === 1 ? group1StatesValue.includes('wa') : 
                                group === 2 ? group2StatesValue.includes('wa') : 
                                group === 3 ? group3StatesValue.includes('wa') : 
                                group === 4 ? group4StatesValue.includes('wa') :
                                group === 5 ? group5StatesValue.includes('wa') :
                                group === 6 ? group6StatesValue.includes('wa') :
                                group === 7 ? group7StatesValue.includes('wa') :
                                group8StatesValue.includes('wa')
                            }
                            disabled={
                                selectedOption.includes('wa') &&
                                ((group !== 1 && group1StatesValue.includes('wa')) ||
                                (group !== 2 && group2StatesValue.includes('wa')) ||
                                (group !== 3 && group3StatesValue.includes('wa')) ||
                                (group !== 4 && group4StatesValue.includes('wa')) ||
                                (group !== 5 && group5StatesValue.includes('wa')) ||
                                (group !== 6 && group6StatesValue.includes('wa')) ||
                                (group !== 7 && group7StatesValue.includes('wa')) ||
                                (group !== 8 && group8StatesValue.includes('wa')))
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
                                group === 1 ? group1StatesValue.includes('wv') : 
                                group === 2 ? group2StatesValue.includes('wv') : 
                                group === 3 ? group3StatesValue.includes('wv') : 
                                group === 4 ? group4StatesValue.includes('wv') :
                                group === 5 ? group5StatesValue.includes('wv') :
                                group === 6 ? group6StatesValue.includes('wv') :
                                group === 7 ? group7StatesValue.includes('wv') :
                                group8StatesValue.includes('wv')
                            }
                            disabled={
                                selectedOption.includes('wv') &&
                                ((group !== 1 && group1StatesValue.includes('wv')) ||
                                (group !== 2 && group2StatesValue.includes('wv')) ||
                                (group !== 3 && group3StatesValue.includes('wv')) ||
                                (group !== 4 && group4StatesValue.includes('wv')) ||
                                (group !== 5 && group5StatesValue.includes('wv')) ||
                                (group !== 6 && group6StatesValue.includes('wv')) ||
                                (group !== 7 && group7StatesValue.includes('wv')) ||
                                (group !== 8 && group8StatesValue.includes('wv')))
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
                                group === 1 ? group1StatesValue.includes('wi') : 
                                group === 2 ? group2StatesValue.includes('wi') : 
                                group === 3 ? group3StatesValue.includes('wi') : 
                                group === 4 ? group4StatesValue.includes('wi') :
                                group === 5 ? group5StatesValue.includes('wi') :
                                group === 6 ? group6StatesValue.includes('wi') :
                                group === 7 ? group7StatesValue.includes('wi') :
                                group8StatesValue.includes('wi')
                            }
                            disabled={
                                selectedOption.includes('wi') &&
                                ((group !== 1 && group1StatesValue.includes('wi')) ||
                                (group !== 2 && group2StatesValue.includes('wi')) ||
                                (group !== 3 && group3StatesValue.includes('wi')) ||
                                (group !== 4 && group4StatesValue.includes('wi')) ||
                                (group !== 5 && group5StatesValue.includes('wi')) ||
                                (group !== 6 && group6StatesValue.includes('wi')) ||
                                (group !== 7 && group7StatesValue.includes('wi')) ||
                                (group !== 8 && group8StatesValue.includes('wi')))
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
                                group === 1 ? group1StatesValue.includes('wy') : 
                                group === 2 ? group2StatesValue.includes('wy') : 
                                group === 3 ? group3StatesValue.includes('wy') : 
                                group === 4 ? group4StatesValue.includes('wy') :
                                group === 5 ? group5StatesValue.includes('wy') :
                                group === 6 ? group6StatesValue.includes('wy') :
                                group === 7 ? group7StatesValue.includes('wy') :
                                group8StatesValue.includes('wy')
                            }
                            disabled={
                                selectedOption.includes('wy') &&
                                ((group !== 1 && group1StatesValue.includes('wy')) ||
                                (group !== 2 && group2StatesValue.includes('wy')) ||
                                (group !== 3 && group3StatesValue.includes('wy')) ||
                                (group !== 4 && group4StatesValue.includes('wy')) ||
                                (group !== 5 && group5StatesValue.includes('wy')) ||
                                (group !== 6 && group6StatesValue.includes('wy')) ||
                                (group !== 7 && group7StatesValue.includes('wy')) ||
                                (group !== 8 && group8StatesValue.includes('wy')))
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