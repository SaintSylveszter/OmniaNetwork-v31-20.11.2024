import sql from '../db/neon';
import { safeUUID } from '../db/utils';
import type { Server } from '../../types/database';

export async function getServers(): Promise<Server[]> {
  try {
    const servers = await sql<Server[]>`
      SELECT * FROM servers 
      ORDER BY name ASC
    `;
    return servers;
  } catch (error) {
    console.error('Error fetching servers:', error);
    throw new Error('Failed to fetch servers');
  }
}

export async function createServer(data: { name: string; ip: string }): Promise<Server> {
  try {
    const [server] = await sql<Server[]>`
      INSERT INTO servers (
        name, 
        hostname, 
        ip_address
      ) VALUES (
        ${data.name},
        ${data.name},
        ${data.ip}
      )
      RETURNING *
    `;
    return server;
  } catch (error) {
    console.error('Error creating server:', error);
    throw new Error('Failed to create server');
  }
}

export async function updateServer(id: string, data: { name: string; ip: string }): Promise<Server> {
  try {
    const serverId = safeUUID(id);
    if (!serverId) {
      throw new Error('Invalid server ID');
    }

    const [server] = await sql<Server[]>`
      UPDATE servers 
      SET 
        name = ${data.name},
        hostname = ${data.name},
        ip_address = ${data.ip},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${serverId}
      RETURNING *
    `;
    
    if (!server) {
      throw new Error('Server not found');
    }
    
    return server;
  } catch (error) {
    console.error('Error updating server:', error);
    throw new Error('Failed to update server');
  }
}

export async function deleteServer(id: string): Promise<void> {
  try {
    const serverId = safeUUID(id);
    if (!serverId) {
      throw new Error('Invalid server ID');
    }

    // First check if any sites are using this server
    const [site] = await sql`
      SELECT s.id
      FROM sites s
      WHERE s.server_id = ${serverId}
      LIMIT 1
    `;

    if (site) {
      throw new Error('Cannot delete this server because it is being used by one or more sites');
    }

    // If server exists and has no sites, delete it
    await sql`
      DELETE FROM servers 
      WHERE id = ${serverId}
    `;
  } catch (error) {
    console.error('Error deleting server:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to delete server');
  }
}