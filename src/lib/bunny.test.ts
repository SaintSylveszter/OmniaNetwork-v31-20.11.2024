import { uploadImageFromUrl } from './bunny';

async function testImageUpload() {
  try {
    const imageUrl = 'https://s13emagst.akamaized.net/products/72440/72439037/images/res_54369b2839d4944a42eaa5634406eab2.jpg?width=720&height=720&hash=2B2730FE0DF8D15BFAE4108C1B9066CA';
    const authorName = 'test_upload';
    
    console.log('Starting image upload test...');
    const cdnUrl = await uploadImageFromUrl(imageUrl, authorName);
    console.log('Upload successful! CDN URL:', cdnUrl);
    return cdnUrl;
  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

// Run the test
testImageUpload()
  .then(url => console.log('Test completed successfully. Image URL:', url))
  .catch(error => console.error('Test failed:', error));