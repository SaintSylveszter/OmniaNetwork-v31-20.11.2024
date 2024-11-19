import React, { useEffect } from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemePreviewHeaderProps {
  settings: ThemeSettings;
}

const ThemePreviewHeader: React.FC<ThemePreviewHeaderProps> = ({ settings }) => {
  // Load Google Fonts when they're used
  useEffect(() => {
    const fonts = new Set<string>();
    
    // Check logo font
    if (settings.typography.header.logo?.fontFamily) {
      fonts.add(settings.typography.header.logo.fontFamily);
    }
    
    // Check links font
    if (settings.typography.header.links?.fontFamily) {
      fonts.add(settings.typography.header.links.fontFamily);
    }

    // Load each unique font
    fonts.forEach(fontFamily => {
      if (!document.querySelector(`link[href*="${fontFamily}"]`)) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css?family=${fontFamily.replace(/\s+/g, '+')}`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, [settings.typography.header.logo?.fontFamily, settings.typography.header.links?.fontFamily]);

  const headerStyles = {
    height: settings.layout.header.height,
    backgroundColor: settings.colors.header.background,
    borderBottom: settings.colors.header.borderBottom.height > 0
      ? `${settings.colors.header.borderBottom.height}px solid ${settings.colors.header.borderBottom.color}`
      : 'none',
  };

  const logoStyles = {
    fontFamily: `"${settings.typography.header.logo?.fontFamily || settings.typography.header.fontFamily}", sans-serif`,
    fontSize: settings.typography.header.logo?.fontSize || '24px',
    color: settings.typography.header.logo?.color || settings.typography.header.color,
  };

  const linkStyles = {
    fontFamily: `"${settings.typography.header.links?.fontFamily || settings.typography.header.fontFamily}", sans-serif`,
    fontSize: settings.typography.header.links?.fontSize || '16px',
    color: settings.typography.header.links?.color || settings.typography.header.color,
    transition: 'color 0.2s ease',
  };

  const linkHoverStyles = {
    color: settings.typography.header.links?.hoverColor || '#ffffff',
  };

  return (
    <header style={headerStyles} className="px-6 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <h1 style={logoStyles} className="font-bold">Site Logo</h1>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a 
                href="#" 
                style={linkStyles}
                className="hover:opacity-80 transition-opacity"
                onMouseOver={(e) => {
                  e.currentTarget.style.color = linkHoverStyles.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = linkStyles.color;
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#" 
                style={linkStyles}
                className="hover:opacity-80 transition-opacity"
                onMouseOver={(e) => {
                  e.currentTarget.style.color = linkHoverStyles.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = linkStyles.color;
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#" 
                style={linkStyles}
                className="hover:opacity-80 transition-opacity"
                onMouseOver={(e) => {
                  e.currentTarget.style.color = linkHoverStyles.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = linkStyles.color;
                }}
              >
                Services
              </a>
            </li>
            <li>
              <a 
                href="#" 
                style={linkStyles}
                className="hover:opacity-80 transition-opacity"
                onMouseOver={(e) => {
                  e.currentTarget.style.color = linkHoverStyles.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = linkStyles.color;
                }}
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default ThemePreviewHeader;