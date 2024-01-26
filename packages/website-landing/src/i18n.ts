import { i18nInit } from '@app/shared/i18n';

import daTranslations from './locales/da/translation.json';
import deTranslations from './locales/de/translation.json';
import enTranslations from './locales/en/translation.json';
import esTranslations from './locales/es/translation.json';
import frTranslations from './locales/fr/translation.json';
import itTranslations from './locales/it/translation.json';
import ptTranslations from './locales/pt/translation.json';
import roTranslations from './locales/ro/translation.json';
import trTranslations from './locales/tr/translation.json';
import zhTranslations from './locales/zh/translation.json';

export const i18n = i18nInit({
  da: daTranslations,
  de: deTranslations,
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
  it: itTranslations,
  pt: ptTranslations,
  ro: roTranslations,
  tr: trTranslations,
  zh: zhTranslations,
});
