import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface SiteTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { id?: string; name: string; description?: string }) => void;
  title: string;
  siteType?: { id: string; name: string; description?: string };
}

const SiteTypeModal: React.FC<SiteTypeModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  siteType
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (siteType) {
      setName(siteType.name);
      setDescription(siteType.description || '');
    } else {
      setName('');
      setDescription('');
    }
  }, [siteType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(siteType && { id: siteType.id }),
      name: name.trim(),
      description: description.trim() || undefined
    });
    setName('');
    setDescription('');
  };

  if (!isOpen) return null;

  const inputClasses = "flex-1 px-4 py-3 rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white text-base";
  const labelClasses = "w-32 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="typeName" className={labelClasses}>Type Name</label>
            <input
              type="text"
              id="typeName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              required
            />
          </div>

          <div className="flex space-x-4">
            <label htmlFor="description" className={`${labelClasses} mt-3`}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClasses} min-h-[100px] resize-y`}
              placeholder="Optional description"
            />
          </div>

          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="w-1/3 px-6 py-3 text-white bg-green-600 hover:bg-green-700 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              {siteType ? 'Save Changes' : 'Add Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SiteTypeModal;