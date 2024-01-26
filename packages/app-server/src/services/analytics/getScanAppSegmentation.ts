import { type DatabaseConnection } from 'slonik';

import { groupCountVisitsInWindow } from './utils/groupCountVisitsInWindow';

export async function getScanAppSegmentation(
  connection: DatabaseConnection,
  orderId: number,
  period: string,
  length: number,
) {
  return groupCountVisitsInWindow(connection, {
    orderId,
    period,
    length,
    columnName: 'scan_app',
  }) as Promise<
    {
      key: 'camera' | 'wechat';
      count: number;
    }[]
  >;
}
