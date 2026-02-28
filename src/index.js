import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import { UserProvider } from './context/UserContext';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <UserProvider>
    <ThemeProvider>
      <SidebarProvider>
        <App />
      </SidebarProvider>
    </ThemeProvider>
  </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals())
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
;
