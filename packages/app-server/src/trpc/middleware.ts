import { logError } from '@app/shared-backend-logger';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import type { Router } from 'express';

import { createExpressTrpcContext } from './context';
import { coreRouter } from './router';

export function installMiddleware(app: Router) {
  app.use(
    '/trpc',
    createExpressMiddleware({
      onError(opts) {
        if (opts.error.code !== 'INTERNAL_SERVER_ERROR') {
          return;
        }

        logError(opts.error.cause ?? opts.error, {
          request: opts.req,
          auth: opts.ctx?.auth,
          extra: {
            type: opts.type,
            path: opts.path,
            input: opts.input,
          },
        });
      },
      router: coreRouter,
      createContext: createExpressTrpcContext,
    }),
  );

  const isDev = process.env.NODE_ENV?.startsWith('dev');

  if (isDev) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { renderTrpcPanel } = require('@dmatora/trpc-panel');

    app.use('/panel', (_, res) => {
      return res.send(
        renderTrpcPanel(coreRouter, {
          url: '/trpc',
          transformer: 'superjson',
        }),
      );
    });
  }
}
