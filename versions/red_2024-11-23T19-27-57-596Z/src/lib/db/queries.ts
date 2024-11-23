import sql from './neon';
import type { Site, SiteType, Server, Admin, ActivityLog } from '../../types/database';

// Site Types
export async function getSiteTypes(): Promise<SiteType[]> {
  return await sql<SiteType[]>`
    SELECT * FROM site_types 
    ORDER BY name ASC
  `;
}

export async function createSiteType(name: string): Promise<SiteType> {
  const [siteType] = await sql<SiteType[]>`
    INSERT INTO site_types (name)
    VALUES (${name})
    RETURNING *
  `;
  return siteType;
}

export async function updateSiteType(id: string, name: string): Promise<SiteType> {
  const [siteType] = await sql<SiteType[]>`
    UPDATE site_types 
    SET name = ${name},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return siteType;
}

export async function deleteSiteType(id: string): Promise<void> {
  await sql`DELETE FROM site_types WHERE id = ${id}`;
}

// Servers
export async function getServers(): Promise<Server[]> {
  return await sql<Server[]>`
    SELECT * FROM servers 
    ORDER BY name ASC
  `;
}

export async function createServer(name: string, ip: string): Promise<Server> {
  const [server] = await sql<Server[]>`
    INSERT INTO servers (name, hostname, ip_address)
    VALUES (${name}, ${name}, ${ip})
    RETURNING *
  `;
  return server;
}

export async function updateServer(id: string, name: string, ip: string): Promise<Server> {
  const [server] = await sql<Server[]>`
    UPDATE servers 
    SET name = ${name},
        hostname = ${name},
        ip_address = ${ip},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return server;
}

export async function deleteServer(id: string): Promise<void> {
  await sql`DELETE FROM servers WHERE id = ${id}`;
}

// Sites
export async function getSites(): Promise<Site[]> {
  return await sql<Site[]>`
    SELECT s.*, st.name as site_type_name, srv.name as server_name
    FROM sites s
    JOIN site_types st ON s.site_type_id = st.id
    JOIN servers srv ON s.server_id = srv.id
    ORDER BY s.created_at DESC
  `;
}

export async function createSite(data: {
  name: string;
  url: string;
  server: string;
  type: string;
  password: string;
}): Promise<Site> {
  // Get site type ID
  const [siteType] = await sql<SiteType[]>`
    SELECT id FROM site_types WHERE name = ${data.type} LIMIT 1
  `;

  // Get server ID
  const [server] = await sql<Server[]>`
    SELECT id FROM servers WHERE name = ${data.server} LIMIT 1
  `;

  if (!siteType || !server) {
    throw new Error('Site type or server not found');
  }

  const [site] = await sql<Site[]>`
    INSERT INTO sites (
      name, url, site_type_id, server_id, 
      database_name, db_user, db_password, db_port, status
    ) VALUES (
      ${data.name},
      ${data.url},
      ${siteType.id},
      ${server.id},
      ${'db_' + data.name.toLowerCase()},
      ${data.name.toLowerCase() + '_user'},
      ${data.password},
      ${5432},
      'active'
    )
    RETURNING *
  `;
  return site;
}

export async function updateSite(id: string, data: {
  name: string;
  url: string;
  server: string;
  type: string;
  password: string;
}): Promise<Site> {
  // Get site type ID
  const [siteType] = await sql<SiteType[]>`
    SELECT id FROM site_types WHERE name = ${data.type} LIMIT 1
  `;

  // Get server ID
  const [server] = await sql<Server[]>`
    SELECT id FROM servers WHERE name = ${data.server} LIMIT 1
  `;

  if (!siteType || !server) {
    throw new Error('Site type or server not found');
  }

  const [site] = await sql<Site[]>`
    UPDATE sites 
    SET name = ${data.name},
        url = ${data.url},
        site_type_id = ${siteType.id},
        server_id = ${server.id},
        db_password = ${data.password},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return site;
}

export async function deleteSite(id: string): Promise<void> {
  await sql`DELETE FROM sites WHERE id = ${id}`;
}

// Activity Logs
export async function logActivity(data: {
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  details?: Record<string, any>;
  ip_address?: string;
}): Promise<ActivityLog> {
  const [log] = await sql<ActivityLog[]>`
    INSERT INTO activity_logs (
      admin_id, action, entity_type, entity_id, details, ip_address
    ) VALUES (
      ${data.admin_id},
      ${data.action},
      ${data.entity_type},
      ${data.entity_id},
      ${data.details ? JSON.stringify(data.details) : null},
      ${data.ip_address}
    )
    RETURNING *
  `;
  return log;
}

export async function getRecentActivities(limit: number = 50): Promise<ActivityLog[]> {
  return await sql<ActivityLog[]>`
    SELECT al.*, a.username as admin_username
    FROM activity_logs al
    JOIN admins a ON al.admin_id = a.id
    ORDER BY al.created_at DESC
    LIMIT ${limit}
  `;
}