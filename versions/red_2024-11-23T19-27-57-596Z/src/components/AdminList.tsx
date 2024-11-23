import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import DeleteConfirmModal from './modals/DeleteConfirmModal';
import AdminModal from './modals/AdminModal';
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../lib/api/admins';
import type { Admin } from '../types/database';

const AdminList: React.FC = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAdmins();
      setAdmins(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load admins';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    setSortDirection(newDirection);
    
    const sortedAdmins = [...admins].sort((a, b) => {
      return newDirection === 'asc' 
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username);
    });
    
    setAdmins(sortedAdmins);
  };

  const handleAdd = async (data: { username: string; connection_string: string }) => {
    try {
      setError(null);
      const newAdmin = await createAdmin(data);
      setAdmins(prev => [...prev, newAdmin]);
      setIsAddModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create admin';
      setError(message);
    }
  };

  const handleEdit = async (data: { username: string; connection_string: string }) => {
    if (!selectedAdmin) return;
    
    try {
      setError(null);
      const updatedAdmin = await updateAdmin(selectedAdmin.id, data);
      setAdmins(admins.map(admin => 
        admin.id === updatedAdmin.id ? updatedAdmin : admin
      ));
      setIsEditModalOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update admin';
      setError(message);
    }
  };

  const handleDelete = async () => {
    if (!selectedAdmin) return;
    
    try {
      setError(null);
      await deleteAdmin(selectedAdmin.id);
      setAdmins(admins.filter(admin => admin.id !== selectedAdmin.id));
      setIsDeleteModalOpen(false);
      setSelectedAdmin(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete admin';
      setError(message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600 dark:text-gray-400">Loading admins...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Admins</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Admin</span>
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
                  Admin
                  {sortDirection === 'asc' ? 
                    <ChevronUp className="inline-block ml-1 h-5 w-5" /> : 
                    <ChevronDown className="inline-block ml-1 h-5 w-5" />
                  }
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-200 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {admins.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                  No admins found. Add your first admin using the button above.
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin.id} className="text-gray-900 dark:text-white">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/${admin.username}`}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {admin.username}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
                        setIsEditModalOpen(true);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAdmin(admin);
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

      <AdminModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAdd}
        title="Add New Admin"
      />

      {selectedAdmin && (
        <>
          <AdminModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAdmin(null);
            }}
            onSubmit={handleEdit}
            title="Edit Admin"
            initialData={{
              username: selectedAdmin.username,
              connection_string: selectedAdmin.connection_string
            }}
          />

          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setSelectedAdmin(null);
            }}
            onConfirm={handleDelete}
            siteName={selectedAdmin.username}
            type="admin"
          />
        </>
      )}
    </div>
  );
};

export default AdminList;