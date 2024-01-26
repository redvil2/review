import { switchAnatomy } from '@chakra-ui/anatomy';
import {
  ThemeComponents,
  createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

import { switchColor } from '../../switch-color';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const baseStyle = definePartsStyle(({ colorMode }) => ({
  track: {
    bg: switchColor(colorMode).secondaryContainer,
    _checked: {
      bg: switchColor(colorMode).primary,
    },
  },
  thumb: {
    bg: switchColor(colorMode).onPrimary,
  },
}));

export const Switch: ThemeComponents = {
  Switch: defineMultiStyleConfig({ baseStyle }),
};
