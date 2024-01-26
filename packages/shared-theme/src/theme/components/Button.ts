import { StyleConfig, defineStyle } from '@chakra-ui/react';

import { switchColor } from '../../switch-color';
import { FONT_WEIGHT, paragraph1 } from '../mixins/typography';

const primary = defineStyle(({ colorMode }) => ({
  color: switchColor(colorMode).onPrimary,
  backgroundColor: switchColor(colorMode).primary,
  borderColor: switchColor(colorMode).primary,
  boxShadow:
    '0px 0px 4px rgba(0, 0, 0, 0.06), 0px 1px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)',
  _hover: {
    backgroundColor: switchColor(colorMode).primaryHover,
    borderColor: switchColor(colorMode).primaryHover,
    _disabled: {
      bg: switchColor(colorMode).outlineVariant,
    },
  },
  _active: {
    backgroundColor: switchColor(colorMode).primaryActive,
    borderColor: switchColor(colorMode).primaryActive,
  },
  _disabled: {
    bg: switchColor(colorMode).outlineVariant,
    color: switchColor(colorMode).outline,
    opacity: 1,
  },
}));

const secondary = defineStyle(({ colorMode }) => ({
  color: switchColor(colorMode).primary,
  borderColor: switchColor(colorMode).primary,
  borderWidth: '1px',
  _hover: {
    color: switchColor(colorMode).surfaceTint,
    borderColor: switchColor(colorMode).surfaceTint,
    bg: switchColor(colorMode).secondaryContainer,
    _disabled: {
      color: switchColor(colorMode).outlineVariant,
      borderColor: switchColor(colorMode).outlineVariant,
    },
  },
  _active: {
    color: switchColor(colorMode).primary,
    borderColor: switchColor(colorMode).primary,
    bg: switchColor(colorMode).inversePrimary,
  },
  _disabled: {
    borderColor: switchColor(colorMode).outlineVariant,
    color: switchColor(colorMode).outlineVariant,
    bg: switchColor(colorMode).onPrimary,
  },
}));

const link = defineStyle(({ colorMode }) => ({
  color: switchColor(colorMode).primary,
  borderRadius: 'none',
  _hover: {
    textDecoration: 'none',
    color: switchColor(colorMode).primaryHover,
    _disabled: {
      borderColor: 'transparent',
    },
  },
}));

const variants = {
  primary,
  secondary,
  link,
};

export const Button: Record<string, StyleConfig> = {
  Button: {
    baseStyle: {
      paddingY: '10px',
      ...paragraph1(FONT_WEIGHT.MEDIUM),
    },
    variants,
    sizes: {
      small: {
        lineHeight: '1.125rem',
        height: '2.25rem',
        borderRadius: '1.5rem',
        fontSize: '0.75rem',
        paddingX: '0.75rem',
        ' span': {
          lineHeight: '1.125rem',
          fontSize: '0.75rem',
        },
        '.material-symbols-rounded': {
          fontSize: '1rem',
        },
      },
      medium: {
        lineHeight: '1.5rem',
        height: '2.75rem',
        borderRadius: '1.5rem',
        fontSize: '1rem',
        paddingX: '1rem',
        ' span': {
          lineHeight: '1.5rem',
          fontSize: '1rem',
        },
        '.material-symbols-rounded': {
          fontSize: '1.25rem',
        },
      },
      large: {
        height: '3.5rem',
        borderRadius: '2.25rem',
        fontSize: '1.5rem',
        lineHeight: '2rem',
        paddingX: '1.5rem',
        ' span': {
          lineHeight: '2rem',
          fontSize: '1.5rem',
        },
        '.material-symbols-rounded': {
          fontSize: '1.5rem',
        },
      },
      xlarge: {
        height: '4rem',
        borderRadius: '2.25rem',
        fontSize: '1.875rem',
        lineHeight: '2.375rem',
        paddingX: '2rem',
        ' span': {
          lineHeight: '2.375rem',
          fontSize: '1.875rem',
        },
        '.material-symbols-rounded': {
          fontSize: '2rem',
        },
      },
    },
    defaultProps: {
      variant: 'primary',
      size: 'medium',
    },
  },
};
