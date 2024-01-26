import { EventEmitter } from 'events';
import { IncomingMessage } from 'http';

import type { inferAsyncReturnType } from '@trpc/server';
import type { CreateExpressContextOptions } from '@trpc/server/adapters/express';
import { NodeHTTPCreateContextFnOptions } from '@trpc/server/adapters/node-http';
import ws from 'ws';

import { prisma } from '../services/db/prisma';
import { decodeJwtToken } from '../services/jwt';

export const trcpEventEmitter = new EventEmitter();

export const createExpressTrpcContext = async (
  options:
    | CreateExpressContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>,
) => {
  let userId: number | null = null;

  const authorization = options.req.headers.authorization;
  const preferredLanguage = options.req.headers['accept-language'];

  if (authorization) {
    const token = authorization.split(' ')[1]; // Bearer <token>
    const decodedToken = decodeJwtToken(token);

    if (decodedToken) {
      ({ userId } = decodedToken);
    }
  }

  return {
    prisma,
    auth: { userId },
    preferredLanguage,
  };
};

export type TRPCContext = inferAsyncReturnType<typeof createExpressTrpcContext>;
