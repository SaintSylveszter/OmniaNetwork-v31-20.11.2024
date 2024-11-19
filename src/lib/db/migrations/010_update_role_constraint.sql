-- First drop the existing constraint if it exists
ALTER TABLE admins 
DROP CONSTRAINT IF EXISTS admins_role_check;

-- Then add the new constraint
ALTER TABLE admins 
ADD CONSTRAINT admins_role_check 
CHECK (role IN ('master', 'servant'));

-- Verify existing data
UPDATE admins 
SET role = 'servant' 
WHERE role NOT IN ('master', 'servant');

-- Verify the change
DO $$
BEGIN
    ASSERT (
        SELECT COUNT(*) = 0 
        FROM admins 
        WHERE role NOT IN ('master', 'servant')
    ), 'Some admins have invalid roles';
END $$;