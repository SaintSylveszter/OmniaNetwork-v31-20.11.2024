import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemePreviewArticleProps {
  settings: ThemeSettings;
}

const ThemePreviewArticle: React.FC<ThemePreviewArticleProps> = ({ settings }) => {
  return (
    <main className="p-6" style={{ minHeight: '600px' }}>
      <article className="max-w-3xl mx-auto">
        <h1 style={{
          fontFamily: settings.typography.headings.fontFamily,
          fontSize: settings.typography.headings.h1.fontSize,
          color: settings.typography.headings.color,
          marginBottom: '24px',
        }}>
          Article Title
        </h1>

        <div className="mb-8" style={{
          backgroundColor: settings.colors.modules.background,
          borderRadius: `${settings.layout.modules.borderRadius}px`,
          border: settings.colors.modules.border.height > 0
            ? `${settings.colors.modules.border.height}px solid ${settings.colors.modules.border.color}`
            : 'none',
          padding: '24px',
        }}>
          <div className="prose max-w-none">
            <h2 style={{
              fontFamily: settings.typography.headings.fontFamily,
              fontSize: settings.typography.headings.h2.fontSize,
              color: settings.typography.headings.color,
              marginBottom: '16px',
            }}>
              Introduction
            </h2>
            
            <p className="mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h3 style={{
              fontFamily: settings.typography.headings.fontFamily,
              fontSize: settings.typography.headings.h3.fontSize,
              color: settings.typography.headings.color,
              margin: '24px 0 16px',
            }}>
              Section 1
            </h3>

            <p className="mb-4">
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
              eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <a
              href="#"
              style={{
                color: settings.typography.modules.links?.color || '#3b82f6',
                fontFamily: settings.typography.modules.links?.fontFamily || settings.typography.website.fontFamily,
                fontSize: settings.typography.modules.links?.fontSize || '14px',
                textDecoration: 'none',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.color = settings.typography.modules.links?.hoverColor || '#2563eb';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = settings.typography.modules.links?.color || '#3b82f6';
              }}
            >
              Related Article →
            </a>
          </div>
        </div>
      </article>
    </main>
  );
};

export default ThemePreviewArticle;