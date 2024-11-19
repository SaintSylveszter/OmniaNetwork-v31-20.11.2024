import axios from 'axios';

const STORAGE_ZONE = import.meta.env.VITE_BUNNYCDN_STORAGE_ZONE || 'omnianetwork';
const STORAGE_PATH = 'authors';
const ACCESS_KEY = import.meta.env.VITE_BUNNYCDN_API_KEY;
const STORAGE_ENDPOINT = import.meta.env.VITE_BUNNYCDN_STORAGE_API_ENDPOINT || 'storage.bunnycdn.com';
const STORAGE_URL = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE}/${STORAGE_PATH}`;

export async function uploadImage(file: File, authorName: string): Promise<string> {
  try {
    if (!ACCESS_KEY) {
      throw new Error('Bunny.net access key not configured');
    }

    // Create URL-friendly author name
    const safeAuthorName = authorName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_') // Replace non-alphanumeric chars with underscore
      .replace(/^_+|_+$/g, ''); // Remove leading/trailing underscores

    // Get file extension from original file
    const extension = file.name.split('.').pop()?.toLowerCase() || '';

    // Create filename with timestamp to ensure uniqueness
    const timestamp = new Date().getTime();
    const filename = `${safeAuthorName}_${timestamp}.${extension}`;
    const uploadUrl = `${STORAGE_URL}/${filename}`;

    console.log('Attempting to upload to:', uploadUrl);

    // Convert file to ArrayBuffer
    const buffer = await file.arrayBuffer();

    // Upload to Bunny.net
    const response = await axios.put(uploadUrl, buffer, {
      headers: {
        'AccessKey': ACCESS_KEY,
        'Content-Type': file.type,
      }
    });

    if (response.status !== 201) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    // Return the public URL
    const cdnUrl = `https://${STORAGE_ZONE}.b-cdn.net/${STORAGE_PATH}/${filename}`;
    console.log('File uploaded successfully. CDN URL:', cdnUrl);
    return cdnUrl;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to upload image:', {
        status: error.response?.status,
        message: error.response?.data,
        uploadUrl: error.config?.url
      });
      throw new Error(`Image upload failed: ${error.response?.data || error.message}`);
    }
    console.error('Failed to upload image:', error);
    throw new Error('Image upload failed. Please try again.');
  }
}

export async function uploadImageFromUrl(imageUrl: string, authorName: string): Promise<string> {
  try {
    if (!ACCESS_KEY) {
      throw new Error('Bunny.net access key not configured');
    }

    // Download the image
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const contentType = imageResponse.headers['content-type'];

    if (!contentType?.startsWith('image/')) {
      throw new Error('URL does not point to a valid image');
    }

    // Get file extension from content type
    const extension = contentType.split('/')[1] || 'jpg';

    // Create URL-friendly author name
    const safeAuthorName = authorName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    // Create filename with timestamp
    const timestamp = new Date().getTime();
    const filename = `${safeAuthorName}_${timestamp}.${extension}`;
    const uploadUrl = `${STORAGE_URL}/${filename}`;

    console.log('Attempting to upload to:', uploadUrl);

    // Upload to Bunny.net
    const response = await axios.put(uploadUrl, imageResponse.data, {
      headers: {
        'AccessKey': ACCESS_KEY,
        'Content-Type': contentType,
      }
    });

    if (response.status !== 201) {
      throw new Error(`Upload failed with status ${response.status}`);
    }

    // Return the public URL
    const cdnUrl = `https://${STORAGE_ZONE}.b-cdn.net/${STORAGE_PATH}/${filename}`;
    console.log('File uploaded successfully. CDN URL:', cdnUrl);
    return cdnUrl;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to upload image:', {
        status: error.response?.status,
        message: error.response?.data,
        uploadUrl: error.config?.url
      });
      throw new Error(`Image upload failed: ${error.response?.data || error.message}`);
    }
    console.error('Failed to upload image:', error);
    throw new Error('Image upload failed. Please try again.');
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