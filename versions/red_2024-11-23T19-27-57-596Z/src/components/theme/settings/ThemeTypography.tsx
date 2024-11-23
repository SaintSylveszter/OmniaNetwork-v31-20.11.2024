import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemeTypographyProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeTypography: React.FC<ThemeTypographyProps> = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (section: string, property: string, value: string) => {
    const newSettings = { ...settings };
    newSettings.typography[section][property] = value;
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Typography</h3>

      {/* Website Typography */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Website</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Family
            </label>
            <input
              type="text"
              value={settings.typography.website.fontFamily}
              onChange={(e) => handleChange('website', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Size
            </label>
            <input
              type="text"
              value={settings.typography.website.fontSize}
              onChange={(e) => handleChange('website', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Headings Typography */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Headings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Family
            </label>
            <input
              type="text"
              value={settings.typography.headings.fontFamily}
              onChange={(e) => handleChange('headings', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Color
            </label>
            <input
              type="text"
              value={settings.typography.headings.color}
              onChange={(e) => handleChange('headings', 'color', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Header Typography */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Header</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Family
            </label>
            <input
              type="text"
              value={settings.typography.header.fontFamily}
              onChange={(e) => handleChange('header', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Size
            </label>
            <input
              type="text"
              value={settings.typography.header.fontSize}
              onChange={(e) => handleChange('header', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Footer Typography */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Footer</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Family
            </label>
            <input
              type="text"
              value={settings.typography.footer.fontFamily}
              onChange={(e) => handleChange('footer', 'fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Font Size
            </label>
            <input
              type="text"
              value={settings.typography.footer.fontSize}
              onChange={(e) => handleChange('footer', 'fontSize', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeTypography;