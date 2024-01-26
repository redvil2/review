import { switchColor } from '@app/shared/ui/theme';
import { Button as CButton } from '@chakra-ui/react';
import styled, { css } from 'styled-components';

import { StyledButtonPropTypes } from './button.types';

export const StyledButton = styled(CButton)<StyledButtonPropTypes>`
  .al-button__text {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &[data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
  }


  ${({ $children, rightIcon, leftIcon }) =>
    !$children &&
    (rightIcon || leftIcon) &&
    css`
      &.al-button {
        padding: 0.75rem;
      }

      span.chakra-button__icon {
        margin: 0;
      }
    `}

  &.al-button {
    ${({ $error, variant, $colorMode }) => {
      if ($error && variant === 'secondary') {
        return css`
          border-color: ${switchColor($colorMode).tertiary};
          color: ${switchColor($colorMode).tertiary};

          &:hover {
            border-color: ${switchColor($colorMode).tertiary};
            color: ${switchColor($colorMode).tertiary};
            background-color: ${switchColor($colorMode).tertiaryContainer};
          }
        `;
      } else if ($error) {
        return css`
          border-color: ${switchColor($colorMode).tertiary};
          background-color: ${switchColor($colorMode).tertiary};

          &:hover {
            border-color: ${switchColor($colorMode).onTertiaryContainer};
            background-color: ${switchColor($colorMode).onTertiaryContainer};
          }
        `;
      }
    }};
`;
