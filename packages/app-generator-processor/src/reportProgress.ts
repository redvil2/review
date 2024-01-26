import type { SNSHandler } from 'aws-lambda';

import { pool } from './database';

export const handler: SNSHandler = async event => {
  if (event.Records.length !== 1) {
    throw new Error('Expected exactly one record');
  }

  const message = JSON.parse(event.Records[0].Sns.Message);

  await pool.query('UPDATE orders SET qr_codes_progress = $1 WHERE id = $2', [
    message.progress,
    message.externalId,
  ]);
};
