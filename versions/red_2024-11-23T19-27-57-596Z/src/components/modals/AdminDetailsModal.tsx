import React from 'react';
import { X, User, Mail, Calendar, Clock } from 'lucide-react';

interface AdminDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  admin: string;
}

const AdminDetailsModal: React.FC<AdminDetailsModalProps> = ({
  isOpen,
  onClose,
  admin
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md relative text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-emerald-400">{admin}</h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-300">
              <User size={20} className="text-emerald-400" />
              <span>Administrator</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <Mail size={20} className="text-emerald-400" />
              <span>{`${admin.toLowerCase()}@omnianetwork.com`}</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <Calendar size={20} className="text-emerald-400" />
              <span>Member since Oct 2023</span>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <Clock size={20} className="text-emerald-400" />
              <span>Last active: Today</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-emerald-400">Recent Activity</h3>
            <ul className="space-y-3 text-gray-300">
              <li>• Updated site settings</li>
              <li>• Published new article</li>
              <li>• Modified user permissions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsModal;