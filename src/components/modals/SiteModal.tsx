import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getSiteTypes } from '../../lib/api/siteTypes';
import { getServers } from '../../lib/api/servers';
import type { SiteType, Server } from '../../types/database';

interface SiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (siteData: any) => Promise<void>;
  title: string;
  initialData?: any;
}

const SiteModal: React.FC<SiteModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  initialData
}) => {
  const [formData, setFormData] = useState({
    url: '',
    server_id: '',
    site_type_id: '',
    year: new Date().getFullYear(),
    location: '',
    language: '',
    condition: '',
    affiliate: ''
  });
  const [servers, setServers] = useState<Server[]>([]);
  const [siteTypes, setSiteTypes] = useState<SiteType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const years = Array.from({ length: new Date().getFullYear() - 1995 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      setFormData({
        url: initialData.url.replace(/^https?:\/\/(www\.)?/i, ''),
        server_id: initialData.server_id || '',
        site_type_id: initialData.site_type_id || '',
        year: initialData.year || new Date().getFullYear(),
        location: initialData.location || '',
        language: initialData.language || '',
        condition: initialData.condition || '',
        affiliate: initialData.affiliate || ''
      });
    } else {
      setFormData({
        url: '',
        server_id: '',
        site_type_id: '',
        year: new Date().getFullYear(),
        location: '',
        language: '',
        condition: '',
        affiliate: ''
      });
    }
  }, [initialData, isOpen]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [serversData, typesData] = await Promise.all([
        getServers(),
        getSiteTypes()
      ]);
      setServers(serversData);
      setSiteTypes(typesData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load servers and site types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({
        ...formData,
        url: formData.url.startsWith('http') ? formData.url : `https://www.${formData.url}`
      });
      onClose();
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const inputClasses = "flex-1 px-4 py-3 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm";
  const labelClasses = "w-32 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">{title}</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="url" className={labelClasses}>Site URL</label>
              <div className="flex-1 flex rounded-md">
                <div className="inline-flex items-center px-4 py-3 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm rounded-l-md">
                  https://www.
                </div>
                <input
                  type="text"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-none rounded-r-md border-gray-300 dark:border-gray-600 focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-sm"
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="site_type_id" className={labelClasses}>Content Type</label>
              <select
                id="site_type_id"
                name="site_type_id"
                value={formData.site_type_id}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select a type</option>
                {siteTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="server_id" className={labelClasses}>Server</label>
              <select
                id="server_id"
                name="server_id"
                value={formData.server_id}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select a server</option>
                {servers.map((server) => (
                  <option key={server.id} value={server.id}>
                    {server.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="year" className={labelClasses}>Year</label>
              <select
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="location" className={labelClasses}>Location</label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select location</option>
                <option value="RO">RO</option>
                <option value="US">US</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="language" className={labelClasses}>Language</label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select language</option>
                <option value="RO">RO</option>
                <option value="EN">EN</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="condition" className={labelClasses}>Condition</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select condition</option>
                <option value="new">new</option>
                <option value="expired">expired</option>
                <option value="new (+)">new (+)</option>
              </select>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="affiliate" className={labelClasses}>Affiliate Program</label>
              <select
                id="affiliate"
                name="affiliate"
                value={formData.affiliate}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select affiliate</option>
                <option value="eMag">eMag</option>
                <option value="Amazon">Amazon</option>
                <option value="ClickBank">ClickBank</option>
              </select>
            </div>

            <div className="flex justify-center pt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/3 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : (initialData ? 'Save Changes' : 'Add Site')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SiteModal;