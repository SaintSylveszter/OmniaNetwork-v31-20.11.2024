import { neon, neonConfig } from '@neondatabase/serverless';
import { dbConfig } from './config';

// Configure neon to use fetch API
neonConfig.fetchConnectionCache = true;

// Create and verify database connection
function createConnection() {
  try {
    return neon(dbConfig.databaseUrl);
  } catch (error) {
    console.error('Failed to create database connection:', error);
    throw new Error('Database connection failed. Please check your configuration.');
  }
}

// Create SQL connection
const sql = createConnection();

// Test query to verify connection
export async function verifyConnection(): Promise<boolean> {
  try {
    const result = await sql`SELECT 1 as connected`;
    return result[0]?.connected === 1;
  } catch (error) {
    console.error('Database connection verification failed:', error);
    return false;
  }
}

export default sql;