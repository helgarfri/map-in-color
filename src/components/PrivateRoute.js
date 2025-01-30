// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function PrivateRoute({ children }) {
  const { authToken, loadingProfile } = useContext(UserContext);

  if (loadingProfile) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return authToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
