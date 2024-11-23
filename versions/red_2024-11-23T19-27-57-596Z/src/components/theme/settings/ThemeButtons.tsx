import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemeButtonsProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeButtons: React.FC<ThemeButtonsProps> = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleChange = (buttonType: string, property: string, value: string | number) => {
    const newSettings = { ...settings };
    newSettings.buttons[buttonType][property] = value;
    onChange(newSettings);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Buttons</h3>

      {/* Submit Button */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">Submit Button</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Background
            </label>
            <input
              type="text"
              value={settings.buttons.submit.background}
              onChange={(e) => handleChange('submit', 'background', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Hover Background
            </label>
            <input
              type="text"
              value={settings.buttons.submit.hoverBackground}
              onChange={(e) => handleChange('submit', 'hoverBackground', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700 dark:text-gray-300">CTA Button</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Background
            </label>
            <input
              type="text"
              value={settings.buttons.cta.background}
              onChange={(e) => handleChange('cta', 'background', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Hover Background
            </label>
            <input
              type="text"
              value={settings.buttons.cta.hoverBackground}
              onChange={(e) => handleChange('cta', 'hoverBackground', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeButtons;