import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp, Globe, MapPin, Languages, Server, Network, Activity } from 'lucide-react';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import SiteModal from './modals/SiteModal';
import { getSites, createSite, updateSite, deleteSite } from '../lib/api/sites';
import type { Site } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

interface CreateSiteData {
  url: string;
  site_type_id: string;
  server_id: string;
  year?: number;
  location?: string;
  language?: string;
  condition?: string;
  affiliate?: string;
}

const SiteList: React.FC = () => {
  const { user } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSites();
      setSites(data);
    } catch (err) {
      setError('Failed to load sites');
      console.error('Error loading sites:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedSites = [...sites].sort((a, b) => {
      let aValue: any = a[key as keyof Site];
      let bValue: any = b[key as keyof Site];

      if (typeof aValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number') {
        return direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    setSites(sortedSites);
  };

  const getSortIcon = (key: string) => {
    if (sortConfig?.key === key) {
      return sortConfig.direction === 'asc' ? 
        <ChevronUp className="inline-block ml-1 h-4 w-4" /> : 
        <ChevronDown className="inline-block ml-1 h-4 w-4" />;
    }
    return <ChevronDown className="inline-block ml-1 h-4 w-4 text-gray-400" />;
  };

  const tooltipClasses = "absolute hidden group-hover:block bg-gray-900 text-white text-xs font-light rounded py-1 px-2 -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap border border-gray-700";

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sites.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sites.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAdd = async (data: CreateSiteData) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const newSite = await createSite(data);
      setSites(prev => [...prev, newSite]);
      setIsAddModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add site';
      setError(errorMessage);
      console.error('Error adding site:', err);
    }
  };

  const handleEdit = async (data: CreateSiteData) => {
    if (!selectedSite || !user?.id) return;
    
    try {
      setError(null);
      const updatedSite = await updateSite(selectedSite.id, data);
      setSites(prevSites => 
        prevSites.map(site => site.id === updatedSite.id ? updatedSite : site)
      );
      setIsEditModalOpen(false);
      setSelectedSite(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update site';
      setError(message);
      console.error('Error updating site:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedSite || !user?.id) return;
    
    try {
      setError(null);
      await deleteSite(selectedSite.id);
      setSites(sites.filter(site => site.id !== selectedSite.id));
      setIsDeleteModalOpen(false);
      setSelectedSite(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete site';
      setError(message);
      console.error('Error deleting site:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading sites...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Sites</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add New Site</span>
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
              <th className="group relative px-6 py-3 text-left">
                <div className="flex items-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('url')}>
                  DOMAIN {getSortIcon('url')}
                </div>
                <div className={tooltipClasses}>Website Domain</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('site_type_name')}>
                  CONTENT {getSortIcon('site_type_name')}
                </div>
                <div className={tooltipClasses}>Content Type</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('affiliate')}>
                  <Globe size={18} className="text-white" />
                  {getSortIcon('affiliate')}
                </div>
                <div className={tooltipClasses}>Affiliate Program</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('year')}>
                  YEAR {getSortIcon('year')}
                </div>
                <div className={tooltipClasses}>Site Creation Year</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('location')}>
                  <MapPin size={18} className="text-white" />
                  {getSortIcon('location')}
                </div>
                <div className={tooltipClasses}>Site Location</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('language')}>
                  <Languages size={18} className="text-white" />
                  {getSortIcon('language')}
                </div>
                <div className={tooltipClasses}>Site Language</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('server_name')}>
                  <Server size={18} className="text-white" />
                  {getSortIcon('server_name')}
                </div>
                <div className={tooltipClasses}>Server Location</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('ip_address')}>
                  <Network size={18} className="text-white" />
                  {getSortIcon('ip_address')}
                </div>
                <div className={tooltipClasses}>IP Address</div>
              </th>
              <th className="group relative px-6 py-3 text-center">
                <div className="flex items-center justify-center text-xs font-medium text-white uppercase tracking-wider cursor-pointer" onClick={() => handleSort('condition')}>
                  <Activity size={18} className="text-white" />
                  {getSortIcon('condition')}
                </div>
                <div className={tooltipClasses}>Site Status</div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                ACTIONS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((site) => (
              <tr key={site.id} className="text-sm text-gray-900 dark:text-white">
                <td className="px-6 py-4">
                  <a 
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                  >
                    {site.url.replace(/^https?:\/\/(www\.)?/i, '')}
                  </a>
                </td>
                <td className="px-6 py-4 text-center">{site.site_type_name}</td>
                <td className="px-6 py-4 text-center">{site.affiliate || '-'}</td>
                <td className="px-6 py-4 text-center">{site.year || '-'}</td>
                <td className="px-6 py-4 text-center">{site.location || '-'}</td>
                <td className="px-6 py-4 text-center">{site.language || '-'}</td>
                <td className="px-6 py-4 text-center">{site.server_name}</td>
                <td className="px-6 py-4 text-center">{site.ip_address}</td>
                <td className="px-6 py-4 text-center">{site.condition || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedSite(site);
                      setIsEditModalOpen(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedSite(site);
                      setIsDeleteModalOpen(true);
                    }}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-700">
          <div className="flex justify-center space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <SiteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
        title="Add New Site"
      />

      {selectedSite && (
        <>
          <SiteModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSite(null);
            }}
            onSubmit={handleEdit}
            title="Edit Site"
            initialData={selectedSite}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedSite(null);
            }}
            onConfirm={handleDelete}
            siteName={selectedSite.url}
            type="site"
          />
        </>
      )}
    </div>
  );
};

export default SiteList;