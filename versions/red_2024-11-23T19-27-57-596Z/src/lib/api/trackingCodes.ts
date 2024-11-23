import sql from '../db/neon';
import type { TrackingData } from '../../types/database';

export async function getTrackingCodes(connectionString: string): Promise<TrackingData | null> {
  try {
    const sql = getConnection(connectionString);
    const [codes] = await sql<TrackingData[]>`
      SELECT 
        google_search_console,
        google_analytics,
        google_adsense,
        google_ads,
        recaptcha_public,
        recaptcha_secret
      FROM tracking_codes
      LIMIT 1
    `;
    return codes || null;
  } catch (error) {
    console.error('Error fetching tracking codes:', error);
    throw new Error('Failed to fetch tracking codes');
  }
}

export async function saveTrackingCodes(
  connectionString: string,
  data: TrackingData
): Promise<TrackingData> {
  try {
    const sql = getConnection(connectionString);
    
    // Check if record exists
    const [exists] = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count 
      FROM tracking_codes
    `;

    let result;
    if (exists.count > 0) {
      // Update existing record
      [result] = await sql<TrackingData[]>`
        UPDATE tracking_codes 
        SET 
          google_search_console = ${data.google_search_console},
          google_analytics = ${data.google_analytics},
          google_adsense = ${data.google_adsense},
          google_ads = ${data.google_ads},
          recaptcha_public = ${data.recaptcha_public},
          recaptcha_secret = ${data.recaptcha_secret},
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
    } else {
      // Insert new record
      [result] = await sql<TrackingData[]>`
        INSERT INTO tracking_codes (
          google_search_console,
          google_analytics,
          google_adsense,
          google_ads,
          recaptcha_public,
          recaptcha_secret
        ) VALUES (
          ${data.google_search_console},
          ${data.google_analytics},
          ${data.google_adsense},
          ${data.google_ads},
          ${data.recaptcha_public},
          ${data.recaptcha_secret}
        )
        RETURNING *
      `;
    }

    return result;
  } catch (error) {
    console.error('Error saving tracking codes:', error);
    throw new Error('Failed to save tracking codes');
  }
}