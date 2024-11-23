import axios from 'axios';

const STORAGE_ZONE = 'omnianetwork';
const STORAGE_PATH = 'authors';
const ACCESS_KEY = '49185a97-9bf0-4140-b4f65fcc1ac7-813b-486e';
const STORAGE_ENDPOINT = 'storage.bunnycdn.com';
const STORAGE_URL = `https://${STORAGE_ENDPOINT}/${STORAGE_ZONE}/${STORAGE_PATH}`;

export async function uploadImage(file, authorName) {
  try {
    // Create URL-friendly author name
    const safeAuthorName = authorName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

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

export async function uploadImageFromUrl(imageUrl, authorName) {
  try {
    // Download the image
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    
    // Create URL-friendly author name
    const safeAuthorName = authorName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    // Get file extension from content type
    const extension = contentType.split('/')[1] || 'jpg';

    // Create filename with timestamp to ensure uniqueness
    const timestamp = new Date().getTime();
    const filename = `${safeAuthorName}_${timestamp}.${extension}`;
    const uploadUrl = `${STORAGE_URL}/${filename}`;

    console.log('Attempting to upload to:', uploadUrl);

    // Upload to Bunny.net
    const uploadResponse = await axios.put(uploadUrl, response.data, {
      headers: {
        'AccessKey': ACCESS_KEY,
        'Content-Type': contentType,
      }
    });

    if (uploadResponse.status !== 201) {
      throw new Error(`Upload failed with status ${uploadResponse.status}`);
    }

    // Return the public URL
    const cdnUrl = `https://${STORAGE_ZONE}.b-cdn.net/${STORAGE_PATH}/${filename}`;
    return cdnUrl;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to upload image:', {
        status: error.response?.status,
        message: error.response?.data,
        url: error.config?.url
      });
      throw new Error(`Image upload failed: ${error.response?.data || error.message}`);
    }
    console.error('Failed to upload image:', error);
    throw new Error('Image upload failed. Please try again.');
  }
}

export async function deleteImage(url) {
  try {
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