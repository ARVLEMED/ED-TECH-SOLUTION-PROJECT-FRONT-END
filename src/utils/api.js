// src/utils/api.js
export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found, please log in');
    }
  
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  
    const response = await fetch(`https://ed-tech-solution-project-back-end.onrender.com/api/${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });
  
    if (!response.ok) {
      if (response.status === 401 || response.status === 422) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired, please log in again');
      }
      throw new Error(`Request failed: ${response.status}`);
    }
  
    return response.json();
  };