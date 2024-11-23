-- Drop theme-related tables with CASCADE if they exist
DROP TABLE IF EXISTS theme_elements CASCADE;
DROP TABLE IF EXISTS theme_typography CASCADE;
DROP TABLE IF EXISTS theme_layout CASCADE;
DROP TABLE IF EXISTS themes CASCADE;

-- Create themes table
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    settings JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX idx_themes_name ON themes(name);

-- Add constraint to ensure only one default theme
CREATE UNIQUE INDEX idx_themes_default ON themes(is_default) WHERE is_default = true;

-- Insert default theme with complete settings
INSERT INTO themes (name, settings, is_default)
VALUES (
    'Default Theme',
    '{
        "typography": {
            "body": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "16px", "mobile": "14px" },
                "lineHeight": { "desktop": "1.5", "mobile": "1.4" },
                "color": "#1F2937",
                "fontWeight": "400"
            },
            "h1": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "48px", "mobile": "32px" },
                "lineHeight": { "desktop": "1.2", "mobile": "1.2" },
                "color": "#111827",
                "fontWeight": "700"
            },
            "h2": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "36px", "mobile": "28px" },
                "lineHeight": { "desktop": "1.2", "mobile": "1.2" },
                "color": "#111827",
                "fontWeight": "700"
            },
            "h3": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "30px", "mobile": "24px" },
                "lineHeight": { "desktop": "1.3", "mobile": "1.3" },
                "color": "#111827",
                "fontWeight": "600"
            },
            "p": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "16px", "mobile": "14px" },
                "lineHeight": { "desktop": "1.5", "mobile": "1.5" },
                "color": "#374151",
                "fontWeight": "400"
            },
            "link": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "16px", "mobile": "14px" },
                "lineHeight": { "desktop": "1.5", "mobile": "1.5" },
                "color": "#2563EB",
                "fontWeight": "500"
            },
            "headerLink": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "16px", "mobile": "14px" },
                "lineHeight": { "desktop": "1.5", "mobile": "1.5" },
                "color": "#FFFFFF",
                "fontWeight": "500"
            },
            "footerLink": {
                "fontFamily": "Inter",
                "fontSize": { "desktop": "14px", "mobile": "14px" },
                "lineHeight": { "desktop": "1.5", "mobile": "1.5" },
                "color": "#9CA3AF",
                "fontWeight": "400"
            }
        },
        "layout": {
            "background": "#F3F4F6",
            "header": {
                "background": "#111827",
                "height": {
                    "desktop": "80px",
                    "mobile": "64px"
                }
            },
            "footer": {
                "background": "#1F2937",
                "height": {
                    "desktop": "320px",
                    "mobile": "480px"
                }
            }
        }
    }'::jsonb,
    true
) ON CONFLICT DO NOTHING;