import { FONT_WEIGHT, switchColor } from '@app/shared/ui/theme';
import { Box, HStack, Stack, useColorMode } from '@chakra-ui/react';
import { Fragment } from 'react';

import { Paragraph } from '../../Typography/Paragraph/Paragraph';

import { usePieChartColor } from './pieChart.colors';
import { Chart } from './pieChart.styles';
import { PieChartProps } from './pieChart.types';
import { PIE_CHART_VARIANTS } from './pieChart.variants';

export const PieChart: React.FC<PieChartProps> = ({ items, center }) => {
  items.forEach((item, index) => {
    if (!item.color) {
      item.color = [
        PIE_CHART_VARIANTS.AZURE,
        PIE_CHART_VARIANTS.MELROSE,
        PIE_CHART_VARIANTS.CARDINAL,
        PIE_CHART_VARIANTS.COSMOS,
        PIE_CHART_VARIANTS.STRATOS,
        PIE_CHART_VARIANTS.FOG,
        PIE_CHART_VARIANTS.COMET,
        PIE_CHART_VARIANTS.MIRAGE,
      ][index % 8];
    }
  });

  const { colorMode } = useColorMode();
  const colors = usePieChartColor(colorMode);
  if (items.length === 0) {
    items = [{ key: '', count: 0, color: PIE_CHART_VARIANTS.CLEAR }];
  }

  const isInitial = items.some(item => item.initial);

  const maxValue =
    items.map(obj => obj.count).reduce((a, b) => a + b, 0) || 100;
  let gradient = '';
  let lastPercentage = 0;
  let currentPercentage: number;
  if (items.length === 1) {
    gradient = colors[items[0].color];
  } else {
    gradient = 'conic-gradient(from 0deg ';
    items.forEach(item => {
      currentPercentage = (item.count * 100) / maxValue;
      const itemColor = isInitial
        ? switchColor(colorMode).surfaceVariant
        : colors[item.color];
      gradient += `,${itemColor} ${lastPercentage}%, ${itemColor} ${
        lastPercentage + currentPercentage
      }%`;
      lastPercentage += currentPercentage;
    });
    gradient += ')';
  }

  return (
    <HStack spacing="6" justify={center ? 'center' : 'left'} align="center">
      <Box>
        <Chart bg={gradient}></Chart>
      </Box>

      <Stack spacing="3">
        {items.map((item, index) => (
          <Fragment key={index}>
            <HStack as="div" gap="2" justify="left" align="center">
              <Box
                bg={
                  isInitial
                    ? switchColor(colorMode).surfaceVariant
                    : colors[item.color]
                }
                display="inline-block"
                minWidth="1rem"
                minHeight="1rem"
                width="1rem"
                height="1rem"
                borderRadius="100%"
              ></Box>
              <Box>
                <Paragraph
                  key={index}
                  size={2}
                  fontWeight={FONT_WEIGHT.REGULAR}
                >
                  {Math.round(isInitial ? 0 : (item.count * 100) / maxValue)}%{' '}
                  {item.key}
                </Paragraph>
              </Box>
            </HStack>
          </Fragment>
        ))}
      </Stack>
    </HStack>
  );
};
