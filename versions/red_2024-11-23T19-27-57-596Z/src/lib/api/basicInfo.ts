import { getConnection } from '../db/connections';
import type { BasicInfo } from '../../types/database';

export async function getBasicInfo(connectionString: string): Promise<BasicInfo | null> {
  try {
    const sql = getConnection(connectionString);
    const [info] = await sql<BasicInfo[]>`
      SELECT 
        meta_title,
        meta_description,
        email,
        phone,
        address,
        language
      FROM basic_info
      LIMIT 1
    `;
    return info || null;
  } catch (error) {
    console.error('Error fetching basic info:', error);
    throw new Error('Failed to fetch basic information');
  }
}

export async function saveBasicInfo(
  connectionString: string,
  data: Omit<BasicInfo, 'id' | 'created_at' | 'updated_at'>
): Promise<BasicInfo> {
  try {
    const sql = getConnection(connectionString);
    
    // Check if record exists
    const [exists] = await sql<[{ count: number }]>`
      SELECT COUNT(*) as count 
      FROM basic_info
    `;

    let result;
    if (exists.count > 0) {
      // Update existing record
      [result] = await sql<BasicInfo[]>`
        UPDATE basic_info 
        SET 
          meta_title = ${data.meta_title},
          meta_description = ${data.meta_description},
          email = ${data.email},
          phone = ${data.phone},
          address = ${data.address},
          language = ${data.language},
          updated_at = CURRENT_TIMESTAMP
        RETURNING *
      `;
    } else {
      // Insert new record
      [result] = await sql<BasicInfo[]>`
        INSERT INTO basic_info (
          meta_title,
          meta_description,
          email,
          phone,
          address,
          language
        ) VALUES (
          ${data.meta_title},
          ${data.meta_description},
          ${data.email},
          ${data.phone},
          ${data.address},
          ${data.language}
        )
        RETURNING *
      `;
    }

    return result;
  } catch (error) {
    console.error('Error saving basic info:', error);
    throw new Error('Failed to save basic information');
  }
}