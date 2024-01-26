import { Readable } from 'stream';

import { PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

import { s3Client } from './s3-client';

interface S3UploadStreamParams {
  Body: Extract<PutObjectCommandInput['Body'], Readable>;
  Bucket: PutObjectCommandInput['Bucket'];
  Key: PutObjectCommandInput['Key'];
}

export const s3UploadStream = async (params: S3UploadStreamParams) => {
  const upload = new Upload({
    client: s3Client,
    params,
  });

  await upload.done();
};
