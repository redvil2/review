import { switchColor } from '@app/shared/ui/theme';
import { ColorMode, Flex } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledLinkUnlinkIcon = styled(Flex)<{ $colorMode: ColorMode }>`
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 2.5rem;

  &.linked {
    background: ${({ $colorMode }) => switchColor($colorMode).primaryContainer};
    color: ${({ $colorMode }) => switchColor($colorMode).surfaceTint};
  }

  &.unlinked {
    background: ${({ $colorMode }) => switchColor($colorMode).surfaceVariant};
    color: ${({ $colorMode }) => switchColor($colorMode).outline};
  }
`;
