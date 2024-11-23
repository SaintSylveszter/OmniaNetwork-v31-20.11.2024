-- Create social_media table
CREATE TABLE IF NOT EXISTS social_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    twitter TEXT,
    instagram TEXT,
    facebook TEXT,
    tiktok TEXT,
    youtube TEXT,
    linkedin TEXT,
    pinterest TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);