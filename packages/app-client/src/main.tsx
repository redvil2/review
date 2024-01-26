import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { SENTRY_DSN } from './constants';
import './fonts';
import './i18n';
import { Routes } from './routes';

if (SENTRY_DSN) {
  import('./sentry');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <Routes />
  </StrictMode>,
);
