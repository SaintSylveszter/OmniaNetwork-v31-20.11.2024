import React, { useState } from 'react';

const SiteSettings: React.FC = () => {
  const [siteName, setSiteName] = useState('');
  const [siteDescription, setSiteDescription] = useState('');
  const [facebookUrl, setFacebookUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState('');
  const [googleAdsenseId, setGoogleAdsenseId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this data to your backend
    console.log({
      siteName,
      siteDescription,
      facebookUrl,
      twitterUrl,
      instagramUrl,
      googleAnalyticsId,
      googleAdsenseId,
    });
    // After successful update, you might want to show a success message
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-2xl font-bold mb-6">Site Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="siteName">
            Site Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="siteName"
            type="text"
            placeholder="Site Name"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="siteDescription">
            Site Description
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="siteDescription"
            placeholder="Site Description"
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="facebookUrl">
            Facebook URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="facebookUrl"
            type="url"
            placeholder="https://facebook.com/yourpage"
            value={facebookUrl}
            onChange={(e) => setFacebookUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="twitterUrl">
            Twitter URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="twitterUrl"
            type="url"
            placeholder="https://twitter.com/yourhandle"
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="instagramUrl">
            Instagram URL
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="instagramUrl"
            type="url"
            placeholder="https://instagram.com/yourprofile"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="googleAnalyticsId">
            Google Analytics ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="googleAnalyticsId"
            type="text"
            placeholder="UA-XXXXXXXXX-X"
            value={googleAnalyticsId}
            onChange={(e) => setGoogleAnalyticsId(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="googleAdsenseId">
            Google AdSense ID
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="googleAdsenseId"
            type="text"
            placeholder="ca-pub-XXXXXXXXXXXXXXXX"
            value={googleAdsenseId}
            onChange={(e) => setGoogleAdsenseId(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;