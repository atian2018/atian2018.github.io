import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PatientForm from './pages/PatientForm';
import ReportsPage from './pages/ReportsPage';
import AdminPanel from './pages/AdminPanel';
import FloatingConnectionTest from './components/FloatingConnectionTest';

// Services
import { authService } from './services/authService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check authentication status on app load
    const checkAuth = async () => {
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Monitor online/offline status (Usability Heuristic 1: Visibility of system status)
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    authService.logout();
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <span style={{ marginLeft: '12px' }}>Loading...</span>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Heuristic 1: Visibility of system status - Prominent offline banner */}
        {!isOnline && (
          <div style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            backgroundColor: '#fef3c7',
            borderBottom: '3px solid #f59e0b',
            color: '#92400e',
            padding: '12px 20px',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: '16px',
            zIndex: 1001,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}>
            ⚠️ OFFLINE MODE - Your data is being saved locally and will sync when connection is restored
          </div>
        )}
        
        {/* Add top padding when offline banner is shown */}
        <div style={{ paddingTop: !isOnline ? '60px' : '0' }}>
          {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <main className="container">
          <Routes>
            <Route 
              path="/login" 
              element={
                user ? <Navigate to="/dashboard" replace /> : 
                <LoginPage onLogin={handleLogin} />
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                user ? <Dashboard user={user} /> : 
                <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/patient-form" 
              element={
                user ? <PatientForm user={user} /> : 
                <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/reports" 
              element={
                user ? <ReportsPage user={user} /> : 
                <Navigate to="/login" replace />
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                user && user.role === 'administrator' ? <AdminPanel user={user} /> : 
                <Navigate to="/dashboard" replace />
              } 
            />
            
            <Route 
              path="/" 
              element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
            />
          </Routes>
        </main>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        
        {/* Floating connection test for demo */}
        {user && <FloatingConnectionTest />}
        </div>
      </div>
    </Router>
  );
}

export default App;
