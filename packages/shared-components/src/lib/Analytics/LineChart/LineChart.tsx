import { switchColor } from '@app/shared/ui/theme';
import { Box, Grid, GridItem, useColorMode } from '@chakra-ui/react';
import React from 'react';

import { LineChartProps } from './lineChart.types';
import { LineChartCanvas } from './LineChartCanvas';

export const LineChart: React.FC<LineChartProps> = ({ items, labels }) => {
  const { colorMode } = useColorMode();

  let maxValueY = 0;
  const stepsY = 4;

  Object.values(items).forEach(el => {
    const valueFromObject = el.count;
    maxValueY = Math.max(maxValueY, valueFromObject);
  });

  maxValueY =
    Math.ceil(maxValueY / 10 ** Math.floor(Math.log10(maxValueY))) *
      10 ** Math.floor(Math.log10(maxValueY)) +
    19 -
    ((Math.ceil(maxValueY / 10 ** Math.floor(Math.log10(maxValueY))) *
      10 ** Math.floor(Math.log10(maxValueY)) +
      19) %
      20);

  maxValueY = maxValueY || 0;

  const yVal: number[] = [];
  for (let foo = 1; foo < stepsY; foo++) {
    yVal.push((maxValueY / stepsY) * (stepsY - foo));
  }

  return (
    <Grid templateRows="auto 1fr" templateColumns="auto 1fr" gap={2}>
      <GridItem
        marginTop="-0.45rem"
        fontSize="0.5rem"
        color={switchColor(colorMode).outline}
        position="relative"
      >
        <Box>{maxValueY}</Box>
        {yVal.map((value, index) => {
          return (
            <Box
              key={index}
              position="absolute"
              right="0"
              top={((index + 1) / (yVal.length + 1)) * 100 + '%'}
            >
              {value}
            </Box>
          );
        })}
      </GridItem>
      <GridItem>
        <LineChartCanvas
          items={items}
          maxValueY={maxValueY}
          stepsX={labels.length - 1}
          stepsY={stepsY}
        />
      </GridItem>
      <GridItem></GridItem>
      <GridItem
        fontSize="0.5rem"
        display="flex"
        justifyContent="space-between"
        color={switchColor(colorMode).outline}
      >
        {labels.map((value, index) => {
          return <span key={index}>{value}</span>;
        })}
      </GridItem>
    </Grid>
  );
};
