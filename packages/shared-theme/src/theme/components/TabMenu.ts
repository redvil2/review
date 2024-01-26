import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

import { switchColor } from '../../switch-color';
import { FONT_WEIGHT, paragraph1 } from '../mixins/typography';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

const baseStyle = definePartsStyle(({ colorMode }) => ({
  root: {
    width: '100%',
  },
  tablist: {
    justifyContent: { base: 'space-between', sm: 'flex-start' },
  },
  tab: {
    bg: switchColor(colorMode).surface2,
    color: switchColor(colorMode).secondary,
    padding: '0.625rem 1rem',
    borderRadius: '1rem',
    marginRight: '0.5rem',
    alignItems: 'center',
    ...paragraph1(FONT_WEIGHT.MEDIUM),
    _selected: {
      bg: switchColor(colorMode).plain,
      color: switchColor(colorMode).secondary,
    },
    _disabled: {
      bg: switchColor(colorMode).surface2,
      color: switchColor(colorMode).outline,
      opacity: 1,
    },
  },
}));

const smallStyle = definePartsStyle(({ colorMode }) => {
  return {
    tablist: {
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'space-between',
      border: 'transparent',
      paddingTop: '1rem',
      paddingBottom: '1rem',
      borderBottom: 'none',
      borderBottomColor: 'transparent',
    },
    tab: {
      cursor: 'pointer',
      textAlign: 'center',
      borderRadius: '6.5rem',
      height: '1.625rem',
      minWidth: '3.6875rem',
      lineHeight: '1.625rem',
      fontSize: '0.875rem',
      bg: switchColor(colorMode).surfaceVariant,
      color: switchColor(colorMode).secondary,
      _selected: {
        borderBottom: 'none',
        bg: switchColor(colorMode).outline,
        color: switchColor(colorMode).onPrimary,
      },
    },
  };
});

const variants = {
  small: smallStyle,
};

export const tabsTheme = defineMultiStyleConfig({ baseStyle, variants });
