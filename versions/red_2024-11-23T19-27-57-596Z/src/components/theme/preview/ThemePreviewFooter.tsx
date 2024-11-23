import React, { useEffect } from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemePreviewFooterProps {
  settings: ThemeSettings;
}

const ThemePreviewFooter: React.FC<ThemePreviewFooterProps> = ({ settings }) => {
  // Load Google Fonts when they're used
  useEffect(() => {
    const fonts = new Set<string>();
    
    if (settings.typography.footer.fontFamily) {
      fonts.add(settings.typography.footer.fontFamily);
    }
    
    if (settings.typography.footer.links?.fontFamily) {
      fonts.add(settings.typography.footer.links.fontFamily);
    }

    if (settings.typography.footer.copyright?.fontFamily) {
      fonts.add(settings.typography.footer.copyright.fontFamily);
    }

    fonts.forEach(fontFamily => {
      if (!document.querySelector(`link[href*="${fontFamily}"]`)) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css?family=${fontFamily.replace(/\s+/g, '+')}`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, [
    settings.typography.footer.fontFamily,
    settings.typography.footer.links?.fontFamily,
    settings.typography.footer.copyright?.fontFamily
  ]);

  const footerStyles = {
    height: settings.layout.footer.height,
    backgroundColor: settings.colors.footer.background,
    borderTop: settings.colors.footer.borderTop.height > 0
      ? `${settings.colors.footer.borderTop.height}px solid ${settings.colors.footer.borderTop.color}`
      : 'none',
    fontFamily: `"${settings.typography.footer.fontFamily}", sans-serif`,
    fontSize: settings.typography.footer.fontSize,
    color: settings.typography.footer.color,
    display: 'flex',
    flexDirection: 'column' as const,
  };

  const linkStyles = {
    fontFamily: `"${settings.typography.footer.links?.fontFamily || settings.typography.footer.fontFamily}", sans-serif`,
    fontSize: settings.typography.footer.links?.fontSize || '14px',
    color: settings.typography.footer.links?.color || '#9CA3AF',
    transition: 'color 0.2s ease',
  };

  const linkHoverStyles = {
    color: settings.typography.footer.links?.hoverColor || '#F3F4F6',
  };

  const copyrightStyles = {
    fontFamily: `"${settings.typography.footer.copyright?.fontFamily || settings.typography.footer.fontFamily}", sans-serif`,
    fontSize: settings.typography.footer.copyright?.fontSize || '14px',
    color: settings.typography.footer.copyright?.color || '#9CA3AF',
    marginTop: 'auto',
    paddingTop: '1rem',
    paddingBottom: '1rem',
  };

  return (
    <footer style={footerStyles}>
      <div className="flex-1 px-6 pt-6">
        <div className="max-w-4xl mx-auto grid grid-cols-4 gap-x-8 gap-y-4">
          <div>
            <h3 className="font-bold mb-2">About</h3>
            <ul className="space-y-1">
              {['Our Story', 'Team'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={linkStyles}
                    className="hover:text-opacity-80 transition-opacity"
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = linkHoverStyles.color;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = linkStyles.color;
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">Services</h3>
            <ul className="space-y-1">
              {['Web Design', 'Development'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={linkStyles}
                    className="hover:text-opacity-80 transition-opacity"
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = linkHoverStyles.color;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = linkStyles.color;
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">Support</h3>
            <ul className="space-y-1">
              {['Help Center', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={linkStyles}
                    className="hover:text-opacity-80 transition-opacity"
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = linkHoverStyles.color;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = linkStyles.color;
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-2">Legal</h3>
            <ul className="space-y-1">
              {['Privacy', 'Terms'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={linkStyles}
                    className="hover:text-opacity-80 transition-opacity"
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = linkHoverStyles.color;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = linkStyles.color;
                    }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-center" style={copyrightStyles}>
        © 2024 Your Company. All rights reserved.
      </div>
    </footer>
  );
};

export default ThemePreviewFooter;