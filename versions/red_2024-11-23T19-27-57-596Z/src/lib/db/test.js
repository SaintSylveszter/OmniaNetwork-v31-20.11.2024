import sql from './neon.js';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    const result = await sql`SELECT version()`;
    console.log('✓ Database connected:', result[0].version);
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

testConnection()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });