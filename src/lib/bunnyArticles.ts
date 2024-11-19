import axios from 'axios';

interface ProcessedImages {
  square_url: string;     // 1:1 (360x360)
  rectangle_url: string;  // 3:2 (360x240)
  wide_url: string;      // 16:9 (600x338)
  wide_large_url: string; // 16:9 (1200x675)
  base_name: string;
}

const STORAGE_ZONE = import.meta.env.VITE_BUNNYCDN_STORAGE_ZONE || 'omnianetwork';
const STORAGE_PATH = 'articles';
const ACCESS_KEY = import.meta.env.VITE_BUNNYCDN_API_KEY;
const STORAGE_ENDPOINT = import.meta.env.VITE_BUNNYCDN_STORAGE_API_ENDPOINT || 'storage.bunnycdn.com';
const STORAGE_URL = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE}/${STORAGE_PATH}`;

export async function uploadArticleImages(file: File, articleTitle: string): Promise<ProcessedImages> {
  try {
    // Create URL-friendly article name
    const safeTitle = articleTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    // Create base filename with timestamp
    const timestamp = new Date().getTime();
    const baseName = `${safeTitle}_${timestamp}`;

    // Convert file to FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('articleTitle', articleTitle);

    // Process images through server endpoint
    const response = await axios.post('/api/images/process', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const { urls } = response.data;

    return {
      square_url: urls.square,
      rectangle_url: urls.rectangle,
      wide_url: urls.wide,
      wide_large_url: urls.wideLarge,
      base_name: baseName
    };
  } catch (error) {
    console.error('Failed to upload article images:', error);
    throw new Error('Failed to upload article images. Please try again.');
  }
}

export async function replaceArticleImage(file: File, baseName: string, type: 'square' | 'rectangle' | 'wide' | 'wide_large'): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('baseName', baseName);

    const response = await axios.post('/api/images/replace', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data.url;
  } catch (error) {
    console.error('Failed to replace image:', error);
    throw new Error('Failed to replace image. Please try again.');
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    if (!ACCESS_KEY) {
      throw new Error('Bunny.net access key not configured');
    }

    // Extract filename from URL
    const filename = url.split('/').pop();
    if (!filename) throw new Error('Invalid image URL');

    const deleteUrl = `${STORAGE_URL}/${filename}`;
    console.log('Attempting to delete from:', deleteUrl);

    // Delete from Bunny.net
    const response = await axios.delete(deleteUrl, {
      headers: {
        'AccessKey': ACCESS_KEY
      }
    });

    if (response.status !== 200) {
      throw new Error(`Delete failed with status ${response.status}`);
    }

    console.log('File deleted successfully');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to delete image:', {
        status: error.response?.status,
        message: error.response?.data,
        deleteUrl: error.config?.url
      });
      throw new Error(`Image deletion failed: ${error.response?.data || error.message}`);
    }
    console.error('Failed to delete image:', error);
    throw new Error('Image deletion failed. Please try again.');
  }
}