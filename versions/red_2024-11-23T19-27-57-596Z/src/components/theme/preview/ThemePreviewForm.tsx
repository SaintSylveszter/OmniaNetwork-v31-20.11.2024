import React, { useEffect } from 'react';
import type { ThemeSettings } from '../../../types/theme';

interface ThemePreviewFormProps {
  settings: ThemeSettings;
}

const ThemePreviewForm: React.FC<ThemePreviewFormProps> = ({ settings }) => {
  // Load Google Fonts when they're used
  useEffect(() => {
    const fonts = new Set<string>();
    
    if (settings.form?.label?.fontFamily) {
      fonts.add(settings.form.label.fontFamily);
    }
    
    if (settings.form?.input?.fontFamily) {
      fonts.add(settings.form.input.fontFamily);
    }

    if (settings.form?.submit?.fontFamily) {
      fonts.add(settings.form.submit.fontFamily);
    }

    fonts.forEach(fontFamily => {
      if (!document.querySelector(`link[href*="${fontFamily}"]`)) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css?family=${fontFamily.replace(/\s+/g, '+')}`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    });
  }, [settings.form?.label?.fontFamily, settings.form?.input?.fontFamily, settings.form?.submit?.fontFamily]);

  const formStyles = {
    backgroundColor: settings.form?.backgroundColor || '#ffffff',
    border: settings.form?.borderHeight > 0
      ? `${settings.form.borderHeight}px solid ${settings.form.borderColor}`
      : 'none',
    borderRadius: `${settings.form?.borderRadius || 4}px`,
    padding: '24px',
    maxWidth: '500px',
    margin: '0 auto',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '8px',
    fontFamily: `"${settings.form?.label?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.form?.label?.fontSize || '14px',
    color: settings.form?.label?.color || '#374151',
  };

  const inputStyles = {
    width: '100%',
    padding: `${settings.form?.input?.padding || 8}px`,
    marginBottom: '16px',
    border: settings.form?.input?.borderHeight > 0
      ? `${settings.form.input.borderHeight}px solid ${settings.form.input.borderColor}`
      : 'none',
    borderRadius: `${settings.form?.input?.borderRadius || 4}px`,
    fontFamily: `"${settings.form?.input?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.form?.input?.fontSize || '14px',
    color: settings.form?.input?.color || '#374151',
    backgroundColor: '#ffffff',
  };

  const textareaStyles = {
    ...inputStyles,
    minHeight: '120px',
    resize: 'vertical' as const,
  };

  const buttonStyles = {
    width: '100%',
    padding: `${settings.form?.submit?.padding || 8}px`,
    border: settings.form?.submit?.borderHeight > 0
      ? `${settings.form.submit.borderHeight}px solid ${settings.form.submit.borderColor}`
      : 'none',
    borderRadius: `${settings.form?.submit?.borderRadius || 4}px`,
    backgroundColor: settings.form?.submit?.backgroundColor || '#3b82f6',
    color: settings.form?.submit?.color || '#ffffff',
    fontFamily: `"${settings.form?.submit?.fontFamily || 'Arial'}", sans-serif`,
    fontSize: settings.form?.submit?.fontSize || '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <form style={formStyles} onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label htmlFor="name" style={labelStyles}>
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Your name"
              style={inputStyles}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" style={labelStyles}>
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="your.email@example.com"
              style={inputStyles}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="message" style={labelStyles}>
              Message
            </label>
            <textarea
              id="message"
              placeholder="Your message"
              style={textareaStyles}
            />
          </div>

          <button
            type="submit"
            style={buttonStyles}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = settings.form?.submit?.hoverBackgroundColor || '#2563eb';
              e.currentTarget.style.color = settings.form?.submit?.hoverColor || '#ffffff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = settings.form?.submit?.backgroundColor || '#3b82f6';
              e.currentTarget.style.color = settings.form?.submit?.color || '#ffffff';
            }}
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ThemePreviewForm;