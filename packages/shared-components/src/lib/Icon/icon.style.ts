import { switchColor } from '@app/shared/ui/theme';
import styled, { css } from 'styled-components';

import { StyledIconPropTypes } from './icon.types';

export const StyledIcon = styled.span<StyledIconPropTypes>`
  &.material-symbols-rounded {
    ${({ $app, $colorMode }) =>
      $app &&
      css`
        padding: 0.5rem;
        border-radius: 8px;
        color: ${switchColor($colorMode).secondaryContainer};
        background-color: ${switchColor($colorMode).onPrimaryContainer};
      `}

    &.primary_color {
      color: ${({ $colorMode }) => switchColor($colorMode).primary};
    }
  }
`;
