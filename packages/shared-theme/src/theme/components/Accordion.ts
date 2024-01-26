import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

import { switchColor } from '../../switch-color';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(accordionAnatomy.keys);

const baseStyle = definePartsStyle(({ colorMode }) => ({
  container: {
    borderRadius: '1rem',
    bg: switchColor(colorMode).surface,
    border: 'none',
    boxShadow:
      '0px 1px 2px 0px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 0px 4px 0px rgba(0, 0, 0, 0.06)',
  },
  button: {
    borderRadius: '1rem',
    textAlign: 'left',
    color: switchColor(colorMode).onPrimaryContainer,
    padding: '1rem',
    fontWeight: 'inherit',
    fontSize: 'inherit',
    _hover: {
      bg: switchColor(colorMode).surface,
    },
    '.al-accordion-icon': {
      color: switchColor(colorMode).primary,
      display: 'flex',
    },
  },
  icon: {
    color: switchColor(colorMode).primary,
  },
  panel: {
    padding: '0 0 0 1rem',
  },
}));

export const accordionTheme = defineMultiStyleConfig({ baseStyle });
