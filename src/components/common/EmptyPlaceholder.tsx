import { ReactNode } from 'react';
import { Text, Flexbox } from 'react-basics';

export interface EmptyPlaceholderProps {
  message?: string;
  children?: ReactNode;
}

export function EmptyPlaceholder({ message, children }: EmptyPlaceholderProps) {
  return (
    <Flexbox direction="column" alignItems="center" justifyContent="center" gap={60} height={600}>
      <div style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
        <img src="/images/air.jpeg" alt="NetSense Logo" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#666' }}>×</span>
        <img src="/images/IITM.png" alt="IITM Logo" style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }} />
      </div>
      <Text size="lg">{message}</Text>
      <div>{children}</div>
    </Flexbox>
  );
}

export default EmptyPlaceholder;
