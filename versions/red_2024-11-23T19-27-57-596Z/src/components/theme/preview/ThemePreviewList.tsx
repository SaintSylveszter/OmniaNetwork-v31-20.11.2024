import React from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemePreviewListProps {
  settings: ThemeSettings;
}

const ThemePreviewList: React.FC<ThemePreviewListProps> = ({ settings }) => {
  const listTitleStyles = {
    fontFamily: `"${settings.list?.title?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.list?.title?.fontSize || '24px',
    color: settings.list?.title?.color || '#111827',
    backgroundColor: settings.list?.title?.background || '#ffffff',
    marginBottom: '24px',
  };

  const articleTitleStyles = {
    fontFamily: `"${settings.list?.article?.title?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.list?.article?.title?.fontSize || '20px',
    color: settings.list?.article?.title?.color || '#111827',
    backgroundColor: settings.list?.article?.title?.background || '#ffffff',
    marginBottom: '12px',
  };

  const articleDescriptionStyles = {
    fontFamily: `"${settings.list?.article?.description?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.list?.article?.description?.fontSize || '16px',
    color: settings.list?.article?.description?.color || '#374151',
    marginBottom: '16px',
  };

  const linkStyles = {
    fontFamily: `"${settings.list?.article?.link?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.list?.article?.link?.fontSize || '14px',
    color: settings.list?.article?.link?.color || '#3b82f6',
    textDecoration: 'none',
    transition: 'color 0.2s ease',
    display: 'block',
    textAlign: settings.list?.article?.link?.position || 'right',
  } as const;

  const imageWidth = settings.list?.article?.image?.width || '100%';
  const isFullWidth = imageWidth === '100%';

  const imageStyles = {
    width: imageWidth,
    aspectRatio: '16/9',
    backgroundColor: '#e5e7eb',
    marginBottom: isFullWidth ? '16px' : '0',
    flexShrink: 0,
  };

  const articleContainerStyles = {
    backgroundColor: settings.colors.modules.background,
    borderRadius: `${settings.layout.modules.borderRadius}px`,
    border: settings.colors.modules.border.height > 0
      ? `${settings.colors.modules.border.height}px solid ${settings.colors.modules.border.color}`
      : 'none',
    padding: '24px',
    marginBottom: '24px',
  };

  const articleContentStyles = {
    flex: '1',
    minWidth: 0, // Prevent flex item from overflowing
    marginLeft: !isFullWidth ? '24px' : '0',
  };

  // Sample articles for preview
  const articles = [
    {
      title: 'First Article Title',
      description: 'This is a preview of how article descriptions will look in the list view. The text length and style can be customized through the theme settings.',
    },
    {
      title: 'Second Article Title',
      description: 'Another article description to demonstrate the list layout. You can adjust fonts, colors, and spacing to match your design preferences.',
    },
    {
      title: 'Third Article Title',
      description: 'The last example article in our preview list. The read more link position and styling can be customized as needed.',
    },
  ];

  return (
    <main className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 style={listTitleStyles}>Latest Articles</h1>

        <div className="space-y-6">
          {articles.map((article, index) => (
            <article key={index} style={articleContainerStyles}>
              <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                <div style={imageStyles} />
                <div style={articleContentStyles}>
                  <h2 style={articleTitleStyles}>{article.title}</h2>
                  <p style={articleDescriptionStyles}>{article.description}</p>
                  <a
                    href="#"
                    style={linkStyles}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = settings.list?.article?.link?.hoverColor || '#2563eb';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = settings.list?.article?.link?.color || '#3b82f6';
                    }}
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ThemePreviewList;