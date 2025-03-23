// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import FullScreenLoader from './FullScreenLoader'; // <-- import the new loader

function PrivateRoute({ children }) {
  const { authToken, loadingProfile } = useContext(UserContext);

  if (loadingProfile) {
    // Show your fancy full-screen skeleton or spinner
    return <FullScreenLoader />;
  }

  return authToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
