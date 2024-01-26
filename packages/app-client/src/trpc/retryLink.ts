import type { TRPCLink } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import type { Unsubscribable } from '@trpc/server/observable';
import { observable } from '@trpc/server/observable';

export type RetryLinkOptions = {
  onError: (
    error,
    operation,
    attemptCount,
  ) => void | Promise<void> | boolean | Promise<boolean | null | void>;
};

/**
 * Creates a retry link for a TRPC router.
 *
 * @description This function returns a TRPC link that allows retrying failed requests.
 * It wraps the provided `next` link and handles retry logic based on the `onError` callback.
 * When a request fails with an 'UNAUTHORIZED' error code, it can be retried based on the
 * logic specified in the `onError` callback.
 *
 * @template TRouter - The type of the TRPC router.
 * @param {RetryLinkOptions} onError - The options for the retry link, including the error handler.
 * @returns {TRPCLink<TRouter>} A TRPC link function that can be used with TRPC.
 *
 * @function retryLink
 */

export const retryLink = <TRouter extends AnyRouter = AnyRouter>({
  onError,
}: RetryLinkOptions): TRPCLink<TRouter> => {
  return () => {
    return ({ next, op }) => {
      return observable(observer => {
        let subscription: Unsubscribable | null = null;
        let attemptCount = 0;

        function sendRequest() {
          attemptCount++;

          subscription?.unsubscribe();

          subscription = next(op).subscribe({
            async error(err) {
              if (err.data?.code === 'UNAUTHORIZED') {
                const shouldRetry = await onError(err, op, attemptCount);

                if (shouldRetry) {
                  sendRequest();
                  return;
                }
              }

              observer.error(err);
            },
            next(value) {
              observer.next(value);
            },
            complete() {
              observer.complete();
            },
          });
        }

        sendRequest();

        return () => {
          subscription?.unsubscribe();
        };
      });
    };
  };
};
