import React from 'react';
import { Navigate } from 'react-router-dom';

const Protectedroute = ({ element }) => {
  // Check if token exists in sessionStorage
  const token = sessionStorage.getItem('token');
  
  // Function to check if token is valid (not expired)
  const isTokenValid = (token) => {
    if (!token) return false;
    
    try {
      // Decode the JWT token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000; // Current time in seconds
      
      // Check if token is expired
      if (payload.exp && payload.exp < currentTime) {
        // Token is expired, remove it from storage
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('role');
        return false;
      }
      
      return true;
    } catch (error) {
      // Invalid token format
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('role');
      return false;
    }
  };

  // If no token or invalid token, redirect to signin
  if (!isTokenValid(token)) {
    return <Navigate to="/signin" replace />;
  }

  // If token is valid, render the protected component
  return element;
};

export default Protectedroute;