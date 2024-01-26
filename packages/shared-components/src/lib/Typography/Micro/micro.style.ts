import { micro } from '@app/shared/ui/theme';
import styled, { css } from 'styled-components';

import { StyledMicroPropTypes } from './micro.types';

export const StyledMicro = styled.h1<StyledMicroPropTypes>`
  &.al-micro {
    ${({ fontWeight }) => css`
      ${micro(fontWeight)}
    `}
  }
`;
