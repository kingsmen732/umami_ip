const { decryptIp } = require('./src/lib/crypto.ts');

/**
 * Utility script to decrypt IP addresses from the database
 * Usage: node decrypt-ip.js <encrypted_ip_string>
 */

if (process.argv.length < 3) {
  console.log('Usage: node decrypt-ip.js <encrypted_ip_string>');
  process.exit(1);
}

const encryptedIp = process.argv[2];

try {
  const decryptedIp = decryptIp(encryptedIp);
  if (decryptedIp) {
    console.log('Decrypted IP:', decryptedIp);
  } else {
    console.log('Failed to decrypt IP or IP is null');
  }
} catch (error) {
  console.error('Error decrypting IP:', error.message);
}
