// src/components/LogoutButton.js
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function LogoutButton() {
  const { setAuthToken } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null); // Clear authToken in UserContext
    navigate('/login'); // Redirect to login page
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;
