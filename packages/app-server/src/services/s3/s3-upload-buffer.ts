import { Readable } from 'stream';

import { PutObjectCommandInput } from '@aws-sdk/client-s3';

import { s3UploadStream } from './s3-upload-stream';

interface S3UploadBufferParams {
  Body: Buffer;
  Bucket: PutObjectCommandInput['Bucket'];
  Key: PutObjectCommandInput['Key'];
}

function bufferToStream(buffer: Buffer): Readable {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Indicates EOF (End of File)
  return stream;
}

export const s3UploadBuffer = async (params: S3UploadBufferParams) => {
  const { Body, Bucket, Key } = params;
  const fileStream = bufferToStream(Body);

  return await s3UploadStream({
    Body: fileStream,
    Bucket,
    Key,
  });
};
