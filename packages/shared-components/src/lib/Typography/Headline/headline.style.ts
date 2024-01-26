import {
  headline1,
  headline2,
  headline3,
  headline4,
} from '@app/shared/ui/theme';
import styled, { css } from 'styled-components';

import { StyledHeadlinePropTypes } from './headline.types';

export const StyledHeadline = styled.h1<StyledHeadlinePropTypes>`
  &.al-headline {
    color: ${({ theme }) => theme.colors.current.onPrimaryContainer};
  ${({ size, fontWeight }) => {
    switch (size) {
      case 1:
        return css`
          ${headline1(fontWeight)}
        `;
      case 2:
        return css`
          ${headline2(fontWeight)}
        `;
      case 3:
        return css`
          ${headline3(fontWeight)}
        `;
      case 4:
        return css`
          ${headline4(fontWeight)}
        `;
      default:
        return css`
          ${headline1(fontWeight)}
        `;
    }
  }}

  ${({ textAlign }) => css`
    text-align: ${textAlign};
  `};
`;
