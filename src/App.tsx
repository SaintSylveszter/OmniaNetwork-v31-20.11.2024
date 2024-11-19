import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import MasterAdmin from './components/MasterAdmin';
import SiteAdmin from './components/SiteAdmin';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#333',
              color: '#fff',
            },
            success: {
              duration: 3000,
              style: {
                background: '#059669',
                color: '#fff',
              },
            },
            error: {
              duration: 4000,
              style: {
                background: '#DC2626',
                color: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/master-admin/*"
            element={
              <ProtectedRoute>
                <MasterAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/:adminName/*"
            element={
              <ProtectedRoute>
                <SiteAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;