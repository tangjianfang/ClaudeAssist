import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { en } from './en';
import { zhCN } from './zh-CN';
import type { Language } from '../data/types';

const translations = { en, 'zh-CN': zhCN };

interface LanguageContextValue {
  lang: Language;
  setLang: (l: Language) => void;
  t: typeof en;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  setLang: () => undefined,
  t: en,
});

function detectLanguage(): Language {
  const stored = localStorage.getItem('ca-lang') as Language | null;
  if (stored === 'en' || stored === 'zh-CN') return stored;
  const nav = navigator.language;
  if (nav.startsWith('zh')) return 'zh-CN';
  return 'en';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    setLangState(detectLanguage());
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem('ca-lang', l);
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
