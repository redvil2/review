import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { FC, PropsWithChildren, useState } from 'react';

/**
 * Component for setting up the React Query environment.
 *
 * @description This component initializes and provides the React Query environment for the application.
 * It creates a new instance of `QueryClient` and wraps the children components with the `QueryClientProvider`.
 * This setup is essential for managing server state in the application using React Query, allowing efficient
 * data fetching, caching, and state synchronization.
 *
 * @param {PropsWithChildren} props - Props containing children elements to be rendered within the React Query context.
 * @returns {JSX.Element} A JSX element that renders its children within the React Query environment.
 *
 * @function SetupReactQuery
 */
export const SetupReactQuery: FC<PropsWithChildren> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
