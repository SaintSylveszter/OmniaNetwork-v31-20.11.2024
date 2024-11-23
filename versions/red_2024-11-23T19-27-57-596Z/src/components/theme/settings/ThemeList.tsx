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

interface ThemeListProps {
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

const ThemeList: React.FC<ThemeListProps> = ({ settings, onChange }) => {
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

  const handleListTitleChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.list) {
      newSettings.list = { title: {}, article: { title: {}, description: {}, image: {}, link: {} } };
    }
    if (!newSettings.list.title) {
      newSettings.list.title = {};
    }
    newSettings.list.title[property] = value;
    onChange(newSettings);
  };

  const handleArticleTitleChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.list?.article?.title) {
      newSettings.list = {
        ...newSettings.list,
        article: { ...newSettings.list?.article, title: {} }
      };
    }
    newSettings.list.article.title[property] = value;
    onChange(newSettings);
  };

  const handleArticleDescriptionChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.list?.article?.description) {
      newSettings.list = {
        ...newSettings.list,
        article: { ...newSettings.list?.article, description: {} }
      };
    }
    newSettings.list.article.description[property] = value;
    onChange(newSettings);
  };

  const handleArticleLinkChange = (property: string, value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.list?.article?.link) {
      newSettings.list = {
        ...newSettings.list,
        article: { ...newSettings.list?.article, link: {} }
      };
    }
    newSettings.list.article.link[property] = value;
    onChange(newSettings);
  };

  const handleImageWidthChange = (value: string) => {
    const newSettings = { ...settings };
    if (!newSettings.list?.article?.image) {
      newSettings.list = {
        ...newSettings.list,
        article: { ...newSettings.list?.article, image: {} }
      };
    }
    newSettings.list.article.image.width = value;
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
    isFontSize = false,
    isSelect = false,
    options = []
  }: { 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    type?: 'text' | 'color' | 'number';
    placeholder?: string;
    isFont?: boolean;
    isFontSize?: boolean;
    isSelect?: boolean;
    options?: { value: string; label: string; }[];
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
      ) : isSelect ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-32 px-2 py-1 text-sm rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
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
      {/* List Title */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">List Title</h3>
        <Row
          label="Font Family"
          value={settings.list?.title?.fontFamily || 'Arial'}
          onChange={(value) => handleListTitleChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Font Size"
          value={settings.list?.title?.fontSize || '24px'}
          onChange={(value) => handleListTitleChange('fontSize', value)}
          isFontSize
          placeholder="24"
        />
        <Row
          label="Font Color"
          value={settings.list?.title?.color || '#111827'}
          onChange={(value) => handleListTitleChange('color', value)}
          type="color"
        />
        <Row
          label="Background"
          value={settings.list?.title?.background || '#ffffff'}
          onChange={(value) => handleListTitleChange('background', value)}
          type="color"
        />
      </div>

      {/* Article Title */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Article Title</h3>
        <Row
          label="Font Family"
          value={settings.list?.article?.title?.fontFamily || 'Arial'}
          onChange={(value) => handleArticleTitleChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Font Size"
          value={settings.list?.article?.title?.fontSize || '20px'}
          onChange={(value) => handleArticleTitleChange('fontSize', value)}
          isFontSize
          placeholder="20"
        />
        <Row
          label="Font Color"
          value={settings.list?.article?.title?.color || '#111827'}
          onChange={(value) => handleArticleTitleChange('color', value)}
          type="color"
        />
        <Row
          label="Background"
          value={settings.list?.article?.title?.background || '#ffffff'}
          onChange={(value) => handleArticleTitleChange('background', value)}
          type="color"
        />
      </div>

      {/* Article Image */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Article Image</h3>
        <Row
          label="Width (%)"
          value={settings.list?.article?.image?.width || '100%'}
          onChange={handleImageWidthChange}
          placeholder="100%"
        />
      </div>

      {/* Article Description */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Article Description</h3>
        <Row
          label="Font Family"
          value={settings.list?.article?.description?.fontFamily || 'Arial'}
          onChange={(value) => handleArticleDescriptionChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Font Size"
          value={settings.list?.article?.description?.fontSize || '16px'}
          onChange={(value) => handleArticleDescriptionChange('fontSize', value)}
          isFontSize
          placeholder="16"
        />
        <Row
          label="Font Color"
          value={settings.list?.article?.description?.color || '#374151'}
          onChange={(value) => handleArticleDescriptionChange('color', value)}
          type="color"
        />
      </div>

      {/* Read More Link */}
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Read More Link</h3>
        <Row
          label="Font Family"
          value={settings.list?.article?.link?.fontFamily || 'Arial'}
          onChange={(value) => handleArticleLinkChange('fontFamily', value)}
          isFont
        />
        <Row
          label="Font Size"
          value={settings.list?.article?.link?.fontSize || '14px'}
          onChange={(value) => handleArticleLinkChange('fontSize', value)}
          isFontSize
          placeholder="14"
        />
        <Row
          label="Font Color"
          value={settings.list?.article?.link?.color || '#3b82f6'}
          onChange={(value) => handleArticleLinkChange('color', value)}
          type="color"
        />
        <Row
          label="Hover Color"
          value={settings.list?.article?.link?.hoverColor || '#2563eb'}
          onChange={(value) => handleArticleLinkChange('hoverColor', value)}
          type="color"
        />
        <Row
          label="Position"
          value={settings.list?.article?.link?.position || 'right'}
          onChange={(value) => handleArticleLinkChange('position', value)}
          isSelect
          options={[
            { value: 'left', label: 'Left' },
            { value: 'right', label: 'Right' }
          ]}
        />
      </div>
    </div>
  );
};

export default ThemeList;