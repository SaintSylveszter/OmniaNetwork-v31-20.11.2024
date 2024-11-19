import sql from '../db/neon';
import type { SiteType } from '../../types/database';

export async function getSiteTypes(): Promise<SiteType[]> {
  try {
    const types = await sql<SiteType[]>`
      SELECT * FROM site_types 
      ORDER BY name ASC
    `;
    return types;
  } catch (error) {
    console.error('Error fetching site types:', error);
    throw new Error('Failed to fetch site types');
  }
}

export async function createSiteType(data: { name: string; description?: string }): Promise<SiteType> {
  try {
    const [type] = await sql<SiteType[]>`
      INSERT INTO site_types (name, description)
      VALUES (${data.name}, ${data.description})
      RETURNING *
    `;
    return type;
  } catch (error) {
    console.error('Error creating site type:', error);
    throw new Error('Failed to create site type');
  }
}

export async function updateSiteType(id: string, data: { name: string; description?: string }): Promise<SiteType> {
  try {
    const [type] = await sql<SiteType[]>`
      UPDATE site_types 
      SET name = ${data.name},
          description = ${data.description},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `;
    return type;
  } catch (error) {
    console.error('Error updating site type:', error);
    throw new Error('Failed to update site type');
  }
}

export async function deleteSiteType(id: string): Promise<void> {
  try {
    // First check if any sites are using this type
    const [site] = await sql`
      SELECT s.id
      FROM sites s
      WHERE s.site_type_id = ${id}
      LIMIT 1
    `;

    if (site) {
      throw new Error('Cannot delete this site type because it is being used by one or more sites');
    }

    await sql`
      DELETE FROM site_types 
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Error deleting site type:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete site type');
  }
}