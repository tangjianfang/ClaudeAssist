import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { en } from './en';
import { zhCN } from './zh-CN';
import { zhTW } from './zh-TW';
import { ja } from './ja';
import { ko } from './ko';
import { fr } from './fr';
import { de } from './de';
import { es } from './es';
import { pt } from './pt';
import { ru } from './ru';
import { it } from './it';
import { nl } from './nl';
import { tr } from './tr';
import type { Language } from '../data/types';

const translations: Record<Language, typeof en> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  ko,
  fr,
  de,
  es,
  pt,
  ru,
  it,
  nl,
  tr,
};

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

const ALL_LANGS: Language[] = ['en','zh-CN','zh-TW','ja','ko','fr','de','es','pt','ru','it','nl','tr'];

function detectLanguage(): Language {
  const stored = localStorage.getItem('ca-lang') as Language | null;
  if (stored && (ALL_LANGS as string[]).includes(stored)) return stored;
  const nav = navigator.language;
  if (nav.startsWith('zh-TW') || nav.startsWith('zh-Hant')) return 'zh-TW';
  if (nav.startsWith('zh')) return 'zh-CN';
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('ko')) return 'ko';
  if (nav.startsWith('fr')) return 'fr';
  if (nav.startsWith('de')) return 'de';
  if (nav.startsWith('es')) return 'es';
  if (nav.startsWith('pt')) return 'pt';
  if (nav.startsWith('ru')) return 'ru';
  if (nav.startsWith('it')) return 'it';
  if (nav.startsWith('nl')) return 'nl';
  if (nav.startsWith('tr')) return 'tr';
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
