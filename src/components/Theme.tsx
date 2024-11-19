import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getThemeSettings, saveThemeSettings } from '../lib/api/theme';
import type { ThemeSettings } from '../types/theme';
import sql from '../lib/db/neon';
import ThemePreview from './theme/preview/ThemePreview';
import ThemeBasicColors from './theme/settings/ThemeBasicColors';
import ThemeWebsite from './theme/settings/ThemeWebsite';
import ThemeHeader from './theme/settings/ThemeHeader';
import ThemeFooter from './theme/settings/ThemeFooter';
import ThemeModules from './theme/settings/ThemeModules';
import ThemeForm from './theme/settings/ThemeForm';
import ThemeList from './theme/settings/ThemeList';

const sections = [
  { id: 'basic-colors', name: 'Basic Colors', group: 'global' },
  { id: 'website', name: 'Website', group: 'global' },
  { id: 'header', name: 'Header', group: 'global' },
  { id: 'footer', name: 'Footer', group: 'global' },
  { id: 'module', name: 'Module', group: 'global' },
  { id: 'form', name: 'Form', group: 'form' },
  { id: 'list', name: 'List', group: 'list' },
  { id: 'article', name: 'Article', group: 'article' },
  { id: 'more', name: 'More', group: 'more' }
];

const previewTabs = [
  { id: 'global', name: 'Global Settings' },
  { id: 'form', name: 'Form' },
  { id: 'list', name: 'List' },
  { id: 'article', name: 'Article' },
  { id: 'more', name: 'More' }
];

const Theme: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [settings, setSettings] = useState<ThemeSettings | null>(null);
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState('basic-colors');
  const [activePreviewTab, setActivePreviewTab] = useState('global');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionString, setConnectionString] = useState<string | null>(null);

  useEffect(() => {
    if (adminName) {
      getConnectionString();
    }
  }, [adminName]);

  useEffect(() => {
    if (connectionString) {
      loadThemeSettings();
    }
  }, [connectionString]);

  const getConnectionString = async () => {
    try {
      const [admin] = await sql<[{ connection_string: string }]>`
        SELECT connection_string 
        FROM admins 
        WHERE username = ${adminName}
        AND status = 'active'
        LIMIT 1
      `;

      if (!admin?.connection_string) {
        throw new Error('No database connection found for this site');
      }

      setConnectionString(admin.connection_string);
    } catch (error) {
      console.error('Error getting connection string:', error);
      setError('Failed to connect to site database');
      setIsLoading(false);
    }
  };

  const loadThemeSettings = async () => {
    if (!connectionString) return;

    try {
      setIsLoading(true);
      const themeData = await getThemeSettings(connectionString);
      
      if (themeData) {
        setSettings(themeData);
      }
      setError(null);
    } catch (err) {
      console.error('Error loading theme settings:', err);
      setError('Failed to load theme settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!connectionString || !settings) return;

    try {
      setIsSaving(true);
      setError(null);
      await saveThemeSettings(connectionString, settings);
      setError('Theme settings saved successfully!');
    } catch (err) {
      console.error('Error saving theme settings:', err);
      setError('Failed to save theme settings');
    } finally {
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (!settings) return null;

    switch (activeSection) {
      case 'basic-colors':
        return (
          <ThemeBasicColors
            settings={settings}
            onChange={setSettings}
          />
        );
      case 'website':
        return (
          <ThemeWebsite
            settings={settings}
            onChange={setSettings}
          />
        );
      case 'header':
        return (
          <ThemeHeader
            settings={settings}
            onChange={setSettings}
          />
        );
      case 'footer':
        return (
          <ThemeFooter
            settings={settings}
            onChange={setSettings}
          />
        );
      case 'module':
        return (
          <ThemeModules
            settings={settings}
            onChange={setSettings}
          />
        );
      case 'form':
        return (
          <ThemeForm
            settings={settings}
            onChange={setSettings}
          />
        );
      case 'list':
        return (
          <ThemeList
            settings={settings}
            onChange={setSettings}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">
              Loading theme settings...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-[1920px] mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Settings</h2>
          <div className="flex items-center space-x-4">
            <select
              value={device}
              onChange={(e) => setDevice(e.target.value as 'desktop' | 'mobile')}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${
            error.includes('success')
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {error}
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <div className="w-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setActivePreviewTab(section.group);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                    activeSection === section.id
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Content */}
          <div className="w-64 flex-shrink-0">
            {renderContent()}
          </div>

          {/* Preview */}
          <div className="flex-1">
            {/* Preview Tabs */}
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-4">
                {previewTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActivePreviewTab(tab.id);
                      // Find first section in this group and activate it
                      const firstSection = sections.find(s => s.group === tab.id);
                      if (firstSection) {
                        setActiveSection(firstSection.id);
                      }
                    }}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                      activePreviewTab === tab.id
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <ThemePreview 
              settings={settings} 
              device={device} 
              activeTab={activePreviewTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;