import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Fish, ShoppingCart, User, LogOut, Mic } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar-glass sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Fish className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">FishEasy </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/marketplace"
              className={`font-medium transition-colors ${
                isActive('/marketplace') ? 'text-blue-600' : 'text-blue-700 hover:text-blue-600'
              }`}
            >
              Marketplace
            </Link>
            {user?.role === 'seller' && (
              <>
                <Link
                  to="/seller-dashboard"
                  className={`font-medium transition-colors ${
                    isActive('/seller-dashboard') ? 'text-skyblue-600' : 'text-skyblue-700 hover:text-blue-600'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/voice-listing"
                  className={`flex items-center space-x-1 font-medium transition-colors ${
                    isActive('/voice-listing') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Mic className="h-4 w-4" />
                  <span>Voice List</span>
                </Link>
              </>
            )}
            <Link
              to="/complaints"
              className={`font-medium transition-colors ${
                isActive('/complaints') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Support
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'buyer' && (
                  <Link
                    to="/cart"
                    className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    <ShoppingCart className="h-6 w-6" />
                    {itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {itemCount}
                      </span>
                    )}
                  </Link>
                )}
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-700" />
                  <span className="text-gray-700">{user.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/signin"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;