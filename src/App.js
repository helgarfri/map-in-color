import './components/App.css';
import Header from './components/Header';

import Footer from './components/Footer';
import Home from './components/Home';
import Dashboard from './components/Dashboard';

import Login from './components/Login';
import Signup from './components/Signup';
import EditMap from './components/EditMap';

import PrivateRoute from './components/PrivateRoute';

import { useState } from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DataIntegration from './components/DataIntergration';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" 
          element={<DataIntegration 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated}/>} />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <Dashboard
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
            />
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
