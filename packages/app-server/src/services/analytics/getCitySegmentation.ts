import { type DatabaseConnection } from 'slonik';

import { groupCountVisitsInWindow } from './utils/groupCountVisitsInWindow';

export async function getCitySegmentation(
  connection: DatabaseConnection,
  orderId: number,
  period: string,
  length: number,
) {
  return groupCountVisitsInWindow(connection, {
    orderId,
    period,
    length,
    columnName: 'city',
  });
}
