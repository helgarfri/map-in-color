import React, { useState } from "react";
import GitHubButton from "react-github-btn";


function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  return (
    <div >
      <div className="header">

     
      <a href="/">
      <img
        alt="logo"
        src="../assets/map-in-color-logo-text.png"
        className="logo"
      ></img>
      </a>
     
      <nav className="header-nav">
        <ul className="nav-items">
          <li onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            Maps           
            <img 
              className="dropdown-icon" 
              src="../assets/dropdown.png"
              alt="dropdown"
              >
              
              </img>

            {showDropdown && (
              <ul className="header-dropdown">
                <li>
                  <a href="/world-map">
                    World Map
                  </a>
                
                </li>

                <li>
                  <a href="/us-states">
                    US States
                  </a>
                </li>


                <li>
                  <a href="/europe">
                    Europe
                  </a>
                </li>

               
              </ul>
            )}
      
              
          </li>
        

        </ul>

        
        

    </nav>
    <div className="header-git">
        <GitHubButton  href="https://github.com/helgidavidsson/map-in-color" data-size="large" data-show-count="true" aria-label="Star helgidavidsson/map-in-color on GitHub">Star</GitHubButton>
        </div>
    </div>
   
        
    </div>
  );
}

export default Header;