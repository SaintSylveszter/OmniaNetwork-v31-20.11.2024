-- Populate admin records for existing sites
INSERT INTO admins (
  username,
  email,
  password_decoded,
  role,
  site_id,
  status
)
SELECT 
  s.name as username,
  CONCAT(s.name, '@', REPLACE(REPLACE(s.url, 'https://', ''), 'www.', '')) as email,
  s.db_password as password_decoded,
  'servant' as role,
  s.id as site_id,
  'active' as status
FROM sites s
WHERE NOT EXISTS (
  SELECT 1 
  FROM admins a 
  WHERE a.site_id = s.id
);