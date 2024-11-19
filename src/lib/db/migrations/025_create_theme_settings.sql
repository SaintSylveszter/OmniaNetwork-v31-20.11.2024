-- Drop existing table and indexes if they exist
DROP TABLE IF EXISTS theme_settings CASCADE;

-- Create theme_settings table with proper constraints
CREATE TABLE theme_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device VARCHAR(50) NOT NULL CHECK (device IN ('desktop', 'tablet', 'mobile')),
    settings JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create unique index on device to ensure only one setting per device type
CREATE UNIQUE INDEX idx_theme_settings_device ON theme_settings(device);

-- Create GIN index for faster JSON queries
CREATE INDEX idx_theme_settings_settings ON theme_settings USING gin(settings);

-- Add trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_theme_settings_updated_at
    BEFORE UPDATE ON theme_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();