import React, { useState, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ManagerDashboard } from './components/manager/ManagerDashboard';
import { CashierDashboard } from './components/cashier/CashierDashboard';
import { CustomerDashboard } from './components/customer/CustomerDashboard';
import { 
  login, 
  registerCustomer, 
  setAuthToken, 
  setUserInfo, 
  getAuthToken, 
  getUserInfo,
  removeAuthToken,
  removeUserInfo,
  getCurrentUser 
} from '../services/api';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    role: string;
    name: string;
    token: string;
    email?: string;
    createdAt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const storedUserInfo = getUserInfo();
      
      if (token && storedUserInfo) {
        try {
          // Verify token by fetching current user
          const userData = await getCurrentUser();
          setCurrentUser({
            ...userData,
            token
          });
        } catch (err: any) {
          console.error('Token invalid or expired:', err.message);
          // Clear invalid auth data
          removeAuthToken();
          removeUserInfo();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await login(email, password);
      
      // Save to localStorage
      setAuthToken(response.token);
      setUserInfo({
        id: response.id,
        name: response.name,
        role: response.role,
        email: response.email,
        createdAt: response.createdAt
      });
      
      // Set current user state
      setCurrentUser({
        id: response.id,
        name: response.name,
        role: response.role,
        token: response.token,
        email: response.email,
        createdAt: response.createdAt
      });
      
    } catch (error: any) {
      console.error('Login failed:', error.message);
      setError(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleRegister = async (userData: { fullName: string; email: string; password: string }) => {
    setError(null);
    try {
      const response = await registerCustomer(userData.fullName, userData.email, userData.password);
      
      // Save to localStorage
      setAuthToken(response.token);
      setUserInfo({
        id: response.id,
        name: response.name,
        role: response.role,
        email: response.email,
        createdAt: response.createdAt
      });
      
      // Set current user state
      setCurrentUser({
        id: response.id,
        name: response.name,
        role: response.role,
        token: response.token,
        email: response.email,
        createdAt: response.createdAt
      });
      
    } catch (error: any) {
      console.error('Registration failed:', error.message);
      setError(error.message || 'Registration failed. Please try again.');
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeUserInfo();
    setCurrentUser(null);
    setError(null);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if no user is logged in
  if (!currentUser) {
    return (
      <>
        <LoginPage onLogin={handleLogin} onRegister={handleRegister} />
        {error && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
      </>
    );
  }

  // Show appropriate dashboard based on user role
  switch (currentUser.role.toLowerCase()) {
    case 'admin':
      return <AdminDashboard onLogout={handleLogout} />;
    case 'manager':
      return (
        <ManagerDashboard 
          onLogout={handleLogout}
          authToken={currentUser.token}
          userData={{
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
            email: currentUser.email,
            createdAt: currentUser.createdAt,
            storeStatus: 'Open: 8:00 AM - 10:00 PM',
            staffOnDuty: 3
          }}
        />
      );
    case 'cashier':
      return (
        <CashierDashboard 
          onLogout={handleLogout}
          authToken={currentUser.token}
          userData={{
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
            email: currentUser.email,
            createdAt: currentUser.createdAt,
            shift: 'Morning Shift',
            shiftStart: '8:00 AM'
          }}
        />
      );
    case 'customer':
      return (
        <CustomerDashboard 
          onLogout={handleLogout}
          authToken={currentUser.token}
          userData={{
            id: currentUser.id,
            name: currentUser.name,
            role: currentUser.role,
            email: currentUser.email,
            createdAt: currentUser.createdAt
          }}
        />
      );
    default:
      return <LoginPage onLogin={handleLogin} onRegister={handleRegister} />;
  }
}