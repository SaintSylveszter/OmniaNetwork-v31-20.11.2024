import sql from './db/neon';
import type { Admin } from '../types/database';

export async function validateCredentials(username: string, password: string): Promise<Admin | null> {
  try {
    // First check if user exists and is active
    const [admin] = await sql<Admin[]>`
      SELECT id, username, email, role, status, last_login
      FROM admins
      WHERE username = ${username}
      AND status = 'active'
      LIMIT 1
    `;

    if (!admin) {
      return null;
    }

    // Then verify password
    const [verified] = await sql<Admin[]>`
      SELECT id
      FROM admins
      WHERE id = ${admin.id}
      AND password = crypt(${password}, password)
    `;

    if (!verified) {
      return null;
    }

    // Update last login
    await sql`
      UPDATE admins 
      SET last_login = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `;

    return admin;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}