import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

import { switchColor } from '../../switch-color';
import { paragraph1, FONT_WEIGHT } from '../mixins/typography';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys);

const variants = {
  blue: ({ colorMode }) => ({
    button: {
      color: switchColor(colorMode).primary,
    },
  }),
  alignLeft: {
    item: {
      justifyContent: 'flex-start',
    },
  },
  blueAndLeft: ({ colorMode }) => ({
    button: {
      color: switchColor(colorMode).primary,
    },
    item: {
      justifyContent: 'flex-start',
    },
  }),
};

const baseStyle = definePartsStyle(({ colorMode }) => ({
  button: {
    color: switchColor(colorMode).secondary,
    '.material-symbols-rounded': {
      height: '100%',
      alignItems: 'center',
      display: 'flex',
    },
  },
  list: {
    boxShadow:
      '0px 2px 4px -2px rgba(0, 0, 0, 0.06), 0px 4px 8px -2px rgba(0, 0, 0, 0.1), 0px 0px 4px 0px rgba(0, 0, 0, 0.08)',
    padding: '0.5rem 0.75rem',
    bg: switchColor(colorMode).surface,
    borderRadius: '16px',
    maxHeight: '50vh',
    overflowY: 'auto',
  },
  item: {
    color: switchColor(colorMode).primary,
    borderBottom: `1px solid ${switchColor(colorMode).surfaceVariant}`,
    padding: '0.75rem 1rem',
    justifyContent: 'center',
    alignItems: 'center',
    bg: switchColor(colorMode).surface,
    ...paragraph1(FONT_WEIGHT.MEDIUM),
    _disabled: {
      color: switchColor(colorMode).outlineVariant,
    },
    _first: {
      paddingTop: '0.6rem',
    },
    _last: {
      borderBottom: 'none',
      paddingBottom: '0.6rem',
    },

    '&.al-destructive': {
      color: switchColor(colorMode).tertiary,
    },

    '.al-context-menu__item-icon': {
      marginRight: '0.25rem',
      alignItems: 'center',
      display: 'flex',
    },
  },
}));

export const contextMenuTheme = defineMultiStyleConfig({
  baseStyle,
  variants,
});
