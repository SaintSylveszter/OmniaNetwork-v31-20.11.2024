import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getArticleTypes } from '@/lib/api/articleTypes';

interface ArticleType {
  id: number;
  name: string;
  description: string;
}

interface ArticleTypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (typeId: number) => void;
  connectionString: string;
}

const ArticleTypeSelectorModal: React.FC<ArticleTypeSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  connectionString
}) => {
  const [articleTypes, setArticleTypes] = useState<ArticleType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticleTypes = async () => {
      try {
        const types = await getArticleTypes(connectionString);
        // Convertim explicit ID-urile la numere
        const processedTypes = types.map(type => ({
          ...type,
          id: Number(type.id)
        }));
        setArticleTypes(processedTypes);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load article types');
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchArticleTypes();
    }
  }, [isOpen, connectionString]);

  const handleSelect = (typeId: number) => {
    // Verificăm și ne asigurăm că avem un număr valid
    if (!isNaN(typeId) && typeId > 0) {
      console.log('Selecting type ID:', typeId, typeof typeId);
      onSelect(typeId);
      onClose();
    } else {
      console.error('Invalid type ID:', typeId);
      setError('Invalid article type selected');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Select Article Type</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading article types...</div>
          ) : error ? (
            <div className="text-center text-red-400">{error}</div>
          ) : (
            articleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleSelect(type.id)}
                className="w-full p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left group"
              >
                <h3 className="text-lg font-medium text-white group-hover:text-white/90">
                  {type.name}
                </h3>
                <p className="mt-1 text-sm text-gray-400 group-hover:text-gray-300">
                  {type.description}
                </p>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleTypeSelectorModal;