import { FONT_WEIGHT, switchColor } from '@app/shared/ui/theme';
import { Box, HStack, Stack, useColorMode } from '@chakra-ui/react';
import React from 'react';

import { Micro } from '../../Typography/Micro/Micro';
import { Paragraph } from '../../Typography/Paragraph/Paragraph';

import { BarDiagramProps } from './barDiagram.types';

export const BarDiagram: React.FC<BarDiagramProps> = ({ items, center }) => {
  items = items.filter(item => item.key !== null);
  const maxValue =
    items.map(obj => obj.count).reduce((a, b) => a + b, 0) || 100;
  const { colorMode } = useColorMode();

  return (
    <HStack spacing="6" justify={center ? 'center' : 'left'} align="center">
      <Stack as="ul" spacing="3">
        {items.map((item, index) => (
          <Paragraph
            key={index}
            size={2}
            fontWeight={FONT_WEIGHT.MEDIUM}
            className={'al-analytics-card-title'}
          >
            {item.key}
          </Paragraph>
        ))}
      </Stack>

      <Stack as="ul" spacing="3">
        {items.map((item, index) => (
          <HStack key={index}>
            <Box
              bg={
                item.count === 0
                  ? switchColor(colorMode).surfaceVariant
                  : switchColor(colorMode).primary
              }
              opacity={
                item.count === 0
                  ? 1
                  : index === 0
                    ? 1
                    : (65 - 20 * (index - 1)) / 100
              }
              w={1 + Math.round((item.count / maxValue) * 10) + 'rem'}
              h="1rem"
              transition={'width ' + 0.125 * (index + 1) + 's ease-in-out'}
              borderRadius="0.5rem"
            ></Box>
            <Micro
              fontWeight={FONT_WEIGHT.REGULAR}
              className={'al-analytics-card-section-title'}
            >
              {Math.round((item.count * 100) / maxValue) + '%'}
            </Micro>
          </HStack>
        ))}
      </Stack>
    </HStack>
  );
};
