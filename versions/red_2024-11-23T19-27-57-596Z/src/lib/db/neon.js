import { neon, neonConfig } from '@neondatabase/serverless';

// Configure neon to use fetch API
neonConfig.fetchConnectionCache = true;

// Get database URL from environment variables
const DATABASE_URL = "postgresql://omnianetwork_db_owner:4mktODru3fVS@ep-twilight-boat-a5dz5x06-pooler.us-east-2.aws.neon.tech/omnianetwork_db?sslmode=require";

if (!DATABASE_URL) {
  throw new Error('Database URL is not configured');
}

// Create SQL connection
const sql = neon(DATABASE_URL);

export default sql;