import React, { useState, useEffect, useRef } from 'react';
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

interface ThemeModulesProps {
  settings: ThemeSettings;
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

const ThemeModules: React.FC<ThemeModulesProps> = ({ settings, onChange }) => {
  const [googleFonts, setGoogleFonts] = useState<GoogleFont[]>([]);
  const [connectionString, setConnectionString] = useState<string | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getConnectionString();

    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        const colorPicker = document.querySelector('input[type="color"]');
        if (colorPicker) {
          colorPicker.blur();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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

  const handleModuleChange = (property: string, value: string | number) => {
    const newSettings = { ...settings };
    if (property === 'borderRadius') {
      newSettings.layout.modules.borderRadius = value as number;
    } else {
      newSettings.colors.modules[property] = value;
    }
    onChange(newSettings);
  };

  const handleBorderChange = (property: string, value: string | number) => {
    const newSettings = { ...settings };
    newSettings.colors.modules.border[property] = value;
    onChange(newSettings);
  };

  const handleTitleChange = (property: string, value: string | number) => {
    const newSettings = { ...settings };
    if (property === 'padding') {
      newSettings.layout.modules.title.padding = value as number;
    } else {
      newSettings.colors.modules.title[property] = value;
    }
    onChange(newSettings);
  };

  const handleFontChange = (section: string, property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.typography.modules[section]) {
      newSettings.typography.modules[section] = {};
    }
    newSettings.typography.modules[section][property] = value;
    onChange(newSettings);
  };

  const handleInputChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.modules) {
      newSettings.modules = { input: {}, submit: {} };
    }
    if (!newSettings.modules.input) {
      newSettings.modules.input = {};
    }
    newSettings.modules.input[property] = value;
    onChange(newSettings);
  };

  const handleSubmitChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.modules) {
      newSettings.modules = { input: {}, submit: {} };
    }
    if (!newSettings.modules.submit) {
      newSettings.modules.submit = {};
    }
    newSettings.modules.submit[property] = value;
    onChange(newSettings);
  };

  const colorPickerStyles = {
    border: 'none',
    padding: 0,
    background: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    appearance: 'none',
    cursor: 'pointer',
    width: '32px',
    height: '32px'
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
    type?: 'text' | 'color' | 'number';
    placeholder?: string;
    isFont?: boolean;
    isFontSize?: boolean;
  }) => (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      {type === 'color' ? (
        <div className="flex items-center space-x-2" ref={colorPickerRef}>
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded overflow-hidden cursor-pointer"
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
      ) : type === 'number' ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-32 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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

  // Ensure typography.modules.links exists
  if (!settings.typography.modules.links) {
    settings.typography.modules.links = {
      fontFamily: settings.typography.modules.title.fontFamily,
      fontSize: '14px',
      color: '#3b82f6',
      hoverColor: '#2563eb'
    };
  }

  return (
    <div className="space-y-6">
      {/* Module Background & Border */}
      <div className="space-y-1">
        <Row
          label="Background Color"
          value={settings.colors.modules.background}
          onChange={(value) => handleModuleChange('background', value)}
          type="color"
        />
        <Row
          label="Border Radius (px)"
          value={settings.layout.modules.borderRadius.toString()}
          onChange={(value) => handleModuleChange('borderRadius', parseInt(value))}
          type="number"
          placeholder="8"
        />
        <Row
          label="Border Height (px)"
          value={settings.colors.modules.border.height.toString()}
          onChange={(value) => handleBorderChange('height', parseInt(value))}
          type="number"
          placeholder="0"
        />
        <Row
          label="Border Color"
          value={settings.colors.modules.border.color}
          onChange={(value) => handleBorderChange('color', value)}
          type="color"
        />
      </div>

      {/* Module Title */}
      <div className="space-y-1">
        <Row
          label="Title Font Family"
          value={settings.typography.modules.title.fontFamily}
          onChange={(value) => handleFontChange('title', 'fontFamily', value)}
          isFont
        />
        <Row
          label="Title Font Size"
          value={settings.typography.modules.title.fontSize}
          onChange={(value) => handleFontChange('title', 'fontSize', value)}
          isFontSize
          placeholder="18"
        />
        <Row
          label="Title Color"
          value={settings.typography.modules.title.color}
          onChange={(value) => handleFontChange('title', 'color', value)}
          type="color"
        />
        <Row
          label="Title Background"
          value={settings.colors.modules.title.background}
          onChange={(value) => handleTitleChange('background', value)}
          type="color"
        />
        <Row
          label="Title Padding (px)"
          value={settings.layout.modules.title.padding.toString()}
          onChange={(value) => handleTitleChange('padding', parseInt(value))}
          type="number"
          placeholder="12"
        />
      </div>

      {/* Input Field */}
      <div className="space-y-1">
        <Row
          label="Input Background"
          value={settings.modules?.input?.background || '#ffffff'}
          onChange={(value) => handleInputChange('background', value)}
          type="color"
        />
        <Row
          label="Input Border Color"
          value={settings.modules?.input?.borderColor || '#e5e7eb'}
          onChange={(value) => handleInputChange('borderColor', value)}
          type="color"
        />
        <Row
          label="Input Text Color"
          value={settings.modules?.input?.color || '#374151'}
          onChange={(value) => handleInputChange('color', value)}
          type="color"
        />
        <Row
          label="Input Font Family"
          value={settings.modules?.input?.fontFamily || settings.typography.website.fontFamily}
          onChange={(value) => handleInputChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Input Font Size"
          value={settings.modules?.input?.fontSize || '16px'}
          onChange={(value) => handleInputChange('fontSize', value)}
          isFontSize
          placeholder="16"
        />
      </div>

      {/* Submit Button */}
      <div className="space-y-1">
        <Row
          label="Button Background"
          value={settings.modules?.submit?.background || '#3b82f6'}
          onChange={(value) => handleSubmitChange('background', value)}
          type="color"
        />
        <Row
          label="Button Hover"
          value={settings.modules?.submit?.hoverBackground || '#2563eb'}
          onChange={(value) => handleSubmitChange('hoverBackground', value)}
          type="color"
        />
        <Row
          label="Button Text Color"
          value={settings.modules?.submit?.color || '#ffffff'}
          onChange={(value) => handleSubmitChange('color', value)}
          type="color"
        />
        <Row
          label="Button Font Family"
          value={settings.modules?.submit?.fontFamily || settings.typography.website.fontFamily}
          onChange={(value) => handleSubmitChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Button Font Size"
          value={settings.modules?.submit?.fontSize || '16px'}
          onChange={(value) => handleSubmitChange('fontSize', value)}
          isFontSize
          placeholder="16"
        />
      </div>

      {/* Module Links */}
      <div className="space-y-1">
        <Row
          label="Link Font Family"
          value={settings.typography.modules.links.fontFamily}
          onChange={(value) => handleFontChange('links', 'fontFamily', value)}
          isFont
        />
        <Row
          label="Link Font Size"
          value={settings.typography.modules.links.fontSize}
          onChange={(value) => handleFontChange('links', 'fontSize', value)}
          isFontSize
          placeholder="14"
        />
        <Row
          label="Link Color"
          value={settings.typography.modules.links.color}
          onChange={(value) => handleFontChange('links', 'color', value)}
          type="color"
        />
        <Row
          label="Link Hover Color"
          value={settings.typography.modules.links.hoverColor}
          onChange={(value) => handleFontChange('links', 'hoverColor', value)}
          type="color"
        />
      </div>
    </div>
  );
};

export default ThemeModules;