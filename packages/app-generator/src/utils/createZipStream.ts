import { spawn } from 'child_process';

export function createZipStream({ path }) {
  const child = spawn('zip', ['-r', '-', '.'], {
    cwd: path,
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  const promise = new Promise<void>((resolve, reject) => {
    child.on('exit', code =>
      code === 0 ? resolve() : reject(new Error(`Exited with code ${code}`)),
    );
    child.on('error', reject);
  });

  return {
    stream: child.stdout,
    promise,
  };
}
