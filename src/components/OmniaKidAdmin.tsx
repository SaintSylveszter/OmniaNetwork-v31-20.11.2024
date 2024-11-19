import React, { useState } from 'react';
import { Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, FileText, Tag, Users, Settings, LogOut } from 'lucide-react';
import OmniaKidDashboard from './OmniaKidDashboard';
import ArticleList from './ArticleList';
import CategoryList from './CategoryList';
import AuthorList from './AuthorList';
import SiteSettings from './SiteSettings';

const OmniaKidAdmin: React.FC = () => {
  const { logout } = useAuth();
  const { siteId } = useParams<{ siteId: string }>();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-green-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
        <nav>
          <Link to={`/omniakid-admin/${siteId}`} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700 hover:text-white">
            <LayoutDashboard className="inline-block mr-2" size={20} />
            Dashboard
          </Link>
          <Link to={`/omniakid-admin/${siteId}/articles`} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700 hover:text-white">
            <FileText className="inline-block mr-2" size={20} />
            Articles
          </Link>
          <Link to={`/omniakid-admin/${siteId}/categories`} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700 hover:text-white">
            <Tag className="inline-block mr-2" size={20} />
            Categories
          </Link>
          <Link to={`/omniakid-admin/${siteId}/authors`} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700 hover:text-white">
            <Users className="inline-block mr-2" size={20} />
            Authors
          </Link>
          <Link to={`/omniakid-admin/${siteId}/settings`} className="block py-2.5 px-4 rounded transition duration-200 hover:bg-green-700 hover:text-white">
            <Settings className="inline-block mr-2" size={20} />
            Settings
          </Link>
        </nav>
        <button onClick={handleLogout} className="block w-full py-2.5 px-4 rounded transition duration-200 hover:bg-green-700 hover:text-white">
          <LogOut className="inline-block mr-2" size={20} />
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">OmniaKid Admin: Site {siteId}</h1>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<OmniaKidDashboard />} />
              <Route path="/articles" element={<ArticleList />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/authors" element={<AuthorList />} />
              <Route path="/settings" element={<SiteSettings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OmniaKidAdmin;