import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getConnection } from '../lib/db/connections';
import sql from '../lib/db/neon';
import BasicPageModal from './modals/BasicPageModal';
import DeleteConfirmModal from './modals/DeleteConfirmModal';

interface BasicPage {
  id: string;
  title: string;
  content: string;
  language: string;
  visible: boolean;
  display_order: number;
  page_type: string;
  created_at: string;
  updated_at: string;
}

const PAGE_TYPES = [
  'terms_and_conditions',
  'privacy_policy',
  'cookie_policy',
  'affiliate_disclosure',
  'gdpr_compliance',
  'about_us'
] as const;

const PAGE_TITLES = {
  EN: {
    terms_and_conditions: 'Terms and Conditions',
    privacy_policy: 'Privacy Policy',
    cookie_policy: 'Cookie Policy',
    affiliate_disclosure: 'Affiliate Disclosure',
    gdpr_compliance: 'GDPR Compliance',
    about_us: 'About Us'
  },
  RO: {
    terms_and_conditions: 'Termeni și Condiții',
    privacy_policy: 'Politica de Confidențialitate',
    cookie_policy: 'Politica de Cookie-uri',
    affiliate_disclosure: 'Informare Affiliate',
    gdpr_compliance: 'Conformitate GDPR',
    about_us: 'Despre Noi'
  }
} as const;

const BasicPages: React.FC = () => {
  const { adminName } = useParams<{ adminName: string }>();
  const [pages, setPages] = useState<BasicPage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<BasicPage | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'RO'>('EN');
  const [selectedPageType, setSelectedPageType] = useState<string>('');
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
      loadPages();
    }
  }, [connectionString, selectedLanguage]);

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

  const loadPages = async () => {
    if (!connectionString) return;

    try {
      setIsLoading(true);
      const siteDb = getConnection(connectionString);
      
      // Create table if it doesn't exist
      await siteDb`
        CREATE TABLE IF NOT EXISTS basic_pages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          language VARCHAR(2) NOT NULL,
          visible BOOLEAN DEFAULT true,
          page_type VARCHAR(50) NOT NULL,
          display_order INTEGER DEFAULT 0,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        )
      `;

      const pages = await siteDb<BasicPage[]>`
        SELECT * FROM basic_pages 
        WHERE language = ${selectedLanguage}
        ORDER BY display_order ASC
      `;

      setPages(pages);
      setError(null);
    } catch (err) {
      console.error('Error loading pages:', err);
      setError('Failed to load pages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPage = (pageType: string) => {
    setSelectedPageType(pageType);
    setSelectedPage(null);
    setIsModalOpen(true);
  };

  const handleSavePage = async (data: Omit<BasicPage, 'id' | 'created_at' | 'updated_at' | 'display_order'>) => {
    if (!connectionString) return;

    try {
      const siteDb = getConnection(connectionString);

      // Get the default title for the page type and language
      const defaultTitle = PAGE_TITLES[data.language as keyof typeof PAGE_TITLES][data.page_type as keyof typeof PAGE_TITLES.EN];

      if (selectedPage) {
        // Update existing page
        await siteDb`
          UPDATE basic_pages 
          SET 
            title = ${data.title || defaultTitle},
            content = ${data.content},
            visible = ${data.visible},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${selectedPage.id}
        `;
      } else {
        // Get the next display order value
        const [maxOrder] = await siteDb`
          SELECT COALESCE(MAX(display_order), 0) + 10 as next_order
          FROM basic_pages
          WHERE language = ${data.language}
        `;

        // Create new page
        await siteDb`
          INSERT INTO basic_pages (
            title,
            content,
            language,
            visible,
            page_type,
            display_order
          ) VALUES (
            ${data.title || defaultTitle},
            ${data.content},
            ${data.language},
            ${data.visible},
            ${data.page_type},
            ${maxOrder.next_order}
          )
        `;
      }

      await loadPages();
    } catch (err) {
      console.error('Error saving page:', err);
      throw new Error('Failed to save page');
    }
  };

  const handleDeletePage = async () => {
    if (!connectionString || !selectedPage) return;

    try {
      const siteDb = getConnection(connectionString);
      await siteDb`DELETE FROM basic_pages WHERE id = ${selectedPage.id}`;
      await loadPages();
      setIsDeleteModalOpen(false);
      setSelectedPage(null);
    } catch (err) {
      console.error('Error deleting page:', err);
      setError('Failed to delete page');
    }
  };

  const handleToggleVisibility = async (page: BasicPage) => {
    if (!connectionString) return;

    try {
      const siteDb = getConnection(connectionString);
      await siteDb`
        UPDATE basic_pages 
        SET 
          visible = ${!page.visible},
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ${page.id}
      `;
      await loadPages();
    } catch (err) {
      console.error('Error toggling visibility:', err);
      setError('Failed to update page visibility');
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination || !connectionString) return;

    const { source, destination, draggableId } = result;
    if (source.index === destination.index) return;

    try {
      const siteDb = getConnection(connectionString);
      const movedPage = pages.find(p => p.id === draggableId);
      if (!movedPage) return;

      const reorderedPages = Array.from(pages);
      reorderedPages.splice(source.index, 1);
      reorderedPages.splice(destination.index, 0, movedPage);

      // Update display_order for all affected pages
      for (let i = 0; i < reorderedPages.length; i++) {
        await siteDb`
          UPDATE basic_pages 
          SET 
            display_order = ${i * 10},
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ${reorderedPages[i].id}
        `;
      }

      await loadPages();
    } catch (err) {
      console.error('Error reordering pages:', err);
      setError('Failed to reorder pages');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading pages...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Basic Pages</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedLanguage('EN')}
                className={`px-3 py-1 rounded-lg ${
                  selectedLanguage === 'EN'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setSelectedLanguage('RO')}
                className={`px-3 py-1 rounded-lg ${
                  selectedLanguage === 'RO'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                RO
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="pages">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {PAGE_TYPES.map((pageType, index) => {
                  const page = pages.find(p => p.page_type === pageType);
                  const defaultTitle = PAGE_TITLES[selectedLanguage][pageType as keyof typeof PAGE_TITLES.EN];

                  return (
                    <Draggable
                      key={page?.id || pageType}
                      draggableId={page?.id || pageType}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-4">
                            <span className="text-gray-900 dark:text-white font-medium">
                              {page?.title || defaultTitle}
                            </span>
                            {page ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleToggleVisibility(page)}
                                  className={`p-1 rounded-lg ${
                                    page.visible
                                      ? 'text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300'
                                      : 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
                                  }`}
                                >
                                  {page.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPage(page);
                                    setSelectedPageType(pageType);
                                    setIsModalOpen(true);
                                  }}
                                  className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedPage(page);
                                    setIsDeleteModalOpen(true);
                                  }}
                                  className="p-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddPage(pageType)}
                                className="flex items-center space-x-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                              >
                                <Plus size={18} />
                                <span>Add</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <BasicPageModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedPage(null);
          }}
          onSubmit={handleSavePage}
          page={selectedPage}
          language={selectedLanguage}
          pageType={selectedPageType}
        />

        {selectedPage && (
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedPage(null);
            }}
            onConfirm={handleDeletePage}
            siteName={selectedPage.title}
            type="page"
          />
        )}
      </div>
    </div>
  );
};

export default BasicPages;