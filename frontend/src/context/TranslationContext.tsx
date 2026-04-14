/**
 * Translation Context and Hook
 * Combines translation data with language state
 */
import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { LanguageContext, LanguageProvider, useLanguage } from '../context/LanguageContext';
import type { SupportedLanguage } from '../context/LanguageContext';
import { en, zh, type Translations } from '../i18n/translations';

// Re-export for convenience
export { LanguageContext, LanguageProvider, useLanguage, type SupportedLanguage };

/**
 * Translation Context
 */
interface TranslationContextType {
  t: (key: string) => string;
  language: SupportedLanguage;
  locale: string;
  isChinese: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

/**
 * Get translation string by dot notation key
 */
const getTranslation = (translations: Translations, key: string): string => {
  const keys = key.split('.');
  let value: unknown = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key; // Return key if not found (for easy identification)
    }
  }

  return typeof value === 'string' ? value : key;
};

/**
 * Translation Provider Component
 */
export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { language, locale, isChinese } = useLanguage();

  const t = (key: string): string => {
    return getTranslation(language === 'ZH' ? zh : en, key);
  };

  return (
    <TranslationContext.Provider value={{ t, language, locale, isChinese }}>
      {children}
    </TranslationContext.Provider>
  );
};

/**
 * Custom hook to use translations
 */
export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    // Default values for component stories or tests
    return {
      t: (key: string) => key,
      language: 'EN' as SupportedLanguage,
      locale: 'en-US',
      isChinese: false,
    };
  }
  return context;
};

/**
 * Convenience hook that returns t function only
 */
export const useT = () => {
  const { t } = useTranslation();
  return t;
};
