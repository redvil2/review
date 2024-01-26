import { useContext } from 'react';

import { AuthContext } from './AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};

/**
 * @description Custom React hook to access authentication-related data and functions within private routes.
 *
 * @throws {Error} Throws an error if `user` or `userSettings` is undefined, indicating misuse outside private routes.
 * @returns {{ user: object, userSettings: object, onLogout: function, setUser: function, setUserSettings: function }}
 * An object containing user data, user settings, and relevant functions.
 *
 * @function useAuthPrivate
 */
export const useAuthPrivate = () => {
  const { user, userSettings, onLogout, setUser, setUserSettings } =
    useContext(AuthContext);
  if (!user || !userSettings) {
    throw new Error(
      "user and userSettings can't be undefined inside private routes",
    );
  }
  return {
    user: user,
    userSettings: userSettings,
    onLogout,
    setUser,
    setUserSettings,
  };
};
