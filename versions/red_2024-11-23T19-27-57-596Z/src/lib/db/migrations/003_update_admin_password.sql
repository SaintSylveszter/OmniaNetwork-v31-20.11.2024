-- Update admin password with encrypted value
UPDATE admins 
SET password_decoded = 'WlNTRkZGRkZGRg=='  -- This is 'admin' encrypted
WHERE username = 'admin';