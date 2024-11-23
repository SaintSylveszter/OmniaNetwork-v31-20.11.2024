-- Recreate articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_id UUID,
    category_id UUID,
    author_id UUID,
    title VARCHAR(255),
    slug VARCHAR(255),
    subtitle TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    intro_text TEXT,
    content TEXT,
    status VARCHAR(20) DEFAULT 'draft',
    show_reviews BOOLEAN DEFAULT false,
    affiliate_button_text VARCHAR(255),
    best_of_prefix VARCHAR(255),
    product_type VARCHAR(255),
    disclosure TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_sections table for additional custom sections
CREATE TABLE IF NOT EXISTS article_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    title TEXT,
    content TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_products table
CREATE TABLE IF NOT EXISTS article_products (
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

-- Create article_faqs table
CREATE TABLE IF NOT EXISTS article_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID,
    question TEXT,
    answer TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_tags table
CREATE TABLE IF NOT EXISTS article_tags (
    article_id UUID,
    tag_id UUID,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (article_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX idx_articles_type ON articles(type_id);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_article_sections_article ON article_sections(article_id);
CREATE INDEX idx_article_sections_order ON article_sections(display_order);
CREATE INDEX idx_article_products_article ON article_products(article_id);
CREATE INDEX idx_article_products_order ON article_products(display_order);
CREATE INDEX idx_article_faqs_article ON article_faqs(article_id);
CREATE INDEX idx_article_faqs_order ON article_faqs(display_order);