import React, { useState } from 'react';

interface SeoSocialTabProps {
  images?: Array<{id: string, url: string, alt: string}>;
}

const SeoSocialTab: React.FC<SeoSocialTabProps> = ({ images = [] }) => {
  const [seoData, setSeoData] = useState({
    metaTitle: '',
    metaDescription: '',
    focusKeyword: '',
    schemaType: '',
    metaRobots: 'index,follow',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCardType: 'summary_large_image',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  });

  const schemaTypes = ['Article', 'NewsArticle', 'BlogPosting', 'Product', 'Review'];
  const robotsOptions = ['index,follow', 'noindex,follow', 'index,nofollow', 'noindex,nofollow'];
  const twitterCardTypes = ['summary', 'summary_large_image', 'app', 'player'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSeoData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-8 py-4">
      {/* SEO Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">SEO Settings</h3>
        </div>

        {/* Meta Title */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-300">
              Meta Title
            </label>
            <span className={`text-sm ${seoData.metaTitle.length > 60 ? 'text-red-500' : 'text-gray-500'}`}>
              {seoData.metaTitle.length}/60
            </span>
          </div>
          <input
            type="text"
            id="metaTitle"
            name="metaTitle"
            value={seoData.metaTitle}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter meta title"
          />
        </div>

        {/* Meta Description */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-300">
              Meta Description
            </label>
            <span className={`text-sm ${seoData.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-500'}`}>
              {seoData.metaDescription.length}/160
            </span>
          </div>
          <textarea
            id="metaDescription"
            name="metaDescription"
            value={seoData.metaDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter meta description"
          />
        </div>

        {/* Focus Keyword */}
        <div className="space-y-2">
          <label htmlFor="focusKeyword" className="block text-sm font-medium text-gray-300">
            Focus Keyword
          </label>
          <input
            type="text"
            id="focusKeyword"
            name="focusKeyword"
            value={seoData.focusKeyword}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter focus keyword"
          />
        </div>

        {/* Schema Type */}
        <div className="space-y-2">
          <label htmlFor="schemaType" className="block text-sm font-medium text-gray-300">
            Schema Type
          </label>
          <select
            id="schemaType"
            name="schemaType"
            value={seoData.schemaType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select schema type</option>
            {schemaTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Meta Robots */}
        <div className="space-y-2">
          <label htmlFor="metaRobots" className="block text-sm font-medium text-gray-300">
            Meta Robots
          </label>
          <select
            id="metaRobots"
            name="metaRobots"
            value={seoData.metaRobots}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {robotsOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Canonical URL */}
        <div className="space-y-2">
          <label htmlFor="canonicalUrl" className="block text-sm font-medium text-gray-300">
            Canonical URL
          </label>
          <input
            type="url"
            id="canonicalUrl"
            name="canonicalUrl"
            value={seoData.canonicalUrl}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter canonical URL"
          />
        </div>
      </div>

      {/* Social Media Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-t border-gray-700 pt-6">
          <h3 className="text-lg font-medium text-white">Social Media Settings</h3>
        </div>

        {/* OG Title */}
        <div className="space-y-2">
          <label htmlFor="ogTitle" className="block text-sm font-medium text-gray-300">
            OG Title
          </label>
          <input
            type="text"
            id="ogTitle"
            name="ogTitle"
            value={seoData.ogTitle}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter OG title"
          />
        </div>

        {/* OG Description */}
        <div className="space-y-2">
          <label htmlFor="ogDescription" className="block text-sm font-medium text-gray-300">
            OG Description
          </label>
          <textarea
            id="ogDescription"
            name="ogDescription"
            value={seoData.ogDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter OG description"
          />
        </div>

        {/* OG Image */}
        <div className="space-y-2">
          <label htmlFor="ogImage" className="block text-sm font-medium text-gray-300">
            OG Image
          </label>
          <select
            id="ogImage"
            name="ogImage"
            value={seoData.ogImage}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select OG image</option>
            {images.map(image => (
              <option key={image.id} value={image.id}>
                {image.alt}
              </option>
            ))}
          </select>
          {seoData.ogImage && images.find(img => img.id === seoData.ogImage) && (
            <div className="mt-2">
              <img
                src={images.find(img => img.id === seoData.ogImage)?.url}
                alt="OG preview"
                className="h-20 w-auto rounded"
              />
            </div>
          )}
        </div>

        {/* Twitter Card Type */}
        <div className="space-y-2">
          <label htmlFor="twitterCardType" className="block text-sm font-medium text-gray-300">
            Twitter Card Type
          </label>
          <select
            id="twitterCardType"
            name="twitterCardType"
            value={seoData.twitterCardType}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {twitterCardTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Twitter Title */}
        <div className="space-y-2">
          <label htmlFor="twitterTitle" className="block text-sm font-medium text-gray-300">
            Twitter Title
          </label>
          <input
            type="text"
            id="twitterTitle"
            name="twitterTitle"
            value={seoData.twitterTitle}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter Twitter title"
          />
        </div>

        {/* Twitter Description */}
        <div className="space-y-2">
          <label htmlFor="twitterDescription" className="block text-sm font-medium text-gray-300">
            Twitter Description
          </label>
          <textarea
            id="twitterDescription"
            name="twitterDescription"
            value={seoData.twitterDescription}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter Twitter description"
          />
        </div>

        {/* Twitter Image */}
        <div className="space-y-2">
          <label htmlFor="twitterImage" className="block text-sm font-medium text-gray-300">
            Twitter Image
          </label>
          <select
            id="twitterImage"
            name="twitterImage"
            value={seoData.twitterImage}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">Select Twitter image</option>
            {images.map(image => (
              <option key={image.id} value={image.id}>
                {image.alt}
              </option>
            ))}
          </select>
          {seoData.twitterImage && images.find(img => img.id === seoData.twitterImage) && (
            <div className="mt-2">
              <img
                src={images.find(img => img.id === seoData.twitterImage)?.url}
                alt="Twitter preview"
                className="h-20 w-auto rounded"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeoSocialTab;