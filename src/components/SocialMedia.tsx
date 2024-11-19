import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Save } from 'lucide-react';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';

interface SocialMediaData {
  twitter: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  linkedin: string;
  pinterest: string;
}

const SocialMedia: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [formData, setFormData] = useState<SocialMediaData>({
    twitter: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    linkedin: '',
    pinterest: ''
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
      loadSocialMedia();
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

  const loadSocialMedia = async () => {
    if (!connectionString) return;

    try {
      setIsLoading(true);
      const siteDb = getConnection(connectionString);
      
      const [data] = await siteDb<SocialMediaData[]>`
        SELECT 
          twitter,
          instagram,
          facebook,
          tiktok,
          youtube,
          linkedin,
          pinterest
        FROM social_media
        LIMIT 1
      `;

      if (data) {
        setFormData(data);
      }
    } catch (error) {
      console.error('Error loading social media:', error);
      setMessage({
        type: 'error',
        text: 'Failed to load social media data. Please try again.'
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
        FROM social_media
      `;

      if (exists.count > 0) {
        // Update existing record
        await siteDb`
          UPDATE social_media 
          SET 
            twitter = ${formData.twitter},
            instagram = ${formData.instagram},
            facebook = ${formData.facebook},
            tiktok = ${formData.tiktok},
            youtube = ${formData.youtube},
            linkedin = ${formData.linkedin},
            pinterest = ${formData.pinterest},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = (SELECT id FROM social_media LIMIT 1)
        `;
      } else {
        // Insert new record
        await siteDb`
          INSERT INTO social_media (
            twitter,
            instagram,
            facebook,
            tiktok,
            youtube,
            linkedin,
            pinterest
          ) VALUES (
            ${formData.twitter},
            ${formData.instagram},
            ${formData.facebook},
            ${formData.tiktok},
            ${formData.youtube},
            ${formData.linkedin},
            ${formData.pinterest}
          )
        `;
      }

      setMessage({
        type: 'success',
        text: 'Social media links updated successfully!'
      });
    } catch (error) {
      console.error('Error saving social media:', error);
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
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading social media data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5">
        <h2 className="text-2xl font-bold mb-5 text-gray-900 dark:text-white">Social Media Links</h2>

        {message && (
          <div className={`mb-5 p-3 rounded-lg ${
            message.type === 'success' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="twitter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              X (Twitter)
            </label>
            <input
              type="text"
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="instagram" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Instagram
            </label>
            <input
              type="text"
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="facebook" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Facebook
            </label>
            <input
              type="text"
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="tiktok" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              TikTok
            </label>
            <input
              type="text"
              id="tiktok"
              name="tiktok"
              value={formData.tiktok}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="youtube" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              YouTube
            </label>
            <input
              type="text"
              id="youtube"
              name="youtube"
              value={formData.youtube}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="linkedin" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              LinkedIn
            </label>
            <input
              type="text"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-4 gap-4 items-center">
            <label htmlFor="pinterest" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Pinterest
            </label>
            <input
              type="text"
              id="pinterest"
              name="pinterest"
              value={formData.pinterest}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
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

export default SocialMedia;