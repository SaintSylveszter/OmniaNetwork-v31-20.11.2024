-- Create article_mp_t10 table
CREATE TABLE IF NOT EXISTS article_mp_t10 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255),
    url_slug VARCHAR(255),
    category_id UUID,
    author_id UUID,
    disclosure TEXT,
    best_of_prefix VARCHAR(50),
    product_type VARCHAR(255),
    affiliate_button_text VARCHAR(100),
    show_reviews BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'scheduled',
    content TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    og_title VARCHAR(255),
    og_description TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_mp_t10_sections table for additional custom sections
CREATE TABLE IF NOT EXISTS article_mp_t10_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    title TEXT,
    content TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_mp_t10_products table
CREATE TABLE IF NOT EXISTS article_mp_t10_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    name VARCHAR(255),
    image_url TEXT,
    description TEXT,
    pros JSONB,
    cons JSONB,
    affiliate_url TEXT,
    brand_affiliate_url TEXT,
    rating DECIMAL(2,1),
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_article_mp_t10_url_slug ON article_mp_t10(url_slug);
CREATE INDEX idx_article_mp_t10_status ON article_mp_t10(status);
CREATE INDEX idx_article_mp_t10_category ON article_mp_t10(category_id);
CREATE INDEX idx_article_mp_t10_author ON article_mp_t10(author_id);
CREATE INDEX idx_article_mp_t10_sections_article ON article_mp_t10_sections(article_id);
CREATE INDEX idx_article_mp_t10_sections_order ON article_mp_t10_sections(display_order);
CREATE INDEX idx_article_mp_t10_products_article ON article_mp_t10_products(article_id);
CREATE INDEX idx_article_mp_t10_products_order ON article_mp_t10_products(display_order);