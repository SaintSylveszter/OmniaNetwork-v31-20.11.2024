-- Rename content_type column to site_type
DO $$ 
BEGIN
    -- First drop the existing constraint
    ALTER TABLE sites DROP CONSTRAINT IF EXISTS sites_content_type_check;
    
    -- Rename the column
    ALTER TABLE sites RENAME COLUMN content_type TO site_type;
    
    -- Add the constraint back with the new column name
    ALTER TABLE sites ADD CONSTRAINT sites_site_type_check 
        CHECK (site_type IS NULL OR site_type IN ('news', 'affiliate (top)', 'affiliate (reviews)', 'affiliate (all)'));
EXCEPTION
    WHEN undefined_column THEN
        RAISE NOTICE 'Column content_type does not exist';
END $$;