import { switchColor } from '@app/shared/ui/theme';
import { Card as CCard } from '@chakra-ui/react';
import { ReactElement } from 'react';
import styled, { css } from 'styled-components';

import {
  StyledCardPropTypes,
  StyledNonGenericCardPropTypes,
} from './card.types';

export const StyledCard = styled(CCard)<StyledNonGenericCardPropTypes>`
  &.al-card {
    cursor: pointer;
    ${({ $first }) => $first && 'order: -1;'}
    ${({ $noPadding }) => $noPadding && '.chakra-card__body { padding: 0; }'}
    ${({ readOnly, $colorMode }) =>
      readOnly &&
      css`
        cursor: default;
        background-color: ${switchColor($colorMode).surfaceVariant};
        box-shadow: none;
        pointer-events: none;
        user-select: none;
      `}
  }
  ${({ $zIndex }) => $zIndex && `z-index: ${$zIndex};`}
` as <T>(props: StyledCardPropTypes<T>) => ReactElement;
