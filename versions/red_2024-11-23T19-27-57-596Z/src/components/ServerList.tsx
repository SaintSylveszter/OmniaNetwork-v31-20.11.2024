import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import ServerModal from './modals/ServerModal';
import { getServers, createServer, updateServer, deleteServer } from '../lib/api/servers';
import type { Server } from '../types/database';
import { useAuth } from '../contexts/AuthContext';

const ServerList: React.FC = () => {
  const { user } = useAuth();
  const [servers, setServers] = useState<Server[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServers();
  }, []);

  const loadServers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getServers();
      setServers(data);
    } catch (err) {
      setError('Failed to load servers');
      console.error('Error loading servers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = () => {
    const sortedServers = [...servers].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    setServers(sortedServers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleAdd = async (serverData: { name: string; ip: string }) => {
    if (!user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      setError(null);
      const newServer = await createServer(serverData);
      setServers(prev => [...prev, newServer]);
      setIsAddModalOpen(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add server';
      setError(errorMessage);
      console.error('Error adding server:', err);
    }
  };

  const handleEdit = async (serverData: { name: string; ip: string }) => {
    if (!selectedServer || !user?.id) return;
    
    try {
      setError(null);
      const updatedServer = await updateServer(selectedServer.id, serverData);
      setServers(servers.map(server => 
        server.id === updatedServer.id ? updatedServer : server
      ));
      setIsEditModalOpen(false);
      setSelectedServer(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update server';
      setError(errorMessage);
      console.error('Error updating server:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedServer || !user?.id) return;
    
    try {
      setError(null);
      await deleteServer(selectedServer.id);
      setServers(servers.filter(server => server.id !== selectedServer.id));
      setIsDeleteModalOpen(false);
      setSelectedServer(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete server';
      setError(errorMessage);
      console.error('Error deleting server:', err);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading servers...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Servers</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <Plus className="mr-2" size={20} />
          Add Server
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
                  Server
                  {sortOrder === 'asc' ? 
                    <ChevronUp className="inline-block ml-1 h-5 w-5" /> : 
                    <ChevronDown className="inline-block ml-1 h-5 w-5" />
                  }
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                IP
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {servers.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No servers found. Add your first server using the button above.
                </td>
              </tr>
            ) : (
              servers.map((server) => (
                <tr key={server.id} className="dark:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">{server.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{server.ip_address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => {
                        setSelectedServer(server);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-4"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedServer(server);
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

      <ServerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
        mode="add"
      />

      {selectedServer && (
        <>
          <ServerModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedServer(null);
            }}
            onSubmit={handleEdit}
            mode="edit"
            initialData={{
              name: selectedServer.name,
              ip: selectedServer.ip_address
            }}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedServer(null);
            }}
            onConfirm={handleDelete}
            siteName={selectedServer.name}
            type="server"
          />
        </>
      )}
    </div>
  );
};

export default ServerList;