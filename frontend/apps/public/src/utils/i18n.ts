import type { Language } from '@/types';

export function getLocalizedName(names: Record<Language, string> | undefined, language: Language): string {
  if (!names) return '';
  return names[language] || Object.values(names)[0] || '';
}

export function getArticleTranslation<T extends { language: Language }>(
  translations: Record<Language, T> | undefined, language: Language
): T | undefined {
  if (!translations) return undefined;
  return translations[language] || Object.values(translations)[0];
}

export function buildNamesRecord(zhName: string, enName: string): Record<Language, string> {
  return { ZH: zhName as Language, EN: enName as Language };
}