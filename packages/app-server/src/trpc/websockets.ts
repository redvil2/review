import { applyWSSHandler } from '@trpc/server/adapters/ws';

import { createExpressTrpcContext } from './context';
import { coreRouter } from './router';

export function createWSSHandler(wss) {
  return applyWSSHandler({
    wss,
    router: coreRouter,
    createContext: createExpressTrpcContext,
  });
}
