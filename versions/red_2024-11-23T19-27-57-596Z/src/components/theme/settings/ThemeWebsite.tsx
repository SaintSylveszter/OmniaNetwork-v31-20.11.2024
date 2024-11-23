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

interface ThemeWebsiteProps {
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

const ThemeWebsite: React.FC<ThemeWebsiteProps> = ({ settings, onChange }) => {
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

  const handleWebsiteChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    newSettings.typography.website[property] = value;
    onChange(newSettings);
  };

  const handleLinkChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.typography.website.links) {
      newSettings.typography.website.links = {};
    }
    newSettings.typography.website.links[property] = value;
    onChange(newSettings);
  };

  const handleHeadingChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    newSettings.typography.headings[property] = value;
    onChange(newSettings);
  };

  const handleHeadingSizeChange = (heading: string, value: string) => {
    const newSettings = { ...settings };
    newSettings.typography.headings[heading].fontSize = value;
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
      {/* Website Typography */}
      <div className="space-y-1">
        <Row
          label="Font Family"
          value={settings.typography.website.fontFamily}
          onChange={(value) => handleWebsiteChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Font Size (px)"
          value={settings.typography.website.fontSize || '16px'}
          onChange={(value) => handleWebsiteChange('fontSize', value)}
          placeholder="16"
          isFontSize
        />
        <Row
          label="Font Color"
          value={settings.typography.website.color}
          onChange={(value) => handleWebsiteChange('color', value)}
          type="color"
        />
      </div>

      {/* Links */}
      <div className="space-y-1">
        <Row
          label="Link Size (px)"
          value={settings.typography.website.links?.fontSize || '16px'}
          onChange={(value) => handleLinkChange('fontSize', value)}
          placeholder="16"
          isFontSize
        />
        <Row
          label="Link Color"
          value={settings.typography.website.links?.color || '#3B82F6'}
          onChange={(value) => handleLinkChange('color', value)}
          type="color"
        />
        <Row
          label="Link Hover"
          value={settings.typography.website.links?.hoverColor || '#2563EB'}
          onChange={(value) => handleLinkChange('hoverColor', value)}
          type="color"
        />
      </div>

      {/* Headings */}
      <div className="space-y-1">
        <Row
          label="Heading Font"
          value={settings.typography.headings.fontFamily}
          onChange={(value) => handleHeadingChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Heading Color"
          value={settings.typography.headings.color}
          onChange={(value) => handleHeadingChange('color', value)}
          type="color"
        />
        <Row
          label="H1 Size (px)"
          value={settings.typography.headings.h1.fontSize || '40px'}
          onChange={(value) => handleHeadingSizeChange('h1', value)}
          placeholder="40"
          isFontSize
        />
        <Row
          label="H2 Size (px)"
          value={settings.typography.headings.h2.fontSize || '32px'}
          onChange={(value) => handleHeadingSizeChange('h2', value)}
          placeholder="32"
          isFontSize
        />
        <Row
          label="H3 Size (px)"
          value={settings.typography.headings.h3.fontSize || '28px'}
          onChange={(value) => handleHeadingSizeChange('h3', value)}
          placeholder="28"
          isFontSize
        />
      </div>
    </div>
  );
};

export default ThemeWebsite;