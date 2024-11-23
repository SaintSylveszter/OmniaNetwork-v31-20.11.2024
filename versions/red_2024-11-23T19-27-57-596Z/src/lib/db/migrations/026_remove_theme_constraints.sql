-- Drop triggers first
DROP TRIGGER IF EXISTS update_theme_settings_updated_at ON theme_settings;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop indexes
DROP INDEX IF EXISTS idx_theme_settings_device;
DROP INDEX IF EXISTS idx_theme_settings_settings;

-- Remove device constraint
ALTER TABLE theme_settings 
DROP CONSTRAINT IF EXISTS theme_settings_device_check;

-- Drop foreign key constraints if any exist
DO $$ 
BEGIN
    ALTER TABLE admins DROP CONSTRAINT IF EXISTS admins_theme_id_fkey;
    ALTER TABLE theme_settings DROP CONSTRAINT IF EXISTS theme_settings_pkey;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;