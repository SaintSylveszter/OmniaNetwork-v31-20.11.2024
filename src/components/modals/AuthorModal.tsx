import React, { useState, useEffect } from 'react';
import { X, Upload, Wand } from 'lucide-react';
import { availableModels, generateAuthorContent, type AIModel } from '../../lib/ai/openrouter';

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
  siteLanguage?: 'EN' | 'RO';
}

const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  author,
  siteLanguage = 'EN'
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AIModel>(availableModels[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

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
    
    // Set the default prompt based on site language
    const defaultPrompt = siteLanguage === 'RO'
      ? 'Vreau să generezi un nume de autor și o descriere (maxim 220 caractere). Autorul este bărbat și scrie recenzii din categoria '
      : 'I want you to generate an author name and a description (maximum 220 characters). The author is male, and writes reviews from the category ';
    setAiPrompt(defaultPrompt);
    
    setError(null);
  }, [author, isOpen, siteLanguage]);

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

  const parseGeneratedContent = (content: string) => {
    // Extract name and description based on the language
    if (siteLanguage === 'RO') {
      // For Romanian content
      const nameMatch = content.match(/(?:Nume autor:|Nume:)\s*([^\n]+)/i);
      const descMatch = content.match(/(?:Descriere:|Despre:)\s*([^\n]+)/i);

      return {
        name: nameMatch?.[1]?.trim() || '',
        description: descMatch?.[1]?.trim() || ''
      };
    } else {
      // For English content
      const nameMatch = content.match(/(?:Author name:|Name:)\s*([^\n]+)/i);
      const descMatch = content.match(/(?:Description:|About:)\s*([^\n]+)/i);

      return {
        name: nameMatch?.[1]?.trim() || '',
        description: descMatch?.[1]?.trim() || ''
      };
    }
  };

  const generateContent = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a prompt for the AI');
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);

      // Generate content
      const result = await generateAuthorContent(aiPrompt, selectedModel);
      
      // Parse the generated content
      const { name: generatedName, description: generatedDesc } = parseGeneratedContent(result.description);
      
      if (!generatedName || !generatedDesc) {
        throw new Error('Failed to parse AI response. Please try again.');
      }

      setName(generatedName);
      setDescription(generatedDesc);
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
            {/* AI Generation Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Generate with AI
              </label>
              <div className="flex space-x-2">
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as AIModel)}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {availableModels.map(model => (
                    <option key={model.id} value={model.id}>{model.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={generateContent}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <Wand className="w-5 h-5 mr-2" />
                  {isGenerating ? 'Generating...' : 'Generate'}
                </button>
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                rows={3}
              />
            </div>

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

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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