import { selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

import { FONT_WEIGHT, subline2 } from '../mixins/typography';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const baseStyle = definePartsStyle({
  field: {
    ...subline2(FONT_WEIGHT.SEMI_BOLD),
  },
});

export const selectTheme = defineMultiStyleConfig({ baseStyle });
