// Load environment variables
require('dotenv').config();

const crypto = require('crypto');

// Copy the encryption functions directly since TypeScript modules aren't available
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENC_POSITION = TAG_POSITION + TAG_LENGTH;

const getKey = (password, salt) =>
  crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha512');

function encrypt(value, secret) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = getKey(secret, salt);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');
}

function decrypt(value, secret) {
  const str = Buffer.from(String(value), 'base64');
  const salt = str.subarray(0, SALT_LENGTH);
  const iv = str.subarray(SALT_LENGTH, TAG_POSITION);
  const tag = str.subarray(TAG_POSITION, ENC_POSITION);
  const encrypted = str.subarray(ENC_POSITION);

  const key = getKey(secret, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return decipher.update(encrypted) + decipher.final('utf8');
}

function hash(...args) {
  return crypto.createHash('sha512').update(args.join('')).digest('hex');
}

function secret() {
  return hash(process.env.APP_SECRET || process.env.DATABASE_URL);
}

function encryptIp(ip) {
  if (!ip) return null;
  try {
    return encrypt(ip, secret());
  } catch (error) {
    console.error('Error encrypting IP:', error);
    return null;
  }
}

function decryptIp(encryptedIp) {
  if (!encryptedIp) return null;
  try {
    return decrypt(encryptedIp, secret());
  } catch (error) {
    console.error('Error decrypting IP:', error);
    return null;
  }
}

/**
 * Test script to verify IP encryption/decryption functionality
 */

const testIps = [
  '192.168.1.1',
  '10.0.0.1', 
  '203.0.113.1',
  '2001:db8::1'
];

console.log('Testing IP Encryption/Decryption...\n');

testIps.forEach((ip, index) => {
  console.log(`Test ${index + 1}: ${ip}`);
  
  try {
    // Encrypt the IP
    const encrypted = encryptIp(ip);
    console.log(`  Encrypted: ${encrypted?.substring(0, 50)}...`);
    
    // Decrypt the IP
    const decrypted = decryptIp(encrypted);
    console.log(`  Decrypted: ${decrypted}`);
    
    // Verify they match
    const matches = ip === decrypted;
    console.log(`  ✓ Match: ${matches ? 'YES' : 'NO'}\n`);
    
    if (!matches) {
      console.error(`ERROR: Original and decrypted IPs don't match!`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`  ERROR: ${error.message}\n`);
  }
});

console.log('✅ All tests passed! IP encryption/decryption is working correctly.');
