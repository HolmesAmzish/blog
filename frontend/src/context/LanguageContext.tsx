/**
 * Language Context
 * Provides language detection and switching functionality
 * Browser language detected on init, stored in localStorage
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Supported languages matching backend enum
export type SupportedLanguage = 'ZH' | 'EN';

// Language metadata
export const LANGUAGE_CONFIG = {
  ZH: { label: '中文', locale: 'zh-CN', flag: 'CN' },
  EN: { label: 'English', locale: 'en-US', flag: 'US' },
} as const;

// Default language (fallback)
const DEFAULT_LANGUAGE: SupportedLanguage = 'EN';

// Storage key
const LANGUAGE_STORAGE_KEY = 'preferred_language';

/**
 * Detect browser language and map to supported language
 */
const detectBrowserLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  const browserLang = navigator.language || 'en';

  if (browserLang.includes('zh')) return 'ZH';
  if (browserLang.includes('en')) return 'EN';

  return DEFAULT_LANGUAGE;
};

/**
 * Get stored language preference
 */
const getStoredLanguage = (): SupportedLanguage => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;

  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (stored === 'ZH' || stored === 'EN')) {
      return stored;
    }
  } catch {
    // Ignore storage errors
  }

  // Fall back to browser detection
  return detectBrowserLanguage();
};

/**
 * Language Context
 */
interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  locale: string;
  isChinese: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Re-export for convenience
export { LanguageContext };

/**
 * Provider Component
 */
export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    return getStoredLanguage();
  });

  // Sync storage on language change
  useEffect(() => {
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
  };

  const locale = LANGUAGE_CONFIG[language].locale;
  const isChinese = language === 'ZH';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, locale, isChinese }}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Custom hook to use language context
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Default values for component stories or tests
    return {
      language: DEFAULT_LANGUAGE,
      setLanguage: () => console.warn('LanguageProvider not found'),
      locale: LANGUAGE_CONFIG[DEFAULT_LANGUAGE].locale,
      isChinese: false,
    };
  }
  return context;
};

/**
 * Simple hook to check if current language is Chinese
 */
export const useIsChinese = () => {
  const { isChinese } = useLanguage();
  return isChinese;
};

/**
 * Hook to get current language config
 */
export const useLanguageConfig = () => {
  const { language } = useLanguage();
  return LANGUAGE_CONFIG[language];
};
