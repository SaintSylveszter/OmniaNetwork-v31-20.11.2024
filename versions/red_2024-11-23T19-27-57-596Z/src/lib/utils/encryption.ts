// Simple encryption/decryption using a more secure method
// Note: In production, use a proper encryption library with a secure key

const ENCRYPTION_KEY = 'omnianetwork-secret-key'; // In production, use an environment variable

export function encrypt(text: string): string {
  try {
    // Create a simple encryption by XORing with the key
    const encrypted = Array.from(text).map((char, index) => {
      const keyChar = ENCRYPTION_KEY[index % ENCRYPTION_KEY.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
    
    // Convert to base64 for safe storage
    return Buffer.from(encrypted).toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Encryption failed');
  }
}

export function decrypt(text: string): string {
  try {
    // Convert from base64
    const encrypted = Buffer.from(text, 'base64').toString();
    
    // Decrypt by XORing with the same key
    return Array.from(encrypted).map((char, index) => {
      const keyChar = ENCRYPTION_KEY[index % ENCRYPTION_KEY.length];
      return String.fromCharCode(char.charCodeAt(0) ^ keyChar.charCodeAt(0));
    }).join('');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Decryption failed');
  }
}