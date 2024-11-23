-- Create basic_pages table
CREATE TABLE IF NOT EXISTS basic_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    language VARCHAR(2) NOT NULL,
    visible BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    page_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance when ordering
CREATE INDEX idx_basic_pages_order ON basic_pages(display_order);

-- Create index for language filtering
CREATE INDEX idx_basic_pages_language ON basic_pages(language);

-- Create index for visibility filtering
CREATE INDEX idx_basic_pages_visible ON basic_pages(visible);

-- Create index for page type filtering
CREATE INDEX idx_basic_pages_type ON basic_pages(page_type);