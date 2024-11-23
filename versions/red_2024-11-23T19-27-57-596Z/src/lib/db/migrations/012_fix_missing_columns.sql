-- Drop existing constraints if they exist
DO $$ 
BEGIN
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_location_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_language_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_condition_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_affiliate_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_content_type_check;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Add missing columns if they don't exist
ALTER TABLE sites 
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS location VARCHAR(2),
ADD COLUMN IF NOT EXISTS language VARCHAR(2),
ADD COLUMN IF NOT EXISTS condition VARCHAR(10),
ADD COLUMN IF NOT EXISTS affiliate VARCHAR(50),
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50);

-- Add constraints
ALTER TABLE sites
ADD CONSTRAINT sites_location_check CHECK (location IS NULL OR location IN ('RO', 'US')),
ADD CONSTRAINT sites_language_check CHECK (language IS NULL OR language IN ('RO', 'EN')),
ADD CONSTRAINT sites_condition_check CHECK (condition IS NULL OR condition IN ('NEW', 'EXPIRED', 'NEW (+)')),
ADD CONSTRAINT sites_affiliate_check CHECK (affiliate IS NULL OR affiliate IN ('eMag', 'Amazon', 'ClickBank')),
ADD CONSTRAINT sites_content_type_check CHECK (content_type IS NULL OR content_type IN ('news', 'affiliate (top)', 'affiliate (reviews)', 'affiliate (all)'));