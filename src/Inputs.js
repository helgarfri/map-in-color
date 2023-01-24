import Select from 'react-select'
import './world-states.svg'
import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';
import Countries from './Countries';
import { useState } from 'react';
import ColorFunctions from './ColorFunctions';
 

function Inputs() {
    
    const colors = [
        { value: 'red', label: 'Red'},
        { value: 'blue', label: 'Blue'}
    ]

    
       
    return(
        <div>
            <div className='class'>
                
                <div className='class-sidemenu'>
                <Navigation
            activeItemId="/management/members"
            onSelect={({itemId}) => {
              // maybe push to the route
            }}
            items={[
              {
                title: 'Unnamed class',
                itemId: '/dashboard',
                // you can use your own custom Icon component as well
                // icon is optional
                elemBefore: () => <icon name="inbox" />,
              },
              {
                title: 'Unnamed class',
                itemId: '/management',
                elemBefore: () => <icon name="users" />,
              
              },
              {
                title: 'Unnamed class',
                itemId: '/another',
               
              },
            ]}
          />
                </div>

                <div className='class-editor'>
                    <label>Select a color</label>
                    <Select 
                        className='select-colors' 
                        options={colors}  
                        id='selectColors'
                     
                        onChange={ColorFunctions}
                        />

                    <Countries/>
                </div>
              
            </div>
            
            
        </div>
    )

   
}

export default Inputs