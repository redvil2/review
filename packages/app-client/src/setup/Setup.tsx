import { SetupChakra } from '@app/shared/ui/theme';
import { FC, PropsWithChildren } from 'react';

import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  SetupAuth,
} from '@app/client/auth';
import { SetupTrpc } from '@app/client/trpc';

import { Intl } from './SetupIntl';
import { SetupReactQuery } from './SetupReactQuery';

/**
 * High-level component to set up the application environment.
 *
 * @description This component wraps the application with various setup components required for its functioning.
 * It initializes Chakra UI, React Query, tRPC, and authentication contexts. The tRPC setup is configured with URLs
 * and token management functions. It also includes an internationalization context wrapper. This structure ensures
 * that the necessary providers and configurations are in place for the application to work correctly.
 *
 * @param {PropsWithChildren} props - Props passed to the component, primarily for rendering children components.
 * @returns {JSX.Element} A JSX element providing the structured setup for the application.
 *
 * @function Setup
 */
export const Setup: FC<PropsWithChildren> = props => {
  const trpcUrl = import.meta.env.VITE_TRPC_URL;

  return (
    <SetupChakra>
      <SetupReactQuery>
        <SetupTrpc
          trpcUrl={trpcUrl}
          setTokens={setTokens}
          getAccessToken={getAccessToken}
          getRefreshToken={getRefreshToken}
        >
          <SetupAuth>
            <Intl>{props.children}</Intl>
          </SetupAuth>
        </SetupTrpc>
      </SetupReactQuery>
    </SetupChakra>
  );
};
