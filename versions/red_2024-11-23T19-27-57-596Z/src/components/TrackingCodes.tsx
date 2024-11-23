import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';
import type { TrackingData } from '../types/database';

const TrackingCodes: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [formData, setFormData] = useState<TrackingData>({
    google_search_console: '',
    google_analytics: '',
    google_adsense: '',
    google_ads: '',
    recaptcha_public: '',
    recaptcha_secret: ''
  });
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
      loadTrackingCodes();
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

  const loadTrackingCodes = async () => {
    if (!connectionString) return;

    try {
      setIsLoading(true);
      const siteDb = getConnection(connectionString);
      
      // Query the tracking_codes table from omniux_db
      const [data] = await siteDb<TrackingData[]>`
        SELECT 
          google_search_console,
          google_analytics,
          google_adsense,
          google_ads,
          recaptcha_public,
          recaptcha_secret
        FROM tracking_codes
        LIMIT 1
      `;

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error loading tracking codes:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load tracking codes. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionString) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const siteDb = getConnection(connectionString);

      // Check if a record exists
      const [exists] = await siteDb<[{ count: number }]>`
        SELECT COUNT(*) as count 
        FROM tracking_codes
      `;

      if (exists.count > 0) {
        // Update existing record
        await siteDb`
          UPDATE tracking_codes 
          SET 
            google_search_console = ${formData.google_search_console},
            google_analytics = ${formData.google_analytics},
            google_adsense = ${formData.google_adsense},
            google_ads = ${formData.google_ads},
            recaptcha_public = ${formData.recaptcha_public},
            recaptcha_secret = ${formData.recaptcha_secret},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM tracking_codes LIMIT 1)
        `;
      } else {
        // Insert new record
        await siteDb`
          INSERT INTO tracking_codes (
            google_search_console,
            google_analytics,
            google_adsense,
            google_ads,
            recaptcha_public,
            recaptcha_secret
          ) VALUES (
            ${formData.google_search_console},
            ${formData.google_analytics},
            ${formData.google_adsense},
            ${formData.google_ads},
            ${formData.recaptcha_public},
            ${formData.recaptcha_secret}
          )
        `;
      }

      setMessage({
        type: 'success',
        text: 'Tracking codes updated successfully!'
      });
    } catch (error) {
      console.error('Error saving tracking codes:', error);
      setMessage({
        type: 'error',
        text: 'Failed to save changes. Please try again.'
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
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading tracking codes...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">Tracking Codes</h2>

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
          {/* Google Search & Analytics */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="google_search_console" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Google Search Console
              </label>
              <input
                type="text"
                id="google_search_console"
                name="google_search_console"
                value={formData.google_search_console}
                onChange={handleChange}
                className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="google_analytics" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Google Analytics
              </label>
              <input
                type="text"
                id="google_analytics"
                name="google_analytics"
                value={formData.google_analytics}
                onChange={handleChange}
                className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* Google Ads */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="google_adsense" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Google AdSense
              </label>
              <input
                type="text"
                id="google_adsense"
                name="google_adsense"
                value={formData.google_adsense}
                onChange={handleChange}
                className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="google_ads" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Google Ads
              </label>
              <input
                type="text"
                id="google_ads"
                name="google_ads"
                value={formData.google_ads}
                onChange={handleChange}
                className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          {/* reCAPTCHA */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="recaptcha_public" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                reCAPTCHA Public Key
              </label>
              <input
                type="text"
                id="recaptcha_public"
                name="recaptcha_public"
                value={formData.recaptcha_public}
                onChange={handleChange}
                className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="recaptcha_secret" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                reCAPTCHA Secret Key
              </label>
              <input
                type="text"
                id="recaptcha_secret"
                name="recaptcha_secret"
                value={formData.recaptcha_secret}
                onChange={handleChange}
                className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSaving || !connectionString}
              className="flex items-center px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackingCodes;