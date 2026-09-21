'use client';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { LANGS } from '@/lib/i18n/translations';
import styles from './LanguageSwitcher.module.css';

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  return (
    <div className={styles.wrap} role="group" aria-label="Select language">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          className={`${styles.btn} ${lang === code ? styles.active : ''}`}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          lang={code}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
