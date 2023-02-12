import { useState } from "react"

function NavButton({onClick, label, active}) {


    const [ clicked, setClicked ] = useState(false)

    const handleClick = () => {
        setClicked(true)
        onClick()
    }

    
    return(
        <li>
        <button 
            className={`nav-button ${active ? 'active' : ''}`}
            
            onClick={handleClick}          
            >{label}
            
        </button>
    </li>
    )
}

export default NavButton