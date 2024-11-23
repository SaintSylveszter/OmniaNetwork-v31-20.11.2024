-- Add new columns to sites table
ALTER TABLE sites
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS location VARCHAR(2),
ADD COLUMN IF NOT EXISTS language VARCHAR(2),
ADD COLUMN IF NOT EXISTS condition VARCHAR(10),
ADD COLUMN IF NOT EXISTS affiliate VARCHAR(50),
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50);

-- Add check constraints
ALTER TABLE sites
ADD CONSTRAINT sites_location_check CHECK (location IN ('RO', 'US')),
ADD CONSTRAINT sites_language_check CHECK (language IN ('RO', 'EN')),
ADD CONSTRAINT sites_condition_check CHECK (condition IN ('NEW', 'EXPIRED', 'NEW (+)')),
ADD CONSTRAINT sites_affiliate_check CHECK (affiliate IN ('eMag', 'Amazon', 'ClickBank')),
ADD CONSTRAINT sites_content_type_check CHECK (content_type IN ('news', 'affiliate (top)', 'affiliate (reviews)', 'affiliate (all)'));