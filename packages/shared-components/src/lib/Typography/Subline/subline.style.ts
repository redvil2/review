import { subline1, subline2 } from '@app/shared/ui/theme';
import styled, { css } from 'styled-components';

import { StyledSublinePropTypes } from './subline.types';

export const StyledSubline = styled.h1<StyledSublinePropTypes>`
  &.al-subline {
    ${({ size, fontWeight }) => css`
      ${size === 1 ? subline1(fontWeight) : subline2(fontWeight)}
    `}

    ${({ textAlign }) => css`
      text-align: ${textAlign};
    `};
  }
`;
