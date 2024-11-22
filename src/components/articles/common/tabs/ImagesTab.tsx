import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { uploadArticleImages, replaceArticleImage } from '../../../../lib/bunnyArticles';

interface ProcessedImages {
  square_url: string;
  rectangle_url: string;
  wide_url: string;
  wide_large_url: string;
  base_name: string;
}

interface ImageDimension {
  type: 'square' | 'rectangle' | 'wide' | 'wide_large';
  label: string;
  ratio: string;
  width: number;
  url: string | null;
}

interface ImagesTabProps {
  articleTitle?: string;
  onImagesProcessed?: (images: ProcessedImages) => void;
}

const ImagesTab: React.FC<ImagesTabProps> = ({ articleTitle, onImagesProcessed }) => {
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);
  const [baseName, setBaseName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [processedImages, setProcessedImages] = useState<ImageDimension[]>([
    { type: 'square', label: 'Square (1:1)', ratio: '1:1', width: 360, url: null },
    { type: 'rectangle', label: 'Rectangle (3:2)', ratio: '3:2', width: 360, url: null },
    { type: 'wide', label: 'Wide (16:9)', ratio: '16:9', width: 600, url: null },
    { type: 'wide_large', label: 'Wide Large (16:9)', ratio: '16:9', width: 1200, url: null }
  ]);

  useEffect(() => {
    if (articleTitle) {
      setAltText(articleTitle);
    }
  }, [articleTitle]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image size should be less than 10MB');
        return;
      }

      setMainImage(file);
      setMainImagePreview(URL.createObjectURL(file));
      setError(null);
      setIsProcessed(false);
    }
  };

  const handleProcessImage = async () => {
    if (!mainImage) {
      setError('Please select an image');
      return;
    }

    try {
      setError(null);
      setIsProcessing(true);
      
      // Use a default title if none is provided
      const title = articleTitle || 'article-image';
      
      const result = await uploadArticleImages(mainImage, title);
      setBaseName(result.base_name);
      
      setProcessedImages(prev => prev.map(img => {
        switch (img.type) {
          case 'square':
            return { ...img, url: result.square_url };
          case 'rectangle':
            return { ...img, url: result.rectangle_url };
          case 'wide':
            return { ...img, url: result.wide_url };
          case 'wide_large':
            return { ...img, url: result.wide_large_url };
          default:
            return img;
        }
      }));
      
      setIsProcessed(true);
      
      if (onImagesProcessed) {
        onImagesProcessed(result);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplaceImage = (type: 'square' | 'rectangle' | 'wide' | 'wide_large') => async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !baseName) return;

    try {
      setError(null);
      const newUrl = await replaceArticleImage(file, baseName, type);
      setProcessedImages(prev => prev.map(img => 
        img.type === type ? { ...img, url: newUrl } : img
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to replace image');
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Alt Text
          </label>
          <input
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter alt text for images"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Caption
          </label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter image caption (optional)"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {!isProcessed ? (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-white">Upload Main Image</h3>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
            {mainImagePreview ? (
              <div className="space-y-4">
                <img
                  src={mainImagePreview}
                  alt="Main image preview"
                  className="max-w-full h-auto rounded-lg"
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleProcessImage}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Process Image'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload size={48} className="text-gray-400 mb-4" />
                <input
                  type="file"
                  onChange={handleMainImageChange}
                  accept="image/*"
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/20 dark:file:text-indigo-400"
                />
                <p className="mt-2 text-sm text-gray-400">
                  Maximum file size: 10MB. Supported formats: JPG, PNG, GIF
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {processedImages.map((image) => (
            <div key={image.type} className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                {image.label} ({image.width}px)
              </h3>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6">
                <div className="relative">
                  <img
                    src={image.url || ''}
                    alt={`${image.ratio} version`}
                    className="max-w-full h-auto rounded-lg"
                  />
                  <div className="absolute top-2 right-2">
                    <input
                      type="file"
                      id={`replace-${image.type}`}
                      onChange={handleReplaceImage(image.type)}
                      accept="image/*"
                      className="hidden"
                    />
                    <label
                      htmlFor={`replace-${image.type}`}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                    >
                      Replace
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImagesTab;