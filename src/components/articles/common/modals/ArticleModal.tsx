import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import NewBaseArticleForm from '../NewBaseArticleForm';
import { getArticleTypes } from '@/lib/api/articleTypes';

interface ArticleType {
  id: string;
  name: string;
  description: string;
}

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  title: string;
  connectionString: string;
  article?: any;
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  connectionString,
  article
}) => {
  const [selectedType, setSelectedType] = useState<number | null>(null);
  const [articleTypes, setArticleTypes] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticleTypes = async () => {
      try {
        const types = await getArticleTypes(connectionString);
        setArticleTypes(types);
        if (article?.type_code) {
          setSelectedType(article.type_code);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article types');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadArticleTypes();
    }
  }, [isOpen, connectionString, article]);

  const getModalTitle = () => {
    if (!selectedType) return title;
    const articleType = articleTypes.find(type => type.id === selectedType);
    return `${title} (${articleType?.name})`;
  };

  if (!isOpen) return null;

  const renderContent = () => {
    if (!selectedType && !article) {
      console.log('Article types:', articleTypes); // să vedem ce date primim
      return (
        <div className="px-8 py-6">
          <h3 className="text-lg font-medium text-gray-300 mb-6">Select Article Type</h3>
          {isLoading ? (
            <div className="text-center text-gray-400">Loading article types...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            <div className="grid gap-4">
            {articleTypes.map((type) => {
              console.log('Rendering type:', type); // să vedem fiecare tip
              return (
                <button
                  key={type.id}
                  onClick={() => {
                    console.log('Selected type:', type); // să vedem ce se selectează
                    setSelectedType(type.id);
                  }}
                  className="flex flex-col p-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-left"
                >
                  <span className="text-lg font-medium text-white mb-1">{type.name}</span>
                  <span className="text-sm text-gray-400">{type.description}</span>
                </button>
              );
            })}
          </div>
          )}
        </div>
      );
    }

    console.log('Selected type before render:', selectedType, typeof selectedType);
    console.log('Selected type after Number conversion:', Number(selectedType), typeof Number(selectedType));
    
    return (
  <div className="p-6">
    <NewBaseArticleForm
    onSubmit={onSubmit}
    onClose={onClose}
    initialData={{ 
      article_type_id: Number(selectedType) // asigurăm-ne că e număr
    }}
    />
  </div>
);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl bg-gray-800 rounded-lg shadow-xl z-50">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{getModalTitle()}</h2>
          <button
            onClick={() => {
              setSelectedType(null);
              onClose();
            }}
            className="text-gray-400 hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>
        {renderContent()}
      </div>
    </>
  );
};

export default ArticleModal;