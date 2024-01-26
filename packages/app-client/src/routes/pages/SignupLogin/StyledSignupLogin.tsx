import { switchColor, FONT_WEIGHT } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/color-mode/dist/color-mode-types';
import styled from 'styled-components';

export const StyledSignupLogin = styled.div`
  &.signup-login {
    background-color: ${({ $colorMode }: { $colorMode: ColorMode }) =>
      switchColor($colorMode).primaryContainer};
  }

  .al-login-icon-phone {
    color: ${({ $colorMode }: { $colorMode: ColorMode }) =>
      switchColor($colorMode).primary};
    font-size: 2.3rem;
  }

  .link-terms {
    color: ${({ $colorMode }: { $colorMode: ColorMode }) =>
      switchColor($colorMode).primary};
    font-weight: ${FONT_WEIGHT.SEMI_BOLD};
    cursor: pointer;
  }
`;
