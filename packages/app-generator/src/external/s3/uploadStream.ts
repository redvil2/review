import { Upload } from '@aws-sdk/lib-storage';

import { s3Client } from './client';

export async function uploadStream({ bucketName, key, stream, contentType }) {
  const parallelUploads3 = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: stream,
      ContentType: contentType,
    },
  });

  await parallelUploads3.done();
}
