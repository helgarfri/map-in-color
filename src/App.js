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
import Map from './components/Map';
import UnderConstruction from './components/UnderConstruction';

library.add(fas);

function App() {

  const { authToken, profile } = useContext(UserContext);

  const [isCollapsed, setIsCollapsed] = useState(true);


  const isUserLoggedIn = !!authToken && !!profile;

  return <UnderConstruction/>
}

export default App;
