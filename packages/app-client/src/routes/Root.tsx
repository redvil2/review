import { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { useScrollToTop } from '../hooks/useScrollToTop';
import { Setup } from '../setup';

import { GlobalStateProvider } from './InterimContext/ContextProvider';

export const Root: FC = () => {
  useScrollToTop();
  return (
    <GlobalStateProvider>
      <Setup>
        <Outlet />
      </Setup>
    </GlobalStateProvider>
  );
};
