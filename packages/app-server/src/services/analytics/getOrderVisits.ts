import { sql, type DatabaseConnection } from 'slonik';

export async function getOrderVisits(
  connection: DatabaseConnection,
  orderId: number,
) {
  return connection.oneFirst(sql.unsafe`
    SELECT COUNT(1)::int AS count
    FROM visits
    WHERE order_id = ${orderId}
  `);
}
