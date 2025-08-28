import { Icon, Text } from 'react-basics';
import Link from 'next/link';
import LanguageButton from '@/components/input/LanguageButton';
import ThemeButton from '@/components/input/ThemeButton';
import SettingsButton from '@/components/input/SettingsButton';
import Icons from '@/components/icons';
import styles from './Header.module.css';

export function Header() {
  return (
    <header className={styles.header}>
      <div>
        <Link href="https://netsense.com" target="_blank" className={styles.title}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img src="/images/air.jpeg" alt="NetSense Logo" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>×</span>
            <img src="/images/IITM.png" alt="IITM Logo" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
          </div>
          <Text>NetSense</Text>
        </Link>
      </div>
      <div className={styles.buttons}>
        <ThemeButton />
        <LanguageButton />
        <SettingsButton />
      </div>
    </header>
  );
}

export default Header;
