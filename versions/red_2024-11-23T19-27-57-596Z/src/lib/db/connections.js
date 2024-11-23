import { neon, neonConfig } from '@neondatabase/serverless';

// Configure neon to use fetch API
neonConfig.fetchConnectionCache = true;

// Map to store database connections
const connections = new Map();

export function getConnection(connectionString) {
  if (!connectionString) {
    throw new Error('Connection string is required');
  }

  // Check if connection exists
  if (connections.has(connectionString)) {
    return connections.get(connectionString);
  }

  // Create new connection
  const sql = neon(connectionString);
  connections.set(connectionString, sql);
  return sql;
}

export async function testConnection(connectionString) {
  try {
    if (!connectionString) {
      throw new Error('Connection string is required');
    }

    const sql = getConnection(connectionString);
    const result = await sql`SELECT 1 as connected`;
    return result[0]?.connected === 1;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
}

export function closeConnections() {
  connections.clear();
}

// Default export for backward compatibility
export default {
  getConnection,
  testConnection,
  closeConnections
};