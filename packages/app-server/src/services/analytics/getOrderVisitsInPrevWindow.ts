import { sql, type DatabaseConnection } from 'slonik';

import { createWindowStartFragment } from './utils/createWindowStartFragment';

export async function getOrderVisitsInPrevWindow(
  connection: DatabaseConnection,
  orderId: number,
  period: string,
  length: number,
) {
  return connection.oneFirst(sql.unsafe`
    SELECT COUNT(1)::int AS count
    FROM visits
    WHERE order_id = ${orderId}
      AND visited_at > ${createWindowStartFragment(period, length * 2)}
      AND visited_at < ${createWindowStartFragment(period, length)}
  `);
}
