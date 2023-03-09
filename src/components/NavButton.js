import { useState, useEffect } from "react"

function NavButton({onClick, label, active, index, numItems, setNumItems}) {


    const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

    const [ clicked, setClicked ] = useState(false)

    const handleClick = () => {
        setClicked(true)
        onClick()
    }

    const handleRemoveButtonClick = () => {
        var addButton = document.getElementById('addButton')

        setNumItems(numItems - 1);

        if (numItems = 8) {
            addButton.style.display = 'flex'
        }   

      };  

     

    
    
    return(
        <li  className={`nav-button ${active ? 'active' : ''} ${visible ? 'visible' : ''}`} >
            
        <h4 
           
            
            onClick={handleClick}          
            >{label}
            
            
            {index === numItems - 1 && (
                <button onClick={handleRemoveButtonClick}
                    id='removeButton'
                    className='remove-button'
                >
                    
                    <img src='../assets/remove.png' className="remove-img"></img></button>
              )}
        </h4>
        
        
    </li>
    )
}

export default NavButton