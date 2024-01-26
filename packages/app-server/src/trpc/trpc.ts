import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';

import type { TRPCContext } from './context';

export const trpc = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return {
      ...shape,
      message:
        (shape.data?.httpStatus ?? 500) === 500
          ? 'Internal Server Error'
          : shape.message,
    };
  },
});

export const routerFactory = trpc.router;
export const publicProcedure = trpc.procedure;
export const mergeRouters = trpc.mergeRouters;

export type TRPCContextAuthorized = TRPCContext & {
  auth: { userId: number };
};

const isAuthorized = (ctx: TRPCContext): ctx is TRPCContextAuthorized => {
  return typeof ctx?.auth?.userId === 'number' && ctx.auth.userId > 0;
};

const isAuthed = trpc.middleware(({ next, ctx }) => {
  if (!isAuthorized(ctx)) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx });
});

export const protectedProcedure = trpc.procedure.use(isAuthed);
