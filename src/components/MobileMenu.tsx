import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Shield, User, LogOut, Home, DollarSign, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MobileMenuProps {
  isAuthenticated?: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isAuthenticated = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const scrollToVideo = () => {
    closeMenu();
    const videoSection = document.getElementById('video-demo');
    if (videoSection) {
      videoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Enhanced logout function for mobile menu
  const handleLogout = async () => {
    try {
      closeMenu();
      await logout();
    } catch (error) {
      console.error('Mobile menu logout error:', error);
      // Fallback cleanup
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="md:hidden">
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={closeMenu}>
          <div 
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">TenderGuard AI</span>
              </div>
              <button
                onClick={closeMenu}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* User Info (if authenticated) */}
            {user && (
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <nav className="flex-1 p-4 bg-white">
              <div className="space-y-2">
                {!user ? (
                  // Unauthenticated menu
                  <>
                    <Link
                      to="/"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <Home className="h-5 w-5 mr-3" />
                      Home
                    </Link>
                    <button
                      onClick={scrollToVideo}
                      className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <Play className="h-5 w-5 mr-3" />
                      View Demo
                    </button>
                    <Link
                      to="/pricing"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <DollarSign className="h-5 w-5 mr-3" />
                      Pricing
                    </Link>
                    
                    <div className="border-t border-gray-200 my-4"></div>
                    
                    <Link
                      to="/signin"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <User className="h-5 w-5 mr-3" />
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors font-medium"
                    >
                      <Shield className="h-5 w-5 mr-3" />
                      Create Account
                    </Link>
                  </>
                ) : (
                  // Authenticated menu
                  <>
                    <Link
                      to="/dashboard"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <Home className="h-5 w-5 mr-3" />
                      Dashboard
                    </Link>
                    <Link
                      to="/pricing"
                      onClick={closeMenu}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <DollarSign className="h-5 w-5 mr-3" />
                      Pricing
                    </Link>
                    
                    <div className="border-t border-gray-200 my-4"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </button>
                  </>
                )}
              </div>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <p className="text-xs text-gray-500 text-center">
                © 2025 TenderGuard AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;