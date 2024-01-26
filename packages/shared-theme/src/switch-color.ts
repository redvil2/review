import { ColorMode } from '@chakra-ui/react';

import darkTheme from './theme/darkTheme';
import lightTheme from './theme/lightTheme';

export const switchColor = (colorMode: ColorMode) => {
  return colorMode === 'light' ? lightTheme : darkTheme;
};
