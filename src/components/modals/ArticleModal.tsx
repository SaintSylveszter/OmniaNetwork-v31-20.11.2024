import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import MP_T10 from '../articles/MP_T10';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  title: string;
  article?: any;
  selectedType?: string;
}

const ARTICLE_TYPES = [
  { id: 'MP_T10', name: 'Products Top 10', description: 'Create a top 10 product comparison article' },
  { id: 'MP_T3', name: 'Products Top 3', description: 'Create a focused top 3 product comparison' },
  { id: 'MP_C', name: 'Products Comparison', description: 'Compare specific products in detail' },
  { id: 'MP_R', name: 'Product Review', description: 'In-depth single product review' },
  { id: 'SP_A', name: 'Support Article', description: 'General informational article' }
];

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  article,
  selectedType: initialType
}) => {
  const [selectedType, setSelectedType] = useState(initialType || '');

  useEffect(() => {
    if (article) {
      // If editing an existing article, set the type from the article data
      setSelectedType(article.type_code || 'MP_T10');
    } else if (initialType) {
      setSelectedType(initialType);
    }
  }, [article, initialType, isOpen]);

  if (!isOpen) return null;

  const renderContent = () => {
    // If we're editing an article or a type is selected, show the form
    if (article || selectedType) {
      switch (selectedType) {
        case 'MP_T10':
          return (
            <div className="px-8">
              <MP_T10 onSubmit={onSubmit} onClose={onClose} initialData={article} />
            </div>
          );
        case 'MP_T3':
          return (
            <div className="px-8 py-6 text-center text-gray-400">
              Products Top 3 form coming soon...
            </div>
          );
        case 'MP_C':
          return (
            <div className="px-8 py-6 text-center text-gray-400">
              Products Comparison form coming soon...
            </div>
          );
        case 'MP_R':
          return (
            <div className="px-8 py-6 text-center text-gray-400">
              Product Review form coming soon...
            </div>
          );
        case 'SP_A':
          return (
            <div className="px-8 py-6 text-center text-gray-400">
              Support Article form coming soon...
            </div>
          );
        default:
          return (
            <div className="px-8 py-6 text-center text-gray-400">
              Please select an article type
            </div>
          );
      }
    }

    // If creating a new article and no type selected, show type selector
    return (
      <div className="px-8 py-6">
        <h3 className="text-lg font-medium text-gray-300 mb-6">Select Article Type</h3>
        <div className="grid gap-4">
          {ARTICLE_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className="flex flex-col p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
            >
              <span className="text-lg font-medium text-white mb-1">{type.name}</span>
              <span className="text-sm text-gray-400">{type.description}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl h-[90vh] flex flex-col relative">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">
            {article ? 'Edit Article' : 'New Article'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;