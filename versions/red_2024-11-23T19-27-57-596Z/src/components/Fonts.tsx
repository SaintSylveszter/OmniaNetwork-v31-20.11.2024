import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';
import Modal from './modals/Modal';

interface Font {
  id: string;
  name: string;
  link: string;
}

const Fonts: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [fonts, setFonts] = useState<Font[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFontName, setNewFontName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionString, setConnectionString] = useState<string | null>(null);

  useEffect(() => {
    if (adminName) {
      getConnectionString();
    }
  }, [adminName]);

  useEffect(() => {
    if (connectionString) {
      loadFonts();
    }
  }, [connectionString]);

  const getConnectionString = async () => {
    try {
      console.log('Getting connection string for admin:', adminName);
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

      console.log('Got connection string:', admin.connection_string);
      setConnectionString(admin.connection_string);
    } catch (error) {
      console.error('Error getting connection string:', error);
      setError('Failed to connect to site database');
      setIsLoading(false);
    }
  };

  const loadFonts = async () => {
    if (!connectionString) return;

    try {
      setIsLoading(true);
      console.log('Loading fonts using connection string');
      
      // Create table if it doesn't exist
      const siteDb = getConnection(connectionString);
      await siteDb`
        CREATE TABLE IF NOT EXISTS google_fonts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL UNIQUE,
          link VARCHAR(255) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const fonts = await siteDb<Font[]>`
        SELECT * FROM google_fonts 
        ORDER BY name ASC
      `;

      console.log('Loaded fonts:', fonts);
      setFonts(fonts);
      
      // Load font styles
      fonts.forEach(font => {
        const link = document.createElement('link');
        link.href = `${font.link}&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      });
    } catch (error) {
      console.error('Error loading fonts:', error);
      setError('Failed to load fonts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFont = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionString || !newFontName.trim()) return;

    try {
      const siteDb = getConnection(connectionString);
      const fontName = newFontName.trim();
      const fontLink = `https://fonts.googleapis.com/css?family=${fontName.replace(/\s+/g, '+')}`;

      console.log('Adding new font:', { fontName, fontLink });

      const [newFont] = await siteDb<Font[]>`
        INSERT INTO google_fonts (name, link)
        VALUES (${fontName}, ${fontLink})
        RETURNING *
      `;

      console.log('Added new font:', newFont);

      setFonts(prevFonts => [...prevFonts, newFont]);
      setNewFontName('');
      setIsModalOpen(false);

      // Load the new font
      const link = document.createElement('link');
      link.href = `${fontLink}&display=swap`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    } catch (error) {
      console.error('Error adding font:', error);
      setError('Failed to add font');
    }
  };

  const handleDeleteFont = async (id: string) => {
    if (!connectionString) return;

    try {
      console.log('Deleting font with ID:', id);
      const siteDb = getConnection(connectionString);
      await siteDb`
        DELETE FROM google_fonts 
        WHERE id = ${id}
      `;
      setFonts(prevFonts => prevFonts.filter(font => font.id !== id));
      console.log('Font deleted successfully');
    } catch (error) {
      console.error('Error deleting font:', error);
      setError('Failed to delete font');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600 dark:text-gray-400">Loading fonts...</div>
          </div>
        </div>
      </div>
    );
  }

  const sampleText = "The quick brown fox jumps over the lazy dog";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Google Fonts</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Plus size={20} className="mr-2" />
            Add New Font
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Font Family
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Preview
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {fonts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No fonts added yet. Click the "Add New Font" button to add one.
                  </td>
                </tr>
              ) : (
                fonts.map((font) => (
                  <tr key={font.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {font.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <p style={{ fontFamily: `"${font.name}", sans-serif` }}>{sampleText}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteFont(font.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setNewFontName('');
          }}
          title="Add New Font"
        >
          <form onSubmit={handleAddFont} className="space-y-4">
            <div className="grid grid-cols-4 gap-4 items-center">
              <label htmlFor="fontName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Font Family
              </label>
              <input
                type="text"
                id="fontName"
                value={newFontName}
                onChange={(e) => setNewFontName(e.target.value)}
                className="col-span-3 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Roboto or Open Sans"
                required
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Add Font
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default Fonts;