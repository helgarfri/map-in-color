import ColorFunctions from "./ColorFunctions"
import './App.css'

function Countries() {

    return(
        <div>
            <div className="continents">
            <label>Europe</label>

                <div className="eu-countries">
                    
                    
                    <input type='checkbox' onClick={ColorFunctions}  id='AL' className="country"></input>
                    <label>Albania</label>

                    <input type='checkbox' onClick={ColorFunctions}  id='AD' className="country"></input>
                    <label>Andorra</label>

                    <input type='checkbox' onClick={ColorFunctions}  id='AT' className="country"></input>
                    <label>Austria</label>
                
                
                
              
                    <input type='checkbox' onClick={ColorFunctions} id='IS'  value='0' className="country"></input>
                    <label>Iceland</label>
             
                    
                </div>
                
            </div>
             

            <input type='checkbox'></input>
            <label>Andorra</label>
            
        </div>
    )
}

export default Countries

