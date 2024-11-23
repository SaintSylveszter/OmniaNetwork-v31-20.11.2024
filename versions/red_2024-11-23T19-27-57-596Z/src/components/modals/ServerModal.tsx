import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; ip: string }) => void;
  mode: 'add' | 'edit';
  initialData?: { name: string; ip: string };
}

const ServerModal: React.FC<ServerModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData
}) => {
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name);
      setIp(initialData.ip);
    } else {
      setName('');
      setIp('');
    }
  }, [initialData, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, ip });
    setName('');
    setIp('');
  };

  if (!isOpen) return null;

  const inputClasses = "flex-1 px-4 py-3 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-base";
  const labelClasses = "w-32 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            {mode === 'add' ? 'Add Server' : 'Edit Server'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="name" className={labelClasses}>Server Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="ip" className={labelClasses}>IP Address</label>
              <input
                type="text"
                id="ip"
                value={ip}
                onChange={(e) => setIp(e.target.value)}
                className={inputClasses}
                required
              />
            </div>

            <div className="flex justify-center pt-8">
              <button
                type="submit"
                className="w-1/3 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                {mode === 'add' ? 'Add Server' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServerModal;