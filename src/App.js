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

import { useState } from 'react';

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


library.add(fas);

function App() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <SidebarProvider>
    <UserProvider>
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

        {/* <Route
          path="/signup"
          element={<Signup  />}
        />  */}

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

      </Routes>

    </Router>
    </UserProvider>
    </SidebarProvider>
  );
}

export default App;
