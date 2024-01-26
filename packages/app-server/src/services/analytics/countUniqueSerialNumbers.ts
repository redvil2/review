import { sql, type DatabaseConnection } from 'slonik';

export async function countUniqueSerialNumbers(
  connection: DatabaseConnection,
  orderId: number,
) {
  return connection.oneFirst(sql.unsafe`
    SELECT COUNT(DISTINCT serial_number)::int AS count
    FROM visits
    WHERE order_id = ${orderId}
  `);
}
