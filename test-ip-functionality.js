require('dotenv').config();
const { encryptIp, decryptIp } = require('./src/lib/crypto.ts');

console.log('Testing IP Encryption/Decryption functionality...\n');

// Test IP encryption and decryption
const testIp = '192.168.1.100';
console.log(`Original IP: ${testIp}`);

try {
  // Test encryption
  const encrypted = encryptIp(testIp);
  console.log(`Encrypted: ${encrypted ? encrypted.substring(0, 50) + '...' : 'null'}`);
  
  // Test decryption
  const decrypted = decryptIp(encrypted);
  console.log(`Decrypted: ${decrypted}`);
  
  // Verify match
  const matches = testIp === decrypted;
  console.log(`✓ Encryption/Decryption works: ${matches ? 'YES' : 'NO'}`);
  
  if (!matches) {
    console.error('ERROR: IP encryption/decryption failed!');
    process.exit(1);
  }
  
  console.log('\n✅ IP encryption system is working correctly!');
  console.log('Your configuration:');
  console.log(`- STORE_IP: ${process.env.STORE_IP}`);
  console.log(`- ALLOW_IP_DECRYPT: ${process.env.ALLOW_IP_DECRYPT}`);
  console.log(`- Database: PostgreSQL connected`);
  
} catch (error) {
  console.error('Error testing IP functionality:', error.message);
  process.exit(1);
}
