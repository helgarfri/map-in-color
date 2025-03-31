// src/api.js

import axios from 'axios';

const API = axios.create({ baseURL: 'https://map-in-color.onrender.com/api' });

// Add token to headers
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers['Authorization'] = `Bearer ${token}`;
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid => remove token from localStorage
      localStorage.removeItem('token');
      // Possibly dispatch a "logout" action or set some state,
      // but do NOT forcibly navigate:
      // e.g. store.dispatch({ type: 'LOGOUT' });
    }
    return Promise.reject(error);
  }
);


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

export const updateUserProfile = (profileData) =>
  API.put('/profile', profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// Fetch a map by ID
export const fetchMapById = (id) => API.get(`/maps/${id}`);

// Save a map
export const saveMap = (mapId) => API.post(`/maps/${mapId}/save`);

// Unsave a map
export const unsaveMap = (mapId) => API.post(`/maps/${mapId}/unsave`);

// Fetch comments for a map
export const fetchComments = (mapId) => API.get(`/maps/${mapId}/comments`);

// Post a comment on a map
export const postComment = (mapId, commentData) =>
  API.post(`/maps/${mapId}/comments`, commentData);

// Fetch user profile by username
export const fetchUserProfileByUsername = (username) => API.get(`/profile/${username}`);


// fetch all public maps by that user, with pagination & sorting
export const fetchMapsByuser_id = (user_id, page = 1, limit = 12, sort = 'newest') => {
  return API.get(`/maps/user/${user_id}?page=${page}&limit=${limit}&sort=${sort}`);
};

// to fetch starred maps by user ID
export const fetchStarredMapsByuser_id = (user_id, page = 1, limit = 12, sort = 'newest') => {
  return API.get(`/maps/user/${user_id}/starred?page=${page}&limit=${limit}&sort=${sort}`);
};

// Fetch saved maps for the authenticated user
export const fetchSavedMaps = () => API.get('/maps/saved');

// Fetch notifications
export const fetchNotifications = () => API.get('/notifications');

// Mark notification as read
export const markNotificationAsRead = (id) => API.put(`/notifications/${id}/read`);

// Mark all notifications as read
export const markAllNotificationsAsRead = () => API.put('/notifications/read-all');

export const setCommentReaction = (comment_id, reaction) => {
  // reaction is "like", "dislike", or null
  return API.post(`/comments/${comment_id}/reaction`, { reaction });
};
// Delete a comment
export const deleteComment = (comment_id) => API.delete(`/comments/${comment_id}`);

// Delete a notification
export const deleteNotification = (id) => API.delete(`/notifications/${id}`);

export const fetchDashboardActivity = (offset = 0, limit = 15) => {
  return API.get(`/activity/dashboard?offset=${offset}&limit=${limit}`);
};

// Fetch user activity with pagination
export const fetchUserActivity = (username, offset = 0, limit = 10) =>
  API.get(`/activity/profile/${username}?offset=${offset}&limit=${limit}`);


// Fetch user map stats (total maps and total stars)
export const fetchUserMapStats = (user_id) =>
  API.get(`/maps/user/${user_id}/stats`);

// Fetch the most starred map by user ID
export const fetchMostStarredMapByuser_id = (user_id) =>
  API.get(`/maps/user/${user_id}/most-starred`);

export const incrementMapDownloadCount = (mapId) => API.post(`/maps/${mapId}/download`);

export const changeUserPassword = (payload) => {
  // payload: { oldPassword, newPassword }
  return API.put('/users/change-password', payload);
};

export const deleteUserAccount = ({ reason, feedback }) =>
  API.delete('/users/deleteAccount', { data: { reason, feedback } });

export const subscribeEmail = (email) =>
  API.post('/notify', { email });

export const reportComment = (commentId, reportData) => {
  // reportData should have { reasons: [], details: '...' }
  return API.post(`/comments/${commentId}/report`, reportData);
};

export const fetchPendingReports = () => {
  return API.get('/admin/reports'); 
  // => GET /api/admin/reports
};

export const approveReport = (reportId) => {
  return API.post(`/admin/reports/${reportId}/approve`);
};

export const deleteReport = (reportId) => {
  return API.post(`/admin/reports/${reportId}/delete`);
};

export const reportProfile = (username, reportData) => {
  // reportData might look like: { reasons: ['Inappropriate'], details: '...' }
  return API.post(`/profile/${username}/report`, reportData);
};

export const fetchPendingProfileReports = () => {
  return API.get('/admin/profile-reports');
};

export const approveProfileReport = (reportId) => {
  return API.post(`/admin/profile-reports/${reportId}/approve`);
};

export const banProfileReport = (reportId) => {
  return API.post(`/admin/profile-reports/${reportId}/ban`);
};
