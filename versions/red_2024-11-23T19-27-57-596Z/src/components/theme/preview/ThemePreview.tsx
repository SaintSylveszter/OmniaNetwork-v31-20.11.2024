import React from 'react';
import type { ThemeSettings } from '../../../types/theme';
import ThemePreviewHeader from './ThemePreviewHeader';
import ThemePreviewContent from './ThemePreviewContent';
import ThemePreviewForm from './ThemePreviewForm';
import ThemePreviewList from './ThemePreviewList';
import ThemePreviewArticle from './ThemePreviewArticle';
import ThemePreviewFooter from './ThemePreviewFooter';

interface ThemePreviewProps {
  settings: ThemeSettings;
  device: 'desktop' | 'mobile';
  activeTab?: string;
}

const ThemePreview: React.FC<ThemePreviewProps> = ({ settings, device, activeTab = 'global' }) => {
  const containerStyles = {
    width: device === 'desktop' ? '100%' : '375px',
    height: device === 'desktop' ? '800px' : '812px',
    backgroundColor: settings.colors?.website?.background || '#ffffff',
    fontFamily: settings.typography?.website?.fontFamily || 'Arial',
    fontSize: settings.typography?.website?.fontSize || '16px',
    color: settings.typography?.website?.color || '#374151',
    lineHeight: settings.typography?.website?.lineHeight || 1.5,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  };

  const wrapperStyles = device === 'mobile' ? {
    maxWidth: '375px',
    margin: '0 auto',
    border: '12px solid #1f2937',
    borderRadius: '32px',
    overflow: 'hidden',
    height: '812px'
  } : {};

  const renderContent = () => {
    switch (activeTab) {
      case 'form':
        return <ThemePreviewForm settings={settings} />;
      case 'list':
        return <ThemePreviewList settings={settings} />;
      case 'article':
        return <ThemePreviewArticle settings={settings} />;
      default:
        return <ThemePreviewContent settings={settings} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 overflow-hidden">
      <div style={wrapperStyles}>
        <div 
          className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg"
          style={containerStyles}
        >
          <ThemePreviewHeader settings={settings} />
          <div className="flex-1 overflow-auto">
            {renderContent()}
          </div>
          <ThemePreviewFooter settings={settings} />
        </div>
      </div>
    </div>
  );
};

export default ThemePreview;