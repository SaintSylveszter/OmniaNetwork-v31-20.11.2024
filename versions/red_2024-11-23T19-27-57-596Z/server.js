import express from 'express';
import sql from './src/lib/db/neon.js';
import * as dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import { processArticleImages, processImage } from './src/lib/server/imageProcessor.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const upload = multer();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Image processing endpoints
app.post('/api/images/process', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const processedImages = await processArticleImages(req.file.buffer);
    
    // Upload to BunnyCDN and get URLs
    // This part would use your existing BunnyCDN upload logic
    // For now, we'll return dummy URLs
    const urls = {
      square: 'https://example.com/square.jpg',
      rectangle: 'https://example.com/rectangle.jpg',
      wide: 'https://example.com/wide.jpg',
      wideLarge: 'https://example.com/wide-large.jpg'
    };

    res.json({ urls });
  } catch (error) {
    console.error('Image processing error:', error);
    res.status(500).json({ error: 'Failed to process images' });
  }
});

app.post('/api/images/replace', upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.body.type) {
      throw new Error('Missing file or type');
    }

    const processedImage = await processImage(req.file.buffer, req.body.type);
    
    // Upload to BunnyCDN and get URL
    // This part would use your existing BunnyCDN upload logic
    // For now, we'll return a dummy URL
    const url = 'https://example.com/replaced.jpg';

    res.json({ url });
  } catch (error) {
    console.error('Image replacement error:', error);
    res.status(500).json({ error: 'Failed to replace image' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt for username:', username);

  try {
    // Query the database for the user
    const [admin] = await sql`
      SELECT id, username, email, role
      FROM admins
      WHERE username = ${username}
      AND password = crypt(${password}, password)
      AND status = 'active'
      LIMIT 1
    `;

    if (!admin) {
      console.log('Invalid credentials for:', username);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login timestamp
    await sql`
      UPDATE admins 
      SET last_login = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `;

    console.log('Login successful for:', username);
    res.json({
      ...admin,
      success: true
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Change password endpoint
app.post('/api/auth/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  try {
    // First verify current password
    const [admin] = await sql`
      SELECT id 
      FROM admins
      WHERE username = ${username}
      AND password = crypt(${currentPassword}, password)
      AND status = 'active'
      LIMIT 1
    `;

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update to new password
    await sql`
      UPDATE admins 
      SET password = crypt(${newPassword}, gen_salt('bf')),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ${admin.id}
    `;

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});