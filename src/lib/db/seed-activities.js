import sql from './neon.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function seedActivities() {
  try {
    // First get the admin ID
    const [admin] = await sql`
      SELECT id FROM admins 
      WHERE username = 'admin' 
      LIMIT 1
    `;

    if (!admin) {
      throw new Error('Admin user not found');
    }

    // Insert sample activity logs
    await sql`
      INSERT INTO activity_logs (admin_id, action, entity_type, entity_id, details, ip_address) 
      VALUES 
        (${admin.id}, 'Created new site', 'site', null, '{"site_name": "omniakid1.com"}', '192.168.1.1'),
        (${admin.id}, 'Updated server settings', 'server', null, '{"server": "server1"}', '192.168.1.1'),
        (${admin.id}, 'Added new site type', 'site_type', null, '{"type": "Blog"}', '192.168.1.1'),
        (${admin.id}, 'Modified site configuration', 'site', null, '{"site_name": "omniakid2.com"}', '192.168.1.1'),
        (${admin.id}, 'System backup completed', 'system', null, '{"status": "success"}', '192.168.1.1'),
        (${admin.id}, 'Added new server', 'server', null, '{"name": "server2"}', '192.168.1.1'),
        (${admin.id}, 'Updated site type', 'site_type', null, '{"type": "E-commerce"}', '192.168.1.1'),
        (${admin.id}, 'Security audit completed', 'system', null, '{"status": "passed"}', '192.168.1.1'),
        (${admin.id}, 'Database maintenance', 'system', null, '{"type": "optimization"}', '192.168.1.1'),
        (${admin.id}, 'Added new admin user', 'admin', null, '{"username": "john.doe"}', '192.168.1.1')
    `;

    console.log('✓ Activity logs seeded successfully');
    return true;
  } catch (error) {
    console.error('Failed to seed activity logs:', error);
    return false;
  }
}

seedActivities()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Seed script failed:', error);
    process.exit(1);
  });