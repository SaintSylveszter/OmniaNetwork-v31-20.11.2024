import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SiteTypeModal from './modals/SiteTypeModal';
import { getSiteTypes, createSiteType, updateSiteType, deleteSiteType } from '../lib/api/siteTypes';
import type { SiteType } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

const SiteTypeList: React.FC = () => {
  const { user } = useAuth();
  const [types, setTypes] = useState<SiteType[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<SiteType | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSiteTypes();
  }, []);

  const loadSiteTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSiteTypes();
      setTypes(data);
    } catch (err) {
      setError('Failed to load content types');
      console.error('Error loading content types:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    
    const sortedTypes = [...types].sort((a, b) => {
      return newDirection === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    });
    
    setTypes(sortedTypes);
  };

  const handleAdd = async (data: { name: string; description?: string }) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const newType = await createSiteType(data);
      setTypes([...types, newType]);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error('Error adding content type:', err);
      setError('Failed to add content type');
    }
  };

  const handleEdit = async (data: { id?: string; name: string; description?: string }) => {
    if (!data.id || !selectedType || !user?.id) return;
    
    try {
      setError(null);
      const updatedType = await updateSiteType(data.id, { 
        name: data.name,
        description: data.description 
      });
      setTypes(types.map(type => 
        type.id === updatedType.id ? updatedType : type
      ));
      setIsEditModalOpen(false);
      setSelectedType(null);
    } catch (err) {
      console.error('Error updating content type:', err);
      setError('Failed to update content type');
    }
  };

  const handleDelete = async () => {
    if (!selectedType || !user?.id) return;
    
    try {
      setError(null);
      await deleteSiteType(selectedType.id);
      setTypes(types.filter(type => type.id !== selectedType.id));
      setIsDeleteModalOpen(false);
      setSelectedType(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete content type';
      setError(errorMessage);
      console.error('Error deleting content type:', err);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading content types...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Types</h2>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Content Type</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider cursor-pointer"
                onClick={handleSort}
              >
                <div className="flex items-center">
                  Type
                  {sortDirection === 'asc' ? 
                    <ChevronUp className="inline-block ml-1 h-5 w-5" /> : 
                    <ChevronDown className="inline-block ml-1 h-5 w-5" />
                  }
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {types.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No content types found. Add your first type using the button above.
                </td>
              </tr>
            ) : (
              types.map((type) => (
                <tr key={type.id} className="text-gray-900 dark:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                  <td className="px-6 py-4">{type.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedType(type);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedType(type);
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

      <SiteTypeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
        title="Add New Content Type"
      />

      {selectedType && (
        <>
          <SiteTypeModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedType(null);
            }}
            onSubmit={handleEdit}
            title="Edit Content Type"
            siteType={selectedType}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedType(null);
            }}
            onConfirm={handleDelete}
            siteName={selectedType.name}
            type="contentType"
          />
        </>
      )}
    </div>
  );
};

export default SiteTypeList;