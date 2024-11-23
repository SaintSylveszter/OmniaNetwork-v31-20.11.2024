import * as dotenv from 'dotenv';
import sql from './neon.js';

// Load environment variables
dotenv.config();

// Get database URL from environment
const DATABASE_URL = process.env.VITE_DATABASE_URL;

if (!DATABASE_URL) {
  console.error('VITE_DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function verifyPgcrypto() {
  try {
    // Check if pgcrypto extension exists and is installed
    const [result] = await sql`
      SELECT EXISTS (
        SELECT 1 
        FROM pg_extension 
        WHERE extname = 'pgcrypto'
      ) as is_installed;
    `;
    
    if (!result.is_installed) {
      console.error('pgcrypto extension is not installed');
      return false;
    }

    // Test password hashing functionality
    const [test] = await sql`
      SELECT crypt('test', gen_salt('bf')) as hashed_password;
    `;

    if (!test.hashed_password) {
      console.error('pgcrypto password hashing is not working');
      return false;
    }

    console.log('✓ pgcrypto extension is installed and working');
    return true;
  } catch (error) {
    console.error('Error verifying pgcrypto:', error);
    return false;
  }
}

verifyPgcrypto()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Verification failed:', error);
    process.exit(1);
  });