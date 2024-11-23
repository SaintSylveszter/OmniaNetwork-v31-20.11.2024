-- First remove the theme_id foreign key from admins table
ALTER TABLE admins DROP COLUMN IF EXISTS theme_id;

-- Drop theme-related tables with CASCADE to handle dependencies
DROP TABLE IF EXISTS theme_typography CASCADE;
DROP TABLE IF EXISTS theme_layout CASCADE;
DROP TABLE IF EXISTS theme_elements CASCADE;
DROP TABLE IF EXISTS themes CASCADE;