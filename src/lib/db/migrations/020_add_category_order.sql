-- Add display_order column to categories table
ALTER TABLE categories
ADD COLUMN display_order INTEGER DEFAULT 0;

-- Create index for better performance when ordering
CREATE INDEX idx_categories_display_order ON categories(display_order);

-- Initialize display_order for existing categories based on creation date
WITH ordered_categories AS (
  SELECT id, ROW_NUMBER() OVER (
    PARTITION BY parent_id 
    ORDER BY created_at ASC
  ) * 10 as new_order
  FROM categories
)
UPDATE categories c
SET display_order = oc.new_order
FROM ordered_categories oc
WHERE c.id = oc.id;