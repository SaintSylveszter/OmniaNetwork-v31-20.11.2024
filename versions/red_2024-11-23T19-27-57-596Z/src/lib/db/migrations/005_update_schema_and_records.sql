-- Update admins table
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS password_decoded VARCHAR(255),
DROP CONSTRAINT IF EXISTS admins_role_check,
ADD CONSTRAINT admins_role_check CHECK (role IN ('master', 'site', 'servant'));

-- Update sites table relationship
ALTER TABLE admins
DROP CONSTRAINT IF EXISTS admins_site_id_fkey,
ADD CONSTRAINT admins_site_id_fkey 
FOREIGN KEY (site_id) 
REFERENCES sites(id) 
ON DELETE CASCADE;

-- Update site_types table
ALTER TABLE site_types
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing admin password
UPDATE admins 
SET password_decoded = 'admin',
    role = 'master'
WHERE username = 'admin';