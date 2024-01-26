import { FC, PropsWithChildren } from 'react';

import { AuthContextProvider } from './AuthContextProvider';

export const SetupAuth: FC<PropsWithChildren> = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};
