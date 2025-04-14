import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './DashBoard';
import ProtectedRoute from './ProtectedRoute';

function RouterFile() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default RouterFile;
