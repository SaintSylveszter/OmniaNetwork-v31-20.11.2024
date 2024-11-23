import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Site {
  id: string;
  name: string;
  url: string;
  server: string;
  ip: string;
  type: string;
}

const AddSite: React.FC = () => {
  const [siteName, setSiteName] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [server, setServer] = useState('');
  const [ip, setIp] = useState('');
  const [siteType, setSiteType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newSite: Site = {
      id: Date.now().toString(),
      name: siteName,
      url: `https://www.${siteUrl}`,
      server,
      ip,
      type: siteType,
    };

    const existingSites = JSON.parse(localStorage.getItem('sites') || '[]');
    const updatedSites = [...existingSites, newSite];
    localStorage.setItem('sites', JSON.stringify(updatedSites));

    navigate('/master-admin/sites');
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Remove common prefixes if user pastes them
    value = value.replace(/^https?:\/\/(www\.)?/i, '');
    setSiteUrl(value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Add New OmniaKid Site</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
            Site Name
          </label>
          <input
            type="text"
            id="siteName"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
            Site URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              https://www.
            </span>
            <input
              type="text"
              id="siteUrl"
              value={siteUrl}
              onChange={handleUrlChange}
              placeholder="omniux.ro"
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="server" className="block text-sm font-medium text-gray-700">
            Server
          </label>
          <input
            type="text"
            id="server"
            value={server}
            onChange={(e) => setServer(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="ip" className="block text-sm font-medium text-gray-700">
            IP Address
          </label>
          <input
            type="text"
            id="ip"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="siteType" className="block text-sm font-medium text-gray-700">
            Site Type
          </label>
          <select
            id="siteType"
            value={siteType}
            onChange={(e) => setSiteType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          >
            <option value="">Select a type</option>
            <option value="blog">Blog</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="portfolio">Portfolio</option>
            <option value="corporate">Corporate</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add Site
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSite;