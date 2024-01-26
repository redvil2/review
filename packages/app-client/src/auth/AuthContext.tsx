import { User, UserSettings } from '@app/prisma';
import { createContext } from 'react';

export interface OnLoginParams {
  user: User;
  userSettings: UserSettings;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  isAuthenticated: boolean | null;
  user?: User;
  userSettings?: UserSettings;
  // NOTE: not "login" - this way we can decouple how we do the
  //   login itself from the AuthContext.
  //   For example, we can login via email, phone, password, or social
  //   - it is not the AuthContext's concern
  onLogin(params: OnLoginParams): void;
  // same with logout
  onLogout(): void;
  setUser: (user: User) => void;
  setUserSettings: (settings: UserSettings) => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  onLogin: () => {
    return;
  },
  onLogout: () => {
    return;
  },
  setUser: () => {
    return;
  },
  setUserSettings: () => {
    return;
  },
});
