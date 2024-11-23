import { neon, neonConfig } from '@neondatabase/serverless';

// Configure neon to use fetch API
neonConfig.fetchConnectionCache = true;

// Map to store database connections
const connections = new Map<string, any>();

export function getConnection(connectionString: string) {
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

// Test database connection
export async function testConnection(connectionString: string): Promise<boolean> {
  try {
    const sql = getConnection(connectionString);
    const result = await sql`SELECT 1 as connected`;
    return result[0]?.connected === 1;
  } catch (error) {
    console.error('Connection test failed:', error);
    throw error;
  }
}

// Close all connections
export function closeConnections() {
  connections.clear();
}