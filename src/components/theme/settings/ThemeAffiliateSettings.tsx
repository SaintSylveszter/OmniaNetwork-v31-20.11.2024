import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemeAffiliateSettingsProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeAffiliateSettings: React.FC<ThemeAffiliateSettingsProps> = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (section: string, property: string, value: string) => {
    const newSettings = { ...settings };
    newSettings.affiliate[section][property] = value;
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Affiliate Settings</h3>

      {/* Subtitle Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Subtitle</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Family
            </label>
            <input
              type="text"
              value={settings.affiliate.subtitle.fontFamily}
              onChange={(e) => handleChange('subtitle', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Size
            </label>
            <input
              type="text"
              value={settings.affiliate.subtitle.fontSize}
              onChange={(e) => handleChange('subtitle', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Product Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Product</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Title Background
            </label>
            <input
              type="text"
              value={settings.affiliate.product.title.background}
              onChange={(e) => handleChange('product.title', 'background', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Button Background
            </label>
            <input
              type="text"
              value={settings.affiliate.product.button.background}
              onChange={(e) => handleChange('product.button', 'background', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeAffiliateSettings;