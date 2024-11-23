-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    settings JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_themes_name ON themes(name);

-- Add constraint to ensure only one default theme
CREATE UNIQUE INDEX IF NOT EXISTS idx_themes_default ON themes(is_default) WHERE is_default = true;

-- Insert default theme
INSERT INTO themes (name, settings, is_default)
VALUES (
    'Default Theme',
    '{
        "typography": {
            "body": {
                "fontFamily": "Inter",
                "fontSize": "16px",
                "lineHeight": "1.5",
                "color": "#1F2937"
            },
            "headings": {
                "h1": {
                    "fontFamily": "Inter",
                    "fontSize": "2.5rem",
                    "lineHeight": "1.2",
                    "color": "#111827"
                },
                "h2": {
                    "fontFamily": "Inter",
                    "fontSize": "2rem",
                    "lineHeight": "1.3",
                    "color": "#111827"
                },
                "h3": {
                    "fontFamily": "Inter",
                    "fontSize": "1.75rem",
                    "lineHeight": "1.4",
                    "color": "#111827"
                },
                "h4": {
                    "fontFamily": "Inter",
                    "fontSize": "1.5rem",
                    "lineHeight": "1.4",
                    "color": "#111827"
                },
                "h5": {
                    "fontFamily": "Inter",
                    "fontSize": "1.25rem",
                    "lineHeight": "1.4",
                    "color": "#111827"
                },
                "h6": {
                    "fontFamily": "Inter",
                    "fontSize": "1rem",
                    "lineHeight": "1.4",
                    "color": "#111827"
                }
            },
            "links": {
                "default": {
                    "color": "#3B82F6",
                    "hoverColor": "#2563EB"
                },
                "header": {
                    "color": "#F9FAFB",
                    "hoverColor": "#F3F4F6"
                },
                "footer": {
                    "color": "#9CA3AF",
                    "hoverColor": "#F3F4F6"
                }
            }
        },
        "layout": {
            "header": {
                "height": "64px",
                "background": "#1F2937"
            },
            "footer": {
                "height": "200px",
                "background": "#111827"
            },
            "content": {
                "maxWidth": "1280px",
                "background": "#FFFFFF"
            },
            "sidebar": {
                "width": "256px",
                "background": "#F3F4F6"
            }
        }
    }'::jsonb,
    true
) ON CONFLICT DO NOTHING;