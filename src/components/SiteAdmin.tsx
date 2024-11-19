import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Tag, 
  Users, 
  Settings, 
  LogOut, 
  Home,
  Tags,
  BookOpen,
  Layout,
  Type,
  Info,
  Code,
  Share2,
  FileStack,
  Cookie,
  BadgeDollarSign,
  Database,
  ChevronDown,
  ChevronRight,
  FileEdit
} from 'lucide-react';
import sql from '../lib/db/neon';
import { testConnection } from '../lib/db/connections';
import BasicInfo from './BasicInfo';
import TrackingCodes from './TrackingCodes';
import SocialMedia from './SocialMedia';
import Fonts from './Fonts';
import Categories from './Categories';
import Theme from './Theme';
import AuthorList from './AuthorList';
import BasicPages from './BasicPages';
import CookieSettings from './CookieSettings';
import Articles from './Articles';

const SiteAdmin: React.FC = () => {
  const { adminName } = useParams();
  const navigate = useNavigate();
  const [contentOpen, setContentOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [masterDbStatus, setMasterDbStatus] = useState<'connected' | 'error' | null>(null);
  const [siteDbStatus, setSiteDbStatus] = useState<'connected' | 'error' | null>(null);
  const [connectionError, setConnectionError] = useState<string>('');

  React.useEffect(() => {
    checkConnections();
  }, [adminName]);

  const checkConnections = async () => {
    try {
      // First check master database connection
      const masterConnected = await testConnection(import.meta.env.VITE_DATABASE_URL);
      setMasterDbStatus(masterConnected ? 'connected' : 'error');

      // Then get the site connection string and test it
      const [admin] = await sql`
        SELECT connection_string 
        FROM admins 
        WHERE username = ${adminName}
        AND status = 'active'
        LIMIT 1
      `;

      if (!admin?.connection_string) {
        throw new Error('No site connection string found');
      }

      // Test the site database connection
      const siteConnected = await testConnection(admin.connection_string);
      setSiteDbStatus(siteConnected ? 'connected' : 'error');

      if (!masterConnected || !siteConnected) {
        throw new Error('Site database connection failed');
      }

      setConnectionError('');
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Site database connection failed');
      console.error('Database connection error:', error);
    }
  };

  const capitalizedName = adminName ? adminName.charAt(0).toUpperCase() + adminName.slice(1) : '';

  const mainMenuClasses = "flex items-center space-x-2 px-4 py-2.5 text-gray-700 dark:text-gray-200 bg-gray-200/50 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg border border-gray-200/50 dark:border-gray-600/50";
  const getSubMenuClasses = (itemName: string) => `flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 rounded-lg ${
    selectedItem === itemName 
      ? 'bg-gray-200 dark:bg-gray-700' 
      : 'hover:bg-gray-200 dark:hover:bg-gray-700'
  }`;

  const renderContent = () => {
    switch (selectedItem) {
      case 'basic-info':
        return <BasicInfo />;
      case 'tracking-codes':
        return <TrackingCodes />;
      case 'social-media':
        return <SocialMedia />;
      case 'fonts':
        return <Fonts />;
      case 'categories':
        return <Categories />;
      case 'articles':
        return <Articles />;
      case 'theme':
        return <Theme />;
      case 'authors':
        return <AuthorList />;
      case 'basic-pages':
        return <BasicPages />;
      case 'cookie-banner':
        return <CookieSettings />;
      default:
        return (
          <div className="text-center text-gray-600 dark:text-gray-400 mt-8">
            Select an item from the menu to view its content
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <header className="bg-gray-800 z-10">
        <div className="px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">{capitalizedName} Admin</h1>
          <button
            onClick={() => navigate('/master-admin')}
            className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <LogOut size={20} />
            <span>Back to Master Admin</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <nav className="flex-1 p-4 space-y-2">
            {/* Dashboard */}
            <a 
              href="#"
              onClick={() => setSelectedItem('dashboard')} 
              className={mainMenuClasses}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </a>

            {/* Content Section */}
            <div>
              <button
                onClick={() => setContentOpen(!contentOpen)}
                className={`w-full justify-between ${mainMenuClasses}`}
              >
                <div className="flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Content</span>
                </div>
                {contentOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {contentOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('homepage')}
                    className={getSubMenuClasses('homepage')}
                  >
                    <Home size={18} />
                    <span>Homepage</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('categories')}
                    className={getSubMenuClasses('categories')}
                  >
                    <BookOpen size={18} />
                    <span>Categories</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('articles')}
                    className={getSubMenuClasses('articles')}
                  >
                    <FileEdit size={18} />
                    <span>Articles</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('authors')}
                    className={getSubMenuClasses('authors')}
                  >
                    <Users size={18} />
                    <span>Authors</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('tags')}
                    className={getSubMenuClasses('tags')}
                  >
                    <Tags size={18} />
                    <span>Tags</span>
                  </a>
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div>
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className={`w-full justify-between ${mainMenuClasses}`}
              >
                <div className="flex items-center space-x-2">
                  <Settings size={20} />
                  <span>Settings</span>
                </div>
                {settingsOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              </button>
              {settingsOpen && (
                <div className="ml-4 mt-2 space-y-1">
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('theme')}
                    className={getSubMenuClasses('theme')}
                  >
                    <Layout size={18} />
                    <span>Theme</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('layout')}
                    className={getSubMenuClasses('layout')}
                  >
                    <Layout size={18} />
                    <span>Layout</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('fonts')}
                    className={getSubMenuClasses('fonts')}
                  >
                    <Type size={18} />
                    <span>Fonts</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('basic-info')}
                    className={getSubMenuClasses('basic-info')}
                  >
                    <Info size={18} />
                    <span>Basic Info</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('tracking-codes')}
                    className={getSubMenuClasses('tracking-codes')}
                  >
                    <Code size={18} />
                    <span>Tracking Codes</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('social-media')}
                    className={getSubMenuClasses('social-media')}
                  >
                    <Share2 size={18} />
                    <span>Social Media</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('basic-pages')}
                    className={getSubMenuClasses('basic-pages')}
                  >
                    <FileStack size={18} />
                    <span>Basic Pages</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('cookie-banner')}
                    className={getSubMenuClasses('cookie-banner')}
                  >
                    <Cookie size={18} />
                    <span>Cookie Banner</span>
                  </a>
                  <a 
                    href="#"
                    onClick={() => setSelectedItem('advertising')}
                    className={getSubMenuClasses('advertising')}
                  >
                    <BadgeDollarSign size={18} />
                    <span>Advertising</span>
                  </a>
                </div>
              )}
            </div>
          </nav>

          {/* Connection Status */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center space-x-2 text-xs">
              <Database size={14} className={masterDbStatus === 'connected' ? 'text-green-500' : 'text-red-500'} />
              <span className={masterDbStatus === 'connected' ? 'text-green-500' : 'text-red-500'}>
                {masterDbStatus === 'connected' 
                  ? 'Connected to master database' 
                  : 'Master database connection failed'}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <Database size={14} className={siteDbStatus === 'connected' ? 'text-green-500' : 'text-red-500'} />
              <span className={siteDbStatus === 'connected' ? 'text-green-500' : 'text-red-500'}>
                {siteDbStatus === 'connected' 
                  ? 'Connected to site database' 
                  : connectionError || 'Site database connection failed'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-8 py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SiteAdmin;