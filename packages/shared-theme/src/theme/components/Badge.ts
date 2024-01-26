import { ThemeComponents } from '@chakra-ui/react';

import { switchColor } from '../../switch-color';
import { FONT_WEIGHT, micro } from '../mixins/typography';

export const Badge: ThemeComponents = {
  Badge: {
    baseStyle: {
      textTransform: 'capitalize',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      maxWidth: 'fit-content',
      padding: '0.1rem 0.5rem',
      ...micro(FONT_WEIGHT.MEDIUM),
    },
    variants: {
      default: ({ colorMode }) => ({
        color: switchColor(colorMode).primary,
        background: switchColor(colorMode).primaryContainer,
      }),
      surface: ({ colorMode }) => ({
        color: switchColor(colorMode).onSurfaceVariant,
        background: switchColor(colorMode).surfaceVariant,
      }),
      surfaceVariant: ({ colorMode }) => ({
        color: switchColor(colorMode).onSurfaceVariant,
        background: switchColor(colorMode).surfaceVariant,
      }),
      tertiary: ({ colorMode }) => ({
        color: switchColor(colorMode).tertiary,
        background: switchColor(colorMode).tertiaryContainer,
      }),
      aqua: ({ colorMode }) => ({
        color: switchColor(colorMode).extended.aqua.color,
        background: switchColor(colorMode).extended.aqua.colorContainer,
      }),
      sun: ({ colorMode }) => ({
        color: switchColor(colorMode).extended.sun.color,
        background: switchColor(colorMode).extended.sun.colorContainer,
      }),
      grass: ({ colorMode }) => ({
        color: switchColor(colorMode).extended.grass.color,
        background: switchColor(colorMode).extended.grass.colorContainer,
      }),
    },
    defaultProps: {
      variant: 'default',
    },
  },
};
