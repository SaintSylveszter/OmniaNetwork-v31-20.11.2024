import { validateCredentials } from '../../src/lib/auth.js';
import { getMasterDb } from '../../src/lib/db/connections.js';

export async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // First validate current credentials
    const admin = await validateCredentials(username, currentPassword);

    if (!admin) {
      return res.status(401).json({ error: 'The current password you entered is incorrect' });
    }

    // Get database connection
    const sql = getMasterDb();

    // Update password
    await sql`
      UPDATE admins 
      SET password = crypt(${newPassword}, gen_salt('bf')),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `;

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'An error occurred while changing your password. Please try again.' 
    });
  }
}