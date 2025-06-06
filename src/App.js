// src/components/App.js
import './components/App.css';

import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

import Login from './components/Login';
import Signup from './components/Signup';
import EditMap from './components/EditMap';
import YourMaps from './components/YourMaps';

import PrivateRoute from './components/PrivateRoute';

import { useState, useContext } from 'react';

import { UserContext } from './context/UserContext';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataIntegration from './components/DataIntergration';
import ProfileSettings from './components/ProfileSettings';
import MapDetail from './components/MapDetail';
import ProfilePage from './components/ProfilePage'
import StarredMaps from './components/StarredMaps';
import NotificationList from './components/NotificationList';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import Docs from './components/Docs';
import AdminPanel from './components/AdminPanel';
import BannedUser from './components/BannedUser';

import { UserProvider } from './context/UserContext';

import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import Explore from './components/Explore';

import { SidebarProvider } from './context/SidebarContext';

import ScrollToTop from './components/ScrollToTop'; // <-- import the helper

import PrivacyPolicy from './components/PrivacyPolicy';
import Terms from './components/Terms';
import VerifyAccount from './components/VerifyAccount';
import Verified from './components/Verified';
import VerificationError from './components/VerificationError';
import PublicExplore from './components/PublicExplore';
import LoggedInExplore from './components/LoggedInExplore';
import PublicMapDetail from './components/PublicMapDetail';
import LoggedInMapDetail from './components/LoggedInMapDetail';

library.add(fas);

function App() {

  const { authToken, profile } = useContext(UserContext);

  const [isCollapsed, setIsCollapsed] = useState(true);


  const isUserLoggedIn = !!authToken && !!profile;

  return (

    <Router>
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/docs" element={<Docs />} />


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
          isUserLoggedIn
            ? <LoggedInMapDetail />
            : <PublicMapDetail />
        }
      />


          <Route path="/explore" element={
            isUserLoggedIn ? 
              <LoggedInExplore
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}/> : 
                <PublicExplore />
          } />


        <Route
          path="/your-maps"
          element={
            <PrivateRoute >
              <YourMaps
                
                
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

        <Route path="/change-password" 
        element={<ChangePassword isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}/>}
        
        
        />

<Route path="/delete-account" element={<DeleteAccount />}  />


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

<Route path="/adminPanel" element={<AdminPanel />} />

<Route path="/banned" element={<BannedUser />} />

<Route path="/privacy" element={<PrivacyPolicy />} />

<Route path="/terms" element={<Terms/>} />

<Route path="/verify-account" element={<VerifyAccount/>} />

<Route path="/verified" element={<Verified/> } />

<Route path="verification-error" element={<VerificationError/>} />


      </Routes>

    </Router>

  );
}

export default App;
