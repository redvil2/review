import { display1, display2 } from '@app/shared/ui/theme';
import styled, { css } from 'styled-components';

import { StyledDisplayPropTypes } from './display.types';

export const StyledDisplay = styled.h1<StyledDisplayPropTypes>`
  &.al-display {
    ${({ size, fontWeight }) => css`
      ${size === 1 ? display1(fontWeight) : display2(fontWeight)}
    `}

    ${({ textAlign }) => css`
      text-align: ${textAlign};
    `};
  }
`;
