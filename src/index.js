import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { UserProvider } from './context/UserContext';
import { SidebarProvider } from './context/SidebarContext';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
 
    <UserProvider>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </UserProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
;
