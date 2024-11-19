-- Create themes table
CREATE TABLE IF NOT EXISTS themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    settings JSONB NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add theme_id to admins table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'admins' AND column_name = 'theme_id'
    ) THEN
        ALTER TABLE admins ADD COLUMN theme_id UUID REFERENCES themes(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Create index on theme_id
CREATE INDEX IF NOT EXISTS idx_admins_theme_id ON admins(theme_id);

-- Insert default theme
INSERT INTO themes (
    name,
    description,
    settings,
    is_default
) VALUES (
    'Default Theme',
    'Default system theme',
    '{
        "colors": {
            "primary": "#1a56db",
            "secondary": "#7c3aed",
            "background": "#ffffff",
            "text": "#111827",
            "headerBg": "#1f2937",
            "headerText": "#ffffff",
            "footerBg": "#1f2937",
            "footerText": "#ffffff"
        },
        "typography": {
            "body": {
                "fontFamily": "Inter",
                "fontSize": "16px",
                "lineHeight": "1.5",
                "fontWeight": "400"
            },
            "h1": {
                "fontFamily": "Inter",
                "fontSize": "36px",
                "lineHeight": "1.2",
                "fontWeight": "700"
            },
            "h2": {
                "fontFamily": "Inter",
                "fontSize": "30px",
                "lineHeight": "1.3",
                "fontWeight": "700"
            },
            "h3": {
                "fontFamily": "Inter",
                "fontSize": "24px",
                "lineHeight": "1.4",
                "fontWeight": "600"
            },
            "h4": {
                "fontFamily": "Inter",
                "fontSize": "20px",
                "lineHeight": "1.4",
                "fontWeight": "600"
            },
            "h5": {
                "fontFamily": "Inter",
                "fontSize": "18px",
                "lineHeight": "1.5",
                "fontWeight": "600"
            },
            "h6": {
                "fontFamily": "Inter",
                "fontSize": "16px",
                "lineHeight": "1.5",
                "fontWeight": "600"
            }
        },
        "layout": {
            "headerHeight": "64px",
            "footerHeight": "64px",
            "maxWidth": "1280px",
            "spacing": {
                "xs": "4px",
                "sm": "8px",
                "md": "16px",
                "lg": "24px",
                "xl": "32px"
            }
        },
        "responsive": {
            "breakpoints": {
                "sm": "640px",
                "md": "768px",
                "lg": "1024px",
                "xl": "1280px"
            }
        }
    }'::jsonb,
    true
) ON CONFLICT DO NOTHING;