import React from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  LayoutDashboard, 
  Globe, 
  Server, 
  Tags, 
  Users, 
  LogOut, 
  Moon, 
  Sun, 
  Settings as SettingsIcon
} from 'lucide-react';
import Dashboard from './Dashboard';
import SiteList from './SiteList';
import ServerList from './ServerList';
import SiteTypeList from './SiteTypeList';
import AdminList from './AdminList';
import Settings from './Settings';

const MasterAdmin: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 z-10">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-500">OmniaNetwork Master Admin</h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/master-admin/settings"
              className="p-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
              title="Settings"
            >
              <SettingsIcon size={20} />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition-colors duration-200"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-700/50 flex flex-col flex-shrink-0">
          <nav className="flex-1 px-6 pt-6 space-y-2">
            <Link
              to="/master-admin"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${
                location.pathname === '/master-admin'
                  ? 'bg-gray-200/80 dark:bg-gray-600/50 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="mr-3" size={20} />
              Dashboard
            </Link>
            <Link
              to="/master-admin/sites"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${
                location.pathname === '/master-admin/sites'
                  ? 'bg-gray-200/80 dark:bg-gray-600/50 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Globe className="mr-3" size={20} />
              My Sites
            </Link>
            <Link
              to="/master-admin/admins"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${
                location.pathname === '/master-admin/admins'
                  ? 'bg-gray-200/80 dark:bg-gray-600/50 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="mr-3" size={20} />
              My Admins
            </Link>
            <Link
              to="/master-admin/servers"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${
                location.pathname === '/master-admin/servers'
                  ? 'bg-gray-200/80 dark:bg-gray-600/50 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Server className="mr-3" size={20} />
              Servers
            </Link>
            <Link
              to="/master-admin/site-types"
              className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-150 ${
                location.pathname === '/master-admin/site-types'
                  ? 'bg-gray-200/80 dark:bg-gray-600/50 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Tags className="mr-3" size={20} />
              Content Types
            </Link>
          </nav>
          <div className="px-6 py-6 border-t border-gray-200/30 dark:border-gray-600/30">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-gray-700 dark:text-gray-100 hover:bg-gray-200/80 dark:hover:bg-gray-600/50 hover:text-gray-900 dark:hover:text-white rounded-lg transition-colors duration-150"
            >
              <LogOut className="mr-3" size={20} />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sites" element={<SiteList />} />
              <Route path="/admins" element={<AdminList />} />
              <Route path="/servers" element={<ServerList />} />
              <Route path="/site-types" element={<SiteTypeList />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MasterAdmin;