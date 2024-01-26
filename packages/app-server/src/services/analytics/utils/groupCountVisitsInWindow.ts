import { sql, type DatabaseConnection } from 'slonik';

import { createWindowStartFragment } from './createWindowStartFragment';

export async function groupCountVisitsInWindow(
  connection: DatabaseConnection,
  {
    orderId,
    columnName,
    period,
    length,
    orderByKey,
  }: {
    orderId: number;
    columnName?: string;
    period: string;
    length: number;
    orderByKey?: boolean;
  },
) {
  const groupBy = columnName
    ? sql.identifier([columnName])
    : sql.fragment`date_trunc(${sql.literalValue(period)}, visited_at)`;

  const { rows } = await connection.query(sql.unsafe`
    SELECT
      ${groupBy} AS key,
      COUNT(1)::int AS count
    FROM visits
    WHERE
      order_id = ${orderId}
      AND visited_at > ${createWindowStartFragment(period, length)}
    GROUP BY ${groupBy}
    ORDER BY ${orderByKey ? groupBy : sql.fragment`COUNT(1) DESC`}
  `);

  return rows as { key: string; count: number }[];
}
