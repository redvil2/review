import { radioAnatomy } from '@chakra-ui/anatomy';
import {
  ThemeComponents,
  defineStyle,
  createMultiStyleConfigHelpers,
} from '@chakra-ui/react';

import { switchColor } from '../../switch-color';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(radioAnatomy.keys);

const baseStyleControl = defineStyle(({ colorMode }) => ({
  bg: 'none',
  borderColor: switchColor(colorMode).outlineVariant,

  _checked: {
    bg: 'none',
    borderColor: switchColor(colorMode).primary,
    color: switchColor(colorMode).primary,

    _hover: {
      bg: 'none',
    },
  },

  _disabled: {
    borderColor: switchColor(colorMode).error,
  },
}));

const baseStyle = definePartsStyle(props => ({
  control: baseStyleControl(props),
}));

export const Radio: ThemeComponents = {
  Radio: defineMultiStyleConfig({ baseStyle }),
};