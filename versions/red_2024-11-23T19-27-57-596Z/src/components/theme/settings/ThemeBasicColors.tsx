import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemeBasicColorsProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeBasicColors: React.FC<ThemeBasicColorsProps> = ({ settings, onChange }) => {
  if (!settings) return null;

  const handleColorChange = (section: string, property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.colors[section]) {
      newSettings.colors[section] = {};
    }
    newSettings.colors[section][property] = value;
    onChange(newSettings);
  };

  const handleTypographyChange = (section: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.typography[section]) {
      newSettings.typography[section] = {};
    }
    newSettings.typography[section].color = value;
    onChange(newSettings);
  };

  const colorPickerStyles = {
    border: 'none',
    padding: 0,
    background: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer'
  } as const;

  const ColorRow = ({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="w-8 h-8 rounded overflow-hidden">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full"
          style={colorPickerStyles}
        />
      </div>
    </div>
  );

  return (
    <div className="space-y-1">
      {/* Website Colors */}
      <ColorRow
        label="Website Background"
        value={settings.colors.website?.background || '#ffffff'}
        onChange={(value) => handleColorChange('website', 'background', value)}
      />

      <ColorRow
        label="Website Font"
        value={settings.typography.website?.color || '#374151'}
        onChange={(value) => handleTypographyChange('website', value)}
      />

      {/* Header Colors */}
      <ColorRow
        label="Header Background"
        value={settings.colors.header?.background || '#1f2937'}
        onChange={(value) => handleColorChange('header', 'background', value)}
      />

      <ColorRow
        label="Header Font"
        value={settings.typography.header?.color || '#ffffff'}
        onChange={(value) => handleTypographyChange('header', value)}
      />

      {/* Footer Colors */}
      <ColorRow
        label="Footer Background"
        value={settings.colors.footer?.background || '#1f2937'}
        onChange={(value) => handleColorChange('footer', 'background', value)}
      />

      <ColorRow
        label="Footer Font"
        value={settings.typography.footer?.color || '#9ca3af'}
        onChange={(value) => handleTypographyChange('footer', value)}
      />
    </div>
  );
};

export default ThemeBasicColors;