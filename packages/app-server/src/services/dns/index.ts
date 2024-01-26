import { resolveCname, resolveNs, setServers } from 'node:dns/promises';

const EMPTY_DNS_CODES = ['ENOTFOUND', 'ESERVFAIL', 'ENODATA'];

setServers(['8.8.8.8', '1.1.1.1']);

export async function resolveCnameSafely(name: string) {
  try {
    return await resolveCname(name);
  } catch (err: any) {
    if (EMPTY_DNS_CODES.includes(err.code)) {
      return [];
    }

    throw err;
  }
}

export async function resolveNsSafely(name: string) {
  try {
    return await resolveNs(name);
  } catch (err: any) {
    if (EMPTY_DNS_CODES.includes(err.code)) {
      return [];
    }

    throw err;
  }
}
