import React, { useState, useEffect } from 'react';
import { X, Upload, Wand } from 'lucide-react';
import { availableModels, generateAuthorContent, type AIModel } from '../lib/ai/openrouter';

interface Author {
  id: string;
  name: string;
  image: string | null;
  description: string | null;
}

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; image: File | null; description: string }) => Promise<void>;
  title: string;
  author?: Author;
}

const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  author
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0].id);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (author) {
      setName(author.name);
      setDescription(author.description || '');
      setPreviewUrl(author.image);
    } else {
      setName('');
      setDescription('');
      setImage(null);
      setPreviewUrl(null);
    }
    setError(null);
  }, [author, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('Image size should be less than 2MB');
        return;
      }

      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const generateContent = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Generate author name - strict prompt for just a name
      const namePrompt = `Generate only a full name (first and last) for a product review author. No titles, no explanation, just the name.`;
      const nameResponse = await generateAuthorContent(namePrompt, selectedModel);
      setName(nameResponse.name.replace(/^(dr\.|mr\.|ms\.|mrs\.|prof\.)\s+/i, '').trim());

      // Generate author description - strict prompt for a single sentence bio
      const descPrompt = `Write a single sentence professional bio for a product review author. No formatting, no headers, just one clear sentence about their expertise.`;
      const descResponse = await generateAuthorContent(descPrompt, selectedModel);
      setDescription(descResponse.description
        .replace(/^[^a-z0-9]*/i, '') // Remove leading special chars
        .replace(/[^.!?]+[.!?].*$/g, '$&') // Keep only first sentence
        .trim()
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError(null);
      setIsSubmitting(true);

      if (!name.trim()) {
        throw new Error('Name is required');
      }

      await onSubmit({
        name: name.trim(),
        image,
        description: description.trim()
      });

      setName('');
      setDescription('');
      setImage(null);
      setPreviewUrl(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save author');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{title}</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Author Image
              </label>
              <div className="flex items-center space-x-4">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="flex-1 px-4 py-2 text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
                  disabled={isSubmitting}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={generateContent}
                  disabled={isGenerating}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <Wand className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (author ? 'Save Changes' : 'Add Author')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthorModal;