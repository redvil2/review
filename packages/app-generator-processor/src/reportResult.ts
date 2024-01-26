import type { SNSHandler } from 'aws-lambda';

import { pool } from './database';

export const handler: SNSHandler = async event => {
  if (event.Records.length !== 1) {
    throw new Error('Expected exactly one record');
  }

  const message = JSON.parse(event.Records[0].Sns.Message);

  await pool.query(
    `
      UPDATE orders
      SET
        qr_codes_bucket_name = $1,
        qr_codes_key = $2,
        status = 'IDLE'
      WHERE id = $3
    `,
    [message.bucketName, message.key, message.externalId],
  );
};
