-- Create cookie_settings table
CREATE TABLE IF NOT EXISTS cookie_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enabled BOOLEAN DEFAULT true,
    position VARCHAR(10) DEFAULT 'bottom' CHECK (position IN ('bottom', 'top')),
    custom_message_en TEXT,
    custom_message_ro TEXT,
    accept_button_text_en VARCHAR(50),
    accept_button_text_ro VARCHAR(50),
    reject_button_text_en VARCHAR(50),
    reject_button_text_ro VARCHAR(50),
    learn_more_text_en VARCHAR(50),
    learn_more_text_ro VARCHAR(50),
    background_color VARCHAR(20) DEFAULT '#1f2937',
    text_color VARCHAR(20) DEFAULT '#ffffff',
    accept_button_color VARCHAR(20) DEFAULT '#22c55e',
    reject_button_color VARCHAR(20) DEFAULT '#4b5563',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);