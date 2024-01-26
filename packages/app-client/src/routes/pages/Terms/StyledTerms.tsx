import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/color-mode/dist/color-mode-types';
import styled from 'styled-components';

export const StyledTerms = styled.div`
  background-color: ${({ $colorMode }: { $colorMode: ColorMode }) =>
    switchColor($colorMode).primaryContainer};

  .terms-updated {
    color: ${({ $colorMode }: { $colorMode: ColorMode }) =>
      switchColor($colorMode).secondary};
  }
`;
