import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type SupportedLanguage = 'ZH' | 'EN';

export const LANGUAGE_CONFIG = {
  ZH: { label: '中文', locale: 'zh-CN', flag: 'CN' },
  EN: { label: 'English', locale: 'en-US', flag: 'US' },
} as const;

const DEFAULT_LANGUAGE: SupportedLanguage = 'EN';
const LANGUAGE_STORAGE_KEY = 'preferred_language';

const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  const browserLang = navigator.language || 'en';
  if (browserLang.includes('zh')) return 'ZH';
  if (browserLang.includes('en')) return 'EN';
  return DEFAULT_LANGUAGE;
};

const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === 'ZH' || stored === 'EN')) return stored;
  } catch {}
  return detectBrowserLanguage();
};

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  locale: string;
  isChinese: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);
export { LanguageContext };

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(getStoredLanguage);
  useEffect(() => {
    try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language); } catch {}
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => setLanguageState(lang);
  const locale = LANGUAGE_CONFIG[language].locale;
  const isChinese = language === 'ZH';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, locale, isChinese }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    return { language: DEFAULT_LANGUAGE, setLanguage: () => {}, locale: LANGUAGE_CONFIG[DEFAULT_LANGUAGE].locale, isChinese: false };
  }
  return context;
};

export const useIsChinese = () => useLanguage().isChinese;

export const useLanguageConfig = () => {
  const { language } = useLanguage();
  return LANGUAGE_CONFIG[language];
};