import React, { useState } from "react";
import GitHubButton from "react-github-btn";

import styles from './Header.module.css'

import { Link } from 'react-router-dom';



function Header({ isAuthenticated, setIsAuthenticated }) {


  return (
    <div >
      <div className={styles.header}>

     
      <a href="/">
      <img
        alt="logo"
        src="../assets/map-in-color-logo-text.png"
        className={styles.logo}
      ></img>
      </a>
     
      <nav className={styles.headerNav}>
      <ul className="nav-items">
        <li>
          <Link to="/create">Create a new map</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>

      <div className={styles.authLinks}>
        {isAuthenticated ? (
          <button onClick={() => setIsAuthenticated(false)}>Logout</button>
        ) : (
          <>
            <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>


    </nav>

    </div>
   
        
    </div>
  );
}

export default Header;