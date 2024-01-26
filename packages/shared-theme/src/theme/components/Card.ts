import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

import { switchColor } from '../../switch-color';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle(({ colorMode }) => ({
  container: {
    borderRadius: '1rem',
    bg: switchColor(colorMode).surface,
    boxShadow: 'none',
  },
  body: {
    padding: '4',
  },
}));

export const cardTheme = defineMultiStyleConfig({ baseStyle });
