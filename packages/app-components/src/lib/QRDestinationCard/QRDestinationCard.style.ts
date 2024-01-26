import { Box } from '@chakra-ui/react';
import styled from 'styled-components';

export const StyledQrDestination = styled(Box)<{
  readonly $isEmpty: boolean;
}>`
  .__left-icon {
    margin-top: 0.25rem;
    font-size: 2.5rem;
    color: ${({ theme, $isEmpty }) =>
      $isEmpty
        ? theme.colors.current.outlineVariant
        : theme.colors.current.onPrimaryContainer};
  }
`;
