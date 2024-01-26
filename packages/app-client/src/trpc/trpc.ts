import { CoreRouter } from '@app/core/trpc/router';
import { createTRPCReact, TRPCClientErrorLike } from '@trpc/react-query';

export const trpc = createTRPCReact<CoreRouter>();
export type TRPCClientErrorCore = TRPCClientErrorLike<CoreRouter>;
