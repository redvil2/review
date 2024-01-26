import { readFileSync } from 'node:fs';

import { CityResponse, Reader } from 'maxmind';
import { load } from 'ts-dotenv';

const { MMDB_CITY_FILE } = load({
  MMDB_CITY_FILE: {
    type: String,
    default: 'GeoLite2-City.mmdb',
  },
});

const buffer = readFileSync(MMDB_CITY_FILE);
const lookup = new Reader<CityResponse>(buffer);

export function lookupIPLocation(ip: string) {
  const result = lookup.get(ip);

  if (!result) {
    return null;
  }

  return {
    city: result.city?.names.en,
    countryCode: result.country?.iso_code,
  };
}
