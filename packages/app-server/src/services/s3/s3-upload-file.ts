import { createReadStream } from 'node:fs';

import { s3UploadStream } from './s3-upload-stream';

export interface S3UploadFileParams {
  filePath: string;
  s3Key: string;
  s3Bucket: string;
}

export const s3UploadFile = async (params: S3UploadFileParams) => {
  const { filePath, s3Key, s3Bucket } = params;

  const readStream = createReadStream(filePath);

  await s3UploadStream({
    Bucket: s3Bucket,
    Key: s3Key,
    Body: readStream,
  });

  return {
    s3Bucket,
    s3Key,
  };
};
