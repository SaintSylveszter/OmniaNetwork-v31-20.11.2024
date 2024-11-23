import sql from './neon.js';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  try {
    console.log('Starting database migration...');
    
    // Read and execute the migration file
    const migrationPath = join(__dirname, 'migrations', '006_populate_admin_records.sql');
    const migration = readFileSync(migrationPath, 'utf-8');

    // Split into individual statements and execute
    const statements = migration.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
        console.log('✓ Executed:', statement.substring(0, 50) + '...');
      } catch (error) {
        if (!error.message.includes('already exists')) {
          throw error;
        }
        console.log('⚠️ Skipped (already exists):', statement.substring(0, 50) + '...');
      }
    }

    // Verify the records were created
    const admins = await sql`
      SELECT a.username, a.email, a.role, s.name as site_name
      FROM admins a
      LEFT JOIN sites s ON a.site_id = s.id
      WHERE a.role = 'servant'
      ORDER BY a.username;
    `;

    console.log('\nCreated admin records:');
    admins.forEach(admin => {
      console.log(`- ${admin.username} (${admin.email}) for site: ${admin.site_name}`);
    });

    console.log('\n✅ Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

runMigration()
  .then(success => process.exit(success ? 0 : 1))
  .catch(error => {
    console.error('Migration failed:', error);
    process.exit(1);
  });