import type { CoreRouter } from '@app/core/trpc/router';
import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  wsLink,
  splitLink,
} from '@trpc/client';
import { useState } from 'react';
import superjson from 'superjson';

import { authEvents } from '../auth/authEvents';

import { retryLink } from './retryLink';
import { trpc } from './trpc';

export interface UseTrpcClientOptions {
  url: string;
  getAccessToken: () => string | undefined;
  getRefreshToken: () => string | undefined;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

/**
 * Custom hook for creating and managing a TRPC (TypeScript RPC) client with token handling.
 *
 * @description This hook provides a TRPC client that is configured to handle JWT token
 * authentication. It includes functionality for refreshing tokens and automatically
 * handling token expiration and unauthorized requests.
 *
 * @param {UseTrpcClientOptions} options - The hook's options.
 * @param {string} options.url - The URL for the TRPC server.
 * @param {() => Promise<string | null>} options.getAccessToken - A function to retrieve the access token.
 * @param {() => Promise<string | null>} options.getRefreshToken - A function to retrieve the refresh token.
 * @param {(tokens: { accessToken: string | null, refreshToken: string | null }) => void} options.setTokens - A function to set the access and refresh tokens.
 * @returns {Object} An object containing the configured TRPC client.
 * @property {TRPCClient<CoreRouter>} trpcClient - The configured TRPC client.
 */
export const useTrpcClient = (options: UseTrpcClientOptions) => {
  const { url, getAccessToken, getRefreshToken, setTokens } = options;

  // Helper client for fetching new JWT pair
  const helperTrpcClient = createTRPCProxyClient<CoreRouter>({
    transformer: superjson,
    links: [
      httpBatchLink({
        url,
      }),
    ],
  });

  async function refreshToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return false;
    }

    const tokens = await helperTrpcClient.token.refresh.query({
      refreshToken,
    });

    setTokens(tokens.access, tokens.refresh);

    return true;
  }

  const [trpcClient] = useState(() =>
    trpc.createClient({
      transformer: superjson,
      links: [
        retryLink({
          onError: async (err, operation, attemptCount) => {
            if (err.data?.code !== 'UNAUTHORIZED') {
              return;
            }

            if (attemptCount <= 1) {
              try {
                if (await refreshToken()) {
                  return true;
                }
              } catch (e) {
                // Ignored
              }
            }

            authEvents.emit('unauthorized');
          },
        }),
        splitLink({
          condition: op => op.type === 'subscription',
          true: wsLink({
            client: createWSClient({
              url: url
                .replace('http://', 'ws://')
                .replace('https://', 'wss://'),
              retryDelayMs: () => 1000,
            }),
          }),
          false: httpBatchLink({
            url,
            async headers() {
              const token = getAccessToken();
              return token ? { authorization: `Bearer ${token}` } : {};
            },
          }),
        }),
      ],
    }),
  );

  return { trpcClient };
};
