import { uploadImageFromUrl } from './lib/bunny.js';

const imageUrl = 'https://s13emagst.akamaized.net/products/72440/72439037/images/res_54369b2839d4944a42eaa5634406eab2.jpg?width=720&height=720&hash=2B2730FE0DF8D15BFAE4108C1B9066CA';
const authorName = 'test_product';

console.log('Starting image upload...');
uploadImageFromUrl(imageUrl, authorName)
  .then(cdnUrl => {
    console.log('✓ Image uploaded successfully');
    console.log('CDN URL:', cdnUrl);
  })
  .catch(error => {
    console.error('✗ Upload failed:', error.message);
  });