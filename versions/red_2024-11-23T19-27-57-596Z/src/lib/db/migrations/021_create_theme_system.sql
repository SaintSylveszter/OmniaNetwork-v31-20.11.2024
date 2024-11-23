-- Create themes table
CREATE TABLE themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create theme_typography table for font settings
CREATE TABLE theme_typography (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    element_type VARCHAR(50) NOT NULL,
    font_id UUID REFERENCES google_fonts(id) ON DELETE SET NULL,
    font_size_desktop VARCHAR(20),
    font_size_mobile VARCHAR(20),
    line_height_desktop VARCHAR(20),
    line_height_mobile VARCHAR(20),
    font_weight VARCHAR(20),
    color VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(theme_id, element_type)
);

-- Create theme_layout table for layout settings
CREATE TABLE theme_layout (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    theme_id UUID NOT NULL REFERENCES themes(id) ON DELETE CASCADE,
    background_color VARCHAR(20),
    header_background_color VARCHAR(20),
    footer_background_color VARCHAR(20),
    header_height_desktop VARCHAR(20),
    header_height_mobile VARCHAR(20),
    footer_height_desktop VARCHAR(20),
    footer_height_mobile VARCHAR(20),
    content_max_width VARCHAR(20),
    content_padding_desktop VARCHAR(20),
    content_padding_mobile VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(theme_id)
);