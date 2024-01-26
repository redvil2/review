import { SetupChakra } from '@app/shared/ui/theme';
import React from 'react';
import { Helmet } from 'react-helmet';
import { I18nextProvider } from 'react-i18next';

import { i18n } from '../i18n';

const Layout = ({ children }) => (
  <>
    <Helmet
      style={[
        {
          cssText: `.material-symbols-rounded {
            font-family: 'Material Symbols Rounded';
            font-weight: 600;
            font-style: normal;
            font-size: 24px;
            line-height: 1;
            letter-spacing: normal;
            text-transform: none;
            display: inline-block;
            white-space: nowrap;
            word-wrap: normal;
            direction: ltr;
            -webkit-font-feature-settings: 'liga';
            -webkit-font-smoothing: antialiased;
          }`,
        },
      ]}
    >
      <link rel="icon" href="/favicon.png" />
    </Helmet>
    <I18nextProvider i18n={i18n}>
      <SetupChakra>{children}</SetupChakra>
    </I18nextProvider>
  </>
);

export default Layout;
