import sql from '../db/neon';
import type { Admin } from '../../types/database';

export async function getAdmins(): Promise<Admin[]> {
  try {
    const admins = await sql<Admin[]>`
      SELECT id, username, connection_string
      FROM admins 
      WHERE role = 'servant'
      ORDER BY username ASC
    `;
    return admins;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admins';
    throw new Error(message);
  }
}

export async function createAdmin(data: { username: string; connection_string: string }): Promise<Admin> {
  try {
    const [admin] = await sql<Admin[]>`
      INSERT INTO admins (
        username,
        password,
        connection_string,
        role
      ) VALUES (
        ${data.username},
        crypt(${data.username + '_pwd'}, gen_salt('bf')),
        ${data.connection_string},
        'servant'
      )
      RETURNING id, username, connection_string
    `;

    if (!admin) {
      throw new Error('Admin was created but could not be retrieved');
    }

    return admin;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create admin';
    throw new Error(message);
  }
}

export async function updateAdmin(id: string, data: { username: string; connection_string: string }): Promise<Admin> {
  try {
    const [admin] = await sql<Admin[]>`
      UPDATE admins 
      SET username = ${data.username},
          connection_string = ${data.connection_string},
          password = crypt(${data.username + '_pwd'}, gen_salt('bf')),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING id, username, connection_string
    `;

    if (!admin) {
      throw new Error('Admin not found');
    }

    return admin;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update admin';
    throw new Error(message);
  }
}

export async function deleteAdmin(id: string): Promise<void> {
  try {
    await sql`
      DELETE FROM admins 
      WHERE id = ${id}
    `;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete admin';
    throw new Error(message);
  }
}