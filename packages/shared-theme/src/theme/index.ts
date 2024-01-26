import {
  extendTheme,
  useTheme as useThemeC,
  Theme as ThemeC,
} from '@chakra-ui/react';

import colors from './colors';
import { components } from './components';
import darkTheme from './darkTheme';
import lightTheme from './lightTheme';

const customTheme = {
  config: {
    useSystemColorMode: true,
  },
  colors: {
    key: colors.keyColors,
    light: lightTheme,
    dark: darkTheme,
  },
  fonts: {
    body: 'Jost, sans-serif',
  },
  components,
};

export type Theme = typeof customTheme & Omit<ThemeC, 'colors'>;

export const theme = extendTheme(customTheme) as Theme;
export const useTheme = useThemeC as () => Theme;
