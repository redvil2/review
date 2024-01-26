import { Theme, switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledAllLabels = styled.div<{
  $colorMode: ColorMode;
  $theme: Theme;
}>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};

  .al-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).primary};
  }

  .al-empty-state {
    width: 150px;
    height: auto;
  }

  .icon-add-label {
    color: ${({ $colorMode }) => switchColor($colorMode).primary};
    cursor: pointer;
    margin-left: 1rem;
  }

  .al-card {
    margin-bottom: 1rem;
  }
`;
