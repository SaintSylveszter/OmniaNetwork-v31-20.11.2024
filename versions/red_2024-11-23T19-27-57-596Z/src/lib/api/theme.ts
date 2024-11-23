import { getConnection } from '../db/connections';
import type { ThemeSettings } from '../../types/theme';

export async function getThemeSettings(connectionString: string): Promise<ThemeSettings | null> {
  try {
    const sql = getConnection(connectionString);
    
    // First ensure the table exists
    await sql`
      CREATE TABLE IF NOT EXISTS theme_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        device VARCHAR(50) NOT NULL,
        settings JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const [theme] = await sql`
      SELECT settings::jsonb as settings
      FROM theme_settings
      WHERE device = 'desktop'
      LIMIT 1
    `;

    return theme?.settings || null;
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    throw new Error('Failed to fetch theme settings');
  }
}

export async function saveThemeSettings(
  connectionString: string,
  settings: ThemeSettings
): Promise<void> {
  try {
    const sql = getConnection(connectionString);
    
    // First ensure the table exists
    await sql`
      CREATE TABLE IF NOT EXISTS theme_settings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        device VARCHAR(50) NOT NULL,
        settings JSONB NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if a record exists
    const [existing] = await sql`
      SELECT id FROM theme_settings WHERE device = 'desktop'
    `;

    if (existing) {
      // Update existing record
      await sql`
        UPDATE theme_settings 
        SET settings = ${JSON.stringify(settings)}::jsonb,
            updated_at = CURRENT_TIMESTAMP
        WHERE device = 'desktop'
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO theme_settings (device, settings)
        VALUES ('desktop', ${JSON.stringify(settings)}::jsonb)
      `;
    }
  } catch (error) {
    console.error('Error saving theme settings:', error);
    throw new Error('Failed to save theme settings');
  }
}