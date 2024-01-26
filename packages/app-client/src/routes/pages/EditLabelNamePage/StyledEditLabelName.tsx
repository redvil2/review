import { switchColor } from '@app/shared/ui/theme';
import { ColorMode } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledEditLabelName = styled.div<{ $colorMode: ColorMode }>`
  background: ${({ $colorMode }) => switchColor($colorMode).surface2};

  .al-headline {
    color: ${({ $colorMode }) => switchColor($colorMode).onPrimaryContainer};
    text-align: center;
    margin-top: 3rem;
    margin-bottom: 2rem;
  }
`;
