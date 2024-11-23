import React from 'react';
import { X } from 'lucide-react';

interface BasicPage {
  id: string;
  title: string;
  content: string;
  language: string;
  visible: boolean;
  display_order: number;
  page_type: string;
  created_at: string;
  updated_at: string;
}

interface BasicPagePreviewProps {
  isOpen: boolean;
  onClose: () => void;
  page: BasicPage;
}

const BasicPagePreview: React.FC<BasicPagePreviewProps> = ({
  isOpen,
  onClose,
  page
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-4xl h-[80vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        <div className="p-6 flex-1 overflow-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {page.title}
          </h2>

          <div 
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default BasicPagePreview;