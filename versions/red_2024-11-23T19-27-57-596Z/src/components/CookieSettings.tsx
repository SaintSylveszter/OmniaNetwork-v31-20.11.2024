import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';

interface CookieSettings {
  id: string;
  enabled: boolean;
  position: 'bottom' | 'top';
  custom_message_en: string | null;
  custom_message_ro: string | null;
  accept_button_text_en: string | null;
  accept_button_text_ro: string | null;
  reject_button_text_en: string | null;
  reject_button_text_ro: string | null;
  learn_more_text_en: string | null;
  learn_more_text_ro: string | null;
  background_color: string;
  text_color: string;
  accept_button_color: string;
  reject_button_color: string;
}

const defaultMessages = {
  en: {
    message: 'We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.',
    accept: 'Accept',
    reject: 'Reject',
    learnMore: 'Learn more'
  },
  ro: {
    message: 'Folosim cookie-uri pentru a îmbunătăți experiența dumneavoastră. Continuând să vizitați acest site, sunteți de acord cu utilizarea cookie-urilor.',
    accept: 'Accept',
    reject: 'Refuz',
    learnMore: 'Află mai multe'
  }
};

const CookieSettings: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [settings, setSettings] = useState<CookieSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [connectionString, setConnectionString] = useState<string | null>(null);

  useEffect(() => {
    if (adminName) {
      getConnectionString();
    }
  }, [adminName]);

  useEffect(() => {
    if (connectionString) {
      loadSettings();
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
      setMessage({
        type: 'error',
        text: 'Failed to connect to site database'
      });
      setIsLoading(false);
    }
  };

  const loadSettings = async () => {
    if (!connectionString) return;

    try {
      setIsLoading(true);
      const siteDb = getConnection(connectionString);

      // Create table if it doesn't exist
      await siteDb`
        CREATE TABLE IF NOT EXISTS cookie_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          enabled BOOLEAN DEFAULT true,
          position VARCHAR(10) DEFAULT 'bottom',
          custom_message_en TEXT,
          custom_message_ro TEXT,
          accept_button_text_en VARCHAR(50),
          accept_button_text_ro VARCHAR(50),
          reject_button_text_en VARCHAR(50),
          reject_button_text_ro VARCHAR(50),
          learn_more_text_en VARCHAR(50),
          learn_more_text_ro VARCHAR(50),
          background_color VARCHAR(20) DEFAULT '#1f2937',
          text_color VARCHAR(20) DEFAULT '#ffffff',
          accept_button_color VARCHAR(20) DEFAULT '#22c55e',
          reject_button_color VARCHAR(20) DEFAULT '#4b5563',
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Get existing settings or create default
      const [existingSettings] = await siteDb<CookieSettings[]>`
        SELECT * FROM cookie_settings LIMIT 1
      `;

      if (existingSettings) {
        setSettings(existingSettings);
      } else {
        // Insert default settings
        const [newSettings] = await siteDb<CookieSettings[]>`
          INSERT INTO cookie_settings (
            enabled,
            position,
            background_color,
            text_color,
            accept_button_color,
            reject_button_color
          ) VALUES (
            true,
            'bottom',
            '#1f2937',
            '#ffffff',
            '#22c55e',
            '#4b5563'
          ) RETURNING *
        `;
        setSettings(newSettings);
      }

      setMessage(null);
    } catch (error) {
      console.error('Error loading settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load cookie banner settings'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionString || !settings) return;

    try {
      setIsSaving(true);
      setMessage(null);

      const siteDb = getConnection(connectionString);
      await siteDb`
        UPDATE cookie_settings 
        SET 
          enabled = ${settings.enabled},
          position = ${settings.position},
          custom_message_en = ${settings.custom_message_en},
          custom_message_ro = ${settings.custom_message_ro},
          accept_button_text_en = ${settings.accept_button_text_en},
          accept_button_text_ro = ${settings.accept_button_text_ro},
          reject_button_text_en = ${settings.reject_button_text_en},
          reject_button_text_ro = ${settings.reject_button_text_ro},
          learn_more_text_en = ${settings.learn_more_text_en},
          learn_more_text_ro = ${settings.learn_more_text_ro},
          background_color = ${settings.background_color},
          text_color = ${settings.text_color},
          accept_button_color = ${settings.accept_button_color},
          reject_button_color = ${settings.reject_button_color},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${settings.id}
      `;

      setMessage({
        type: 'success',
        text: 'Cookie banner settings saved successfully!'
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save cookie banner settings'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading cookie banner settings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">Cookie Banner Settings</h2>

        {message && (
          <div className={`mb-5 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Enable/Disable */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Cookie Banner
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => setSettings(prev => prev ? { ...prev, enabled: e.target.checked } : null)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Position */}
          <div className="grid grid-cols-4 gap-4 items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Position
            </label>
            <select
              value={settings.position}
              onChange={(e) => setSettings(prev => prev ? { ...prev, position: e.target.value as 'bottom' | 'top' } : null)}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="bottom">Bottom</option>
              <option value="top">Top</option>
            </select>
          </div>

          {/* Messages */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Messages</h3>
            
            {/* English */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message (English)
                </label>
                <textarea
                  value={settings.custom_message_en || defaultMessages.en.message}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, custom_message_en: e.target.value } : null)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Accept Button (EN)
                  </label>
                  <input
                    type="text"
                    value={settings.accept_button_text_en || defaultMessages.en.accept}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, accept_button_text_en: e.target.value } : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reject Button (EN)
                  </label>
                  <input
                    type="text"
                    value={settings.reject_button_text_en || defaultMessages.en.reject}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, reject_button_text_en: e.target.value } : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Learn More (EN)
                  </label>
                  <input
                    type="text"
                    value={settings.learn_more_text_en || defaultMessages.en.learnMore}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, learn_more_text_en: e.target.value } : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Romanian */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message (Romanian)
                </label>
                <textarea
                  value={settings.custom_message_ro || defaultMessages.ro.message}
                  onChange={(e) => setSettings(prev => prev ? { ...prev, custom_message_ro: e.target.value } : null)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Accept Button (RO)
                  </label>
                  <input
                    type="text"
                    value={settings.accept_button_text_ro || defaultMessages.ro.accept}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, accept_button_text_ro: e.target.value } : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reject Button (RO)
                  </label>
                  <input
                    type="text"
                    value={settings.reject_button_text_ro || defaultMessages.ro.reject}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, reject_button_text_ro: e.target.value } : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Learn More (RO)
                  </label>
                  <input
                    type="text"
                    value={settings.learn_more_text_ro || defaultMessages.ro.learnMore}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, learn_more_text_ro: e.target.value } : null)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Colors</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Background Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.background_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, background_color: e.target.value } : null)}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={settings.background_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, background_color: e.target.value } : null)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Text Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.text_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, text_color: e.target.value } : null)}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={settings.text_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, text_color: e.target.value } : null)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accept Button Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.accept_button_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, accept_button_color: e.target.value } : null)}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={settings.accept_button_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, accept_button_color: e.target.value } : null)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reject Button Color
                </label>
                <div className="flex space-x-2">
                  <input
                    type="color"
                    value={settings.reject_button_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, reject_button_color: e.target.value } : null)}
                    className="h-10 w-10 rounded border border-gray-300 dark:border-gray-600"
                  />
                  <input
                    type="text"
                    value={settings.reject_button_color}
                    onChange={(e) => setSettings(prev => prev ? { ...prev, reject_button_color: e.target.value } : null)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CookieSettings;