import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledImprint = styled.div<{ $colorMode: ColorMode }>`
  & {
    a {
      color: ${({ $colorMode }) => switchColor($colorMode).primary};
      text-decoration: none;
    }
  }
`;
