-- Create basic_info table
CREATE TABLE IF NOT EXISTS basic_info (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meta_title VARCHAR(255) NOT NULL,
    meta_description TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    language VARCHAR(2) NOT NULL CHECK (language IN ('RO', 'EN')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);