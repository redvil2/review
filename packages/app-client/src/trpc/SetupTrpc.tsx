import { useQueryClient } from '@tanstack/react-query';
import React, { FC, PropsWithChildren } from 'react';

import { trpc } from './trpc';
import { useTrpcClient } from './useTrpcClient';

export interface SetupTrpcProps extends PropsWithChildren {
  trpcUrl: string;
  getAccessToken: () => string | undefined;
  getRefreshToken: () => string | undefined;
  setTokens: (accessToken: string, refreshToken: string) => void;
}

/**
 * Setup component for TRPC (TypeScript RPC) integration.
 *
 * @description This component sets up TRPC with the provided configuration and makes it available
 * throughout the app using the `trpc.Provider`. It initializes the TRPC client with the specified
 * URL, access token retrieval, refresh token retrieval, and token setting functions.
 *
 * @param {SetupTrpcProps} props - The component's props.
 * @param {string} props.trpcUrl - The URL for the TRPC server.
 * @param {() => Promise<string | null>} props.getAccessToken - A function to retrieve the access token.
 * @param {() => Promise<string | null>} props.getRefreshToken - A function to retrieve the refresh token.
 * @param {(tokens: { accessToken: string | null, refreshToken: string | null }) => void} props.setTokens - A function to set the access and refresh tokens.
 * @returns {JSX.Element} The JSX element representing the TRPC setup.
 *
 * @component
 */
export const SetupTrpc: FC<SetupTrpcProps> = props => {
  const { children, trpcUrl, getAccessToken, getRefreshToken, setTokens } =
    props;
  const queryClient = useQueryClient();

  const { trpcClient } = useTrpcClient({
    url: trpcUrl,
    getAccessToken,
    getRefreshToken,
    setTokens,
  });

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
};
