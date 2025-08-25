'use client';
import { useState, useEffect } from 'react';
import { Icon } from 'react-basics';
import Icons from '@/components/icons';
import styles from './IPDisplay.module.css';

interface AutoDecryptIPProps {
  encryptedIp?: string;
}

export function AutoDecryptIP({ encryptedIp }: AutoDecryptIPProps) {
  const [decryptedIp, setDecryptedIp] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const decryptIP = async () => {
      if (!encryptedIp) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/decrypt-ip', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`
          },
          body: JSON.stringify({ encryptedIp }),
        });
        
        if (response.ok) {
          const { ip } = await response.json();
          setDecryptedIp(ip);
        } else {
          setError('Access denied');
        }
      } catch (err) {
        setError('Error');
      } finally {
        setLoading(false);
      }
    };

    decryptIP();
  }, [encryptedIp]);

  if (!encryptedIp) {
    return (
      <span className={styles.noip}>
        <Icon>
          <Icons.Lock />
        </Icon>
        No IP
      </span>
    );
  }

  if (loading) {
    return (
      <span className={styles.loading}>
        <Icon>
          <Icons.Clock />
        </Icon>
        Loading...
      </span>
    );
  }

  if (error) {
    return (
      <span className={styles.encrypted}>
        <Icon>
          <Icons.Lock />
        </Icon>
        [Encrypted]
      </span>
    );
  }

  if (decryptedIp) {
    return (
      <span className={styles.decrypted}>
        <Icon>
          <Icons.Globe />
        </Icon>
        {decryptedIp}
      </span>
    );
  }

  return (
    <span className={styles.encrypted}>
      <Icon>
        <Icons.Lock />
      </Icon>
      [Encrypted]
    </span>
  );
}

export default AutoDecryptIP;
