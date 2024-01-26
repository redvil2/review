import { DeleteObjectCommand } from '@aws-sdk/client-s3';

import { s3Client } from './s3-client';
import { S3Object } from './s3.types';

export const s3RemoveFile = async ({
  s3Bucket,
  s3Key,
}: S3Object): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: s3Bucket,
    Key: s3Key,
  });

  await s3Client.send(command);
};
