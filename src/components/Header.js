import React, { useState } from "react";
import WorldMap from "./world-map/WorldMap";

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);

  function toggleDropdown() {
    setShowDropdown(!showDropdown);
  }

  return (
    <div className="header">
      <a href="/">
      <img
        src="../assets/map-in-color-logo-text.png"
        className="logo"
      ></img>
      </a>
     
      <nav>
        <ul>
          <li onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
            Maps
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
    </div>
  );
}

export default Header;