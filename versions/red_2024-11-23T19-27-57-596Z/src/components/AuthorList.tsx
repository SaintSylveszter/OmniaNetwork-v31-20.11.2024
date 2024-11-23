import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';
import AuthorModal from './modals/AuthorModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import { uploadImage, deleteImage } from '../lib/bunny';

interface Author {
  id: number;
  name: string;
  image: string | null;
  description: string | null;
  article_count: number;
  created_at: string;
  updated_at: string;
}

const AuthorList: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionString, setConnectionString] = useState<string | null>(null);
  const [siteLanguage, setSiteLanguage] = useState<'EN' | 'RO'>('EN');

  useEffect(() => {
    if (adminName) {
      getConnectionString();
    }
  }, [adminName]);

  useEffect(() => {
    if (connectionString) {
      loadAuthors();
      loadSiteLanguage();
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

  const loadSiteLanguage = async () => {
    if (!connectionString) return;

    try {
      const siteDb = getConnection(connectionString);
      const [info] = await siteDb`
        SELECT language FROM basic_info LIMIT 1
      `;
      if (info?.language) {
        setSiteLanguage(info.language as 'EN' | 'RO');
      }
    } catch (error) {
      console.error('Error loading site language:', error);
    }
  };

  const loadAuthors = async () => {
  if (!connectionString) return;

  try {
    setIsLoading(true);
    const siteDb = getConnection(connectionString);
    
    // Query foarte simplificat pentru a izola problema
    const authors = await siteDb<Author[]>`
      SELECT 
        a.id::integer as id,
        a.name,
        a.image,
        a.description,
        a.created_at,
        a.updated_at,
        (
          SELECT COUNT(*)::integer 
          FROM articles 
          WHERE author_id = a.id
        ) as article_count
      FROM authors a
      ORDER BY a.name ASC
    `;

    setAuthors(authors.map(author => ({
      ...author,
      id: Number(author.id),
      article_count: Number(author.article_count)
    })));
    setError(null);
  } catch (err) {
    console.error('Error loading authors:', err);
    setError('Failed to load authors');
  } finally {
    setIsLoading(false);
  }
};

  const handleAdd = async (data: { name: string; image: File | null; description: string }) => {
    if (!connectionString) return;

    try {
      setError(null);
      const siteDb = getConnection(connectionString);

      let imageUrl = null;
      if (data.image) {
        imageUrl = await uploadImage(data.image, data.name);
      }

      const [newAuthor] = await siteDb<Author[]>`
        INSERT INTO authors (name, image, description)
        VALUES (${data.name}, ${imageUrl}, ${data.description})
        RETURNING 
          id::integer,
          name,
          image,
          description,
          created_at,
          updated_at
      `;

      const authorWithNumberId = {
        ...newAuthor,
        id: Number(newAuthor.id),
        article_count: 0
      };

      setAuthors(prev => [...prev, authorWithNumberId]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding author:', err);
      throw new Error('Failed to add author');
    }
  };

  const handleEdit = async (data: { name: string; image: File | null; description: string }) => {
    if (!connectionString || !selectedAuthor) return;
    
    try {
      setError(null);
      const siteDb = getConnection(connectionString);

      let imageUrl = selectedAuthor.image;
      if (data.image) {
        if (selectedAuthor.image) {
          await deleteImage(selectedAuthor.image);
        }
        imageUrl = await uploadImage(data.image, data.name);
      }

      const [updatedAuthor] = await siteDb<Author[]>`
        UPDATE authors 
        SET 
          name = ${data.name},
          image = ${imageUrl},
          description = ${data.description},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${selectedAuthor.id}::integer
        RETURNING 
          id::integer,
          name,
          image,
          description,
          created_at,
          updated_at
      `;

      const authorWithNumberId = {
        ...updatedAuthor,
        id: Number(updatedAuthor.id)
      };

      setAuthors(prev => prev.map(author => 
        author.id === authorWithNumberId.id 
          ? { ...authorWithNumberId, article_count: author.article_count }
          : author
      ));
      setIsEditModalOpen(false);
      setSelectedAuthor(null);
    } catch (err) {
      console.error('Error updating author:', err);
      throw new Error('Failed to update author');
    }
  };

  const handleDelete = async () => {
    if (!connectionString || !selectedAuthor) return;
    
    try {
      setError(null);
      const siteDb = getConnection(connectionString);

      if (selectedAuthor.image) {
        await deleteImage(selectedAuthor.image);
      }

      await siteDb`
        DELETE FROM authors 
        WHERE id = ${selectedAuthor.id}::integer
      `;

      setAuthors(authors.filter(author => author.id !== selectedAuthor.id));
      setIsDeleteModalOpen(false);
      setSelectedAuthor(null);
    } catch (err) {
      console.error('Error deleting author:', err);
      throw new Error('Failed to delete author');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading authors...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Authors</h2>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Add Author</span>
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
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Articles
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {authors.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No authors found. Add your first author using the button above.
                  </td>
                </tr>
              ) : (
                authors.map((author) => (
                  <tr key={author.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-start">
                        {author.image ? (
                          <img 
                            src={author.image} 
                            alt={author.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-500 dark:text-gray-400 text-lg">
                              {author.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {author.name}
                          </div>
                          {author.description && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 whitespace-normal break-words max-w-xl">
                              {author.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {author.article_count} articles
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedAuthor(author);
                          setIsEditModalOpen(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAuthor(author);
                          setIsDeleteModalOpen(true);
                        }}
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
      </div>

      <AuthorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
        title="Add New Author"
        siteLanguage={siteLanguage}
      />

      {selectedAuthor && (
        <>
          <AuthorModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAuthor(null);
            }}
            onSubmit={handleEdit}
            title="Edit Author"
            author={selectedAuthor}
            siteLanguage={siteLanguage}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedAuthor(null);
            }}
            onConfirm={handleDelete}
            siteName={selectedAuthor.name}
            type="author"
          />
        </>
      )}
    </div>
  );
};

export default AuthorList;