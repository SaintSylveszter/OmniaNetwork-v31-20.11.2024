-- Create article_types table
CREATE TABLE IF NOT EXISTS article_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_id UUID REFERENCES article_types(id),
    category_id UUID REFERENCES categories(id),
    author_id UUID REFERENCES authors(id),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE,
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

-- Create article_blocks table
CREATE TABLE IF NOT EXISTS article_blocks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    block_type VARCHAR(50) NOT NULL,
    content JSONB NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    description TEXT,
    features JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_products table
CREATE TABLE IF NOT EXISTS article_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    feature_text VARCHAR(255),
    button_text VARCHAR(255),
    affiliate_url TEXT,
    brand_affiliate_url TEXT,
    custom_title TEXT,
    pros JSONB,
    cons JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_faqs table
CREATE TABLE IF NOT EXISTS article_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create article_tags table
CREATE TABLE IF NOT EXISTS article_tags (
    article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (article_id, tag_id)
);

-- Insert default article types
INSERT INTO article_types (code, name, category, description) VALUES
    ('MP_T10', 'Products Top 10', 'MONEY_PAGES', 'Top 10 product listings with affiliate links'),
    ('MP_T3', 'Products Top 3', 'MONEY_PAGES', 'Top 3 product listings with affiliate links'),
    ('MP_C', 'Products Comparison', 'MONEY_PAGES', 'Product comparison articles'),
    ('MP_R', 'Product Review', 'MONEY_PAGES', 'Single product review articles'),
    ('SP_A', 'Support Article', 'SUPPORT_PAGES', 'General articles with ad support')
ON CONFLICT (code) DO NOTHING;