import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client } from './s3-client';
import { S3Object } from './s3.types';

export const s3GetPresignedUrl = async ({
  s3Bucket,
  s3Key,
}: S3Object): Promise<{ url: string }> => {
  const command = new GetObjectCommand({
    Bucket: s3Bucket,
    Key: s3Key,
  });

  const url = await getSignedUrl(s3Client, command);

  return { url };
};
