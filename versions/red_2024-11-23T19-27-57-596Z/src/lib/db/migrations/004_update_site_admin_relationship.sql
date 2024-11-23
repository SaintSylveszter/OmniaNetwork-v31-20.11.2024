-- Ensure site_id in admins table is properly linked
ALTER TABLE admins
DROP CONSTRAINT IF EXISTS admins_site_id_fkey,
ADD CONSTRAINT admins_site_id_fkey 
FOREIGN KEY (site_id) 
REFERENCES sites(id) 
ON DELETE CASCADE;

-- Update role type to include 'servant'
ALTER TABLE admins
DROP CONSTRAINT IF EXISTS admins_role_check,
ADD CONSTRAINT admins_role_check 
CHECK (role IN ('master', 'site', 'servant'));