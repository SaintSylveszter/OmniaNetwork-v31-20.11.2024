-- Add theme_id column to admins table
ALTER TABLE admins
ADD COLUMN theme_id UUID REFERENCES themes(id) ON DELETE SET NULL;

-- Add index for better performance
CREATE INDEX idx_admins_theme_id ON admins(theme_id);