-- Create categories table with proper UUID handling
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    subtitle VARCHAR(300),
    description TEXT,
    meta_description VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index on parent_id for better performance on hierarchical queries
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Create unique index on slug to ensure no duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug) WHERE slug IS NOT NULL;