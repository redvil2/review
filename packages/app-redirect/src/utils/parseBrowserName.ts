import UAParser from 'ua-parser-js';

export function parseBrowserName(userAgent: string) {
  const parser = new UAParser(userAgent);

  return parser.getBrowser().name;
}
