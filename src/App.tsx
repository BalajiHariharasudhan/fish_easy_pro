import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationToast from './components/NotificationToast';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import SellerDashboard from './pages/SellerDashboard';
import VoiceListingPage from './pages/VoiceListingPage';
import MarketplacePage from './pages/MarketplacePage';
import CartPage from './pages/CartPage';
import ComplaintPanel from './pages/ComplaintPanel';
import AdminPanel from './pages/AdminPanel';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
              <LoadingSpinner />
              <NotificationToast />
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/seller-dashboard" element={<SellerDashboard />} />
                <Route path="/voice-listing" element={<VoiceListingPage />} />
                <Route path="/marketplace" element={<MarketplacePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/complaints" element={<ComplaintPanel />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;