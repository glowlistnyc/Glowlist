'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Lang, type Translations, translations } from './translations';

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<Ctx>({
  lang: 'en',
  setLang: () => {},
  t: translations.en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gl-lang') as Lang;
      if (stored && Object.keys(translations).includes(stored)) {
        setLangState(stored);
      }
    } catch {}
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try { localStorage.setItem('gl-lang', l); } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] as Translations }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
