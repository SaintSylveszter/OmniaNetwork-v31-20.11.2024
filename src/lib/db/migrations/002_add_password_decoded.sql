-- Add password_decoded column to admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS password_decoded VARCHAR(255);

-- Update existing admin user with decoded password
UPDATE admins 
SET password_decoded = 'admin'
WHERE username = 'admin';