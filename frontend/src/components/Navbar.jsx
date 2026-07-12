import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Globe, 
  LayoutDashboard, 
  User, 
  Send, 
  Users, 
  Sparkles, 
  BarChart3, 
  LogOut, 
  LogIn, 
  UserPlus 
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900';
  };

  return (
    <nav className="glass sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Globe className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI MassComm
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/')}`}>
              Home
            </Link>
            <Link to="/about" className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive('/about')}`}>
              About
            </Link>

            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${isActive('/dashboard')}`}>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/campaigns" className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${isActive('/campaigns')}`}>
                  <Send className="h-4 w-4" />
                  Campaigns
                </Link>
                <Link to="/audience" className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${isActive('/audience')}`}>
                  <Users className="h-4 w-4" />
                  Audience
                </Link>
                <Link to="/ai-content" className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${isActive('/ai-content')}`}>
                  <Sparkles className="h-4 w-4" />
                  AI Content
                </Link>
                <Link to="/analytics" className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${isActive('/analytics')}`}>
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Link>
                <Link to="/profile" className={`px-3 py-2 rounded-md text-sm font-medium transition flex items-center gap-1 ${isActive('/profile')}`}>
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Authentication Actions */}
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <span className="hidden lg:inline text-xs text-gray-500 bg-gray-100 py-1 px-2.5 rounded-full font-medium">
                  {user?.role}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {user?.fullname.split(' ')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3.5 py-1.5 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all focus:outline-none"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-primary-700 transition"
                >
                  <LogIn className="h-4 w-4 mr-1 text-gray-400" />
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 shadow transition-all focus:outline-none"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Register
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
