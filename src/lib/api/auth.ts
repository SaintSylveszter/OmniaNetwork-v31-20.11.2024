import sql from '../db/neon';
import type { User } from '../../contexts/AuthContext';

export async function login(username: string, password: string): Promise<User> {
  try {
    // Check admin credentials
    const [admin] = await sql`
      SELECT id, username, role
      FROM admins
      WHERE username = ${username}
      AND password = ${password}
      AND status = 'active'
      LIMIT 1
    `;

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Update last login timestamp
    await sql`
      UPDATE admins 
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `;

    return {
      id: admin.id,
      username: admin.username,
      role: admin.role
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
}

export async function changePassword(
  username: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  try {
    // First verify current password
    const [admin] = await sql`
      SELECT id 
      FROM admins 
      WHERE username = ${username}
      AND password = ${currentPassword}
      AND status = 'active'
    `;

    if (!admin) {
      return {
        success: false,
        message: 'Current password is incorrect'
      };
    }

    // Update password
    await sql`
      UPDATE admins 
      SET password = ${newPassword},
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `;

    return {
      success: true,
      message: 'Password changed successfully'
    };
  } catch (error) {
    console.error('Change password error:', error);
    throw new Error('Failed to change password');
  }
}