import { avatarAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { defineStyle } from '@chakra-ui/system';

import { switchColor } from '../../switch-color';
import { FONT_WEIGHT, micro, paragraph2 } from '../mixins/typography';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(avatarAnatomy.keys);

const baseStyle = definePartsStyle(({ colorMode }) => ({
  excessLabel: {
    bg: switchColor(colorMode).extended.ocean.colorContainer,
    color: switchColor(colorMode).extended.ocean.color,
    ...paragraph2(FONT_WEIGHT.SEMI_BOLD),
    height: '2.6rem',
    minWidth: '2.6rem',
  },
}));

const small = defineStyle({
  width: '2.25rem',
  height: '2.25rem',
  borderWidth: '2px !important',
  'div[role="img"]': {
    ...paragraph2(FONT_WEIGHT.SEMI_BOLD),
  },
});

const xs = defineStyle({
  borderWidth: '1.35px !important',
  'div[role="img"]': {
    ...micro(FONT_WEIGHT.SEMI_BOLD),
  },
});

const sizes = {
  xs: definePartsStyle({ container: xs }),
  sm: definePartsStyle({ container: small }),
};

export const avatarTheme = defineMultiStyleConfig({ baseStyle, sizes });
