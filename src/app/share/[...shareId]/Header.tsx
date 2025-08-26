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
        <Link href="https://aircentre.com" target="_blank" className={styles.title}>
          <img src="/images/air.jpeg" alt="AIR Centre Logo" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
          <Text>AIR Centre</Text>
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
