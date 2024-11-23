import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemePreviewContentProps {
  settings: ThemeSettings;
}

const ThemePreviewContent: React.FC<ThemePreviewContentProps> = ({ settings }) => {
  const headingStyles = {
    fontFamily: `"${settings.typography?.headings?.fontFamily || 'Arial'}", sans-serif`,
    color: settings.typography?.headings?.color || '#111827',
  };

  const h1Styles = {
    ...headingStyles,
    fontSize: settings.typography?.headings?.h1?.fontSize || '2.5rem',
    marginBottom: '1.5rem',
  };

  const h2Styles = {
    ...headingStyles,
    fontSize: settings.typography?.headings?.h2?.fontSize || '2rem',
    marginBottom: '1rem',
  };

  const moduleStyles = {
    backgroundColor: settings.colors?.modules?.background || '#ffffff',
    borderRadius: `${settings.layout?.modules?.borderRadius || 8}px`,
    border: settings.colors?.modules?.border?.height > 0
      ? `${settings.colors.modules.border.height}px solid ${settings.colors.modules.border.color}`
      : 'none',
    overflow: 'hidden',
  };

  const moduleTitleStyles = {
    backgroundColor: settings.colors?.modules?.title?.background || '#f3f4f6',
    fontFamily: `"${settings.typography?.modules?.title?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.typography?.modules?.title?.fontSize || '1.25rem',
    color: settings.typography?.modules?.title?.color || '#111827',
    padding: `${settings.layout?.modules?.title?.padding || 16}px`,
    textAlign: 'center' as const,
  };

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 style={h1Styles}>Theme Preview</h1>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <h2 style={h2Styles}>Content Area</h2>
            <p className="mb-4">
              This preview shows how your theme settings affect the appearance of various elements
              on your website. You can customize colors, typography, spacing, and more through the
              theme settings panel.
            </p>
            <p className="mb-4">
              The content area demonstrates text styling, while the module on the right shows
              how components like titles, inputs, and buttons will look with your chosen theme.
            </p>
          </div>

          <div style={moduleStyles}>
            <div style={moduleTitleStyles}>
              Sample Module
            </div>
            <div className="p-4">
              <p className="text-sm mb-4">
                This module demonstrates how various UI components will appear with your
                current theme settings.
              </p>
              <button
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  backgroundColor: settings.modules?.submit?.background || '#3b82f6',
                  color: settings.modules?.submit?.color || '#ffffff',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: `"${settings.modules?.submit?.fontFamily || 'Arial'}", sans-serif`,
                  fontSize: settings.modules?.submit?.fontSize || '1rem',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = settings.modules?.submit?.hoverBackground || '#2563eb';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = settings.modules?.submit?.background || '#3b82f6';
                }}
              >
                Sample Button
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThemePreviewContent;