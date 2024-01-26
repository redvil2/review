import { wrapHandler } from '@app/shared-lambda-logger';
import type { Handler } from 'aws-lambda';

import { qrEncode } from './external/qr/qrEncode';
import { downloadItem } from './external/s3/downloadItem';

export const handler: Handler = wrapHandler(async body => {
  const image =
    body.imageBucket && body.imageKey
      ? await downloadItem(body.imageBucket, body.imageKey)
      : undefined;

  const data = await qrEncode({
    url: body.url,
    image,
    styling: {
      shape: body.styling.shape,
      foreground: body.styling.foreground,
      background: body.styling.background,
    },
  }).toBuffer(body.format);

  return {
    successful: true,
    data: data.toString('base64'),
  };
});
