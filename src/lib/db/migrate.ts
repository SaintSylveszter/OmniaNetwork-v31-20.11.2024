import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as dotenv from 'dotenv';
import sql from './neon.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runMigration() {
  console.log('Starting database migration...');
  
  try {
    // Read the migration file
    const migrationPath = join(__dirname, 'migrations', '001_initial.sql');
    console.log('Reading migration file:', migrationPath);
    
    const migration = readFileSync(migrationPath, 'utf-8');

    // Split the migration into individual statements
    const statements = migration
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Found ${statements.length} SQL statements to execute`);

    // Execute each statement
    for (const statement of statements) {
      if (!statement) continue;
      
      try {
        await sql.unsafe(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      } catch (error: any) {
        if (error.message.includes('already exists')) {
          console.log('⚠️ Skipping (already exists):', statement.substring(0, 50) + '...');
          continue;
        }
        console.error('Failed to execute statement:', statement);
        throw error;
      }
    }

    console.log('✅ Migration completed successfully');

    // Verify tables were created
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('\nCreated tables:');
    tables.forEach((table: { table_name: string }) => {
      console.log(`- ${table.table_name}`);
    });

    return true;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return false;
  }
}

runMigration()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });