import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

import { FONT_WEIGHT, paragraph1, switchColor } from '@app/shared/ui/theme';

const baseStyle = defineStyle(({ colorMode }) => ({
  borderRadius: '0.4375rem',
  backgroundColor: switchColor(colorMode).surface3,
  color: switchColor(colorMode).onPrimaryContainer,
  padding: '0.75rem',
  boxShadow:
    '0px 2px 4px -2px rgba(0, 0, 0, 0.06), 0px 4px 8px -2px rgba(0, 0, 0, 0.10), 0px 0px 4px 0px rgba(0, 0, 0, 0.08)',
  ...paragraph1(FONT_WEIGHT.MEDIUM),
  marginTop: '-1rem',
}));

export const tooltipTheme = defineStyleConfig({ baseStyle });
