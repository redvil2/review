import { sql } from 'slonik';

export function createWindowStartFragment(period: string, length: number) {
  return sql.fragment`NOW() - INTERVAL ${sql.literalValue(
    `${length} ${period}`,
  )}`;
}
