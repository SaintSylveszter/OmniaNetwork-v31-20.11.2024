import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Editor from '@monaco-editor/react';

interface BasicPage {
  id?: string;
  title: string;
  content: string;
  language: string;
  visible: boolean;
  display_order?: number;
  page_type: string;
  created_at?: string;
  updated_at?: string;
}

interface BasicPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<BasicPage, 'id' | 'created_at' | 'updated_at' | 'display_order'>) => Promise<void>;
  page?: BasicPage | null;
  language: string;
  pageType: string;
}

const BasicPageModal: React.FC<BasicPageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  page,
  language,
  pageType
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visible, setVisible] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
      setContent(page.content);
      setVisible(page.visible);
    } else {
      setTitle('');
      setContent('');
      setVisible(true);
    }
    setError(null);
  }, [page, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      setError(null);
      
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        language,
        visible,
        page_type: pageType
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting page:', error);
      setError(error instanceof Error ? error.message : 'Failed to save page');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="p-6 flex-1 flex flex-col overflow-hidden">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            {page ? 'Edit' : 'Create'} {pageType.replace(/_/g, ' ')}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
              />
            </div>

            <div className="flex-1 overflow-hidden mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content (HTML)
              </label>
              <div className="h-[calc(100%-2rem)] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                <Editor
                  value={content}
                  onChange={(value) => setContent(value || '')}
                  language="html"
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    wordWrap: 'on',
                    wrappingIndent: 'indent',
                    automaticLayout: true
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={visible}
                  onChange={(e) => setVisible(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Show in footer
                </span>
              </label>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Page'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BasicPageModal;