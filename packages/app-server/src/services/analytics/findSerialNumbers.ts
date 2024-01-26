import { sql, type DatabaseConnection } from 'slonik';
import { z } from 'zod';

import { escapeLikeQuery } from '../../utils/escapeLikeQuery';

const outputType = z.object({
  matchingAmount: z.number(),
  serialNumber: z.string(),
  scans: z.number().positive(),
  lastVisitedAt: z.string().nullable(),
});

export async function findSerialNumbers(
  connection: DatabaseConnection,
  orderId: number,
  scanType: 'SCANNED' | 'UNSCANNED' | 'BOTH',
  searchQuery?: string,
) {
  return connection.any(sql.type(outputType)`
    SELECT
        (COUNT(1) OVER())::int AS "matchingAmount",
        serials.serial_number AS "serialNumber",
        COALESCE(visits_agg.scans, 0)::int AS scans,
        to_json(visits_agg.last_visited_at)#>>'{}' AS "lastVisitedAt"
    FROM serials
    LEFT JOIN (
        SELECT order_id, serial_number, COALESCE(COUNT(1), 0) AS scans, MAX(visited_at) AS last_visited_at
        FROM visits
        GROUP BY order_id, serial_number
    ) AS visits_agg
        ON visits_agg.order_id = serials.order_id AND visits_agg.serial_number = serials.serial_number
    WHERE serials.order_id = ${orderId}
        AND (
            (${scanType} = 'BOTH')
                OR (${scanType} = 'SCANNED' AND COALESCE(visits_agg.scans, 0) > 0)
                OR (${scanType} = 'UNSCANNED' AND COALESCE(visits_agg.scans, 0) = 0)
        )
        AND (${
          searchQuery || ''
        } = '' OR serials.serial_number LIKE ${`%${escapeLikeQuery(
          searchQuery,
        )}%`})
    ORDER BY visits_agg.last_visited_at DESC NULLS LAST, serials.serial_number ASC
    LIMIT 100
  `);
}
