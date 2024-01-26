import { fork } from 'child_process';

import { GenerationRequest } from '../generator/produceShare';

const workerPath = require.resolve('./worker');

export function spawnWorker({
  onProgress,
  ...request
}: { onProgress: (sn: string) => void } & GenerationRequest) {
  const child = fork(workerPath, {
    serialization: 'advanced',
  });

  child.on('message', (message: any) => {
    if (message.generatedSerialNumber) {
      onProgress(message.generatedSerialNumber);
    }
  });

  child.send({
    request,
  });

  return new Promise<void>((resolve, reject) => {
    child.on('exit', code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Worker exited with code ${code}`));
      }
    });
  });
}
