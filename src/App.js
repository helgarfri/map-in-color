// src/components/App.js
import './components/App.css';
import Header from './components/Header';

import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

import Login from './components/Login';
import Signup from './components/Signup';
import EditMap from './components/EditMap';
import MyMaps from './components/MyMaps';

import PrivateRoute from './components/PrivateRoute';

import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataIntegration from './components/DataIntergration';
import ProfileSettings from './components/ProfileSettings';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/create"
          element={
            <DataIntegration
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/my-maps"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <MyMaps
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/login"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/signup"
          element={<Signup setIsAuthenticated={setIsAuthenticated} />}
        />

        <Route
          path="/edit/:mapId"
          element={
            <EditMap
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          }
        />

        <Route
          path="/profile-settings"
          element={
            <ProfileSettings
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          }
        />
      </Routes>

    </Router>
  );
}

export default App;
