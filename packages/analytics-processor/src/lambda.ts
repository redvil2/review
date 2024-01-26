import { wrapHandler } from '@app/shared-lambda-logger';
import type { SQSHandler } from 'aws-lambda';
import createPgPromise from 'pg-promise';
import { ulid } from 'ulid';

const pgp = createPgPromise();

import { pool } from './database';

export const handler: SQSHandler = wrapHandler(async event => {
  const messages = event.Records.map(x => JSON.parse(x.body));

  const processed = messages.map(event => {
    const message = JSON.parse(event.Message);

    return {
      id: ulid(),
      order_id: message.orderId,
      serial_number: message.serialNumber,
      country_code: message.countryCode,
      city: message.city,
      browser_name: message.browserName,
      returning: message.returning ?? false,
      visited_at: message.visitedAt,
      scan_app: message.scanApp ?? 'camera',
    };
  });

  await pool.query(
    pgp.helpers.insert(processed, Object.keys(processed[0]), 'visits'),
  );
});
