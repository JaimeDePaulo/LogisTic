/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import FoodProducts from './pages/FoodProducts';
import ConstructionProducts from './pages/ConstructionProducts';
import Entries from './pages/Entries';
import Exits from './pages/Exits';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Layout from './components/Layout';
import { User } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  const isAdmin = user.role === 'admin';

  return (
    <Router>
      <Layout user={user} onLogout={logout}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          {/* Common Routes */}
          <Route path="/entries" element={<Entries />} />
          <Route path="/exits" element={<Exits />} />
          
          {/* Admin Only Routes */}
          {isAdmin && (
            <>
              <Route path="/products/food" element={<FoodProducts />} />
              <Route path="/products/construction" element={<ConstructionProducts />} />
              <Route path="/stock" element={<Stock />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<Users />} />
            </>
          )}
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

