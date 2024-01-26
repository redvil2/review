import { User, UserSettings } from '@app/prisma';
import { useQueryClient } from '@tanstack/react-query';
import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { trpc } from '@app/client/trpc';

import { AuthContext, OnLoginParams } from './AuthContext';
import { authEvents } from './authEvents';
import { clearTokens, setTokens } from './localstorage';

/**
 * Provides an authentication context for the application.
 *
 * @description This component manages the authentication state, user information, and user settings.
 * It utilizes a TRPC query to fetch authentication data and sets up handlers for login and logout actions.
 * On login, it updates the user and authentication states, and navigates to either the onboarding or labels page
 * based on the user's onboard status. On logout, it clears the authentication state and navigates to the signin page.
 * The authentication state and relevant handlers are made available to the application through the `AuthContext`.
 *
 * @param {PropsWithChildren} props - The component props containing children elements.
 * @returns {JSX.Element} JSX element to provide authentication context to its children.
 *
 * @function AuthContextProvider
 */
export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isFetched, setIsFetched] = useState<boolean>(false);
  const [user, setUser] = useState<User | undefined>();
  const [userSettings, setUserSettings] = useState<UserSettings | undefined>();
  const meQuery = trpc.user.me.useQuery(undefined, {
    enabled: !isFetched,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const onLogin = (params: OnLoginParams) => {
    const { user, userSettings, accessToken, refreshToken } = params;
    setTokens(accessToken, refreshToken);
    setUser(user);
    setIsAuthenticated(true);
    setUserSettings(userSettings);

    const defaultPath = userSettings.onboard ? '/onboarding' : '/labels';
    const origin = location.state?.from?.pathname || defaultPath;
    navigate(origin);
  };

  const onLogout = () => {
    clearTokens();
    setUser(undefined);
    setIsAuthenticated(false);
    queryClient.removeQueries();
    queryClient.invalidateQueries();

    navigate('/signin');
  };

  useEffect(() => {
    if (meQuery.isFetched) {
      setIsAuthenticated(!!meQuery.data?.user);
      if (meQuery.data?.user) {
        setUser(meQuery.data.user);
        setUserSettings(meQuery.data.userSettings);
      }
      setIsFetched(true);
    }
  }, [meQuery.isFetched]);

  useEffect(() => {
    authEvents.on('unauthorized', onLogout);

    return () => {
      authEvents.off('unauthorized', onLogout);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        userSettings,
        onLogin,
        onLogout,
        setUser,
        setUserSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
