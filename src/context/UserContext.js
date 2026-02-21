// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { fetchUserProfile } from '../api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [profile, setProfile] = useState(null);
  const [profile_pictureUrl, setProfilePictureUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorProfile, setErrorProfile] = useState('');
  const isPro = String(profile?.plan || "free").toLowerCase() === "pro";
// src/context/UserContext.js

useEffect(() => {
    const loadUserProfile = async () => {
      if (!authToken) {
        setProfile(null);
        setLoadingProfile(false);
        return;
      }
  
      setLoadingProfile(true);
      try {
        const res = await fetchUserProfile();
        setProfile(res.data);
 const plan = res.data?.plan ?? "free";
console.log("plan from API:", plan);
console.log("computed isPro:", String(plan).toLowerCase() === "pro");



      } catch (err) {
        setErrorProfile('Session expired. Please log in again.');
        setProfile(null);
        setAuthToken(null);
        localStorage.removeItem('token');
      } finally {
        setLoadingProfile(false);
      }
    };
  
    loadUserProfile();
  }, [authToken]);
  

  return (
    <UserContext.Provider
      value={{
        authToken, // Include authToken here
        setAuthToken,
        profile,
        setProfile,
        profile_pictureUrl,
        setProfilePictureUrl,
        loadingProfile,
        errorProfile,
        isPro
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
