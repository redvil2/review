import { mkdir } from 'fs/promises';

import { load } from 'ts-dotenv';

import { downloadItem } from '../external/s3/downloadItem';
import { uploadStream } from '../external/s3/uploadStream';
import { GeneratorRequest } from '../models/GeneratorRequest';
import { spawnWorker } from '../process/spawnWorker';
import { createZipStream } from '../utils/createZipStream';
import { progress } from '../utils/progress';

import { reportProgress } from './reportProgress';
import { reportResult } from './reportResult';

const { GENERATOR_OUTPUT_BUCKET_NAME, GENERATOR_THREAD_COUNT } = load({
  GENERATOR_OUTPUT_BUCKET_NAME: String,
  GENERATOR_THREAD_COUNT: Number,
});

export async function runGenerator({
  amount,
  externalId,
  shortUrl,
  imageBucket,
  imageKey,
  styling,
  format,
  outputPath,
}: GeneratorRequest) {
  const image =
    imageBucket && imageKey
      ? await downloadItem(imageBucket, imageKey)
      : undefined;

  await mkdir('/tmp/qrs', { recursive: true });

  const generatedSerialNumbers = [] as string[];
  let done = 0;

  async function onProgress(serialNumber: string) {
    generatedSerialNumbers.push(serialNumber);
    done++;

    if (generatedSerialNumbers.length >= 0.01 * amount) {
      const serialNumbers = generatedSerialNumbers.splice(
        0,
        generatedSerialNumbers.length,
      );

      await reportProgress({
        externalId,
        progress: progress(done, amount),
        serialNumbers,
      });
    }
  }

  await Promise.all(
    Array.from({ length: GENERATOR_THREAD_COUNT }).map((x, i) =>
      spawnWorker({
        amount,
        offset: i,
        threads: GENERATOR_THREAD_COUNT,
        url: shortUrl,
        image,
        styling,
        format,
        onProgress,
        baseDir: '/tmp/qrs',
      }),
    ),
  );

  const zipJob = createZipStream({
    path: '/tmp/qrs',
  });

  await Promise.all([
    uploadStream({
      bucketName: GENERATOR_OUTPUT_BUCKET_NAME,
      key: outputPath,
      stream: zipJob.stream,
      contentType: 'application/zip',
    }),
    zipJob.promise,
  ]);

  await Promise.all([
    reportProgress({
      externalId,
      progress: 100,
      serialNumbers: generatedSerialNumbers,
    }),
    reportResult({
      externalId,
      bucketName: GENERATOR_OUTPUT_BUCKET_NAME,
      key: outputPath,
    }),
  ]);
}
