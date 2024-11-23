-- Add password_decoded column to admins table
ALTER TABLE admins
ADD COLUMN password_decoded VARCHAR(255);