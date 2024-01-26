import { GetObjectCommand } from '@aws-sdk/client-s3';

import { s3Client } from './client';

export async function downloadItem(bucketName, key) {
  const result = await s3Client.send(
    new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }),
  );

  if (!result.Body) {
    return;
  }

  const byteArray = await result.Body.transformToByteArray();

  return Buffer.from(byteArray);
}
