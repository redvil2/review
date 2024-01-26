import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';

import { PieChartVariant } from './pieChart.variants';

export const usePieChartColor = (
  colorMode: ColorMode,
): Record<PieChartVariant, string> => {
  return {
    clear: switchColor(colorMode).surfaceVariant,
    azure: switchColor(colorMode).primary,
    melrose: switchColor(colorMode).inversePrimary,
    cardinal: switchColor(colorMode).tertiary,
    cosmos: switchColor(colorMode).tertiaryContainer,
    stratos: switchColor(colorMode).onPrimaryContainer,
    fog: switchColor(colorMode).primaryContainer,
    comet: switchColor(colorMode).secondary,
    mirage: switchColor(colorMode).onSecondaryContainer,
  };
};
