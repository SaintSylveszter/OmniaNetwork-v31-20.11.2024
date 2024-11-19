-- First, let's make sure we can modify the table
DO $$ 
BEGIN
    -- Drop existing constraints if they exist
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_location_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_language_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_condition_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_affiliate_check;
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_content_type_check;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Now add all required columns if they don't exist
DO $$ 
BEGIN
    -- Add content_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'content_type') THEN
        ALTER TABLE sites ADD COLUMN content_type VARCHAR(50);
    END IF;

    -- Add year column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'year') THEN
        ALTER TABLE sites ADD COLUMN year INTEGER;
    END IF;

    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'location') THEN
        ALTER TABLE sites ADD COLUMN location VARCHAR(2);
    END IF;

    -- Add language column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'language') THEN
        ALTER TABLE sites ADD COLUMN language VARCHAR(2);
    END IF;

    -- Add condition column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'condition') THEN
        ALTER TABLE sites ADD COLUMN condition VARCHAR(10);
    END IF;

    -- Add affiliate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'affiliate') THEN
        ALTER TABLE sites ADD COLUMN affiliate VARCHAR(50);
    END IF;
END $$;

-- Add constraints back
ALTER TABLE sites
ADD CONSTRAINT sites_location_check 
    CHECK (location IS NULL OR location IN ('RO', 'US')),
ADD CONSTRAINT sites_language_check 
    CHECK (language IS NULL OR language IN ('RO', 'EN')),
ADD CONSTRAINT sites_condition_check 
    CHECK (condition IS NULL OR condition IN ('NEW', 'EXPIRED', 'NEW (+)')),
ADD CONSTRAINT sites_affiliate_check 
    CHECK (affiliate IS NULL OR affiliate IN ('eMag', 'Amazon', 'ClickBank')),
ADD CONSTRAINT sites_content_type_check 
    CHECK (content_type IS NULL OR content_type IN ('news', 'affiliate (top)', 'affiliate (reviews)', 'affiliate (all)'));

-- Verify the columns exist
DO $$ 
BEGIN
    ASSERT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'content_type'), 
           'content_type column is missing';
    ASSERT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'year'), 
           'year column is missing';
    ASSERT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'location'), 
           'location column is missing';
    ASSERT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'language'), 
           'language column is missing';
    ASSERT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'condition'), 
           'condition column is missing';
    ASSERT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'sites' AND column_name = 'affiliate'), 
           'affiliate column is missing';
END $$;