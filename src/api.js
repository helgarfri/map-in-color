// src/api.js
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

// Add token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers['Authorization'] = `Bearer ${token}`;
  return req;
});

export { API };

// Existing exports
export const signUp = (formData) => API.post('/auth/signup', formData);
export const logIn = (formData) => API.post('/auth/login', formData);
export const fetchMaps = () => API.get('/maps');
export const createMap = (mapData) => API.post('/maps', mapData);
export const updateMap = (id, mapData) => API.put(`/maps/${id}`, mapData);
export const deleteMap = (id) => API.delete(`/maps/${id}`);

// New exports for profile
export const fetchUserProfile = () => API.get('/profile'); // GET /profile
export const updateUserProfile = (profileData) => API.put('/profile', profileData); // PUT /profile
