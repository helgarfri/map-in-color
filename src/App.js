// src/components/App.js
import './components/App.css';

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
import MapDetail from './components/MapDetail';
import ProfilePage from './components/ProfilePage'
import StarredMaps from './components/StarredMaps';
import NotificationList from './components/NotificationList';
import DeleteAccount from './components/DeleteAccount';
import Docs from './components/Docs';

import { UserProvider } from './context/UserContext';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Explore from './components/Explore';

library.add(fas);

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <UserProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route 
            path="/docs" 
            element={<Docs />} 
          />

        <Route
          path="/create"
          element={
            <DataIntegration
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute >
              <Dashboard
                
                
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          }
        />

        <Route
          path="/map/:id"
          element={
            <MapDetail
              
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          }
        />

        <Route 
          path="/explore" 
          element={<Explore
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />} />

        <Route
          path="/my-maps"
          element={
            <PrivateRoute >
              <MyMaps
                
                
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            </PrivateRoute>
          }
        />

        <Route 
          path="/starred-maps" 
          element={<StarredMaps
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />} />

        <Route
          path="/login"
          element={<Login  />}
        />

        <Route
          path="/signup"
          element={<Signup  />}
        />

        <Route
          path="/edit/:mapId"
          element={
            <EditMap
              
              
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          }
        />

          <Route
            path="/profile/:username"
            element={
              <ProfilePage
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
              />
            }
          />

        <Route
          path="/settings"
          element={
            <ProfileSettings
              
              
              isCollapsed={isCollapsed}
              setIsCollapsed={setIsCollapsed}
            />
          }
        />

<Route path="/delete-account" element={<DeleteAccount />} />


          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <NotificationList
                  isCollapsed={isCollapsed}
                  setIsCollapsed={setIsCollapsed}
                />
              </PrivateRoute>
            }
          />
      </Routes>

    </Router>
    </UserProvider>
  );
}

export default App;
