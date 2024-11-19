-- Add connection_string column to admins table
ALTER TABLE admins
ADD COLUMN connection_string TEXT;