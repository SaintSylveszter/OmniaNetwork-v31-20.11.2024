import * as dotenv from 'dotenv';
import { getSiteDb } from './connections.js';

dotenv.config();

async function createAndPopulateTestTable() {
  if (!process.env.OMNIAKID1_URL) {
    throw new Error('OMNIAKID1_URL is not set');
  }

  const sql = getSiteDb(process.env.OMNIAKID1_URL);

  try {
    // Create test table
    await sql`
      CREATE TABLE IF NOT EXISTS test (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✓ Test table created');

    // Insert test data
    await sql`
      INSERT INTO test (message) 
      VALUES (${'testam sa vedem daca se conecteaza'})
    `;
    console.log('✓ Test data inserted');

    // Verify the data
    const result = await sql`SELECT * FROM test`;
    console.log('\nTest table contents:');
    console.log(result);

    return true;
  } catch (error) {
    console.error('Failed:', error);
    return false;
  }
}

createAndPopulateTestTable()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });