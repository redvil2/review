import { findKey } from 'lodash';
import { PropsWithChildren, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '@app/client/auth';

import { languages } from '../constants';

type IntlProps = PropsWithChildren;

/**
 * Component for setting up internationalization based on user settings.
 *
 * @description The `Intl` component is responsible for configuring the application's internationalization (i18n) context
 * based on the user's language preference. It uses the `useAuth` hook to access `userSettings` and `useTranslation` to manage
 * i18n settings. On detecting a change in the user's language settings, it updates the application's language accordingly.
 *
 * @param {IntlProps} props - Props containing children elements to render within the internationalization context.
 * @returns {JSX.Element} A JSX element that renders its children within the configured internationalization context.
 *
 * @function Intl
 */
export const Intl = ({ children }: IntlProps) => {
  const { userSettings } = useAuth();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (userSettings?.language) {
      const key = findKey(
        languages,
        value => value.toUpperCase() === userSettings?.language,
      );
      i18n.changeLanguage(key);
    }
  }, [userSettings?.language, i18n]);

  return <>{children}</>;
};
