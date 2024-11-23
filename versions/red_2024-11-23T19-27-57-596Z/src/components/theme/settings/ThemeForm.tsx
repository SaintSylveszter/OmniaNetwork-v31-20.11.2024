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

interface ThemeFormProps {
  settings: ThemeSettings | null;
  onChange: (newSettings: ThemeSettings) => void;
}

const ThemeForm: React.FC<ThemeFormProps> = ({ settings, onChange }) => {
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

  const handleFormChange = (property: string, value: string | number) => {
    const newSettings = { ...settings };
    if (!newSettings.form) {
      newSettings.form = {};
    }
    newSettings.form[property] = value;
    onChange(newSettings);
  };

  const handleLabelChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.form?.label) {
      newSettings.form = { ...newSettings.form, label: {} };
    }
    newSettings.form.label[property] = value;
    onChange(newSettings);
  };

  const handleInputChange = (property: string, value: string | number) => {
    const newSettings = { ...settings };
    if (!newSettings.form?.input) {
      newSettings.form = { ...newSettings.form, input: {} };
    }
    newSettings.form.input[property] = value;
    onChange(newSettings);
  };

  const handleSubmitChange = (property: string, value: string | number) => {
    const newSettings = { ...settings };
    if (!newSettings.form?.submit) {
      newSettings.form = { ...newSettings.form, submit: {} };
    }
    newSettings.form.submit[property] = value;
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
    min,
    max,
    step = 1,
    isFont = false
  }: { 
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: 'text' | 'color' | 'number';
    min?: number;
    max?: number;
    step?: number;
    isFont?: boolean;
  }) => {
    const handleFontSizeChange = (value: string) => {
      const numericValue = value.replace('px', '');
      onChange(`${numericValue}px`);
    };

    const isFontSize = label.toLowerCase().includes('font size');

    return (
      <div className="flex items-center justify-between py-1.5 border-b border-gray-100 dark:border-gray-700 last:border-0">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {type === 'color' ? (
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={value.toString()}
              onChange={(e) => onChange(e.target.value)}
              className="w-8 h-8 rounded overflow-hidden"
              style={colorPickerStyles}
            />
            <input
              type="text"
              value={value.toString()}
              onChange={(e) => onChange(e.target.value)}
              className="w-24 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
        ) : isFont ? (
          <FontSelect value={value.toString()} onChange={(value) => onChange(value)} />
        ) : type === 'number' ? (
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            min={min}
            max={max}
            step={step}
            className="w-24 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        ) : isFontSize ? (
          <input
            type="number"
            value={parseInt(value.toString())}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            min={8}
            max={72}
            step={1}
            className="w-24 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        ) : (
          <input
            type="text"
            value={value.toString()}
            onChange={(e) => onChange(e.target.value)}
            className="w-32 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Label Settings */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Label Settings</h3>
        <Row
          label="Font Family"
          value={settings.form?.label?.fontFamily || 'Arial'}
          onChange={(value) => handleLabelChange('fontFamily', value.toString())}
          isFont
        />
        <Row
          label="Font Size"
          value={settings.form?.label?.fontSize || '14px'}
          onChange={(value) => handleLabelChange('fontSize', value.toString())}
        />
        <Row
          label="Font Color"
          value={settings.form?.label?.color || '#374151'}
          onChange={(value) => handleLabelChange('color', value.toString())}
          type="color"
        />
      </div>

      {/* Form Settings */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Form Settings</h3>
        <Row
          label="Background Color"
          value={settings.form?.backgroundColor || '#ffffff'}
          onChange={(value) => handleFormChange('backgroundColor', value.toString())}
          type="color"
        />
        <Row
          label="Border Height"
          value={settings.form?.borderHeight || 0}
          onChange={(value) => handleFormChange('borderHeight', value)}
          type="number"
          min={0}
          max={10}
        />
        <Row
          label="Border Color"
          value={settings.form?.borderColor || '#e5e7eb'}
          onChange={(value) => handleFormChange('borderColor', value.toString())}
          type="color"
        />
        <Row
          label="Border Radius"
          value={settings.form?.borderRadius || 8}
          onChange={(value) => handleFormChange('borderRadius', value)}
          type="number"
          min={0}
          max={50}
        />
      </div>

      {/* Input Settings */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Input Settings</h3>
        <Row
          label="Border Height"
          value={settings.form?.input?.borderHeight || 1}
          onChange={(value) => handleInputChange('borderHeight', value)}
          type="number"
          min={0}
          max={10}
        />
        <Row
          label="Border Color"
          value={settings.form?.input?.borderColor || '#e5e7eb'}
          onChange={(value) => handleInputChange('borderColor', value.toString())}
          type="color"
        />
        <Row
          label="Border Radius"
          value={settings.form?.input?.borderRadius || 4}
          onChange={(value) => handleInputChange('borderRadius', value)}
          type="number"
          min={0}
          max={50}
        />
        <Row
          label="Font Family"
          value={settings.form?.input?.fontFamily || 'Arial'}
          onChange={(value) => handleInputChange('fontFamily', value.toString())}
          isFont
        />
        <Row
          label="Font Size"
          value={settings.form?.input?.fontSize || '14px'}
          onChange={(value) => handleInputChange('fontSize', value.toString())}
        />
        <Row
          label="Font Color"
          value={settings.form?.input?.color || '#374151'}
          onChange={(value) => handleInputChange('color', value.toString())}
          type="color"
        />
        <Row
          label="Padding"
          value={settings.form?.input?.padding || 8}
          onChange={(value) => handleInputChange('padding', value)}
          type="number"
          min={0}
          max={50}
        />
      </div>

      {/* Submit Button Settings */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Submit Button Settings</h3>
        <Row
          label="Background Color"
          value={settings.form?.submit?.backgroundColor || '#3b82f6'}
          onChange={(value) => handleSubmitChange('backgroundColor', value.toString())}
          type="color"
        />
        <Row
          label="Hover Background"
          value={settings.form?.submit?.hoverBackgroundColor || '#2563eb'}
          onChange={(value) => handleSubmitChange('hoverBackgroundColor', value.toString())}
          type="color"
        />
        <Row
          label="Border Height"
          value={settings.form?.submit?.borderHeight || 0}
          onChange={(value) => handleSubmitChange('borderHeight', value)}
          type="number"
          min={0}
          max={10}
        />
        <Row
          label="Border Color"
          value={settings.form?.submit?.borderColor || '#3b82f6'}
          onChange={(value) => handleSubmitChange('borderColor', value.toString())}
          type="color"
        />
        <Row
          label="Border Radius"
          value={settings.form?.submit?.borderRadius || 4}
          onChange={(value) => handleSubmitChange('borderRadius', value)}
          type="number"
          min={0}
          max={50}
        />
        <Row
          label="Font Family"
          value={settings.form?.submit?.fontFamily || 'Arial'}
          onChange={(value) => handleSubmitChange('fontFamily', value.toString())}
          isFont
        />
        <Row
          label="Font Size"
          value={settings.form?.submit?.fontSize || '14px'}
          onChange={(value) => handleSubmitChange('fontSize', value.toString())}
        />
        <Row
          label="Font Color"
          value={settings.form?.submit?.color || '#ffffff'}
          onChange={(value) => handleSubmitChange('color', value.toString())}
          type="color"
        />
        <Row
          label="Font Hover Color"
          value={settings.form?.submit?.hoverColor || '#ffffff'}
          onChange={(value) => handleSubmitChange('hoverColor', value.toString())}
          type="color"
        />
        <Row
          label="Padding"
          value={settings.form?.submit?.padding || 8}
          onChange={(value) => handleSubmitChange('padding', value)}
          type="number"
          min={0}
          max={50}
        />
      </div>
    </div>
  );
};

export default ThemeForm;