import React from 'react';
import { X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  siteName: string;
  type?: 'site' | 'server' | 'siteType';
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  siteName,
  type = 'site'
}) => {
  if (!isOpen) return null;

  const getTitle = () => {
    switch (type) {
      case 'server':
        return 'Delete Server';
      case 'siteType':
        return 'Delete Site Type';
      default:
        return 'Delete Site';
    }
  };

  const getMessage = () => {
    const name = type === 'site' ? siteName.replace(/^https?:\/\/(www\.)?/i, '') : siteName;
    return `Are you sure you want to delete "${name}"?`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{getTitle()}</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-2">
            {getMessage()}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;