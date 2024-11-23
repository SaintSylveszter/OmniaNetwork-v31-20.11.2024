import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemeLayoutProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeLayout: React.FC<ThemeLayoutProps> = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (section: string, property: string, value: string | number) => {
    const newSettings = { ...settings };
    newSettings.layout[section][property] = value;
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Layout</h3>

      {/* Header Layout */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Header</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Height
            </label>
            <input
              type="text"
              value={settings.layout.header.height}
              onChange={(e) => handleChange('header', 'height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Footer Layout */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Footer</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Height
            </label>
            <input
              type="text"
              value={settings.layout.footer.height}
              onChange={(e) => handleChange('footer', 'height', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Modules Layout */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Modules</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Border Radius
            </label>
            <input
              type="number"
              value={settings.layout.modules.borderRadius}
              onChange={(e) => handleChange('modules', 'borderRadius', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeLayout;