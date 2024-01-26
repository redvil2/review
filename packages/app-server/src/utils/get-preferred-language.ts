import { Language } from '@app/prisma';

type GetPreferredLanguageOptions = {
  languageCode: string | undefined;
  browserPreferredLanguage: string | undefined;
  microsoftPreferredLanguage?: string;
};
export function getPreferredLanguage({
  languageCode,
  browserPreferredLanguage,
  microsoftPreferredLanguage,
}: GetPreferredLanguageOptions): Language {
  const preferredLanguageCode =
    languageCode || browserPreferredLanguage || microsoftPreferredLanguage;

  if (!preferredLanguageCode) return Language.ENGLISH;

  const langMapping = {
    en: 'ENGLISH',
    zh: 'CHINESE',
    de: 'GERMAN',
    fr: 'FRENCH',
    es: 'SPANISH',
    da: 'DANISH',
    it: 'ITALIAN',
    pt: 'PORTUGUESE',
    ro: 'ROMANIAN',
    tr: 'TURKISH',
  } as const;

  const normalizedLang = preferredLanguageCode.split('-')[0].toLowerCase();
  const matchedLanguageKey = langMapping[normalizedLang];

  return Language[matchedLanguageKey] || Language.ENGLISH;
}
