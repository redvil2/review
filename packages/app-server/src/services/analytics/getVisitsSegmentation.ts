import { type DatabaseConnection } from 'slonik';

import { groupCountVisitsInWindow } from './utils/groupCountVisitsInWindow';

export async function getVisitsSegmentation(
  connection: DatabaseConnection,
  orderId: number,
  period: string,
  length: number,
) {
  const results = await groupCountVisitsInWindow(connection, {
    orderId,
    period,
    length,
    orderByKey: true,
  });

  return results.map(({ key, count }) => ({
    key: new Date(key).toISOString(),
    count,
  }));
}
