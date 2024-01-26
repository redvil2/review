import { PrintingMethod, QRType, Shape } from '@app/prisma';
import { createContext, useContext, useState } from 'react';

import { DEFAULT_QR_DOMAIN, DownloadFormat } from '../../constants';

interface AddLabelState {
  color: string;
  shape: Shape;
  target: string | null;
  qrDomain: string;
  fallback: string | null;
  amount: string;
  printingMethod: PrintingMethod | null;
  qrType: QRType | null;
  projectName: string;
  printProvider: string;
  labelCustomer: string;
  orderNo: string;
  label: string;
  article: string;
  image: {
    name: string;
    dataUri?: string;
  } | null;
  format: DownloadFormat | null;
}

export const defaultAddLabelState: AddLabelState = {
  color: '000000',
  shape: 'ROUND',
  qrDomain: DEFAULT_QR_DOMAIN,
  target: null,
  fallback: null,
  amount: '',
  printingMethod: null,
  qrType: null,
  projectName: '',
  printProvider: '',
  labelCustomer: '',
  orderNo: '1',
  label: '',
  article: '',
  image: {
    result: null,
    name: '',
  },
  format: null,
};

type GlobalState = {
  addLabels: AddLabelState;
};

const InterimContext = createContext<ReturnType<typeof useGlobalState> | null>(
  null,
);

export const useGlobalState = (): {
  globalState: GlobalState;
  setGlobalState: (state: GlobalState) => void;
} => {
  const context = useContext(InterimContext);
  if (context === null) {
    throw new Error('useGlobalState should be used inside GlobalStateProvider');
  }
  return context;
};

/**
 * Provides a global state context to the application.
 *
 * @description This component is used to manage and provide
 * access to a global state. It is only used when the application needs to save state between pages without an API update.
 *
 * @param {{ children: React.ReactNode }} props - The component props containing children elements to be rendered within the provider.
 * @returns {JSX.Element} A JSX element to provide global state context to its children.
 *
 * @function GlobalStateProvider
 */
export const GlobalStateProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState<GlobalState>({
    addLabels: defaultAddLabelState,
  });

  return (
    <InterimContext.Provider value={{ globalState, setGlobalState }}>
      {children}
    </InterimContext.Provider>
  );
};
