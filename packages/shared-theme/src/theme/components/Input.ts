import { anatomy } from '@chakra-ui/anatomy';
import { ThemeComponents } from '@chakra-ui/react';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/system';
import { runIfFn } from '@chakra-ui/utils';

import { switchColor } from '../../switch-color';
import { FONT_WEIGHT, subline2, paragraph2 } from '../mixins/typography';

export const a4InputAnatomy = anatomy('a4input').parts(
  'field',
  'addon',
  'container',
  'textElement',
  'label',
  'wrapper',
  'input',
  'errorMessage',
  'hint',
);

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(a4InputAnatomy.keys);

const addonStyle = defineStyle(props => ({
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',

  color: switchColor(props.colorMode).outlineVariant,
  ...subline2(FONT_WEIGHT.SEMI_BOLD),
}));

const containerBaseStyle = defineStyle(_ => ({
  width: '100%',
}));

const wrapperStyle = defineStyle(({ colorMode, disabled, isDisabled }) => ({
  width: '100%',
  borderRadius: '1rem',
  padding: '1rem',
  position: 'relative',

  '& > .a4-input__wrapper': {
    padding: '0',
    boxShadow: 'none',
  },

  '& > .a4-input__wrapper > .a4-input__edit-icon': {
    display: 'none',
  },

  ...(disabled || isDisabled
    ? {
        bg: switchColor(colorMode).surfaceVariant,
      }
    : {}),
}));

const baseStyle = definePartsStyle(props => ({
  field: {
    width: '100%',
    display: 'flex',
    position: 'relative',
    gap: '4',

    '& > div:first-of-type': {
      paddingLeft: '1rem',
    },

    '& > div:last-of-type': {
      paddingRight: '1rem',
    },

    '& .a4-input__wrapper': {
      boxShadow: 'none !important',
      paddingX: '0',
    },
  },

  addon: runIfFn(addonStyle, props),
  container: runIfFn(containerBaseStyle, props),
  textElement: {
    color: switchColor(props.colorMode).secondary,
    ...paragraph2(FONT_WEIGHT.REGULAR),
  },
  label: {},
  wrapper: runIfFn(wrapperStyle, props),
  input: {
    width: '100%',
    outline: 'none',
    bg: 'transparent',

    textOverflow: 'ellipsis',
    color: switchColor(props.colorMode).onPrimaryContainer,
    ...subline2(FONT_WEIGHT.SEMI_BOLD),
    letterSpacing: '0.9px',

    _placeholder: {
      ...subline2(FONT_WEIGHT.SEMI_BOLD),
      textOverflow: 'ellipsis',
      color: switchColor(props.colorMode).outlineVariant,
    },

    _disabled: {
      color: switchColor(props.colorMode).secondary,
      bg: 'transparent',
      '&::placeholder': {
        color: switchColor(props.colorMode).outline,
      },
    },
  },
  editIcon: {
    position: 'absolute',
    right: '4',
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
    color: switchColor(props.colorMode).primary,
  },
  errorMessage: {
    color: switchColor(props.colorMode).error,
  },
  hint: {},
}));

export const Input: ThemeComponents = {
  A4Input: defineMultiStyleConfig({
    baseStyle,
  }),
};
