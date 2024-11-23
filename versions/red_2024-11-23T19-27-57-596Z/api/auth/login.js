import { validateCredentials } from '../../src/lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const admin = await validateCredentials(username, password);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user data without sensitive information
    const userData = {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.role
    };

    res.status(200).json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}