import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  UserPlus,
  Palette,
  Menu,
  X,
  Home as HomeIcon,
  Info
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem('app-theme') || 'theme-blue'
  );

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Preserve dark class if present
    const isDarkActive = document.documentElement.classList.contains('dark');
    document.documentElement.className = currentTheme;
    localStorage.setItem('app-theme', currentTheme);
    if (isDarkActive) {
      document.documentElement.classList.add('dark');
    }
  }, [currentTheme]);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path 
      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold' 
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white';
  };

  // Menu items ordered: Home, About, Dashboard, Campaigns, Audience, AI Content, Analytics, Profile
  const menuItems = [
    { name: 'Home', path: '/', icon: HomeIcon, protected: false },
    { name: 'About', path: '/about', icon: Info, protected: false },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, protected: true },
    { name: 'Campaigns', path: '/campaigns', icon: Send, protected: true },
    { name: 'Audience', path: '/audience', icon: Users, protected: true },
    { name: 'AI Content', path: '/ai-content', icon: Sparkles, protected: true },
    { name: 'Analytics', path: '/analytics', icon: BarChart3, protected: true },
    { name: 'Profile', path: '/profile', icon: User, protected: true }
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden bg-white dark:bg-[#111827] border-b border-gray-200 dark:border-[#334155] px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="text-gray-600 dark:text-gray-300 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg focus:outline-none"
          aria-label="Toggle navigation menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex items-center space-x-2">
          <Globe className="h-7 w-7 text-primary animate-pulse" />
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI MassComm
          </span>
        </Link>

        <div className="w-9"></div>
      </header>

      {/* Mobile Sidebar Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-30 md:hidden transition-opacity"
        />
      )}

      {/* Vertical Sidebar */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-[250px] bg-white dark:bg-[#111827] border-r border-gray-200 dark:border-[#334155] z-40 flex flex-col justify-between shadow-sm transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Logo & Navigation */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo container */}
          <div className="p-6 border-b border-gray-100 dark:border-[#334155] flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <Globe className="h-8 w-8 text-primary animate-pulse" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                AI MassComm
              </span>
            </Link>
            <button 
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-white focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {menuItems.map((item) => {
              if (item.protected && !isAuthenticated) return null;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${isActive(item.path)}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Configurations & Account status */}
        <div className="p-4 border-t border-gray-100 dark:border-[#334155] bg-gray-50/50 dark:bg-gray-800/10 space-y-4">
          {/* Theme switcher */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center text-gray-500 dark:text-gray-400 gap-1 text-xs">
              <Palette className="h-4 w-4 shrink-0" />
              <span>Theme</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentTheme('theme-blue')}
                title="Ocean Breeze"
                className={`h-4 w-4 rounded-full bg-[#2563EB] transition hover:scale-125 cursor-pointer border ${
                  currentTheme === 'theme-blue' ? 'ring-2 ring-offset-1 ring-blue-500 border-white' : 'border-transparent'
                }`}
              />
              <button
                onClick={() => setCurrentTheme('theme-emerald')}
                title="Forest Emerald"
                className={`h-4 w-4 rounded-full bg-[#059669] transition hover:scale-125 cursor-pointer border ${
                  currentTheme === 'theme-emerald' ? 'ring-2 ring-offset-1 ring-emerald-500 border-white' : 'border-transparent'
                }`}
              />
              <button
                onClick={() => setCurrentTheme('theme-violet')}
                title="Sunset Violet"
                className={`h-4 w-4 rounded-full bg-[#7C3AED] transition hover:scale-125 cursor-pointer border ${
                  currentTheme === 'theme-violet' ? 'ring-2 ring-offset-1 ring-violet-500 border-white' : 'border-transparent'
                }`}
              />
            </div>
          </div>

          {/* Light/Dark Toggle Switcher */}
          <div className="flex bg-gray-200/60 dark:bg-gray-800 p-1 rounded-xl">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              🌞 Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#1E293B] text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              🌙 Dark
            </button>
          </div>

          {/* User Details & Login/Logout Actions */}
          {isAuthenticated ? (
            <div className="space-y-3 pt-1">
              <div className="px-2">
                <div className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                  {user?.fullname || 'Vishnu'}
                </div>
                <div className="mt-1">
                  <span className="inline-block text-[10px] font-semibold text-primary-700 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-0.5 rounded-full uppercase tracking-wide border border-primary-100 dark:border-[#334155]">
                    {user?.role || 'Communication Team'}
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 shadow-sm transition-all focus:outline-none cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 pt-1">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-lg hover:text-primary-700 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
              >
                <LogIn className="h-4 w-4 mr-2 text-gray-400" />
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-blue-700 shadow transition-all focus:outline-none cursor-pointer"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Register
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Navbar;
