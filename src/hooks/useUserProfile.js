// src/hooks/useUserProfile.js
import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../api';

export function useUserProfile() {
  const [profile, setProfile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState('');

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetchUserProfile();
        setProfile({
          username: res.data.username,
          email: res.data.email,
          location: res.data.location || '',
          description: res.data.description || '',
          gender: res.data.gender || '',
        });
        if (res.data.profilePicture) {
          setProfilePictureUrl(`http://localhost:5000${res.data.profilePicture}`);
        } else {
          setProfilePictureUrl('/images/default-profile-picture.png');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setErrorProfile('Failed to fetch profile.');
      } finally {
        setLoadingProfile(false);
      }
    };
    getProfile();
  }, []);

  

  return { profile, profilePictureUrl, loadingProfile, errorProfile };
}
