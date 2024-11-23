import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemeColorPickerProps {
  settings: ThemeSettings;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ settings, onChange }) => {
  const handleChange = (section: string, subsection: string | null, property: string, value: string) => {
    const newSettings = { ...settings };

    if (subsection) {
      if (!newSettings.colors[section]) {
        newSettings.colors[section] = {};
      }
      if (!newSettings.colors[section][subsection]) {
        newSettings.colors[section][subsection] = {};
      }
      newSettings.colors[section][subsection][property] = value;
    } else {
      if (!newSettings.colors[section]) {
        newSettings.colors[section] = {};
      }
      newSettings.colors[section][property] = value;
    }

    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Colors</h3>

      {/* Website Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Website</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Background
            </label>
            <input
              type="color"
              value={settings.colors.website?.background || '#ffffff'}
              onChange={(e) => handleChange('website', null, 'background', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Header Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Header</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Background
            </label>
            <input
              type="color"
              value={settings.colors.header?.background || '#1f2937'}
              onChange={(e) => handleChange('header', null, 'background', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Border Color
            </label>
            <input
              type="color"
              value={settings.colors.header?.borderBottom?.color || '#374151'}
              onChange={(e) => handleChange('header', 'borderBottom', 'color', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Footer Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Footer</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Background
            </label>
            <input
              type="color"
              value={settings.colors.footer?.background || '#1f2937'}
              onChange={(e) => handleChange('footer', null, 'background', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Border Color
            </label>
            <input
              type="color"
              value={settings.colors.footer?.borderTop?.color || '#374151'}
              onChange={(e) => handleChange('footer', 'borderTop', 'color', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Module Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Modules</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Background
            </label>
            <input
              type="color"
              value={settings.colors.modules?.background || '#ffffff'}
              onChange={(e) => handleChange('modules', null, 'background', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Border Color
            </label>
            <input
              type="color"
              value={settings.colors.modules?.border?.color || '#e5e7eb'}
              onChange={(e) => handleChange('modules', 'border', 'color', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Title Background
            </label>
            <input
              type="color"
              value={settings.colors.modules?.title?.background || '#f3f4f6'}
              onChange={(e) => handleChange('modules', 'title', 'background', e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeColorPicker;