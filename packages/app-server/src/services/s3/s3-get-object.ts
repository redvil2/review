import { GetObjectCommand } from '@aws-sdk/client-s3';

import { s3Client } from './s3-client';

export interface S3GetObjectParams {
  s3Key: string;
  s3Bucket: string;
}

export const isGetS3ObjectParams = (arg: unknown): arg is S3GetObjectParams => {
  if (typeof arg !== 'object' || arg === null) return false;
  return arg && 's3Key' in arg && 's3Bucket' in arg;
};

export const s3GetObject = async (params: S3GetObjectParams) => {
  const { s3Bucket, s3Key } = params;

  const results = await s3Client.send(
    new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3Key,
    }),
  );

  return results.Body;
};
