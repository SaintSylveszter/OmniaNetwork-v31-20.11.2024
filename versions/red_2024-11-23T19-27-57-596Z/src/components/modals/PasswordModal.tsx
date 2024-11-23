import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  password: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  password
}) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

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
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Site Password</h2>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              readOnly
              className="w-full pr-10 py-2 px-3 border rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;