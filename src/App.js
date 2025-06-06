import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './Dashboard'; // Your existing Dashboard component
import Signin from './auth/Signin'; // Your signin component
import Protectedroute from './auth/Protectedroute';
import Signup from './auth/Signup';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public route for signin */}
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected dashboard routes */}
        <Route path="/dashboard/*" element={<Protectedroute element={<Dashboard />} />} />
        
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Catch all route - redirect to signin */}
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;