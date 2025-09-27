import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import AddCustomerPage from './pages/AddCustomerPage';
import GenerateBillPage from './pages/GenerateBillPage';
import ViewBillsAdminPage from './pages/ViewBillsAdminPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ViewBillsCustomerPage from './pages/ViewBillsCustomerPage';
import ProfilePage from './pages/ProfilePage';
import { UserRole } from './types';

function App() {
  return (
    <div className="min-h-screen font-sans text-slate-800 dark:text-slate-200">
      <Navbar />
      <main className="container mx-auto px-4 py-8 animate-fadeIn">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route 
            path="/admin/dashboard" 
            element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/add-customer" 
            element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AddCustomerPage /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/generate-bill" 
            element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><GenerateBillPage /></ProtectedRoute>} 
          />
          <Route 
            path="/admin/view-bills" 
            element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><ViewBillsAdminPage /></ProtectedRoute>} 
          />
          
          {/* Customer Routes */}
          <Route 
            path="/customer/dashboard" 
            element={<ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}><CustomerDashboard /></ProtectedRoute>} 
          />
          <Route 
            path="/customer/my-bills" 
            element={<ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}><ViewBillsCustomerPage /></ProtectedRoute>} 
          />
          <Route 
            path="/customer/profile" 
            element={<ProtectedRoute allowedRoles={[UserRole.CUSTOMER]}><ProfilePage /></ProtectedRoute>} 
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;