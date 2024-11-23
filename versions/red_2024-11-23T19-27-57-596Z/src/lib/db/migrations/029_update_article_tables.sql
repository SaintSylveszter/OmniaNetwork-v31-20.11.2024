-- Update article_types table to include code field
ALTER TABLE article_types
ADD COLUMN IF NOT EXISTS code VARCHAR(10);

-- Update existing article types with codes
UPDATE article_types SET code = 'MP_T10' WHERE name = 'Products Top 10';
UPDATE article_types SET code = 'MP_T3' WHERE name = 'Products Top 3';
UPDATE article_types SET code = 'MP_C' WHERE name = 'Products Comparison';
UPDATE article_types SET code = 'MP_R' WHERE name = 'Product Review';
UPDATE article_types SET code = 'SP_A' WHERE name = 'Support Article';

-- Add unique constraint on code
ALTER TABLE article_types
ADD CONSTRAINT article_types_code_unique UNIQUE (code);