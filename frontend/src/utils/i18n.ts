import type { Language } from '../types';

/**
 * Get localized name from a names map (Record<Language, string>)
 * Falls back to first available language if requested language not found
 */
export function getLocalizedName(
  names: Record<Language, string> | undefined,
  language: Language
): string {
  if (!names) return '';
  return names[language] || Object.values(names)[0] || '';
}

/**
 * Get article translation for the current language
 * Falls back to first available translation if requested language not found
 */
export function getArticleTranslation<T extends { language: Language }>(
  translations: Record<Language, T> | undefined,
  language: Language
): T | undefined {
  if (!translations) return undefined;
  return translations[language] || Object.values(translations)[0];
}

/**
 * Build a names record from separate name inputs
 */
export function buildNamesRecord(zhName: string, enName: string): Record<Language, string> {
  return {
    ZH: zhName,
    EN: enName,
  };
}
