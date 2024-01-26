import { modalAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';

import { switchColor } from '../../switch-color';
import { FONT_WEIGHT, headline3 } from '../mixins/typography';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle(({ colorMode }) => ({
  dialog: {
    bg: switchColor(colorMode).surface, // TODO: change to surface2 when implemented
  },
  closeButton: {
    color: switchColor(colorMode).primary,
    _hover: {
      color: switchColor(colorMode).onPrimaryContainer,
      bg: 'transparent',
    },
  },
  header: {
    marginTop: '3rem',
    ...headline3(FONT_WEIGHT.SEMI_BOLD),
    textAlign: 'center',
    color: switchColor(colorMode).onPrimaryContainer,
    whiteSpace: 'pre-line',
  },
}));

export const modalTheme = defineMultiStyleConfig({
  baseStyle,
});
