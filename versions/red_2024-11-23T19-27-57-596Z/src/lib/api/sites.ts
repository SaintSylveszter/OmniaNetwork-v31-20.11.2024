import sql from '../db/neon';
import type { Site } from '../../types/database';

interface CreateSiteData {
  url: string;
  site_type_id: string;
  server_id: string;
  year?: number;
  location?: string;
  language?: string;
  condition?: string;
  affiliate?: string;
}

export async function getSites(): Promise<Site[]> {
  try {
    const sites = await sql<Site[]>`
      SELECT 
        s.*,
        st.name as site_type_name,
        srv.name as server_name,
        srv.ip_address
      FROM sites s
      LEFT JOIN site_types st ON s.site_type_id = st.id
      LEFT JOIN servers srv ON s.server_id = srv.id
      ORDER BY s.created_at DESC
    `;
    return sites;
  } catch (error) {
    console.error('Error fetching sites:', error);
    throw new Error('Failed to fetch sites');
  }
}

export async function createSite(data: CreateSiteData): Promise<Site> {
  try {
    const [newSite] = await sql<Site[]>`
      INSERT INTO sites (
        url,
        site_type_id,
        server_id,
        year,
        location,
        language,
        condition,
        affiliate
      ) VALUES (
        ${data.url},
        ${data.site_type_id},
        ${data.server_id},
        ${data.year || null},
        ${data.location || null},
        ${data.language || null},
        ${data.condition || null},
        ${data.affiliate || null}
      )
      RETURNING *
    `;

    // Fetch the complete site data with joined fields
    const [siteWithDetails] = await sql<Site[]>`
      SELECT 
        s.*,
        st.name as site_type_name,
        srv.name as server_name,
        srv.ip_address
      FROM sites s
      LEFT JOIN site_types st ON s.site_type_id = st.id
      LEFT JOIN servers srv ON s.server_id = srv.id
      WHERE s.id = ${newSite.id}
    `;

    return siteWithDetails;
  } catch (error) {
    console.error('Error creating site:', error);
    throw new Error('Failed to create site');
  }
}

export async function updateSite(id: string, data: CreateSiteData): Promise<Site> {
  try {
    await sql`
      UPDATE sites 
      SET 
        url = ${data.url},
        site_type_id = ${data.site_type_id},
        server_id = ${data.server_id},
        year = ${data.year || null},
        location = ${data.location || null},
        language = ${data.language || null},
        condition = ${data.condition || null},
        affiliate = ${data.affiliate || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `;

    // Fetch the updated site with joined fields
    const [updatedSite] = await sql<Site[]>`
      SELECT 
        s.*,
        st.name as site_type_name,
        srv.name as server_name,
        srv.ip_address
      FROM sites s
      LEFT JOIN site_types st ON s.site_type_id = st.id
      LEFT JOIN servers srv ON s.server_id = srv.id
      WHERE s.id = ${id}
    `;

    if (!updatedSite) {
      throw new Error('Site not found after update');
    }

    return updatedSite;
  } catch (error) {
    console.error('Error updating site:', error);
    throw new Error('Failed to update site');
  }
}

export async function deleteSite(id: string): Promise<void> {
  try {
    await sql`DELETE FROM sites WHERE id = ${id}`;
  } catch (error) {
    console.error('Error deleting site:', error);
    throw new Error('Failed to delete site');
  }
}