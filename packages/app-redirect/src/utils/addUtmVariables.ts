import { URL } from 'url';

export function addUtmVariables(url, { domainName, slug, serialNumber }) {
  if (!url) return url;

  const parsedUrl = new URL(url);

  parsedUrl.searchParams.set('utm_source', domainName);
  parsedUrl.searchParams.set('utm_medium', 'qr_code');
  parsedUrl.searchParams.set('utm_campaign', slug);

  if (serialNumber) {
    parsedUrl.searchParams.set('utm_content', serialNumber);
  }

  return parsedUrl.toString();
}
