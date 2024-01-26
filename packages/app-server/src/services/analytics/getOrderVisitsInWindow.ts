import { sql, type DatabaseConnection } from 'slonik';

import { createWindowStartFragment } from './utils/createWindowStartFragment';

export async function getOrderVisitsInWindow(
  connection: DatabaseConnection,
  orderId: number,
  period: string,
  length: number,
) {
  return connection.oneFirst(sql.unsafe`
    SELECT COUNT(1)::int AS count
    FROM visits
    WHERE order_id = ${orderId}
      AND visited_at > ${createWindowStartFragment(period, length)}
  `);
}
