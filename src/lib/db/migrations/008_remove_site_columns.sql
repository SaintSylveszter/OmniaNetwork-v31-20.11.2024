-- Remove site-related columns from admins table
ALTER TABLE admins
DROP COLUMN site_id,
DROP COLUMN site;