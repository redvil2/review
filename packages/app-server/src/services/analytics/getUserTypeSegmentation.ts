import { type DatabaseConnection } from 'slonik';

import { groupCountVisitsInWindow } from './utils/groupCountVisitsInWindow';

export async function getUserTypeSegmentation(
  connection: DatabaseConnection,
  orderId: number,
  period: string,
  length: number,
) {
  const results = await groupCountVisitsInWindow(connection, {
    orderId,
    period,
    length,
    columnName: 'returning',
  });

  return results.map(({ key, count }) => ({
    key: key ? 'returning' : 'new',
    count: count,
  })) as {
    key: 'returning' | 'new';
    count: number;
  }[];
}
