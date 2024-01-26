import { FONT_WEIGHT } from '@app/shared/ui/theme';
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem as CAccordionItem,
  AccordionPanel as CAccordionPanel,
  Box,
  HStack,
  VStack,
} from '@chakra-ui/react';
import React, { FC } from 'react';

import { Paragraph } from '../Typography/Paragraph/Paragraph';
import { Subline } from '../Typography/Subline/Subline';

import { StyledAccordion } from './accordion.styles';
import {
  AccordionHeaderProps,
  AccordionProps,
  AccordionBodyItemProps,
} from './accordion.types';

export const Accordion: FC<AccordionProps> = ({ children, ...rest }) => {
  return (
    <StyledAccordion allowToggle className={'al-accordion'} {...rest}>
      {children}
    </StyledAccordion>
  );
};

export const AccordionItem = CAccordionItem;

export const AccordionItemHeader: FC<AccordionHeaderProps> = ({
  children,
  subtitle,
  accordionIcon,
  className,
  onClick,
}) => (
  <Box onClick={onClick}>
    <Subline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD} className={className}>
      <AccordionButton>
        <Box flex={1}>
          <div>{children}</div>
          {subtitle && (
            <Paragraph
              className={'al-accordion-subtitle'}
              size={2}
              fontWeight={FONT_WEIGHT.REGULAR}
            >
              {subtitle}
            </Paragraph>
          )}
        </Box>
        {(accordionIcon && (
          <span className={'al-accordion-icon'}>{accordionIcon}</span>
        )) || <AccordionIcon />}
      </AccordionButton>
    </Subline>
  </Box>
);

export const AccordionPanel = CAccordionPanel;

export const AccordionBodyItem: FC<AccordionBodyItemProps> = ({
  children,
  subline,
  iconRight,
  onClick,
  className,
  noPointer,
}) => (
  <Box
    p={4}
    className={`al-accordion-body-item ${className ? className : ''} ${
      noPointer ? 'al-no-pointer' : ''
    }`}
    onClick={onClick}
  >
    <HStack>
      <VStack flex={1} alignItems={'flex-start'} gap={0}>
        <Subline size={2} fontWeight={FONT_WEIGHT.SEMI_BOLD} textAlign={'left'}>
          {children}
        </Subline>
        <Box>{subline}</Box>
      </VStack>
      <Box as={'span'} className={'al-accordion-body-item-icon'}>
        {iconRight}
      </Box>
    </HStack>
  </Box>
);
