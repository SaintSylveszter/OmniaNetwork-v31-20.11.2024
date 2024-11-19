-- Create tracking_codes table
CREATE TABLE IF NOT EXISTS tracking_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_search_console TEXT,
    google_analytics TEXT,
    google_adsense TEXT,
    google_ads TEXT,
    recaptcha_public TEXT,
    recaptcha_secret TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);