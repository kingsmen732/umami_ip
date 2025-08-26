'use client';
import { useState } from 'react';
import { Button, Icon } from 'react-basics';
import Icons from '@/components/icons';
import styles from './IPDisplay.module.css';

interface IPDisplayProps {
  encryptedIp?: string;
  showDecrypt?: boolean;
}

export function IPDisplay({ encryptedIp, showDecrypt = false }: IPDisplayProps) {
  const [decryptedIp, setDecryptedIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDecrypt = async () => {
    if (!encryptedIp) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/decrypt-ip', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({ encryptedIp }),
      });
      
      if (response.ok) {
        const { ip } = await response.json();
        setDecryptedIp(ip);
      } else {
        setError('Failed to decrypt IP');
      }
    } catch (err) {
      setError('Error decrypting IP');
    } finally {
      setLoading(false);
    }
  };

  if (!encryptedIp) {
    return (
      <span className={styles.noip}>
        <Icon>
          <Icons.Lock />
        </Icon>
        No IP stored
      </span>
    );
  }

  return (
    <div className={styles.container}>
      {!showDecrypt && (
        <span className={styles.encrypted}>
          <Icon>
            <Icons.Lock />
          </Icon>
          [Encrypted]
        </span>
      )}
      
      {showDecrypt && !decryptedIp && (
        <Button onClick={handleDecrypt} disabled={loading} size="sm" variant="quiet">
          <Icon>
            <Icons.Eye />
          </Icon>
          {loading ? 'Decrypting...' : 'Show IP'}
        </Button>
      )}
      
      {decryptedIp && (
        <span className={styles.decrypted}>
          <Icon>
            <Icons.Globe />
          </Icon>
          {decryptedIp}
        </span>
      )}
      
      {error && (
        <span className={styles.error}>
          <Icon>
            <Icons.Lock />
          </Icon>
          {error}
        </span>
      )}
    </div>
  );
}

export default IPDisplay;
