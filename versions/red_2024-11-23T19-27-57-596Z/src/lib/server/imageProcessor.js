import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function processImage(buffer, type) {
  try {
    let width, height;
    switch (type) {
      case 'square':
        width = height = 360;
        break;
      case 'rectangle':
        width = 360;
        height = 240;
        break;
      case 'wide':
        width = 600;
        height = 338;
        break;
      case 'wide_large':
        width = 1200;
        height = 675;
        break;
      default:
        throw new Error('Invalid image type');
    }

    return await sharp(buffer)
      .resize(width, height, {
        fit: 'cover',
        position: 'centre'
      })
      .jpeg({ quality: 85 })
      .toBuffer();
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
}

export async function processArticleImages(buffer) {
  try {
    const [square, rectangle, wide, wideLarge] = await Promise.all([
      processImage(buffer, 'square'),
      processImage(buffer, 'rectangle'),
      processImage(buffer, 'wide'),
      processImage(buffer, 'wide_large')
    ]);

    return {
      square,
      rectangle,
      wide,
      wideLarge
    };
  } catch (error) {
    console.error('Failed to process article images:', error);
    throw new Error('Failed to process article images');
  }
}