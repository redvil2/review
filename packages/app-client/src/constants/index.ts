export type {
  OrderStatus,
  PrintingMethod,
  QRType,
  Shape,
  CompanyType,
} from '@app/prisma';

export const languages = {
  da: 'danish',
  de: 'german',
  en: 'english',
  es: 'spanish',
  fr: 'french',
  it: 'italian',
  pt: 'portuguese',
  ro: 'romanian',
  tr: 'turkish',
  zh: 'chinese',
};

export const SENTRY_DSN = import.meta.env.SENTRY_DSN;
export const CORE_API_URL = import.meta.env.VITE_CORE_API_URL;
export const CORE_WEB_URL = import.meta.env.VITE_CORE_WEB_URL;
export const LANDING_URL = import.meta.env.VITE_LANDING_URL;
export const DEFAULT_QR_DOMAIN = import.meta.env.VITE_DEFAULT_QR_DOMAIN;
export const MS_SSO_CLIENT_ID = import.meta.env.VITE_MICROSOFT_SSO_CLIENT_ID;
export const WECHAT_SSO_ENABLE =
  import.meta.env.VITE_WECHAT_SSO_ENABLE === 'true';
export const WECHAT_SSO_APP_ID = import.meta.env.VITE_WECHAT_SSO_APP_ID;
export const WECHAT_SSO_REDIRECT_URL = import.meta.env
  .VITE_WECHAT_SSO_REDIRECT_URL;
export const MS_SSO_REDIRECT_URI = import.meta.env
  .VITE_MICROSOFT_SSO_REDIRECT_URI;

export const APP_REGION = import.meta.env.VITE_REGION;

export const MS_SSO_AUTHORITY = 'https://login.microsoftonline.com/common';

export const FALLBACK_URL = `${CORE_WEB_URL}/fallback`;

export type DownloadFormat = 'PDF' | 'PNG' | 'SVG';
