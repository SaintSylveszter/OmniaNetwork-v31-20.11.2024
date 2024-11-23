import React, { useState, useEffect } from 'react';
import { getConnection } from '../../../lib/db/connections';
import sql from '../../../lib/db/neon';
import type { ThemeSettings } from '../../../types/theme';

interface GoogleFont {
  id: string;
  name: string;
  link: string;
}

const WEB_SAFE_FONTS = [
  'Arial',
  'Garamond',
  'Georgia',
  'Tahoma',
  'Times New Roman',
  'Trebuchet MS',
  'Verdana'
];

interface ThemeFooterProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const FontSizeInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}> = ({ value: initialValue, onChange, placeholder }) => {
  const [localValue, setLocalValue] = useState(initialValue.replace('px', ''));

  useEffect(() => {
    setLocalValue(initialValue.replace('px', ''));
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
  };

  const handleBlur = () => {
    const numericValue = localValue.trim();
    const newValue = numericValue ? `${numericValue}px` : '';
    onChange(newValue);
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className="w-32 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    />
  );
};

const ThemeFooter: React.FC<ThemeFooterProps> = ({ settings, onChange }) => {
  const [googleFonts, setGoogleFonts] = useState<GoogleFont[]>([]);
  const [connectionString, setConnectionString] = useState<string | null>(null);

  useEffect(() => {
    getConnectionString();
  }, []);

  useEffect(() => {
    if (connectionString) {
      loadGoogleFonts();
    }
  }, [connectionString]);

  const getConnectionString = async () => {
    try {
      const [admin] = await sql<[{ connection_string: string }]>`
        SELECT connection_string 
        FROM admins 
        WHERE username = ${window.location.pathname.split('/')[1]}
        AND status = 'active'
        LIMIT 1
      `;

      if (!admin?.connection_string) {
        throw new Error('No database connection found for this site');
      }

      setConnectionString(admin.connection_string);
    } catch (error) {
      console.error('Error getting connection string:', error);
    }
  };

  const loadGoogleFonts = async () => {
    if (!connectionString) return;

    try {
      const siteDb = getConnection(connectionString);
      const fonts = await siteDb<GoogleFont[]>`
        SELECT * FROM google_fonts 
        ORDER BY name ASC
      `;
      setGoogleFonts(fonts);
    } catch (error) {
      console.error('Error loading Google fonts:', error);
    }
  };

  if (!settings) return null;

  const handleLayoutChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    newSettings.layout.footer[property] = value;
    onChange(newSettings);
  };

  const handleBorderChange = (property: string, value: string | number) => {
    const newSettings = { ...settings };
    newSettings.colors.footer.borderTop[property] = value;
    onChange(newSettings);
  };

  const handleFontChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    newSettings.typography.footer[property] = value;
    onChange(newSettings);
  };

  const handleLinksChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.typography.footer.links) {
      newSettings.typography.footer.links = {};
    }
    newSettings.typography.footer.links[property] = value;
    onChange(newSettings);
  };

  const handleCopyrightChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.typography.footer.copyright) {
      newSettings.typography.footer.copyright = {};
    }
    newSettings.typography.footer.copyright[property] = value;
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

  const FontSelect = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-48 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
    >
      <optgroup label="Web Safe Fonts">
        {WEB_SAFE_FONTS.map(font => (
          <option key={font} value={font} style={{ fontFamily: font }}>
            {font}
          </option>
        ))}
      </optgroup>
      {googleFonts.length > 0 && (
        <optgroup label="Google Fonts">
          {googleFonts.map(font => (
            <option key={font.id} value={font.name} style={{ fontFamily: font.name }}>
              {font.name}
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );

  const Row = ({ 
    label, 
    value, 
    onChange,
    type = 'text', 
    placeholder = '',
    isFont = false,
    isFontSize = false
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    type?: 'text' | 'color';
    placeholder?: string;
    isFont?: boolean;
    isFontSize?: boolean;
  }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {type === 'color' ? (
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-8 h-8 rounded overflow-hidden"
            style={colorPickerStyles}
          />
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-24 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      ) : isFont ? (
        <FontSelect value={value} onChange={onChange} />
      ) : isFontSize ? (
        <FontSizeInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-32 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Footer Height & Border */}
      <div className="space-y-1">
        <Row
          label="Height (px)"
          value={settings.layout.footer.height}
          onChange={(value) => handleLayoutChange('height', value)}
          placeholder="200"
          isFontSize
        />
        <Row
          label="Border Height (px)"
          value={`${settings.colors.footer.borderTop.height}px`}
          onChange={(value) => handleBorderChange('height', parseInt(value) || 0)}
          placeholder="0"
          isFontSize
        />
        <Row
          label="Border Color"
          value={settings.colors.footer.borderTop.color}
          onChange={(value) => handleBorderChange('color', value)}
          type="color"
        />
      </div>

      {/* Footer Font */}
      <div className="space-y-1">
        <Row
          label="Font Family"
          value={settings.typography.footer.fontFamily}
          onChange={(value) => handleFontChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Font Size (px)"
          value={settings.typography.footer.fontSize}
          onChange={(value) => handleFontChange('fontSize', value)}
          placeholder="16"
          isFontSize
        />
        <Row
          label="Font Color"
          value={settings.typography.footer.color}
          onChange={(value) => handleFontChange('color', value)}
          type="color"
        />
      </div>

      {/* Links */}
      <div className="space-y-1">
        <Row
          label="Links Font Family"
          value={settings.typography.footer.links?.fontFamily || settings.typography.footer.fontFamily}
          onChange={(value) => handleLinksChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Links Font Size (px)"
          value={settings.typography.footer.links?.fontSize || '14px'}
          onChange={(value) => handleLinksChange('fontSize', value)}
          placeholder="14"
          isFontSize
        />
        <Row
          label="Links Color"
          value={settings.typography.footer.links?.color || '#9CA3AF'}
          onChange={(value) => handleLinksChange('color', value)}
          type="color"
        />
        <Row
          label="Links Hover Color"
          value={settings.typography.footer.links?.hoverColor || '#F3F4F6'}
          onChange={(value) => handleLinksChange('hoverColor', value)}
          type="color"
        />
      </div>

      {/* Copyright */}
      <div className="space-y-1">
        <Row
          label="Copyright Font Family"
          value={settings.typography.footer.copyright?.fontFamily || settings.typography.footer.fontFamily}
          onChange={(value) => handleCopyrightChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Copyright Font Size (px)"
          value={settings.typography.footer.copyright?.fontSize || '14px'}
          onChange={(value) => handleCopyrightChange('fontSize', value)}
          placeholder="14"
          isFontSize
        />
        <Row
          label="Copyright Color"
          value={settings.typography.footer.copyright?.color || '#9CA3AF'}
          onChange={(value) => handleCopyrightChange('color', value)}
          type="color"
        />
      </div>
    </div>
  );
};

export default ThemeFooter;